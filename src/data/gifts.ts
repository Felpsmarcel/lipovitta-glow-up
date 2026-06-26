export type Gift = {
  id: string;
  nome: string;
  linha: string;
  utm: string;
  image: string;
  minProducts: 1 | 2 | 3;
};

// Imagens placeholder — substitua pelos arquivos definitivos via lovable-assets
// (src/assets/brinde-raspador.png, brinde-portacapsulas.png, brinde-mixer.png, brinde-garrafa.png)
const PLACEHOLDER = "/placeholder.svg";

export const GIFTS: Gift[] = [
  {
    id: "raspador",
    nome: "Raspador de língua",
    linha: "Para começar o ritual de dentro pra fora.",
    utm: "brinde_raspador",
    image: PLACEHOLDER,
    minProducts: 1,
  },
  {
    id: "portacapsulas",
    nome: "Porta cápsulas",
    linha: "Sua rotina organizada, onde você for.",
    utm: "brinde_portacapsulas",
    image: PLACEHOLDER,
    minProducts: 1,
  },
  {
    id: "mixer",
    nome: "Mixer Dosador",
    linha: "Praticidade pra sua dose perfeita todo dia.",
    utm: "brinde_mixer",
    image: PLACEHOLDER,
    minProducts: 2,
  },
  {
    id: "garrafa",
    nome: "Garrafa Térmica",
    linha: "Hidratação que acompanha sua rotina completa.",
    utm: "brinde_garrafa",
    image: PLACEHOLDER,
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
