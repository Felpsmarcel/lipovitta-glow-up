import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

type DispatchResult = { ok?: boolean; error?: string; [key: string]: unknown };

function runtimeUrl(): string | undefined {
  const runtime = globalThis as typeof globalThis & {
    Deno?: { env?: { get?: (name: string) => string | undefined } };
    process?: { env?: Record<string, string | undefined> };
  };
  return runtime.Deno?.env?.get?.("SUPABASE_URL") ?? runtime.process?.env?.SUPABASE_URL;
}

export default defineTool({
  name: "send_transactions_to_ghl",
  title: "Enviar transações ao GHL",
  description:
    "Envia ao GoHighLevel os pedidos da Yampi, mudanças de status, carrinhos abandonados e checkouts do site. Use simulate=true para ver quantos eventos seriam enviados antes de enviar de verdade; retry_failed=true reprocessa entregas que falharam. Envios são idempotentes: o mesmo evento nunca vai duas vezes.",
  inputSchema: {
    days: z.number().int().min(1).max(365).default(30).describe("Período em dias."),
    event_types: z
      .array(z.enum(["purchase", "order_status", "abandoned_cart", "initiate_checkout"]))
      .min(1)
      .default(["purchase", "order_status", "abandoned_cart", "initiate_checkout"])
      .describe("Tipos de evento a enviar."),
    include_tests: z.boolean().default(false).describe("Incluir eventos de teste (TEST...)."),
    simulate: z
      .boolean()
      .default(true)
      .describe("Somente contar o que seria enviado, sem entregar ao GHL."),
    retry_failed: z
      .boolean()
      .default(false)
      .describe("Reprocessar entregas marcadas como falha definitiva."),
    limit: z.number().int().min(1).max(100).default(50).describe("Máximo de eventos por execução."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, destructiveHint: false, openWorldHint: true },
  handler: async ({ days, event_types, include_tests, simulate, retry_failed, limit }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const token = ctx.getToken();
    if (!token) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const url = runtimeUrl();
    if (!url)
      return { content: [{ type: "text", text: "SUPABASE_URL não configurada" }], isError: true };

    const response = await fetch(`${url}/functions/v1/ghl-dispatch`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        action: "sync",
        days,
        event_types,
        include_tests,
        simulate,
        retry_failed,
        limit,
      }),
    });
    const result = (await response
      .json()
      .catch(() => ({ error: "Resposta inválida da função de entrega" }))) as DispatchResult;
    if (!response.ok || result.error)
      return { content: [{ type: "text", text: JSON.stringify(result) }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
  },
});
