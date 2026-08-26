// Espelho de src/lib/privacy.ts (Edge Functions não podem importar de src/).
// Os testes vivem em src/lib/privacy.test.ts — mantenha as duas cópias iguais.

export function maskEmail(value: unknown): string {
  const email = String(value ?? "").trim();
  if (!email || !email.includes("@")) return email ? "***" : "";
  const [local, domain] = email.split("@");
  const head = local.slice(0, 2);
  return `${head}${local.length > 2 ? "***" : "*"}@${domain}`;
}

export function maskPhone(value: unknown): string {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length <= 4) return "*".repeat(digits.length);
  const head = digits.slice(0, 2);
  const tail = digits.slice(-4);
  return `${head}${"*".repeat(Math.max(1, digits.length - 6))}${tail}`;
}

export function idempotencyKey(action: string, ref: string): string {
  return `${action.trim().toLowerCase()}:${ref.trim().toLowerCase()}`;
}

export function isTestOrderId(orderId: unknown): boolean {
  return /^test/i.test(String(orderId ?? "").trim());
}

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
