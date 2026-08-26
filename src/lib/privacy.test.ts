import { describe, it, expect } from "vitest";
import {
  maskEmail,
  maskPhone,
  idempotencyKey,
  isTestOrderId,
  normalizePhoneBR,
  buyerHash,
  sha256Hex,
} from "./privacy";

describe("maskEmail", () => {
  it("mantém apenas os dois primeiros caracteres e o domínio", () => {
    expect(maskEmail("maria@dominio.com")).toBe("ma***@dominio.com");
  });
  it("lida com locais curtos", () => {
    expect(maskEmail("ab@x.com")).toBe("ab*@x.com");
  });
  it("não vaza valores inválidos", () => {
    expect(maskEmail("sem-arroba")).toBe("***");
    expect(maskEmail("")).toBe("");
    expect(maskEmail(undefined)).toBe("");
  });
});

describe("maskPhone", () => {
  it("mostra apenas prefixo e últimos 4 dígitos", () => {
    expect(maskPhone("+55 (11) 98765-4321")).toBe("55*******4321");
  });
  it("mascara totalmente números curtos", () => {
    expect(maskPhone("123")).toBe("***");
  });
  it("retorna vazio sem dígitos", () => {
    expect(maskPhone("abc")).toBe("");
  });
});

describe("idempotencyKey", () => {
  it("é determinística e normalizada", () => {
    expect(idempotencyKey("Recovery", " ABC123 ")).toBe("recovery:abc123");
    expect(idempotencyKey("recovery", "abc123")).toBe(idempotencyKey("RECOVERY", "ABC123"));
  });
});

describe("isTestOrderId", () => {
  it("detecta pedidos de teste", () => {
    expect(isTestOrderId("TEST123")).toBe(true);
    expect(isTestOrderId("test457")).toBe(true);
    expect(isTestOrderId("90210")).toBe(false);
    expect(isTestOrderId(null)).toBe(false);
  });
});

describe("normalizePhoneBR", () => {
  it("prefixa 55 quando ausente", () => {
    expect(normalizePhoneBR("(11) 98765-4321")).toBe("5511987654321");
    expect(normalizePhoneBR("5511987654321")).toBe("5511987654321");
    expect(normalizePhoneBR("")).toBe("");
  });
});

describe("buyerHash", () => {
  it("usa o e-mail normalizado quando existe", async () => {
    const a = await buyerHash("Maria@Dominio.com ", "11987654321");
    const b = await buyerHash("maria@dominio.com");
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(a).not.toContain("maria");
  });

  it("cai para o telefone normalizado sem e-mail", async () => {
    const a = await buyerHash(null, "(11) 98765-4321");
    const b = await sha256Hex("5511987654321");
    expect(a).toBe(b);
  });

  it("retorna null sem identificadores", async () => {
    expect(await buyerHash(null, null)).toBeNull();
    expect(await buyerHash("sem-arroba", "")).toBeNull();
  });

  it("compradores distintos geram hashes distintos (unique_buyers != unique_orders)", async () => {
    const hashes = await Promise.all([
      buyerHash("a@x.com"),
      buyerHash("a@x.com"),
      buyerHash("b@x.com"),
    ]);
    expect(new Set(hashes).size).toBe(2);
  });
});
