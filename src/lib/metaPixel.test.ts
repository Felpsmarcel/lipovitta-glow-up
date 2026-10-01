import { describe, expect, it } from "vitest";
import { pixelUserData } from "./metaPixel";

describe("pixelUserData (correspondência avançada)", () => {
  it("normaliza e-mail, telefone e nome completo", () => {
    expect(
      pixelUserData({ email: "  Maria@Email.com ", phone: "(71) 99615-0401", name: "Maria Silva" })
    ).toEqual({ em: "maria@email.com", ph: "5571996150401", fn: "maria", ln: "silva" });
  });

  it("mantém o DDI 55 quando já presente", () => {
    expect(pixelUserData({ phone: "5511987654321" }).ph).toBe("5511987654321");
  });

  it("usa só o primeiro nome quando não há sobrenome", () => {
    expect(pixelUserData({ name: "Clara" })).toEqual({ fn: "clara" });
  });

  it("ignora e-mail inválido e campos vazios", () => {
    expect(pixelUserData({ email: "sem-arroba", phone: "", name: "  " })).toEqual({});
  });

  it("retorna objeto vazio sem dados", () => {
    expect(pixelUserData({})).toEqual({});
  });
});
