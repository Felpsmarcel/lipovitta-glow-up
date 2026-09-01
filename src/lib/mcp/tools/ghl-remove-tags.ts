import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { normalizeTags, removeContactTags, requireGhlConfig } from "../../ghlApi";
import { requireAdmin, toolError, toolJson } from "../admin";

export default defineTool({
  name: "ghl_remove_tags",
  title: "Remover tags de um contato",
  description:
    "Escrita (simulate=true por padrão): remove tags de um contato do HighLevel. As tags são sanitizadas antes do envio.",
  inputSchema: {
    contact_id: z.string().trim().min(3),
    tags: z.array(z.string()).min(1),
    simulate: z.boolean().default(true).describe("Somente mostrar o que seria feito."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, destructiveHint: true, openWorldHint: true },
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
          would_call: `DELETE /contacts/${contact_id}/tags`,
          contact_id,
          tags: clean,
        });
      await removeContactTags(contact_id, clean);
      return toolJson({ simulated: false, contact_id, tags_removed: clean });
    } catch (e) {
      return toolError((e as Error).message);
    }
  },
});
