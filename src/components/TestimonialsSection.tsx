import { useState, useEffect, useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import desinchar from "@/assets/testimonials/desinchar.jpg";
import pesoPernas from "@/assets/testimonials/peso-pernas.jpg";
import inflamacao from "@/assets/testimonials/inflamacao.jpg";
import corpoPedindoAjuda from "@/assets/testimonials/corpo-pedindo-ajuda.jpg";
import peleMelhora from "@/assets/testimonials/pele-melhora.jpg";
import naoEraEsforco from "@/assets/testimonials/nao-era-esforco.jpg";

function useAnimatedCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated, target, duration]);

  return { count, ref };
}

const testimonials = [
  { src: desinchar, alt: "Você começa a desinchar de verdade — depoimento visual LipoVitta" },
  { src: pesoPernas, alt: "A sensação de peso nas pernas diminui — depoimento visual LipoVitta" },
  { src: inflamacao, alt: "A inflamação do corpo começa a reduzir — depoimento visual LipoVitta" },
  { src: corpoPedindoAjuda, alt: "Não era só inchaço, era seu corpo pedindo ajuda — depoimento LipoVitta" },
  { src: peleMelhora, alt: "A aparência da pele melhora — depoimento visual LipoVitta" },
  { src: naoEraEsforco, alt: "Não era falta de esforço — depoimento visual LipoVitta" },
];

export default function TestimonialsSection() {
  const { count, ref: counterRef } = useAnimatedCounter(2000);
  const sectionRef = useScrollAnimation();

  return (
    <section ref={sectionRef} className="bg-white py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-lipovitta-blue-dark text-center">
          O que nossas clientes dizem
        </h2>
        <div className="mx-auto mt-4 h-[3px] w-20 rounded-full bg-gradient-to-r from-lipovitta-blue-medium to-lipovitta-green" />
        <p className="font-display italic text-center text-lg md:text-xl mt-4 mb-12" style={{ color: "#8FAE82" }}>
          Prints reais. Resultados reais.
        </p>

        {/* Mosaico assimétrico de depoimentos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6 auto-rows-auto">
          {testimonials.map((t, i) => {
            const layouts = [
              "lg:col-span-3 lg:row-span-2 aspect-[3/4]",
              "lg:col-span-3 aspect-[4/3] rotate-[-0.4deg]",
              "lg:col-span-2 aspect-[4/5] rotate-[0.5deg]",
              "lg:col-span-2 aspect-square rotate-[-0.5deg]",
              "lg:col-span-2 aspect-[4/5] rotate-[0.4deg]",
              "lg:col-span-3 aspect-[4/3] lg:translate-y-4 rotate-[-0.3deg]",
            ];
            return (
              <img
                key={i}
                src={t.src}
                alt={t.alt}
                loading="lazy"
                className={`w-full object-cover rounded-2xl shadow-sm ${layouts[i]}`}
              />
            );
          })}
        </div>


        {/* Animated counter */}
        <div ref={counterRef} className="text-center mt-14">
          <p className="font-sans font-normal text-base md:text-lg text-lipovitta-text">
            <span className="font-sans text-3xl md:text-4xl font-semibold text-lipovitta-green">
              Mais de {count.toLocaleString("pt-BR")}
            </span>{" "}
            mulheres já usam LipoVitta na rotina.
          </p>
        </div>
      </div>
    </section>
  );
}
