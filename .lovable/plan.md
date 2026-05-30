# Limpeza de copy "cheirando a IA"

Faço apenas substituições de texto, sem mexer em preços, links, scripts, checkout, depoimentos, pixels ou estrutura. Mudanças mínimas e cirúrgicas — só onde aparecem termos da lista do briefing ou frases longas/promissoras demais.

## Alterações por arquivo

### `HeroSection.tsx`
- Parágrafo (linha 36): trocar
  > "Eu sou Clara Caldas e convivo com o lipedema. Ele não tem cura, mas tem controle. Criei o **sistema** LipoVitta porque sei na pele o que é acordar inchada, com as pernas pesadas e sem energia. Hoje minha rotina mudou — e a sua também pode mudar."

  Por (frases curtas, sem "sistema", sem promessa):
  > "Eu sou Clara Caldas e também convivo com lipedema. Sei o que é acordar inchada, com as pernas pesadas e sem energia. Criei a rotina LipoVitta para o cuidado diário que eu mesma precisava. Hoje minha rotina é outra — e a sua também pode mudar aos poucos."

### `RoutineSection.tsx`
- Botão (linha 128): `VER A FÓRMULA PRINCIPAL` → `VER A CÁPSULA PRINCIPAL`.
  (evita a palavra "fórmula" em CTA; mantida só onde descreve o produto em si.)

### `HowToUseSection.tsx`
- Título (linha 17): `Sua rotina de **transformação** em 4 passos` → `Sua rotina em 4 passos`.
- Passo 4 (descrição): `Dieta equilibrada + atividade física **potencializam** os resultados.` → `Dieta equilibrada e atividade física ajudam nos resultados percebidos.`

### `FAQSection.tsx`
- Resposta "Em quanto tempo terei resultados?": `O uso contínuo, aliado a hábitos saudáveis, **potencializa** os efeitos percebidos.` → `O uso contínuo, junto com hábitos saudáveis, ajuda nos efeitos percebidos.`
- Resposta "Como devo usar o LipoVitta?": `Uso diário **potencializa** os efeitos.` → `Use todos os dias para manter a constância.`
- Resposta "Como usar o Shot Matinal?": `Uso diário fortalece imunidade e reduz inflamações.` → `Uso diário ajuda no apoio à imunidade e ao bem-estar.` (remove promessa absoluta de "reduz inflamações")

### `ExitIntentPopup.tsx`
- Título: `Espere! Não vá embora sem seu presente 🎁` → `Antes de sair, leve um guia gratuito 🎁` (remove "Espere!", urgência artificial).
- Botão: `QUERO MEU GUIA GRÁTIS` → `BAIXAR O GUIA`.

## O que **não** muda

- Preços, nomes de produtos (LipoVitta Cápsulas, Shot Matinal, Protocolo Completo, Gummy VittaGlow, Shot Rush, etc.).
- Todos os `href` de checkout, WhatsApp, e-mail, Instagram.
- Scripts, pixels, componentes (CountdownTimer, UrgencyBar — este último nem está em uso na página).
- Depoimentos visuais e textos dos prints.
- Palavra "fórmula" onde descreve objetivamente o produto (`A fórmula principal da rotina LipoVitta`, `LipoVitta Cápsulas (fórmula principal)`) — o briefing pede para remover "fórmula secreta", não o termo técnico do suplemento.
- Demais textos da página, que já estão em tom direto e pessoal.

## Checklist de tom aplicado

- Sem "sistema", "transformação", "potencialize/potencializa/potencializam".
- Sem "Espere!", sem promessas absolutas ("nunca mais", "para sempre").
- Frases reescritas ficam ≤ 20 palavras.
- Sem hipérbole adicionada; mantida a voz de primeira pessoa da Clara.
