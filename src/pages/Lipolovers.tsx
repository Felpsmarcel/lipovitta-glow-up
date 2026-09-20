import { useEffect, useRef, useState } from "react";
import { ArrowDown, Check, ChevronDown, PackageCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import LipoloversLeadDialog from "@/components/lipolovers/LipoloversLeadDialog";
import { LIPOLOVERS_CONFIG, type LipoloversFlavorId, type LipoloversPlanId } from "@/config/lipolovers";
import { trackViewContent } from "@/lib/tracking";
import logo from "@/assets/logo-lipovitta.png";
import comboOriginal from "@/assets/lipolovers-combo-original.png.asset.json";
import kitCompletoOriginal from "@/assets/lipolovers-kit-completo-original.png.asset.json";
import tangerina from "@/assets/shot-matinal-tangerina.jpg";
import limao from "@/assets/shot-matinal-limao.jpg";
import abacaxi from "@/assets/shot-matinal-abacaxi.jpg";

const flavorImages: Record<LipoloversFlavorId, string> = { tangerina, limao, abacaxi };

function ProductStage({ master, hero = false }: { master: boolean; hero?: boolean }) {
  const image = master ? kitCompletoOriginal.url : comboOriginal.url;
  const alt = master ? "Kit Completo LipoVitta original" : "Combo LipoVitta original";

  return (
    <div className={`mx-auto w-full overflow-hidden rounded-md bg-muted/25 ${hero ? "max-w-[720px]" : ""}`}>
      <img src={image} alt={alt} className="aspect-video h-auto w-full object-contain" />
    </div>
  );
}

const faq = [
  ["Tem fidelidade?", "Não. A assinatura não tem fidelidade mínima e pode ser cancelada para as próximas cobranças."],
  ["O frete está incluído?", "Não. O frete é calculado à parte no momento da assinatura."],
  ["Posso escolher o sabor?", "Sim. Antes do pagamento, você escolhe Tangerina, Limão ou Abacaxi para o seu Shot Matinal."],
  ["Qual a diferença entre Essencial e Master?", "O Essencial inclui Cápsulas LipoVitta e Shot Matinal. O Master acrescenta o Shot Rush sabor Frutas Vermelhas."],
  ["Como funciona a cobrança?", "A cobrança é mensal pelo plano escolhido, conforme as condições apresentadas no checkout seguro."],
  ["Posso cancelar?", "Sim. Você pode solicitar o cancelamento antes da próxima cobrança pelos canais de atendimento LipoVitta."],
  ["Quando meu pedido é enviado?", "Após a confirmação do pagamento e dos dados de entrega, o pedido segue para preparação e envio."],
] as const;

export default function Lipolovers() {
  const [selectedPlan, setSelectedPlan] = useState<LipoloversPlanId>("essencial");
  const [flavors, setFlavors] = useState<Record<LipoloversPlanId, LipoloversFlavorId>>({ essencial: "tangerina", master: "tangerina" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const viewed = useRef(false);

  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    trackViewContent({ contentName: "Clube de Assinatura Lipolovers", contentCategory: "assinatura" });
  }, []);

  const choosePlan = (plan: LipoloversPlanId) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20 text-foreground md:pb-0">
      <SEOHead title="Lipolovers — Clube de Assinatura LipoVitta" description="Escolha seu plano Lipolovers e receba seu ritual LipoVitta todo mês, sem fidelidade." canonicalUrl="https://lipovitta.site/lipolovers" />
      <header className="border-b border-border bg-background/95">
        <div className="container flex items-center justify-between px-4 py-3">
          <Link to="/" aria-label="Ir para o site LipoVitta"><img src={logo} alt="LipoVitta" className="h-9 w-auto" /></Link>
          <a href="#planos" className="text-sm font-semibold text-primary">Ver planos <ChevronDown className="ml-1 inline h-4 w-4" /></a>
        </div>
      </header>

      <main>
        <section className="overflow-hidden border-b border-border bg-muted/25">
          <div className="container grid min-h-[calc(100svh-64px)] content-center gap-7 px-4 pb-8 pt-10 md:min-h-[660px] md:grid-cols-12 md:items-center md:gap-10 md:py-14">
            <div className="relative z-10 md:col-span-6 lg:col-span-5">
              <p className="mb-3 text-xs font-bold uppercase text-accent sm:text-sm">Clube de assinatura LipoVitta</p>
              <h1 className="text-5xl font-extrabold leading-none text-primary sm:text-6xl lg:text-7xl">Lipolovers</h1>
              <h2 className="mt-4 max-w-lg text-2xl font-bold leading-tight text-foreground sm:text-3xl">Seu ritual LipoVitta, todo mês.</h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">Escolha seu plano e seu sabor. Sua assinatura é mensal, sem fidelidade, e você não precisa refazer seu pedido todos os meses.</p>
              <div className="mt-6 flex items-baseline gap-3"><span className="text-sm font-semibold text-muted-foreground">A partir de</span><strong className="text-3xl text-primary">R$ 399/mês</strong></div>
              <Button asChild size="lg" className="mt-5 h-[3.25rem] w-full bg-primary px-7 font-bold hover:bg-primary/90 sm:w-auto"><a href="#planos">QUERO SER LIPOLOVER <ArrowDown /></a></Button>
              <p className="mt-2 text-sm text-muted-foreground">Frete calculado à parte.</p>
            </div>
            <div className="relative mx-auto w-full md:col-span-6 lg:col-span-7"><ProductStage master hero /></div>
          </div>
        </section>

        <section className="border-b border-border bg-background py-8 md:py-12">
          <div className="container grid gap-1 px-4 md:grid-cols-3 md:gap-5">
            {[[RefreshCw, "Todo mês", "Seu ritual chega sem precisar refazer o pedido."], [ShieldCheck, "Sem fidelidade", "Você mantém a liberdade de cancelar."], [PackageCheck, "Do seu jeito", "Escolha o plano e o sabor do Shot Matinal."]].map(([Icon, title, text]) => {
              const FeatureIcon = Icon as typeof RefreshCw;
              return <div key={String(title)} className="flex gap-4 border-b border-border py-5 last:border-b-0 md:border-b-0 md:border-r md:px-6 md:last:border-r-0"><FeatureIcon className="mt-1 h-6 w-6 shrink-0 text-accent" /><div><h3 className="text-lg font-bold text-primary">{String(title)}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{String(text)}</p></div></div>;
            })}
          </div>
        </section>

        <section id="planos" className="scroll-mt-6 bg-background py-14 md:py-20">
          <div className="container px-4">
            <div className="mx-auto mb-10 max-w-2xl text-center"><p className="text-sm font-bold uppercase text-accent">Escolha o seu ritual</p><h2 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl">Compare e escolha com tranquilidade</h2><p className="mt-4 text-muted-foreground">Os dois planos têm cobrança mensal, sem fidelidade e com frete calculado à parte.</p></div>
            <div className="mx-auto grid max-w-5xl items-stretch gap-6 md:grid-cols-2">
              {(["essencial", "master"] as LipoloversPlanId[]).map((id) => {
                const plan = LIPOLOVERS_CONFIG.plans[id];
                const isMaster = id === "master";
                const flavor = flavors[id];
                return <article key={id} className={`relative flex flex-col overflow-hidden rounded-lg border bg-card ${isMaster ? "border-primary shadow-md" : "border-border shadow-sm"}`}>
                  {isMaster && <div className="bg-primary px-4 py-2 text-center text-xs font-bold uppercase text-primary-foreground">Mais completo</div>}
                  <div className="bg-muted/25 p-4 sm:p-5"><ProductStage master={isMaster} /></div>
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h3 className="text-2xl font-extrabold text-primary">{plan.name}</h3>
                    <p className="mt-2 text-3xl font-extrabold text-foreground">R$ {plan.price}<span className="text-base font-medium text-muted-foreground">/mês</span></p>
                    <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-muted-foreground"><span>Cobrança mensal</span><span aria-hidden="true">•</span><span>Sem fidelidade</span><span aria-hidden="true">•</span><span>Frete à parte</span></div>
                    <p className="mt-6 text-xs font-bold uppercase text-muted-foreground">Inclui</p>
                    <ul className="mt-3 space-y-3">{plan.includes.map((item) => <li key={item} className="flex gap-3 text-sm"><Check className="h-5 w-5 shrink-0 text-accent" /><span>{item}</span></li>)}{isMaster && <li className="pl-8 text-xs text-muted-foreground">Shot Rush: Frutas Vermelhas</li>}</ul>
                    <fieldset className="mt-7">
                      <legend className="text-xs font-bold uppercase text-muted-foreground">Sabor do Shot Matinal</legend>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {LIPOLOVERS_CONFIG.flavors.map((option) => <label key={option.id} className={`cursor-pointer rounded-md border p-2 text-center transition-colors ${flavor === option.id ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>
                          <input type="radio" name={`flavor-${id}`} className="sr-only" checked={flavor === option.id} onChange={() => setFlavors((current) => ({ ...current, [id]: option.id }))} />
                          <img src={flavorImages[option.id]} alt="" className="mx-auto h-14 w-full object-contain" />
                          <span className="mt-1 block text-[11px] font-semibold">{option.label}</span>
                        </label>)}
                      </div>
                    </fieldset>
                    <Button size="lg" onClick={() => choosePlan(id)} className="mt-7 h-12 w-full bg-primary font-bold hover:bg-primary/90">Escolher {isMaster ? "Master" : "Essencial"} — R$ {plan.price}/mês</Button>
                  </div>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section className="bg-primary py-14 text-primary-foreground"><div className="container grid gap-8 px-4 md:grid-cols-3 md:items-center"><div><p className="text-sm font-bold uppercase text-accent-light">Simples e transparente</p><h2 className="mt-3 text-3xl font-extrabold">Seu plano, no seu ritmo.</h2></div><div className="grid gap-5 sm:grid-cols-3 md:col-span-2">{["Sem fidelidade mínima", "Cobrança mensal", "Frete calculado à parte"].map((item) => <div key={item} className="border-l-2 border-accent-light pl-4 text-sm font-semibold">{item}</div>)}</div></div></section>
        <section className="bg-background py-16 md:py-24"><div className="container max-w-3xl px-4"><p className="text-center text-sm font-bold uppercase text-accent">Dúvidas frequentes</p><h2 className="mt-3 text-center text-3xl font-extrabold text-primary sm:text-4xl">Tudo sobre o Lipolovers</h2><Accordion type="single" collapsible className="mt-10 divide-y divide-border border-y border-border">{faq.map(([question, answer], index) => <AccordionItem key={question} value={`faq-${index}`} className="border-0"><AccordionTrigger className="text-left text-base font-bold text-primary hover:no-underline">{question}</AccordionTrigger><AccordionContent className="text-sm leading-relaxed text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}</Accordion></div></section>
      </main>

      <Footer />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden"><Button asChild className="h-12 w-full bg-primary font-bold hover:bg-primary/90"><a href="#planos">VER PLANOS — A PARTIR DE R$ 399</a></Button></div>
      <LipoloversLeadDialog open={dialogOpen} onOpenChange={setDialogOpen} planId={selectedPlan} initialFlavor={flavors[selectedPlan]} />
    </div>
  );
}