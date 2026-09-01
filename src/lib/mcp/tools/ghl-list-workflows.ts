import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { listWorkflows } from "../../ghlApi";
import { requireAdmin, toolError, toolJson } from "../admin";

export default defineTool({
  name: "ghl_list_workflows",
  title: "Listar workflows do HighLevel",
  description:
    "Somente leitura: lista os workflows existentes na subconta LipoVitta do HighLevel (id, nome, status, versão e última atualização). Nunca retorna tokens.",
  inputSchema: {
    status: z.string().optional().describe("Filtrar por status, ex.: published, draft."),
    name_contains: z.string().optional().describe("Filtrar por parte do nome do workflow."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ status, name_contains }, ctx) => {
    const guard = await requireAdmin(ctx);
    if ("error" in guard) return guard.error;
    try {
      const all = await listWorkflows();
      const needle = name_contains?.trim().toLowerCase();
      const workflows = all
        .filter((w) => (status ? String(w.status ?? "").toLowerCase() === status.toLowerCase() : true))
        .filter((w) => (needle ? String(w.name ?? "").toLowerCase().includes(needle) : true))
        .map((w) => ({
          id: w.id ?? null,
          name: w.name ?? null,
          status: w.status ?? null,
          version: w.version ?? null,
          updatedAt: w.updatedAt ?? null,
        }));
      return toolJson({ workflows, count: workflows.length });
    } catch (e) {
      return toolError((e as Error).message);
    }
  },
});
