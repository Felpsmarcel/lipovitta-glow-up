## Mudanças

1. **`src/pages/Index.tsx`**: remover o import e o uso de `ContactSection`.
2. **`src/components/Footer.tsx`**: adicionar telefone e e-mail na coluna "Ajuda" (acima dos links existentes), como links clicáveis:
   - WhatsApp: `https://wa.me/5571996150401` — "(71) 9 9615-0401"
   - E-mail: `mailto:lipovitta@clarinhacbr.com.br`
   - Mesma tipografia `text-white/70 text-xs` com hover `#7BA33E`.
3. Atualizar o link "Contato" do footer para apontar para o WhatsApp (já que a seção `#contato` deixa de existir).
4. Manter arquivo `ContactSection.tsx` no projeto (não excluir), apenas desreferenciado.

Nada mais é alterado: produtos, preços, links de compra, checkout, pixels e scripts permanecem intactos.
