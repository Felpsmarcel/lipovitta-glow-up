# Ajustar Lipolovers: apenas plano Essencial, 6 meses de compromisso e brindes

## Resultado

Deixar a página `/lipolovers` vendendo **apenas o plano Essencial**, com comunicação clara de **6 meses de compromisso** (cancelamento liberado após esse período) e destacando os **brindes inclusos**. O plano Master sai do site, mas leads antigos cadastrados como `master` continuam válidos no banco. O checkout do Essencial passa a usar o link do Mercado Pago informado.

## Escopo decidido com você

- **Master:** somente escondido do site (frontend). Dados históricos no banco/schema permanecem intactos.
- **Brindes do Essencial:** todos os elegíveis para 2 produtos — Raspador de língua, Porta cápsulas e Mixer Dosador.

## Mudanças no frontend

### Página `/lipolovers`

- Remover o card de comparação do plano Master e a seção "Compare e escolha com tranquilidade".
- Reorganizar a seção de planos como **um único card destacado** do Essencial, centralizado ou em largura máxima confortável.
- Hero: ajustar copy para mencionar os 6 meses de compromisso e os brindes.
  - Exemplo de direção: "A partir de R$ 399/mês" + "6 meses de compromisso" + "brindes inclusos".
- Features ("Todo mês", "Sem fidelidade", "Do seu jeito"): ajustar o texto de "Sem fidelidade" para refletir o compromisso inicial de 6 meses, depois livre para cancelar.
- Lista "Inclui" do Essencial: manter os 2 produtos e **adicionar os 3 brindes** como itens de inclusão.
- CTA fixo no mobile: texto de "VER PLANOS" muda para algo como "QUERO O ESSENCIAL — R$ 399/MÊS" e direciona para o modal do Essencial.
- Header: remover "Ver planos" ou ajustar para "Ver o plano".

### Brindes na página

- Criar uma seção dedicada (ou expandir o card do Essencial) mostrando os 3 brindes com imagem, nome e uma linha curta.
- Usar as imagens reais de `src/data/gifts.ts` e o componente existente de brinde, se houver.
- Não inventar embalagens: usar os ativos já aprovados.

### FAQ

- Remover a pergunta "Qual a diferença entre Essencial e Master?".
- Atualizar "Tem fidelidade?" para: "Os primeiros 6 meses são de compromisso. Após esse período, você pode cancelar para as próximas cobranças.".
- Atualizar "Posso cancelar?" para refletir a mesma regra.
- Revisar "Como funciona a cobrança?" para mencionar os 6 meses iniciais.
- Manter as demais perguntas (frete, sabor, envio).

### Modal de lead (`LipoloversLeadDialog`)

- Simplificar para o plano Essencial: remover a necessidade de receber `planId` dinâmico ou manter o parâmetro para compatibilidade, mas sempre usar Essencial.
- Manter campos: nome, WhatsApp, e-mail, sabor.
- No resumo do modal, incluir os brindes e a informação dos 6 meses.
- Atualizar o CTA do botão para "CONTINUAR PARA O PAGAMENTO — R$ 399/MÊS".

### Página `/lipolovers/boas-vindas`

- Manter funcionando para leads antigos `master` (não quebrar).
- Caso o lead seja Essencial, exibir o nome do plano e os brindes confirmados.
- Ajustar textos se necessário para não prometer o Master como opção atual.

## Mudanças na configuração

- `src/config/lipolovers.ts`:
  - Atualizar `plans` para conter apenas `essencial`.
  - `checkoutUrl` do Essencial: `https://mpago.la/16SyCN8`.
  - Adicionar `gifts` com os 3 brindes elegíveis (usar `GIFTS` de `src/data/gifts.ts` ou replicar referências).
  - Ajustar tipos (`LipoloversPlanId`) para refletir apenas `'essencial'` ou manter compatibilidade com `'master'` para leitura de leads antigos.

## Mudanças no backend (sem apagar dados históricos)

- `supabase/functions/_shared/lipolovers.ts`:
  - `planSchema`: restringir novos leads a `'essencial'`. O schema de leitura/status (`deliverySchema`) não precisa restringir o plano, já que leads antigos `master` podem consultar a página de boas-vindas.
- `supabase/functions/lipolovers-lead/index.ts`:
  - Remover `checkoutUrls.master`.
  - Validar que o plano recebido é `essencial`.
  - Usar a URL do Mercado Pago para o Essencial.
  - Manter GHL tags: `lipolovers-interesse`, `lipolovers-essencial`, `sabor-<sabor>`.
- `supabase/functions/lipolovers-delivery/index.ts`:
  - Continuar lendo leads com `plan` `master` antigos normalmente (não restringir).
- `supabase/functions/yampi-webhook/index.ts`:
  - Nenhuma mudança necessária; marcação de pagamento aprovado continua funcionando por `eid_`/`lipolovers_token`.
- Banco de dados: **não alterar** o `CHECK` constraint da coluna `plan`, para não invalidar leads `master` existentes.

## Rastreamento e regras comerciais

- Manter `ViewContent`, `Lead` e `InitiateCheckout`.
- Não disparar `Purchase` no frontend.
- Não criar pedido Yampi pelo formulário.
- Não prometer resultados médicos, cura ou tratamento.

## Testes e validação

- Atualizar `supabase/functions/lipolovers-lead/lipolovers_test.ts` se houver testes que forcem plano `master`.
- Executar `tsgo --noEmit` e build.
- Validar com Playwright em mobile (360–400 px) e desktop:
  - Apenas um card de plano visível.
  - Brindes listados corretamente.
  - Modal abre e redireciona ao novo checkout.
  - FAQ reflete os 6 meses de compromisso.
  - Página de boas-vindas ainda funciona para token de lead existente.

## Não publicar

- Finalizar sem publicar, aguardando revisão visual da página no preview.
