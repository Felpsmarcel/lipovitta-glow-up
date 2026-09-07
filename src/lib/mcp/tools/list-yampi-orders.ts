import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { requireAdmin } from "../admin";
import { queryFailure, runTool } from "../errors";

const TOOL = "list_yampi_orders";

const COLUMNS =
  "order_id,order_number,status,event,value_total,value_products,value_discount,payment_alias,items,utm_source,utm_medium,utm_campaign,utm_content,utm_term,event_id,gift,expected_value,price_diff,price_mismatch,is_test,created_at_yampi,updated_at_yampi,first_seen_at,last_seen_at";

const num = (v: unknown): number | null =>
  v === null || v === undefined || v === "" || Number.isNaN(Number(v)) ? null : Number(v);

export default defineTool({
  name: TOOL,
  title: "Listar pedidos Yampi",
  description:
    "Lista os pedidos registrados pelo webhook da Yampi (criados, aguardando pagamento, pagos, cancelados) com status, itens, valores, UTMs, brinde e divergências de preço. Pedidos de teste (TEST...) ficam fora por padrão. Somente leitura, exige papel admin.",
  inputSchema: {
    days: z.number().int().min(1).max(365).default(30).describe("Período em dias."),
    limit: z.number().int().min(1).max(200).default(50).describe("Máximo de linhas."),
    offset: z.number().int().min(0).max(10000).default(0).describe("Deslocamento (paginação)."),
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
  handler: async (input, ctx) =>
    runTool(TOOL, async (setStage) => {
      const days = input.days ?? 30;
      const limit = input.limit ?? 50;
      const offset = input.offset ?? 0;
      const includeTests = input.include_tests ?? false;
      const onlyMismatches = input.only_mismatches ?? false;
      const status = input.status?.trim().toLowerCase() || null;

      setStage("authorization");
      const guard = await requireAdmin(ctx, TOOL);
      if ("error" in guard) return guard.error;

      setStage("query");
      const since = new Date(Date.now() - days * 86400000).toISOString();
      let query = guard.supabase
        .from("yampi_orders")
        .select(COLUMNS, { count: "exact" })
        .gte("last_seen_at", since)
        .order("last_seen_at", { ascending: false })
        .range(offset, offset + limit - 1);
      if (!includeTests) query = query.eq("is_test", false);
      if (status) query = query.eq("status", status);
      if (onlyMismatches) query = query.eq("price_mismatch", true);

      const { data, error, count } = await query;
      if (error) return queryFailure(TOOL, "query", error.message);

      setStage("shape");
      const rows = Array.isArray(data) ? data : [];
      const orders = rows.map((row) => ({
        order_id: row.order_id ?? null,
        order_number: row.order_number ?? null,
        status: row.status ?? null,
        last_event: row.event ?? null,
        /** Somente `paid`/`approved` comprovam pagamento — status logístico não. */
        is_paid: ["paid", "approved"].includes(String(row.status ?? "").toLowerCase()),
        value_total: num(row.value_total),
        value_products: num(row.value_products),
        value_discount: num(row.value_discount),
        payment: row.payment_alias ?? null,
        items: Array.isArray(row.items) ? row.items : [],
        utm: {
          source: row.utm_source ?? null,
          medium: row.utm_medium ?? null,
          campaign: row.utm_campaign ?? null,
          content: row.utm_content ?? null,
          term: row.utm_term ?? null,
        },
        event_id: row.event_id ?? null,
        gift: row.gift ?? null,
        expected_value: num(row.expected_value),
        price_diff: num(row.price_diff),
        price_mismatch: Boolean(row.price_mismatch),
        is_test: Boolean(row.is_test),
        created_at_yampi: row.created_at_yampi ?? null,
        updated_at_yampi: row.updated_at_yampi ?? null,
        first_seen_at: row.first_seen_at ?? null,
        last_seen_at: row.last_seen_at ?? null,
      }));

      const warnings: string[] = [];
      if (orders.length === 0) warnings.push("Nenhum pedido no período com os filtros informados.");

      const payload = {
        ok: true,
        tool: TOOL,
        orders,
        count: orders.length,
        total_matching: typeof count === "number" ? count : null,
        days,
        limit,
        offset,
        status,
        include_tests: includeTests,
        only_mismatches: onlyMismatches,
        warnings,
      };
      return {
        content: [{ type: "text" as const, text: JSON.stringify(payload) }],
        structuredContent: payload as unknown as Record<string, unknown>,
      };
    }),
});
