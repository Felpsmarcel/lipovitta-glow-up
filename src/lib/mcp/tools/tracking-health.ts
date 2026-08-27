import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "tracking_health",
  title: "Saúde do rastreamento",
  description:
    "Compara checkouts iniciados, carrinhos abandonados, pedidos criados na Yampi (aguardando pagamento, pagos, cancelados), Purchase interno e envio para a Meta. Aponta inconsistências, erros error_404 e divergências de preço.",

  inputSchema: {
    days: z.number().int().min(1).max(365).default(7).describe("Período em dias."),
    include_tests: z
      .boolean()
      .default(false)
      .describe("Incluir pedidos de teste (TEST...) na análise."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ days, include_tests }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.rpc("mcp_tracking_health", {
      _days: days,
      _include_tests: include_tests ?? false,
    });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const health = (data ?? {}) as Record<string, number | unknown>;
    const gaps: string[] = [];
    const num = (k: string) => Number(health[k] ?? 0);
    if (num("meta_error_404") > 0)
      gaps.push(`${num("meta_error_404")} compras com meta_status=error_404 (endpoint CAPI inválido).`);
    if (num("meta_missing_status") > 0)
      gaps.push(`${num("meta_missing_status")} compras sem status de envio para a Meta.`);
    if (num("internal_purchases") > 0 && num("meta_sent") < num("internal_purchases"))
      gaps.push(
        `Apenas ${num("meta_sent")} de ${num("internal_purchases")} compras chegaram à Meta.`
      );
    if (num("price_mismatches") > 0 || num("yampi_price_mismatches") > 0)
      gaps.push(
        `${Math.max(num("price_mismatches"), num("yampi_price_mismatches"))} pedidos com divergência entre valor esperado e pago.`
      );
    if (num("yampi_orders_paid") > num("purchases_from_yampi"))
      gaps.push(
        `${num("yampi_orders_paid")} pedidos pagos na Yampi, mas apenas ${num("purchases_from_yampi")} Purchase interno registrado.`
      );
    if (num("yampi_orders_waiting_payment") > 0)
      gaps.push(
        `${num("yampi_orders_waiting_payment")} pedidos aguardando pagamento (não contam como faturamento).`
      );
    if (num("initiate_checkouts") > 0 && num("yampi_orders_total") === 0)
      gaps.push("Houve checkouts iniciados, mas nenhum pedido da Yampi chegou ao webhook no período.");
    if (num("initiate_checkouts") > 0 && num("internal_purchases") === 0)
      gaps.push("Houve checkouts iniciados, mas nenhuma compra registrada no período.");


    const result = { ...health, gaps };
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      structuredContent: result,
    };
  },
});
