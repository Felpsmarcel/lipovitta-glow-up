## Adicionar novo Kit Shot Rush + Cápsulas

### Onde entra
Adicionar um 4º card no `OfferSection.tsx`, ao lado dos 3 atuais (Cápsulas, Protocolo Completo, Shot Matinal). O novo kit fica como segunda opção de combo (energia + base diária), complementar ao Protocolo Completo.

### Imagem
Subir a imagem anexada (Shot Rush + Cápsulas com fundo colorido) como asset CDN via `lovable-assets`, gerando `src/assets/kit-shot-rush-capsulas.png.asset.json`.

### Conteúdo do card
- **Selo topo**: "Kit energia + base diária" (azul royal)
- **Título**: "Kit Shot Rush + Cápsulas LipoVitta"
- **Subtítulo**: "Energia, vitalidade e cuidado corporal em uma rotina só"
- **Descrição**: "Une o Shot Rush sabor Melancia (disposição e performance) com a Cápsula LipoVitta, motor do Sistema LipoVitta por Clara Caldas."
- **Itens do kit**:
  - 1 Shot Rush LipoVitta sabor Melancia (180g)
  - 1 Cápsulas LipoVitta (30 cápsulas)
- **Selos visuais** (badges pequenos): Zero açúcares · Sem glúten · Sem lactose · Sabor Melancia
- **Benefícios** (checks):
  - Energia e disposição para a rotina
  - Vitalidade e vigor no dia a dia
  - Cuidado diário com sensação de inchaço
  - Apoia constância no Sistema LipoVitta
- **Preço**: R$ 546,30 — 3x de R$ 182,10 sem juros
- **Botão principal**: "COMPRAR KIT AGORA" → `https://seguro.lipovitta.site/b/3QUPWLJZ74U8`
- **Garantia 30 dias + Frete grátis** (já cobertos pelos selos da seção)

### Layout
- Mudar o grid de 3 cards (5+4+3 = 12 colunas) para 4 cards em telas grandes.
- Proposta: em `lg` usar `grid-cols-2` (2x2) para manter respiro — Cápsulas e Protocolo na linha 1 (destaques), Kit Shot Rush + Cápsulas e Shot Matinal na linha 2 (complementos). Em `xl` opcional 4 colunas iguais.
- Manter visual asymmetric: novo card com leve `translate-y` para quebrar simetria.
- Cores: borda sutil + acento vermelho/melancia no selo de sabor para conversar com a embalagem do Shot Rush, mantendo paleta azul royal + verde oliva da marca.

### Regra de 10% OFF
Seguindo o padrão da seção, **não aplicar** desconto sobre R$546,30 porque o preço informado já é final. Mostrar apenas R$546,30 + parcelamento, sem badge "10% OFF" nem preço riscado (para não inventar valor "de").
- Se preferir manter coerência com os outros cards, alternativa: exibir "R$607,00" riscado e R$546,30 como "10% OFF" — **confirmar com você antes**.

### Aviso legal
Adicionar nota discreta abaixo do bloco de garantia da seção (ou no rodapé do novo card):
"Este produto não é medicamento. Não substitui uma alimentação equilibrada. Gestantes, lactantes, crianças e pessoas em uso de medicamentos devem consultar um profissional de saúde antes do uso."

### Fora de escopo (não fazer agora)
- Não criar página dedicada com Hero próprio, FAQ exclusivo e bloco "Por que funciona" separado — a landing já tem FAQ, benefícios e seção de ingredientes globais. Posso fazer página dedicada depois se você quiser.
- Não mexer em textos/preços dos outros 3 cards.

### Pergunta antes de implementar
1. Aplicar a regra "10% OFF comprando hoje" inventando um preço "de" (ex.: R$607,00 riscado), ou **manter apenas R$546,30** sem desconto exibido?
