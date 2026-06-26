import raspadorAsset from "@/assets/brinde-raspador.png.asset.json";
import portacapsulasAsset from "@/assets/brinde-portacapsulas.png.asset.json";
import mixerAsset from "@/assets/brinde-mixer.png.asset.json";
import garrafaAsset from "@/assets/brinde-garrafa.png.asset.json";

export type Gift = {
  id: string;
  nome: string;
  linha: string;
  utm: string;
  image: string;
  minProducts: 1 | 2 | 3;
};

export const GIFTS: Gift[] = [
  {
    id: "raspador",
    nome: "Raspador de língua",
    linha: "Para começar o ritual de dentro pra fora.",
    utm: "brinde_raspador",
    image: raspadorAsset.url,
    minProducts: 1,
  },
  {
    id: "portacapsulas",
    nome: "Porta cápsulas",
    linha: "Sua rotina organizada, onde você for.",
    utm: "brinde_portacapsulas",
    image: portacapsulasAsset.url,
    minProducts: 1,
  },
  {
    id: "mixer",
    nome: "Mixer Dosador",
    linha: "Praticidade pra sua dose perfeita todo dia.",
    utm: "brinde_mixer",
    image: mixerAsset.url,
    minProducts: 2,
  },
  {
    id: "garrafa",
    nome: "Garrafa Térmica",
    linha: "Hidratação que acompanha sua rotina completa.",
    utm: "brinde_garrafa",
    image: garrafaAsset.url,
    minProducts: 3,
  },
];

export function getEligibleGifts(productCount: 1 | 2 | 3): Gift[] {
  return GIFTS.filter((g) => productCount >= g.minProducts);
}

export function appendGiftUtm(checkoutUrl: string, giftUtm: string): string {
  const sep = checkoutUrl.includes("?") ? "&" : "?";
  return `${checkoutUrl}${sep}utm_content=${encodeURIComponent(giftUtm)}`;
}
