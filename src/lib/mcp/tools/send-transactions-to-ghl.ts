import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

type DispatchResult = { ok?: boolean; error?: string; [key: string]: unknown };

export default defineTool({
  name: "send_transactions_to_ghl",
  title: "Enviar transações ao GHL",
  description:
    "Enfileira pedidos Yampi, carrinhos abandonados e checkouts do site para o GoHighLevel, com simulação opcional e proteção contra duplicidade.",
  inputSchema: {
    days: z.number().int().min(1).max(365).default(30).describe("Período em dias."),
    event_types: z
      .array(z.enum(["purchase", "order_status", "abandoned_cart", "initiate_checkout"]))
      .min(1)
      .default(["purchase", "order_status", "abandoned_cart", "initiate_checkout"])
      .describe("Tipos de evento a enviar."),
    include_tests: z.boolean().default(false).describe("Incluir eventos de teste."),
    simulate: z.boolean().default(true).describe("Apenas contar o que seria enviado, sem entregar ao GHL."),
    limit: z.number().int().min(1).max(100).default(50).describe("Máximo de eventos a processar."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, destructiveHint: false, openWorldHint: true },
  handler: async ({ days, event_types, include_tests, simulate, limit }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const token = ctx.getToken();
    if (!token) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const url = runtimeUrl();
    if (!url) return { content: [{ type: "text", text: "SUPABASE_URL não configurada" }], isError: true };
    const response = await fetch(`${url}/functions/v1/ghl-dispatch`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        action: "sync",
        days,
        event_types,
        include_tests,
        simulate,
        limit,
      }),
    });
    const result = (await response.json().catch(() => ({ error: "Resposta inválida" }))) as DispatchResult;
    if (!response.ok || result.error) return { content: [{ type: "text", text: JSON.stringify(result) }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
  },
});

function runtimeUrl(): string | undefined {
  const runtime = globalThis as typeof globalThis & {
    Deno?: { env?: { get?: (name: string) => string | undefined } };
    process?: { env?: Record<string, string | undefined> };
  };
  return runtime.Deno?.env?.get?.("SUPABASE_URL") ?? runtime.process?.env?.SUPABASE_URL;
}
