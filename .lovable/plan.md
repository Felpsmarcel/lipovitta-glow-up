## Faixas de status nos complementos

Acho a abordagem boa — comunica honestidade (não esconde indisponibilidade) e ainda cria expectativa no Shot Rush ("novo estoque chegando"), o que mantém o produto vivo na página em vez de simplesmente sumir. Sugiro só dois cuidados:

- No **Gummy (Esgotado)**: desabilitar o botão "Adicionar à minha rotina" e trocar o texto para "Esgotado", com a imagem levemente esmaecida, para evitar frustração de quem clica e cai numa página sem estoque.
- No **Shot Rush (Novo estoque)**: manter o botão ativo, mas trocar para "Avise-me quando chegar" ou manter o link atual — me diga qual prefere.

### Mudanças em `src/components/ProductsSection.tsx`

1. **Card Gummy VittaGlow Colágeno**
   - Adicionar faixa diagonal/canto vermelha "ESGOTADO" sobre a área da imagem.
   - Aplicar `opacity-60 grayscale` na imagem.
   - Substituir o link por um botão desabilitado cinza com texto "Esgotado".

2. **Card Shot Rush Pré-Treino**
   - Adicionar faixa no canto da imagem em tom âmbar/azul: "NOVO ESTOQUE EM BREVE".
   - Manter botão como está (ou trocar texto — aguardando sua decisão).

### Estilo das faixas

Faixa posicionada no canto superior esquerdo da área da imagem, em formato pílula com sombra leve:

```text
┌─────────────────────────┐
│ [ESGOTADO]              │
│                         │
│      [imagem]           │
│                         │
└─────────────────────────┘
```

- Esgotado: fundo `#C0392B`, texto branco, uppercase, bold.
- Novo estoque: fundo `#E8A317` (âmbar), texto branco, uppercase, bold.

Confirma se mantenho o botão do Shot Rush clicável ou troco para "Avise-me quando chegar"?
