import { describe, expect, it } from "vitest";
import { BASE_PRICES, getCampaignPrice, getCurrentCampaignPrice, type CatalogId } from "./campaignPricing";
import { resolvePreBlackPhase, isPhaseOverrideHost } from "./preBlack";

const opening = Date.parse("2026-10-18T11:00:00Z");
describe("Pré Black prices and preview boundaries", () => {
  it.each(Object.entries({ capsulas: 249.9, "shot-matinal": 119, "shot-rush": 157.5, protocolo: 368.9, "kit-rush": 407.4, "kit-completo": 526.4 }))("applies 30 percent once to %s", (id, expected) => {
    const price = getCurrentCampaignPrice(id as CatalogId, opening);
    expect(price).toEqual({ value: expected, originalValue: BASE_PRICES[id], discountPct: 30, hasDiscount: true });
  });
  it("retains current prices until the opening instant, without stacking 10 and 30 percent", () => {
    expect(getCurrentCampaignPrice("kit-completo", opening - 1).value).toBe(676.8);
    expect(getCurrentCampaignPrice("kit-completo", opening).value).toBe(526.4);
    expect(getCurrentCampaignPrice("capsulas", opening - 1).value).toBe(357);
    expect(getCurrentCampaignPrice("shot-rush", opening + 1).value).toBe(157.5);
  });
  it("only the larger discounted kits meet the existing free shipping minimum", () => {
    expect(getCampaignPrice("protocolo", "live").value < 400).toBe(true);
    expect(getCampaignPrice("kit-rush", "live").value >= 400).toBe(true);
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
