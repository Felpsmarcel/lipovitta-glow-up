Atualizar a constante `LINK_PROTOCOLO` em `src/components/OfferSection.tsx` para a nova URL Yampi do Protocolo Completo:

- De: `https://loja.lipovita.club/produtos/shot-matinal-sabor-limao-lipovitta-capsulas/`
- Para: `https://lipovitta2.pay.yampi.com.br/r/3QE08AQ4XM`

Também atualizar o `href` da imagem do card Protocolo (linha ~117), que hoje aponta para a URL antiga `loja.lipovita.club`, para usar a mesma URL Yampi — assim imagem e botão "ESCOLHER PROTOCOLO COMPLETO" levam ao mesmo checkout.

Nenhuma outra mudança (preços, layout e o card Cápsulas permanecem iguais).