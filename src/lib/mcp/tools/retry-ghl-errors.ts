import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default {
  name: "retry_ghl_errors",
  title: "Reprocessar falhas do GHL",
  description: "Recoloca eventos que falharam na entrega ao GoHighLevel para uma nova tentativa.",
  inputSchema: {
    include_tests: z.boolean().default(false).describe("Incluir eventos de teste."),
    limit: z.number().int().min(1).max(100).default(100).describe("Máximo de eventos a reprocessar."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, destructiveHint: false, openWorldHint: true },
  handler: async ({ include_tests, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const token = ctx.getToken();
    if (!token) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const url = runtimeUrl();
    if (!url) return { content: [{ type: "text", text: "SUPABASE_URL não configurada" }], isError: true };
    const response = await fetch(`${url}/functions/v1/ghl-dispatch`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ retry_failed: true, include_tests, limit }),
    });
    const result = await response.json().catch(() => ({ error: "Resposta inválida" }));
    return response.ok
      ? { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result }
      : { content: [{ type: "text", text: JSON.stringify(result) }], isError: true };
  },
};

function runtimeUrl(): string | undefined {
  const runtime = globalThis as typeof globalThis & {
    Deno?: { env?: { get?: (name: string) => string | undefined } };
    process?: { env?: Record<string, string | undefined> };
  };
  return runtime.Deno?.env?.get?.("SUPABASE_URL") ?? runtime.process?.env?.SUPABASE_URL;
}
