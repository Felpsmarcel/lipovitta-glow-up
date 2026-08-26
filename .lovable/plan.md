# MCP operacional LipoVitta — Yampi, GHL e Meta

Transformar o MCP atual (3 ferramentas de leitura) em um painel operacional seguro para o e-commerce, sem tocar no layout da landing e sem apagar dados históricos.

Premissa registrada: a truncagem em ~1000 linhas do `conversion_summary` é a explicação mais provável para os períodos inconsistentes (o PostgREST limita o retorno por padrão), mas isso ainda não foi confirmado por consulta. A Fase 1 começa validando isso com uma contagem real antes de trocar a implementação.

## Fases

### Fase 1 — Base de dados e correções (sem credenciais externas)
Tudo aqui é testável hoje.

1. Confirmar a truncagem: `select count(*) from conversion_events where created_at > now() - interval '30 days'` e comparar com o que a ferramenta devolve.
2. Migração aditiva com funções de agregação em SQL (`security definer`, checando `has_role(auth.uid(),'admin')`) para que a soma aconteça no banco e nunca dependa de paginação:
   - `public.mcp_conversion_summary(_days int, _include_tests boolean default false)`
   - `public.mcp_sales_metrics(_days int, _include_tests boolean default false)`
   - `public.mcp_tracking_health(_days int)`
3. Nova coluna aditiva `conversion_events.is_test boolean not null default false` + índice parcial. Backfill somente marcando (nunca apagando) os pedidos `TEST123`, `TEST456`, `TEST457` e qualquer `order_id ilike 'TEST%'`. Rollback = `update ... set is_test=false` / `drop column`.
4. Índices: `(created_at desc)`, `(event_name, created_at desc)`, `(order_id)`, `(meta_status)`.
5. Nova tabela `public.abandoned_checkouts` (carrinho abandonado da Yampi) — ver seção técnica.
6. Nova tabela `public.mcp_action_log` (idempotência + auditoria de toda escrita: GHL, cupom, reprocesso Meta).
7. Higienizar os logs do `yampi-webhook`: remover `headers` completos e `body_preview`; logar apenas `event`, `order_id`, tamanho do corpo, presença de assinatura e e-mail/telefone mascarados (`ma***@dominio`, `55****1234`).

### Fase 2 — Captura de checkout abandonado
- Ampliar `yampi-webhook` para aceitar também `cart.reminder` / `cart.abandoned`, gravando em `abandoned_checkouts` com `upsert` por `cart_token` (idempotente). Pedidos pagos continuam exatamente como hoje.
- Quando um pedido pago chegar com o mesmo e-mail/telefone/cart, marcar o abandono como `recovered_at`.

### Fase 3 — Ferramentas MCP de leitura
`list_abandoned_checkouts`, `list_yampi_orders`, `sales_metrics`, `tracking_health` + `conversion_summary` reescrito sobre a RPC. As três ferramentas atuais mantêm nome, entrada e formato de saída (o `conversion_summary` ganha campos novos, não remove os existentes).

### Fase 4 — Ferramentas de escrita com confirmação
`preview_checkout_recovery` (só leitura, monta o plano), `execute_checkout_recovery`, `create_yampi_coupon`, `reprocess_meta_event`. Todas exigem `confirm: true` e um `plan_token` vindo do preview; sem isso devolvem o plano e param.

### Fase 5 — Manifest e instruções
Atualizar `instructions` do `defineMcp`, rodar o extrator do manifest e publicar a função `mcp`.

## Tabelas, colunas, índices e RLS

```sql
-- abandoned_checkouts
id uuid pk, cart_token text unique not null, customer_name text, customer_email text,
customer_phone text, items jsonb not null default '[]', total numeric, currency text default 'BRL',
recovery_url text, reorder_url text, utm_source/medium/campaign/content/term text,
raw jsonb, abandoned_at timestamptz not null default now(), recovered_at timestamptz,
created_at/updated_at timestamptz
índices: (abandoned_at desc), (customer_email), (recovered_at)

-- mcp_action_log
id uuid pk, action text not null, idempotency_key text not null unique,
target_ref text, status text not null ('pending'|'success'|'failed'),
request jsonb, response jsonb, actor_user_id uuid, created_at/updated_at
índice: (action, created_at desc)
```

RLS em ambas: `GRANT` apenas para `authenticated` e `service_role` (sem `anon`); SELECT somente `has_role(auth.uid(),'admin')`; INSERT/UPDATE somente `service_role`. Nenhuma PII fica legível para não-admin.

## Mudanças por arquivo

| Arquivo | Mudança |
| --- | --- |
| `supabase/functions/yampi-webhook/index.ts` | Logs sem PII/headers; tratar `cart.*`; upsert em `abandoned_checkouts`; marcar recuperação |
| `supabase/functions/ghl-proxy/index.ts` (novo) | Chamadas ao GoHighLevel usando segredos do servidor; upsert de contato, tags, oportunidade, workflow |
| `supabase/functions/yampi-admin/index.ts` (novo) | Criação de cupom via API Yampi (segredos no servidor) |
| `supabase/functions/meta-capi/index.ts` | Aceitar reenvio com o mesmo `event_id` (dedup nativa da Meta) e devolver `upstream_status` estruturado |
| `src/lib/mcp/tools/conversion-summary.ts` | Passar a usar `rpc('mcp_conversion_summary')` |
| `src/lib/mcp/tools/*.ts` (7 novos) | Ferramentas listadas acima |
| `src/lib/mcp/index.ts` | Registrar ferramentas e reescrever `instructions` |
| `.lovable/mcp/manifest.json` | Regenerado pelo extrator |

Nenhum arquivo de UI da landing é tocado. `src/pages/admin/Conversoes.tsx` fica como está nesta etapa.

## Contratos das ferramentas

- `list_abandoned_checkouts({days=7, limit=50, only_unrecovered=true})` → `{items:[{cart_token,name,email,phone,items,total,utm,recovery_url,reorder_url,abandoned_at,recovered_at}],count}`
- `list_yampi_orders({days=30, limit=50, include_tests=false, status?})` → `{orders:[{order_id,value,status,items,skus,utm,meta_status,price_mismatch,created_at}],count}`
- `sales_metrics({days=30, include_tests=false})` → `{unique_buyers,orders,revenue_brl,avg_ticket,conversion_rate,top_products[],by_utm_source{}}`
- `tracking_health({days=7})` → `{checkouts,paid_orders,internal_purchases,meta_sent,meta_errors,error_404_count,gaps:[{type,order_ids[]}]}`
- `preview_checkout_recovery({cart_token})` → `{plan:{contact,tags[],opportunity,workflow_id},plan_token,warnings[],configuration_required?}` (nunca escreve)
- `execute_checkout_recovery({cart_token, plan_token, confirm})` → `{status:'executed'|'already_done'|'blocked', ghl_contact_id?, configuration_required?}`
- `create_yampi_coupon({code,discount_percent|discount_value,max_uses,valid_until,product_ids?,plan_token,confirm})` → `{status,coupon_id?}`
- `reprocess_meta_event({order_id, plan_token, confirm})` → `{status,event_id,upstream_status}` — reenvia com o **mesmo** `event_id`, sem criar evento novo.

Padrão comum: sem `confirm:true` → devolve o preview e `status:'needs_confirmation'`. Segredo faltando → `{status:'configuration_required', missing:['GHL_API_KEY', ...]}` apenas com nomes. Toda escrita grava `mcp_action_log` com `idempotency_key` determinístico (ex.: `recovery:<cart_token>`, `coupon:<code>`, `meta:<event_id>`); chave repetida devolve `already_done`.

Anotações: leitura → `readOnlyHint:true, openWorldHint:false`; escrita → `readOnlyHint:false, openWorldHint:true, destructiveHint:false`.

## Variáveis de ambiente (somente no backend)

Novas: `GHL_API_KEY`, `GHL_LOCATION_ID`, `GHL_RECOVERY_WORKFLOW_ID`, `YAMPI_API_TOKEN`, `YAMPI_SECRET_KEY`, `YAMPI_ALIAS`. Já existentes e reutilizados: `META_PIXEL_ID`, `STAPE_CAPI_TOKEN`, `YAMPI_WEBHOOK_SECRET`. Nenhuma entra no cliente, no manifest ou em logs.

## Riscos e rollback

- Migrações são só `CREATE`/`ADD COLUMN`; rollback é `DROP` das novas tabelas/funções e da coluna `is_test`. Nada histórico é alterado além da marcação `is_test`, reversível.
- Mudança no webhook: o caminho de pedido pago permanece idêntico; os eventos de carrinho entram em ramo novo que sempre responde 200.
- Se a API do GHL/Yampi mudar, as ferramentas de escrita falham isoladamente e devolvem erro — nenhuma leitura é afetada.
- Risco de disparo indevido: mitigado pelo par preview + `plan_token` + `confirm` e pelo bloqueio automático quando faltam segredos.

## Validação

Sem credenciais externas (pode ser feito agora): Fases 1–3 completas — comparar `conversion_summary` novo contra `select count/sum` direto no banco, conferir que os pedidos TEST somem do padrão e aparecem com `include_tests:true`, testar o webhook de carrinho com um POST assinado de exemplo, e verificar que os logs não trazem mais PII. Vitest cobre os utilitários puros (mascaramento, chave de idempotência, agregação).

Com credenciais: `supabase functions serve mcp --no-verify-jwt`, conectar um cliente MCP como admin, rodar cada preview antes de cada execução, e em produção validar com um cupom de teste, uma recuperação em contato próprio e um reprocesso Meta verificado no Events Manager.
