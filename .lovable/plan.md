## Atualizar SEOHead da Home para a oferta de compra

Substituir as props atuais do `<SEOHead />` em `src/pages/Index.tsx` pelos valores focados na oferta de compra do LipoVitta.

### Mudança em `src/pages/Index.tsx`

```tsx
<SEOHead
  title="Comprar LipoVitta - Oferta Exclusiva"
  description="Adquira LipoVitta com desconto exclusivo. Frete grátis, garantia de 30 dias e resultados comprovados. Aproveite a promoção limitada!"
  keywords="comprar LipoVitta, LipoVitta preço, LipoVitta onde comprar"
  ogType="product"
  canonicalUrl="https://lipovitta.site/"
/>
```

### Observações

- A Home passa a anunciar-se como página de produto (`og:type=product`), substituindo o SEO genérico anterior.
- Nenhum outro arquivo é alterado; o componente `SEOHead` já suporta todas essas props.
- Como só existe a rota `/`, o canonical permanece `https://lipovitta.site/`.
