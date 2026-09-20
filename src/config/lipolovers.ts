import { GIFTS, type Gift } from "@/data/gifts";

export const LIPOLOVERS_GIFT_IDS = ["raspador", "portacapsulas", "mixer"] as const;

export const LIPOLOVERS_CONFIG = {
  source: "site-lipolovers",
  returnPath: "/lipolovers/boas-vindas",
  commitmentMonths: 6,
  plans: {
    essencial: {
      id: "essencial",
      name: "Lipolovers Essencial",
      price: 399,
      checkoutUrl: "https://mpago.la/16SyCN8",
      tag: "lipolovers-essencial",
      includes: ["1 frasco de Cápsulas LipoVitta", "1 Shot Matinal"],
      giftIds: LIPOLOVERS_GIFT_IDS,
    },
  },
  flavors: [
    { id: "tangerina", label: "Tangerina", tag: "sabor-tangerina" },
    { id: "limao", label: "Limão", tag: "sabor-limao" },
    { id: "abacaxi", label: "Abacaxi", tag: "sabor-abacaxi" },
  ],
} as const;

export const LIPOLOVERS_GIFTS: Gift[] = GIFTS.filter((gift) =>
  (LIPOLOVERS_GIFT_IDS as readonly string[]).includes(gift.id)
);

/** Aceita 'master' apenas para compatibilidade com leads antigos. */
export type LipoloversPlanId = "essencial" | "master";
export type LipoloversFlavorId = (typeof LIPOLOVERS_CONFIG.flavors)[number]["id"];
