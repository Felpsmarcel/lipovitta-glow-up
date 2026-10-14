import { ArrowDown, ArrowUpRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import PreBlackCountdown from "@/components/pre-black/PreBlackCountdown";
import { PRE_BLACK_CONFIG, confirmedGroupUrl } from "@/config/preBlack";
import { usePreBlackMotion } from "@/hooks/usePreBlackMotion";
import { trackCtaClick } from "@/lib/tracking";
import logo from "@/assets/logo-lipovitta.png";
import kit from "@/assets/kit-completo-lipovitta.png.asset.json";
import tangerina from "@/assets/shot-matinal-tangerina.jpg";
import limao from "@/assets/shot-matinal-limao.jpg";
import abacaxi from "@/assets/shot-matinal-abacaxi.jpg";
import mixer from "@/assets/gifts/brinde-mixer.png";
import raspador from "@/assets/gifts/brinde-raspador.png";
import portaCapsulas from "@/assets/gifts/brinde-portacapsulas.png";

const groupUrl = confirmedGroupUrl(PRE_BLACK_CONFIG.groupUrl);

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

export default function PreBlack() {
  const root = usePreBlackMotion();
  return (
    <div ref={root} className="pre-black">
      <SEOHead title="Pré Black LipoVitta — até 30% OFF" description="Entre no grupo VIP da Pré Black LipoVitta. Ofertas de até 30% OFF, até 3x sem juros e brindes especiais. Dia 21 de outubro, às 09h da Bahia." canonicalUrl="https://lipovitta.site/pre-black" />
      <a className="pb-skip" href="#pre-black-content">Ir para o conteúdo</a>
      <header className="pb-header pb-shell">
        <a href="/" aria-label="LipoVitta — página inicial"><img src={logo} width="154" height="84" alt="LipoVitta por Clara Caldas" /></a>
        <Button asChild variant="ghost" className="pb-header-link"><a href="#grupo-vip">GRUPO VIP <ArrowUpRight aria-hidden="true" /></a></Button>
      </header>

      <main id="pre-black-content">
        <section className="pb-hero">
          <div className="pb-shell pb-hero-grid">
            <div className="pb-hero-copy">
              <p className="pb-eyebrow" data-pb-motion="hero" data-pb-order="0">PRÉ BLACK LIPOVITTA <span>21.10 / 09H</span></p>
              <h1 data-pb-motion="hero" data-pb-order="1">A maior pré black da história da LipoVitta <span className="pb-offer-intro">com ofertas de até</span><span className="pb-discount">30<span>%<small>OFF</small></span></span></h1>
              <p className="pb-hero-description" data-pb-motion="hero" data-pb-order="2">Na nossa pré black, você vai conhecer o sistema LipoVitta, para cuidar do corpo, reduzir a aparência da celulite e elevar sua autoestima, com até 3x sem juros, brindes especiais e ofertas exclusivas.</p>
              <div data-pb-motion="hero" data-pb-order="3"><GroupCta location="hero" /></div>
            </div>
            <div className="pb-hero-photo" data-pb-motion="photo">
              <div className="pb-photo-caption"><span>SEU AUTOCUIDADO.<br />UM NOVO MOMENTO.</span><span>EDIÇÃO<br />PRÉ BLACK / 2026</span></div>
              <img src={kit.url} alt="Cápsulas LipoVitta, Shot Matinal em Limão, Tangerina e Abacaxi e Shot Rush" width="1600" height="900" fetchPriority="high" />
              <div className="pb-photo-footer"><span>Cápsulas · Shot Matinal · Shot Rush</span><ArrowDown aria-hidden="true" size={20} /></div>
            </div>
          </div>
        </section>

        <section className="pb-countdown-section" aria-labelledby="countdown-title">
          <div className="pb-shell pb-countdown-grid" data-pb-motion="scroll">
            <div><p className="pb-eyebrow">RESERVE ESSE MOMENTO</p><h2 id="countdown-title">Está chegando a<br />Pré Black LipoVitta.</h2><p className="pb-date">21 de outubro <span>•</span> 09 horas</p></div>
            <div><PreBlackCountdown /><p className="pb-timezone">Horário da Bahia</p></div>
          </div>
          <p className="pb-shell pb-reveal-note">As ofertas e condições especiais serão reveladas no dia <strong>21/10, às 09h</strong>, exclusivamente para quem estiver no grupo.</p>
        </section>

        <section className="pb-products pb-shell" aria-labelledby="products-title">
          <div className="pb-section-heading" data-pb-motion="scroll"><p className="pb-eyebrow">O SEU RITUAL LIPOVITTA</p><h2 id="products-title">Vem aí uma oportunidade imperdível para você,<br className="hidden md:block" /> algo jamais visto na história.</h2><p>Shot Matinal, Shot Rush, LipoVitta cápsulas e acessórios exclusivos para sua rotina, com mixer, raspador de língua e porta-cápsulas para elevar seu autocuidado.</p></div>
          <figure className="pb-kit" data-pb-motion="scroll"><img src={kit.url} alt="Linha LipoVitta com Cápsulas, três sabores de Shot Matinal e Shot Rush" loading="lazy" width="1600" height="900" /><figcaption><span>UM SISTEMA. A SUA ROTINA.</span><span>LipoVitta por Clara Caldas</span></figcaption></figure>
          <div className="pb-flavors" data-pb-motion="scroll"><div><p className="pb-eyebrow">SHOT MATINAL</p><h3>Qual é o seu sabor?</h3></div><div className="pb-flavor-list">{[[tangerina, "Tangerina"], [limao, "Limão"], [abacaxi, "Abacaxi"]].map(([src, name]) => <figure key={name}><img src={src} alt={`Shot Matinal ${name}`} width="180" height="220" loading="lazy" /><figcaption>{name}</figcaption></figure>)}</div></div>
        </section>

        <section className="pb-gifts-section" aria-labelledby="gifts-title"><div className="pb-shell pb-gifts-grid" data-pb-motion="scroll"><div><p className="pb-eyebrow">OS DETALHES FAZEM PARTE</p><h2 id="gifts-title">Mais carinho<br />com a sua rotina.</h2><p>Brindes especiais e acessórios exclusivos para elevar seu autocuidado.</p></div><div className="pb-gift-list">{[[mixer, "Mixer"], [raspador, "Raspador de língua"], [portaCapsulas, "Porta-cápsulas"]].map(([src, name]) => <figure key={name}><img src={src} alt={name} width="300" height="360" loading="lazy" /><figcaption>{name}</figcaption></figure>)}</div></div></section>

        <section id="grupo-vip" className="pb-final" aria-labelledby="vip-title"><div className="pb-shell" data-pb-motion="scroll"><p className="pb-eyebrow">O PRÓXIMO PASSO É SEU</p><h2 id="vip-title">A Pré Black começa<br />no grupo VIP.</h2><p>E seja VIP: tenha acesso antecipado às ofertas, condições especiais e acompanhe tudo.</p><GroupCta location="final" final /><p className="pb-final-date">21 DE OUTUBRO <span> / </span> 09H · BAHIA</p></div></section>
      </main>
      <footer className="pb-footer pb-shell"><a href="/" aria-label="LipoVitta — página inicial"><img src={logo} alt="LipoVitta" width="116" height="63" loading="lazy" /></a><p>© 2026 LipoVitta. Todos os direitos reservados.</p><a href="#pre-black-content">Voltar ao início ↑</a></footer>
      <div className="pb-mobile-bar"><GroupCta location="mobile" /></div>
    </div>
  );
}