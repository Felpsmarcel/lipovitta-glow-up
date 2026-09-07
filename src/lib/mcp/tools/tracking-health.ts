import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { requireAdmin } from "../admin";
import { queryFailure, runTool } from "../errors";

const TOOL = "tracking_health";

export function buildGaps(health: Record<string, unknown>): string[] {
  const num = (k: string) => Number(health[k] ?? 0) || 0;
  const gaps: string[] = [];
  if (num("meta_error_404") > 0)
    gaps.push(`${num("meta_error_404")} compras com meta_status=error_404 (endpoint CAPI inválido).`);
  if (num("meta_missing_status") > 0)
    gaps.push(`${num("meta_missing_status")} compras sem status de envio para a Meta.`);
  if (num("internal_purchases") > 0 && num("meta_sent") < num("internal_purchases"))
    gaps.push(`Apenas ${num("meta_sent")} de ${num("internal_purchases")} compras chegaram à Meta.`);
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
      `${num("yampi_orders_waiting_payment")} pedidos aguardando pagamento (não contam como faturamento e não disparam expedição).`
    );
  if (num("initiate_checkouts") > 0 && num("yampi_orders_total") === 0)
    gaps.push("Houve checkouts iniciados, mas nenhum pedido da Yampi chegou ao webhook no período.");
  if (num("initiate_checkouts") > 0 && num("internal_purchases") === 0)
    gaps.push("Houve checkouts iniciados, mas nenhuma compra registrada no período.");
  return gaps;
}

export default defineTool({
  name: TOOL,
  title: "Saúde do rastreamento",
  description:
    "Compara checkouts iniciados, carrinhos abandonados, pedidos criados na Yampi (aguardando pagamento, pagos, cancelados), Purchase interno, receita, UTMs e envio para a Meta. Aponta inconsistências, erros error_404 e divergências de preço. Somente leitura, exige papel admin.",
  inputSchema: {
    days: z.number().int().min(1).max(365).default(7).describe("Período em dias."),
    include_tests: z
      .boolean()
      .default(false)
      .describe("Incluir pedidos de teste (TEST...) na análise."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (input, ctx) =>
    runTool(TOOL, async (setStage) => {
      const days = input.days ?? 7;
      const includeTests = input.include_tests ?? false;

      setStage("authorization");
      const guard = await requireAdmin(ctx, TOOL);
      if ("error" in guard) return guard.error;

      setStage("rpc:mcp_tracking_health");
      const { data, error } = await guard.supabase.rpc("mcp_tracking_health", {
        _days: days,
        _include_tests: includeTests,
      });
      if (error) return queryFailure(TOOL, "rpc:mcp_tracking_health", error.message);

      setStage("shape");
      const health = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
      const warnings: string[] = [];
      if (Object.keys(health).length === 0)
        warnings.push("Nenhum dado agregado retornado para o período informado.");

      const payload = {
        ok: true,
        tool: TOOL,
        days,
        include_tests: includeTests,
        ...health,
        gaps: buildGaps(health),
        warnings,
      };
      return {
        content: [{ type: "text" as const, text: JSON.stringify(payload) }],
        structuredContent: payload as unknown as Record<string, unknown>,
      };
    }),
});
