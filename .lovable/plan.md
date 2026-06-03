## Substituir placeholder por vídeo da Clara no Hero

### O que muda
- Upload do vídeo enviado para o CDN via `lovable-assets` em `src/assets/clara-hero.mp4.asset.json`
- Substituir o placeholder atual (`📸 Foto profissional da Clara — em breve`) na coluna direita do `HeroSection` por um `<video>` real

### Implementação (`src/components/HeroSection.tsx`)
- Importar `claraVideo from "@/assets/clara-hero.mp4.asset.json"`
- Trocar o bloco interno do container `aspect-[4/5]` por:
  ```tsx
  <video
    src={claraVideo.url}
    autoPlay muted loop playsInline
    preload="metadata"
    aria-label="Clara Caldas — criadora da rotina LipoVitta"
    className="w-full h-full object-cover"
  />
  ```
- Manter o container existente: `aspect-[4/5]`, `rounded-2xl`, `overflow-hidden`, sombra `0 20px 60px hsl(var(--primary)/0.18)`, e o selo gradiente "LIPOVITTA" no canto
- Remover o fundo `bg-gradient-brand-soft` do container (não aparece mais sob o vídeo) e a legenda "em breve"

### Arquivos afetados
- novo: `src/assets/clara-hero.mp4.asset.json` (pointer CDN)
- editar: `src/components/HeroSection.tsx`
