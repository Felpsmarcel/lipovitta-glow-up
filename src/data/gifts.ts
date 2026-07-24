import raspadorImg from "@/assets/gifts/brinde-raspador.png?w=320;640&format=avif;webp;png&as=picture";
import portacapsulasImg from "@/assets/gifts/brinde-portacapsulas.png?w=320;640&format=avif;webp;png&as=picture";
import mixerImg from "@/assets/gifts/brinde-mixer.png?w=320;640&format=avif;webp;png&as=picture";
import garrafaImg from "@/assets/gifts/brinde-garrafa.png?w=320;640&format=avif;webp;png&as=picture";
import type { PictureSource } from "@/components/ui/ResponsiveImage";

export type Gift = {
  id: string;
  nome: string;
  linha: string;
  utm: string;
  image: PictureSource;
  minProducts: 1 | 2 | 3;
};

export const GIFTS: Gift[] = [
  {
    id: "raspador",
    nome: "Raspador de língua",
    linha: "Para começar o ritual de dentro pra fora.",
    utm: "brinde_raspador",
    image: raspadorImg,
    minProducts: 1,
  },
  {
    id: "portacapsulas",
    nome: "Porta cápsulas",
    linha: "Sua rotina organizada, onde você for.",
    utm: "brinde_portacapsulas",
    image: portacapsulasImg,
    minProducts: 1,
  },
  {
    id: "mixer",
    nome: "Mixer Dosador",
    linha: "Praticidade pra sua dose perfeita todo dia.",
    utm: "brinde_mixer",
    image: mixerImg,
    minProducts: 2,
  },
  {
    id: "garrafa",
    nome: "Garrafa Térmica",
    linha: "Hidratação que acompanha sua rotina completa.",
    utm: "brinde_garrafa",
    image: garrafaImg,
    minProducts: 3,
  },
];

export function getEligibleGifts(productCount: 1 | 2 | 3): Gift[] {
  return GIFTS.filter((g) => productCount >= g.minProducts);
}

export function appendGiftUtm(checkoutUrl: string, giftUtm: string, eventId?: string): string {
  const sep = checkoutUrl.includes("?") ? "&" : "?";
  let url = `${checkoutUrl}${sep}utm_content=${encodeURIComponent(giftUtm)}`;
  if (eventId) url += `&utm_term=eid_${encodeURIComponent(eventId)}`;
  return url;
}
