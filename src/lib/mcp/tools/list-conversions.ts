import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_conversions",
  title: "Listar conversões",
  description:
    "Lista os eventos de conversão recentes (cliques, leads e compras) registrados pelo site LipoVitta.",
  inputSchema: {
    days: z.number().int().min(1).max(365).default(7).describe("Período em dias a consultar."),
    event_name: z
      .string()
      .optional()
      .describe("Filtrar por evento, ex.: Purchase, InitiateCheckout, Lead."),
    limit: z.number().int().min(1).max(200).default(50).describe("Máximo de linhas."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ days, event_name, limit }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const since = new Date(Date.now() - days * 86400000).toISOString();
    let query = supabase
      .from("conversion_events")
      .select(
        "id,event_name,source,cta_location,product_name,value,order_id,gift,utm_source,utm_campaign,meta_status,created_at"
      )
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (event_name) query = query.eq("event_name", event_name);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { events: data ?? [], count: data?.length ?? 0 },
    };
  },
});
