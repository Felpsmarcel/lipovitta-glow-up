// Entrega e sincroniza eventos na fila public.ghl_outbox com o Inbound Webhook do GHL.
// A URL não configurada mantém o sistema em simulação: nada é enviado para fora.

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const MAX_ATTEMPTS = 5;
const DEFAULT_BATCH = 25;
const ALLOWED_TYPES = ["purchase", "order_status", "abandoned_cart", "initiate_checkout"] as const;
type GhlEventType = (typeof ALLOWED_TYPES)[number];
type Row = Record<string, unknown>;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

function requiredEnv(name: string): string {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`${name} não configurada`);
  return value;
}

function serviceClient() {
  return createClient(requiredEnv("SUPABASE_URL"), requiredEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false },
  });
}

/** Aceita o service role (chamadas internas) ou um usuário com papel admin. */
async function authorize(req: Request): Promise<boolean> {
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  if (!token) return false;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  if (serviceKey && token === serviceKey) return true;
  try {
    const admin = serviceClient();
    const { data, error } = await admin.auth.getUser(token);
    if (error || !data.user) return false;
    const { data: roles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .limit(1);
    return Boolean(roles?.length);
  } catch {
    return false;
  }
}

function backoffMinutes(attempt: number): number {
  return Math.min(60, 2 ** Math.max(0, attempt - 1));
}

function asString(value: unknown): string | null {
  const text = String(value ?? "").trim();
  return text || null;
}

function asNumber(value: unknown): number | null {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function eventTypes(value: unknown): GhlEventType[] {
  if (!Array.isArray(value)) return [...ALLOWED_TYPES];
  return value.filter((item): item is GhlEventType =>
    typeof item === "string" && ALLOWED_TYPES.includes(item as GhlEventType),
  );
}

function testEvent(id: unknown): boolean {
  return /^test/i.test(String(id ?? ""));
}

async function collectHistoricalEvents(
  supabase: ReturnType<typeof serviceClient>,
  options: { days: number; types: GhlEventType[]; includeTests: boolean; limit: number },
): Promise<Array<{ event_type: GhlEventType; dedupe_key: string; payload: Row; is_test: boolean }>> {
  const since = new Date(Date.now() - options.days * 86400000).toISOString();
  const candidates: Array<{ event_type: GhlEventType; dedupe_key: string; payload: Row; is_test: boolean }> = [];
  const wants = (type: GhlEventType) => options.types.includes(type);

  if (wants("purchase") || wants("order_status")) {
    const { data } = await supabase
      .from("yampi_orders")
      .select("*")
      .gte("last_seen_at", since)
      .order("last_seen_at", { ascending: true })
      .limit(options.limit);
    for (const row of (data ?? []) as Row[]) {
      const orderId = asString(row.order_id);
      if (!orderId) continue;
      const isTest = Boolean(row.is_test) || testEvent(orderId);
      if (!options.includeTests && isTest) continue;
      const paid = ["paid", "approved"].includes(String(row.status ?? "").toLowerCase());
      const type: GhlEventType = paid && wants("purchase") ? "purchase" : "order_status";
      if (!options.types.includes(type)) continue;
      candidates.push({
        event_type: type,
        dedupe_key: `historical:${String(row.event ?? "status")}:${orderId}`,
        is_test: isTest,
        payload: {
          event_type: type,
          order_id: orderId,
          order_number: row.order_number ?? null,
          status: row.status ?? row.event ?? null,
          value: row.value_total ?? null,
          currency: "BRL",
          items: row.items ?? [],
          utm_source: row.utm_source ?? null,
          utm_medium: row.utm_medium ?? null,
          utm_campaign: row.utm_campaign ?? null,
          utm_content: row.utm_content ?? null,
          utm_term: row.utm_term ?? null,
          occurred_at: row.last_seen_at ?? null,
          is_test: isTest,
          source: "yampi",
        },
      });
    }
  }

  if (wants("abandoned_cart")) {
    const { data } = await supabase
      .from("abandoned_checkouts")
      .select("*")
      .gte("abandoned_at", since)
      .order("abandoned_at", { ascending: true })
      .limit(options.limit);
    for (const row of (data ?? []) as Row[]) {
      const token = asString(row.cart_token);
      if (!token) continue;
      const isTest = testEvent(token);
      if (!options.includeTests && isTest) continue;
      const name = String(row.customer_name ?? "").trim().split(/\s+/);
      candidates.push({
        event_type: "abandoned_cart",
        dedupe_key: `historical:cart:${token}`,
        is_test: isTest,
        payload: {
          event_type: "abandoned_cart",
          order_id: token,
          status: "abandoned",
          value: row.total ?? null,
          currency: row.currency ?? "BRL",
          items: row.items ?? [],
          first_name: name[0] || null,
          last_name: name.slice(1).join(" ") || null,
          email: row.customer_email ?? null,
          phone: row.customer_phone ?? null,
          utm_source: row.utm_source ?? null,
          utm_medium: row.utm_medium ?? null,
          utm_campaign: row.utm_campaign ?? null,
          utm_content: row.utm_content ?? null,
          utm_term: row.utm_term ?? null,
          recovery_url: row.recovery_url ?? null,
          occurred_at: row.abandoned_at ?? null,
          is_test: isTest,
          source: "yampi",
        },
      });
    }
  }

  if (wants("initiate_checkout")) {
    const { data } = await supabase
      .from("conversion_events")
      .select("*")
      .eq("event_name", "InitiateCheckout")
      .gte("created_at", since)
      .order("created_at", { ascending: true })
      .limit(options.limit);
    for (const row of (data ?? []) as Row[]) {
      const eventId = asString(row.event_id) ?? asString(row.id);
      if (!eventId) continue;
      const isTest = Boolean(row.is_test) || testEvent(eventId);
      if (!options.includeTests && isTest) continue;
      candidates.push({
        event_type: "initiate_checkout",
        dedupe_key: `historical:checkout:${eventId}`,
        is_test: isTest,
        payload: {
          event_type: "initiate_checkout",
          status: "initiated",
          value: row.value ?? null,
          currency: row.currency ?? "BRL",
          items: row.sku ? [{ sku: row.sku, name: row.product_name, quantity: 1, price: row.value }] : [],
          utm_source: row.utm_source ?? null,
          utm_medium: row.utm_medium ?? null,
          utm_campaign: row.utm_campaign ?? null,
          utm_content: row.utm_content ?? null,
          utm_term: row.utm_term ?? null,
          occurred_at: row.created_at ?? null,
          is_test: isTest,
          source: "website",
        },
      });
    }
  }

  return candidates.slice(0, options.limit);
}

async function dispatchPending(
  supabase: ReturnType<typeof serviceClient>,
  options: { includeTests: boolean; limit: number },
) {
  const webhookUrl = Deno.env.get("GHL_WEBHOOK_URL")?.trim();
  let queue = supabase
    .from("ghl_outbox")
    .select("id,event_type,payload,attempts")
    .in("status", ["pending", "error"])
    .lte("next_attempt_at", new Date().toISOString())
    .order("created_at", { ascending: true })
    .limit(options.limit);
  if (!options.includeTests) queue = queue.eq("is_test", false);
  const { data: rows, error } = await queue;
  if (error) return { ok: false, error: error.message };
  const pending = rows ?? [];
  if (!webhookUrl) return { ok: true, mode: "simulation", pending: pending.length };

  let sent = 0;
  let failed = 0;
  for (const row of pending) {
    const attempts = Number(row.attempts ?? 0) + 1;
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row.payload),
      });
      const responseText = (await response.text()).slice(0, 300);
      const definitive = attempts >= MAX_ATTEMPTS;
      if (response.ok) {
        sent++;
        await supabase.from("ghl_outbox").update({
          status: "sent",
          attempts,
          sent_at: new Date().toISOString(),
          last_error: null,
        }).eq("id", row.id);
      } else {
        failed++;
        await supabase.from("ghl_outbox").update({
          status: definitive ? "failed" : "error",
          attempts,
          last_error: `HTTP ${response.status}: ${responseText}`,
          next_attempt_at: new Date(Date.now() + backoffMinutes(attempts) * 60000).toISOString(),
        }).eq("id", row.id);
      }
    } catch (error) {
      failed++;
      await supabase.from("ghl_outbox").update({
        status: attempts >= MAX_ATTEMPTS ? "failed" : "error",
        attempts,
        last_error: error instanceof Error ? error.message.slice(0, 300) : "Falha desconhecida",
        next_attempt_at: new Date(Date.now() + backoffMinutes(attempts) * 60000).toISOString(),
      }).eq("id", row.id);
    }
  }
  console.log("[ghl-dispatch] concluído", { processed: pending.length, sent, failed });
  return { ok: true, processed: pending.length, sent, failed };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (!(await authorize(req))) return json({ error: "unauthorized" }, 401);

  let body: Row = {};
  try {
    const parsed = await req.json();
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) body = parsed as Row;
  } catch {
    body = {};
  }

  const supabase = serviceClient();
  if (body.action === "sync") {
    const days = Math.min(365, Math.max(1, Number(body.days ?? 30) || 30));
    const limit = Math.min(100, Math.max(1, Number(body.limit ?? 50) || 50));
    const types = eventTypes(body.event_types);
    const includeTests = body.include_tests === true;
    const simulate = body.simulate !== false;
    const candidates = await collectHistoricalEvents(supabase, { days, types, includeTests, limit });
    if (simulate) {
      return json({ ok: true, mode: "simulation", candidates: candidates.length, by_event: candidates.reduce<Record<string, number>>((acc, item) => {
        acc[item.event_type] = (acc[item.event_type] ?? 0) + 1;
        return acc;
      }, {}) });
    }
    let queued = 0;
    for (const candidate of candidates) {
      const { error } = await supabase.from("ghl_outbox").upsert({
        event_type: candidate.event_type,
        dedupe_key: candidate.dedupe_key.slice(0, 200),
        payload: candidate.payload,
        status: "pending",
        attempts: 0,
        next_attempt_at: new Date().toISOString(),
        is_test: candidate.is_test,
      }, { onConflict: "event_type,dedupe_key", ignoreDuplicates: true });
      if (!error) queued++;
    }
    const dispatch = await dispatchPending(supabase, { includeTests, limit });
    return json({ ok: true, mode: "queued", candidates: candidates.length, queued, dispatch });
  }

  if (body.retry_failed === true) {
    await supabase.from("ghl_outbox").update({
      status: "pending",
      attempts: 0,
      next_attempt_at: new Date().toISOString(),
    }).eq("status", "failed");
  }
  return json(await dispatchPending(supabase, {
    includeTests: body.include_tests === true,
    limit: Math.min(100, Math.max(1, Number(body.limit ?? DEFAULT_BATCH) || DEFAULT_BATCH)),
  }));
});
