// Registra eventos de conversão do site (cliques em CTA, leads) na tabela
// public.conversion_events. Nunca quebra o fluxo do usuário: sempre 200.

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3.23.8";
import { enqueueGhl } from "../_shared/ghl.ts";





const BodySchema = z.object({
  event_name: z.string().min(1).max(60),
  event_id: z.string().max(200).optional(),
  cta_location: z.string().max(120).optional(),
  product_name: z.string().max(200).optional(),
  sku: z.string().max(120).optional(),
  value: z.number().nonnegative().max(1_000_000).optional(),
  gift: z.string().max(120).optional(),
  page_url: z.string().max(500).optional(),
  utm_source: z.string().max(200).optional(),
  utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(),
  utm_content: z.string().max(200).optional(),
  utm_term: z.string().max(200).optional(),
});

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { error } = await supabase.from("conversion_events").insert({
      ...parsed.data,
      source: "web",
      currency: "BRL",
    });

    if (error) {
      console.error("[track-conversion] insert failed:", error.message);
      return new Response(JSON.stringify({ ok: false, error: error.message }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Checkout iniciado no site também vai para o GHL (nunca bloqueia a resposta).
    const data = parsed.data;
    if (data.event_name === "InitiateCheckout" && data.event_id) {
      await enqueueGhl(
        {
          event_type: "initiate_checkout",
          status: "initiated",
          value: data.value ?? null,
          items: data.sku
            ? [{ sku: data.sku, name: data.product_name ?? null, quantity: 1, price: data.value ?? null }]
            : [],
          utm_source: data.utm_source ?? null,
          utm_medium: data.utm_medium ?? null,
          utm_campaign: data.utm_campaign ?? null,
          utm_content: data.utm_content ?? null,
          utm_term: data.utm_term ?? null,
          is_test: /^test/i.test(data.event_id),
        },
        `checkout:${data.event_id}`,
        { logPrefix: "[track-conversion]" },
      );
    }
  } catch (e) {
    console.error("[track-conversion] error:", (e as Error).message);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
