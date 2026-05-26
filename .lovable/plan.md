## Objetivo
Substituir os textos de todos os botões CTA da landing LipoVitta para alinhar à nova hierarquia de comunicação, sem alterar estilo, cor, links, checkout, pixels ou scripts.

## Alterações

### 1. HeroSection.tsx
- Linha 47: trocar texto do `<a>` de `"QUERO COMEÇAR MINHA TRANSFORMAÇÃO"` para `"CONHECER A ROTINA LIPOVITTA"`.

### 2. RoutineSection.tsx
- Linha 141: trocar texto do `<button>` de `"QUERO CONHECER OS PRODUTOS"` para `"VER A FÓRMULA PRINCIPAL"`.

### 3. ForWhoSection.tsx
- Linha 39: trocar texto do `<a>` de `"QUERO COMEÇAR MINHA TRANSFORMAÇÃO"` para `"COMEÇAR PELA CÁPSULA"`.

### 4. CTABanner.tsx
- Linha 12: trocar texto do `<a>` de `"QUERO MINHA TRANSFORMAÇÃO"` para `"ESCOLHER MEU KIT"`.

### 5. ProductsSection.tsx
- Linha 76: trocar texto do `<button>` do card Shot Matinal de `"Ver oferta"` para `"ADICIONAR À MINHA ROTINA"`.

### 6. OfferSection.tsx
- Linha 81: trocar texto do `<a>` do card LipoVitta Cápsula de `"COMPRAR AGORA"` para `"COMEÇAR MINHA ROTINA"`.
- Linha 135: trocar texto do `<a>` do kit destaque (Kit LipoVitta + Shot Matinal) de `"COMPRAR AGORA COM DESCONTO"` para `"ESCOLHER PROTOCOLO COMPLETO"`.

### 7. Varredura geral
- Buscar qualquer ocorrência remanescente de `"QUERO COMEÇAR MINHA TRANSFORMAÇÃO"` ou `"QUERO MINHA TRANSFORMAÇÃO"` em todo o projeto e substituir por `"CONHECER A ROTINA LIPOVITTA"`.

## O que permanece inalterado
- Estilos CSS, cores, tamanhos, bordas, animações, classes Tailwind.
- Todos os atributos `href`, `onClick`, `target`, `rel` e comportamentos de navegação.
- Scripts de rastreamento, pixels, checkout e lógica de conversão.
- Todo o restante do conteúdo textual da página.