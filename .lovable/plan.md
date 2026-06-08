## Adicionar ingrediente Opuntia fícus à seção de ingredientes

O usuário solicitou incluir o ingrediente **Opuntia fícus** na seção "Cada ingrediente foi selecionado para atuar de forma sinérgica no seu corpo".

### Alteração
- **Arquivo:** `src/components/IngredientsSection.tsx`
- **Ação:** Adicionar novo objeto ao array `ingredients` com:
  - `name`: "Opuntia fícus"
  - `dose`: "50mg"
  - `description`: "Auxilia na retenção de líquidos e saciedade."
  - `max`: 130 (mesma escala dos demais para a barra visual)
- **Posição:** Ao final do array, após Trans-Resveratrol.

### Resultado
O novo ingrediente aparecerá tanto na visualização desktop (cards expandidos) quanto mobile (accordion) com nome, dosagem, descrição e barra de proporção visual.