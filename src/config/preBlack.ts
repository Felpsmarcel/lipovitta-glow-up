/** Only set groupUrl after the campaign owner confirms the WhatsApp group invite. */
export const PRE_BLACK_CONFIG = {
  startsAt: "2026-10-21T09:00:00-03:00",
  groupUrl: "https://app.notifyflow.com.br/deeplink/campaign/5233468f-cc5c-426b-96bc-a97f89414747",
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
