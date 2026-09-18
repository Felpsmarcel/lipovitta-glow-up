export const LIPOLOVERS_CONFIG = {
  source: "site-lipolovers",
  returnPath: "/lipolovers/boas-vindas",
  plans: {
    essencial: {
      id: "essencial",
      name: "Lipolovers Essencial",
      price: 399,
      checkoutUrl: "https://seguro.lipovitta.site/b/ERLVJYQMJDSK",
      tag: "lipolovers-essencial",
      includes: ["1 Cápsulas LipoVitta", "1 Shot Matinal"],
    },
    master: {
      id: "master",
      name: "Lipolovers Master",
      price: 449,
      checkoutUrl: "https://seguro.lipovitta.site/b/CS0TSDGA96O0",
      tag: "lipolovers-master",
      includes: ["1 Cápsulas LipoVitta", "1 Shot Matinal", "1 Shot Rush"],
    },
  },
  flavors: [
    { id: "tangerina", label: "Tangerina", tag: "sabor-tangerina" },
    { id: "limao", label: "Limão", tag: "sabor-limao" },
    { id: "abacaxi", label: "Abacaxi", tag: "sabor-abacaxi" },
  ],
} as const;

export type LipoloversPlanId = keyof typeof LIPOLOVERS_CONFIG.plans;
export type LipoloversFlavorId = (typeof LIPOLOVERS_CONFIG.flavors)[number]["id"];