// Fonte única de verdade para composição dos produtos LipoVitta.
// Cards, kits e Lipolovers consomem estes dados — não duplicar fórmulas em outros arquivos.
// Regras: não inventar ingrediente, quantidade ou propriedade medicinal.

export type ProductIngredients = {
  id: "capsulas" | "shot-matinal" | "shot-rush";
  name: string;
  /** Rótulo do accordion. "Principais ingredientes" quando a lista não é a relação integral do rótulo. */
  label: string;
  ingredients: string;
  allergens?: string;
  gluten?: string;
  nutrition?: {
    servingSize: string;
    servings: number;
    rows: [string, string][];
  };
};

export const PRODUCT_INGREDIENTS: Record<ProductIngredients["id"], ProductIngredients> = {
  capsulas: {
    id: "capsulas",
    name: "Cápsulas LipoVitta",
    // Sem composição integral do rótulo confirmada no projeto — usar "Principais ingredientes".
    label: "Principais ingredientes",
    ingredients:
      "Café verde em pó, quercetina, cúrcuma longa, resveratrol e Opuntia ficus-indica.",
  },
  "shot-matinal": {
    id: "shot-matinal",
    name: "Shot Matinal LipoVitta",
    label: "Ingredientes",
    ingredients:
      "L-glutamina, abacaxi liofilizado, ácido ascórbico (vitamina C), cloridrato de lisina, cúrcuma longa, beta-glucana de levedura, N-acetil L-cisteína (NAC), pimenta preta, colecalciferol (vitamina D3), acetato de DL-alfa-tocoferil (vitamina E), acetato de retinol (vitamina A), bisglicinato de zinco, bisglicinato de selênio, aromatizante e edulcorantes glicosídeos de esteviol (stevia) e taumatina.",
    allergens: "ALÉRGICOS: PODE CONTER LEITE, SOJA, OVOS E AMENDOIM.",
    gluten: "NÃO CONTÉM GLÚTEN.",
    nutrition: {
      servingSize: "5 g (1 dosador)",
      servings: 30,
      rows: [
        ["L-Glutamina", "3.000 mg"],
        ["Lisina", "315 mg"],
        ["L-Cisteína", "250 mg"],
        ["Beta-glucana", "250 mg"],
        ["Curcumina", "130 mg"],
        ["Vitamina C", "500 mg"],
        ["Vitamina A", "600 mcg"],
        ["Vitamina D", "5 mcg"],
        ["Vitamina E", "10 mg"],
        ["Zinco", "7 mg"],
        ["Selênio", "300 mcg"],
      ],
    },
  },
  "shot-rush": {
    id: "shot-rush",
    name: "Shot Rush Pré-Treino",
    label: "Ingredientes",
    ingredients:
      "Mio-inositol, frutas vermelhas liofilizadas, L-arginina, extrato de casca de pinho marítimo (Pinus pinaster Aiton), extrato de semente de feno-grego (Trigonella foenum-graecum L.), bisglicinato de zinco, picolinato de cromo, bisglicinato de selênio e edulcorantes glicosídeos de esteviol (stevia) e taumatina.",
    allergens: "ALÉRGICOS: PODE CONTER LEITE, SOJA, OVOS E AMENDOIM.",
    gluten: "NÃO CONTÉM GLÚTEN.",
  },
};
