import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_yampi_orders",
  title: "Listar pedidos Yampi",
  description:
    "Lista os pedidos registrados pelo webhook da Yampi (criados, aguardando pagamento, pagos, cancelados) com status, itens, valores, UTMs, brinde e divergências de preço. Pedidos de teste (TEST...) ficam fora por padrão.",
  inputSchema: {
    days: z.number().int().min(1).max(365).default(30).describe("Período em dias."),
    limit: z.number().int().min(1).max(200).default(50).describe("Máximo de linhas."),
    status: z
      .string()
      .optional()
      .describe("Filtrar por status da Yampi, ex.: paid, waiting_payment, cancelled."),
    include_tests: z.boolean().default(false).describe("Incluir pedidos de teste."),
    only_mismatches: z
      .boolean()
      .default(false)
      .describe("Mostrar apenas pedidos com divergência de preço."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ days, limit, status, include_tests, only_mismatches }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const since = new Date(Date.now() - days * 86400000).toISOString();
    let query = supabase
      .from("yampi_orders")
      .select(
        "order_id,order_number,status,event,value_total,value_products,value_discount,payment_alias,items,utm_source,utm_medium,utm_campaign,utm_content,utm_term,event_id,gift,expected_value,price_diff,price_mismatch,is_test,created_at_yampi,updated_at_yampi,first_seen_at,last_seen_at"
      )
      .gte("last_seen_at", since)
      .order("last_seen_at", { ascending: false })
      .limit(limit);
    if (!include_tests) query = query.eq("is_test", false);
    if (status?.trim()) query = query.eq("status", status.trim().toLowerCase());
    if (only_mismatches) query = query.eq("price_mismatch", true);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const orders = (data ?? []).map((row) => ({
      order_id: row.order_id,
      order_number: row.order_number,
      status: row.status,
      last_event: row.event,
      value_total: row.value_total,
      value_products: row.value_products,
      value_discount: row.value_discount,
      payment: row.payment_alias,
      items: row.items,
      utm: {
        source: row.utm_source,
        medium: row.utm_medium,
        campaign: row.utm_campaign,
        content: row.utm_content,
        term: row.utm_term,
      },
      event_id: row.event_id,
      gift: row.gift,
      expected_value: row.expected_value,
      price_diff: row.price_diff,
      price_mismatch: row.price_mismatch,
      is_test: row.is_test,
      created_at_yampi: row.created_at_yampi,
      updated_at_yampi: row.updated_at_yampi,
      first_seen_at: row.first_seen_at,
      last_seen_at: row.last_seen_at,
    }));

    const payload = { orders, count: orders.length, days, status: status ?? null, include_tests };
    return {
      content: [{ type: "text", text: JSON.stringify(payload) }],
      structuredContent: payload,
    };
  },
});
