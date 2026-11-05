export const PARTNER_OFFERS = {
  capsulas: { name: "LipoVitta Cápsulas", wholesaleCents: 12900, retailCents: 24900, minUnits: 50 },
  shot_matinal: { name: "Shot Matinal LipoVitta", wholesaleCents: 8500, retailCents: 17000, minUnits: 50 },
} as const;
export type PartnerProduct = keyof typeof PARTNER_OFFERS;
export const SELLER_COMMISSION_RATE = 0.1;
export function simulatePartnerOrder(product: PartnerProduct, quantity: number) {
  const offer = PARTNER_OFFERS[product];
  if (!Number.isSafeInteger(quantity) || quantity < offer.minUnits || !Number.isSafeInteger(quantity * offer.retailCents)) {
    throw new RangeError(`Informe uma quantidade inteira a partir de ${offer.minUnits}.`);
  }
  const order = offer.wholesaleCents * quantity;
  const entry = Math.round(order / 2);
  const revenue = offer.retailCents * quantity;
  const commission = Math.round(revenue * SELLER_COMMISSION_RATE);
  return { order, entry, balance: order - entry, revenue, commission, remaining: revenue - order - commission, maxExchangeUnits: Math.floor(quantity * 0.2) };
}
export function buildPartnerInterest(product: PartnerProduct | undefined, quantity: number, notes: string) {
  if (!product) return notes.trim().slice(0, 600);
  const prefix = `Produto de interesse: ${PARTNER_OFFERS[product].name}. Quantidade: ${quantity} unidades.`;
  return `${prefix}${notes.trim() ? `\n${notes.trim()}` : ""}`.slice(0, 600);
}
export const partnerMoney = (cents: number) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });