import { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Check, Package } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const products = [
  {
    name: "Shot Matinal LipoVitta",
    badge: "☀️ Ritual Matinal",
    description:
      "Shot natural para fortalecer imunidade, reduzir inflamações e aliviar o inchaço. Com L-Glutamina, Curcumina, Beta-glucana, Vitaminas A/C/D/E, Zinco e Selênio.",
    benefits: ["Fortalece imunidade", "Reduz inflamações", "Combate inchaço", "Regula intestino"],
    tag: "Sem glúten",
  },
  {
    name: "Gummy VittaGlow Colágeno",
    badge: "✨ Beleza de Dentro pra Fora",
    description:
      "Gomas com 2,5g de colágeno hidrolisado + 120mg de ácido hialurônico + vitaminas e minerais. Sem açúcar, sem glúten, sem lactose.",
    benefits: ["Firmeza da pele", "Hidratação profunda", "Praticidade", "Baixo calórico"],
    tag: "Sem açúcar",
  },
  {
    name: "Shot Rush Pré-Treino",
    badge: "⚡ Performance Premium",
    description:
      "Energia, foco e vitalidade com Taurina, Guaraná, Feno-grego, Arginina, Resveratrol, Coenzima Q10. Zero açúcar, sabor frutas vermelhas.",
    benefits: ["Energia prolongada", "Libido e vigor", "Controle de peso", "Proteção celular"],
    tag: "Zero açúcar",
  },
];

const ProductCard = ({ product }: { product: (typeof products)[0] }) => (
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:border-b-[3px] hover:border-b-[#7BA33E] border-b-[3px] border-b-transparent flex flex-col">
    {/* Badge */}
    <div className="p-5 pb-0">
      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium" style={{ background: "rgba(123,163,62,0.1)", color: "#7BA33E" }}>
        {product.badge}
      </span>
    </div>

    {/* Placeholder imagem */}
    <div className="mx-5 mt-4 h-40 rounded-xl bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF1] flex items-center justify-center">
      <Package size={48} color="#2E5EA6" strokeWidth={1.5} />
    </div>

    {/* Content */}
    <div className="p-5 flex flex-col flex-1">
      <h3 className="text-lg font-bold mb-2" style={{ color: "#1B3A6B" }}>{product.name}</h3>
      <p className="text-sm mb-4" style={{ color: "#555" }}>{product.description}</p>

      <ul className="space-y-2 mb-4 flex-1">
        {product.benefits.map((b) => (
          <li key={b} className="flex items-center gap-2 text-sm" style={{ color: "#333" }}>
            <Check size={16} color="#7BA33E" className="shrink-0" />
            {b}
          </li>
        ))}
      </ul>

      <span className="inline-block self-start px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: "#E8ECF1", color: "#555" }}>
        {product.tag}
      </span>

      <button
        onClick={() => document.getElementById("precos")?.scrollIntoView({ behavior: "smooth" })}
        className="w-full py-3 rounded-xl font-bold text-white transition-colors hover:opacity-90 cursor-pointer"
        style={{ background: "#2E5EA6" }}
      >
        Ver oferta
      </button>
    </div>
  </div>
);

const ProductsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useScrollAnimation();

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-4" style={{ background: "#1B3A6B" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: "#7BA33E" }}>
            Potencialize seus resultados com a linha completa
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full mb-4" style={{ background: "linear-gradient(90deg, #2E5EA6, #7BA33E)" }} />
          <p className="text-lg text-white/80">Cada produto complementa sua rotina de transformação</p>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.name} product={p} />
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {products.map((p) => (
                <div key={p.name} className="min-w-0 shrink-0 grow-0 basis-[85%] pl-4 first:pl-0">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeIndex ? "w-8" : "opacity-40"}`}
                style={{ background: "#7BA33E" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
