# Ajuste de copy do card "Protocolo Completo"

## Problema
O card **"Protocolo Completo LipoVitta"** (Cápsula + Shot Matinal) é o mais vendido, mas o nome "Completo" confunde clientes, que acham que o Shot Rush também está incluso. Isso gera expectativa errada e pode aumentar trocas/devoluções.

## Solução proposta
Renomear o card para deixar claro que é o combo mais escolhido — e não a versão com todos os produtos. O "Kit Completo" (Cápsula + Matinal + Rush) continua no topo da seção como a opção real com todos os produtos.

## Alterações em `src/components/OfferSection.tsx`

### 1. Nome do kit
- De: `Protocolo Completo LipoVitta`
- Para: **`Protocolo Favorito LipoVitta`**
  - *Por quê:* destaca que é a escolha da maioria, sem usar a palavra "Completo".

### 2. Subtítulo
- De: `Cápsula + Shot Matinal. A rotina completa em um único pedido.`
- Para: **`Cápsula + Shot Matinal. O combo mais escolhido pelas nossas clientes.`**
  - *Por quê:* remove o termo "completo" e reforça o social proof.

### 3. Descrição
- De: `A combinação pensada para quem quer começar com a rotina completa: a Cápsula como base diária e o Shot Matinal apoiando o início da manhã.`
- Para: **`A combinação que a maioria das clientes começa: a Cápsula como base diária e o Shot Matinal para o ritual da manhã. Quer incluir o Shot Rush? Escolha o Kit Completo logo acima.`**
  - *Por quê:* deixa explícito o que vem e direciona quem quer a versão com Rush.

### 4. CTA
- De: `ESCOLHER PROTOCOLO COMPLETO`
- Para: **`ESCOLHER PROTOCOLO FAVORITO`**

### 5. Link inferior do Shot Matinal
- Atualizar o texto do link `Ver Protocolo Completo` para **`Ver Protocolo Favorito`**, mantendo a âncora no card.

### 6. (Opcional) Selo adicional
- Manter o selo **"MAIS ESCOLHIDO"** e adicionar um microtexto abaixo do CTA:
  - **`"Cápsula + Shot Matinal. Shot Rush não incluso."`**
  - *Por quê:* elimina qualquer dúvida na hora da compra.

## Sugestão adicional
Considerar criar, no futuro, um tooltip ou linha de texto fixa no card: **"Não inclui Shot Rush"**. Isso pode ser testado via heatmap para ver se reduz dúvidas no atendimento.

## Escopo
- Apenas alterações de texto em `src/components/OfferSection.tsx`.
- Nenhuma mudança de preço, link, lógica de desconto ou estrutura de componentes.
