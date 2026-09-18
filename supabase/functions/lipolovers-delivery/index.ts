import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { deliverySchema, sha256 } from "../_shared/lipolovers.ts";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const parsed = deliverySchema.safeParse(body);
  if (!parsed.success) return json({ error: "invalid_fields", fields: parsed.error.flatten().fieldErrors }, 400);

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });
  const { data: lead, error } = await admin.from("lipolovers_leads")
    .select("id, payment_status, plan, flavor")
    .eq("claim_token_hash", await sha256(parsed.data.token))
    .maybeSingle();
  if (error) return json({ error: "lookup_failed" }, 500);
  if (!lead) return json({ error: "invalid_confirmation" }, 404);
  if (lead.payment_status !== "approved") return json({ ok: true, payment_status: lead.payment_status }, 202);
  if (parsed.data.action === "status") return json({ ok: true, payment_status: "approved", plan: lead.plan, flavor: lead.flavor });

  const data = parsed.data;
  const { error: saveError } = await admin.from("lipolovers_delivery_details").upsert({
    lead_id: lead.id,
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    postal_code: data.postal_code,
    street_address: data.street_address,
    address_number: data.address_number,
    complement: data.complement || null,
    neighborhood: data.neighborhood,
    city: data.city,
    state: data.state,
  }, { onConflict: "lead_id" });
  if (saveError) return json({ error: "save_failed" }, 500);
  return json({ ok: true, payment_status: "approved", saved: true });
});