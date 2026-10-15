import { describe, expect, it } from "vitest";
import { parseBrNumber, parseCsv } from "./campaignCsv";
import { aggregateSales } from "../../supabase/functions/campaign-insights/aggregate";

describe("campaign CSV", () => {
  it("reads Brazilian numbers", () => {
    expect(parseBrNumber("R$ 1.234,56")).toBe(1234.56);
    expect(parseBrNumber("1,234.56")).toBe(1234.56);
    expect(parseBrNumber("abc")).toBeNull();
  });
  it("detects semicolon separator", () => {
    expect(parseCsv("Dia;Gasto\n01/10;\"1.000,50\"")).toEqual([["Dia", "Gasto"], ["01/10", "1.000,50"]]);
  });
});

describe("aggregateSales", () => {
  const order = (id: string, extra: Record<string, unknown> = {}) => ({
    order_id: id, status: "paid", value_total: 100, is_test: false, utm_source: "meta", utm_campaign: "pb", ...extra,
  });
  it("counts only paid real orders, excluding tests, canceled and order 171482339", () => {
    const s = aggregateSales(
      [
        { order_id: "1", paid_at: "2026-10-10T15:00:00Z", is_test: false },
        { order_id: "2", paid_at: "2026-10-10T15:00:00Z", is_test: true },
        { order_id: "3", paid_at: "2026-10-10T15:00:00Z", is_test: false },
        { order_id: "171482339", paid_at: "2026-10-10T15:00:00Z", is_test: false },
        { order_id: "4", paid_at: "2026-10-10T15:00:00Z", is_test: false },
      ],
      [order("1"), order("2"), order("3", { status: "cancelled" }), order("171482339"), order("4", { is_test: true })],
    );
    expect(s.orders).toBe(1);
    expect(s.revenue).toBe(100);
  });
});
