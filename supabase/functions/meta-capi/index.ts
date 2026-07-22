// Meta Conversions API — SKELETON ONLY.
// Currently returns the payload it would send, without hitting Graph API.
// To enable: set META_PIXEL_ID + META_CAPI_ACCESS_TOKEN secrets, then flip
// the ENABLE_SEND flag below.

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";

const ENABLE_SEND = true;

const BodySchema = z.object({
  event_name: z.string().min(1).max(120),
  event_id: z.string().min(1).max(200),
  event_source_url: z.string().url().optional(),
  action_source: z.enum(["website", "email", "app", "phone_call", "chat", "physical_store", "system_generated", "other"]).optional(),
  custom_data: z.record(z.unknown()).optional(),
  user_data: z
    .object({
      em: z.array(z.string()).optional(), // hashed emails
      ph: z.array(z.string()).optional(), // hashed phones
      fbp: z.string().optional(),
      fbc: z.string().optional(),
      client_user_agent: z.string().optional(),
      client_ip_address: z.string().optional(),
    })
    .optional(),
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
    return new Response(
      JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const PIXEL_ID = Deno.env.get("META_PIXEL_ID");
  const STAPE_TOKEN = Deno.env.get("STAPE_CAPI_TOKEN");
  const STAPE_HOST = Deno.env.get("STAPE_CAPI_HOST") ?? "capig.stape.pm";
  const TEST_EVENT_CODE = Deno.env.get("META_CAPI_TEST_EVENT_CODE") ?? undefined;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ua = req.headers.get("user-agent") ?? undefined;

  const capiPayload = {
    data: [
      {
        event_name: parsed.data.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: parsed.data.event_id,
        event_source_url: parsed.data.event_source_url,
        action_source: parsed.data.action_source ?? "website",
        user_data: {
          ...(parsed.data.user_data ?? {}),
          client_ip_address: parsed.data.user_data?.client_ip_address ?? ip,
          client_user_agent: parsed.data.user_data?.client_user_agent ?? ua,
        },
        custom_data: parsed.data.custom_data ?? {},
      },
    ],
    ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {}),
  };

  if (!ENABLE_SEND || !PIXEL_ID || !STAPE_TOKEN) {
    console.log("[meta-capi:preview]", JSON.stringify({
      configured: !!(PIXEL_ID && STAPE_TOKEN),
      enabled: ENABLE_SEND,
      payload: capiPayload,
    }));
    return new Response(
      JSON.stringify({ mode: "preview", would_send: capiPayload }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Stape CAPI Gateway — forwards to Meta with same payload shape as Graph /events.
  const url = `https://${STAPE_HOST}/${PIXEL_ID}/events`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${STAPE_TOKEN}`,
    },
    body: JSON.stringify(capiPayload),
  });
  const text = await resp.text();
  console.log("[meta-capi:send]", resp.status, text.slice(0, 500));
  return new Response(text, {
    status: resp.status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
