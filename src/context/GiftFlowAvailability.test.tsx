import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GiftFlowProvider, useGiftFlow } from "./GiftFlowContext";
import { MemoryRouter } from "react-router-dom";
import { PreBlackCampaignProvider } from "./PreBlackCampaignContext";

const wrapper = ({ children }: { children: React.ReactNode }) => <MemoryRouter><PreBlackCampaignProvider><GiftFlowProvider>{children}</GiftFlowProvider></PreBlackCampaignProvider></MemoryRouter>;

afterEach(cleanup);

describe("selection stock gate", () => {
  it.each(["shot-rush", "kit-rush", "kit-completo"])("rejects %s before the gift/checkout step", (id) => {
    const { result } = renderHook(useGiftFlow, { wrapper });
    act(() => result.current.selectKit({ id, name: id, productCount: 1, checkoutUrl: "https://example.com", value: 225 }));
    expect(result.current.selectedKit).toBeNull();
  });
  it("preserves an available Protocolo selection when an unavailable kit is attempted", () => {
    const { result } = renderHook(useGiftFlow, { wrapper });
    act(() => {
      result.current.selectKit({ id: "protocolo", name: "Protocolo", productCount: 2, checkoutUrl: "https://example.com", flavor: "Limão", flavorId: "limao", requiresFlavor: true });
      result.current.setSelectedGiftId("mixer");
      result.current.selectKit({ id: "kit-completo", name: "Kit Completo", productCount: 3, checkoutUrl: "https://example.com" });
    });
    expect(result.current.selectedKit).toMatchObject({ id: "protocolo", flavor: "Limão" });
    expect(result.current.selectedGiftId).toBe("mixer");
  });
});