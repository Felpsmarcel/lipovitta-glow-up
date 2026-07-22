## Cadastro público de afiliados

Criar uma página pública `/afiliados` com formulário de cadastro. Os leads ficam salvos no backend (Lovable Cloud) e você recebe um email a cada novo cadastro.

### O que será criado

**1. Página `/afiliados`**
- Layout dentro da identidade LipoVitta (Royal Blue + Olive, Poppins + Cormorant).
- Bloco topo: título "Programa de Afiliados LipoVitta", subtítulo curto explicando o programa.
- Formulário com os campos:
  - Nome completo
  - Telefone / WhatsApp (com máscara)
  - Email
  - Quantidade de seguidores (faixas: até 1k, 1k–10k, 10k–50k, 50k–100k, 100k+)
  - Estado (dropdown com os 27 UFs)
  - Já conhece o LipoVitta? (Sim / Não)
- Botão "Quero ser afiliada".
- Tela de sucesso após envio: "Recebemos seu cadastro, entraremos em contato pelo WhatsApp."
- Validação com Zod + mensagens de erro amigáveis.
- Rate limit simples no client (evita duplo clique).

**2. Rota**
- Adicionar `<Route path="/afiliados" element={<Afiliados />} />` em `src/App.tsx`.
- Adicionar link discreto no rodapé em "Institucional" → "Seja Afiliada".

**3. Banco (Lovable Cloud)**
- Tabela `public.affiliate_applications` com: nome, telefone, email, faixa de seguidores, estado, conhece_produto (bool), status (default `pending`), created_at, updated_at.
- RLS ativa. Política: `anon` e `authenticated` podem **INSERT** (formulário público). Ninguém do app pode ler/editar/deletar — só você via backend do Cloud (service_role).
- Grants adequados (INSERT para anon/authenticated, ALL para service_role).

**4. Notificação por email**
- Criar template de app email `new-affiliate-application` (React Email) que envia os dados do cadastro para o seu email.
- Trigger: após o INSERT bem-sucedido, o front chama `send-transactional-email` para disparar a notificação para você.
- Idempotency key baseada no ID do cadastro para evitar duplicidade.

### Detalhes técnicos

- Sem login, sem painel admin no site — consulta dos cadastros pelo backend do Cloud.
- Sem alterações no fluxo de checkout, brindes ou preços.
- Requer email de destino (o seu) para receber as notificações — vou perguntar antes de implementar.
- Depende da infra de email já configurada (`notify.lipovitta.site`), que já está ativa no projeto.

### Fora do escopo

- Login de afiliado, painel com link de rastreio, cálculo de comissão, integração com Yampi para atribuir vendas. Podem virar Fase 2 depois.

### Pergunta pendente antes de implementar

Para qual email você quer receber a notificação de novos cadastros? (sugestão padrão: `lipovitta@clarinhacbr.com.br`, o mesmo do rodapé).
