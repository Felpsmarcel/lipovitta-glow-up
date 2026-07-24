## Diagnóstico

Os 4 brindes estão pesados porque foram enviados ao CDN como **PNGs originais gigantes** e servidos sem variantes modernas:

| Arquivo | Peso atual | Formato |
|---|---:|---|
| `brinde-garrafa.png` | 2,97 MB | PNG original |
| `brinde-portacapsulas.png` | 2,84 MB | PNG original |
| `brinde-raspador.png` | 2,71 MB | PNG original |
| `brinde-mixer.png` | 2,64 MB | PNG original |
| **Total** | **~11,2 MB** | — |

Motivos combinados:
1. **CDN entrega o PNG cru** — os `.asset.json` apontam para arquivos imutáveis no R2, sem AVIF/WebP, sem redimensionamento.
2. **Renderizam os 4 juntos** assim que a seção "Escolha do brinde" aparece (após clicar em comprar), sem srcset — o navegador puxa a resolução cheia mesmo em mobile 430 px.
3. **Sem `width`/`height`** — causa reflow durante o carregamento.

## Correção

Trocar o modelo: em vez de apontar para o CDN de assets (imutável), colocar os PNGs em `src/assets/gifts/` e importá-los pelo `vite-imagetools` (mesmo pipeline já usado nos depoimentos, cápsulas etc.). O build gera AVIF/WebP/PNG em múltiplas larguras automaticamente, com hash e cache-imutável.

### Passos

1. **Baixar os 4 PNGs originais do CDN** para `src/assets/gifts/` (nome mantido).
2. **Trocar imports em `src/data/gifts.ts`** de `.asset.json` para import responsivo:
   ```ts
   import raspadorImg from "@/assets/gifts/brinde-raspador.png?w=320;640&format=avif;webp;png&as=picture";
   ```
   e expor o objeto `picture` no tipo `Gift` (em vez de `image: string`).
3. **Atualizar `GiftSelectionSection.tsx`** para renderizar via `<ResponsiveImage>` (helper já existente), com:
   - `sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"`
   - `loading="lazy"` + `decoding="async"` + `width`/`height` explícitos vindos do `picture.img`.
4. **Remover os 4 `.asset.json` antigos** com `lovable-assets delete --file <pointer>` (libera storage no CDN; sem referências restantes).
5. **Build + preview** para confirmar peso final e ausência de 404.

## Detalhes técnicos

- Larguras `320` e `640` cobrem o card (mobile ~180 px CSS × dpr 3 = 540 px reais; desktop ~260 px × dpr 2 = 520 px). Não precisa gerar `1200w`.
- AVIF típico nesses PNGs de produto sobre fundo claro fica em **20–40 KB** por variante; WebP ~50–70 KB; PNG fallback ~150 KB.
- Estimativa pós-otimização: **~100 KB por brinde** entregue (AVIF) → **~400 KB total** vs. 11 MB atuais (**~97% de redução**).

## Fora de escopo

- Layout, textos, lógica de elegibilidade, UTM, tracking Meta Pixel.
- Outras imagens do site (já otimizadas em turnos anteriores).
