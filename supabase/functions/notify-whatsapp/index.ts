import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";

const BodySchema = z.object({
  type: z.enum(["afiliada", "parceiro"]),
  fullName: z.string().optional(),
  phone: z.string().min(1),
  email: z.string().email().optional(),
  followersRange: z.string().optional(),
  state: z.string().optional(),
  knowsProduct: z.boolean().optional(),
  companyName: z.string().optional(),
  cnpj: z.string().optional(),
  businessType: z.string().optional(),
  city: z.string().optional(),
  volumeNotes: z.string().optional(),
});

const AFFILIATE_PHONE = Deno.env.get("WHATSAPP_NOTIFY_PHONE") ?? "5571996150401";

const buildMessage = (data: z.infer<typeof BodySchema>) => {
  const typeLabel = data.type === "afiliada" ? "Afiliada" : "Parceiro comercial";
  let text = `Novo cadastro de ${typeLabel} LipoVitta\n\n`;

  if (data.fullName) text += `Nome: ${data.fullName}\n`;
  if (data.companyName) text += `Empresa: ${data.companyName}\n`;
  if (data.cnpj) text += `CNPJ: ${data.cnpj}\n`;
  if (data.businessType) text += `Tipo: ${data.businessType}\n`;
  if (data.phone) text += `WhatsApp: ${data.phone}\n`;
  if (data.email) text += `Email: ${data.email}\n`;
  if (data.followersRange) text += `Seguidores: ${data.followersRange}\n`;
  if (data.city || data.state) {
    text += `Local: ${data.city || ""}${data.city && data.state ? " - " : ""}${data.state || ""}\n`;
  }
  if (data.knowsProduct !== undefined) text += `Já conhece: ${data.knowsProduct ? "Sim" : "Não"}\n`;
  if (data.volumeNotes) text += `Observações: ${data.volumeNotes}\n`;

  text += `\nRecebido via site lipovitta.site`;
  return text;
};

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

  const apiKey = Deno.env.get("CALLMEBOT_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ ok: false, error: "whatsapp_api_not_configured" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const text = buildMessage(parsed.data);
  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", AFFILIATE_PHONE);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", apiKey);

  try {
    const resp = await fetch(url.toString(), { method: "GET" });
    const body = await resp.text();
    console.log("[notify-whatsapp]", resp.status, body.slice(0, 300));
    return new Response(
      JSON.stringify({ ok: resp.status >= 200 && resp.status < 300, upstream_status: resp.status, upstream: body.slice(0, 500) }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    const msg = String(e);
    console.error("[notify-whatsapp:error]", msg);
    return new Response(
      JSON.stringify({ ok: false, error: msg }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
