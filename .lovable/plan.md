

# LipoVitta — Landing Page de Vendas

## Visão Geral
Landing page de vendas moderna, mobile-first, para o suplemento feminino LipoVitta por Clara Caldas. Design clean, premium, feminino e profissional.

## Branding
- Paleta: Azul escuro #1B3A6B, Azul médio #2E5EA6, Verde sage #7BA33E, Verde claro #A8D45A, Branco gelo #F5F7FA, Cinza #E8ECF1, Texto #333333
- Tipografia: Playfair Display (headlines) + Inter (corpo)
- Logo: imagem fornecida pelo usuário (copiada para assets)

## Estrutura da Página

### 1. Barra de Urgência (fixa no topo)
- Fundo verde #7BA33E, texto branco bold
- "🔥 OFERTA DE LANÇAMENTO — Desconto exclusivo por tempo limitado!"
- Countdown timer reutilizável (48h), mostrando dias/horas/minutos/segundos

### 2. Navbar
- Logo LipoVitta à esquerda
- Fundo branco, sticky abaixo da barra de urgência
- Clean e minimalista

### 3. Hero Section
- Gradiente de #1B3A6B → #F5F7FA com padrão orgânico sutil em overlay
- Headline grande em branco: "Acabe com o inchaço e a celulite com a rotina que transforma de verdade!"
- Subheadline em branco (90% opacidade)
- Placeholder para imagem do produto (400x400, borda #2E5EA6, border-radius)
- Botão CTA pulsante: "QUERO MINHA TRANSFORMAÇÃO" — verde #7BA33E, pill shape, sombra, animação pulse
- 3 micro-badges: "✅ 100% Natural" | "✅ Sem Glúten" | "✅ Resultados em semanas"

### 4. Componentes Técnicos
- `CountdownTimer` — componente reutilizável com props de data-alvo, usando useState/useEffect
- CSS variables atualizadas com a paleta do projeto
- Google Fonts: Playfair Display + Inter
- Mobile-first: tudo empilhado, botão full-width, tipografia ajustada

