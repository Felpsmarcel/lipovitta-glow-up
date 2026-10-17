import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { usePreBlackCampaign } from "@/context/PreBlackCampaignContext";
import { BASE_PRICES, getCampaignPrice, type CatalogId } from "@/config/campaignPricing";

export type SelectedKit = {
  id: string;
  name: string;
  productCount: 1 | 2 | 3;
  checkoutUrl: string;
  value?: number;
  sku?: string;
  /** Rótulo do sabor escolhido do Shot Matinal (ex.: "Limão"). */
  flavor?: string;
  /** Id normalizado do sabor, usado no link e no rastreio (ex.: "limao"). */
  flavorId?: string;
  /** Indica que o kit inclui Shot Matinal e exige escolha de sabor. */
  requiresFlavor?: boolean;
};


type GiftFlowContextValue = {
  selectedKit: SelectedKit | null;
  selectedGiftId: string | null;
  selectKit: (kit: SelectedKit) => void;
  setSelectedGiftId: (id: string | null) => void;
  reset: () => void;
};

const GiftFlowContext = createContext<GiftFlowContextValue | null>(null);

export const GiftFlowProvider = ({ children }: { children: ReactNode }) => {
  const [selection, setSelectedKit] = useState<SelectedKit | null>(null);
  const { phase } = usePreBlackCampaign();
  // Derive price from the same phase as the cards, retaining flavor and gift at opening.
  const selectedKit = useMemo(() => selection && Object.prototype.hasOwnProperty.call(BASE_PRICES, selection.id)
    ? { ...selection, value: getCampaignPrice(selection.id as CatalogId, phase).value }
    : selection, [selection, phase]);
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);

  const selectKit = useCallback((kit: SelectedKit) => {
    setSelectedKit(kit);
    setSelectedGiftId(null);
    // Smooth scroll to the gift section
    requestAnimationFrame(() => {
      const el = document.getElementById("escolha-brinde");
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  }, []);

  const reset = useCallback(() => {
    setSelectedKit(null);
    setSelectedGiftId(null);
  }, []);

  const value = useMemo(
    () => ({ selectedKit, selectedGiftId, selectKit, setSelectedGiftId, reset }),
    [selectedKit, selectedGiftId, selectKit, reset]
  );

  return <GiftFlowContext.Provider value={value}>{children}</GiftFlowContext.Provider>;
};

export const useGiftFlow = () => {
  const ctx = useContext(GiftFlowContext);
  if (!ctx) throw new Error("useGiftFlow must be used within GiftFlowProvider");
  return ctx;
};
