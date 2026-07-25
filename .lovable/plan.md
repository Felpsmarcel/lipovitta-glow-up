## Ajustar experiência mobile na seção de brindes

A seção `GiftSelectionSection` está usando `grid-cols-1` em mobile, fazendo cada card de brinde ocupar quase toda a largura da tela. Isso deixa as imagens dos brindes muito grandes e desproporcionais no celular.

### Alterações em `src/components/GiftSelectionSection.tsx`

1. **Grid mobile de 2 colunas**
   - Trocar `grid-cols-1 sm:grid-cols-2` por `grid-cols-2 sm:grid-cols-2` na grade de brindes.
   - Reduzir o gap em mobile: `gap-3 sm:gap-5`.

2. **Reduzir padding interno da imagem em mobile**
   - Ajustar o container da imagem de `p-6` para `p-3 sm:p-6`.

3. **Tipografia mais compacta em mobile**
   - Reduzir o título do brinde de `text-lg` para `text-sm sm:text-lg`.
   - Reduzir a linha de descrição de `text-sm` para `text-xs sm:text-sm`.

4. **Ajustar tamanho do check de seleção**
   - Manter o check proporcional ao card menor, reduzindo levemente em mobile se necessário.

5. **Manter largura máxima e centralização**
   - Preservar `max-w-5xl mx-auto` para que em telas grandes continue com a aparência atual.

### Fora de escopo
- Não alterar os brindes disponíveis, regras de elegibilidade, UTM, lógica de checkout, pixel ou imagens dos brindes.
- Não alterar a experiência desktop/tablet além dos ajustes responsivos de proporção.

### Resultado esperado
Em mobile, os brindes aparecerão em 2 colunas, com cards mais compactos e imagens menores, melhorando a navegação e a proporção visual sem perder a legibilidade.