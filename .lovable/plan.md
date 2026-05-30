# Plano: Rodapé profissional da LipoVitta

Editar apenas `src/components/Footer.tsx`. Nenhum outro arquivo é tocado. Sem alterações em produtos, preços, links de compra, checkout, pixels ou scripts.

## O que muda

Hoje o rodapé tem apenas: logo, disclaimer, copyright e 2 links (Política de Privacidade, Termos de Uso). Vamos reorganizá-lo em uma estrutura mobile-first com colunas no desktop.

## Nova estrutura

```text
[ Logo + disclaimer curto ]   [ Institucional ]   [ Ajuda ]   [ Pagamento ]
---------------------------------------------------------------------------
                © 2026 LipoVitta por Clara Caldas
```

- Mobile: colunas empilhadas, alinhadas à esquerda.
- Desktop (md+): 4 colunas.
- Divisor sutil entre o bloco principal e o copyright.

### Colunas

1. **Marca**
   - Logo (sem centralização forçada no desktop).
   - Disclaimer atual mantido: "Este produto não substitui orientação médica. Resultados individuais podem variar."

2. **Institucional**
   - Política de Privacidade — `#` (mantém href atual)
   - Termos de Uso — `#` (mantém href atual)

3. **Ajuda**
   - Trocas e Devoluções — `#` (novo, placeholder href)
   - Contato — `#contato` (âncora para `ContactSection` que já existe na página)

4. **Pagamento**
   - Linha discreta com selos de bandeiras em texto/SVG simples e monocromático: Visa, Mastercard, Elo, Amex, Pix, Boleto.
   - Renderizados como pequenos badges com borda fina, sem cores chamativas.
   - Título da coluna: "Formas de pagamento".

### Informações legais

Procurei no projeto e **não existe CNPJ, razão social ou endereço** cadastrados. Conforme a regra de não inventar, deixo apenas a linha de copyright atual: "© 2026 LipoVitta por Clara Caldas. Todos os direitos reservados." Se o usuário fornecer CNPJ/razão social depois, adicionamos.

## Estilo

- Fundo: mantém `#0F2847` (atual).
- Texto: cinza claro (`text-white/70`) para corpo, `text-white` para títulos das colunas.
- Tipografia: títulos `text-xs uppercase tracking-wider font-semibold`; links e corpo `text-xs leading-relaxed`; hover `text-[#7BA33E]`.
- Sem emojis, sem ícones decorativos coloridos, sem elementos lúdicos.
- Espaçamento generoso: `py-12 md:py-16`, `gap-8 md:gap-12` entre colunas.
- Divisor: `border-t border-white/10` antes do copyright.
- Contraste verificado para AA em fundo escuro.

## Detalhes técnicos

- Continua sendo componente funcional sem estado.
- Badges de pagamento: pequenos `<span>` com borda `border-white/15`, padding `px-2 py-1`, `rounded-sm`, `text-[10px] uppercase tracking-wide text-white/60`. Sem dependências novas.
- Logo mantém import `@/assets/logo-lipovitta.png`, altura reduzida para `h-9` e alinhamento `text-left` no md+.
- Links existentes (`Política de Privacidade`, `Termos de Uso`) preservam o `href="#"` atual; novos links também usam `#` como placeholder até receberem URLs reais.

## Fora de escopo

- Não toco em `Index.tsx`, seções, scripts, pixels, checkout, preços ou produtos.
- Não adiciono CNPJ, endereço ou razão social inventados.
- Não troco a paleta nem o fundo do rodapé.
