import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import {
  buildUpsertContactPayload,
  ghlLocationId,
  maskContact,
  requireGhlConfig,
  upsertContact,
} from "../../ghlApi";
import { requireAdmin, toolError, toolJson } from "../admin";

export default defineTool({
  name: "ghl_upsert_contact",
  title: "Criar/atualizar contato no HighLevel",
  description:
    "Escrita (simulate=true por padrão): cria ou atualiza um contato na subconta LipoVitta via /contacts/upsert. Não sobrescreve tags existentes — use ghl_add_tags para tags. Rode com simulate=true antes de executar de verdade.",
  inputSchema: {
    first_name: z.string().trim().max(120).optional(),
    last_name: z.string().trim().max(120).optional(),
    email: z.string().trim().email().optional(),
    phone: z.string().trim().max(30).optional(),
    source: z.string().trim().max(80).optional().describe("Origem do contato, ex.: yampi, site."),
    tags: z
      .array(z.string())
      .optional()
      .describe("Tags a adicionar após o upsert (aplicadas por Add Tags, sem sobrescrever)."),
    simulate: z.boolean().default(true).describe("Somente mostrar o que seria feito."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, destructiveHint: false, openWorldHint: true },
  handler: async ({ first_name, last_name, email, phone, source, tags, simulate }, ctx) => {
    const guard = await requireAdmin(ctx);
    if ("error" in guard) return guard.error;
    if (!email && !phone) return toolError("Informe pelo menos e-mail ou telefone para o upsert.");
    const contact = { first_name, last_name, email, phone, source };
    try {
      requireGhlConfig();
      if (simulate)
        return toolJson({
          simulated: true,
          would_call: "POST /contacts/upsert",
          payload: buildUpsertContactPayload(contact, ghlLocationId()),
          contact_masked: maskContact(contact),
          pending_tags: tags ?? [],
        });
      const result = await upsertContact(contact);
      return toolJson({
        simulated: false,
        contact_id: result.contact_id,
        state: result.new ? "new" : "updated",
        contact_masked: maskContact(contact),
        pending_tags: tags ?? [],
        note: tags?.length ? "Use ghl_add_tags para aplicar as tags ao contato." : undefined,
      });
    } catch (e) {
      return toolError((e as Error).message);
    }
  },
});
