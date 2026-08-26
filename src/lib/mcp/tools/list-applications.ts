import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_applications",
  title: "Listar candidaturas",
  description:
    "Lista as candidaturas recebidas de afiliadas ou de parceiros comerciais do site LipoVitta.",
  inputSchema: {
    type: z
      .enum(["afiliada", "parceiro"])
      .default("afiliada")
      .describe("Tipo de candidatura a listar."),
    limit: z.number().int().min(1).max(100).default(25).describe("Máximo de linhas."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ type, limit }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const table =
      type === "parceiro" ? "commercial_partner_applications" : "affiliate_applications";
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { type, items: data ?? [], count: data?.length ?? 0 },
    };
  },
});
