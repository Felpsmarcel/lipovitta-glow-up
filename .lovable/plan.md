## Atualizar link do Instagram na seção "Não é falta de força de vontade."

O usuário quer substituir o link do Instagram embed na `RoutineSection.tsx`.

- **Link atual:** `https://www.instagram.com/p/DWRSgEfEYW8/`
- **Novo link:** `https://www.instagram.com/p/DQcTXQrkStl/`

### Mudanças necessárias
1. Em `src/components/RoutineSection.tsx`, atualizar o `src` do `<iframe>` (linha 41) para o novo link com `/embed`.
2. Atualizar o `href` do fallback `<a>` (linha 53) para o novo link.

### Arquivo afetado
- `src/components/RoutineSection.tsx`