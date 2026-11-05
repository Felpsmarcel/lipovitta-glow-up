import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, GraduationCap, Megaphone, CalendarDays, Handshake } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import PartnerForm from "@/components/affiliates/PartnerForm";
import PartnerSimulator from "@/components/partners/PartnerSimulator";
import { PARTNER_OFFERS, partnerMoney, simulatePartnerOrder, type PartnerProduct } from "@/config/partnerOffers";
import logo from "@/assets/logo-lipovitta.png";
import capsules from "@/assets/capsulas-lipovitta.png";
import tangerine from "@/assets/shot-matinal-tangerina.jpg";
import lemon from "@/assets/shot-matinal-limao.jpg";
import pineapple from "@/assets/shot-matinal-abacaxi.jpg";

const flavors = [{ name: "Tangerina", image: tangerine }, { name: "Limão", image: lemon }, { name: "Abacaxi", image: pineapple }];
const support = [
  { icon: GraduationCap, title: "Vendedor preparado", text: "Treinamento do vendedor para apresentar a linha. Para Shot Matinal, treinamento online." },
  { icon: Megaphone, title: "Materiais à mão", text: "Materiais para balcão e divulgação digital. Para Shot Matinal, arquivos prontos para impressão." },
  { icon: CalendarDays, title: "Apresentação da linha", text: "Uma apresentação em data e formato combinados com a equipe. Para Shot Matinal, apresentação online." },
  { icon: Handshake, title: "Começo acompanhado", text: "Acompanhamento semanal nos primeiros 30 dias para apoiar o início da parceria." },
];

export default function Parceiros() {
  const [product, setProduct] = useState<PartnerProduct>("capsulas");
  const [quantity, setQuantity] = useState(50);
  const [flavor, setFlavor] = useState(0);
  const shot = flavors[flavor] ?? flavors[0];
  return (
    <div className="partners-page">
      <SEOHead title="Parceiros comerciais — Revenda LipoVitta" description="Leve LipoVitta para seu estabelecimento. Conheça Cápsulas e Shot Matinal, condições de revenda, pedido inicial de 50 unidades e apoio comercial." keywords="parceiros comerciais LipoVitta, atacado, revenda, farmácias, academias" canonicalUrl="https://lipovitta.site/parceiros" ogImage={new URL(capsules, "https://lipovitta.site").href} />
      <a href="#conteudo-parceiros" className="b2b-skip">Ir para o conteúdo</a>
      <header className="b2b-header">
        <div className="b2b-shell b2b-nav">
          <Link to="/" aria-label="LipoVitta — página inicial"><img src={logo} alt="LipoVitta" width="125" height="64" /></Link>
          <nav aria-label="Navegação de parceiros">
            {[["Produtos", "produtos"], ["Simulador", "simulador"], ["Como funciona", "como-funciona"], ["Cadastro", "cadastro"]].map(([label, id]) => <Button key={id} variant="ghost" asChild><a href={`#${id}`}>{label}</a></Button>)}
          </nav>
        </div>
      </header>
      <main id="conteudo-parceiros">
        <section className="b2b-hero">
          <div className="b2b-shell b2b-hero-layout">
            <div className="b2b-hero-copy">
              <p className="b2b-eyebrow">PARCEIROS COMERCIAIS LIPOVITTA</p>
              <h1>Leve LipoVitta para o seu estabelecimento.</h1>
              <p className="b2b-intro">Produtos para sua loja, comissão para o vendedor e apoio da nossa equipe para começar.</p>
              <Button asChild className="b2b-button"><a href="#cadastro">Quero ser parceiro <ArrowRight /></a></Button>
              <p className="b2b-payment">Pedido inicial de 50 unidades do produto escolhido.<br />50% no pedido e 50% em até 60 dias.</p>
            </div>
            <figure className="b2b-hero-products">
              <img src={capsules} alt="Embalagem real LipoVitta Cápsulas" fetchPriority="high" />
              <img src={tangerine} alt="Embalagem real Shot Matinal LipoVitta Tangerina" fetchPriority="high" />
              <figcaption>Cápsulas & Shot Matinal<span>Uma nova presença no seu ponto de venda.</span></figcaption>
            </figure>
          </div>
        </section>
        <section className="b2b-audience"><div className="b2b-shell"><p>Uma parceria para o seu negócio</p><p>Farmácias · Academias · Lojas femininas · Lojas de suplementos · Espaços de beleza</p></div></section>
        <section id="produtos" className="b2b-section b2b-shell">
          <div className="b2b-heading"><p className="b2b-eyebrow">01 / Produtos e valores</p><h2>Escolha seu produto.<br />Conheça as condições.</h2><p>Preços de revenda sugeridos. A comissão de 10% é paga pelo estabelecimento ao vendedor.</p></div>
          <div className="b2b-products-grid">
            {(Object.keys(PARTNER_OFFERS) as PartnerProduct[]).map((id) => {
              const offer = PARTNER_OFFERS[id];
              const sale = simulatePartnerOrder(id, 50);
              return <article className="b2b-product" key={id}>
                <div className="b2b-product-image"><img src={id === "capsulas" ? capsules : shot.image} alt={id === "capsulas" ? "LipoVitta Cápsulas" : `Shot Matinal LipoVitta ${shot.name}`} loading="lazy" /></div>
                <div className="b2b-product-body">
                  <p className="b2b-eyebrow">Pedido inicial · {offer.minUnits} unidades</p><h3>{offer.name}</h3>
                  {id === "shot_matinal" && <div className="b2b-flavors" role="group" aria-label="Sabores atuais do Shot Matinal">{flavors.map((item, index) => <Button key={item.name} variant="outline" aria-pressed={index === flavor} onClick={() => setFlavor(index)}>{item.name}</Button>)}</div>}
                  <p className="b2b-wholesale">{partnerMoney(offer.wholesaleCents)} <span>/ unidade no atacado</span></p>
                  <dl className="b2b-card-values"><div><dt>Revenda sugerida</dt><dd>{partnerMoney(offer.retailCents)}</dd></div><div><dt>Comissão por venda · 10%</dt><dd>{partnerMoney(sale.commission / 50)}</dd></div><div><dt>Saldo por venda antes de outras despesas</dt><dd>{partnerMoney(sale.remaining / 50)}</dd></div></dl>
                  <p className="b2b-disclaimer">Tributos, taxas, frete e despesas ainda devem ser descontados. Promoções de varejo podem variar.</p>
                  <Button asChild variant="outline" className="b2b-product-cta"><a href="#cadastro" onClick={() => setProduct(id)}>Tenho interesse em {id === "capsulas" ? "Cápsulas" : "Shot Matinal"} <ArrowRight /></a></Button>
                </div>
              </article>;
            })}
          </div>
        </section>
        <section id="simulador" className="b2b-simulation-band"><div className="b2b-shell b2b-section">
          <div className="b2b-heading"><p className="b2b-eyebrow">02 / Simulador de pedido</p><h2>Os números, com clareza.</h2><p>Simule o saldo após produtos e comissão. O cenário considera a venda integral do lote pelo valor sugerido, sem garantir giro de estoque.</p></div>
          <PartnerSimulator product={product} quantity={quantity} onProductChange={setProduct} onQuantityChange={setQuantity} />
        </div></section>
        <section id="como-funciona" className="b2b-section b2b-shell">
          <div className="b2b-heading"><p className="b2b-eyebrow">03 / Como funciona</p><h2>Seu ponto de venda.<br />Nossa equipe por perto.</h2></div>
          <div className="b2b-support-grid">{support.map(({ icon: Icon, title, text }) => <div key={title}><Icon aria-hidden="true" /><h3>{title}</h3><p>{text}</p></div>)}</div>
          <ol className="b2b-steps"><li><span>01</span><h3>Escolha e cadastre-se</h3><p>Selecione um produto e envie o cadastro comercial. Pedidos mistos sob consulta.</p></li><li><span>02</span><h3>Combine o fechamento</h3><p>Frete e disponibilidade são confirmados com a equipe. Entrada de 50% no pedido.</p></li><li><span>03</span><h3>Receba e comece</h3><p>Saldo de 50% em até 60 dias da confirmação do pedido, independentemente do giro do estoque.</p></li></ol>
        </section>
        <section className="b2b-conditions-band"><div className="b2b-shell b2b-section b2b-faq-layout">
          <div className="b2b-heading"><p className="b2b-eyebrow">Condições da parceria</p><h2>Combinado claro,<br />desde o primeiro lote.</h2><p>Pedido de revenda, não consignação. Sem promessa de renda, vendas ou resultados clínicos.</p></div>
          <div className="b2b-faq">
            <details open><summary>Como funciona o pagamento?</summary><p>50% no pedido e 50% em até 60 dias da confirmação do pedido. O vencimento do saldo independe do giro do estoque. Frete e disponibilidade confirmados no fechamento.</p></details>
            <details><summary>Posso trocar produtos do primeiro lote?</summary><p>Troca de até 20% do primeiro lote: até dez unidades em um pedido de 50. Em outros volumes, o limite é 20% do lote, considerando unidades inteiras. Uma solicitação até 60 dias da entrega.</p><p>Produtos lacrados, válidos e conservados conforme rótulo; troca por produtos disponíveis, com diferença de valor ajustada e logística acordada. Sem devolução em dinheiro nem alteração do vencimento.</p></details>
            <details><summary>Quem paga a comissão do vendedor?</summary><p>O estabelecimento paga a comissão de 10% ao vendedor. Os valores apresentados usam o preço de revenda sugerido; promoções de varejo podem variar. O saldo não é lucro líquido: tributos, taxas, frete e despesas da loja ainda devem ser descontados.</p></details>
            <details><summary>Posso pedir produtos mistos?</summary><p>O pedido inicial é de pelo menos 50 unidades do produto escolhido. Pedidos mistos sob consulta com a equipe comercial.</p></details>
          </div>
        </div></section>
        <section id="cadastro" className="b2b-shell b2b-section b2b-registration">
          <div className="b2b-heading"><p className="b2b-eyebrow">04 / Cadastro comercial</p><h2>Vamos começar<br />uma conversa.</h2><p>Conte sobre seu estabelecimento e o produto de interesse. Nossa equipe entra em contato para confirmar as condições e os próximos passos.</p><p className="b2b-registration-note"><Check aria-hidden="true" /> Cadastro de interesse, sem cobrança.</p><Link to="/afiliados" className="b2b-affiliate-link">Quer participar como afiliada? Conheça o cadastro de afiliadas.</Link></div>
          <PartnerForm selectedProduct={product} quantity={quantity} onProductChange={setProduct} />
        </section>
      </main>
      <footer className="b2b-footer"><div className="b2b-shell"><Link to="/"><img src={logo} alt="LipoVitta" width="108" height="56" /></Link><p>Parceiros comerciais LipoVitta</p><Link to="/">Voltar ao site</Link></div></footer>
    </div>
  );
}