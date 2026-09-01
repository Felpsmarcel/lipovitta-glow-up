import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import {
  addContactTags,
  buildUpsertContactPayload,
  ghlLocationId,
  maskContact,
  normalizeTags,
  requireGhlConfig,
  upsertContact,
} from "../../ghlApi";
import { requireAdmin, toolError, toolJson } from "../admin";

export default defineTool({
  name: "ghl_upsert_contact",
  title: "Criar/atualizar contato no HighLevel",
  description:
    "Escrita (simulate=true por padrão): cria ou atualiza um contato na subconta LipoVitta via /contacts/upsert e adiciona tags separadamente sem sobrescrever as existentes. Rode com simulate=true antes de executar de verdade.",
  inputSchema: {
    first_name: z.string().trim().max(120).optional(),
    last_name: z.string().trim().max(120).optional(),
    email: z.string().trim().email().optional(),
    phone: z.string().trim().max(30).optional(),
    source: z.string().trim().max(80).optional().describe("Origem do contato, ex.: yampi, site."),
    tags: z
      .array(z.string())
      .optional()
      .describe("Tags a adicionar depois do upsert, sem sobrescrever tags existentes."),
    simulate: z.boolean().default(true).describe("Somente mostrar o que seria feito."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, destructiveHint: false, openWorldHint: true },
  handler: async ({ first_name, last_name, email, phone, source, tags, simulate }, ctx) => {
    const guard = await requireAdmin(ctx);
    if ("error" in guard) return guard.error;
    if (!email && !phone) return toolError("Informe pelo menos e-mail ou telefone para o upsert.");
    const contact = { first_name, last_name, email, phone, source };
    const cleanTags = normalizeTags(tags);
    try {
      requireGhlConfig();
      if (simulate)
        return toolJson({
          simulated: true,
          would_call: cleanTags.length ? ["POST /contacts/upsert", "POST /contacts/:contactId/tags"] : ["POST /contacts/upsert"],
          payload: buildUpsertContactPayload(contact, ghlLocationId()),
          contact_masked: maskContact(contact),
          tags_to_add: cleanTags,
        });
      const result = await upsertContact(contact);
      if (result.contact_id && cleanTags.length) await addContactTags(result.contact_id, cleanTags);
      return toolJson({
        simulated: false,
        contact_id: result.contact_id,
        state: result.new ? "new" : "updated",
        contact_masked: maskContact(contact),
        tags_added: result.contact_id ? cleanTags : [],
      });
    } catch (e) {
      return toolError((e as Error).message);
    }
  },
});
