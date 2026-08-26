import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "sales_metrics",
  title: "Métricas de vendas",
  description:
    "Compradores únicos, número de pedidos, faturamento, ticket médio, taxa de conversão a partir dos checkouts iniciados e produtos mais vendidos. Exclui pedidos de teste por padrão.",
  inputSchema: {
    days: z.number().int().min(1).max(365).default(30).describe("Período em dias."),
    include_tests: z
      .boolean()
      .default(false)
      .describe("Incluir pedidos de teste (TEST...) no cálculo."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ days, include_tests }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.rpc("mcp_sales_metrics", {
      _days: days,
      _include_tests: include_tests ?? false,
    });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const metrics = (data ?? {}) as Record<string, unknown>;
    return {
      content: [{ type: "text", text: JSON.stringify(metrics) }],
      structuredContent: metrics,
    };
  },
});
