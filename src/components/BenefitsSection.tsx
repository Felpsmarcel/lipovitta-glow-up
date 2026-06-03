import { Footprints, Droplets, Zap, Heart, Activity, Shield } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const benefits = [
  { icon: Footprints, title: "Menos Celulite", description: "Ativos que melhoram a circulação deixam suas pernas mais leves e com menos celulite." },
  { icon: Droplets, title: "Redução do Inchaço", description: "Ajuda a reduzir o acúmulo de líquidos, deixando o corpo mais equilibrado e leve." },
  { icon: Zap, title: "Mais Energia", description: "Menos desconforto e mais vitalidade para viver melhor no dia a dia." },
  { icon: Heart, title: "Bem-Estar e Confiança", description: "Cuidar de dentro para fora aumenta a autoestima diante do espelho." },
  { icon: Activity, title: "Apoio à Circulação", description: "Ingredientes selecionados proporcionam mais conforto e menos dor nas pernas." },
  { icon: Shield, title: "Proteção Celular", description: "Antioxidantes combatem radicais livres, protegendo suas células." },
];

const BenefitsSection = () => {
  const ref = useScrollAnimation();
  return (
  <section ref={ref} className="pt-12 md:pt-16 pb-16 md:pb-24 px-4" style={{ background: "linear-gradient(180deg, #F5F7FA 0%, #FFFFFF 100%)" }}>
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mb-4" style={{ color: "#4667B4" }}>
          6 benefícios que você sente no corpo
        </h2>
        <div className="w-20 h-[3px] mx-auto rounded-full" style={{ background: "linear-gradient(90deg, #4667B4, #9BAE52)" }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {benefits.map(({ icon: Icon, title, description }, idx) => {
          const spans = [
            "lg:col-span-4",
            "lg:col-span-2",
            "lg:col-span-2",
            "lg:col-span-2",
            "lg:col-span-2",
            "lg:col-span-4 lg:col-start-2",
          ];
          return (
            <div
              data-animate
              key={title}
              className={`relative bg-white rounded-[20px] p-6 overflow-hidden shadow-[0_8px_30px_rgba(70,103,180,0.07)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_45px_rgba(70,103,180,0.14)] ${spans[idx]}`}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: "linear-gradient(90deg, #4667B4, #9BAE52)" }}
                aria-hidden="true"
              />
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "rgba(70, 103, 180, 0.12)" }}
              >
                <Icon size={28} color="#9BAE52" />
              </div>
              <h3 className="font-sans text-lg font-semibold mb-2" style={{ color: "#4667B4" }}>{title}</h3>
              <p className="font-sans text-base font-normal leading-relaxed" style={{ color: "#555" }}>{description}</p>
            </div>
          );
        })}
      </div>

    </div>
  </section>
  );
};

export default BenefitsSection;
