# Atualizar props do SEOHead na home

Em `src/pages/Index.tsx`, substituir o uso atual do `<SEOHead />` pelos novos valores:

```tsx
<SEOHead
  title="Tratamento Natural para Lipedema"
  description="LipoVitta: Suplemento natural clinicamente testado para reduzir sintomas do lipedema. Alívio da dor, redução do inchaço e melhora da circulação. Fórmula exclusiva com ingredientes naturais."
  keywords="lipedema tratamento, suplemento para lipedema, como tratar lipedema, lipedema tem cura, LipoVitta"
  ogType="website"
  canonicalUrl="https://lipovitta.site/"
/>
```

Mantenho `canonicalUrl` apontando para `https://lipovitta.site/` (domínio real do projeto).

Nada mais é alterado.
