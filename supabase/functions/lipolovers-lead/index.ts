import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { addContactTags, upsertContact } from "../_shared/ghl-api.ts";
import { leadSchema, sha256, tagsFor } from "../_shared/lipolovers.ts";

const ESSENCIAL_CHECKOUT_URL = "https://mpago.la/16SyCN8";


const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) return json({ error: "invalid_fields", fields: parsed.error.flatten().fieldErrors }, 400);

  const eventId = crypto.randomUUID();
  const claimToken = `${crypto.randomUUID()}${crypto.randomUUID()}`.replaceAll("-", "");
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });
  const { data: lead, error } = await admin.from("lipolovers_leads").insert({
    event_id: eventId,
    claim_token_hash: await sha256(claimToken),
    full_name: parsed.data.full_name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    plan: parsed.data.plan,
    flavor: parsed.data.flavor,
    origin: "site-lipolovers",
  }).select("id").single();
  if (error || !lead) return json({ error: "save_failed" }, 500);

  let ghlStatus = "sent";
  let ghlError: string | null = null;
  try {
    const names = parsed.data.full_name.split(/\s+/);
    const contact = await upsertContact({
      first_name: names[0],
      last_name: names.slice(1).join(" ") || null,
      email: parsed.data.email,
      phone: parsed.data.phone,
      source: "site-lipolovers",
    });
    if (contact.contact_id) await addContactTags(contact.contact_id, tagsFor(parsed.data.plan, parsed.data.flavor));
    else throw new Error("contact_id_missing");
  } catch (caught) {
    ghlStatus = "failed";
    ghlError = caught instanceof Error ? caught.message.slice(0, 300) : "ghl_failed";
  }
  await admin.from("lipolovers_leads").update({ ghl_status: ghlStatus, ghl_error: ghlError }).eq("id", lead.id);

  const checkout = new URL(ESSENCIAL_CHECKOUT_URL);
  checkout.searchParams.set("utm_source", "site-lipolovers");
  checkout.searchParams.set("utm_medium", "assinatura");
  checkout.searchParams.set("utm_campaign", `lipolovers-${parsed.data.plan}`);
  checkout.searchParams.set("utm_content", `sabor-${parsed.data.flavor}`);
  checkout.searchParams.set("utm_term", `eid_${eventId}`);
  checkout.searchParams.set("lipolovers_token", claimToken);

  return json({ ok: true, event_id: eventId, claim_token: claimToken, checkout_url: checkout.toString() });
});