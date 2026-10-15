# Análise de campanhas com IA (área admin)

## O que a equipe vai ver
Nova página **/admin/campanhas**, só para administradores (mesmo login das páginas de admin atuais).

1. **Enviar dados**: subir uma planilha CSV exportada do Meta/Google Ads **ou** colar o texto. Campos opcionais: nome da campanha e período (datas).
2. **Prévia**: mostra as primeiras linhas lidas para conferir antes de analisar.
3. **Analisar**: a IA cruza os dados enviados com as **vendas reais pagas** do mesmo período (pedidos Yampi pagos, receita e UTMs, sem dados pessoais e sem pedidos de teste) e devolve:
   - Resumo do desempenho
   - Tendências identificadas
   - Otimizações acionáveis (prioridade, ação, motivo, impacto esperado)
   - Alertas (ex.: gasto alto sem vendas pagas, divergência entre conversões do anúncio e vendas reais)
4. **Histórico**: lista de análises salvas com data, campanha e período; clicar reabre a análise completa.

A resposta aparece aos poucos enquanto a IA escreve. Erros de crédito ou limite aparecem com a mensagem clara, sem tentar de novo sozinho.

## Regras
- Só admins acessam a página, os envios e o histórico.
- Venda conta apenas com pagamento confirmado (mesma regra do relatório diário).
- Nenhum dado pessoal de cliente vai para a IA; só totais por dia/UTM.
- A IA não promete resultados nem inventa números ausentes nos dados.
- Nada altera anúncios, Yampi ou GoHighLevel — é só análise.
- Home e demais páginas não mudam.

## Detalhes técnicos
- Tabela `campaign_analyses` (id, created_by, campaign_name, period_from/to, source_type csv|text, raw_input limitado ~200 KB, sales_snapshot jsonb, result jsonb, model, status, error, created_at) com GRANTs, RLS somente `has_role(auth.uid(),'admin')`.
- Função de backend `campaign-insights`: valida JWT + papel admin, valida entrada com Zod, busca vendas pagas agregadas via `order_payments` + `yampi_orders` (is_test=false, exclui teste 171482339), chama AI Gateway `/v1/responses` com `openai/gpt-6-astra`, reasoning medium, saída estruturada via json_schema estrito, streaming; salva resultado na tabela; trata 402/403/429 conforme regras do gateway.
- Parsing de CSV no navegador (separador `,` ou `;`, decimal brasileiro), limite de linhas.
- Página `src/pages/admin/Campanhas.tsx`, rota em `App.tsx`, link no admin existente.
- Testes: parser de CSV (números BR) e agregação de vendas excluindo testes/não pagos.
- Teste real de uma análise ponta a ponta antes de concluir.
