import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listConversions from "./tools/list-conversions";
import conversionSummary from "./tools/conversion-summary";
import listApplications from "./tools/list-applications";
import salesMetrics from "./tools/sales-metrics";
import trackingHealth from "./tools/tracking-health";
import listAbandonedCheckouts from "./tools/list-abandoned-checkouts";
import listYampiOrders from "./tools/list-yampi-orders";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "lipovitta-transformation",
  title: "LipoVitta Transformation",
  version: "0.2.0",
  instructions:
    "Ferramentas operacionais da LipoVitta (loja Yampi + rastreamento Meta). Leitura: `sales_metrics` para faturamento, ticket médio e conversão; `conversion_summary` para o panorama de eventos; `list_yampi_orders` para pedidos reais com status, itens e divergências de preço; `list_abandoned_checkouts` para carrinhos abandonados com contato e link de recuperação; `list_conversions` para o log bruto de eventos; `list_applications` para candidaturas de afiliadas e parceiros; `tracking_health` para conferir se checkouts, pedidos pagos, Purchase interno e envio à Meta batem. Pedidos de teste (TEST...) são excluídos por padrão — use include_tests para vê-los. Todos os dados respeitam as permissões da conta conectada: apenas administradores enxergam registros e dados pessoais. Nenhuma ferramenta escreve dados nesta versão.",
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
  ],
});
