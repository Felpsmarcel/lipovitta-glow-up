# Desconto aplicado duas vezes na Yampi

## O que a imagem mostra (Pedido 30)

```text
Shot Matinal   R$ 102,00
Shot Rush      R$ 135,00
Cápsulas       R$ 214,20
Produtos       R$ 451,20   <- já é o valor COM 40% OFF
Desconto      -R$ 180,48   <- exatamente 40% de 451,20 (segunda vez)
Total          R$ 270,72
```

O site exibe R$451,20 para o Kit Completo, que é o preço correto já com 40% OFF
sobre o valor cheio (R$752,00). Na Yampi os produtos do kit estão cadastrados
**já com o preço promocional** e, além disso, existe uma **regra/cupom automático
de 40%** que incide de novo sobre esse total. Resultado: desconto duplo, o cliente
pagou R$270,72 em vez de R$451,20 (prejuízo de R$180,48 no pedido).

O mesmo padrão explica o caso anterior do Kit Rush + Cápsulas (site R$407,40,
Yampi cobrando menos).

## Onde está o erro

O erro **não está no código do site**. Está na configuração da Yampi: preço
promocional no produto + regra de desconto automático somando.

## Correção (painel da Yampi)

Escolher UMA das duas formas e usar em todos os kits:

- **Opção A — regra manda:** voltar os produtos/kits para o **preço cheio**
  (Cápsulas R$357,00, Shot Matinal R$170,00, Shot Rush R$225,00) e deixar só a
  regra progressiva 20/30/40% fazer o desconto no checkout.
- **Opção B — preço manda:** manter os kits com preço promocional já embutido e
  **desativar a regra automática** (ou excluir os kits da regra), para nada
  descontar em cima.

Recomendo a **Opção A**: o cliente vê o "de/por" no checkout e o site continua
batendo com a Yampi sem manutenção manual em cada kit.

## O que eu faço no projeto

1. **Verificação de preço no checkout:** registrar no evento de clique o valor
   esperado do kit (já registramos `value`), e no `yampi-webhook` comparar o
   total pago do pedido com o valor esperado; se divergir mais de R$1, marcar o
   registro em `conversion_events` como divergente.
2. **Alerta no painel `/admin/conversoes`:** uma marcação visual nos pedidos com
   divergência de preço, para você perceber no mesmo dia e não semanas depois.
3. **Nenhuma mudança de preço no site** — os valores exibidos hoje estão certos
   segundo a régua (1 produto 20%, 2 produtos 30%, 3+ 40%).

## Fora do escopo
- Alterar layout, links de checkout ou fluxo de brindes.
- Mexer nas configurações da Yampi (só você tem acesso ao painel).
