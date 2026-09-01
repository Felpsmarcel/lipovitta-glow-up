import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { addContactTags, normalizeTags, requireGhlConfig } from "../../ghlApi";
import { requireAdmin, toolError, toolJson } from "../admin";

export default defineTool({
  name: "ghl_add_tags",
  title: "Adicionar tags a um contato",
  description:
    "Escrita (simulate=true por padrão): adiciona tags a um contato do HighLevel. As tags são sanitizadas e deduplicadas antes do envio.",
  inputSchema: {
    contact_id: z.string().trim().min(3),
    tags: z.array(z.string()).min(1),
    simulate: z.boolean().default(true).describe("Somente mostrar o que seria feito."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, destructiveHint: false, openWorldHint: true },
  handler: async ({ contact_id, tags, simulate }, ctx) => {
    const guard = await requireAdmin(ctx);
    if ("error" in guard) return guard.error;
    const clean = normalizeTags(tags);
    if (!clean.length) return toolError("Nenhuma tag válida após sanitização.");
    try {
      requireGhlConfig();
      if (simulate)
        return toolJson({
          simulated: true,
          would_call: `POST /contacts/${contact_id}/tags`,
          contact_id,
          tags: clean,
        });
      await addContactTags(contact_id, clean);
      return toolJson({ simulated: false, contact_id, tags_added: clean });
    } catch (e) {
      return toolError((e as Error).message);
    }
  },
});
