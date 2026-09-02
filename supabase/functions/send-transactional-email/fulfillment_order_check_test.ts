import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import {
  template,
  validateFulfillmentOrderCheck,
} from '../_shared/transactional-email-templates/fulfillment-order-check-test.tsx'

const payload = {
  orderNumber: '81', orderId: '171546108', status: 'on_carriage (em transporte)',
  statusDate: '02/09/2026', createdDate: '31/08/2026', buyerName: 'Jamille Neiva',
  buyerEmail: 'bilessa_@hotmail.com', buyerPhone: '+55 71 99984-1512',
  items: [
    { name: 'Cápsulas Lipovitta', sku: 'LIP-CAPS-001', quantity: 1, price: 'R$ 357,00' },
    { name: 'Shot Matinal Lipovitta TANGERINA', sku: 'G9JA3SMZR', quantity: 1, price: 'R$ 170,00' },
  ],
  gift: 'brinde_raspador (raspador)', subtotal: 'R$ 527,00',
  discount: 'R$ 158,10 (30%)', subtotalAfterDiscount: 'R$ 368,90', total: 'R$ 386,73',
  difference: 'R$ 17,83 — rubrica não confirmada',
  unavailable: ['Endereço/CEP', 'Modalidade de pagamento', 'Transportadora', 'Código de rastreio'],
}

Deno.test('rejects empty fulfillment payload', () => {
  const errors = validateFulfillmentOrderCheck({})
  if (errors.length === 0) throw new Error('Empty payload was accepted')
})

Deno.test('renders every required value in HTML and text', async () => {
  const errors = validateFulfillmentOrderCheck(payload)
  if (errors.length > 0) throw new Error(errors.join(', '))

  const element = React.createElement(template.component, payload)
  const html = await renderAsync(element)
  const text = await renderAsync(element, { plainText: true })
  const required = [
    'Jamille Neiva', '81', '171546108', 'LIP-CAPS-001', 'Cápsulas Lipovitta',
    'G9JA3SMZR', 'Shot Matinal Lipovitta TANGERINA', 'R$ 386,73',
    'brinde_raspador (raspador)', 'bilessa_@hotmail.com', '+55 71 99984-1512',
    'NÃO GERAR NOVA EXPEDIÇÃO', 'Não disponível no registro recebido',
  ]
  for (const expected of required) {
    if (!html.includes(expected)) throw new Error(`HTML missing: ${expected}`)
    if (!text.includes(expected)) throw new Error(`Text missing: ${expected}`)
  }
})