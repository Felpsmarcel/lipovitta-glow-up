import { useState, useEffect, useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import desinchar from "@/assets/testimonials/desinchar.jpg?w=480;960&format=avif;webp;jpg&as=picture";
import pesoPernas from "@/assets/testimonials/peso-pernas.jpg?w=480;960&format=avif;webp;jpg&as=picture";
import inflamacaoAsset from "@/assets/testimonials/inflamacao.png.asset.json";
const inflamacao = inflamacaoAsset.url;
import corpoPedindoAjuda from "@/assets/testimonials/corpo-pedindo-ajuda.jpg?w=480;960&format=avif;webp;jpg&as=picture";
import peleMelhora from "@/assets/testimonials/pele-melhora.jpg?w=480;960&format=avif;webp;jpg&as=picture";
import naoEraEsforco from "@/assets/testimonials/nao-era-esforco.jpg?w=480;960&format=avif;webp;jpg&as=picture";


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

type TestimonialItem =
  | { kind: "picture"; picture: typeof desinchar; alt: string }
  | { kind: "url"; url: string; alt: string };

const testimonials: TestimonialItem[] = [
  { kind: "picture", picture: desinchar, alt: "Você começa a desinchar de verdade — depoimento visual LipoVitta" },
  { kind: "picture", picture: pesoPernas, alt: "A sensação de peso nas pernas diminui — depoimento visual LipoVitta" },
  { kind: "url", url: inflamacao, alt: "A inflamação do corpo começa a reduzir — depoimento visual LipoVitta" },
  { kind: "picture", picture: corpoPedindoAjuda, alt: "Não era só inchaço, era seu corpo pedindo ajuda — depoimento LipoVitta" },
  { kind: "picture", picture: peleMelhora, alt: "A aparência da pele melhora — depoimento visual LipoVitta" },
  { kind: "picture", picture: naoEraEsforco, alt: "Não era falta de esforço — depoimento visual LipoVitta" },
];

export default function TestimonialsSection() {
  const { count, ref: counterRef } = useAnimatedCounter(2000);
  const sectionRef = useScrollAnimation();

  return (
    <section ref={sectionRef} className="bg-white py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 data-animate className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-lipovitta-blue-dark text-center">
          O que nossas clientes dizem
        </h2>
        <div className="mx-auto mt-4 h-[3px] w-20 rounded-full bg-gradient-to-r from-lipovitta-blue-medium to-lipovitta-green" />
        <p data-animate className="font-display italic text-center text-lg md:text-xl mt-4 mb-10" style={{ color: "#8FAE82" }}>
          Prints reais. Resultados reais.
        </p>

        {/* Mosaico assimétrico de depoimentos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4 auto-rows-auto">
          {testimonials.map((t, i) => {
            const layouts = [
              "lg:col-span-3 lg:row-span-2 aspect-[3/4]",
              "lg:col-span-3 aspect-[4/3] rotate-[-0.4deg]",
              "lg:col-span-2 aspect-[4/5] rotate-[0.5deg]",
              "lg:col-span-2 aspect-square rotate-[-0.5deg]",
              "lg:col-span-2 aspect-[4/5] rotate-[0.4deg]",
              "lg:col-span-3 aspect-[4/3] lg:translate-y-4 rotate-[-0.3deg]",
            ];
            const className = `w-full h-full object-cover rounded-2xl shadow-sm`;
            const wrapperClass = layouts[i];
            if (t.kind === "url") {
              return (
                <div key={i} className={wrapperClass}>
                  <img src={t.url} alt={t.alt} loading="lazy" decoding="async" className={className} />
                </div>
              );
            }
            return (
              <div key={i} className={wrapperClass}>
                <ResponsiveImage
                  picture={t.picture}
                  alt={t.alt}
                  loading="lazy"
                  sizes="(min-width: 1024px) 480px, (min-width: 640px) 50vw, 100vw"
                  className={className}
                />
              </div>
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
