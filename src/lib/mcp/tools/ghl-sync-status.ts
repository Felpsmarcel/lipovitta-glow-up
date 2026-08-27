import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "ghl_sync_status",
  title: "Status da sincronização GHL",
  description:
    "Mostra o estado da fila de eventos enviados ou pendentes para o GoHighLevel, com os últimos erros de entrega.",
  inputSchema: {
    days: z.number().int().min(1).max(365).default(30).describe("Período em dias."),
    include_tests: z.boolean().default(false).describe("Incluir eventos de teste."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ days, include_tests }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const since = new Date(Date.now() - days * 86400000).toISOString();
    let query = supabase
      .from("ghl_outbox")
      .select("id,event_type,status,attempts,last_error,is_test,created_at,processed_at,sent_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(200);
    if (!include_tests) query = query.eq("is_test", false);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const items = data ?? [];
    const counts = items.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      return acc;
    }, {});
    const result = {
      days,
      include_tests,
      counts: { pending: counts.pending ?? 0, sent: counts.sent ?? 0, error: counts.error ?? 0, failed: counts.failed ?? 0 },
      total: items.length,
      recent_errors: items
        .filter((item) => item.status === "error" || item.status === "failed")
        .slice(0, 20)
        .map(({ id, event_type, status, attempts, last_error, created_at }) => ({ id, event_type, status, attempts, last_error, created_at })),
    };
    return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
  },
});
