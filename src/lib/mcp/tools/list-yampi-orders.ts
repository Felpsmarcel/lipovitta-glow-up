import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_yampi_orders",
  title: "Listar pedidos Yampi",
  description:
    "Lista os pedidos reais registrados pelo webhook da Yampi com status, itens, valores, UTMs e situação do envio para a Meta. Pedidos de teste (TEST...) ficam fora por padrão.",
  inputSchema: {
    days: z.number().int().min(1).max(365).default(30).describe("Período em dias."),
    limit: z.number().int().min(1).max(200).default(50).describe("Máximo de linhas."),
    include_tests: z.boolean().default(false).describe("Incluir pedidos de teste."),
    only_mismatches: z
      .boolean()
      .default(false)
      .describe("Mostrar apenas pedidos com divergência de preço."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ days, limit, include_tests, only_mismatches }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const since = new Date(Date.now() - days * 86400000).toISOString();
    let query = supabase
      .from("conversion_events")
      .select(
        "order_id,event_id,value,currency,product_name,sku,gift,utm_source,utm_medium,utm_campaign,utm_content,meta_status,metadata,is_test,created_at"
      )
      .eq("event_name", "Purchase")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (!include_tests) query = query.eq("is_test", false);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    let orders = (data ?? []).map((row) => {
      const meta = (row.metadata ?? {}) as Record<string, unknown>;
      return {
        order_id: row.order_id,
        event_id: row.event_id,
        value: row.value,
        currency: row.currency,
        status: (meta.status as string) ?? null,
        source_event: (meta.event as string) ?? null,
        items_count: (meta.items_count as number) ?? null,
        skus: (meta.skus as string[]) ?? (row.sku ? [row.sku] : []),
        product_name: row.product_name,
        gift: row.gift,
        utm: {
          source: row.utm_source,
          medium: row.utm_medium,
          campaign: row.utm_campaign,
          content: row.utm_content,
        },
        meta_status: row.meta_status,
        expected_value: (meta.expected_value as number) ?? null,
        price_diff: (meta.price_diff as number) ?? null,
        price_mismatch: meta.price_mismatch === true,
        is_test: row.is_test,
        created_at: row.created_at,
      };
    });
    if (only_mismatches) orders = orders.filter((o) => o.price_mismatch);

    const payload = { orders, count: orders.length, days, include_tests };
    return {
      content: [{ type: "text", text: JSON.stringify(payload) }],
      structuredContent: payload,
    };
  },
});
