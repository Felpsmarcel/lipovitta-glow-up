import type { ToolContext } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "./supabase";

export type ToolFailure = { content: [{ type: "text"; text: string }]; isError: true };

export function toolError(message: string): ToolFailure {
  return { content: [{ type: "text", text: message }], isError: true };
}

export function toolJson(payload: Record<string, unknown>) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload) }],
    structuredContent: payload,
  };
}

/**
 * Exige usuário autenticado com papel admin (tabela public.user_roles).
 * Retorna o cliente Supabase do usuário ou uma falha pronta para o MCP.
 */
export async function requireAdmin(ctx: ToolContext) {
  if (!ctx.isAuthenticated()) return { error: toolError("Not authenticated") } as const;
  const userId = ctx.getUserId();
  if (!userId) return { error: toolError("Not authenticated") } as const;
  const supabase = supabaseForUser(ctx);
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) return { error: toolError(`Falha ao verificar permissão: ${error.message}`) } as const;
  if (!data) return { error: toolError("Acesso negado: esta ação exige papel admin.") } as const;
  return { supabase } as const;
}
