

# Adicionar poster ao vídeo do Hero

## O que muda
Adicionar atributo `poster` ao `<video>` em `HeroSection.tsx` com um frame estático do vídeo, para que o navegador exiba a imagem imediatamente enquanto o MP4 carrega.

## Editar `src/components/HeroSection.tsx`

Adicionar `poster` e `preload="none"` ao `<video>`:

```jsx
<video
  src="https://assets.cdn.filesafe.space/GlpDUog4tP50uH0NOPjz/media/69c95b313204cc15746c0dfb.mp4"
  poster="https://assets.cdn.filesafe.space/GlpDUog4tP50uH0NOPjz/media/69c95b313204cc15746c0dfb.mp4#t=0.5"
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  className="w-full h-full object-cover"
  title="Vídeo da Clara Caldas"
/>
```

O `#t=0.5` extrai um frame do próprio vídeo como thumbnail. O `preload="metadata"` carrega apenas metadados iniciais, acelerando o first paint.

**Nota**: Para um poster verdadeiramente otimizado, o ideal seria gerar um `.webp` estático do frame. Como não temos esse asset disponível, usamos o truque `#t=0.5` que funciona na maioria dos navegadores modernos.

