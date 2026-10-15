// Pure helpers (no Deno/npm imports) so they can be unit-tested with vitest.

export const EXCLUDED_ORDER_IDS = new Set(["171482339"]);
const CANCELED = /cancel|refund|estorn|chargeback|devolv/i;

export type PaymentRow = { order_id: string; paid_at: string; is_test: boolean };
export type OrderRow = {
  order_id: string;
  status: string | null;
  value_total: number | string | null;
  is_test: boolean;
  utm_source: string | null;
  utm_campaign: string | null;
};

export type SalesSnapshot = {
  orders: number;
  revenue: number;
  avg_ticket: number;
  by_day: { date: string; orders: number; revenue: number }[];
  by_utm: { utm_source: string; utm_campaign: string; orders: number; revenue: number }[];
};

const round = (n: number) => Math.round(n * 100) / 100;

/** Counts only paid, non-test, non-canceled orders. Day = America/Bahia (UTC-3). */
export function aggregateSales(payments: PaymentRow[], orders: OrderRow[]): SalesSnapshot {
  const byId = new Map(orders.map((o) => [o.order_id, o]));
  const seen = new Set<string>();
  const days = new Map<string, { orders: number; revenue: number }>();
  const utms = new Map<string, { utm_source: string; utm_campaign: string; orders: number; revenue: number }>();
  let total = 0;
  let count = 0;
  for (const p of payments) {
    if (p.is_test || EXCLUDED_ORDER_IDS.has(p.order_id) || seen.has(p.order_id)) continue;
    const o = byId.get(p.order_id);
    if (!o || o.is_test || (o.status && CANCELED.test(o.status))) continue;
    seen.add(p.order_id);
    const value = Number(o.value_total ?? 0) || 0;
    const date = new Date(new Date(p.paid_at).getTime() - 3 * 3600_000).toISOString().slice(0, 10);
    const d = days.get(date) ?? { orders: 0, revenue: 0 };
    d.orders += 1;
    d.revenue += value;
    days.set(date, d);
    const src = o.utm_source || "direto";
    const camp = o.utm_campaign || "—";
    const key = `${src}|${camp}`;
    const u = utms.get(key) ?? { utm_source: src, utm_campaign: camp, orders: 0, revenue: 0 };
    u.orders += 1;
    u.revenue += value;
    utms.set(key, u);
    total += value;
    count += 1;
  }
  return {
    orders: count,
    revenue: round(total),
    avg_ticket: count ? round(total / count) : 0,
    by_day: [...days.entries()].sort().map(([date, v]) => ({ date, orders: v.orders, revenue: round(v.revenue) })),
    by_utm: [...utms.values()].sort((a, b) => b.revenue - a.revenue).map((u) => ({ ...u, revenue: round(u.revenue) })),
  };
}
