import { useState } from "react";
import { Check, Instagram, Play } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const checkItems = [
  "Inchaço reduzido",
  "Combate a Celulite",
  "Pernas mais leves",
  "Menos dor",
  "Pele com melhor aparência",
  "Mais disposição no dia a dia",
];

const RoutineSection = () => {
  const [iframeError, setIframeError] = useState(false);
  const sectionRef = useScrollAnimation();

  const scrollToProducts = () => {
    document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="rotina"
      ref={sectionRef}
      className="pt-14 md:pt-20 pb-8 md:pb-12 px-4"
      style={{ background: "#F5F7FA" }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Coluna esquerda — Instagram embed */}
        <div className="flex flex-col items-center" data-animate>
          <div
            className="w-full overflow-hidden rounded-2xl"
            style={{
              maxWidth: 480,
              aspectRatio: "1/1",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            }}
          >
            {!iframeError ? (
              <iframe
                src="https://www.instagram.com/p/DQcTXQrkStl/embed"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                allowTransparency={true}
                loading="lazy"
                onError={() => setIframeError(true)}
                title="Post Instagram LipoVitta"
                style={{ border: "none", minHeight: 480 }}
              />

            ) : (
              <a
                href="https://www.instagram.com/p/DQcTXQrkStl/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center w-full h-full gap-4"
                style={{ background: "#E8ECF1", minHeight: 480 }}
              >
                <Instagram size={48} style={{ color: "#4667B4" }} />
                <span
                  className="font-semibold text-sm"
                  style={{ color: "#4667B4" }}
                >
                  Ver no Instagram
                </span>
              </a>
            )}
          </div>
          <p className="mt-3 text-sm" style={{ color: "#999" }}>
            @lipo.vitta no Instagram
          </p>
        </div>

        {/* Coluna direita — Texto emocional */}
        <div className="flex flex-col gap-5" data-animate>
          <h2
            className="font-display text-3xl md:text-4xl font-medium leading-snug"
            style={{ color: "#4667B4" }}
          >
            Não é falta de força de vontade.
          </h2>

          <p className="font-sans font-normal text-base" style={{ color: "#555", lineHeight: 1.8 }}>
            Acordar inchada. Pernas pesadas no fim do dia. Sentir que o corpo
            não responde — mesmo fazendo tudo certo. Eu sei o que é isso.
            Passei anos achando que era culpa minha.
          </p>

          <p className="font-sans font-normal text-base" style={{ color: "#555", lineHeight: 1.8 }}>
            Quando descobri que era lipedema, entendi que o problema nunca foi
            esforço. Foi falta do suporte certo para o que o meu corpo
            precisava.
          </p>

          <p className="font-sans font-normal text-base" style={{ color: "#555", lineHeight: 1.8 }}>
            O LipoVitta é a rotina que eu mesma uso. Não criei para vender
            suplemento. Criei porque precisava — e porque sei que tem muita
            mulher passando pelo mesmo.
          </p>

          <p
            className="font-display italic text-lg"
            style={{ color: "#8FAE82" }}
          >
            — Clara Caldas
          </p>

          <ul className="flex flex-col gap-3">
            {checkItems.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <Check size={20} style={{ color: "#9BAE52" }} />
                <span className="font-sans font-normal text-base" style={{ color: "#333" }}>{item}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={scrollToProducts}
            className="mt-2 w-full md:w-auto px-8 py-4 text-white font-bold rounded-full transition-colors text-sm tracking-wide cursor-pointer"
            style={{ background: "#9BAE52" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#B8C77A")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#9BAE52")
            }
          >
            VER A CÁPSULA PRINCIPAL
          </button>
        </div>
      </div>
    </section>
  );
};

export default RoutineSection;
