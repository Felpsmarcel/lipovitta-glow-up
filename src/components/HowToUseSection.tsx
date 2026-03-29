import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  { emoji: "☀️", title: "Autocuidado", description: "Comece o dia cuidando de você: atividade física, descanso e equilíbrio ajudam a aliviar o lipedema." },
  { emoji: "☕", title: "Pós-café da manhã", description: "Tome 1 cápsula de LipoVitta após o café com bastante água para efeito anti-inflamatório e antioxidante." },
  { emoji: "✨", title: "Alívio progressivo", description: "Com uso contínuo, você percebe melhora no aspecto da celulite, inchaço e peso." },
  { emoji: "🔄", title: "Constância", description: "Faça do LipoVitta parte da sua rotina. Dieta equilibrada + atividade física potencializam os resultados." },
];

const HowToUseSection = () => {
  const ref = useScrollAnimation();
  return (
  <section ref={ref} className="py-16 md:py-24 px-4 bg-white">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4" style={{ color: "#1B3A6B", fontFamily: "'Playfair Display', serif" }}>
          Sua rotina de transformação em 4 passos
        </h2>
        <div className="w-20 h-[3px] mx-auto rounded-full" style={{ background: "linear-gradient(90deg, #2E5EA6, #7BA33E)" }} />
      </div>

      <div className="relative">
        {/* Vertical connector line — desktop only */}
        <div className="hidden md:block absolute left-6 top-4 bottom-4 w-[2px]" style={{ backgroundColor: "#2E5EA6" }} />

        <div className="space-y-8 md:space-y-10">
          {steps.map((step, i) => (
            <div key={step.title} className="flex items-start gap-5 md:gap-8">
              <div
                className="relative z-10 shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                style={{ backgroundColor: "#7BA33E" }}
              >
                {i + 1}
              </div>
              <div className="bg-white rounded-xl p-5 border flex-1 transition-shadow hover:shadow-md" style={{ borderColor: "#E8ECF1" }}>
                <h3 className="font-bold text-lg mb-1" style={{ color: "#1B3A6B" }}>
                  <span className="mr-2">{step.emoji}</span>{step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#555" }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
  );
};

export default HowToUseSection;
