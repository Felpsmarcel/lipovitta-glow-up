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
      fn: z.array(z.string()).optional(), // hashed first names
      ln: z.array(z.string()).optional(), // hashed last names
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

  // Stape CAPI Gateway — the token is a base64 blob: { i: gatewayId, h: host, k: key }
  let host = STAPE_HOST;
  let gatewayId = "";
  let token = STAPE_TOKEN;
  try {
    const decoded = JSON.parse(atob(STAPE_TOKEN)) as { i?: string; h?: string; k?: string };
    if (decoded?.h) host = decoded.h;
    if (decoded?.i) gatewayId = decoded.i;
    if (decoded?.k) token = decoded.k;
  } catch {
    // plain token — keep defaults
  }

  const qs = new URLSearchParams({ access_token: token });
  if (TEST_EVENT_CODE) qs.set("test_event_code", TEST_EVENT_CODE);

  const OVERRIDE_URL = Deno.env.get("STAPE_CAPI_URL");
  const GRAPH_TOKEN = Deno.env.get("META_CAPI_ACCESS_TOKEN");

  const candidates = OVERRIDE_URL
    ? [`${OVERRIDE_URL.replace(/\/$/, "")}/v21.0/${PIXEL_ID}/events?${qs}`]
    : gatewayId
    ? [
        // Formato oficial do CAPI Gateway da Stape: <id>.<host>
        `https://${gatewayId}.${host}/v21.0/${PIXEL_ID}/events?${qs}`,
        `https://${host}/${gatewayId}/v21.0/${PIXEL_ID}/events?${qs}`,
        `https://${host}/${gatewayId}/${PIXEL_ID}/events?${qs}`,
        `https://${host}/v21.0/${PIXEL_ID}/events?${qs}`,
      ]

    : [
        `https://${host}/v21.0/${PIXEL_ID}/events?${qs}`,
        `https://${host}/${PIXEL_ID}/events?${qs}`,
      ];

  // Fallback direto na Graph API da Meta quando houver token próprio.
  if (GRAPH_TOKEN) {
    const graphQs = new URLSearchParams({ access_token: GRAPH_TOKEN });
    if (TEST_EVENT_CODE) graphQs.set("test_event_code", TEST_EVENT_CODE);
    candidates.push(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events?${graphQs}`);
  }

  let lastStatus = 0;
  let lastText = "";
  for (const url of candidates) {
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(capiPayload),
      });
      lastStatus = resp.status;
      lastText = await resp.text();
      console.log("[meta-capi:send]", resp.status, url.split("?")[0], lastText.slice(0, 300));
      if (resp.status !== 404) break;
    } catch (e) {
      lastText = String(e);
      console.log("[meta-capi:error]", lastText.slice(0, 300));
    }
  }

  // Tracking must never break the client flow — always answer 200.
  return new Response(
    JSON.stringify({ ok: lastStatus >= 200 && lastStatus < 300, upstream_status: lastStatus, upstream: lastText.slice(0, 500) }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});

