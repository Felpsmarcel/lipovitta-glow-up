## Plano: WhatsApp com dados no fluxo de afiliados

### Objetivo
Fazer com que o botão/flutuante "Seja Afiliada" abra o WhatsApp já com uma mensagem pré-preenchida, e também notificar a equipe LipoVitta no WhatsApp quando alguém enviar o formulário de afiliados/parceiros.

### O que vamos fazer

1. **Link direto no botão flutuante e no rodapé**
   - Substituir o `to="/afiliados"` e `href="/afiliados"` por um link `https://wa.me/NUMERO?text=MENSAGEM`.
   - A mensagem pré-preenchida incluirá campos como nome, WhatsApp, email, seguidores/estado e se conhece o produto.
   - Exemplo de texto:
     ```
     Olá! Quero ser afiliada LipoVitta.
     Nome:
     WhatsApp:
     Email:
     Quantidade de seguidores:
     Estado:
     Já conhece o LipoVitta? (sim/não)
     ```

2. **Manter a página `/afiliados` funcionando**
   - O formulário continua salvando no banco e enviando o email interno.
   - Adicionar, após o envio bem-sucedido, uma notificação para o WhatsApp da equipe com os dados do cadastro.

3. **Notificação automática via WhatsApp API**
   - Para enviar mensagens do sistema para a equipe, precisamos de uma API de WhatsApp.
   - Opções comuns (escolha do cliente):
     - **WhatsApp Business API (Meta)** — oficial, mas requer conta business verificada.
     - **Twilio WhatsApp** — pago, fácil de integrar em Edge Function.
     - **Z-API / Evolution API / WATI** — gateways brasileiros com APIs simples.
     - **CallMeBot** — gratuito para uso pessoal, usa uma API key vinculada ao número.
   - A integração será feita em uma Edge Function `notify-whatsapp` chamada pelo formulário após salvar os dados.

### Dados que precisamos de você

1. **Número de WhatsApp da LipoVitta** que receberá as mensagens (ex: `5571996150401`).
2. **Qual API/gateway de WhatsApp** você quer usar? Se ainda não tiver, recomendamos configurar o WhatsApp Business API do Meta ou um gateway como Z-API/WATI, porque é mais confiável para notificações de negócio.
3. **Credenciais da API escolhida** (token/key, URL do gateway, etc.) — guardamos como secret no Lovable Cloud.

### Entrega final
- Botão flutuante e link do rodapé abrem WhatsApp com mensagem pré-preenchida.
- Após envio do formulário, a equipe recebe notificação no WhatsApp com os dados do novo afiliado/parceiro.
- A página `/afiliados` continua salvando lead no banco e enviando email.

````text
Antes de implementar, preciso que você confirme:
1. Qual número de WhatsApp usar?
2. Qual gateway/API de WhatsApp você prefere (ou já tem)?
````