import { useState } from "react";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PARTNER_OFFERS, partnerMoney, simulatePartnerOrder, type PartnerProduct } from "@/config/partnerOffers";

interface Props {
  product: PartnerProduct;
  quantity: number;
  onProductChange: (product: PartnerProduct) => void;
  onQuantityChange: (quantity: number) => void;
}

export default function PartnerSimulator({ product, quantity, onProductChange, onQuantityChange }: Props) {
  const [draft, setDraft] = useState<string | null>(null);
  const min = PARTNER_OFFERS[product].minUnits;
  const value = draft === null ? quantity : Number(draft);
  let result: ReturnType<typeof simulatePartnerOrder> | undefined;
  try { result = simulatePartnerOrder(product, value); } catch { /* Invalid input keeps the result empty. */ }
  const changeQuantity = (text: string) => {
    setDraft(text);
    const next = Number(text);
    try { simulatePartnerOrder(product, next); onQuantityChange(next); } catch { /* Validate before propagating. */ }
  };
  const chooseProduct = (next: PartnerProduct) => { onProductChange(next); setDraft(null); };

  return (
    <div className="b2b-simulator">
      <div className="b2b-simulator-controls">
        <label htmlFor="sim-product">Produto</label>
        <select id="sim-product" value={product} onChange={(event) => {
          if (event.target.value === "capsulas" || event.target.value === "shot_matinal") chooseProduct(event.target.value);
        }}>
          {Object.entries(PARTNER_OFFERS).map(([key, offer]) => <option key={key} value={key}>{offer.name}</option>)}
        </select>
        <label htmlFor="sim-quantity">Quantidade de unidades</label>
        <div className="b2b-stepper">
          <Button variant="outline" size="icon" aria-label="Diminuir quantidade" title="Diminuir quantidade" disabled={!result || value <= min} onClick={() => changeQuantity(String(value - 1))}><Minus /></Button>
          <input id="sim-quantity" type="number" min={min} step={1} inputMode="numeric" value={draft ?? quantity} onChange={(event) => changeQuantity(event.target.value)} aria-invalid={!result} aria-describedby="quantity-note" />
          <Button variant="outline" size="icon" aria-label="Aumentar quantidade" title="Aumentar quantidade" disabled={!result} onClick={() => changeQuantity(String(value + 1))}><Plus /></Button>
        </div>
        <p id="quantity-note" className={!result ? "text-destructive" : "text-muted-foreground"}>{result ? `Mínimo de ${min} unidades do produto escolhido. Pedidos mistos sob consulta.` : `Informe uma quantidade inteira a partir de ${min}.`}</p>
        <Button asChild className="b2b-button" disabled={!result}><a href="#cadastro" aria-disabled={!result} onClick={(event) => { if (!result) event.preventDefault(); }}>Tenho interesse neste pedido <ArrowRight /></a></Button>
      </div>
      <div className="b2b-simulator-result" aria-live="polite" aria-atomic="true">
        <p className="b2b-eyebrow">Seu pedido de revenda</p>
        {result ? <>
          <dl className="b2b-order-numbers">
            <div><dt>Total do pedido</dt><dd>{partnerMoney(result.order)}</dd></div>
            <div><dt>Entrada · 50% no pedido</dt><dd>{partnerMoney(result.entry)}</dd></div>
            <div><dt>Saldo · 50% em até 60 dias</dt><dd>{partnerMoney(result.balance)}</dd></div>
          </dl>
          <p className="b2b-assumption">Cenário ilustrativo: venda integral das {value} unidades pelo preço de revenda sugerido.</p>
          <dl className="b2b-calculation">
            <div><dt>Receita potencial</dt><dd>{partnerMoney(result.revenue)}</dd></div>
            <div><dt>Produtos</dt><dd>− {partnerMoney(result.order)}</dd></div>
            <div><dt>Comissão do vendedor · 10%</dt><dd>− {partnerMoney(result.commission)}</dd></div>
            <div className="b2b-total"><dt>Saldo após produtos e comissão</dt><dd>{partnerMoney(result.remaining)}</dd></div>
          </dl>
          <p className="b2b-disclaimer">Tributos, taxas, frete e despesas da loja ainda devem ser descontados. Não é lucro líquido nem garantia de venda ou retorno. Comissão paga pelo estabelecimento. Preços de revenda sugeridos; promoções de varejo podem variar.</p>
        </> : <p>Preencha uma quantidade válida para consultar os valores.</p>}
      </div>
    </div>
  );
}