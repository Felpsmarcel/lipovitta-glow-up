import { describe, expect, it } from "vitest";
import { BASE_PRICES, getCampaignPrice, getCurrentCampaignPrice, type CatalogId } from "./campaignPricing";
import { resolvePreBlackPhase, isPhaseOverrideHost } from "./preBlack";

const opening = Date.parse("2026-10-18T11:00:00Z");
describe("Pré Black prices and preview boundaries", () => {
  it.each(Object.keys(BASE_PRICES))("shows full price for %s during Pré Black (30%% comes from coupon)", (id) => {
    const price = getCurrentCampaignPrice(id as CatalogId, opening);
    expect(price).toEqual({ value: BASE_PRICES[id as CatalogId], originalValue: BASE_PRICES[id as CatalogId], discountPct: 0, hasDiscount: false });
  });
  it("keeps current prices before opening and full price after", () => {
    expect(getCurrentCampaignPrice("kit-completo", opening - 1).value).toBe(676.8);
    expect(getCurrentCampaignPrice("kit-completo", opening).value).toBe(752);
    expect(getCurrentCampaignPrice("capsulas", opening - 1).value).toBe(357);
    expect(getCampaignPrice("shot-rush", "live").value).toBe(225);
  });
  it.each(["lipovitta.site", "www.lipovitta.site", "lipovitta.lovable.app", "evil-lipovitta.site"])("ignores the phase query on production host %s", (host) => {
    expect(resolvePreBlackPhase("?fase=live", opening - 1, host)).toEqual({ phase: "teaser", demo: false });
  });
  it("permits only an actual preview host or localhost", () => {
    expect(isPhaseOverrideHost("id-preview--f9f3dfdc.lovable.app")).toBe(true);
    expect(isPhaseOverrideHost("localhost")).toBe(true);
    expect(resolvePreBlackPhase("?fase=live", opening - 1, "localhost")).toEqual({ phase: "live", demo: true });
  });
});
