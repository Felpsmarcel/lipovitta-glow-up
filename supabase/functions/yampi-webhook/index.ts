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
import { maskEmail, maskPhone, isTestOrderId, normalizePhoneBR, buyerHash } from "../_shared/privacy.ts";


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

function serviceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );
}

const str = (v: unknown, max = 500): string | null => {
  const s = String(v ?? "").trim();
  return s ? s.slice(0, max) : null;
};

const num = (v: unknown): number => {
  const n = Number(String(v ?? "").toString().replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
};

/** SKU e nome de um item, no payload oficial atual e nos formatos legados. */
// deno-lint-ignore no-explicit-any
function itemSku(i: any): string | null {
  return str(i?.item_sku ?? i?.sku?.data?.sku ?? i?.sku_code ?? (typeof i?.sku === "string" ? i.sku : null), 120);
}
// deno-lint-ignore no-explicit-any
function itemName(i: any): string | null {
  return str(i?.sku?.data?.title ?? i?.product_name ?? i?.name ?? i?.title, 200);
}
// deno-lint-ignore no-explicit-any
function itemList(resource: any): any[] {
  if (Array.isArray(resource?.items?.data)) return resource.items.data;
  if (Array.isArray(resource?.items)) return resource.items;
  return [];
}

/** Total do recurso: totalizers.total (oficial) com fallback para campos legados. */
// deno-lint-ignore no-explicit-any
function resourceTotal(resource: any): number {
  const candidates = [
    resource?.totalizers?.total,
    resource?.totalizers?.data?.total,
    resource?.value_total,
    resource?.total,
    resource?.value,
    resource?.subtotal,
  ];
  for (const c of candidates) {
    const n = num(c);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return NaN;
}

/** Normaliza o payload de carrinho da Yampi (cart.reminder). */
// deno-lint-ignore no-explicit-any
function extractCart(resource: any, event: string) {
  const customer = resource?.customer?.data ?? resource?.customer ?? {};
  // deno-lint-ignore no-explicit-any
  const items = itemList(resource).map((i: any) => ({
    sku: itemSku(i),
    name: itemName(i),
    quantity: Number(i?.quantity ?? 1),
    price: num(i?.price ?? i?.unit_price ?? i?.total) || null,
  }));
  const total = resourceTotal(resource);
  const phone = normalizePhoneBR(
    customer?.phone?.full_number ?? customer?.phone?.number ?? customer?.phone
  );
  const abandonedRaw = str(
    resource?.abandoned_at ?? resource?.updated_at?.date ?? resource?.updated_at ??
      resource?.created_at?.date ?? resource?.created_at,
    40
  );
  const abandonedParsed = abandonedRaw ? new Date(abandonedRaw) : null;
  const abandonedAt =
    abandonedParsed && !Number.isNaN(abandonedParsed.getTime())
      ? abandonedParsed.toISOString()
      : new Date().toISOString();

  // Payload oficial: simulate_url / unauth_simulate_url para recuperar o carrinho
  // e spreadsheet.data.purchase_url para recompra.
  const recoveryUrl = str(
    resource?.simulate_url ??
      resource?.unauth_simulate_url ??
      resource?.recovery_url ??
      resource?.cart_url ??
      resource?.url ??
      resource?.checkout_url
  );
  const reorderUrl = str(
    resource?.spreadsheet?.data?.purchase_url ??
      resource?.spreadsheet?.purchase_url ??
      resource?.reorder_url ??
      resource?.reorder?.url ??
      resource?.unauth_simulate_url
  );

  return {
    cart_token: str(
      resource?.token ?? resource?.cart_token ?? resource?.id ?? resource?.uuid,
      200
    ),
    customer_name: str(
      customer?.name ??
        [customer?.first_name, customer?.last_name].filter(Boolean).join(" "),
      200
    ),
    customer_email: str(customer?.email, 255)?.toLowerCase() ?? null,
    customer_phone: phone || null,
    items,
    total: Number.isFinite(total) && total > 0 ? total : null,
    currency: "BRL",
    recovery_url: recoveryUrl,
    reorder_url: reorderUrl,
    ...pickUtms(resource),
    raw: { event },
    abandoned_at: abandonedAt,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Diagnóstico persistente das entregas — sem PII bruta.
 * `ref` só guarda identificadores de teste (TEST...) ou um hash curto.
 */
async function safeRef(value: unknown): Promise<string | null> {
  const v = String(value ?? "").trim();
  if (!v) return null;
  if (/^test/i.test(v)) return v.slice(0, 60);
  return `h_${(await sha256Hex(v)).slice(0, 16)}`;
}

async function logDelivery(entry: {
  request_id: string;
  event?: string | null;
  outcome: string;
  reason?: string | null;
  ref?: string | null;
  is_test?: boolean;
  signature_present?: boolean;
  content_length?: number;
}) {
  try {
    const supabase = serviceClient();
    await supabase.from("yampi_webhook_deliveries").insert({
      request_id: entry.request_id,
      event: entry.event ? String(entry.event).slice(0, 80) : null,
      outcome: entry.outcome,
      reason: entry.reason ?? null,
      ref: entry.ref ?? null,
      is_test: entry.is_test ?? false,
      signature_present: entry.signature_present ?? false,
      content_length: entry.content_length ?? null,
    });
  } catch (e) {
    console.error(`[yampi-webhook:${entry.request_id}] delivery log falhou:`, (e as Error).message);
  }
}



Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const raw = await req.text();
  const requestId = crypto.randomUUID();

  // Log sem PII: nada de headers completos nem corpo bruto.
  console.log(`[yampi-webhook:${requestId}] received`, {
    method: req.method,
    content_length: raw.length,
    has_signature: Boolean(
      req.headers.get("x-yampi-hmac-sha256") ?? req.headers.get("X-Yampi-Hmac-SHA256")
    ),
  });


  // --- Assinatura ---
  const secret = Deno.env.get("YAMPI_WEBHOOK_SECRET");
  const signature =
    req.headers.get("x-yampi-hmac-sha256") ??
    req.headers.get("X-Yampi-Hmac-SHA256") ??
    "";
  if (!secret) {
    console.error(`[yampi-webhook:${requestId}] YAMPI_WEBHOOK_SECRET não configurado — rejeitando evento`);
    await logDelivery({
      request_id: requestId,
      outcome: "rejected",
      reason: "webhook_secret_not_configured",
      signature_present: !!signature,
      content_length: raw.length,
    });
    return json({ ok: false, reason: "webhook_secret_not_configured", request_id: requestId }, 500);
  }
  const valid = signature ? await verifySignature(secret, raw, signature) : false;
  if (!valid) {
    console.warn(`[yampi-webhook:${requestId}] assinatura inválida — evento ignorado`, { signature_present: !!signature });
    await logDelivery({
      request_id: requestId,
      outcome: "rejected",
      reason: signature ? "invalid_signature" : "missing_signature",
      signature_present: !!signature,
      content_length: raw.length,
    });
    return json({ ok: false, reason: "invalid_signature", request_id: requestId });
  }
  console.log(`[yampi-webhook:${requestId}] assinatura válida`);

  // deno-lint-ignore no-explicit-any
  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    console.error(`[yampi-webhook:${requestId}] JSON inválido`);
    await logDelivery({
      request_id: requestId,
      outcome: "rejected",
      reason: "invalid_json",
      signature_present: true,
      content_length: raw.length,
    });
    return json({ ok: false, reason: "invalid_json", request_id: requestId });
  }

  const event = String(payload?.event ?? "");
  const resource = payload?.resource ?? {};
  const orderId = String(resource?.id ?? resource?.number ?? "").trim();
  const isTest = isTestOrderId(orderId) || /^test/i.test(String(resource?.token ?? ""));

  console.log(`[yampi-webhook:${requestId}] parsed`, {
    event,
    order_id: orderId || null,
    status: norm(resource?.status?.data?.alias ?? resource?.status?.alias ?? "") || null,
  });

  // --- Lembrete de carrinho (cart.reminder) ---
  if (event.startsWith("cart.")) {
    const cart = extractCart(resource, event);
    const cartIsTest = /^test/i.test(String(cart.cart_token ?? ""));
    if (!cart.cart_token) {
      console.warn(`[yampi-webhook:${requestId}] carrinho sem token — ignorado`, { event });
      await logDelivery({
        request_id: requestId,
        event,
        outcome: "rejected",
        reason: "missing_cart_token",
        signature_present: true,
        content_length: raw.length,
      });
      return json({ ok: false, reason: "missing_cart_token", request_id: requestId });
    }
    try {
      const supabase = serviceClient();
      const { error } = await supabase
        .from("abandoned_checkouts")
        .upsert(cart, { onConflict: "cart_token" });
      if (error) {
        console.error(`[yampi-webhook:${requestId}] upsert carrinho falhou:`, error.message);
        await logDelivery({
          request_id: requestId,
          event,
          outcome: "failed",
          reason: "cart_upsert_failed",
          ref: await safeRef(cart.cart_token),
          is_test: cartIsTest,
          signature_present: true,
          content_length: raw.length,
        });
        return json({ ok: false, reason: "cart_upsert_failed", request_id: requestId });
      }
      console.log(`[yampi-webhook:${requestId}] cart recorded`, {
        event,
        cart_token: cart.cart_token,
        total: cart.total,
        email: maskEmail(cart.customer_email),
        phone: maskPhone(cart.customer_phone),
      });
      await logDelivery({
        request_id: requestId,
        event,
        outcome: "accepted",
        reason: "cart_recorded",
        ref: await safeRef(cart.cart_token),
        is_test: cartIsTest,
        signature_present: true,
        content_length: raw.length,
      });
    } catch (e) {
      console.error(`[yampi-webhook:${requestId}] carrinho erro:`, (e as Error).message);
      await logDelivery({
        request_id: requestId,
        event,
        outcome: "failed",
        reason: "cart_exception",
        ref: await safeRef(cart.cart_token),
        is_test: cartIsTest,
        signature_present: true,
        content_length: raw.length,
      });
    }
    return json({ ok: true, event, cart_token: cart.cart_token, request_id: requestId });
  }

  if (!orderId) {
    console.warn(`[yampi-webhook:${requestId}] pedido sem id — ignorado`, event);
    await logDelivery({
      request_id: requestId,
      event,
      outcome: "rejected",
      reason: "missing_order_id",
      signature_present: true,
      content_length: raw.length,
    });
    return json({ ok: false, reason: "missing_order_id", request_id: requestId });
  }


  // Eventos de pedido observados: order.paid, order.status.updated (+ legados).
  const statusAlias = norm(resource?.status?.data?.alias ?? resource?.status?.alias ?? "");
  const orderEvents = ["order.paid", "order.status.updated", "order.created", "transaction.paid"];
  const isPaid =
    statusAlias === "paid" ||
    statusAlias === "approved" ||
    event === "order.paid" ||
    event === "transaction.paid";

  if (!isPaid) {
    console.log(`[yampi-webhook:${requestId}] evento ignorado (não pago):`, event, statusAlias, orderEvents.includes(event));
    await logDelivery({
      request_id: requestId,
      event,
      outcome: "skipped",
      reason: statusAlias ? `status_${statusAlias}` : "not_paid",
      ref: await safeRef(orderId),
      is_test: isTest,
      signature_present: true,
      content_length: raw.length,
    });
    return json({ ok: true, skipped: true, event, status: statusAlias, request_id: requestId });
  }

  const value = resourceTotal(resource);
  const items = itemList(resource);

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
      is_test: isTestOrderId(orderId),

      order_id: orderId,
      buyer_hash: await buyerHash(email, phone),
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
