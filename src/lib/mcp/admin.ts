import type { ToolContext } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "./supabase";
import { classify, sanitizeMessage, toolFailure } from "./errors";

export type ToolFailure = ReturnType<typeof toolFailure>;

export function toolError(message: string): ToolFailure {
  return toolFailure({
    code: "unexpected_error",
    tool: "mcp",
    stage: "unknown",
    message,
  });
}

export function toolJson(payload: Record<string, unknown>) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload) }],
    structuredContent: payload,
  };
}

/**
 * Exige usuário autenticado com papel admin (tabela public.user_roles).
 * Nunca lança: devolve o cliente Supabase do usuário ou uma falha estruturada.
 */
export async function requireAdmin(ctx: ToolContext, tool = "mcp") {
  if (!ctx.isAuthenticated() || !ctx.getUserId())
    return {
      error: toolFailure({
        code: "not_authenticated",
        tool,
        stage: "auth",
        message: "Requisição sem usuário autenticado.",
      }),
    } as const;

  const userId = ctx.getUserId() as string;

  try {
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (error) {
      const message = sanitizeMessage(error.message);
      const detected = classify(message);
      return {
        error: toolFailure({
          code: detected === "unexpected_error" ? "authorization_unavailable" : detected,
          tool,
          stage: "authorization",
          message: `Falha ao verificar permissão: ${message}`,
        }),
      } as const;
    }

    if (!data)
      return {
        error: toolFailure({
          code: "forbidden",
          tool,
          stage: "authorization",
          message: "Acesso negado: esta ação exige papel admin.",
        }),
      } as const;

    return { supabase } as const;
  } catch (err) {
    const message = sanitizeMessage(err);
    return {
      error: toolFailure({
        code: classify(message),
        tool,
        stage: "authorization",
        message,
      }),
    } as const;
  }
}
