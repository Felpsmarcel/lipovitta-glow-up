# Atualizar ingredientes com os rótulos oficiais

Você enviou as fotos dos rótulos oficiais das Cápsulas e do Shot Matinal. Com isso, a composição das Cápsulas deixa de ser "Principais ingredientes" e passa a ser a relação integral do rótulo, e as tabelas nutricionais ficam completas.

## O que muda

### 1. Cápsulas LipoVitta (dados do rótulo oficial)
- **Ingredientes (integral):** Café verde em pó, extrato de rizomas de Cúrcuma Longa, quercetina, trans-resveratrol sintético, extrato de Opuntia ficus-indica, fruto do melão, antiumectante dióxido de silício, veículo amido. Composição da cápsula: gelatina.
- **Selos:** NÃO CONTÉM GLÚTEN. NÃO CONTÉM LACTOSE.
- **Tabela nutricional** (porção 520 mg / 1 cápsula, 30 porções): Cafeína 80 mg, Curcumina 130 mg, Quercetina 100 mg, Opuntia ficus-indica 50 mg, Trans-resveratrol 20 mg.
- O rótulo do accordion passa de "Principais ingredientes" para "Ingredientes".

### 2. Shot Matinal (completar a tabela)
- Tabela nutricional passa a incluir os %VD oficiais: Vitamina C 500%, Selênio 500%, Vitamina A 75%, Vitamina E 66%, Zinco 64%, Vitamina D 33%; linhas de valor energético/carboidratos/açúcares/galactose zeradas; nota "Não contém quantidades significativas de proteínas, gorduras totais, gorduras saturadas, gorduras trans, fibras alimentares e sódio."

### 3. Exibição das tabelas
- O componente ganha a tabela nutricional como segundo accordion ("Ver tabela nutricional") nos cards individuais de Cápsulas e Shot Matinal (seção de oferta) — fechado por padrão, discreto, sem poluir o card.
- Nos kits e no Lipolovers, os accordions por produto continuam só com ingredientes/alérgicos (sem tabela), para não alongar os cards.

## O que não muda
- Nenhum preço, CTA, checkout, rastreamento ou layout.
- Shot Rush permanece como está (rótulo oficial dele não foi enviado).
- Nenhuma alegação de resultado ou propriedade medicinal — só a transcrição fiel do rótulo.
- Nada é publicado; fica no preview para sua revisão.

## Detalhes técnicos
- Edição apenas em `src/data/productIngredients.ts` (fonte única) e `src/components/IngredientsAccordion.tsx` (exibir a tabela quando existir).
- Validação: tipos, build e teste no preview em desktop e celular 360px.
