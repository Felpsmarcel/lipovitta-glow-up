import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { trackCtaClick } from "@/lib/tracking";

interface CTABannerProps {
  /** Texto do botão. Varie entre as ocorrências para não repetir o mesmo CTA. */
  label?: string;
  /** Linha curta acima do botão, opcional. */
  eyebrow?: string;
  /** Identificação do banner para o rastreamento (ex.: "banner_meio"). */
  location?: string;
}

const CTABanner = ({ label = "ESCOLHER MEU KIT", eyebrow, location = "banner" }: CTABannerProps) => {
  const ref = useScrollAnimation();
  return (
    <div ref={ref} className="py-10 md:py-14 px-4 text-center bg-gradient-brand-soft">
      {eyebrow && (
        <p data-animate className="font-sans text-sm md:text-base text-muted-foreground mb-4">
          {eyebrow}
        </p>
      )}
      <a
        data-animate
        href="#precos"
        onClick={(e) => {
          e.preventDefault();
          trackCtaClick({ location, label });
          document.getElementById("precos")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="inline-block text-white font-bold text-base md:text-lg px-10 py-4 rounded-full shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl animate-pulse-cta bg-gradient-brand"
      >
        {label}
      </a>
    </div>
  );
};

export default CTABanner;
