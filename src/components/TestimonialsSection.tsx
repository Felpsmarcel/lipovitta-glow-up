import { useState, useEffect, useRef, useCallback } from "react";
import { Star, CheckCircle } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const testimonials = [
  { name: "Maria S.", city: "Salvador/BA", text: "Em 3 semanas já senti minhas pernas mais leves. O inchaço reduziu muito!" },
  { name: "Ana P.", city: "São Paulo/SP", text: "Eu já tinha desistido de tudo. O Lipovitta me devolveu a confiança de usar saia." },
  { name: "Carla M.", city: "Recife/PE", text: "Tomo o shot matinal todo dia em jejum. Minha disposição mudou completamente." },
  { name: "Juliana R.", city: "BH/MG", text: "Minha celulite melhorou visivelmente. Até meu marido notou!" },
  { name: "Fernanda L.", city: "Curitiba/PR", text: "Sofro com lipedema há 8 anos. Pela primeira vez sinto alívio real." },
  { name: "Patrícia D.", city: "Brasília/DF", text: "O kit completo é o melhor custo-benefício. Não largo mais." },
];

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

function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <div className="bg-white border border-lipovitta-gray rounded-xl p-6 shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-[60px] h-[60px] rounded-full border-2 border-lipovitta-blue-medium bg-lipovitta-ice flex items-center justify-center text-lipovitta-blue-dark font-bold text-lg font-heading">
          {t.name.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-lipovitta-blue-dark">{t.name}</p>
          <p className="text-sm text-[#666]">{t.city}</p>
        </div>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={18} fill="#7BA33E" color="#7BA33E" />
        ))}
      </div>
      <p className="italic text-lipovitta-text leading-relaxed">"{t.text}"</p>
      <div className="flex items-center gap-1.5 text-sm text-lipovitta-green font-medium mt-auto pt-2">
        <CheckCircle size={16} />
        <span>Compra verificada</span>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const { count, ref: counterRef } = useAnimatedCounter(2000);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <section className="bg-white py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-2xl md:text-4xl font-heading font-bold text-lipovitta-blue-dark text-center">
          Veja o que mulheres reais estão dizendo
        </h2>
        <div className="mx-auto mt-4 mb-12 h-[3px] w-20 rounded-full bg-gradient-to-r from-lipovitta-blue-medium to-lipovitta-green" />

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {testimonials.map((t, i) => (
                <div key={i} className="min-w-0 shrink-0 grow-0 basis-full px-2">
                  <TestimonialCard t={t} />
                </div>
              ))}
            </div>
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === selectedIndex ? "bg-lipovitta-green" : "bg-lipovitta-gray"
                }`}
                aria-label={`Depoimento ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Animated counter */}
        <div ref={counterRef} className="text-center mt-14">
          <p className="text-lg md:text-xl text-lipovitta-text">
            <span className="text-3xl md:text-4xl font-bold text-lipovitta-green">
              + de {count.toLocaleString("pt-BR")}
            </span>{" "}
            mulheres já transformaram sua rotina com LipoVitta
          </p>
        </div>
      </div>
    </section>
  );
}
