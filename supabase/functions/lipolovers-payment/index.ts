import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { sha256 } from "../_shared/lipolovers.ts";
import { digitsOnly, paymentWebhookSchema } from "./schema.ts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

function safeEqual(a: string, b: string): boolean {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  if (ea.length !== eb.length) return false;
  let diff = 0;
  for (let i = 0; i < ea.length; i++) diff |= ea[i] ^ eb[i];
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const secret = Deno.env.get("LIPOLOVERS_WEBHOOK_SECRET");
  if (!secret) {
    console.error("[lipolovers-payment] LIPOLOVERS_WEBHOOK_SECRET ausente");
    return json({ error: "not_configured" }, 503);
  }
  const provided = req.headers.get("x-lipolovers-secret") ?? "";
  if (!safeEqual(provided, secret)) return json({ error: "unauthorized" }, 401);

  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const parsed = paymentWebhookSchema.safeParse(body);
  if (!parsed.success) return json({ error: "invalid_fields", fields: parsed.error.flatten().fieldErrors }, 400);
  const { event, token, email, phone, payment_id, paid_at } = parsed.data;

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });

  type Lead = { id: string; payment_status: string; paid_at: string | null; phone: string };
  let lead: Lead | null = null;

  if (token) {
    const { data } = await admin.from("lipolovers_leads")
      .select("id, payment_status, paid_at, phone")
      .eq("claim_token_hash", await sha256(token))
      .order("created_at", { ascending: false })
      .limit(1);
    lead = data?.[0] ?? null;
  }
  if (!lead && email) {
    const { data } = await admin.from("lipolovers_leads")
      .select("id, payment_status, paid_at, phone")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1);
    lead = data?.[0] ?? null;
  }
  if (!lead && phone) {
    const target = digitsOnly(phone);
    const { data } = await admin.from("lipolovers_leads")
      .select("id, payment_status, paid_at, phone")
      .order("created_at", { ascending: false })
      .limit(300);
    lead = (data ?? []).find((row) => {
      const candidate = digitsOnly(row.phone ?? "");
      return candidate.length >= 8 && (candidate.endsWith(target) || target.endsWith(candidate));
    }) ?? null;
  }

  if (!lead) {
    console.warn(`[lipolovers-payment] assinante não encontrada (event=${event}, payment_id=${payment_id ?? "-"})`);
    return json({ error: "lead_not_found" }, 404);
  }

  if (event === "payment.approved") {
    if (lead.payment_status === "approved") {
      return json({ ok: true, lead_id: lead.id, payment_status: "approved", duplicate: true });
    }
    const { error } = await admin.from("lipolovers_leads").update({
      payment_status: "approved",
      paid_at: lead.paid_at ?? paid_at ?? new Date().toISOString(),
      paid_order_id: payment_id ?? null,
    }).eq("id", lead.id);
    if (error) {
      console.error(`[lipolovers-payment] update falhou lead=${lead.id}: ${error.message}`);
      return json({ error: "update_failed" }, 500);
    }
    console.log(`[lipolovers-payment] aprovado lead=${lead.id} payment_id=${payment_id ?? "-"}`);
    return json({ ok: true, lead_id: lead.id, payment_status: "approved" });
  }

  // payment.refunded | subscription.cancelled -> volta para pendente
  const { error } = await admin.from("lipolovers_leads").update({
    payment_status: "pending",
    paid_at: null,
    paid_order_id: null,
  }).eq("id", lead.id);
  if (error) {
    console.error(`[lipolovers-payment] reversão falhou lead=${lead.id}: ${error.message}`);
    return json({ error: "update_failed" }, 500);
  }
  console.log(`[lipolovers-payment] revertido lead=${lead.id} event=${event}`);
  return json({ ok: true, lead_id: lead.id, payment_status: "pending" });
});

