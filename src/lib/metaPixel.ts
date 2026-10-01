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

/** Dados de correspondência avançada informados pela própria pessoa em formulários. */
export type AdvancedMatchingData = {
  email?: string;
  phone?: string;
  name?: string;
};

function normalizePhoneBR(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? digits : `55${digits}`;
}

/** Parâmetros em/ph/fn/ln para o Pixel (o fbq aplica SHA-256 automaticamente). */
export function pixelUserData(user: AdvancedMatchingData): Record<string, string> {
  const out: Record<string, string> = {};
  const email = user.email?.trim().toLowerCase();
  if (email && email.includes("@")) out.em = email;
  const phone = user.phone ? normalizePhoneBR(user.phone) : "";
  if (phone) out.ph = phone;
  const parts = (user.name ?? "").trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (parts.length > 0) out.fn = parts[0];
  if (parts.length > 1) out.ln = parts[parts.length - 1];
  return out;
}

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** user_data já com hash SHA-256 para a CAPI. */
async function capiUserData(
  user: AdvancedMatchingData
): Promise<Record<string, string[]> | undefined> {
  const raw = pixelUserData(user);
  const entries = await Promise.all(
    (Object.entries(raw) as [string, string][]).map(async ([k, v]): Promise<[string, string[]]> => [k, [await sha256Hex(v)]])
  );
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

export function trackEvent(
  name: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string; userData?: AdvancedMatchingData }
): void {
  const eventID = options?.eventID;
  const userParams = options?.userData ? pixelUserData(options.userData) : {};
  const merged = { ...(params ?? {}), ...userParams };
  if (isPixelEnabled() && window.fbq) {
    if (eventID) {
      window.fbq("track", name, merged, { eventID });
    } else {
      window.fbq("track", name, merged);
    }
  }
  if (CAPI_MIRROR && eventID) {
    // Fire-and-forget mirror to CAPI edge function (currently preview-only).
    void sendCapiPreview(name, params ?? {}, eventID, options?.userData);
  }
}

export async function sendCapiPreview(
  name: string,
  params: Record<string, unknown>,
  eventId: string,
  userData?: AdvancedMatchingData
): Promise<void> {
  try {
    const hashed = userData ? await capiUserData(userData) : undefined;
    await supabase.functions.invoke("meta-capi", {
      body: {
        event_name: name,
        event_id: eventId,
        event_source_url: typeof window !== "undefined" ? window.location.href : undefined,
        custom_data: params,
        ...(hashed ? { user_data: hashed } : {}),
      },
    });
  } catch {
    /* silent */
  }
}
