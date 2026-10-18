# Trocar links de checkout dos produtos avulsos

## O que muda
- Cápsulas LipoVitta (avulso): `https://seguro.lipovitta.site/b/CIG6J1D5VEGW` (antes `/r/RMTIX51GQN`)
- Shot Matinal (avulso): `https://seguro.lipovitta.site/b/OSFWLDJPY68W` (antes página do catálogo Yampi)
- Shot Rush (avulso): `https://seguro.lipovitta.site/b/9LRFVAL976CC` (antes `/r/5NYVZ7D8UT`)

Kits (Protocolo, Kit Rush + Cápsulas, Kit Completo) não mudam.

## Detalhes técnicos
- `src/components/OfferSection.tsx`: atualizar `LINK_CAPSULAS` e `LINK_SHOT`. O sabor escolhido segue indo como `?sabor=` junto com eventId e UTMs.
- `src/components/ProductsSection.tsx`: atualizar `checkoutUrl` do Shot Rush e o `sku` para `9LRFVAL976CC`.
- Preços, sabor, brinde e rastreamento ficam iguais.
- Abrir os três links na Yampi sem finalizar compra, para conferir produto e preço (30%: R$249,90 / R$119,00 / R$157,50). Não publicar.
