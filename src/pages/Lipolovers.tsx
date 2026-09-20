import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Gift, RefreshCw, Sparkles, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import ResponsiveImage from "@/components/ui/ResponsiveImage";
import LipoloversLeadDialog from "@/components/lipolovers/LipoloversLeadDialog";
import { LIPOLOVERS_CONFIG, LIPOLOVERS_GIFTS, type LipoloversFlavorId } from "@/config/lipolovers";
import { trackViewContent } from "@/lib/tracking";
import logo from "@/assets/logo-lipovitta.png";
import comboOriginal from "@/assets/combo-lipovitta.png.asset.json";
import tangerina from "@/assets/shot-matinal-tangerina.jpg";
import limao from "@/assets/shot-matinal-limao.jpg";
import abacaxi from "@/assets/shot-matinal-abacaxi.jpg";

const flavorImages: Record<LipoloversFlavorId, string> = { tangerina, limao, abacaxi };
const COMBO_IMAGE = `https://lipovitta.site${comboOriginal.url}`;

const retailCapsules = 357;
const retailShot = 170;
const retailTotal = retailCapsules + retailShot;
const monthlySavings = retailTotal - LIPOLOVERS_CONFIG.plans.essencial.price;
const sixMonthSavings = monthlySavings * LIPOLOVERS_CONFIG.commitmentMonths;

const faq = [
  ["Posso cancelar minha assinatura?", `O Lipolovers Essencial possui um período inicial de permanência de ${LIPOLOVERS_CONFIG.commitmentMonths} meses. Durante esse período, a assinatura permanece ativa com cobranças mensais. Após os ${LIPOLOVERS_CONFIG.commitmentMonths} meses iniciais, você pode solicitar o cancelamento para as próximas cobranças.`],
  ["A cobrança dos 6 meses é feita de uma vez?", `Não. A cobrança é mensal, no valor de R$ ${LIPOLOVERS_CONFIG.plans.essencial.price}. O período inicial de permanência da assinatura é de ${LIPOLOVERS_CONFIG.commitmentMonths} meses.`],
  ["Quanto eu economizo?", `Cápsulas LipoVitta e Shot Matinal somam R$ ${retailTotal} quando comprados separadamente. No Lipolovers Essencial, a mensalidade é de R$ ${LIPOLOVERS_CONFIG.plans.essencial.price}, uma economia de R$ ${monthlySavings} por mês, considerando os preços atuais.`],
  ["O que acontece depois dos 6 meses?", "Após o período inicial de 6 meses, sua assinatura continua normalmente de forma mensal. A partir daí, você pode solicitar o cancelamento para as próximas cobranças."],
  ["O frete está incluído?", "Não. O frete é calculado à parte no momento da assinatura."],
  ["Posso escolher o sabor?", "Sim. Antes do pagamento, você escolhe Tangerina, Limão ou Abacaxi para o seu Shot Matinal."],
  ["Quais brindes vêm na assinatura?", "O plano Essencial inclui Raspador de língua, Porta cápsulas e Mixer Dosador."],
  ["Quando meu pedido é enviado?", "Após a confirmação do pagamento e dos dados de entrega, o pedido segue para preparação e envio."],
] as const;

export default function Lipolovers() {
  const [flavor, setFlavor] = useState<LipoloversFlavorId>("tangerina");
  const [dialogOpen, setDialogOpen] = useState(false);
  const viewed = useRef(false);
  const plan = LIPOLOVERS_CONFIG.plans.essencial;

  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    trackViewContent({ contentName: "Clube de Assinatura Lipolovers", contentCategory: "assinatura" });
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20 text-foreground md:pb-0">
      <SEOHead title="Lipolovers Essencial — Economize R$ 128 por mês" description="Cápsulas LipoVitta e Shot Matinal por R$ 399/mês. Economize R$ 128 todo mês no clube Lipolovers." canonicalUrl="https://lipovitta.site/lipolovers" />
      <header className="border-b border-border bg-background/95">
        <div className="container flex items-center justify-between px-4 py-3">
          <Link to="/" aria-label="Ir para o site LipoVitta"><img src={logo} alt="LipoVitta" className="h-9 w-auto" /></Link>
          <a href="#economia" className="text-sm font-semibold text-primary">Ver economia</a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border bg-muted/25">
          <div className="container grid gap-5 px-4 pb-8 pt-7 md:min-h-[640px] md:grid-cols-12 md:items-center md:gap-10 md:py-14">
            <div className="relative z-10 md:col-span-7 lg:col-span-6">
              <p className="mb-2 text-xs font-bold uppercase text-accent sm:mb-3 sm:text-sm">Clube de assinatura LipoVitta</p>
              <h1 className="text-[2.15rem] font-extrabold leading-[1.05] text-primary sm:text-5xl lg:text-6xl">Lipolovers Essencial</h1>
              <h2 className="mt-3 max-w-2xl text-[1.55rem] font-extrabold leading-[1.18] text-foreground sm:mt-4 sm:text-3xl lg:text-4xl">Sua rotina LipoVitta por R$ {monthlySavings} a menos todos os meses.</h2>
              <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">Receba Cápsulas LipoVitta + Shot Matinal todos os meses por um valor especial para assinantes.</p>

              <img src={COMBO_IMAGE} alt="Cápsulas LipoVitta e Shot Matinal" className="mx-auto mt-4 aspect-video h-auto w-full object-contain md:hidden" />

              <div className="mt-4 grid max-w-xl grid-cols-[1fr_auto_1.15fr] items-end gap-3 border-y border-border py-3 sm:mt-6 sm:gap-5 sm:py-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Comprando separado</p>
                  <p className="mt-1 text-lg font-bold text-muted-foreground line-through sm:text-xl">R$ {retailTotal}</p>
                </div>
                <div className="h-12 w-px bg-border" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase text-primary">Como Lipolover</p>
                  <p className="mt-1 whitespace-nowrap text-[1.7rem] font-extrabold text-primary sm:text-3xl">R$ {plan.price}<span className="text-sm font-semibold sm:text-base">/mês</span></p>
                </div>
              </div>

              <div className="mt-4 inline-flex flex-col border-l-4 border-accent pl-3 sm:mt-5 sm:pl-4">
                <strong className="text-base font-extrabold text-primary sm:text-xl">ECONOMIZE R$ {monthlySavings} TODO MÊS</strong>
                <span className="mt-1 text-sm font-semibold text-muted-foreground">≈ 24% de economia</span>
              </div>
              <div>
                <Button size="lg" onClick={() => setDialogOpen(true)} className="mt-5 h-[3.25rem] w-full bg-primary px-5 text-sm font-bold hover:bg-primary/90 sm:mt-6 sm:w-auto sm:px-7">QUERO SER LIPOLOVER <ArrowRight /></Button>
                <p className="mt-2 text-sm text-muted-foreground">Assinatura mensal • Frete calculado à parte</p>
              </div>
            </div>
            <div className="relative mx-auto hidden w-full md:col-span-5 md:block lg:col-span-6">
              <img src={COMBO_IMAGE} alt="Cápsulas LipoVitta e Shot Matinal" className="mx-auto aspect-video h-auto w-full max-w-[720px] object-contain" />
            </div>
          </div>
        </section>

        <section id="economia" className="scroll-mt-6 bg-primary py-11 text-primary-foreground md:py-20">
          <div className="container px-4">
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-sm font-bold uppercase text-accent-light">Economia real, todos os meses</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Por que vale a pena ser Lipolover?</h2>
              <div className="mt-7 grid grid-cols-2 items-stretch gap-2 sm:mt-10 sm:grid-cols-[1fr_auto_1fr_auto_1.2fr] sm:gap-4">
                <div className="border border-primary-foreground/25 p-3 sm:p-5"><p className="text-xs sm:text-sm">Cápsulas LipoVitta</p><strong className="mt-1 block text-2xl sm:mt-2 sm:text-3xl">R$ {retailCapsules}</strong></div>
                <span className="hidden self-center text-2xl font-bold text-accent-light sm:block">+</span>
                <div className="border border-primary-foreground/25 p-3 sm:p-5"><p className="text-xs sm:text-sm">Shot Matinal</p><strong className="mt-1 block text-2xl sm:mt-2 sm:text-3xl">R$ {retailShot}</strong></div>
                <span className="hidden self-center text-2xl font-bold text-accent-light sm:block">=</span>
                <div className="col-span-2 border-2 border-accent-light p-3 sm:col-span-1 sm:p-5"><p className="text-xs sm:text-sm">Total comprando separadamente</p><strong className="mt-1 block text-2xl sm:mt-2 sm:text-3xl">R$ {retailTotal}</strong></div>
              </div>
              <p className="mt-8 text-sm font-semibold uppercase text-accent-light">No Lipolovers Essencial</p>
              <p className="mt-1 text-5xl font-extrabold sm:text-6xl">R$ {plan.price}<span className="text-lg sm:text-xl">/mês</span></p>
              <p className="mx-auto mt-5 max-w-3xl border-y border-primary-foreground/25 py-4 text-xl font-extrabold sm:mt-6 sm:py-5 sm:text-3xl">VOCÊ ECONOMIZA R$ {monthlySavings} POR MÊS</p>
              <p className="mt-5 text-base">Isso representa aproximadamente 24% de economia sobre a compra avulsa.</p>
              <p className="mt-2 text-sm text-primary-foreground/80">R$ {sixMonthSavings} de economia nos primeiros 6 meses, considerando os preços atuais.</p>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-background py-14 md:py-18">
          <div className="container px-4">
            <div className="mx-auto mb-8 max-w-2xl text-center"><p className="text-sm font-bold uppercase text-accent">Benefícios do clube</p><h2 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl">Mais economia, menos repetição</h2></div>
            <div className="mx-auto grid max-w-6xl gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
              {[
                [WalletCards, "Economia todo mês", `Cápsulas + Shot Matinal de R$ ${retailTotal} por R$ ${plan.price}/mês.`],
                [RefreshCw, "Sua rotina continua", "Você não precisa voltar ao site e refazer o mesmo pedido todos os meses."],
                [Sparkles, "Escolha seu sabor", "Shot Matinal disponível em Tangerina, Limão ou Abacaxi."],
                [Gift, "Presentes Lipolovers", "Raspador de língua, Porta cápsulas e Mixer Dosador."],
              ].map(([Icon, title, text]) => {
                const BenefitIcon = Icon as typeof WalletCards;
                return <div key={String(title)} className="grid grid-cols-[2rem_1fr] gap-x-3 bg-background p-4 sm:block sm:p-6"><BenefitIcon className="row-span-2 mt-0.5 h-6 w-6 text-accent sm:h-7 sm:w-7" /><h3 className="text-base font-bold text-primary sm:mt-4 sm:text-lg">{String(title)}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground sm:mt-2">{String(text)}</p></div>;
              })}
            </div>
          </div>
        </section>

        <section id="plano" className="scroll-mt-6 bg-muted/25 py-14 md:py-20">
          <div className="container px-4">
            <div className="mx-auto mb-10 max-w-3xl text-center"><p className="text-sm font-bold uppercase text-accent">O plano Essencial</p><h2 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl">Tudo o que faz parte do Lipolovers Essencial</h2></div>
            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:items-center">
              <img src={COMBO_IMAGE} alt="Cápsulas LipoVitta e Shot Matinal do plano Essencial" className="aspect-video h-auto w-full object-contain" />
              <div>
                <div className="divide-y divide-border border-y border-border">
                  <div className="grid grid-cols-[1fr_auto] items-center gap-3 py-4"><span className="flex items-center gap-2 font-semibold"><Check className="h-5 w-5 shrink-0 text-accent" />1 Cápsulas LipoVitta</span><span className="text-right text-xs text-muted-foreground sm:text-sm">Avulso: R$ {retailCapsules}</span></div>
                  <div className="grid grid-cols-[1fr_auto] items-center gap-3 py-4"><span className="flex items-center gap-2 font-semibold"><Check className="h-5 w-5 shrink-0 text-accent" />1 Shot Matinal</span><span className="text-right text-xs text-muted-foreground sm:text-sm">Avulso: R$ {retailShot}</span></div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-5">
                  <div><p className="text-xs font-semibold uppercase text-muted-foreground">Valor avulso total</p><p className="mt-1 text-2xl font-bold text-muted-foreground line-through">R$ {retailTotal}</p></div>
                  <div><p className="text-xs font-semibold uppercase text-primary">Valor Lipolovers</p><p className="mt-1 text-3xl font-extrabold text-primary">R$ {plan.price}<span className="text-sm">/mês</span></p></div>
                </div>
                <p className="mt-5 border-l-4 border-accent pl-4 text-xl font-extrabold text-primary">Economia de R$ {monthlySavings}/mês</p>
                <Button size="lg" onClick={() => setDialogOpen(true)} className="mt-7 h-12 w-full bg-primary px-4 text-sm font-bold hover:bg-primary/90"><span className="sm:hidden">QUERO ECONOMIZAR R$ {monthlySavings}/MÊS</span><span className="hidden sm:inline">QUERO ECONOMIZAR COM O LIPOLOVERS</span></Button>
                <p className="mt-2 text-center text-xs text-muted-foreground">Assinatura mensal • Frete calculado à parte</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background py-14 md:py-20">
          <div className="container px-4">
            <div className="mx-auto mb-10 max-w-2xl text-center"><p className="text-sm font-bold uppercase text-accent">Seu Shot Matinal</p><h2 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl">Escolha o sabor que combina com a sua rotina</h2></div>
            <fieldset className="mx-auto max-w-4xl">
              <legend className="sr-only">Escolha o sabor do Shot Matinal</legend>
              <div className="grid grid-cols-3 gap-2 sm:gap-5">
                {LIPOLOVERS_CONFIG.flavors.map((option) => <label key={option.id} className={`flex min-h-36 cursor-pointer flex-col justify-between border p-2 text-center transition-colors sm:min-h-0 sm:p-5 ${flavor === option.id ? "border-2 border-primary bg-primary/5 text-primary" : "border-border bg-background"}`}>
                  <input type="radio" name="flavor" className="sr-only" checked={flavor === option.id} onChange={() => setFlavor(option.id)} />
                  <img src={flavorImages[option.id]} alt={`Shot Matinal sabor ${option.label}`} className="mx-auto aspect-square w-full max-w-44 object-contain" />
                  <span className="mt-2 block text-xs font-bold sm:text-base">{option.label}</span>
                </label>)}
              </div>
              <Button size="lg" onClick={() => setDialogOpen(true)} className="mx-auto mt-7 flex h-12 w-full bg-primary font-bold hover:bg-primary/90 sm:w-auto">ESCOLHER ESTE SABOR <ArrowRight /></Button>
            </fieldset>
          </div>
        </section>

        <section className="bg-muted/25 py-14 md:py-20">
          <div className="container px-4">
            <div className="mx-auto mb-10 max-w-2xl text-center"><p className="text-sm font-bold uppercase text-accent">Presentes Lipolovers</p><h2 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl">Mais carinho na sua assinatura</h2><p className="mt-4 text-muted-foreground">Os brindes do Lipolovers Essencial acompanham a sua experiência no clube.</p></div>
            <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
              {LIPOLOVERS_GIFTS.map((gift) => (
                <div key={gift.id} className="border border-border bg-card p-5 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-40 w-40 items-center justify-center overflow-hidden bg-muted/50">
                    <ResponsiveImage picture={gift.image} alt={gift.nome} sizes="160px" className="h-full w-full object-contain p-4" />
                  </div>
                  <h3 className="text-lg font-bold text-primary">{gift.nome}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{gift.linha}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-background py-14 md:py-20">
          <div className="container px-4 text-center">
            <p className="text-sm font-bold uppercase text-accent">Mais valor em cada mês</p>
            <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold text-primary sm:text-4xl">Você leva R$ {retailTotal} em produtos por R$ {plan.price}/mês.</h2>
            <p className="mt-5 text-xl font-bold text-foreground">R$ {monthlySavings} ficam no seu bolso todos os meses.</p>
          </div>
        </section>

        <section className="bg-primary py-14 text-primary-foreground md:py-20">
          <div className="container px-4 text-center">
            <h2 className="mx-auto max-w-3xl text-3xl font-extrabold sm:text-4xl">Sua rotina pode custar menos a partir de agora.</h2>
            <p className="mt-4 text-lg">Cápsulas + Shot Matinal por R$ {plan.price}/mês.</p>
            <p className="mt-2 text-2xl font-extrabold text-accent-light">Economize R$ {monthlySavings} por mês.</p>
            <Button size="lg" onClick={() => setDialogOpen(true)} className="mt-7 h-12 bg-accent px-8 font-bold text-accent-foreground hover:bg-accent/90">QUERO SER LIPOLOVER <ArrowRight /></Button>
            <p className="mt-3 text-sm text-primary-foreground/80">Assinatura mensal • Frete calculado à parte</p>
          </div>
        </section>

        <section className="bg-background py-16 md:py-24">
          <div className="container max-w-3xl px-4">
            <p className="text-center text-sm font-bold uppercase text-accent">Dúvidas frequentes</p>
            <h2 className="mt-3 text-center text-3xl font-extrabold text-primary sm:text-4xl">Tudo sobre o Lipolovers</h2>
            <Accordion type="single" collapsible className="mt-10 divide-y divide-border border-y border-border">
              {faq.map(([question, answer], index) => <AccordionItem key={question} value={`faq-${index}`} className="border-0"><AccordionTrigger className="text-left text-base font-bold text-primary hover:no-underline">{question}</AccordionTrigger><AccordionContent className="text-sm leading-relaxed text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
       <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden"><Button onClick={() => setDialogOpen(true)} className="h-12 w-full bg-primary text-sm font-bold hover:bg-primary/90">ECONOMIZAR R$ {monthlySavings}/MÊS</Button></div>
      <LipoloversLeadDialog open={dialogOpen} onOpenChange={setDialogOpen} initialFlavor={flavor} />
    </div>
  );
}