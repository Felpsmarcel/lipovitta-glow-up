# Pré Black 30% na Yampi — conferência do checkout real

A campanha abriu às 08:00 (Bahia). O site já mostra 30% OFF; a Yampi precisa cobrar o mesmo valor.

## Você faz no painel da Yampi
1. Colocar o preço promocional em cada produto/kit (30% sobre o preço cheio):

| Item | De | Por |
| --- | --- | --- |
| Cápsulas | R$ 357,00 | R$ 249,90 |
| Shot Matinal (todos os sabores) | R$ 170,00 | R$ 119,00 |
| Shot Rush | R$ 225,00 | R$ 157,50 |
| Protocolo Completo | R$ 527,00 | R$ 368,90 |
| Kit Shot Rush + Cápsulas | R$ 582,00 | R$ 407,40 |
| Kit Completo | R$ 752,00 | R$ 526,40 |

2. Desligar a regra de 10% dos kits e qualquer desconto automático, para não acumular (já aconteceu antes desconto em dobro).
3. Me avisar quando terminar.

## Eu faço depois
1. Abrir o link de cada um dos 6 botões de compra do site e ler o valor que a Yampi mostra no carrinho, sem finalizar pedido.
2. Comparar com a tabela acima e listar qualquer diferença.
3. Conferir que sabor, brinde e UTMs continuam chegando ao checkout.
4. Acompanhar os primeiros pedidos reais: o alerta de divergência de preço do painel de conversões já marca pedidos pagos com valor diferente do esperado.
5. Concluir no site o que faltou da etapa anterior (valor do clique do Shot Rush, seleção feita antes da virada) e publicar só depois que os preços baterem.

## Detalhes técnicos
- Sem chamadas de escrita à Yampi pelo projeto (acesso por API não configurado).
- Leitura do carrinho via Playwright, com a rede de analytics/pixel bloqueada para não gerar eventos.
- Comparação usa `BASE_PRICES` e `getCampaignPrice(id, "live")` de `src/config/campaignPricing.ts`.
