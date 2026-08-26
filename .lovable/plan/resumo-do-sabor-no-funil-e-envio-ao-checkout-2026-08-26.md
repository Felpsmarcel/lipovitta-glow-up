# Resumo do sabor no funil e envio ao checkout

## O que muda para a cliente

### 1. No card da oferta (etapa 1)
Depois de escolher o sabor, aparece abaixo do seletor uma confirmação discreta: "Sabor escolhido: Limão". Hoje o feedback é apenas a borda do botão selecionado.

### 2. Na etapa do brinde (etapa 2)
Em vez da linha de texto atual, um bloco de resumo do pedido no topo da seção:

```text
SEU PEDIDO
Protocolo Favorito LipoVitta
Sabor do Shot Matinal: Limão      [Trocar sabor]
Presente escolhido: Garrafa Térmica   (aparece após escolher)
```

O link "Trocar sabor" leva de volta à seção de ofertas.

### 3. No botão final
O texto do botão passa a confirmar o que será enviado: "Finalizar compra · Limão" quando houver sabor.

## Garantia de envio ao checkout
- O sabor já viaja no link (`?sabor=limao`). O plano torna isso explícito e à prova de falha: o parâmetro é aplicado no momento de abrir o checkout, mesmo se o link do kit for trocado depois.
- Se o kit exige sabor e nenhum foi escolhido, o botão final fica bloqueado com a mensagem "Escolha o sabor do Shot Matinal antes de finalizar".
- O sabor continua indo para o rastreio (Pixel + painel `/admin/conversoes`).

## Detalhes técnicos
- `src/lib/tracking.ts`: `appendTrackingParams` ganha `flavor?: string` (id do sabor) e passa a setar `sabor` no link; `trackCtaClick` repassa esse valor.
- `src/context/GiftFlowContext.tsx`: `SelectedKit` ganha `flavorId?: string` (id normalizado) além do `flavor` (rótulo exibido), e `requiresFlavor?: boolean`.
- `src/components/OfferSection.tsx`: `withFlavor` preenche `flavorId`/`requiresFlavor`; cada card com Shot Matinal mostra a linha "Sabor escolhido: X" abaixo do seletor.
- `src/components/GiftSelectionSection.tsx`: bloco de resumo (kit, sabor, brinde) com link "Trocar sabor" para `#oferta`; validação e rótulo do botão final.

## Fora do escopo
- Preços, regras de desconto e catálogo de brindes seguem iguais.
