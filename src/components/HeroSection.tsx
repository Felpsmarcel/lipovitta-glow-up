import heroVideo from "@/assets/hero-video.mp4";

const HeroSection = () => {

  return (
    <section
      className="relative overflow-hidden pt-16 pb-16 md:pt-16 md:pb-24"
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
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-left">
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
                className="animate-pulse-cta inline-block font-bold text-base sm:text-lg px-8 sm:px-10 py-4 rounded-full shadow-lg transition-colors w-full sm:w-auto text-center text-white hover:opacity-90"
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
          <div className="flex-shrink-0 w-full lg:w-auto flex flex-col items-center">
            <div
              className="w-full max-w-[326px] max-h-[500px] lg:max-h-none overflow-hidden"
              style={{
                aspectRatio: "9/16",
                maxHeight: "580px",
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
            <p className="text-sm mt-3" style={{ color: "#999" }}>
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
    </section>
  );
};

export default HeroSection;
