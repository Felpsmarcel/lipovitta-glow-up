import { ArrowDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import PreBlackCountdown from "@/components/pre-black/PreBlackCountdown";
import PreBlackBurst from "@/components/pre-black/PreBlackBurst";
import OfferSection from "@/components/OfferSection";
import GiftSelectionSection from "@/components/GiftSelectionSection";
import { GiftFlowProvider } from "@/context/GiftFlowContext";
import { PRE_BLACK_CONFIG, resolvePreBlackPhase } from "@/config/preBlack";
import { usePreBlackMotion } from "@/hooks/usePreBlackMotion";
import { usePreBlackPhase } from "@/hooks/usePreBlackPhase";
import { trackCtaClick } from "@/lib/tracking";
import logo from "@/assets/logo-lipovitta.png";
import kit from "@/assets/kit-completo-lipovitta.png.asset.json";
import tangerina from "@/assets/shot-matinal-tangerina.jpg";
import limao from "@/assets/shot-matinal-limao.jpg";
import abacaxi from "@/assets/shot-matinal-abacaxi.jpg";
import mixer from "@/assets/gifts/brinde-mixer.png";
import raspador from "@/assets/gifts/brinde-raspador.png";
import portaCapsulas from "@/assets/gifts/brinde-portacapsulas.png";

// Resolve the existing immutable asset on the official origin, including local QA.
const kitUrl = new URL(kit.url, "https://lipovitta.site").href;

function OffersCta({ location }: { location: string }) {
  const label = "VER OFERTAS";
  return (
    <div className="pb-cta-block">
      <Button asChild className="pb-cta"><a href="#ofertas" onClick={() => trackCtaClick({ location: `pre_black_${location}`, label, eventName: "CTAClick" })}><span>{label}</span><ArrowDown aria-hidden="true" /></a></Button>
      <p className="pb-cta-note">Ofertas da Pré Black logo abaixo, com os kits e brindes do site.</p>
    </div>
  );
}

function PageFooter() {
  return (
    <footer className="pb-footer pb-shell"><a href="/" aria-label="LipoVitta — página inicial"><img src={logo} alt="LipoVitta" width="116" height="63" loading="lazy" /></a><p>© 2026 LipoVitta. Todos os direitos reservados.</p><a href="#pre-black-content">Voltar ao início ↑</a></footer>
  );
}

/** Fase de antecipação: contador de abertura e apresentação dos produtos. Sem captação. */
function TeaserContent() {
  return (
    <>
      <section className="pb-hero">
        <div className="pb-shell pb-hero-grid">
          <div className="pb-hero-copy">
            <p className="pb-eyebrow" data-pb-motion="hero" data-pb-order="0">PRÉ BLACK LIPOVITTA <span>{PRE_BLACK_CONFIG.eyebrowDateLabel}</span></p>
            <h1 data-pb-motion="hero" data-pb-order="1">A maior pré black da história da LipoVitta <span className="pb-offer-intro">com ofertas de até</span><span className="pb-discount">30<span>%<small>OFF</small></span></span></h1>
            <p className="pb-hero-description" data-pb-motion="hero" data-pb-order="2">Na nossa pré black, você vai conhecer o sistema LipoVitta, para cuidar do corpo, reduzir a aparência da celulite e elevar sua autoestima, com até 3x sem juros, brindes especiais e ofertas exclusivas.</p>
          </div>
          <div className="pb-hero-photo" data-pb-motion="photo">
            <img src={kitUrl} alt="Linha LipoVitta com Cápsulas, três sabores de Shot Matinal e Shot Rush" width="1600" height="900" fetchPriority="high" />
          </div>
        </div>
      </section>

      <section className="pb-countdown-section" aria-labelledby="countdown-title">
        <div className="pb-shell pb-countdown-grid" data-pb-motion="scroll">
          <div><p className="pb-eyebrow">RESERVE ESSE MOMENTO</p><h2 id="countdown-title">Está chegando a<br />Pré Black LipoVitta.</h2><p className="pb-date">{PRE_BLACK_CONFIG.dateLabel} <span>•</span> {PRE_BLACK_CONFIG.timeLabel}</p></div>
          <div><PreBlackCountdown /><p className="pb-timezone">Horário da Bahia</p></div>
        </div>
        <p className="pb-shell pb-reveal-note">As ofertas e condições especiais serão reveladas no dia <strong>{PRE_BLACK_CONFIG.shortDateLabel}, às 08h</strong>, aqui mesmo nesta página.</p>
      </section>

      <section className="pb-products pb-shell" aria-labelledby="products-title">
        <div className="pb-section-heading" data-pb-motion="scroll"><p className="pb-eyebrow">O SEU RITUAL LIPOVITTA</p><h2 id="products-title">Vem aí uma oportunidade imperdível para você,<br className="hidden md:block" /> algo jamais visto na história.</h2><p>Shot Matinal, Shot Rush, LipoVitta cápsulas e acessórios exclusivos para sua rotina, com mixer, raspador de língua e porta-cápsulas para elevar seu autocuidado.</p></div>
        <figure className="pb-kit" data-pb-motion="scroll"><img src={kitUrl} alt="Linha LipoVitta com Cápsulas, três sabores de Shot Matinal e Shot Rush" loading="lazy" width="1600" height="900" /><figcaption><span>UM SISTEMA. A SUA ROTINA.</span><span>LipoVitta por Clara Caldas</span></figcaption></figure>
        <div className="pb-flavors" data-pb-motion="scroll"><div><p className="pb-eyebrow">SHOT MATINAL</p><h3>Qual é o seu sabor?</h3></div><div className="pb-flavor-list">{[[tangerina, "Tangerina"], [limao, "Limão"], [abacaxi, "Abacaxi"]].map(([src, name]) => <figure key={name}><img src={src} alt={`Shot Matinal ${name}`} width="180" height="220" loading="lazy" /><figcaption>{name}</figcaption></figure>)}</div></div>
      </section>

      <section className="pb-gifts-section" aria-labelledby="gifts-title"><div className="pb-shell pb-gifts-grid" data-pb-motion="scroll"><div><p className="pb-eyebrow">OS DETALHES FAZEM PARTE</p><h2 id="gifts-title">Mais carinho<br /> com a sua rotina.</h2><p>Brindes especiais e acessórios exclusivos para elevar seu autocuidado.</p></div><div className="pb-gift-list">{[[mixer, "Mixer"], [raspador, "Raspador de língua"], [portaCapsulas, "Porta-cápsulas"]].map(([src, name], i) => <figure key={name}><img src={src} alt={name} width="300" height="360" loading="lazy" /><figcaption><span>0{i + 1}</span>{name}</figcaption></figure>)}</div></div></section>
    </>
  );
}

/** Fase de vendas: hero comercial com o kit real + ofertas e brindes do site. */
function LiveContent() {
  return (
    <>
      <PreBlackLiveHero offersHref="#ofertas" trackLocation="pre_black_hero_live" />

      <div id="ofertas" className="pb-live-offers">
        <GiftFlowProvider>
          <OfferSection />
          <GiftSelectionSection />
        </GiftFlowProvider>
      </div>
    </>
  );
}

export default function PreBlack() {
  const root = usePreBlackMotion();
  const { search } = useLocation();
  const { phase: forced, demo } = resolvePreBlackPhase(search);
  const phase = usePreBlackPhase(demo ? forced : undefined);
  const live = phase === "live";
  return (
    <div ref={root} className={`pre-black${live ? " pre-black-live" : ""}`}>
      <SEOHead
        title={live ? "Pré Black LipoVitta — ofertas no ar" : "Pré Black LipoVitta — até 30% OFF"}
        description={live
          ? "A Pré Black LipoVitta começou. Escolha seu kit e aproveite as condições disponíveis, com até 3x sem juros e brindes especiais."
          : `Pré Black LipoVitta: ofertas de até 30% OFF, até 3x sem juros e brindes especiais. Começa dia ${PRE_BLACK_CONFIG.dateLabel}, às 08h da Bahia.`}
        canonicalUrl="https://lipovitta.site/pre-black"
      />
      <a className="pb-skip" href="#pre-black-content">Ir para o conteúdo</a>
      <header className="pb-header pb-shell">
        <a href="/" aria-label="LipoVitta — página inicial"><img src={logo} width="154" height="84" alt="LipoVitta por Clara Caldas" /></a>
        {live && <Button asChild variant="ghost" className="pb-header-link"><a href="#ofertas">VER OFERTAS <ArrowDown aria-hidden="true" /></a></Button>}
      </header>

      <main id="pre-black-content">
        {live ? <LiveContent /> : <TeaserContent />}
      </main>
      <PageFooter />
      {live && <div className="pb-mobile-bar"><OffersCta location="mobile_live" /></div>}
    </div>
  );
}
