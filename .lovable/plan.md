## Objetivo
Atualizar a seção de depoimentos da landing LipoVitta para remover depoimentos genéricos e preparar espaço para prints reais de WhatsApp, mantendo o contador social e layout existente.

## Arquivo: `src/components/TestimonialsSection.tsx`

### 1. Título e subtítulo
- Alterar título de "Veja o que mulheres reais estão dizendo" para **"O que nossas clientes dizem"**
- Adicionar subtítulo: **"Prints reais. Resultados reais."**

### 2. Remover depoimentos escritos
- Remover array `testimonials` com os 6 depoimentos
- Remover componente `TestimonialCard`
- Remover grid desktop de depoimentos
- Remover carrossel mobile de depoimentos + dots de navegação
- Remover imports não utilizados (`Star`, `CheckCircle`, `useEmblaCarousel`, `useState` para o carousel, etc.)

### 3. Adicionar placeholder visual para prints
- Criar grid responsivo capaz de exibir de 3 a 9 imagens (desktop: 3 colunas, tablet: 2, mobile: 1 ou adaptável)
- Cada slot será um retângulo vertical (aspect-ratio ~9:16) com borda sutil e fundo neutro (estilo print de celular)
- Texto temporário centralizado no grid: **"Em breve: depoimentos reais das nossas clientes."**
- O texto e o placeholder grid devem ser fáceis de remover quando os prints forem adicionados

### 4. Contador social
- Manter o `useAnimatedCounter` e a animação
- Substituir texto de "+ de {count} mulheres já transformaram sua rotina com LipoVitta" por **"Mais de {count} mulheres já usam LipoVitta na rotina."**

### 5. Regras de design
- Sem emojis
- Sem estrelas amarelas
- Mobile-first
- Manter espaçamento generoso (py-16 md:py-24, etc.)
- Manter cores e fontes existentes do design system

### 6. Não alterar
- Outras seções
- Produtos, preços, links, checkout
- Pixels ou scripts
