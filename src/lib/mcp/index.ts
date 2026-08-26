import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listConversions from "./tools/list-conversions";
import conversionSummary from "./tools/conversion-summary";
import listApplications from "./tools/list-applications";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "lipovitta-transformation",
  title: "LipoVitta Transformation",
  version: "0.1.0",
  instructions:
    "Ferramentas da LipoVitta. Use `conversion_summary` para o panorama de vendas do período, `list_conversions` para eventos detalhados (cliques, leads, compras) e `list_applications` para candidaturas de afiliadas e parceiros. Os dados respeitam as permissões da conta conectada (apenas administradores enxergam os registros).",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [conversionSummary, listConversions, listApplications],
});
