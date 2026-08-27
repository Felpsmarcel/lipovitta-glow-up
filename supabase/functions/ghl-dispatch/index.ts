// Entrega os eventos pendentes da fila public.ghl_outbox no Inbound Webhook do GHL.
// - Acionada pelo yampi-webhook/track-conversion logo após o enfileiramento
// - Também pode ser chamada por um administrador (painel /admin/webhooks ou MCP)
// - Retenta com espera crescente até 5 tentativas; depois marca como `failed`
// - Sem PII nos logs

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const MAX_ATTEMPTS = 5;
const BATCH = 25;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

function serviceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

/** Aceita o service role (chamadas internas) ou um usuário com papel admin. */
async function authorize(req: Request): Promise<boolean> {
  const header = req.headers.get("Authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token) return false;
  if (token === Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) return true;
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
  return Math.min(60, 2 ** Math.max(0, attempt - 1)); // 1, 2, 4, 8, 16 min
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  if (!(await authorize(req))) return json({ error: "unauthorized" }, 401);

  const webhookUrl = Deno.env.get("GHL_WEBHOOK_URL")?.trim();
  const supabase = serviceClient();

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }
  const retryFailed = body?.retry_failed === true;
  const limit = Math.min(Number(body?.limit ?? BATCH) || BATCH, 100);

  if (retryFailed) {
    await supabase
      .from("ghl_outbox")
      .update({ status: "pending", attempts: 0, next_attempt_at: new Date().toISOString() })
      .eq("status", "failed");
  }

  let queue = supabase
    .from("ghl_outbox")
    .select("id,event_type,payload,attempts")
    .in("status", ["pending", "error"])
    .lte("next_attempt_at", new Date().toISOString())
    .order("created_at", { ascending: true })
    .limit(limit);
  if (body?.include_tests !== true) queue = queue.eq("is_test", false);
  const { data: rows, error } = await queue;


  if (error) return json({ ok: false, error: error.message }, 200);

  const pending = rows ?? [];
  if (!webhookUrl) {
    return json({
      ok: true,
      mode: "simulation",
      reason: "GHL_WEBHOOK_URL não configurada",
      pending: pending.length,
    });
  }

  let sent = 0;
  let failed = 0;

  for (const row of pending) {
    const attempts = Number(row.attempts ?? 0) + 1;
    try {
      const resp = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row.payload),
      });
      const text = (await resp.text()).slice(0, 300);
      if (resp.ok) {
        sent++;
        await supabase
          .from("ghl_outbox")
          .update({ status: "sent", attempts, sent_at: new Date().toISOString(), last_error: null })
          .eq("id", row.id);
      } else {
        failed++;
        const definitive = attempts >= MAX_ATTEMPTS;
        await supabase
          .from("ghl_outbox")
          .update({
            status: definitive ? "failed" : "error",
            attempts,
            last_error: `HTTP ${resp.status}: ${text}`,
            next_attempt_at: new Date(Date.now() + backoffMinutes(attempts) * 60000).toISOString(),
          })
          .eq("id", row.id);
      }
    } catch (e) {
      failed++;
      const definitive = attempts >= MAX_ATTEMPTS;
      await supabase
        .from("ghl_outbox")
        .update({
          status: definitive ? "failed" : "error",
          attempts,
          last_error: (e as Error).message.slice(0, 300),
          next_attempt_at: new Date(Date.now() + backoffMinutes(attempts) * 60000).toISOString(),
        })
        .eq("id", row.id);
    }
  }

  console.log("[ghl-dispatch] concluído", { processed: pending.length, sent, failed });
  return json({ ok: true, processed: pending.length, sent, failed });
});
