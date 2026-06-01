## Conectar o site ao catálogo de loja.lipovita.club

A loja roda em **Nuvemshop (Tiendanube)**. Não há um conector nativo do Lovable para Nuvemshop, então a integração é feita via API oficial usando credenciais que você gera no painel da Nuvemshop e uma edge function que faz a ponte (a chave nunca é exposta no navegador).

### O que você precisará fornecer

Você vai criar um App "Privado/Próprio" no Partners Portal da Nuvemshop e me enviar dois valores (vou pedi-los pela tela segura de secrets, não cole em chat):

- `NUVEMSHOP_STORE_ID` — ID numérico da sua loja
- `NUVEMSHOP_ACCESS_TOKEN` — Access Token gerado ao instalar seu app na loja

Passos resumidos para obter:
1. Acesse `https://partners.nuvemshop.com.br/` e crie um app.
2. Em "Escopos", marque ao menos `read_products`.
3. Instale o app na sua loja `loja.lipovita.club` — isso gera o `store_id` e o `access_token`.

### Como ficará o fluxo

```text
Browser (site)  →  Edge Function `nuvemshop-products`  →  API Nuvemshop
                          ↑                                     ↓
                  cache curto (60s)                       JSON produtos
```

### O que vou construir

1. **Edge function `nuvemshop-products`**
   - Lê `NUVEMSHOP_STORE_ID` e `NUVEMSHOP_ACCESS_TOKEN` do ambiente.
   - Chama `https://api.tiendanube.com/v1/{store_id}/products?published=true&per_page=50`.
   - Normaliza para um shape enxuto: `{ id, name, handle, price, compare_at_price, currency, stock, image, url }`.
   - Suporta filtro opcional `?handle=shot-rush-pre-treino` para buscar 1 produto específico.
   - CORS habilitado, cache de 60s.

2. **Hook `useNuvemshopProducts`** em `src/hooks/`
   - Usa React Query para chamar a edge function via `supabase.functions.invoke`.
   - Estados: `loading`, `error`, `data`.

3. **Atualizar `src/components/ProductsSection.tsx`**
   - Substituir as imagens/preços/links hardcoded pelos dados vindos da API.
   - Mapear os 2 produtos atuais (Gummy VittaGlow e Shot Rush) pelo `handle` no Nuvemshop.
   - Lógica de badge automática:
     - `stock === 0` → faixa vermelha **"Esgotado"** + botão desabilitado.
     - `stock > 0` → botão ativo apontando para a URL real do produto em `loja.lipovita.club`.
   - Fallback: se a API falhar, mostra os dados estáticos atuais (graceful degradation).

4. **(Opcional, sugerido) Seção "Todos os produtos"**
   - Posso adicionar uma grade dinâmica listando todos os produtos publicados da loja, para não ficar limitado aos 2 cards atuais. Me avise se quer isso já nesta entrega ou em uma próxima.

### Observações

- O checkout continua **inteiramente em loja.lipovita.club** — o site só exibe o catálogo e leva o usuário até a página do produto. Sem cart próprio, sem dados de pagamento passando aqui.
- A faixa "Novo estoque em breve" do Shot Rush deixa de ser manual — vira automática conforme o estoque real.
- A chave da Nuvemshop fica armazenada como secret no backend, nunca no código do site.

### Próximo passo

Quando aprovar o plano, vou abrir o formulário seguro para você colar `NUVEMSHOP_STORE_ID` e `NUVEMSHOP_ACCESS_TOKEN`, e em seguida implemento tudo.
