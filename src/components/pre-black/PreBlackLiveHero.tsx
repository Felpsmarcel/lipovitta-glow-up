import PreBlackBurst from "@/components/pre-black/PreBlackBurst";
import { PRE_BLACK_CONFIG } from "@/config/preBlack";
import { preBlackAssets } from "@/config/preBlackAssets";
import { cn } from "@/lib/utils";

/**
 * Hero comercial da Pré-Black (fase "live"), compartilhado entre /pre-black
 * e a home após a abertura. Não inclui providers nem a seção de ofertas —
 * cada rota renderiza a sua, evitando contextos aninhados e IDs duplicados.
 */
const PreBlackLiveHero = ({ offersHref }: { offersHref: string }) => (
  <section className="pb-live-hero">
    <PreBlackBurst storageKey="pb-burst-live-v1" />
    <div className="pb-live-inner">
      <p className="pb-live-eyebrow pb-live-reveal pb-live-reveal-1">
        {PRE_BLACK_CONFIG.eyebrow} · COMEÇOU
      </p>
      <h1 className="pb-live-title pb-live-reveal pb-live-reveal-2">
        A Pré Black LipoVitta <em>começou</em>
      </h1>
      <p className="pb-live-sub pb-live-reveal pb-live-reveal-3">
        Escolha seu kit e aproveite as condições disponíveis.
      </p>
      <div className="pb-live-actions pb-live-reveal pb-live-reveal-4">
        <a href={offersHref} className={cn("pb-cta", "pb-cta-live")}>
          VER OFERTAS
        </a>
      </div>
      <p className="pb-live-note pb-live-reveal pb-live-reveal-5">
        Kits com 10% OFF, brinde exclusivo e frete calculado no checkout.
      </p>
    </div>
    <div className="pb-live-visual pb-live-reveal pb-live-reveal-3">
      <img
        src={preBlackAssets.kitCompleto}
        alt={`Kit Completo LipoVitta — Pré Black ${PRE_BLACK_CONFIG.shortDateLabel}`}
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
    </div>
  </section>
);

export default PreBlackLiveHero;
