import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { PreBlackCampaignProvider, usePreBlackCampaign } from "./PreBlackCampaignContext";
import { GiftFlowProvider, useGiftFlow } from "./GiftFlowContext";

const opening = Date.parse("2026-10-18T11:00:00Z");
const wrapper = ({ children }: { children: React.ReactNode }) => <MemoryRouter><PreBlackCampaignProvider><GiftFlowProvider>{children}</GiftFlowProvider></PreBlackCampaignProvider></MemoryRouter>;
afterEach(() => { cleanup(); vi.useRealTimers(); });
describe("campaign opening with a selection already in progress", () => {
  it("updates the selected price while preserving the chosen flavor and gift", () => {
    vi.useFakeTimers(); vi.setSystemTime(opening - 1000);
    const { result, unmount } = renderHook(() => ({ campaign: usePreBlackCampaign(), flow: useGiftFlow() }), { wrapper });
    act(() => {
      result.current.flow.selectKit({ id: "protocolo", name: "Protocolo", productCount: 2, checkoutUrl: "https://example.com/checkout", value: 474.3, flavor: "Limão", flavorId: "limao" });
      result.current.flow.setSelectedGiftId("mixer");
    });
    expect(result.current.flow.selectedKit?.value).toBe(474.3);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current.campaign.phase).toBe("live");
    expect(result.current.flow.selectedKit).toMatchObject({ value: 368.9, flavor: "Limão", flavorId: "limao" });
    expect(result.current.flow.selectedGiftId).toBe("mixer");
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("refreshes prices on returning to the tab after opening", () => {
    vi.useFakeTimers(); vi.setSystemTime(opening - 1000);
    const { result } = renderHook(usePreBlackCampaign, { wrapper });
    act(() => { vi.setSystemTime(opening + 1000); document.dispatchEvent(new Event("visibilitychange")); });
    expect(result.current.phase).toBe("live");
  });
  it("shares the forced preview phase with prices and the checkout gate", () => {
    vi.useFakeTimers(); vi.setSystemTime(opening - 1000);
    const demoWrapper = ({ children }: { children: React.ReactNode }) => <MemoryRouter initialEntries={["/?fase=live"]}><PreBlackCampaignProvider><GiftFlowProvider>{children}</GiftFlowProvider></PreBlackCampaignProvider></MemoryRouter>;
    const { result } = renderHook(() => ({ campaign: usePreBlackCampaign(), flow: useGiftFlow() }), { wrapper: demoWrapper });
    expect(result.current.campaign).toEqual({ phase: "live", demo: true });
    act(() => result.current.flow.selectKit({ id: "shot-rush", name: "Rush", productCount: 1, checkoutUrl: "https://example.com/checkout", value: 225 }));
    expect(result.current.flow.selectedKit?.value).toBe(157.5);
  });
});
