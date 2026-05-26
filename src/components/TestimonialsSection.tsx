import { useState, useEffect, useRef } from "react";

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

export default function TestimonialsSection() {
  const { count, ref: counterRef } = useAnimatedCounter(2000);

  // Placeholder grid: ajuste entre 3 e 9 slots conforme necessário.
  // Quando adicionar os prints reais, substitua o array abaixo pelas imagens
  // e remova o bloco "Em breve: depoimentos reais das nossas clientes.".
  const placeholderSlots = Array.from({ length: 6 });

  return (
    <section className="bg-white py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-2xl md:text-4xl font-heading font-bold text-lipovitta-blue-dark text-center">
          O que nossas clientes dizem
        </h2>
        <div className="mx-auto mt-4 h-[3px] w-20 rounded-full bg-gradient-to-r from-lipovitta-blue-medium to-lipovitta-green" />
        <p className="text-center text-lg md:text-xl text-lipovitta-text mt-4 mb-12">
          Prints reais. Resultados reais.
        </p>

        {/* Placeholder grid para prints de WhatsApp (vertical, estilo celular) */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {placeholderSlots.map((_, i) => (
              <div
                key={i}
                className="aspect-[9/16] rounded-2xl border border-lipovitta-gray bg-lipovitta-ice/40"
                aria-hidden="true"
              />
            ))}
          </div>

          {/* Texto temporário - remover quando adicionar os prints reais */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
            <p className="text-center text-base md:text-lg font-medium text-lipovitta-blue-dark bg-white/90 backdrop-blur-sm px-6 py-4 rounded-xl shadow-sm">
              Em breve: depoimentos reais das nossas clientes.
            </p>
          </div>
        </div>

        {/* Animated counter */}
        <div ref={counterRef} className="text-center mt-14">
          <p className="text-lg md:text-xl text-lipovitta-text">
            <span className="text-3xl md:text-4xl font-bold text-lipovitta-green">
              Mais de {count.toLocaleString("pt-BR")}
            </span>{" "}
            mulheres já usam LipoVitta na rotina.
          </p>
        </div>
      </div>
    </section>
  );
}
