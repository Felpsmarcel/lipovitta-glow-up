const HeroSection = () => (
  <section
    className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24"
    style={{
      background: "linear-gradient(180deg, hsl(214 59% 26%) 0%, hsl(214 59% 26% / 0.85) 60%, hsl(216 33% 97%) 100%)",
    }}
  >
    {/* Organic overlay pattern */}
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                          radial-gradient(circle at 80% 20%, white 1px, transparent 1px),
                          radial-gradient(circle at 50% 80%, white 1px, transparent 1px)`,
        backgroundSize: "60px 60px, 80px 80px, 70px 70px",
      }}
    />

    <div className="container mx-auto px-4 relative z-10">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Text content */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-tight text-white mb-4 md:mb-6">
            Acabe com o inchaço e a celulite com a rotina que transforma de verdade!
          </h1>
          <p className="font-sans text-base sm:text-lg text-white/90 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Lipovitta + Shot Matinal: a rotina que reduz o inchaço, melhora a circulação e suaviza a celulite com resultados que você sente e vê.
          </p>

          <div id="cta" className="mb-6">
            <a
              href="#comprar"
              className="animate-pulse-cta inline-block bg-accent text-accent-foreground font-bold text-base sm:text-lg px-8 sm:px-10 py-4 rounded-full shadow-lg hover:bg-accent-light transition-colors w-full sm:w-auto text-center"
            >
              QUERO MINHA TRANSFORMAÇÃO
            </a>
          </div>

          {/* Micro badges */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
            {["100% Natural", "Sem Glúten", "Resultados em semanas"].map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-white/95 font-medium bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5"
              >
                ✅ {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Product image placeholder */}
        <div className="flex-shrink-0">
          <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-[400px] lg:h-[400px] rounded-2xl border-2 border-secondary bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white/50 font-sans text-sm text-center px-4">
              Imagem do Produto
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
