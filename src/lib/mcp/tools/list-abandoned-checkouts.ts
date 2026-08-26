import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_abandoned_checkouts",
  title: "Listar carrinhos abandonados",
  description:
    "Lista os carrinhos abandonados capturados pelo webhook da Yampi: nome, telefone, e-mail, produtos, valor, UTMs, links de recuperação/recompra e data. Contém dados pessoais — apenas administradores conseguem ler.",
  inputSchema: {
    days: z.number().int().min(1).max(365).default(7).describe("Período em dias."),
    limit: z.number().int().min(1).max(200).default(50).describe("Máximo de linhas."),
    only_unrecovered: z
      .boolean()
      .default(true)
      .describe("Mostrar apenas carrinhos ainda não recuperados."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ days, limit, only_unrecovered }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const since = new Date(Date.now() - days * 86400000).toISOString();
    let query = supabase
      .from("abandoned_checkouts")
      .select(
        "cart_token,customer_name,customer_email,customer_phone,items,total,currency,recovery_url,reorder_url,utm_source,utm_medium,utm_campaign,utm_content,utm_term,abandoned_at,recovered_at,recovered_order_id"
      )
      .gte("abandoned_at", since)
      .order("abandoned_at", { ascending: false })
      .limit(limit);
    if (only_unrecovered) query = query.is("recovered_at", null);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const items = data ?? [];
    const payload = { items, count: items.length, days, only_unrecovered };
    return {
      content: [{ type: "text", text: JSON.stringify(payload) }],
      structuredContent: payload,
    };
  },
});
