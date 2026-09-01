import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { enrollContactInWorkflow, requireGhlConfig } from "../../ghlApi";
import { requireAdmin, toolError, toolJson } from "../admin";

export default defineTool({
  name: "ghl_enroll_workflow",
  title: "Inserir contato em um workflow",
  description:
    "Escrita (simulate=true por padrão): adiciona um contato a um workflow do HighLevel. Use ghl_list_workflows para descobrir o workflow_id.",
  inputSchema: {
    contact_id: z.string().trim().min(3),
    workflow_id: z.string().trim().min(3),
    event_start_time: z
      .string()
      .trim()
      .optional()
      .describe("Data/hora ISO de início; padrão é agora."),
    simulate: z.boolean().default(true).describe("Somente mostrar o que seria feito."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, destructiveHint: false, openWorldHint: true },
  handler: async ({ contact_id, workflow_id, event_start_time, simulate }, ctx) => {
    const guard = await requireAdmin(ctx);
    if ("error" in guard) return guard.error;
    const startTime = event_start_time?.trim() || new Date().toISOString();
    try {
      requireGhlConfig();
      if (simulate)
        return toolJson({
          simulated: true,
          would_call: `POST /contacts/${contact_id}/workflow/${workflow_id}`,
          contact_id,
          workflow_id,
          event_start_time: startTime,
        });
      await enrollContactInWorkflow(contact_id, workflow_id, startTime);
      return toolJson({ simulated: false, contact_id, workflow_id, event_start_time: startTime });
    } catch (e) {
      return toolError((e as Error).message);
    }
  },
});
