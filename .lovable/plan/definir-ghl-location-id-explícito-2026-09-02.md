# Definir GHL_LOCATION_ID explícito

Hoje a integração com o HighLevel funciona, mas o identificador da subconta (location) não está configurado como segredo: o código usa um valor de reserva embutido (`fJzQmnIkw2U71SbtBDld`), e o diagnóstico reporta `location_source: fallback_lipovitta`. Esse valor veio do caminho da URL do Inbound Webhook e não foi confirmado como sendo o Location ID real da subconta.

## O que será feito

1. Confirmar o Location ID correto da subconta LipoVitta (Settings > Business Profile no HighLevel, campo "Location ID" / "API Key location").
2. Salvar esse valor como segredo `GHL_LOCATION_ID` no projeto.
3. Reimplantar apenas a Edge Function `mcp` para que ela leia o novo segredo.
4. Rodar `ghl_config_status` (somente leitura) e confirmar que retorna `location_source: "GHL_LOCATION_ID"` e `direct_api_ready: true`.
5. Rodar `ghl_list_workflows` (somente leitura) para validar que a API direta responde com os workflows da subconta correta.

## Detalhes técnicos

- Nenhuma mudança de UI, nenhuma escrita no HighLevel. Todas as ferramentas de escrita continuam com `simulate=true` por padrão.
- Sem mudança de código necessária: `supabase/functions/_shared/ghl-api.ts` já lê `GHL_LOCATION_ID` e só cai no fallback quando o segredo está ausente. O redeploy serve apenas para atualizar o ambiente da função.
- Se o Location ID confirmado for diferente do fallback, avaliamos em seguida remover o valor embutido para evitar chamadas silenciosas à subconta errada.

## O que preciso de você

O Location ID da subconta LipoVitta (formato de ~20 caracteres alfanuméricos). Se for exatamente `fJzQmnIkw2U71SbtBDld`, basta confirmar e eu salvo esse mesmo valor como segredo explícito.
