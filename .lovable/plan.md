

# Seções Como Usar + Ingredientes

## Arquivos

### Criar `src/components/HowToUseSection.tsx`
- Fundo branco, título + linha decorativa gradiente (padrão existente)
- Timeline vertical com linha conectora #2E5EA6 à esquerda dos passos (desktop)
- Mobile: cards empilhados sem linha lateral
- 4 passos com círculo numerado #7BA33E, título bold #1B3A6B, descrição #555

### Criar `src/components/IngredientsSection.tsx`
- Fundo gradiente #F5F7FA → branco, título + subtítulo
- 5 cards com borda esquerda 4px #2E5EA6
- Título bold com dosagem em #7BA33E, descrição #555
- Barra de progresso visual proporcional à dosagem (cor #2E5EA6)
- Dimpless® com borda especial #7BA33E + badge "PATENTEADO"
- Mobile: accordion (usando Collapsible do radix) — desktop: todos expandidos

### Editar `src/pages/Index.tsx`
- Importar e adicionar `HowToUseSection` e `IngredientsSection` após `ForWhoSection`

