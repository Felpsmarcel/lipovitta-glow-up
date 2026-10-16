import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import PreBlackBurst from "@/components/pre-black/PreBlackBurst";
import { PRE_BLACK_CONFIG } from "@/config/preBlack";
import { assetUrl } from "@/lib/assetUrl";
import { trackCtaClick } from "@/lib/tracking";
import kit from "@/assets/kit-completo-lipovitta.png.asset.json";

// Resolve o asset imutável na origem oficial, inclusive no QA local.
const kitUrl = assetUrl(kit.url);

/**
 * Hero comercial da Pré-Black (fase "live"), compartilhado entre /pre-black
 * e a home após a abertura. Não inclui providers nem a seção de ofertas —
 * cada rota renderiza a sua, evitando contextos aninhados e IDs duplicados.
 */
const PreBlackLiveHero = ({ offersHref, trackLocation }: { offersHref: string; trackLocation: string }) => {
  const label = "VER OFERTAS";
  return (
    <section className="pb-hero pb-hero-live">
      <PreBlackBurst storageKey="pb-burst-live-v1">
        <div className="pb-shell pb-hero-grid">
          <div className="pb-hero-copy">
            <p className="pb-eyebrow" data-pb-burst="copy">
              PRÉ BLACK LIPOVITTA <span>NO AR</span>
            </p>
            <h1 data-pb-burst="copy">A Pré Black LipoVitta começou</h1>
            <p className="pb-hero-description" data-pb-burst="copy">
              Escolha seu kit e aproveite as condições disponíveis — com até 3x sem juros e brindes especiais.
            </p>
            <div data-pb-burst="copy">
              <div className="pb-cta-block">
                <Button asChild className="pb-cta">
                  <a
                    href={offersHref}
                    onClick={() => trackCtaClick({ location: trackLocation, label, eventName: "CTAClick" })}
                  >
                    <span>{label}</span>
                    <ArrowDown aria-hidden="true" />
                  </a>
                </Button>
                <p className="pb-cta-note">Ofertas da Pré Black logo abaixo, com os kits e brindes do site.</p>
              </div>
            </div>
          </div>
          <div className="pb-hero-photo pb-hero-kit" data-pb-burst="product">
            <img
              src={kitUrl}
              alt="Kit completo LipoVitta com Cápsulas, Shot Matinal e Shot Rush"
              width="1600"
              height="900"
              fetchPriority="high"
            />
          </div>
        </div>
      </PreBlackBurst>
    </section>
  );
};

export default PreBlackLiveHero;
