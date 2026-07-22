// Meta Pixel wrapper. Safe no-op when VITE_META_PIXEL_ID is missing.
// CAPI mirror is opt-in via VITE_META_CAPI_MIRROR=true (structure only for now).

import { supabase } from "@/integrations/supabase/client";

const PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID as string | undefined)?.trim();
const CAPI_MIRROR = (import.meta.env.VITE_META_CAPI_MIRROR as string | undefined) === "true";

type FbqFn = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
  }
}

let initialized = false;

export function isPixelEnabled(): boolean {
  return typeof window !== "undefined" && !!PIXEL_ID;
}

export function generateEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function initMetaPixel(): void {
  if (typeof window === "undefined") return;
  if (initialized) return;
  if (!PIXEL_ID) return;

  // Standard Meta Pixel base code, TypeScript-friendly.
  (function (f: Window, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: FbqFn = function (...args: unknown[]) {
      n.callMethod ? n.callMethod.apply(n, args) : n.queue!.push(args);
    } as FbqFn;
    f.fbq = n;
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  window.fbq!("init", PIXEL_ID);
  window.fbq!("track", "PageView");
  initialized = true;
}

export function trackPageView(): void {
  if (!isPixelEnabled() || !window.fbq) return;
  window.fbq("track", "PageView");
}

export function trackEvent(
  name: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string }
): void {
  const eventID = options?.eventID;
  if (isPixelEnabled() && window.fbq) {
    if (eventID) {
      window.fbq("track", name, params ?? {}, { eventID });
    } else {
      window.fbq("track", name, params ?? {});
    }
  }
  if (CAPI_MIRROR && eventID) {
    // Fire-and-forget mirror to CAPI edge function (currently preview-only).
    void sendCapiPreview(name, params ?? {}, eventID);
  }
}

export async function sendCapiPreview(
  name: string,
  params: Record<string, unknown>,
  eventId: string
): Promise<void> {
  try {
    await supabase.functions.invoke("meta-capi", {
      body: {
        event_name: name,
        event_id: eventId,
        event_source_url: typeof window !== "undefined" ? window.location.href : undefined,
        custom_data: params,
      },
    });
  } catch {
    /* silent */
  }
}
