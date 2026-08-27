// Ponte com o GoHighLevel (GHL).
// Enfileira eventos em public.ghl_outbox e aciona a função `ghl-dispatch`.
// Nada aqui pode derrubar o fluxo chamador: toda falha é apenas registrada.

import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

export type GhlEventType =
  | "purchase"
  | "order_status"
  | "abandoned_cart"
  | "initiate_checkout";

export type GhlItem = {
  sku?: string | null;
  name?: string | null;
  quantity?: number | null;
  price?: number | null;
};

export type GhlPayload = {
  event_type: GhlEventType;
  order_id?: string | null;
  order_number?: string | null;
  status?: string | null;
  value?: number | null;
  currency?: string;
  items?: GhlItem[];
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  recovery_url?: string | null;
  occurred_at?: string | null;
  is_test?: boolean;
  source?: string;
};

export function serviceClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

/** Grava o evento na fila (idempotente) e dispara a entrega em segundo plano. */
export async function enqueueGhl(
  payload: GhlPayload,
  dedupeKey: string,
  opts: { dispatch?: boolean; logPrefix?: string } = {},
): Promise<{ queued: boolean; reason?: string }> {
  const prefix = opts.logPrefix ?? "[ghl]";
  try {
    const supabase = serviceClient();
    const body: GhlPayload = {
      currency: "BRL",
      source: "lipovitta",
      occurred_at: new Date().toISOString(),
      ...payload,
    };
    const { error } = await supabase
      .from("ghl_outbox")
      .upsert(
        {
          event_type: payload.event_type,
          dedupe_key: dedupeKey.slice(0, 200),
          payload: body,
          is_test: payload.is_test ?? false,
          status: "pending",
          next_attempt_at: new Date().toISOString(),
        },
        { onConflict: "event_type,dedupe_key", ignoreDuplicates: true },
      );
    if (error) {
      console.error(`${prefix} enqueue falhou:`, error.message);
      return { queued: false, reason: error.message };
    }
    if (opts.dispatch !== false) void triggerDispatch(prefix);
    return { queued: true };
  } catch (e) {
    console.error(`${prefix} enqueue erro:`, (e as Error).message);
    return { queued: false, reason: (e as Error).message };
  }
}

/** Chama a função de entrega sem bloquear o chamador. */
export async function triggerDispatch(prefix = "[ghl]"): Promise<void> {
  try {
    await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/ghl-dispatch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({ trigger: "enqueue" }),
    });
  } catch (e) {
    console.error(`${prefix} dispatch trigger falhou:`, (e as Error).message);
  }
}
