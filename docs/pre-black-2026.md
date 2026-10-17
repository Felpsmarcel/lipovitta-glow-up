# Pré Black LipoVitta — preparação para lançamento

Abertura: 18/10/2026 às 08h, America/Bahia (11h UTC).
Regra aprovada em 17/10: 30% de desconto em todos os produtos avulsos ativos e kits, sobre o valor integral. Substitui os 10% anteriores; descontos não se acumulam. Assinatura Lipolovers preservada.

| Produto | Base | Pré Black | Destino cadastrado |
|---|---:|---:|---|
| Cápsulas | R$357,00 | R$249,90 | /r/RMTIX51GQN |
| Shot Matinal | R$170,00 | R$119,00 | catálogo /shot-matinal-lipovitta/p |
| Shot Rush | R$225,00 | R$157,50 | /r/5NYVZ7D8UT |
| Protocolo (Cápsulas + Matinal) | R$527,00 | R$368,90 | **Pendente: destino atual é cápsula avulsa** |
| Rush + Cápsulas | R$582,00 | R$407,40 | /b/3QUPWLJZ74U8 |
| Kit Completo | R$752,00 | R$526,40 | /b/CLF9IC4LPI8K |

## Bloqueios comerciais de publicação

- Configurar e verificar a regra de 30% na Yampi, com início no mesmo instante. O frontend não altera preços na Yampi. Nenhuma credencial de gestão de catálogo foi encontrada ou solicitada.
- Corrigir o destino do Protocolo Favorito (SKU de referência RPQ0CD6N6Q8C). A URL atual https://lipovitta2.catalog.yampi.io/capsulas-lipovitta/p foi conferida no navegador em 17/10 e apresenta Cápsulas Lipovitta, ref LIP-CAPS-001. Não foi inventado outro link. Verificar itens e sabor efetivamente cobrados para todos os kits.
- Conferir sabor e brinde na Yampi: os parâmetros sabor e utm_content preservam a intenção, mas não comprovam itens adicionados ao pedido.
- Revisar a versão preparada e publicar após resolver os destinos e os preços finais. Nenhuma publicação foi feita nesta execução.

## Implementação e revisão

- Home comercial: hero com 30% OFF, produtos reais, CTA direto às ofertas, catálogo e escolha de brinde, foto real da Clara e conteúdo existente.
- Azul-marinho, azul #4667B4, verde da marca e branco. Intro decorativa sem bloquear o CTA; uma vez por sessão, com reduced motion e pausa ao ocultar aba.
- Fonte única de preços e um relógio compartilhado. Seleção de sabor e brinde permanece ao atravessar a abertura; valor do resumo é atualizado.
- Frete grátis somente em pedidos a partir de R$400 após descontos. Protocolo com 30% fica abaixo desse mínimo.
- Preview: /?fase=live e /pre-black?fase=live. Indicação visível de demonstração e checkout desativado na demo; interações demo não geram conversões reais. A query é ignorada nos domínios publicados (inclusive *.lovable.app que não sejam hosts id-preview).

## Validação executada

- Build Vite: passou (aviso de tamanho do bundle já existente).
- TypeScript: passou.
- 22 testes de regras e contexto: passaram, incluindo seis preços, não cumulatividade, instante de abertura, retorno à aba, manutenção de sabor/brinde e limpeza de timer.
- ESLint dos componentes e contextos alterados: sem erros; dois avisos de Fast Refresh para módulos que exportam provider e hook.
- Checkout público das Cápsulas conferido antes da campanha: R$357,00 (preço regular).
- A cobrança promocional futura na Yampi não foi validada e permanece pendente.
