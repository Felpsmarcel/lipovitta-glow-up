# Saber qual brinde o cliente escolheu (sem o brinde ser produto no pedido)

Como o brinde saiu do carrinho da Yampi, a escolha continua chegando — ela já viaja no link do checkout como `utm_content=brinde_xxx` e o webhook da Yampi já grava esse valor junto ao pedido. O que falta é isso aparecer para você na hora de separar o pedido.

## O que será feito

### 1. Mostrar o brinde no painel de conversões
Em `/admin/conversoes`:
- Nova coluna **Brinde** na tabela (o dado já é buscado, só não é exibido).
- Nome amigável em vez do código (ex.: `brinde_garrafa` → "Garrafa Térmica Personalizada").
- Filtro rápido "somente compras", para você ver a lista de pedidos pagos com número do pedido + brinde.
- Botão de exportar CSV (pedido, data, valor, brinde) para usar na expedição.

### 2. Aviso por e-mail a cada pedido pago
No webhook da Yampi, depois de registrar a compra, disparar um e-mail para `lipovitta@clarinhacbr.com.br` com:
- número do pedido, nome do cliente, valor
- **brinde escolhido** em destaque
- itens do pedido

Assim a informação chega junto com o pedido, sem depender de abrir o painel.

### 3. Robustez do vínculo
- Se o pedido chegar sem `utm_content` (cliente que colou o link sem parâmetros ou finalizou depois), o registro fica como "Brinde não informado" — visível no painel para você tratar manualmente.
- Guardar também o `utm_content` cru, para conferência.

## Alternativa (se preferir ver dentro da própria Yampi)
Em vez de e-mail, dá para voltar a levar o brinde ao pedido sem custo: um item de R$0,00 ou uma observação no carrinho. Isso depende do que a Yampi permite no checkout via link — se você quiser esse caminho, verifico junto com você antes de mexer.

## Fora de escopo
- Preços, descontos e regra dos brindes no site continuam como estão.
- Links de checkout não mudam.
