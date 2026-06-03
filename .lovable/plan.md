## Redesign dos Cards da Seção de Benefícios

Atualizar `src/components/BenefitsSection.tsx` para elevar o visual dos 6 cards de benefícios com elementos de marca.

### Alterações nos Cards

1. **Bordas arredondadas maiores**
   - Trocar `rounded-2xl` por `rounded-[20px]` (20px).

2. **Sombra suave e elegante**
   - Substituir `shadow-sm` flat por sombra brand suave: `shadow-[0_8px_30px_rgba(70,103,180,0.07)]`.

3. **Efeito hover: levantamento + sombra crescente**
   - Adicionar `hover:-translate-y-2` + `hover:shadow-[0_12px_40px_rgba(70,103,180,0.12)]` com `transition-all duration-300`.
   - Remover a barra de largura animada no hover atual (estilo flat).

4. **Ícones em círculos com identidade da marca**
   - Ícone: cor `#9BAE52` (verde oliva).
   - Container do ícone: `rounded-full` (círculo), fundo `rgba(70,103,180,0.12)` (azul royal 12%).

5. **Detalhe de borda superior em gradiente**
   - Adicionar uma faixa de 3px no topo de cada card com gradiente `from-[#4667B4] to-[#9BAE52]` via elemento posicionado absolutamente.

### Escopo

- Apenas o arquivo `src/components/BenefitsSection.tsx` será modificado.
- O layout da grid (`lg:grid-cols-6` com spans alternados) permanece inalterado.
- Nenhuma mudança em tokens globais de CSS ou Tailwind.