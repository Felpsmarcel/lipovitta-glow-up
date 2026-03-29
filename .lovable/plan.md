

# Trocar vídeo do Hero por MP4

## O que muda
Substituir o iframe do Instagram (linhas 78-102) por um `<video>` tag nativo com o MP4 fornecido. Remover o estado `iframeError` e o fallback, pois não são mais necessários.

## Editar `src/components/HeroSection.tsx`

- Remover `useState` import e `iframeError` state
- Substituir o bloco iframe/fallback (linhas 78-102) por:
  ```jsx
  <video
    src="https://assets.cdn.filesafe.space/GlpDUog4tP50uH0NOPjz/media/69c95b313204cc15746c0dfb.mp4"
    autoPlay
    muted
    loop
    playsInline
    className="w-full h-full object-cover"
    title="Vídeo da Clara Caldas"
  />
  ```
- Manter o container com aspect-ratio 9/16, border-radius, sombra
- Atualizar o texto abaixo para "📍 @clarinhacbr" (remover "no Instagram" ou manter como está)

