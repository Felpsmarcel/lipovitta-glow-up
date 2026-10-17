/**
 * Preços da Pré Black LipoVitta — fonte única de valores-base e da regra
 * de campanha, compartilhada entre OfferSection, ProductsSection e tracking.
 *
 * Regra confirmada pelo usuário em 17/10/2026: 30% de desconto em TODOS os
 * produtos do catálogo avulso ativo e kits, aplicado UMA VEZ sobre a base
 * integral (substitui o 10% dos kits; nunca cumulativo). Ativo somente a
 * partir da abertura real (PRE_BLACK_CONFIG.startsAt); antes disso valem os
 * preços atuais do site. O override visual ?fase=live (apenas preview/dev)
 * mostra a tabela promocional para revisão, sem antecipar promoção em
 * produção — o checkout final depende da regra correspondente na Yampi.
 */
import { getPreBlackPhase, type PreBlackPhase } from "@/config/preBlack";

/** Desconto da campanha: 30% sobre a base integral, aplicado uma única vez. */
export const PRE_BLACK_DISCOUNT_RATE = 0.3;

/** Desconto vigente fora da campanha (kits com 10% OFF). */
export const DEFAULT_KIT_DISCOUNT_RATE = 0.1;

/** Valores-base integrais cadastrados no site (R$). */
export const BASE_PRICES = {
  capsulas: 357.0,
  "shot-matinal": 170.0,
  "shot-rush": 225.0,
  protocolo: 527.0,
  "kit-rush": 582.0,
  "kit-completo": 752.0,
} as const;

export type CatalogId = keyof typeof BASE_PRICES;

/** Kits que já tinham 10% OFF fora da campanha. */
export const DEFAULT_DISCOUNT_IDS: readonly CatalogId[] = ["kit-completo", "kit-rush", "protocolo"];

const round2 = (v: number) => Math.round(v * 100) / 100;

export type CampaignPrice = {
  /** Preço vigente a exibir/cobrar. */
  value: number;
  /** Base integral (para "de/por"). */
  originalValue: number;
  /** Percentual de desconto vigente (0, 10 ou 30). */
  discountPct: number;
  hasDiscount: boolean;
};

/**
 * Preço vigente de um item do catálogo conforme a fase da campanha.
 * - live: 30% OFF em todos os itens, uma única vez sobre a base.
 * - teaser: regra atual do site (10% OFF apenas nos kits).
 */
export function getCampaignPrice(id: CatalogId, phase: PreBlackPhase): CampaignPrice {
  const base = BASE_PRICES[id];
  if (phase === "live") {
    return {
      value: round2(base * (1 - PRE_BLACK_DISCOUNT_RATE)),
      originalValue: base,
      discountPct: Math.round(PRE_BLACK_DISCOUNT_RATE * 100),
      hasDiscount: true,
    };
  }
  const hasDefault = DEFAULT_DISCOUNT_IDS.includes(id);
  return {
    value: hasDefault ? round2(base * (1 - DEFAULT_KIT_DISCOUNT_RATE)) : base,
    originalValue: base,
    discountPct: hasDefault ? Math.round(DEFAULT_KIT_DISCOUNT_RATE * 100) : 0,
    hasDiscount: hasDefault,
  };
}

/** Conveniência: fase real pelo relógio. */
export function getCurrentCampaignPrice(id: CatalogId, now = Date.now()): CampaignPrice {
  return getCampaignPrice(id, getPreBlackPhase(now));
}

export const formatMoney = (value: number) =>
  value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
