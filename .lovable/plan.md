# Cadastros Lipolovers no e-mail diário

## O que muda
Os cadastros do Lipolovers passam a aparecer no **relatório diário que já chega às 09h (horário da Bahia)**, para os mesmos três destinatários. Nenhum e-mail novo e nenhum horário novo.

## Nova seção no e-mail: "Cadastros Lipolovers"
- **Período**: ontem completo + hoje até 09h, igual às vendas.
- **Resumo**: novos cadastros no período, total acumulado, quantos têm pagamento aprovado e quantos estão pendentes.
- **Lista de cada cadastro novo**: data/hora, nome, e-mail, WhatsApp, plano, sabor, situação do pagamento (Pendente / Aprovado) e se foi enviado ao GoHighLevel (com aviso quando falhou).
- **Duplicados** (mesmo e-mail) aparecem marcados como "repetido".
- **Cadastros de teste** (nomes/e-mails de teste) ficam fora.
- Sem cadastros no dia: a seção mostra "Nenhum cadastro novo no período".

Os dados de contato aparecem completos porque o e-mail vai só para os três endereços internos autorizados (vocês precisam deles para contatar as assinantes).

## Também
- A prévia do relatório no painel admin passa a mostrar a nova seção.
- O envio de conferência (um destinatário por vez) mostra a seção para validar antes do envio automático.

## Detalhes técnicos
- Leitura de `lipolovers_leads` pela função do relatório (service_role), com janela de datas igual à de pedidos; exclusão de testes por padrão de nome/e-mail.
- Nova seção no template `daily-sales-report.tsx` (HTML e texto), dados opcionais para não quebrar envios sem cadastros.
- Sem novas tabelas, sem novo cron; redeploy da função do relatório e da prévia.
- Validação: prévia com dados reais, sem enviar e-mail até sua aprovação da prévia.
