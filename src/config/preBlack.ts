/**
 * Pré Black LipoVitta — venda direta, sem grupo VIP nem captação.
 * Antes da abertura: contador + apresentação dos produtos.
 * Após a abertura: hero comercial + ofertas do site.
 */
export const PRE_BLACK_CONFIG = {
  /** Abertura oficial da Pré Black: domingo 18/10/2026 às 08:00 (America/Bahia). */
  startsAt: "2026-10-18T08:00:00-03:00",
  /** Rótulos de data derivados de startsAt — nunca editar textos soltos nas páginas. */
  dateLabel: "18 de outubro",
  shortDateLabel: "18/10",
  eyebrowDateLabel: "18.10 / 08H",
  timeLabel: "08 horas",
} as const;

export function getPreBlackCountdown(now = Date.now()) {
  const remaining = Math.max(0, new Date(PRE_BLACK_CONFIG.startsAt).getTime() - now);
  const seconds = Math.floor(remaining / 1000);
  return {
    started: remaining === 0,
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

export type PreBlackPhase = "teaser" | "live";

/** Fase da campanha: antes da abertura (antecipação) ou após (vendas). */
export function getPreBlackPhase(now = Date.now()): PreBlackPhase {
  return now >= new Date(PRE_BLACK_CONFIG.startsAt).getTime() ? "live" : "teaser";
}

/**
 * Override de fase apenas para demonstração no preview (?fase=teaser|live).
 * Nunca altera checkout, preços ou a data real — só a aparência da página.
 */
export function resolvePreBlackPhase(search: string, now = Date.now()): { phase: PreBlackPhase; demo: boolean } {
  const forced = new URLSearchParams(search).get("fase");
  if (forced === "teaser" || forced === "live") return { phase: forced, demo: true };
  return { phase: getPreBlackPhase(now), demo: false };
}
