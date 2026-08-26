import { describe, it, expect } from "vitest";
import {
  maskEmail,
  maskPhone,
  idempotencyKey,
  isTestOrderId,
  normalizePhoneBR,
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
