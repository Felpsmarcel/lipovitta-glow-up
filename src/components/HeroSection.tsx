import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import claraVideo from "@/assets/clara-hero.mp4.asset.json";


const HeroSection = () => {
  const sectionRef = useScrollAnimation();
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

            <p className="font-quote text-lg sm:text-xl mb-8 max-w-xl mx-auto lg:mx-0 text-accent">
              "Lipedema não tem cura, mas tem controle."
            </p>

            <div id="cta" className="mb-6">
              <a
                href="#comprar"
                className="inline-block bg-gradient-brand text-white font-bold text-base sm:text-lg px-10 py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                CONHECER A ROTINA LIPOVITTA
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
                className="relative w-full overflow-hidden rounded-2xl bg-gradient-brand-soft flex items-center justify-center"
                style={{
                  aspectRatio: "4/5",
                  boxShadow: "0 20px 60px hsl(var(--primary) / 0.18)",
                }}
              >
                <div className="text-center px-6">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-brand flex items-center justify-center text-white text-2xl shadow-md">
                    📸
                  </div>
                  <p className="font-display text-base text-foreground/70 font-semibold">
                    Foto profissional da Clara
                  </p>
                  <p className="text-sm text-foreground/50 mt-1">em breve</p>
                </div>
              </div>

              {/* Selo gradiente decorativo */}
              <div className="absolute -top-3 -right-3 w-20 h-20 rounded-full bg-gradient-brand shadow-lg flex items-center justify-center text-white text-center text-[11px] font-bold leading-tight px-2">
                LIPO<br />VITTA
              </div>
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
