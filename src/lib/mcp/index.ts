import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listConversions from "./tools/list-conversions";
import conversionSummary from "./tools/conversion-summary";
import listApplications from "./tools/list-applications";
import salesMetrics from "./tools/sales-metrics";
import trackingHealth from "./tools/tracking-health";
import listAbandonedCheckouts from "./tools/list-abandoned-checkouts";
import listYampiOrders from "./tools/list-yampi-orders";
import ghlSyncStatus from "./tools/ghl-sync-status";
import sendTransactionsToGhl from "./tools/send-transactions-to-ghl";
import ghlConfigStatus from "./tools/ghl-config-status";
import ghlListWorkflows from "./tools/ghl-list-workflows";
import ghlUpsertContact from "./tools/ghl-upsert-contact";
import ghlAddTags from "./tools/ghl-add-tags";
import ghlRemoveTags from "./tools/ghl-remove-tags";
import ghlEnrollWorkflow from "./tools/ghl-enroll-workflow";
import ghlRemoveFromWorkflow from "./tools/ghl-remove-from-workflow";
import ghlCreateOrUpdateOpportunity from "./tools/ghl-create-or-update-opportunity";
import ghlSyncPaidOrder from "./tools/ghl-sync-paid-order";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "lipovitta-transformation",
  title: "LipoVitta Transformation",
  version: "0.5.0",
  instructions:
    "Ferramentas operacionais da LipoVitta (loja Yampi + rastreamento Meta + GoHighLevel). Leitura: `sales_metrics` para faturamento, ticket médio e conversão; `conversion_summary` para o panorama de eventos; `list_yampi_orders` para pedidos reais com status, itens e divergências de preço; `list_abandoned_checkouts` para carrinhos abandonados com contato e link de recuperação; `list_conversions` para o log bruto de eventos; `list_applications` para candidaturas de afiliadas e parceiros; `tracking_health` para conferir se checkouts, pedidos pagos, Purchase interno e envio à Meta batem. Fila do GoHighLevel (Inbound Webhook, fluxo atual): `ghl_sync_status` mostra pendentes, enviados e erros; `send_transactions_to_ghl` envia pedidos, mudanças de status, carrinhos abandonados e checkouts. API direta do HighLevel (V2 operacional): `ghl_config_status` diz se o token e o location estão configurados; `ghl_list_workflows` lista os workflows da subconta; `ghl_upsert_contact`, `ghl_add_tags`, `ghl_remove_tags`, `ghl_enroll_workflow`, `ghl_remove_from_workflow`, `ghl_create_or_update_opportunity` e `ghl_sync_paid_order` operam contatos, tags, workflows e oportunidades. TODA ferramenta de escrita exige papel admin e roda com simulate=true por padrão: execute primeiro em simulação, confira o que seria feito e só depois repita com simulate=false. `ghl_sync_paid_order` só aceita pedidos pagos (paid/approved) — status logísticos como invoiced, on_carriage ou delivered não são prova de pagamento. Pedidos de teste (TEST...) são excluídos por padrão — use include_tests para vê-los. Todos os dados respeitam as permissões da conta conectada: apenas administradores enxergam registros e dados pessoais.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    salesMetrics,
    conversionSummary,
    listYampiOrders,
    listAbandonedCheckouts,
    listConversions,
    listApplications,
    trackingHealth,
    ghlSyncStatus,
    sendTransactionsToGhl,
    ghlConfigStatus,
    ghlListWorkflows,
    ghlUpsertContact,
    ghlAddTags,
    ghlRemoveTags,
    ghlEnrollWorkflow,
    ghlRemoveFromWorkflow,
    ghlCreateOrUpdateOpportunity,
    ghlSyncPaidOrder,
  ],
});
