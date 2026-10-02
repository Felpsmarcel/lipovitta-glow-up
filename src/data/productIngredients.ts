// Fonte única de verdade para composição dos produtos LipoVitta.
// Cards, kits e Lipolovers consomem estes dados — não duplicar fórmulas em outros arquivos.
// Regras: não inventar ingrediente, quantidade ou propriedade medicinal.
// Dados transcritos dos rótulos oficiais fornecidos pela marca (out/2026).

export type NutritionRow = [name: string, amount: string, vd?: string];

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
    rows: NutritionRow[];
    /** Nota de rodapé do rótulo ("Não contém quantidades significativas de..."). */
    note?: string;
  };
};

export const PRODUCT_INGREDIENTS: Record<ProductIngredients["id"], ProductIngredients> = {
  capsulas: {
    id: "capsulas",
    name: "Cápsulas LipoVitta",
    label: "Ingredientes",
    ingredients:
      "Café verde em pó, extrato de rizomas de Cúrcuma Longa, quercetina, trans-resveratrol sintético, extrato de Opuntia ficus-indica, fruto do melão, antiumectante dióxido de silício e veículo amido. Composição da cápsula: gelatina.",
    gluten: "NÃO CONTÉM GLÚTEN. NÃO CONTÉM LACTOSE.",
    nutrition: {
      servingSize: "520 mg (1 cápsula)",
      servings: 30,
      rows: [
        ["Cafeína", "80 mg"],
        ["Curcumina", "130 mg"],
        ["Fonte de quercetina", "100 mg"],
        ["Fonte de Opuntia ficus-indica", "50 mg"],
        ["Fonte de trans-resveratrol", "20 mg"],
      ],
      note: "Não contém quantidades significativas de valor energético, carboidratos totais, açúcares totais, açúcares adicionados, proteínas, gorduras totais, gorduras saturadas, gorduras trans, fibra alimentar e sódio.",
    },
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
        ["Valor energético", "0 kcal", "0%"],
        ["Carboidratos", "0 g", "0%"],
        ["Açúcares totais", "0 g"],
        ["Açúcares adicionados", "0 g", "0%"],
        ["Galactose", "0 g"],
        ["L-Glutamina", "3.000 mg"],
        ["Lisina", "315 mg"],
        ["L-Cisteína", "250 mg"],
        ["Beta-glucana", "250 mg"],
        ["Curcumina", "130 mg"],
        ["Vitamina C", "500 mg", "500%"],
        ["Vitamina A", "600 mcg", "75%"],
        ["Vitamina D", "5 mcg", "33%"],
        ["Vitamina E", "10 mg", "66%"],
        ["Zinco", "7 mg", "64%"],
        ["Selênio", "300 mcg", "500%"],
      ],
      note: "Não contém quantidades significativas de proteínas, gorduras totais, gorduras saturadas, gorduras trans, fibras alimentares e sódio.",
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
    nutrition: {
      servingSize: "5 g (1 dosador)",
      servings: 30,
      rows: [
        ["Inositol", "2.000 mg"],
        ["L-Arginina", "1.000 mg"],
        ["Procianidinas", "95 mg"],
        ["Saponinas", "300 mg"],
        ["Zinco", "10 mg", "91%"],
        ["Cromo", "100 mcg", "286%"],
        ["Selênio", "100 mcg", "167%"],
      ],
      note: "Não contém quantidades significativas de valor energético, carboidratos, açúcares totais, açúcares adicionados, galactose, proteínas, gorduras totais, gorduras saturadas, gorduras trans, fibras alimentares e sódio.",
    },
  },
};
