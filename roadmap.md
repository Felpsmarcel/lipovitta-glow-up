# Lipolovers

## Pré Black
- [x] Incluir o banner enviado em `/pre-black` e disponibilizar o atalho `/black`; banner e clique validados em desktop/celular, 5 testes, lint e compilação aprovados; sem publicar.
- [x] Implementar `/pre-black` com fotos reais, contador e movimento acessível, sem alterar os demais fluxos.
- [x] Validar desktop 1440, celulares 390/320, fotos, UTMs, contador antes/depois e movimento reduzido; 4 testes, lint e compilação aprovados; sem publicação.
- [x] Liberar entrada no grupo VIP com o deeplink oficial NotifyFlow fornecido (sem UTMs, sem Lead de ingresso); sem publicação.
- [x] Colocar a arte "O grupo VIP recebe primeiro" na seção final da `/pre-black`, em duas colunas e clicável, com a frase de apoio removida; sem publicar.


## Lipolovers

- [x] Criar página `/lipolovers` e modal de cadastro
- [x] Criar página `/lipolovers/boas-vindas` com confirmação de pagamento
- [x] Integrar leads, tags GHL e rastreamento sem Purchase no navegador
- [x] Vincular pagamento aprovado no webhook existente
- [x] Testar backend, desktop e mobile; mostrar preview sem publicar
- [x] Refinar experiência, imagens e comparação dos planos Lipolovers
- [x] Restaurar as fotografias originais inteiras dos kits Lipolovers
- [x] Reposicionar a página do Essencial com foco em economia mensal
- [x] Otimizar a página e o formulário Lipolovers para celular a partir de 360 px
- [x] Solicitar publicação da página `/lipolovers` no domínio oficial
- [ ] Adicionar no fluxo de pagamento aprovado do GoHighLevel a chamada ao `lipolovers-payment` — bloqueado: nenhuma conexão GoHighLevel está disponível e a API não permite editar ações do workflow- [x] Relatório de jornada de conversões de 01 a 30 de setembro
- [x] Inserir composição/ingredientes oficiais dos rótulos (Cápsulas, Shot Matinal, Shot Rush) com tabelas nutricionais nos cards

## Marketing
- [x] Página `/admin/campanhas`: envio de CSV/texto, análise com IA cruzando vendas pagas reais, histórico salvo; 3 testes e teste real aprovados.

## Pré-Black — virada 18/10 08h (implementada, NÃO publicada)
- [x] startsAt centralizado: 2026-10-18T08:00:00-03:00; rótulos de data derivados da config
- [x] Fases teaser/live com relógio reativo (usePreBlackPhase) e override de demo ?fase=teaser|live
- [x] Burst de abertura 1x/sessão (PreBlackBurst), reduced-motion respeitado
- [x] /pre-black live: hero comercial + OfferSection + GiftSelectionSection; home ganha faixa Pré-Black
- [ ] Pendência comercial: preços exibidos na fase live são os ATUAIS do site (kits com 10% OFF). A tabela promocional de até 30% OFF NÃO está aplicada — aguarda valores confirmados e configuração na Yampi.
- [ ] Publicar somente após aprovação e confirmação dos preços promocionais.
