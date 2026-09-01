import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import {
  addContactTags,
  assertPaidOrder,
  buildOrderTags,
  createOpportunity,
  enrollContactInWorkflow,
  findOpportunity,
  requireGhlConfig,
  runPaidOrderSync,
  updateOpportunity,
  upsertContact,
  type ContactInput,
  type PaidOrderApi,
  type PaidOrderPlan,
} from "../../ghlApi";
import { requireAdmin, toolError, toolJson } from "../admin";

type OutboxPayload = {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
};

const liveApi: PaidOrderApi = {
  upsertContact: (input) => upsertContact(input),
  addContactTags: (contactId, tags) => addContactTags(contactId, tags),
  enrollContactInWorkflow: (contactId, workflowId) => enrollContactInWorkflow(contactId, workflowId),
  findOpportunity: (contactId, pipelineId) => findOpportunity(contactId, pipelineId),
  createOpportunity: (input) => createOpportunity(input),
  updateOpportunity: (id, input) => updateOpportunity(id, input),
};

export default defineTool({
  name: "ghl_sync_paid_order",
  title: "Sincronizar pedido pago com o HighLevel",
  description:
    "Escrita orquestrada (simulate=true por padrão): a partir de um pedido PAGO da Yampi, faz upsert do contato, aplica tags seguras (lipovitta-comprador + SKUs), opcionalmente insere o contato num workflow e cria/atualiza a oportunidade com o valor pago. Pedido não pago é sempre recusado.",
  inputSchema: {
    order_id: z.string().trim().min(1).describe("ID do pedido na Yampi."),
    workflow_id: z.string().trim().optional(),
    pipeline_id: z.string().trim().optional(),
    pipeline_stage_id: z.string().trim().optional(),
    opportunity_name: z.string().trim().max(200).optional(),
    simulate: z.boolean().default(true).describe("Somente mostrar o que seria feito."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, destructiveHint: false, openWorldHint: true },
  handler: async (input, ctx) => {
    const guard = await requireAdmin(ctx);
    if ("error" in guard) return guard.error;
    const supabase = guard.supabase;

    const { data: order, error: orderErr } = await supabase
      .from("yampi_orders")
      .select("order_id,order_number,status,value_total,items,is_test")
      .eq("order_id", input.order_id)
      .maybeSingle();
    if (orderErr) return toolError(`Falha ao ler o pedido: ${orderErr.message}`);

    let paid: { order_id: string; status: string };
    try {
      paid = assertPaidOrder(order);
      requireGhlConfig();
    } catch (e) {
      return toolError((e as Error).message);
    }

    const { data: outbox } = await supabase
      .from("ghl_outbox")
      .select("payload,created_at")
      .eq("event_type", "purchase")
      .order("created_at", { ascending: false })
      .limit(200);
    const match = (outbox ?? []).find(
      (row) => (row.payload as { order_id?: unknown } | null)?.order_id === paid.order_id,
    );
    const payload = (match?.payload ?? {}) as OutboxPayload;
    const contact: ContactInput = {
      first_name: payload.first_name ?? null,
      last_name: payload.last_name ?? null,
      email: payload.email ?? null,
      phone: payload.phone ?? null,
      source: "yampi",
    };
    if (!contact.email && !contact.phone)
      return toolError(
        `Sem contato recuperável para o pedido ${paid.order_id} (nenhum payload purchase com e-mail/telefone na fila ghl_outbox).`,
      );

    const items = Array.isArray(order?.items) ? (order?.items as { sku?: unknown; name?: unknown }[]) : [];
    const plan: PaidOrderPlan = {
      order_id: paid.order_id,
      status: paid.status,
      contact,
      tags: buildOrderTags(items),
      workflow_id: input.workflow_id ?? null,
      pipeline_id: input.pipeline_id ?? null,
      pipeline_stage_id: input.pipeline_stage_id ?? null,
      opportunity_name: input.opportunity_name ?? `Pedido ${order?.order_number ?? paid.order_id}`,
      monetary_value: typeof order?.value_total === "number" ? order.value_total : Number(order?.value_total ?? 0) || null,
    };

    try {
      const result = await runPaidOrderSync(plan, liveApi, input.simulate);
      return toolJson({
        ...result,
        order_number: order?.order_number ?? null,
        is_test: order?.is_test ?? false,
        tags: plan.tags,
        monetary_value: plan.monetary_value,
      });
    } catch (e) {
      return toolError((e as Error).message);
    }
  },
});
