import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "conversion_summary",
  title: "Resumo de conversões",
  description:
    "Resume o desempenho do período: cliques, leads, compras, receita total e origens (UTM) mais fortes.",
  inputSchema: {
    days: z.number().int().min(1).max(365).default(30).describe("Período em dias."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ days }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const since = new Date(Date.now() - days * 86400000).toISOString();
    const { data, error } = await supabase
      .from("conversion_events")
      .select("event_name,value,cta_location,utm_source,utm_campaign")
      .gte("created_at", since)
      .limit(5000);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const rows = data ?? [];
    const byEvent: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    const byCta: Record<string, number> = {};
    let revenue = 0;
    let purchases = 0;
    for (const r of rows) {
      byEvent[r.event_name] = (byEvent[r.event_name] ?? 0) + 1;
      const src = r.utm_source ?? "direto";
      bySource[src] = (bySource[src] ?? 0) + 1;
      if (r.cta_location) byCta[r.cta_location] = (byCta[r.cta_location] ?? 0) + 1;
      if (r.event_name === "Purchase") {
        purchases += 1;
        revenue += Number(r.value ?? 0);
      }
    }
    const summary = {
      days,
      total_events: rows.length,
      purchases,
      revenue_brl: Math.round(revenue * 100) / 100,
      events: byEvent,
      by_utm_source: bySource,
      by_cta_location: byCta,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(summary) }],
      structuredContent: summary,
    };
  },
});
