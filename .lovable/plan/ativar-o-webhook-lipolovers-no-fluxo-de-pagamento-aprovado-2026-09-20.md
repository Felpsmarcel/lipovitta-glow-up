# Ativar o webhook Lipolovers no fluxo de pagamento aprovado

## Objetivo
Conectar a ação de webhook já existente no GoHighLevel ao backend Lipolovers para que somente a tag de pagamento aprovado libere automaticamente a confirmação de entrega.

## Fluxo esperado
```text
Tag de pagamento aprovado no GoHighLevel
  -> webhook POST protegido
  -> backend encontra a assinante
  -> pagamento fica como aprovado
  -> página de boas-vindas libera os dados de entrega
```

## Implementação
1. **Validar o recebimento seguro**
   - Confirmar que o endereço `lipolovers-payment` está respondendo.
   - Verificar que chamadas sem a senha correta continuam bloqueadas.
   - Fazer uma validação controlada sem aprovar uma assinante real e sem expor a senha.

2. **Configurar a ação já existente no GoHighLevel**
   - Manter o gatilho atual baseado na tag de pagamento aprovado.
   - Usar método `POST` e o endereço informado.
   - Adicionar o cabeçalho `x-lipolovers-secret` com a mesma senha já cadastrada no backend.
   - Enviar o corpo com:
     - `event`: `payment.approved`
     - `email`: e-mail do contato no GoHighLevel
     - `payment_id`: identificador real do pagamento, quando disponível
   - Não enviar nome, endereço ou outros dados desnecessários.

3. **Confirmar o comportamento completo**
   - Disparar uma execução controlada pelo fluxo real baseado na tag.
   - Conferir no histórico do GoHighLevel a resposta de sucesso.
   - Confirmar que o cadastro correspondente foi marcado como aprovado e que a página de boas-vindas liberou o formulário de entrega.
   - Repetir o aviso uma vez para validar que duplicatas não causam nova aprovação ou efeitos extras.

## Limites de segurança
- A senha não será exibida em chat, logs ou código.
- Nenhum pedido será criado na Yampi e nenhum fluxo de expedição será disparado por esta integração.
- Não haverá evento `Purchase` no navegador; a liberação ocorre somente após o aviso de pagamento aprovado.
- Se a edição da ação exigir acesso ao painel do GoHighLevel, a configuração final será aplicada no próprio painel usando a senha que você já possui; a API disponível permite consultar e inscrever contatos, mas não editar ações internas de workflows.

## Critérios de aceite
- Senha ausente ou incorreta retorna acesso negado.
- Aviso aprovado com contato válido retorna sucesso.
- A confirmação de entrega é liberada automaticamente para a assinante correta.
- Reenvio do mesmo aviso é seguro e não duplica efeitos.
