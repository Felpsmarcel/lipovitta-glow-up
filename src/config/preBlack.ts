/** Only set groupUrl after the campaign owner confirms the WhatsApp group invite. */
export const PRE_BLACK_CONFIG = {
  /** Abertura oficial da Pré Black: domingo 18/10/2026 às 08:00 (America/Bahia). */
  startsAt: "2026-10-18T08:00:00-03:00",
  groupUrl: "https://app.notifyflow.com.br/deeplink/campaign/5233468f-cc5c-426b-96bc-a97f89414747",
  /** Rótulos de data derivados de startsAt — nunca editar textos soltos nas páginas. */
  dateLabel: "18 de outubro",
  shortDateLabel: "18/10",
  eyebrowDateLabel: "18.10 / 08H",
  timeLabel: "08 horas",
} as const;

const NOTIFYFLOW_PATH = /^\/deeplink\/campaign\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/?$/i;

export function confirmedGroupUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
    const whatsapp = url.hostname === "chat.whatsapp.com" && /^\/[A-Za-z0-9]{10,}\/?$/.test(url.pathname);
    const notifyflow = url.hostname === "app.notifyflow.com.br" && NOTIFYFLOW_PATH.test(url.pathname);
    if (!whatsapp && !notifyflow) return null;
    // Return the confirmed invite unchanged: campaign parameters can break invites.
    return value;
  } catch {
    return null;
  }
}

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

/** Fase da campanha: antes da abertura (captação) ou após (vendas). */
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
