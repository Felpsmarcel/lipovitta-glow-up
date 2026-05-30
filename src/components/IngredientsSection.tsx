import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import capsulasImg from "@/assets/capsulas-lipovitta.png";


const ingredients = [
  { name: "Cafeína", dose: "80mg", max: 130, description: "Estimula metabolismo, queima de gordura, melhora circulação." },
  { name: "Curcumina", dose: "130mg", max: 130, description: "Anti-inflamatório natural, reduz dores, melhora circulação." },
  { name: "Quercetina", dose: "100mg", max: 130, description: "Antioxidante, proteção celular, equilíbrio imunológico." },
  { name: "Dimpless®", dose: "50mg", max: 130, description: "SOD do melão Cantaloupe, firmeza da pele, reduz celulite.", badge: "PATENTEADO" },
  { name: "Trans-Resveratrol", dose: "20mg", max: 130, description: "Antioxidante, saúde vascular, potencializa outros compostos." },
];

const IngredientCard = ({ item, alwaysOpen }: { item: typeof ingredients[0]; alwaysOpen: boolean }) => {
  const [open, setOpen] = useState(false);
  const pct = (parseInt(item.dose) / item.max) * 100;
  const isDimpless = !!item.badge;
  const borderColor = isDimpless ? "#7BA33E" : "#2E5EA6";

  const content = (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-sans font-semibold text-base" style={{ color: "#1B3A6B" }}>{item.name}</span>
        <span className="font-sans font-medium text-sm" style={{ color: "#7BA33E" }}>({item.dose})</span>
        {item.badge && (
          <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: "#7BA33E" }}>
            {item.badge}
          </span>
        )}
      </div>
      <p className="font-sans font-normal text-base mt-2 leading-relaxed" style={{ color: "#555" }}>{item.description}</p>
      <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#E8ECF1" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: "#2E5EA6" }} />
      </div>
    </>
  );

  if (alwaysOpen) {
    return (
      <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "#E8ECF1", borderLeftWidth: 4, borderLeftColor: borderColor }}>
        {content}
      </div>
    );
  }

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E8ECF1", borderLeftWidth: 4, borderLeftColor: borderColor }}>
        <Collapsible.Trigger className="w-full flex items-center justify-between p-4 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-sans font-semibold text-base" style={{ color: "#1B3A6B" }}>{item.name}</span>
            <span className="font-sans font-medium text-sm" style={{ color: "#7BA33E" }}>({item.dose})</span>
            {item.badge && (
              <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: "#7BA33E" }}>
                {item.badge}
              </span>
            )}
          </div>
          <ChevronDown size={18} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} color="#1B3A6B" />
        </Collapsible.Trigger>
        <Collapsible.Content className="px-4 pb-4">
          <p className="font-sans font-normal text-base leading-relaxed" style={{ color: "#555" }}>{item.description}</p>
          <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#E8ECF1" }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "#2E5EA6" }} />
          </div>
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
};

const IngredientsSection = () => {
  const ref = useScrollAnimation();
  return (
  <section ref={ref} className="relative py-16 md:py-24 px-4 overflow-hidden" style={{ background: "linear-gradient(180deg, #F5F7FA 0%, #FFFFFF 100%)" }}>
    {/* Mancha orgânica decorativa */}
    <svg
      aria-hidden="true"
      className="hidden md:block pointer-events-none absolute -top-10 -left-10 w-[420px] h-[420px]"
      viewBox="0 0 400 400"
    >
      <path
        d="M327,275 C297,343 215,377 145,355 C75,333 30,265 42,196 C54,127 117,68 190,62 C263,56 340,108 357,176 C374,244 357,207 327,275 Z"
        fill="#8FAE82"
        opacity="0.08"
      />
    </svg>

    <div className="relative max-w-4xl mx-auto">
      <div className="relative mb-12 text-center md:text-left md:pl-2">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mb-3 max-w-2xl" style={{ color: "#1B3A6B" }}>
          Compostos 100% naturais com dosagens precisas
        </h2>
        <p className="font-sans font-normal text-base mb-4 max-w-xl" style={{ color: "#666" }}>
          Cada ingrediente foi selecionado para atuar de forma sinérgica no seu corpo
        </p>
        <div className="w-20 h-[3px] mx-auto md:mx-0 rounded-full" style={{ background: "linear-gradient(90deg, #2E5EA6, #7BA33E)" }} />

        {/* Imagem decorativa do produto */}
        <img
          src={capsulasImg}
          alt=""
          aria-hidden="true"
          className="hidden md:block absolute right-2 -top-4 w-36 lg:w-44 rotate-[-3deg] opacity-95 drop-shadow-2xl pointer-events-none"
        />
      </div>


      {/* Desktop: all expanded */}
      <div className="hidden md:flex flex-col gap-4">
        {ingredients.map((item) => (
          <IngredientCard key={item.name} item={item} alwaysOpen />
        ))}
      </div>

      {/* Mobile: accordion */}
      <div className="md:hidden flex flex-col gap-3">
        {ingredients.map((item) => (
          <IngredientCard key={item.name} item={item} alwaysOpen={false} />
        ))}
      </div>
    </div>
  </section>
  );
};

export default IngredientsSection;
