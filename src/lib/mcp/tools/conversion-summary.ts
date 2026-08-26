import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "conversion_summary",
  title: "Resumo de conversões",
  description:
    "Resume o desempenho do período: cliques, leads, compras, receita total e origens (UTM) mais fortes. Os totais são calculados no banco (sem truncagem) e pedidos de teste ficam fora por padrão.",
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
    const { data, error } = await supabase.rpc("mcp_conversion_summary", {
      _days: days,
      _include_tests: include_tests ?? false,
    });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const summary = (data ?? {}) as Record<string, unknown>;
    return {
      content: [{ type: "text", text: JSON.stringify(summary) }],
      structuredContent: summary,
    };
  },
});
