# Autocrítica do site LipoVitta

Análise feita rodando a página real (desktop 1280 e mobile 390) e lendo o código. Abaixo, o que está bom, o que está quebrado e o que eu proponho corrigir.

## O que está bom

- Narrativa forte e pessoal (Clara em primeira pessoa), tom honesto, sem promessa médica.
- Foco comercial claro: Cápsula como produto principal, complementos como upsell.
- Fluxo de brinde integrado ao checkout com UTM — diferencial raro em landing.
- SEO técnico já resolvido (title, JSON-LD, sitemap, llms.txt) e imagens em AVIF/WebP.

## Problemas encontrados

### 1. Depoimentos cortados (crítico de conversão)

Os cards usam `object-cover` dentro de proporções fixas (`aspect-[3/4]`, `aspect-[4/3]`...). Como as artes são verticais com texto, a frase final é literalmente cortada no meio: "O combo cápsulas + shot matinal atua todos os..." fica ilegível. É a seção de prova social — perder a frase final mata o argumento.

### 2. Mosaico com buraco visual no desktop

O grid assimétrico deixa uma coluna inteira vazia à direita em várias linhas. A intenção de quebrar a simetria virou espaço morto.

### 3. Contador de clientes inventado e inconsistente

"Mais de 933 mulheres" no desktop e "936" no mobile, na mesma sessão. É um número animado/gerado, não um dado real. Além de risco de credibilidade, expõe a marca em publicidade de saúde. sao mais de 1000 mulheres 

### 4. Logo não renderiza na navbar

Aparece o texto alternativo "LipoVitta por Clara Caldas" quebrado em duas linhas, empurrando o layout. No mobile isso ainda faz o botão "COMPRAR AGORA" quebrar em duas linhas.

### 5. Contraste baixo na seção de benefícios

Texto claro sobre azul médio (`#4667B4` com opacidade) nos cards de benefício — é exatamente o achado de acessibilidade que o scanner de SEO aponta.

### 6. Repetição de CTA sem variação

O mesmo `CTABanner` ("ESCOLHER MEU KIT") aparece duas vezes, idêntico. Repetir é bom; repetir igual é ruído.

### 7. Ruído de console

Vários warnings de `Function components cannot be given refs` na inicialização do App. Não quebra nada hoje, mas polui o diagnóstico de erros reais.

## Correções propostas

1. **Depoimentos**: trocar `object-cover` por `object-contain` (ou remover as proporções fixas e deixar as imagens em altura natural), garantindo que nenhuma arte seja cortada.
2. **Mosaico**: reduzir para um grid de 3 colunas equilibrado no desktop, mantendo leves rotações para não ficar rígido, mas sem coluna vazia.
3. **Contador**: substituir o número animado por uma afirmação verificável, ou por um número fixo que você confirme. Preciso da sua decisão aqui.
4. **Navbar**: corrigir o carregamento do logo, definir altura/largura explícitas e impedir quebra de linha no botão de compra no mobile.
5. **Contraste**: aumentar o contraste dos textos dos cards de benefícios para atender WCAG AA.
6. **CTAs**: diferenciar o texto dos dois banners conforme o momento da página.
7. **Console**: silenciar os warnings de ref nos providers do `App.tsx`.

## Detalhes técnicos

- `src/components/TestimonialsSection.tsx`: linhas ~78-85 (classes de grid/aspect e `object-cover`) e ~114 (contador).
- `src/components/Navbar.tsx`: `<img>` do logo, `width`/`height` e `whitespace-nowrap` no CTA.
- `src/components/BenefitsSection.tsx`: tokens de cor do texto dos cards.
- `src/components/CTABanner.tsx`: aceitar prop `label`.
- `src/App.tsx`: ordem/uso dos providers para eliminar os warnings.

Nenhuma mudança de preço, link de checkout ou fluxo de brinde.