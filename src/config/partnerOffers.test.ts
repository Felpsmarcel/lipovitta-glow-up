import { describe, expect, it } from "vitest";
import { buildPartnerInterest, simulatePartnerOrder } from "./partnerOffers";

describe("Public B2B terms", () => {
  it("calculates the capsules first order in cents", () => {
    expect(simulatePartnerOrder("capsulas", 50)).toEqual({ order: 645000, entry: 322500, balance: 322500, revenue: 1245000, commission: 124500, remaining: 475500, maxExchangeUnits: 10 });
  });
  it("calculates the Shot Matinal first order in cents", () => {
    expect(simulatePartnerOrder("shot_matinal", 50)).toEqual({ order: 425000, entry: 212500, balance: 212500, revenue: 850000, commission: 85000, remaining: 340000, maxExchangeUnits: 10 });
  });
  it.each(["capsulas", "shot_matinal"] as const)("requires at least 50 whole units for %s", (product) => {
    for (const invalid of [0, 49, 50.5, NaN, Infinity, Number.MAX_SAFE_INTEGER]) expect(() => simulatePartnerOrder(product, invalid)).toThrow(RangeError);
    expect(simulatePartnerOrder(product, 51).entry + simulatePartnerOrder(product, 51).balance).toBe(simulatePartnerOrder(product, 51).order);
  });
  it("limits exchange to 20% of the first lot in whole units", () => {
    expect(simulatePartnerOrder("capsulas", 75).maxExchangeUnits).toBe(15);
    expect(simulatePartnerOrder("shot_matinal", 53).maxExchangeUnits).toBe(10);
  });
  it("keeps selected product and quantity within the 600-character public notes limit", () => {
    const notes = buildPartnerInterest("shot_matinal", 75, "a".repeat(600));
    expect(notes).toHaveLength(600);
    expect(notes).toContain("Produto de interesse: Shot Matinal LipoVitta. Quantidade: 75 unidades.");
  });
  it("preserves notes for legacy forms without product props", () => {
    expect(buildPartnerInterest(undefined, 50, "  Parceria clínica  ")).toBe("Parceria clínica");
  });
});