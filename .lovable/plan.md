## Remover emojis da seção "Como Usar"

### Objetivo
Remover os emojis dos títulos dos 4 passos na seção "Como Usar", mantendo a numeração visual em círculos verdes já existente.

### Alterações
1. **src/components/HowToUseSection.tsx**
   - Remover a propriedade `emoji` do array `steps` (4 itens)
   - Remover o `<span>` que renderiza o emoji dentro do título de cada passo
   - Manter o círculo numérico verde (`{i + 1}`) como está

### O que NÃO será alterado
- Textos dos títulos e descrições
- Cores, fontes, espaçamentos, layout
- Círculos numéricos verdes
- Links, checkout, pixels, scripts
- Qualquer outra seção da página

### Resultado esperado
Títulos limpos sem emojis, com a numeração 1-2-3-4 nos círculos verde-musgo preservada.