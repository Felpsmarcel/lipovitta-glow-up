## Ajustes pontuais — sabor Shot Rush + Complementos

### 1. Corrigir "Melancia" → "Frutas Vermelhas"
Trocar em `src/components/OfferSection.tsx` (4 ocorrências):
- linha 55: `alt="Kit Shot Rush sabor Frutas Vermelhas + Cápsulas LipoVitta"`
- linha 63: badge `Sabor Frutas Vermelhas`
- linha 72: descrição `Shot Rush sabor Frutas Vermelhas`
- linha 91: `1 Shot Rush sabor Frutas Vermelhas (180g)`

Nome principal "Shot Rush" preservado. Nenhuma outra ocorrência de "Melancia" no projeto (já verificado com ripgrep).

### 2 + 3. Seção "Complementos opcionais para sua rotina"
Em `src/components/ProductsSection.tsx`:
- **Remover o card do Gummy VittaGlow Colágeno** (está esgotado).
- Manter apenas o card do **Shot Rush Pré-Treino** (em estoque), que já existe na seção.
- Trocar o grid de `md:grid-cols-2` para layout centralizado de 1 coluna com largura controlada (`max-w-md mx-auto`) para a seção continuar bonita com apenas 1 produto.
- Manter título, subtítulo, divisor, estilo do card, preços, imagem e link Yampi atuais — sem mudar layout visual do card em si nem responsividade.
- Linha 184 do `OfferSection` ("Adicione Shot Matinal, Gummy ou Shot Rush logo abaixo.") será ajustada para remover "Gummy" (já que não existe mais como complemento): trocar por "Adicione o Shot Rush logo abaixo."

### 4. Lógica de estoque (visual, sem backend)
Modelar via flag local no array de produtos do `ProductsSection.tsx`:
```ts
const complementos = [
  { id: "shot-rush", inStock: true, ... },
  { id: "gummy", inStock: false, ... }, // oculto
];
```
Renderizar apenas `complementos.filter(p => p.inStock)`. Assim, para reativar o Gummy no futuro basta virar a flag — sem reescrever a seção. Sem chamada de API/banco (escopo é frontend).

### 5. Fora de escopo (não mexer)
Preços, imagens, identidade visual, checkout, outros componentes, layout geral da página.

### Critérios de aceite
- `rg -i "melancia" src/` retorna vazio.
- Seção Complementos mostra só Shot Rush, centralizado, responsivo desktop/mobile.
- Kit no `OfferSection` exibe "Frutas Vermelhas" em alt, badge, descrição e bullets.