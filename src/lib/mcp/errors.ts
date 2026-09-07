/**
 * Erros estruturados e sanitizados para as ferramentas MCP.
 *
 * Nenhuma ferramenta pode deixar uma exceção escapar: o cliente MCP converteria
 * isso em `-32603 Internal error`, sem informação útil. Todo handler roda dentro
 * de `runTool`, que devolve `{ code, tool, stage, message }` já limpo de token,
 * URL secreta e dados pessoais.
 */

export type ToolErrorCode =
  | "not_authenticated"
  | "forbidden"
  | "authorization_unavailable"
  | "backend_unavailable"
  | "query_failed"
  | "config_error"
  | "unexpected_error";

export type StructuredToolError = {
  ok: false;
  code: ToolErrorCode;
  tool: string;
  stage: string;
  message: string;
};

const SENSITIVE_PATTERNS: readonly RegExp[] = [
  /https?:\/\/\S+/gi, // URLs (podem conter tokens/refs)
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.?[A-Za-z0-9_-]*/g, // JWT
  /\b(sb_[a-z]+_[A-Za-z0-9_-]{8,}|pit-[A-Za-z0-9-]{8,})\b/g, // chaves Supabase / token GHL
  /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, // e-mail
  /\+?\d[\d\s().-]{8,}\d/g, // telefone
];

/** Remove segredos e PII de qualquer mensagem antes de devolver ao cliente. */
export function sanitizeMessage(input: unknown): string {
  let text =
    input instanceof Error
      ? input.message
      : typeof input === "string"
        ? input
        : (() => {
            try {
              return JSON.stringify(input);
            } catch {
              return String(input);
            }
          })();
  if (!text) text = "Erro sem descrição.";
  for (const pattern of SENSITIVE_PATTERNS) text = text.replace(pattern, "[oculto]");
  return text.slice(0, 400);
}

export function classify(message: string): ToolErrorCode {
  const m = message.toLowerCase();
  if (m.includes("permission denied for function has_role")) return "authorization_unavailable";
  if (m.includes("permission denied") || m.includes("row-level security")) return "forbidden";
  if (
    m.includes("fetch failed") ||
    m.includes("connection") ||
    m.includes("timeout") ||
    m.includes("econnrefused") ||
    m.includes("paused") ||
    m.includes("503") ||
    m.includes("upstream")
  )
    return "backend_unavailable";
  return "unexpected_error";
}

export function toolFailure(params: {
  code: ToolErrorCode;
  tool: string;
  stage: string;
  message: string;
}) {
  const payload: StructuredToolError = {
    ok: false,
    code: params.code,
    tool: params.tool,
    stage: params.stage,
    message: sanitizeMessage(params.message),
  };
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload) }],
    structuredContent: payload as unknown as Record<string, unknown>,
    isError: true as const,
  };
}

/** Falha derivada de um erro do Supabase/PostgREST. */
export function queryFailure(tool: string, stage: string, error: unknown) {
  const message = sanitizeMessage(error);
  const detected = classify(message);
  return toolFailure({
    code: detected === "unexpected_error" ? "query_failed" : detected,
    tool,
    stage,
    message,
  });
}

/**
 * Executa o handler capturando qualquer exceção. `stage` é atualizado pelo
 * próprio handler para indicar onde a falha aconteceu.
 */
export async function runTool<T>(
  tool: string,
  fn: (setStage: (stage: string) => void) => Promise<T>
): Promise<T | ReturnType<typeof toolFailure>> {
  let stage = "start";
  try {
    return await fn((next) => {
      stage = next;
    });
  } catch (err) {
    const message = sanitizeMessage(err);
    return toolFailure({ code: classify(message), tool, stage, message });
  }
}
