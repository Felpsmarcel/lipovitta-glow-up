import { defineTool } from "@lovable.dev/mcp-js";
import { ghlConfigStatus } from "../../ghlApi";
import { requireAdmin, toolJson } from "../admin";
import { runTool } from "../errors";

const TOOL = "ghl_config_status";

export default defineTool({
  name: TOOL,
  title: "Diagnóstico da integração HighLevel",
  description:
    "Somente leitura: informa se o token da API direta e o location da subconta estão configurados, se o location bate com a subconta LipoVitta esperada e se o Inbound Webhook segue ativo. Retorna apenas booleanos — nunca token ou URL secreta.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) =>
    runTool(TOOL, async (setStage) => {
      setStage("authorization");
      const guard = await requireAdmin(ctx, TOOL);
      if ("error" in guard) return guard.error;

      setStage("read_config");
      const status = ghlConfigStatus();
      return toolJson({ ok: true, tool: TOOL, ...status });
    }),
});
