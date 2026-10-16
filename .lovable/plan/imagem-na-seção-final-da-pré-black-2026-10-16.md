# Imagem na seção final da Pré Black

A arte enviada (fundo escuro, símbolo do WhatsApp coroado, "O GRUPO VIP RECEBE PRIMEIRO", "Pré-Black Lipovitta — Até 30% OFF + condições especiais", botão azul desenhado e logo) entra na seção **"O PRÓXIMO PASSO É SEU / A Pré Black começa no grupo VIP."**

## Como fica

```text
COMPUTADOR (1440)                         CELULAR (390)
---------------------------------         -----------------------
| O PRÓXIMO PASSO É SEU       | [arte] |  | O PRÓXIMO PASSO É SEU |
| A Pré Black começa          | [arte] |  | A Pré Black começa    |
| no grupo VIP.               | [arte] |  | no grupo VIP.         |
|                             | [arte] |  |        [arte]         |
| [ ENTRE AGORA NO GRUPO VIP  | [arte] |  | [ ENTRE AGORA NO GRUPO|
|   DO WHATSAPP ]             |        |  |   DO WHATSAPP ]       |
| 21 DE OUTUBRO / 09H · BAHIA |        |  | 21 DE OUTUBRO / 09H   |
---------------------------------         -----------------------
```

- A arte aparece **inteira, sem recorte** (o botão azul desenhado dentro dela é apenas visual).
- A imagem é **clicável**: leva exatamente ao link do grupo VIP, igual ao banner, e o clique é registrado.
- Nada muda nas outras seções, na home, nos pagamentos ou nos demais fluxos.

## O que muda na seção

- **Removido** (a frase de apoio repete a oferta que já está dentro da arte): *"E seja VIP: tenha acesso antecipado às ofertas, condições especiais e acompanhe tudo."*
- **Mantidos**: o rótulo "O PRÓXIMO PASSO É SEU", o título "A Pré Black começa no grupo VIP.", o botão verde com o texto original, o apoio do botão e a linha "21 DE OUTUBRO / 09H · BAHIA".

## Passos

1. **Publicar a arte no CDN** do site: criar o ponteiro `src/assets/pre-black-final-grupo.png.asset.json` a partir do arquivo enviado, sem deixar a cópia binária no projeto.
2. **Reorganizar a seção final** em duas colunas: textos + botão verde à esquerda, arte clicável à direita; no celular, a arte vem logo acima do botão verde.
3. **Ligar a arte ao grupo**: mesmo link exato dos outros botões (sem parâmetros acrescentados), abrir em nova aba, com registro de clique (não conta como Lead nem como entrada no grupo) e contorno de foco acessível.
4. **Ajustar os estilos** da seção para o novo arranjo (texto à esquerda no computador, centralizado no celular) e manter a animação de entrada ao rolar.
5. **Conferir**: testes da página, verificação de código, compilação e navegação real em 1440 e 390 — arte visível, link exato nos três botões e na imagem, nenhum corte, nenhum erro. A saída para fora do site é bloqueada durante o teste, então ninguém entra no grupo.
6. **Atualizar a lista de tarefas** e registrar a pendência de aprovação. **Sem publicar** nesta etapa: você aprova pela visualização.

## Detalhes técnicos

- Arquivos: `src/assets/pre-black-final-grupo.png.asset.json` (novo), `src/pages/PreBlack.tsx`, `src/index.css`, `roadmap.md`.
- URL da arte resolvida contra `https://lipovitta.site` (o proxy local não serve a imagem renderizável), como já ocorre no hero e no banner.
- Grade com áreas nomeadas: computador `copy photo` / `action photo`; celular `copy` → `photo` → `action`.
- Seletores existentes `.pb-final .pb-shell > p:not(.pb-eyebrow):not(.pb-final-date)` e `.pb-final .pb-cta-block` serão reescritos para o novo aninhamento.
- Atributos da imagem: `width="1122" height="1402"`, `loading="lazy"`, texto alternativo: "O grupo VIP recebe primeiro. Pré-Black LipoVitta: até 30% OFF e condições especiais. Arte com símbolo do WhatsApp coroado sobre fundo escuro e botão visual 'Entrar agora'."
- Rastreamento do clique na arte: `trackCtaClick({ location: "pre_black_final_image", label: "O GRUPO VIP RECEBE PRIMEIRO", eventName: "CTAClick" })`.
- `data-pb-motion="scroll"` permanece no contêiner da seção, sem alterações no hook de movimento.
