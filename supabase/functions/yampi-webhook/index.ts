// Yampi webhook — FASE 1 (modo captura)
// Apenas loga headers + body cru e responde 200. Sem HMAC, sem gravar nada.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ──────────────────────────────────────────────────────────────────────────
// FASE 2 (preparado, NÃO ativo) — descomentar quando souber o header certo:
//
// const SIGNATURE_HEADER = "x-yampi-hmac-sha256";
//
// async function verifySignature(raw: string, signature: string | null): Promise<boolean> {
//   const secret = Deno.env.get("YAMPI_WEBHOOK_SECRET");
//   if (!secret || !signature) return false;
//   const key = await crypto.subtle.importKey(
//     "raw",
//     new TextEncoder().encode(secret),
//     { name: "HMAC", hash: "SHA-256" },
//     false,
//     ["sign"],
//   );
//   const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw));
//   const expected = btoa(String.fromCharCode(...new Uint8Array(sig)));
//   return expected === signature;
// }
// ──────────────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const headersObj: Record<string, string> = {};
  req.headers.forEach((v, k) => { headersObj[k] = v; });

  console.log("=== YAMPI WEBHOOK (capture mode) ===");
  console.log("method:", req.method);
  console.log("url:", req.url);
  console.log("headers:", JSON.stringify(headersObj, null, 2));

  let raw = "";
  try {
    raw = await req.text();
  } catch (e) {
    console.log("erro lendo body:", e);
  }
  console.log("body (raw):", raw);

  try {
    const json = JSON.parse(raw);
    const items = json?.resource?.items?.data;
    if (Array.isArray(items)) {
      console.log(`items.data length: ${items.length}`);
      items.forEach((item: any, i: number) => {
        const product_id = item?.product_id ?? "(sem product_id)";
        const item_sku = item?.item_sku ?? null;
        const quantity = item?.quantity ?? null;
        const gift = item?.gift ?? null;
        console.log(`item[${i}]:`, JSON.stringify({ product_id, item_sku, quantity, gift }));
      });
    } else {
      console.log("resource.items.data não é array ou não existe");
    }
  } catch (e) {
    console.log("body não é JSON válido:", (e as Error).message);
  }

  return new Response(
    JSON.stringify({ ok: true, mode: "capture" }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
