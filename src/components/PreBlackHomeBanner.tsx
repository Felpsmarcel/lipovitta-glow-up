import { ArrowDown } from "lucide-react";
import { usePreBlackPhase } from "@/hooks/usePreBlackPhase";
import { PRE_BLACK_CONFIG } from "@/config/preBlack";
import { trackCtaClick } from "@/lib/tracking";

/**
 * Faixa Pré-Black na home. Antes da abertura: aponta para a página de
 * captação. Após a abertura (18/10, 08h Bahia): a home assume o tom
 * comercial da campanha e a faixa leva direto às ofertas (#precos).
 * Relógio reativo: a virada acontece mesmo com a página já aberta.
 */
export default function PreBlackHomeBanner() {
  const phase = usePreBlackPhase();
  const live = phase === "live";
  const href = live ? "#precos" : "/pre-black";
  const label = live ? "VER OFERTAS" : "ENTRAR NO GRUPO VIP";
  return (
    <section className="pb-home-banner" aria-label="Pré Black LipoVitta">
      <div className="pb-home-banner-inner">
        <p className="pb-home-banner-eyebrow">
          PRÉ BLACK LIPOVITTA <span>{live ? "NO AR" : PRE_BLACK_CONFIG.eyebrowDateLabel}</span>
        </p>
        <p className="pb-home-banner-title">
          {live ? "A Pré Black começou: ofertas de até 30% OFF." : "Ofertas de até 30% OFF, brindes especiais e até 3x sem juros."}
        </p>
        <a
          className="pb-home-banner-cta"
          href={href}
          onClick={() => trackCtaClick({ location: live ? "home_pre_black_live" : "home_pre_black_teaser", label, eventName: "CTAClick" })}
        >
          {label} <ArrowDown aria-hidden="true" size={14} />
        </a>
      </div>
    </section>
  );
}
