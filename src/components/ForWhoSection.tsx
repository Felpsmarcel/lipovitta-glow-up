import { CheckCircle, User } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const items = [
  "Mulheres que convivem com lipedema",
  "Quem sofre com inchaço e retenção de líquidos",
  "Quem sente peso e desconforto nas pernas",
  "Mulheres inseguras com a aparência da celulite",
  "Quem já tentou de tudo e quer uma solução natural",
];

const ForWhoSection = () => {
  const ref = useScrollAnimation();
  return (
  <section ref={ref} className="py-16 md:py-24 px-4" style={{ backgroundColor: "#1B3A6B" }}>
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
      <div className="flex-1 text-center lg:text-left">
        <h2
          className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8"
          style={{ color: "#7BA33E", fontFamily: "'Playfair Display', serif" }}
        >
          Para quem é o LipoVitta?
        </h2>

        <ul className="space-y-4 mb-8">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle size={22} color="#7BA33E" className="mt-0.5 shrink-0" />
              <span className="text-white text-base md:text-lg">{item}</span>
            </li>
          ))}
        </ul>

        <a
          href="#comprar"
          className="inline-block text-white font-bold text-base md:text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          style={{ backgroundColor: "#7BA33E" }}
        >
          COMEÇAR PELA CÁPSULA
        </a>
      </div>

      <div className="flex-1 flex justify-center">
        <div
          className="w-72 h-80 md:w-80 md:h-96 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "2px solid rgba(123,163,62,0.4)" }}
        >
          <User size={80} color="rgba(255,255,255,0.25)" />
        </div>
      </div>
    </div>
  </section>
  );
};

export default ForWhoSection;
