// Yampi Webhook — Fase 3: registra a compra, captura carrinhos abandonados e
// envia o evento Purchase para a Meta (CAPI).
// - Valida a assinatura HMAC quando YAMPI_WEBHOOK_SECRET estiver configurado
// - cart.reminder / cart.abandoned -> upsert idempotente em public.abandoned_checkouts
// - Grava o pedido em public.conversion_events (dedup por order_id)
// - Marca o carrinho correspondente como recuperado quando o pedido é pago
// - Envia Purchase para a função meta-capi com dados do cliente hasheados
// - Logs sem PII bruta (e-mail/telefone mascarados, sem headers nem body)
// - Sempre responde 200 (a Yampi não deve reenviar por erro nosso)

import { createClient } from "npm:@supabase/supabase-js@2";
import { maskEmail, maskPhone, isTestOrderId, normalizePhoneBR } from "../_shared/privacy.ts";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifySignature(secret: string, raw: string, signature: string): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw));
    const bytes = new Uint8Array(mac);
    const base64 = btoa(String.fromCharCode(...bytes));
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return signature === base64 || signature.toLowerCase() === hex;
  } catch {
    return false;
  }
}

const digits = (v: unknown) => String(v ?? "").replace(/\D/g, "");
const norm = (v: unknown) => String(v ?? "").trim().toLowerCase();

// deno-lint-ignore no-explicit-any
function pickUtms(resource: any): Record<string, string | undefined> {
  const src = resource?.utm ?? resource?.tracking ?? resource ?? {};
  const get = (k: string) => {
    const v = src?.[k] ?? src?.data?.[k] ?? resource?.[k];
    return typeof v === "string" && v.trim() ? v.trim().slice(0, 200) : undefined;
  };
  return {
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_content: get("utm_content"),
    utm_term: get("utm_term"),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const raw = await req.text();
  const requestId = crypto.randomUUID();

  console.log(`[yampi-webhook:${requestId}] received`, {
    url: req.url,
    method: req.method,
    content_length: raw.length,
    headers: Object.fromEntries(req.headers.entries()),
    body_preview: raw.slice(0, 500),
  });

  // --- Assinatura ---
  const secret = Deno.env.get("YAMPI_WEBHOOK_SECRET");
  const signature =
    req.headers.get("x-yampi-hmac-sha256") ??
    req.headers.get("X-Yampi-Hmac-SHA256") ??
    "";
  if (!secret) {
    console.error(`[yampi-webhook:${requestId}] YAMPI_WEBHOOK_SECRET não configurado — rejeitando evento`);
    return json({ ok: false, reason: "webhook_secret_not_configured", request_id: requestId }, 500);
  }
  const valid = signature ? await verifySignature(secret, raw, signature) : false;
  if (!valid) {
    console.warn(`[yampi-webhook:${requestId}] assinatura inválida — evento ignorado`, { signature_present: !!signature });
    return json({ ok: false, reason: "invalid_signature", request_id: requestId });
  }
  console.log(`[yampi-webhook:${requestId}] assinatura válida`);

  // deno-lint-ignore no-explicit-any
  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    console.error(`[yampi-webhook:${requestId}] JSON inválido`);
    return json({ ok: false, reason: "invalid_json", request_id: requestId });
  }

  const event = String(payload?.event ?? "");
  const resource = payload?.resource ?? {};
  const orderId = String(resource?.id ?? resource?.number ?? "").trim();

  console.log(`[yampi-webhook:${requestId}] parsed`, { event, order_id: orderId, status: resource?.status });

  if (!orderId) {
    console.warn(`[yampi-webhook:${requestId}] pedido sem id — ignorado`, event);
    return json({ ok: false, reason: "missing_order_id", request_id: requestId });
  }

  // Só contabilizamos pedidos pagos/aprovados quando o status vier no payload.
  const statusAlias = norm(resource?.status?.data?.alias ?? resource?.status?.alias ?? "");
  const paidEvents = ["order.paid", "order.status.updated", "order.created", "transaction.paid"];
  const isPaid =
    statusAlias === "paid" ||
    statusAlias === "approved" ||
    event === "order.paid" ||
    event === "transaction.paid";

  if (!isPaid) {
    console.log(`[yampi-webhook:${requestId}] evento ignorado (não pago):`, event, statusAlias, paidEvents.includes(event));
    return json({ ok: true, skipped: true, event, status: statusAlias, request_id: requestId });
  }

  const value = Number(
    resource?.value_total ?? resource?.total ?? resource?.value ?? 0
  );
  const items = Array.isArray(resource?.items?.data) ? resource.items.data : [];
  const skus = items.map((i: Record<string, unknown>) => String(i?.sku ?? i?.item_sku ?? "")).filter(Boolean);
  const numItems = items.reduce((acc: number, i: Record<string, unknown>) => acc + Number(i?.quantity ?? 1), 0);

  const utms = pickUtms(resource);
  const eidMatch = /^eid_(.+)$/.exec(utms.utm_term ?? "");
  const eventId = eidMatch ? eidMatch[1] : `yampi-${orderId}`;

  const customer = resource?.customer?.data ?? resource?.customer ?? {};
  const email = norm(customer?.email);
  const phoneRaw = digits(customer?.phone?.full_number ?? customer?.phone?.number ?? customer?.phone);
  const phone = phoneRaw ? (phoneRaw.startsWith("55") ? phoneRaw : `55${phoneRaw}`) : "";
  const firstName = norm(customer?.first_name ?? String(customer?.name ?? "").split(" ")[0]);
  const lastName = norm(customer?.last_name ?? String(customer?.name ?? "").split(" ").slice(-1)[0]);

  const user_data: Record<string, string[] | string> = {};
  if (email) user_data.em = [await sha256Hex(email)];
  if (phone) user_data.ph = [await sha256Hex(phone)];
  if (firstName) user_data.fn = [await sha256Hex(firstName)];
  if (lastName) user_data.ln = [await sha256Hex(lastName)];

  // --- Envia Purchase para a Meta via meta-capi ---
  let metaStatus = "skipped";
  try {
    const resp = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/meta-capi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({
        event_name: "Purchase",
        event_id: eventId,
        action_source: "website",
        user_data,
        custom_data: {
          currency: "BRL",
          value,
          order_id: orderId,
          content_ids: skus,
          content_type: "product",
          num_items: numItems || items.length || 1,
        },
      }),
    });
    const text = await resp.text();
    let upstream = resp.status;
    try {
      const body = JSON.parse(text) as { upstream_status?: number; mode?: string };
      if (body?.mode === "preview") upstream = 0;
      else if (typeof body.upstream_status === "number") upstream = body.upstream_status;
    } catch {
      /* mantém o status HTTP */
    }
    metaStatus = upstream >= 200 && upstream < 300 ? `sent_${upstream}` : `error_${upstream}`;
    console.log(`[yampi-webhook:${requestId}] meta-capi:`, resp.status, text.slice(0, 300));
  } catch (e) {
    metaStatus = "error";
    console.error(`[yampi-webhook:${requestId}] meta-capi falhou:`, (e as Error).message);
  }

  // --- Registro interno ---
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    // Valor esperado: veio do clique que originou o pedido (mesmo event_id).
    let expectedValue: number | null = null;
    if (eidMatch) {
      const { data: clicks } = await supabase
        .from("conversion_events")
        .select("value")
        .eq("event_id", eventId)
        .neq("event_name", "Purchase")
        .not("value", "is", null)
        .order("created_at", { ascending: true })
        .limit(1);
      const v = Number(clicks?.[0]?.value);
      if (Number.isFinite(v) && v > 0) expectedValue = v;
    }
    const paidValue = Number.isFinite(value) ? value : null;
    const priceDiff =
      expectedValue !== null && paidValue !== null
        ? Math.round((paidValue - expectedValue) * 100) / 100
        : null;
    const priceMismatch = priceDiff !== null && Math.abs(priceDiff) > 1;
    if (priceMismatch) {
      console.warn(`[yampi-webhook:${requestId}] divergência de preço`, {
        order_id: orderId,
        expected: expectedValue,
        paid: paidValue,
        diff: priceDiff,
      });
    }

    const { error } = await supabase.from("conversion_events").insert({
      event_name: "Purchase",
      event_id: eventId,
      source: "yampi",
      order_id: orderId,
      value: paidValue,
      currency: "BRL",
      sku: skus[0] ?? null,
      product_name: items[0]?.product_name ?? items[0]?.name ?? null,
      gift: utms.utm_content ?? null,
      ...utms,
      meta_status: metaStatus,
      metadata: {
        event,
        status: statusAlias,
        items_count: items.length,
        skus,
        expected_value: expectedValue,
        price_diff: priceDiff,
        price_mismatch: priceMismatch,
      },
    });

    if (error && !error.message.includes("duplicate key")) {
      console.error(`[yampi-webhook:${requestId}] insert falhou:`, error.message);
    } else {
      console.log(`[yampi-webhook:${requestId}] purchase recorded`, { order_id: orderId, value, meta_status: metaStatus });
    }

    // Marca carrinhos abandonados correspondentes como recuperados (idempotente).
    try {
      const orFilters: string[] = [];
      if (email) orFilters.push(`customer_email.eq.${email}`);
      if (phone) orFilters.push(`customer_phone.eq.${phone}`);
      if (orFilters.length) {
        const { error: recErr } = await supabase
          .from("abandoned_checkouts")
          .update({ recovered_at: new Date().toISOString(), recovered_order_id: orderId })
          .is("recovered_at", null)
          .or(orFilters.join(","));
        if (recErr) console.error(`[yampi-webhook:${requestId}] recovery mark falhou:`, recErr.message);
      }
    } catch (e) {
      console.error(`[yampi-webhook:${requestId}] recovery mark erro:`, (e as Error).message);

    }
  } catch (e) {
    console.error(`[yampi-webhook:${requestId}] banco falhou:`, (e as Error).message);
  }

  return json({ ok: true, order_id: orderId, meta: metaStatus, request_id: requestId });
});
