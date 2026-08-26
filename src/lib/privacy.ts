/**
 * Utilitários puros de privacidade e idempotência.
 *
 * Estas funções são espelhadas em `supabase/functions/_shared/privacy.ts`
 * porque Edge Functions (Deno) não podem importar de `src/`. Mantenha as duas
 * cópias em sincronia — os testes em `src/lib/privacy.test.ts` cobrem esta.
 */

/** Mascara um e-mail para logs: "maria@dominio.com" -> "ma***@dominio.com". */
export function maskEmail(value: unknown): string {
  const email = String(value ?? "").trim();
  if (!email || !email.includes("@")) return email ? "***" : "";
  const [local, domain] = email.split("@");
  const head = local.slice(0, 2);
  return `${head}${local.length > 2 ? "***" : "*"}@${domain}`;
}

/** Mascara um telefone para logs: "5511987654321" -> "55*******4321". */
export function maskPhone(value: unknown): string {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length <= 4) return "*".repeat(digits.length);
  const head = digits.slice(0, 2);
  const tail = digits.slice(-4);
  return `${head}${"*".repeat(Math.max(1, digits.length - 6))}${tail}`;
}

/** Chave determinística para ações do MCP (tabela mcp_action_log). */
export function idempotencyKey(action: string, ref: string): string {
  return `${action.trim().toLowerCase()}:${ref.trim().toLowerCase()}`;
}

/** Um pedido é considerado de teste quando o identificador começa com TEST. */
export function isTestOrderId(orderId: unknown): boolean {
  return /^test/i.test(String(orderId ?? "").trim());
}

/** Normaliza um telefone brasileiro para o formato 55DDD........ */
export function normalizePhoneBR(value: unknown): string {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? digits : `55${digits}`;
}

/** SHA-256 hex (Web Crypto — disponível no navegador e no Deno). */
export async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Identificador irreversível do comprador para contagem de compradores únicos.
 * Prefere o e-mail normalizado; se ausente, usa o telefone normalizado.
 * Retorna null quando não há nenhum identificador.
 */
export async function buyerHash(
  email?: unknown,
  phone?: unknown
): Promise<string | null> {
  const mail = String(email ?? "").trim().toLowerCase();
  if (mail && mail.includes("@")) return sha256Hex(mail);
  const tel = normalizePhoneBR(phone);
  if (tel) return sha256Hex(tel);
  return null;
}
