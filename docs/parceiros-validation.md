# Parceiros comerciais — revisão em preview

Rota: `/parceiros`.
Prévia: https://id-preview--f9f3dfdc-6db1-451d-8f0f-21ebd708c9e2.lovable.app/parceiros
Não publicado. Nenhuma migração, candidatura real, mensagem, e-mail ou cobrança foi realizada.

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
- Compilação automática do preview: último registro `build OK`. Não foi executado comando manual de build/typecheck; checagem de tipos separada não foi executada.
- Playwright em **1440×1800 e 390×1800**: fotos carregadas (`naturalWidth > 0`), sem overflow inicial, CTA dos cards carrega produto no cadastro, simulador altera produto/quantidade, 49 e 50,5 rejeitados, pedido de 75 Cápsulas resulta em 9.675 e carrega interesse correto no cadastro, formulário vazio exibe erro sem envio.
- Links locais e cadastro não ficam sob navegação fixa. FAQ de troca abre. Preferência de movimento reduzido desativa animação. `/afiliados` preserva cadastro e novos tipos.
- Capturas desktop/celular inspecionadas para topo, simulador e formulário. Nenhum erro de execução do navegador nas verificações.
- Requisições externas interceptadas e bloqueadas durante QA; nenhum envio externo foi efetivado.

## Limites
- Entrega apenas em preview, aguardando revisão antes de publicação.
- Cadastro integrado validado com mocks, não com candidatura real; entrega efetiva de e-mail/WhatsApp não testada nem solicitada.
- Condições B2C, Pré Black, Lipolovers, checkout e serviços existentes não alterados.