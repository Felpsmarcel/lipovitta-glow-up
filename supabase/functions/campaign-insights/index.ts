import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";
import { aggregateSales, type OrderRow, type PaymentRow } from "./aggregate.ts";

const MODEL = "openai/gpt-6-astra";
const GATEWAY = "https://ai.gateway.lovable.dev/v1/responses";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const Body = z.object({
  campaign_name: z.string().trim().max(200).optional().nullable(),
  period_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  period_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  source_type: z.enum(["csv", "text"]),
  raw_input: z.string().min(10).max(200_000),
});

const item = (props: Record<string, unknown>) => ({
  type: "object",
  additionalProperties: false,
  required: Object.keys(props),
  properties: props,
});
const str = { type: "string" };
const SCHEMA = item({
  summary: str,
  trends: { type: "array", items: item({ title: str, detail: str }) },
  optimizations: {
    type: "array",
    items: item({ priority: { type: "string", enum: ["alta", "média", "baixa"] }, action: str, reason: str, expected_impact: str }),
  },
  alerts: { type: "array", items: item({ title: str, detail: str }) },
  data_gaps: { type: "array", items: str },
});

const INSTRUCTIONS = `Você é analista de mídia paga da LipoVitta (suplementos, e-commerce Yampi, Brasil, BRL).
Recebe (1) dados de desempenho de campanha enviados pela equipe de marketing e (2) vendas REAIS pagas no mesmo período (pedidos com pagamento confirmado, sem testes nem cancelados), por dia e por UTM.
Tarefas: resumir o desempenho, identificar tendências, sugerir otimizações acionáveis e específicas, e apontar alertas (ex.: gasto alto sem vendas pagas, conversões reportadas pelo anúncio muito diferentes das vendas reais, CPA/ROAS calculado com receita real).
Regras: escreva em português do Brasil, tom direto. Use somente números presentes nos dados; se algo faltar, liste em data_gaps em vez de inventar. Não prometa resultados garantidos nem resultados médicos/de saúde. Não sugira alterar preços sem base nos dados. Ordene otimizações por prioridade.`;

async function streamOutput(apiKey: string, input: unknown[], signal: AbortSignal) {
  const res = await fetch(GATEWAY, {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "fetch" },
    body: JSON.stringify({
      model: MODEL,
      input,
      stream: true,
      store: false,
      reasoning: { effort: "medium", summary: "auto" },
      include: ["reasoning.encrypted_content"],
      text: { format: { type: "json_schema", name: "campaign_insights", strict: true, schema: SCHEMA } },
    }),
  });
  if (!res.ok || !res.body) {
    let message = `Falha na IA (${res.status}).`;
    try {
      const b = await res.json();
      message = b?.message ?? b?.error?.message ?? message;
    } catch { /* ignore */ }
    return { status: res.status, error: message };
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  let text = "";
  let streamError: string | null = null;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i).trim();
      buf = buf.slice(i + 1);
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const ev = JSON.parse(data);
        if (ev.type === "response.output_text.delta") text += ev.delta ?? "";
        else if (ev.type === "error" || ev.type === "response.failed")
          streamError = ev.error?.message ?? ev.response?.error?.message ?? "Erro na IA.";
        else if (ev.type === "response.refusal.delta") streamError = "A IA recusou o pedido.";
      } catch { /* partial */ }
    }
  }
  if (streamError) return { status: 502, error: streamError };
  if (!text.trim()) return { status: 502, error: "A IA não retornou resposta." };
  return { status: 200, text };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return json({ error: "IA não configurada." }, 500);

  const auth = req.headers.get("Authorization") ?? "";
  if (!/^Bearer\s+.+/i.test(auth)) return json({ error: "Não autenticado." }, 401);
  const userClient = createClient(url, anon, {
    global: { headers: { Authorization: auth } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: u, error: ue } = await userClient.auth.getUser();
  if (ue || !u?.user) return json({ error: "Não autenticado." }, 401);
  const { data: isAdmin } = await userClient.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
  if (!isAdmin) return json({ error: "Acesso restrito a administradores." }, 403);

  let body: z.infer<typeof Body>;
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Dados inválidos.", details: parsed.error.flatten().fieldErrors }, 400);
    body = parsed.data;
  } catch {
    return json({ error: "JSON inválido." }, 400);
  }
  if (body.period_from > body.period_to) return json({ error: "Período inválido." }, 400);

  const admin = createClient(url, service, { auth: { persistSession: false } });
  const from = `${body.period_from}T00:00:00-03:00`;
  const to = new Date(new Date(`${body.period_to}T00:00:00-03:00`).getTime() + 86400_000).toISOString();
  const { data: pays, error: pe } = await admin
    .from("order_payments")
    .select("order_id,paid_at,is_test")
    .gte("paid_at", from)
    .lt("paid_at", to)
    .limit(5000);
  if (pe) return json({ error: "Falha ao ler vendas." }, 500);
  const ids = [...new Set((pays ?? []).map((p) => p.order_id))];
  let orders: OrderRow[] = [];
  if (ids.length) {
    const { data: os, error: oe } = await admin
      .from("yampi_orders")
      .select("order_id,status,value_total,is_test,utm_source,utm_campaign")
      .in("order_id", ids);
    if (oe) return json({ error: "Falha ao ler pedidos." }, 500);
    orders = (os ?? []) as OrderRow[];
  }
  const sales = aggregateSales((pays ?? []) as PaymentRow[], orders);

  const { data: row, error: ie } = await admin
    .from("campaign_analyses")
    .insert({
      created_by: u.user.id,
      campaign_name: body.campaign_name || null,
      period_from: body.period_from,
      period_to: body.period_to,
      source_type: body.source_type,
      raw_input: body.raw_input,
      sales_snapshot: sales,
      model: MODEL,
      status: "pending",
    })
    .select("id")
    .single();
  if (ie || !row) return json({ error: "Falha ao salvar análise." }, 500);

  const userText = `Campanha: ${body.campaign_name || "(sem nome)"}\nPeríodo: ${body.period_from} a ${body.period_to}\n\nDADOS DA CAMPANHA (${body.source_type.toUpperCase()}):\n${body.raw_input}\n\nVENDAS REAIS PAGAS NO PERÍODO (JSON):\n${JSON.stringify(sales)}`;

  let out;
  try {
    out = await streamOutput(apiKey, [
      { role: "system", content: INSTRUCTIONS },
      { role: "user", content: userText },
    ], req.signal);
  } catch (e) {
    if (req.signal.aborted) {
      await admin.from("campaign_analyses").update({ status: "failed", error: "Cancelado." }).eq("id", row.id);
      return new Response(null, { status: 499 });
    }
    out = { status: 502, error: e instanceof Error ? e.message : "Erro na IA." };
  }

  if (out.status !== 200 || !("text" in out)) {
    await admin.from("campaign_analyses").update({ status: "failed", error: out.error }).eq("id", row.id);
    return json({ error: out.error, id: row.id }, out.status);
  }
  let result: unknown;
  try {
    result = JSON.parse(out.text!);
  } catch {
    await admin.from("campaign_analyses").update({ status: "failed", error: "Resposta inválida da IA." }).eq("id", row.id);
    return json({ error: "Resposta inválida da IA.", id: row.id }, 502);
  }
  await admin.from("campaign_analyses").update({ status: "done", result }).eq("id", row.id);
  return json({ id: row.id, result, sales });
});
