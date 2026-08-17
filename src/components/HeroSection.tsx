import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import claraVideo from "@/assets/clara-hero.mp4.asset.json";
import { trackCtaClick } from "@/lib/tracking";
import { usePromo } from "@/context/PromoContext";
import { Cake, Gift, Sparkles, ArrowDown } from "lucide-react";

const HeroSection = () => {
  const sectionRef = useScrollAnimation();
  const { isPromoActive } = usePromo();
  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-20 md:pt-28 pb-16 md:pb-24"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--primary) / 0.07) 0%, #ffffff 45%, hsl(var(--accent) / 0.08) 100%)",
      }}
    >
      {/* Swoosh decorativo da marca */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full -z-0"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="brand-swoosh" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4667B4" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#9BAE52" stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id="brand-swoosh-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4667B4" />
            <stop offset="100%" stopColor="#9BAE52" />
          </linearGradient>
        </defs>
        <path
          d="M-100,520 C300,360 700,700 1100,440 C1300,310 1500,520 1600,420 L1600,820 L-100,820 Z"
          fill="url(#brand-swoosh)"
        />
        <path
          d="M-50,560 C320,400 720,720 1120,470 C1320,340 1480,540 1560,460"
          fill="none"
          stroke="url(#brand-swoosh-line)"
          strokeOpacity="0.55"
          strokeWidth="2"
        />
      </svg>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-12">
          {/* Coluna texto */}
          <div className="lg:basis-[58%] text-center lg:text-left">
            <span className="inline-block text-xs font-semibold mb-4 tracking-[2px] uppercase text-primary">
              Por Clara Caldas
            </span>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[3.75rem] font-extrabold leading-[1.05] text-foreground mb-5 md:mb-6">
              Lipedema não tem cura. Mas tem{" "}
              <span className="text-gradient-brand">controle</span> — e eu aprendi isso na pele.
            </h1>

            <p className="font-sans font-normal text-base sm:text-lg text-foreground/80 mb-4 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Eu sou Clara Caldas e também convivo com lipedema. Sei o que é acordar inchada, com as pernas pesadas e sem energia. Criei a rotina LipoVitta para o cuidado diário que eu mesma precisava. Hoje minha rotina é outra — e a sua também pode mudar aos poucos.
            </p>

            <p className="font-quote text-lg sm:text-xl mb-6 max-w-xl mx-auto lg:mx-0 text-accent">
              "Lipedema não tem cura, mas tem controle."
            </p>

            {isPromoActive && (
              <div className="mb-6 max-w-xl mx-auto lg:mx-0">
                <div className="relative overflow-hidden rounded-2xl border border-[#E8ECF1] bg-white p-4 sm:p-5 shadow-sm">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4667B4] to-[#9BAE52]" />
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#4667B4] to-[#9BAE52] flex items-center justify-center text-white">
                      <Cake className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-semibold text-sm sm:text-base text-[#4667B4] leading-snug mb-1">
                        Aniversário LipoVitta em agosto
                      </p>
                      <p className="font-sans text-xs sm:text-sm text-[#555] leading-relaxed mb-3">
                        Desconto automático de até{" "}
                        <span className="font-bold text-[#E63946]">40% OFF</span>{" "}
                        + PAC grátis acima de R$400. Sem cupom.
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {[
                          { qty: "1", off: "20%" },
                          { qty: "2", off: "30%" },
                          { qty: "3+", off: "40%" },
                        ].map((tier) => (
                          <span
                            key={tier.qty}
                            className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#4667B4] bg-[#F5F7FA] border border-[#E8ECF1] px-2 py-1 rounded-full"
                          >
                            <Sparkles className="w-3 h-3 text-[#9BAE52]" />
                            {tier.qty} prod. = {tier.off}
                          </span>
                        ))}
                      </div>
                      <a
                        href="#precos"
                        onClick={(e) => {
                          e.preventDefault();
                          trackCtaClick({ location: "hero_promo", label: "Ver ofertas de aniversário" });
                          document.getElementById("precos")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#9BAE52] hover:text-[#8A9D45] transition-colors"
                      >
                        Ver ofertas de aniversário
                        <ArrowDown className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div id="cta" className="mb-4">
              <a
                href="#comprar"
                onClick={() => trackCtaClick({ location: "hero", label: "CONHECER A ROTINA LIPOVITTA" })}
                className="inline-block bg-gradient-brand text-white font-bold text-base sm:text-lg px-10 py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                CONHECER A ROTINA LIPOVITTA
              </a>
            </div>

            <div className="mb-6">
              <a
                href="#card-kit-rush-top"
                onClick={(e) => {
                  e.preventDefault();
                  trackCtaClick({ location: "hero", label: "Kit Shot Rush + Cápsulas" });
                  document.getElementById("card-kit-rush-top")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#4667B4] bg-white/80 backdrop-blur border border-[#D9E2F1] hover:border-[#9BAE52] hover:text-[#8A9D45] px-4 py-2 rounded-full transition-colors shadow-sm"
              >
                <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-white bg-[#E63946] px-2 py-0.5 rounded-full">Novo</span>
                Kit Shot Rush + Cápsulas
                <span aria-hidden="true">→</span>
              </a>
            </div>


            <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
              {["100% Natural", "Sem Glúten", "+2.000 mulheres"].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-foreground/80 font-medium bg-muted rounded-full px-3 py-1.5"
                >
                  ✅ {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Coluna foto (placeholder) */}
          <div className="lg:basis-[42%] w-full flex flex-col items-center lg:items-end">
            <div className="relative w-full max-w-[360px]">
              <div
                className="relative w-full overflow-hidden rounded-2xl bg-black"
                style={{
                  aspectRatio: "4/5",
                  boxShadow: "0 20px 60px hsl(var(--primary) / 0.18)",
                }}
              >
                <video
                  src={claraVideo.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Clara Caldas — criadora da rotina LipoVitta"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Selo gradiente decorativo */}
              <div className="absolute -top-3 -right-3 w-20 h-20 rounded-full bg-gradient-brand shadow-lg flex items-center justify-center text-white text-center text-[11px] font-bold leading-tight px-2">
                LIPO<br />VITTA
              </div>

              {isPromoActive && (
                <div className="absolute -bottom-3 -left-3 sm:-left-4 bg-white rounded-xl border border-[#E8ECF1] shadow-md px-3 py-2 flex items-center gap-2 max-w-[180px]">
                  <Gift className="w-4 h-4 text-[#E63946] shrink-0" />
                  <span className="text-[10px] font-bold text-[#4667B4] leading-tight">
                    Aniversário · Até 40% OFF
                  </span>
                </div>
              )}
            </div>

            <p className="text-sm mt-4 text-foreground/60">
              📍{" "}
              <a
                href="https://www.instagram.com/clarinhacbr/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                @clarinhacbr
              </a>{" "}
              no Instagram
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
