// Camada única de rastreamento de conversões (Meta Pixel + CAPI + banco).
// Uso: trackCtaClick() nos botões, trackLead() nos formulários.

import { supabase } from "@/integrations/supabase/client";
import { generateEventId, trackEvent } from "@/lib/metaPixel";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
type UtmKey = (typeof UTM_KEYS)[number];
export type Utms = Partial<Record<UtmKey, string>>;

const STORAGE_KEY = "lv_utms";

/** Captura as UTMs da URL na primeira visita e mantém durante a sessão. */
export function captureUtms(): Utms {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Utms = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) fromUrl[k] = v.slice(0, 200);
  });
  if (Object.keys(fromUrl).length > 0) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
    } catch {
      /* ignore */
    }
    return fromUrl;
  }
  return getUtms();
}

export function getUtms(): Utms {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Utms) : {};
  } catch {
    return {};
  }
}

/** Grava o evento no banco (fire-and-forget, nunca bloqueia o usuário). */
function logConversion(payload: Record<string, unknown>): void {
  void supabase.functions
    .invoke("track-conversion", {
      body: {
        ...payload,
        ...getUtms(),
        page_url: typeof window !== "undefined" ? window.location.href.slice(0, 500) : undefined,
      },
    })
    .catch(() => {
      /* silent */
    });
}

export type CtaClickInput = {
  /** Onde o botão está: "hero", "navbar", "banner_meio", "card_capsulas"... */
  location: string;
  /** Texto/identificação do botão. */
  label?: string;
  productName?: string;
  sku?: string;
  value?: number;
  /** Link de checkout, quando o clique leva direto ao pagamento. */
  checkoutUrl?: string;
  /** Evento Meta a disparar. Padrão: CTAClick (custom). */
  eventName?: string;
  /** Brinde escolhido (utm), quando houver. */
  gift?: string;
  /** Sabor escolhido (Shot Matinal), quando houver. */
  flavor?: string;
};

/**
 * Dispara o evento de clique (Pixel + CAPI + banco) e devolve o eventId
 * e, quando houver checkoutUrl, o link já com os parâmetros de rastreio.
 */
export function trackCtaClick(input: CtaClickInput): { eventId: string; url?: string } {
  const eventId = generateEventId();
  const eventName = input.eventName ?? "CTAClick";

  trackEvent(
    eventName,
    {
      content_name: input.productName ?? input.label ?? input.location,
      content_ids: input.sku ? [input.sku] : undefined,
      content_type: input.sku ? "product" : undefined,
      currency: "BRL",
      value: input.value,
      cta_location: input.location,
      cta_label: input.label,
      gift: input.gift,
      flavor: input.flavor,
    },
    { eventID: eventId }
  );

  logConversion({
    event_name: eventName,
    event_id: eventId,
    cta_location: input.location,
    product_name: input.flavor
      ? `${input.productName ?? input.label} — Sabor ${input.flavor}`
      : input.productName ?? input.label,
    sku: input.sku,
    value: input.value,
    gift: input.gift,
  });

  return {
    eventId,
    url: input.checkoutUrl
      ? appendTrackingParams(input.checkoutUrl, {
          eventId,
          gift: input.gift,
          flavor: input.flavorId ?? input.flavor,
        })
      : undefined,
  };
}

/** Acrescenta eventId, sabor e UTMs de origem ao link de checkout. */
export function appendTrackingParams(
  checkoutUrl: string,
  opts: { eventId?: string; gift?: string; flavor?: string } = {}
): string {
  try {
    const url = new URL(checkoutUrl);
    const utms = getUtms();
    (Object.keys(utms) as UtmKey[]).forEach((k) => {
      const v = utms[k];
      // utm_term e utm_content são reservados para eventId/brinde.
      if (v && k !== "utm_term" && k !== "utm_content") url.searchParams.set(k, v);
    });
    if (opts.flavor) url.searchParams.set("sabor", opts.flavor);
    if (opts.gift) url.searchParams.set("utm_content", opts.gift);
    if (opts.eventId) url.searchParams.set("utm_term", `eid_${opts.eventId}`);
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}


export function trackLead(input: {
  formName: string;
  eventId?: string;
  value?: number;
}): string {
  const eventId = input.eventId ?? generateEventId();
  trackEvent(
    "Lead",
    { content_name: input.formName, content_category: "afiliados", currency: "BRL", value: input.value },
    { eventID: eventId }
  );
  logConversion({
    event_name: "Lead",
    event_id: eventId,
    cta_location: input.formName,
    product_name: input.formName,
    value: input.value,
  });
  return eventId;
}

/** Início de preenchimento de formulário (para medir abandono). */
export function trackLeadStart(formName: string): void {
  const eventId = generateEventId();
  trackEvent("LeadStart", { content_name: formName, content_category: "afiliados" }, { eventID: eventId });
  logConversion({ event_name: "LeadStart", event_id: eventId, cta_location: formName });
}

/** Clique em contato (WhatsApp, afiliadas). */
export function trackContact(location: string, label?: string): void {
  const eventId = generateEventId();
  trackEvent("Contact", { content_name: label ?? location, cta_location: location }, { eventID: eventId });
  logConversion({ event_name: "Contact", event_id: eventId, cta_location: location, product_name: label });
}
