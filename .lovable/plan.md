# Redesign da Hero Section

Reformular a `HeroSection.tsx` removendo o pattern de cruzinhas, aplicando fundo da marca, swoosh decorativo, novo layout título+foto e CTA com gradiente e hover refinado.

## 1. Fundo

- Remover o `<div>` com `backgroundImage` SVG (cruzinhas).
- Trocar o fundo navy escuro atual (`hsl(214 59% 26%)`) por **gradiente sutil diagonal** da marca:
  - `background: linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, #ffffff 45%, hsl(var(--accent) / 0.06) 100%)`
- Texto passa a ser escuro (`text-foreground`) sobre fundo claro. Badges e detalhes ajustados para contraste em fundo branco.

## 2. Swoosh decorativo

- Adicionar um SVG absoluto, atrás do conteúdo (`-z-0`, `pointer-events-none`, `opacity-70`), com uma curva ampla preenchida por gradiente `#4667B4 → #9BAE52` (definido via `<defs><linearGradient>` no próprio SVG).
- Posição: atravessando a base do título à esquerda e descendo até o canto inferior direito da seção — reforço visual de marca.
- Manter a linha orgânica fina atual na base como apoio, mas recolorida com o gradiente da marca (ou removida se conflitar).

## 3. Layout

- Coluna esquerda (`lg:basis-[58%]`): mantém kicker, H1 grande na fonte display, parágrafo, citação, CTA e badges.
  - Cores ajustadas para fundo claro: kicker em `text-primary`, H1 em `text-foreground` (com palavra-chave destacada em `text-gradient-brand`, ex.: "controle"), citação em `text-accent`, badges em `bg-muted text-foreground`.
- Coluna direita (`lg:basis-[42%]`): substituir o vídeo por **placeholder de foto profissional da Clara**:
  - Container `aspect-[4/5]` ou `9/16`, `rounded-2xl`, sombra suave, com `bg-gradient-brand-soft` e ícone/legenda "Foto profissional da Clara — em breve".
  - Pequeno selo decorativo (badge circular gradiente) sobreposto no canto, reforçando identidade.
- Legenda do Instagram permanece abaixo do placeholder.

## 4. CTA principal

- Manter texto e link, mas refinar interação:
  - Classes: `bg-gradient-brand text-white font-bold rounded-full px-10 py-4 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl`
  - Remover `animate-pulse-cta` (com fundo claro o pulse fica agressivo) **ou** suavizar o keyframe — proposta: remover do hero e manter pulse apenas no CTA do CTABanner.

## 5. Detalhes técnicos

- Arquivo único alterado: `src/components/HeroSection.tsx`.
- Sem mudanças em `index.css` / `tailwind.config.ts` (tokens `--gradient-brand`, `--gradient-brand-soft` e classes utilitárias já existem).
- Manter responsividade mobile (430px): coluna única, placeholder com `max-w-[340px]`, swoosh reposicionado/escalado em mobile para não cobrir texto (`hidden md:block` se necessário, ou versão reduzida via `md:` variants).
- Acessibilidade: contraste do texto novo sobre fundo claro validado; swoosh com `aria-hidden`.

## 6. Verificação

- Conferir mobile 430px e desktop: H1 legível, CTA destacado, placeholder visível, swoosh decorativo sem cobrir texto.
- Nenhuma referência ao pattern SVG de cruzinhas permanece.
