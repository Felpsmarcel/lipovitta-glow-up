import { useState } from "react";
import { Check, Instagram, Play } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const checkItems = [
  "O inchaço reduz",
  "As pernas ficam mais leves",
  "A dor passa",
  "A pele melhora",
  "A energia volta",
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
      className="py-12 md:py-20 px-4"
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
                src="https://www.instagram.com/p/DWRSgEfEYW8/embed"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                allowTransparency={true}
                onError={() => setIframeError(true)}
                title="Post Instagram LipoVitta"
                style={{ border: "none", minHeight: 480 }}
              />
            ) : (
              <a
                href="https://www.instagram.com/p/DWRSgEfEYW8/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center w-full h-full gap-4"
                style={{ background: "#E8ECF1", minHeight: 480 }}
              >
                <Instagram size={48} style={{ color: "#2E5EA6" }} />
                <span
                  className="font-semibold text-sm"
                  style={{ color: "#2E5EA6" }}
                >
                  Ver no Instagram
                </span>
              </a>
            )}
          </div>
          <p className="mt-3 text-sm" style={{ color: "#999" }}>
            📸 @lipo.vitta no Instagram
          </p>
        </div>

        {/* Coluna direita — Texto emocional */}
        <div className="flex flex-col gap-5" data-animate>
          <h2
            className="text-2xl md:text-3xl font-bold leading-snug"
            style={{ color: "#1B3A6B", fontFamily: "'Playfair Display', serif" }}
          >
            Você não precisa de mais força de vontade. Precisa da estratégia
            certa.
          </h2>

          <p style={{ color: "#555", lineHeight: 1.8 }}>
            Sabe aquela sensação de acordar já cansada, o corpo inchado, as
            pernas pesadas no fim do dia... e mesmo assim achar que a culpa é
            sua?
          </p>

          <p
            className="text-xl md:text-2xl font-bold"
            style={{ color: "#1B3A6B" }}
          >
            Não é.
          </p>

          <p style={{ color: "#555", lineHeight: 1.8 }}>
            Às vezes o corpo não precisa de mais esforço. Ele precisa do suporte
            certo.
          </p>

          <p style={{ color: "#555", lineHeight: 1.8 }}>
            Quando você começa a dar pra ele o que falta, as coisas mudam de um
            jeito que você sente:
          </p>

          <ul className="flex flex-col gap-3">
            {checkItems.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <Check size={20} style={{ color: "#7BA33E" }} />
                <span style={{ color: "#333" }}>{item}</span>
              </li>
            ))}
          </ul>

          {/* Box destaque */}
          <div
            className="rounded-lg p-5"
            style={{
              borderLeft: "4px solid #7BA33E",
              background: "rgba(123,163,62,0.05)",
            }}
          >
            <p className="font-bold" style={{ color: "#1B3A6B" }}>
              O combo Cápsulas + Shot Matinal começa a transformar seu corpo de
              dentro pra fora, todo dia.
            </p>
          </div>

          <button
            onClick={scrollToProducts}
            className="mt-2 w-full md:w-auto px-8 py-4 text-white font-bold rounded-full transition-colors text-sm tracking-wide cursor-pointer"
            style={{ background: "#7BA33E" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#A8D45A")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#7BA33E")
            }
          >
            QUERO CONHECER OS PRODUTOS
          </button>
        </div>
      </div>
    </section>
  );
};

export default RoutineSection;
