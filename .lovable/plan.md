## Problema

O preview e a produção renderizam em branco por causa de um erro em runtime:

```
Cannot access 'STATES' before initialization
```

Causa: dependência circular.

- `src/pages/Afiliados.tsx` importa no topo `AffiliateForm` e `PartnerForm`.
- Ambos importam de volta `STATES`, `NOTIFY_EMAIL`, `Field`, `inputCls`, `SuccessCard` de `@/pages/Afiliados`.
- Essas constantes são declaradas **depois** do `export default Afiliados`, então quando os forms são avaliados durante o import, caem no TDZ (temporal dead zone) e a app inteira quebra.

## Correção

Criar um módulo neutro com os helpers compartilhados e apontar todos os imports para ele. Nenhuma mudança visual, de texto, de rota ou de lógica.

### Passos

1. Criar `src/components/affiliates/shared.tsx` com:
   - `STATES`
   - `NOTIFY_EMAIL`
   - `Field`
   - `inputCls`
   - `SuccessCard`

2. Atualizar imports em:
   - `src/components/affiliates/AffiliateForm.tsx` → importar de `./shared`
   - `src/components/affiliates/PartnerForm.tsx` → importar de `./shared`

3. Em `src/pages/Afiliados.tsx`:
   - Remover as declarações/`export`s de `STATES`, `NOTIFY_EMAIL`, `Field`, `inputCls`, `SuccessCard`.
   - Se ainda usar algum desses internamente, importar de `@/components/affiliates/shared`.

4. Verificar via Playwright no `localhost:8080`:
   - `document.body.innerHTML` deve conter o conteúdo real (não só `<div id="root"></div>`).
   - Nenhum `pageerror` no console.
   - Página `/afiliados` também abre sem erro nas duas abas.

5. Depois de validado, publicar novamente para o `.lovable.app` e `lipovitta.site` voltarem.

## Fora de escopo

Sem alterar textos, estilos, produtos, preços, pixels, CAPI, edge functions ou schema do banco.
