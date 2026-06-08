import { CheckCircle } from "lucide-react";
import claraFoto from "@/assets/clara-foto.jpg";
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
  <section ref={ref} className="pt-20 md:pt-28 pb-12 md:pb-16 px-4" style={{ backgroundColor: "#4667B4" }}>
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
      <div className="flex-1 text-center lg:text-left">
        <h2
          className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mb-8"
          style={{ color: "#B8C77A" }}
        >
          Para quem é o LipoVitta?
        </h2>

        <ul className="space-y-3 md:space-y-4 mb-8 text-left">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle size={22} color="#9BAE52" className="mt-0.5 shrink-0" />
              <span className="flex-1 font-sans font-normal text-white text-base md:text-lg">{item}</span>
            </li>
          ))}
        </ul>

        <a
          href="#comprar"
          className="inline-block text-white font-bold text-base md:text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          style={{ backgroundColor: "#9BAE52" }}
        >
          COMEÇAR PELA CÁPSULA
        </a>
      </div>

      <div className="flex-1 flex justify-center">
        <img
          src={claraFoto}
          alt="Clara — LipoVitta"
          className="w-72 h-80 md:w-80 md:h-96 rounded-2xl object-cover border-2 border-[rgba(123,163,62,0.4)] shadow-lg"
        />

      </div>
    </div>
  </section>
  );
};

export default ForWhoSection;
