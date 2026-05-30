import heroVideo from "@/assets/hero-video.mp4";

const HeroSection = () => {

  return (
    <section
      className="relative overflow-hidden pt-20 md:pt-28 pb-10 md:pb-16"
      style={{
        background: "hsl(214 59% 26%)",
      }}
    >
      {/* Subtle geometric pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-10">
          {/* Text content */}
          <div className="lg:basis-[58%] text-center lg:text-left">
            <span
              className="inline-block text-xs font-semibold mb-4 tracking-[2px] uppercase"
              style={{ color: "#7BA33E" }}
            >
              Por Clara Caldas
            </span>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-medium leading-snug md:leading-tight text-white mb-4 md:mb-6">
              Lipedema não tem cura. Mas tem controle — e eu aprendi isso na pele.
            </h1>

            <p className="font-sans font-normal text-base sm:text-lg text-white/90 mb-4 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Eu sou Clara Caldas e convivo com o lipedema. Ele não tem cura, mas tem controle. Criei o sistema LipoVitta porque sei na pele o que é acordar inchada, com as pernas pesadas e sem energia. Hoje minha rotina mudou — e a sua também pode mudar.
            </p>

            <p className="font-display italic text-lg sm:text-xl mb-8 max-w-xl mx-auto lg:mx-0" style={{ color: "#A8D45A" }}>
              "Lipedema não tem cura, mas tem controle."
            </p>

            <div id="cta" className="mb-6">
              <a
                href="#comprar"
                className="animate-pulse-cta inline-block font-bold text-base sm:text-lg px-8 sm:px-10 py-4 rounded-full shadow-lg transition-colors text-center text-white hover:opacity-90 lg:-translate-x-[2px]"
                style={{ backgroundColor: "#7BA33E" }}
              >
                CONHECER A ROTINA LIPOVITTA
              </a>
            </div>

            {/* Micro badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
              {["100% Natural", "Sem Glúten", "+2.000 mulheres"].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-white/95 font-medium bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5"
                >
                  ✅ {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Video column */}
          <div className="lg:basis-[42%] w-full flex flex-col items-center lg:items-end lg:-translate-y-3">
            <div
              className="w-full max-w-[340px] lg:max-w-[360px] overflow-hidden -mr-6 sm:mr-0 lg:rotate-[1deg]"
              style={{
                aspectRatio: "9/16",
                maxHeight: "600px",
                borderRadius: "16px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
            >
              <video
                src={heroVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                title="Vídeo da Clara Caldas"
              />
            </div>
            <p className="text-sm mt-3 lg:mr-2" style={{ color: "#999" }}>
              📍{" "}
              <a
                href="https://www.instagram.com/clarinhacbr/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: "#999" }}
              >
                @clarinhacbr
              </a>{" "}
              no Instagram
            </p>
          </div>
        </div>
      </div>

      {/* Linha decorativa orgânica — verde-sálvia */}
      <svg
        aria-hidden="true"
        className="hidden md:block pointer-events-none absolute -bottom-6 left-0 w-full h-12"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C240,10 480,55 720,30 C960,5 1200,50 1440,25"
          fill="none"
          stroke="#8FAE82"
          strokeOpacity="0.3"
          strokeWidth="1.5"
        />
      </svg>

    </section>
  );
};

export default HeroSection;
