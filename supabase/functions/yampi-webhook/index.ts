// Yampi Webhook — Fase 1: MODO CAPTURA PURO
// - Loga headers, body cru e itens parseados
// - NÃO valida assinatura
// - NÃO grava em banco
// - Sempre responde 200

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("=== [yampi-webhook] CAPTURE MODE ===");
  console.log("method:", req.method);
  console.log("url:", req.url);

  // Headers
  const headersObj: Record<string, string> = {};
  for (const [k, v] of req.headers.entries()) headersObj[k] = v;
  console.log("headers:", JSON.stringify(headersObj, null, 2));

  // Body cru
  let rawBody = "";
  try {
    rawBody = await req.text();
    console.log("raw body:", rawBody);
  } catch (e) {
    console.log("error reading body:", (e as Error).message);
  }

  // Tenta parsear JSON
  if (rawBody) {
    try {
      const json = JSON.parse(rawBody);
      console.log("parsed json:", JSON.stringify(json, null, 2));

      const items = json?.resource?.items?.data;
      if (Array.isArray(items)) {
        console.log(`items count: ${items.length}`);
        items.forEach((item: any, idx: number) => {
          console.log(`item[${idx}]:`, JSON.stringify({
            product_id: item?.product_id,
            item_sku: item?.item_sku,
            quantity: item?.quantity,
            gift: item?.gift,
          }));
        });
      } else {
        console.log("resource.items.data não é um array (ou ausente)");
      }
    } catch (e) {
      console.log("JSON parse error:", (e as Error).message);
    }
  }

  console.log("=== [yampi-webhook] END ===");

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
