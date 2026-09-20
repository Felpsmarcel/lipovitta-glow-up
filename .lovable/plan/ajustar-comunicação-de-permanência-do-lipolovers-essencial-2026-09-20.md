# Ajustar comunicação de permanência do Lipolovers Essencial

## Resultado

Deixar a página `/lipolovers` alinhada à regra de permanência: o Lipolovers Essencial tem um período inicial de **6 meses de compromisso**, com cobrança mensal de R$ 399. A regra completa vive **apenas no FAQ**. No restante da página, usa-se apenas a expressão **"Assinatura mensal"**, sem termos que sugiram cancelamento antes dos 6 meses.

## O que muda

### 1. Hero

- Remover o parágrafo que diz "Depois de 6 meses, você pode cancelar quando quiser."
- Substituir a linha "{commitmentMonths} meses de compromisso • Brindes inclusos" por uma linha que não mencione compromisso nem cancelamento.
- Manter: "A partir de R$ 399/mês", "Assinatura mensal" e "Frete calculado à parte."
- CTA permanece "QUERO SER LIPOLOVER".

### 2. Cards de benefícios

- O card do meio, hoje "{commitmentMonths} meses de compromisso", passa a ser algo como "Assinatura mensal" ou "Cobrança mensal".
- Remover do texto desse card qualquer menção a cancelamento após 6 meses.
- Manter os outros dois cards: "Todo mês" e "Brindes inclusos".

### 3. Card do plano Essencial

- Remover "{commitmentMonths} meses de compromisso" da faixa de regras abaixo do preço.
- Manter apenas: "Cobrança mensal", "Frete à parte".
- Ajustar o subtítulo da seção para não destacar os 6 meses.

### 4. Seção azul "Simples e transparente"

- Remover "{commitmentMonths} meses iniciais de compromisso".
- Manter: "Cobrança mensal" e "Frete calculado à parte".
- Headline pode ser ajustada para não soar como cancelamento livre.

### 5. FAQ — regras de permanência

Reescrever as perguntas relacionadas a fidelidade, cancelamento e cobrança:

**Posso cancelar minha assinatura?**
O Lipolovers Essencial possui um período inicial de permanência de 6 meses. Durante esse período, a assinatura permanece ativa com cobranças mensais. Após os 6 meses iniciais, você pode solicitar o cancelamento para as próximas cobranças.

**A cobrança dos 6 meses é feita de uma vez?**
Não. A cobrança é mensal, no valor de R$ 399 por mês. O compromisso inicial da assinatura é de 6 meses.

**O que acontece depois dos 6 meses?**
Após o período inicial de 6 meses, sua assinatura continua normalmente de forma mensal. A partir daí, você pode solicitar o cancelamento para as próximas cobranças.

Manter as demais perguntas: frete, sabor, brindes, envio.

### 6. Modal de lead (`LipoloversLeadDialog`)

- No resumo visual, trocar o campo "Compromisso" por algo neutro como "Assinatura mensal".
- No rodapé do formulário, remover a frase "Após {commitmentMonths} meses você pode cancelar para as próximas cobranças."
- Manter: "O pagamento acontece na próxima etapa, em ambiente seguro. Frete calculado à parte."

## Limites mantidos

- Não alterar preço (R$ 399/mês), checkout (https://mpago.la/16SyCN8), brindes, sabores nem fluxo de pagamento.
- Não reintroduzir o plano Master no frontend.
- Não publicar antes da revisão visual no preview.
