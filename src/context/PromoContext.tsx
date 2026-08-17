import { createContext, useContext, useMemo, type ReactNode } from "react";

export interface PromoKit {
  id: string;
  name: string;
  productCount: number;
  checkoutUrl: string;
  originalValue: number;
  value: number;
  sku: string;
}

interface PromoContextValue {
  isPromoActive: boolean;
  endsAt: Date;
  getDiscountRate: (productCount: number) => number;
  applyDiscount: (value: number, productCount: number) => number;
  formatMoney: (value: number) => string;
  applyToKit: <T extends { productCount: number; value: number }>(kit: T) => T;
}

const PromoContext = createContext<PromoContextValue | undefined>(undefined);

/** Período da promoção de aniversário: todo o mês de agosto de 2026. */
const PROMO_START = new Date("2026-08-01T00:00:00-03:00");
const PROMO_END = new Date("2026-08-31T23:59:59-03:00");

export function PromoProvider({ children }: { children: ReactNode }) {
  const isPromoActive = useMemo(() => {
    const now = new Date();
    return now >= PROMO_START && now <= PROMO_END;
  }, []);

  const getDiscountRate = (productCount: number) => {
    if (productCount >= 3) return 0.4;
    if (productCount === 2) return 0.3;
    return 0.2;
  };

  const applyDiscount = (value: number, productCount: number) => {
    const rate = getDiscountRate(productCount);
    return Math.round(value * (1 - rate) * 100) / 100;
  };

  const applyToKit = <T extends { productCount: number; value: number }>(kit: T): T => {
    if (!isPromoActive) return kit;
    return { ...kit, value: applyDiscount(kit.value, kit.productCount) };
  };

  const formatMoney = (value: number) =>
    value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <PromoContext.Provider
      value={{
        isPromoActive,
        endsAt: PROMO_END,
        getDiscountRate,
        applyDiscount,
        formatMoney,
        applyToKit,
      }}
    >
      {children}
    </PromoContext.Provider>
  );
}

export function usePromo() {
  const ctx = useContext(PromoContext);
  if (!ctx) {
    throw new Error("usePromo must be used within a PromoProvider");
  }
  return ctx;
}

/** Aplica o desconto promocional a um kit quando a promoção de aniversário está ativa. */
export function usePromoKit<T extends { productCount: number; value: number }>(kit: T): T {
  const { applyToKit } = usePromo();
  return applyToKit(kit);
}
