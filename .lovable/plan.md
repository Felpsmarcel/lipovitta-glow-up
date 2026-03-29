

# Seções Benefícios + Para Quem É

## Arquivos

### Criar `src/components/BenefitsSection.tsx`
- Fundo gradiente #F5F7FA → #FFFFFF
- Título + linha decorativa (mesmo padrão dos depoimentos)
- Grid 3x2 desktop / 1 coluna mobile com 6 cards
- Cards com ícones lucide-react (48px, #2E5EA6), título #1B3A6B, descrição #555
- Hover: sombra elevada + borda inferior #7BA33E via `group-hover`
- Ícones mapeados: Footprints, Droplets, Zap, Heart, Activity, Shield

### Criar `src/components/ForWhoSection.tsx`
- Fundo sólido #1B3A6B
- Layout flex: texto à esquerda, placeholder imagem à direita (mobile: empilhado)
- Título #7BA33E, lista com CheckCircle #7BA33E e texto branco
- 5 itens da lista conforme especificado
- Botão CTA verde pill shape (mesmo estilo do hero)
- Placeholder imagem: div arredondada com borda e ícone

### Editar `src/pages/Index.tsx`
- Importar e adicionar `BenefitsSection` e `ForWhoSection` após `TestimonialsSection`

