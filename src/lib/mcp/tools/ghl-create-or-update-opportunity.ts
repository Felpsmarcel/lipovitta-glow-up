import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import {
  buildOpportunityPayload,
  createOpportunity,
  findOpportunity,
  ghlLocationId,
  requireGhlConfig,
  updateOpportunity,
  type OpportunityInput,
} from "../../ghlApi";
import { requireAdmin, toolError, toolJson } from "../admin";

export default defineTool({
  name: "ghl_create_or_update_opportunity",
  title: "Criar/atualizar oportunidade",
  description:
    "Escrita (simulate=true por padrão): cria ou atualiza uma oportunidade no HighLevel. Com opportunity_id atualiza; sem ele procura uma oportunidade compatível do contato no pipeline antes de criar, evitando duplicata.",
  inputSchema: {
    contact_id: z.string().trim().min(3),
    pipeline_id: z.string().trim().min(3),
    name: z.string().trim().min(1).max(200),
    status: z
      .string()
      .trim()
      .default("open")
      .describe("Status da oportunidade: open, won, lost, abandoned."),
    pipeline_stage_id: z.string().trim().optional(),
    monetary_value: z.number().optional(),
    assigned_to: z.string().trim().optional(),
    opportunity_id: z.string().trim().optional().describe("Se informado, atualiza esta oportunidade."),
    simulate: z.boolean().default(true).describe("Somente mostrar o que seria feito."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, destructiveHint: false, openWorldHint: true },
  handler: async (input, ctx) => {
    const guard = await requireAdmin(ctx);
    if ("error" in guard) return guard.error;
    const oppInput: OpportunityInput = {
      contact_id: input.contact_id,
      pipeline_id: input.pipeline_id,
      name: input.name,
      status: input.status,
      pipeline_stage_id: input.pipeline_stage_id ?? null,
      monetary_value: input.monetary_value ?? null,
      assigned_to: input.assigned_to ?? null,
      opportunity_id: input.opportunity_id ?? null,
    };
    try {
      requireGhlConfig();
      if (input.simulate)
        return toolJson({
          simulated: true,
          would_call: input.opportunity_id
            ? `PUT /opportunities/${input.opportunity_id}`
            : "POST /opportunities/ (após busca de duplicata)",
          payload: buildOpportunityPayload(oppInput, ghlLocationId()),
        });
      if (input.opportunity_id) {
        const updated = await updateOpportunity(input.opportunity_id, oppInput);
        return toolJson({ simulated: false, action: "updated", opportunity_id: updated?.id ?? input.opportunity_id });
      }
      const existing = await findOpportunity(input.contact_id, input.pipeline_id);
      if (existing?.id) {
        const updated = await updateOpportunity(existing.id, oppInput);
        return toolJson({ simulated: false, action: "updated", opportunity_id: updated?.id ?? existing.id });
      }
      const created = await createOpportunity(oppInput);
      return toolJson({ simulated: false, action: "created", opportunity_id: created?.id ?? null });
    } catch (e) {
      return toolError((e as Error).message);
    }
  },
});
