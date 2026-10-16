import { ArrowDown, ArrowUpRight, MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import PreBlackCountdown from "@/components/pre-black/PreBlackCountdown";
import PreBlackBurst from "@/components/pre-black/PreBlackBurst";
import OfferSection from "@/components/OfferSection";
import GiftSelectionSection from "@/components/GiftSelectionSection";
import { GiftFlowProvider } from "@/context/GiftFlowContext";
import { PRE_BLACK_CONFIG, confirmedGroupUrl, resolvePreBlackPhase } from "@/config/preBlack";
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
import campaignBanner from "@/assets/pre-black-campaign-banner.png.asset.json";
import heroClara from "@/assets/pre-black-hero-clara.png.asset.json";
import finalGroup from "@/assets/pre-black-final-grupo.png.asset.json";

const groupUrl = confirmedGroupUrl(PRE_BLACK_CONFIG.groupUrl);
// Resolve the existing immutable asset on the official origin, including local QA.
const kitUrl = new URL(kit.url, "https://lipovitta.site").href;
const campaignBannerUrl = new URL(campaignBanner.url, "https://lipovitta.site").href;
const heroClaraUrl = new URL(heroClara.url, "https://lipovitta.site").href;
const finalGroupUrl = new URL(finalGroup.url, "https://lipovitta.site").href;

function GroupCta({ location, final = false }: { location: string; final?: boolean }) {
  const label = final ? "ENTRE AGORA NO GRUPO VIP DO WHATSAPP" : "QUERO ENTRAR NO GRUPO DO WHATSAPP";
  if (!groupUrl) return (
    <div className="pb-cta-block">
      <Button disabled className="pb-cta"><MessageCircle aria-hidden="true" /><span>GRUPO VIP DISPONÍVEL EM BREVE</span></Button>
      <p className="pb-cta-note">O convite para o grupo VIP ainda não está disponível.</p>
    </div>
  );
  return (
    <div className="pb-cta-block">
      <Button asChild className="pb-cta"><a href={groupUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackCtaClick({ location: `pre_black_${location}`, label, eventName: "CTAClick" })}><MessageCircle aria-hidden="true" /><span>{label}</span><ArrowUpRight aria-hidden="true" /></a></Button>
      <p className="pb-cta-note">Toque no botão acima e entre no grupo exclusivo e silencioso da pré black.</p>
    </div>
  );
}

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

/** Fase de captação: contador, grupo VIP e antecipação da campanha. */
function TeaserContent() {
  return (
    <>
      <section className="pb-hero">
        <div className="pb-shell pb-hero-grid">
          <div className="pb-hero-copy">
            <p className="pb-eyebrow" data-pb-motion="hero" data-pb-order="0">PRÉ BLACK LIPOVITTA <span>{PRE_BLACK_CONFIG.eyebrowDateLabel}</span></p>
            <h1 data-pb-motion="hero" data-pb-order="1">A maior pré black da história da LipoVitta <span className="pb-offer-intro">com ofertas de até</span><span className="pb-discount">30<span>%<small>OFF</small></span></span></h1>
            <p className="pb-hero-description" data-pb-motion="hero" data-pb-order="2">Na nossa pré black, você vai conhecer o sistema LipoVitta, para cuidar do corpo, reduzir a aparência da celulite e elevar sua autoestima, com até 3x sem juros, brindes especiais e ofertas exclusivas.</p>
            <div data-pb-motion="hero" data-pb-order="3"><GroupCta location="hero" /></div>
          </div>
          <div className="pb-hero-photo" data-pb-motion="photo">
            <img src={heroClaraUrl} alt="Clara Caldas sentada com um copo LipoVitta e a linha de produtos ao lado, com o texto: Não compre LipoVitta agora. A Pré-Black está chegando. Entre no grupo VIP." width="1122" height="1402" fetchPriority="high" />
          </div>
        </div>
      </section>

      <section className="pb-shell py-10 md:py-16" aria-label="Campanha Pré Black LipoVitta">
        <div className="mx-auto max-w-[640px]" data-pb-motion="scroll">
          {groupUrl ? (
            <a href={groupUrl} target="_blank" rel="noopener noreferrer" aria-label="Quero acesso antecipado: entrar no grupo VIP da Pré Black" className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring" onClick={() => trackCtaClick({ location: "pre_black_banner", label: "QUERO ACESSO ANTECIPADO", eventName: "CTAClick" })}>
              <img src={campaignBannerUrl} alt="Pré Black LipoVitta: até 30% OFF, presente especial e condições exclusivas. Quero acesso antecipado." width="768" height="960" className="block h-auto w-full" loading="lazy" />
            </a>
          ) : (
            <img src={campaignBannerUrl} alt="Pré Black LipoVitta: até 30% OFF, presente especial e condições exclusivas." width="768" height="960" className="block h-auto w-full" loading="lazy" />
          )}
        </div>
      </section>

      <section className="pb-countdown-section" aria-labelledby="countdown-title">
        <div className="pb-shell pb-countdown-grid" data-pb-motion="scroll">
          <div><p className="pb-eyebrow">RESERVE ESSE MOMENTO</p><h2 id="countdown-title">Está chegando a<br />Pré Black LipoVitta.</h2><p className="pb-date">{PRE_BLACK_CONFIG.dateLabel} <span>•</span> {PRE_BLACK_CONFIG.timeLabel}</p></div>
          <div><PreBlackCountdown /><p className="pb-timezone">Horário da Bahia</p></div>
        </div>
        <p className="pb-shell pb-reveal-note">As ofertas e condições especiais serão reveladas no dia <strong>{PRE_BLACK_CONFIG.shortDateLabel}, às 08h</strong>, exclusivamente para quem estiver no grupo.</p>
      </section>

      <section className="pb-products pb-shell" aria-labelledby="products-title">
        <div className="pb-section-heading" data-pb-motion="scroll"><p className="pb-eyebrow">O SEU RITUAL LIPOVITTA</p><h2 id="products-title">Vem aí uma oportunidade imperdível para você,<br className="hidden md:block" /> algo jamais visto na história.</h2><p>Shot Matinal, Shot Rush, LipoVitta cápsulas e acessórios exclusivos para sua rotina, com mixer, raspador de língua e porta-cápsulas para elevar seu autocuidado.</p></div>
        <figure className="pb-kit" data-pb-motion="scroll"><img src={kitUrl} alt="Linha LipoVitta com Cápsulas, três sabores de Shot Matinal e Shot Rush" loading="lazy" width="1600" height="900" /><figcaption><span>UM SISTEMA. A SUA ROTINA.</span><span>LipoVitta por Clara Caldas</span></figcaption></figure>
        <div className="pb-flavors" data-pb-motion="scroll"><div><p className="pb-eyebrow">SHOT MATINAL</p><h3>Qual é o seu sabor?</h3></div><div className="pb-flavor-list">{[[tangerina, "Tangerina"], [limao, "Limão"], [abacaxi, "Abacaxi"]].map(([src, name]) => <figure key={name}><img src={src} alt={`Shot Matinal ${name}`} width="180" height="220" loading="lazy" /><figcaption>{name}</figcaption></figure>)}</div></div>
      </section>

      <section className="pb-gifts-section" aria-labelledby="gifts-title"><div className="pb-shell pb-gifts-grid" data-pb-motion="scroll"><div><p className="pb-eyebrow">OS DETALHES FAZEM PARTE</p><h2 id="gifts-title">Mais carinho<br /> com a sua rotina.</h2><p>Brindes especiais e acessórios exclusivos para elevar seu autocuidado.</p></div><div className="pb-gift-list">{[[mixer, "Mixer"], [raspador, "Raspador de língua"], [portaCapsulas, "Porta-cápsulas"]].map(([src, name], i) => <figure key={name}><img src={src} alt={name} width="300" height="360" loading="lazy" /><figcaption><span>0{i + 1}</span>{name}</figcaption></figure>)}</div></div></section>

      <section id="grupo-vip" className="pb-final" aria-labelledby="vip-title"><div className="pb-shell pb-final-grid" data-pb-motion="scroll"><div className="pb-final-copy"><p className="pb-eyebrow">O PRÓXIMO PASSO É SEU</p><h2 id="vip-title">A Pré Black começa<br />no grupo VIP.</h2></div>{groupUrl ? <a className="pb-final-photo" href={groupUrl} target="_blank" rel="noopener noreferrer" aria-label="O grupo VIP recebe primeiro: entrar no grupo VIP da Pré Black" onClick={() => trackCtaClick({ location: "pre_black_final_image", label: "O GRUPO VIP RECEBE PRIMEIRO", eventName: "CTAClick" })}><img src={finalGroupUrl} alt="O grupo VIP recebe primeiro. Pré-Black LipoVitta: até 30% OFF e condições especiais. Arte com símbolo do WhatsApp coroado sobre fundo escuro e botão visual 'Entrar agora'." width="1122" height="1402" loading="lazy" /></a> : <div className="pb-final-photo"><img src={finalGroupUrl} alt="O grupo VIP recebe primeiro. Pré-Black LipoVitta: até 30% OFF e condições especiais." width="1122" height="1402" loading="lazy" /></div>}<div className="pb-final-action"><GroupCta location="final" final /><p className="pb-final-date">{PRE_BLACK_CONFIG.dateLabel.toUpperCase()} <span> / </span> 08H · BAHIA</p></div></div></section>
    </>
  );
}

/** Fase de vendas: hero comercial com o kit real + ofertas e brindes do site. */
function LiveContent() {
  return (
    <>
      <section className="pb-hero pb-hero-live">
        <PreBlackBurst>
          <div className="pb-shell pb-hero-grid">
            <div className="pb-hero-copy">
              <p className="pb-eyebrow" data-pb-burst="copy">PRÉ BLACK LIPOVITTA <span>NO AR</span></p>
              <h1 data-pb-burst="copy">A Pré Black LipoVitta começou <span className="pb-offer-intro">com ofertas de até</span><span className="pb-discount">30<span>%<small>OFF</small></span></span></h1>
              <p className="pb-hero-description" data-pb-burst="copy">O sistema LipoVitta para cuidar do corpo, reduzir a aparência da celulite e elevar sua autoestima — com até 3x sem juros e brindes especiais. Escolha seu kit abaixo.</p>
              <div data-pb-burst="copy"><OffersCta location="hero_live" /></div>
            </div>
            <div className="pb-hero-photo pb-hero-kit" data-pb-burst="product">
              <img src={kitUrl} alt="Kit completo LipoVitta com Cápsulas, Shot Matinal e Shot Rush" width="1600" height="900" fetchPriority="high" />
            </div>
          </div>
        </PreBlackBurst>
      </section>

      <div id="ofertas" className="pb-live-offers">
        <GiftFlowProvider>
          <OfferSection />
          <GiftSelectionSection />
        </GiftFlowProvider>
      </div>

      <section id="grupo-vip" className="pb-final" aria-labelledby="vip-title"><div className="pb-shell pb-final-grid"><div className="pb-final-copy"><p className="pb-eyebrow">FIQUE POR DENTRO</p><h2 id="vip-title">O grupo VIP acompanha<br />tudo em primeira mão.</h2></div><div className="pb-final-action"><GroupCta location="final_live" final /></div></div></section>
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
        title={live ? "Pré Black LipoVitta — ofertas de até 30% OFF no ar" : "Pré Black LipoVitta — até 30% OFF"}
        description={live
          ? "A Pré Black LipoVitta começou. Ofertas de até 30% OFF, até 3x sem juros e brindes especiais. Escolha seu kit."
          : `Entre no grupo VIP da Pré Black LipoVitta. Ofertas de até 30% OFF, até 3x sem juros e brindes especiais. Dia ${PRE_BLACK_CONFIG.dateLabel}, às 08h da Bahia.`}
        canonicalUrl="https://lipovitta.site/pre-black"
      />
      <a className="pb-skip" href="#pre-black-content">Ir para o conteúdo</a>
      <header className="pb-header pb-shell">
        <a href="/" aria-label="LipoVitta — página inicial"><img src={logo} width="154" height="84" alt="LipoVitta por Clara Caldas" /></a>
        {live
          ? <Button asChild variant="ghost" className="pb-header-link"><a href="#ofertas">VER OFERTAS <ArrowDown aria-hidden="true" /></a></Button>
          : <Button asChild variant="ghost" className="pb-header-link"><a href="#grupo-vip">GRUPO VIP <ArrowUpRight aria-hidden="true" /></a></Button>}
      </header>

      <main id="pre-black-content">
        {live ? <LiveContent /> : <TeaserContent />}
      </main>
      <PageFooter />
      <div className="pb-mobile-bar">{live ? <OffersCta location="mobile_live" /> : <GroupCta location="mobile" />}</div>
    </div>
  );
}
