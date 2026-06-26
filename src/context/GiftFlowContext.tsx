import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type SelectedKit = {
  id: string;
  name: string;
  productCount: 1 | 2 | 3;
  checkoutUrl: string;
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
  const [selectedKit, setSelectedKit] = useState<SelectedKit | null>(null);
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);

  const selectKit = useCallback((kit: SelectedKit) => {
    setSelectedKit(kit);
    setSelectedGiftId(null);
    // Smooth scroll to the gift section
    requestAnimationFrame(() => {
      const el = document.getElementById("escolha-brinde");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
