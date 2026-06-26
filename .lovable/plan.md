## Objetivo

Inserir uma etapa de **escolha de brinde** entre o clique de compra e o checkout Yampi, sem mexer em carrinho/pagamento/estoque. Os links Yampi de cada kit **já existem no projeto e não serão trocados** — só acrescentamos `utm_content` do brinde escolhido.

---

## Fluxo do usuário

1. Cliente clica no botão de comprar de qualquer card em `OfferSection`.
2. Em vez de abrir a Yampi direto, o handler:
   - Define o "kit selecionado" no estado.
   - Faz `scrollIntoView({ behavior: "smooth" })` até `#escolha-brinde`.
3. A seção aparece logo abaixo de `OfferSection`, com brindes filtrados pela faixa.
4. Cliente seleciona **1** brinde (seleção única, card destacado).
5. Botão "Finalizar minha compra" sai do estado desabilitado.
6. Ao clicar: abre o link Yampi **original** do kit em nova aba, com `utm_content=brinde_xxx` anexado.

---

## Regra de elegibilidade (por quantidade de produtos no kit)

Cada card declara `productCount`:

| Kit                                | productCount | Brindes mostrados                                  |
| ---------------------------------- | ------------ | -------------------------------------------------- |
| Cápsulas (sozinho)                 | 1            | Raspador, Porta cápsulas                           |
| Shot Rush (sozinho)                | 1            | Raspador, Porta cápsulas                           |
| Kit Shot Rush + Cápsulas           | 2            | Raspador, Porta cápsulas, Mixer                    |
| Protocolo Completo (rotina cheia)  | 3            | Raspador, Porta cápsulas, Mixer, Garrafa Térmica   |

---

## Componentes / arquivos

**Novos**
- `src/components/GiftSelectionSection.tsx` — seção condicional, ancorada em `#escolha-brinde`.
- `src/context/GiftFlowContext.tsx` — `selectedKit`, `selectedGift`, `selectKit(kit)`, `confirmCheckout()`.
- `src/data/gifts.ts` — catálogo dos 4 brindes (id, nome, copy, imagem, utm_content, minProducts).

**Alterados**
- `src/components/OfferSection.tsx` — botões de compra deixam de ser `<a target="_blank">` direto e passam a chamar `selectKit({id, name, productCount, checkoutUrl})` preservando o link Yampi que já está lá. Em seguida, smooth-scroll pra `#escolha-brinde`.
- `src/pages/Index.tsx` — envolve em `GiftFlowProvider` e renderiza `<GiftSelectionSection />` logo após `OfferSection`. Auto-oculta quando `selectedKit` é null.

**Assets**
- 4 imagens dos brindes que você vai subir, externalizadas via lovable-assets.

---

## Catálogo de brindes

```ts
[
  { id: "raspador",      nome: "Raspador de língua", linha: "Para começar o ritual de dentro pra fora.",   utm: "brinde_raspador",      minProducts: 1 },
  { id: "portacapsulas", nome: "Porta cápsulas",     linha: "Sua rotina organizada, onde você for.",       utm: "brinde_portacapsulas", minProducts: 1 },
  { id: "mixer",         nome: "Mixer Dosador",      linha: "Praticidade pra sua dose perfeita todo dia.", utm: "brinde_mixer",         minProducts: 2 },
  { id: "garrafa",       nome: "Garrafa Térmica",    linha: "Hidratação que acompanha sua rotina completa.", utm: "brinde_garrafa",     minProducts: 3 },
]
```
Filtro: `gifts.filter(g => kit.productCount >= g.minProducts)`.

---

## Visual da seção

- Fundo branco com leve `--gradient-brand-soft`, ancorado em `#escolha-brinde`.
- Título display: **"Seu cuidado vem com um presente."**
- Subtítulo: **"Quanto mais completa sua rotina, mais especial seu presente. Escolha o seu abaixo — você leva um."**
- Grid responsivo (1 col mobile, até 4 col desktop) com cards:
  - Imagem 1:1 do brinde, nome (Poppins 700), linha curta italic em `--accent`.
  - Selecionado: borda 2px `--primary`, check no canto, leve scale.
- Aviso discreto: **"Você escolhe 1 presente por pedido. O presente é enviado junto com seu kit."**
- CTA `bg-gradient-brand`, texto **"Finalizar minha compra"**, `disabled` até existir `selectedGift`.
- Sem "GRÁTIS", sem cara de promoção. Tom premium LipoVitta.

---

## Lógica do link final (preserva o link existente do kit)

Anexa `utm_content` de forma simples e segura, sem trocar nem reordenar o resto do link Yampi:

```ts
function appendGiftUtm(checkoutUrl: string, giftUtm: string): string {
  const sep = checkoutUrl.includes("?") ? "&" : "?";
  return `${checkoutUrl}${sep}utm_content=${encodeURIComponent(giftUtm)}`;
}

window.open(appendGiftUtm(selectedKit.checkoutUrl, selectedGift.utm), "_blank", "noopener");
```

Regra exatamente conforme pedido:
- Link já com `?` → concatena com `&utm_content=...`
- Link sem `?` → concatena com `?utm_content=...`

---

## Itens que preciso de você antes de implementar

1. **Subir as 4 imagens** dos brindes (raspador, porta cápsulas, mixer, garrafa).
2. **Confirmar `productCount`** de cada card atual de `OfferSection` (em especial o "Protocolo Completo" = 3).

Com isso aprovado, implemento direto sem alterar nenhum link Yampi existente.
