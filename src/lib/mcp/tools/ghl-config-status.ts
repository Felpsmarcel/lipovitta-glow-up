import { defineTool } from "@lovable.dev/mcp-js";
import { ghlConfigStatus } from "../../ghlApi";
import { requireAdmin, toolJson } from "../admin";

export default defineTool({
  name: "ghl_config_status",
  title: "Diagnóstico da integração HighLevel",
  description:
    "Somente leitura: informa se o token da API direta e o location da subconta estão configurados e se o Inbound Webhook segue ativo. Retorna apenas booleanos — nunca o valor de token ou URL secreta.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    const guard = await requireAdmin(ctx);
    if ("error" in guard) return guard.error;
    return toolJson({ ...ghlConfigStatus() });
  },
});
