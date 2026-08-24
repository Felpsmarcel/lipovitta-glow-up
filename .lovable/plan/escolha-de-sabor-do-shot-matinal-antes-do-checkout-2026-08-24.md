# Escolha de sabor do Shot Matinal antes do checkout

## O que muda para a cliente
Nos cards que incluem Shot Matinal — **Kit Completo**, **Protocolo Favorito** e **Shot Matinal** avulso — aparece uma linha de escolha de sabor (Abacaxi, Limão, Tangerina) com as três imagens já existentes. O botão de compra só libera depois que ela escolhe o sabor, e o link do checkout passa a ser o link daquele sabor.

## Como fica no card
```text
Sabor do Shot Matinal:   [ Abacaxi ]  [ Limão ]  [ Tangerina ]
                            (selecionado = borda azul + check)

[  ESCOLHER PROTOCOLO FAVORITO  ]   <- desabilitado até escolher
Sabor escolhido: Abacaxi
```

## Links por sabor
Cada kit + sabor tem seu próprio link de checkout. Como os links ainda não foram enviados, o plano prevê um mapa central de links (kit → sabor → URL) em um único lugar do código, fácil de preencher. Até você mandar os links:

- se o link do sabor existir no mapa, ele é usado;
- se não existir, usa o link atual do kit e acrescenta o sabor no próprio endereço (`&sabor=abacaxi`), para não travar a venda e ainda registrar a escolha.

Quando você enviar os links definitivos, é só preencher o mapa — nenhuma outra alteração é necessária.

## Registro da escolha
- O sabor viaja no link de checkout e é gravado junto com o evento de clique (painel `/admin/conversoes`), na mesma lógica já usada para o brinde.
- O sabor também aparece no resumo da etapa de brinde ("Kit Completo · Sabor: Limão").

## Detalhes técnicos
- `src/context/GiftFlowContext.tsx`: `SelectedKit` ganha `flavor?: string`; nada mais muda no fluxo de brinde.
- `src/components/OfferSection.tsx`:
  - novo mapa `SHOT_FLAVOR_LINKS: Record<kitId, Record<flavor, string>>` (vazio inicialmente);
  - estado local de sabor por card (`capsulas` não tem seletor);
  - componente interno `FlavorPicker` reutilizado nos três cards, usando as imagens `shot-matinal-abacaxi/limao/tangerina`;
  - `chooseKit` passa a resolver o `checkoutUrl` pelo mapa e injeta `flavor` no kit.
- `src/lib/tracking.ts`: `CtaClickInput` ganha `flavor?: string`, incluído no evento do Pixel e no log de conversão (campo já existente `product_name` recebe "Kit — Sabor X").
- `src/components/GiftSelectionSection.tsx`: exibe o sabor escolhido no resumo e mantém o `utm_content` do brinde.

## Fora do escopo
- Preços, regras de desconto e brindes seguem iguais.
- Nenhuma alteração no painel da Yampi (os links por sabor precisam existir lá).
