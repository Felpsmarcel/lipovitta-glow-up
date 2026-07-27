## Objetivo
Mostrar, antes do envio, exatamente a mensagem que será enviada no WhatsApp com os dados preenchidos no formulário.

## O que muda

**1. `src/lib/whatsapp.ts`**
- Extrair a montagem do texto para uma função exportada `buildWhatsAppAffiliateMessage(data)` (o mesmo texto usado hoje dentro de `buildWhatsAppAffiliateDataLink`).
- `buildWhatsAppAffiliateDataLink` passa a apenas codificar o retorno dessa função — nenhuma mudança no texto final enviado hoje.

**2. Novo componente `WhatsAppPreview` em `src/components/affiliates/shared.tsx`**
- Card em estilo "bolha de WhatsApp" (fundo verde-claro, cantos arredondados, texto monoespaçado com quebras de linha preservadas).
- Cabeçalho: "Pré-visualização da mensagem" + botão "ocultar/mostrar".
- Rótulos de campos vazios aparecem como "—" para ficar claro o que ainda falta preencher.
- Só é renderizado quando pelo menos um campo estiver preenchido (evita bloco vazio no início).

**3. `AffiliateForm.tsx` e `PartnerForm.tsx`**
- Montar a mensagem em tempo real a partir do estado atual do formulário (`useMemo` sobre `form`), com os mesmos mapeamentos já usados (faixa de seguidores, estado, sim/não).
- Inserir `<WhatsAppPreview>` logo acima do botão de envio.
- Nenhuma alteração no fluxo de envio, banco, email ou tela de sucesso.

## Detalhes técnicos
- Preview é puramente derivada do estado (sem novo estado além do toggle de exibição).
- Os labels legíveis (ex.: "10.000 – 50.000") já existem nos arrays `FOLLOWERS` / tipos de negócio; serão reaproveitados para que a preview mostre o mesmo texto do envio.
- Mobile: texto `text-xs`, padding reduzido, `whitespace-pre-wrap break-words`.
