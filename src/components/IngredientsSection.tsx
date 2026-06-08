import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import capsulasImg from "@/assets/capsulas-lipovitta.png";


const ingredients = [
  { name: "Cafeína", dose: "80mg", max: 130, description: "Estimula metabolismo, queima de gordura, melhora circulação." },
  { name: "Curcumina", dose: "130mg", max: 130, description: "Anti-inflamatório natural, reduz dores, melhora circulação." },
  { name: "Quercetina", dose: "100mg", max: 130, description: "Antioxidante, proteção celular, equilíbrio imunológico." },
  { name: "Dimpless®", dose: "5mg", max: 130, description: "SOD do melão Cantaloupe, firmeza da pele, reduz celulite.", badge: "PATENTEADO" },
  { name: "Trans-Resveratrol", dose: "20mg", max: 130, description: "Antioxidante, saúde vascular, potencializa outros compostos." },
  { name: "Opuntia fícus", dose: "50mg", max: 130, description: "Auxilia na retenção de líquidos e saciedade." },
];

const IngredientCard = ({ item, alwaysOpen }: { item: typeof ingredients[0]; alwaysOpen: boolean }) => {
  const [open, setOpen] = useState(false);
  const pct = (parseInt(item.dose) / item.max) * 100;
  const isDimpless = !!item.badge;
  const borderColor = isDimpless ? "#9BAE52" : "#4667B4";

  const content = (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-sans font-semibold text-base" style={{ color: "#4667B4" }}>{item.name}</span>
        <span className="font-sans font-medium text-sm" style={{ color: "#9BAE52" }}>({item.dose})</span>
        {item.badge && (
          <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: "#9BAE52" }}>
            {item.badge}
          </span>
        )}
      </div>
      <p className="font-sans font-normal text-base mt-2 leading-relaxed" style={{ color: "#555" }}>{item.description}</p>
      <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#E8ECF1" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: "#4667B4" }} />
      </div>
    </>
  );

  if (alwaysOpen) {
    return (
      <div data-animate className="bg-white rounded-xl p-5 border" style={{ borderColor: "#E8ECF1", borderLeftWidth: 4, borderLeftColor: borderColor }}>
        {content}
      </div>
    );
  }

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E8ECF1", borderLeftWidth: 4, borderLeftColor: borderColor }}>
        <Collapsible.Trigger className="w-full flex items-center justify-between p-4 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-sans font-semibold text-base" style={{ color: "#4667B4" }}>{item.name}</span>
            <span className="font-sans font-medium text-sm" style={{ color: "#9BAE52" }}>({item.dose})</span>
            {item.badge && (
              <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: "#9BAE52" }}>
                {item.badge}
              </span>
            )}
          </div>
          <ChevronDown size={18} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} color="#4667B4" />
        </Collapsible.Trigger>
        <Collapsible.Content className="px-4 pb-4">
          <p className="font-sans font-normal text-base leading-relaxed" style={{ color: "#555" }}>{item.description}</p>
          <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#E8ECF1" }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "#4667B4" }} />
          </div>
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
};

const IngredientsSection = () => {
  const ref = useScrollAnimation();
  return (
  <section ref={ref} className="relative py-16 md:py-20 px-4 overflow-hidden" style={{ backgroundColor: "#4667B4" }}>
    {/* Mancha orgânica decorativa */}
    <svg
      aria-hidden="true"
      className="hidden md:block pointer-events-none absolute -top-10 -left-10 w-[420px] h-[420px]"
      viewBox="0 0 400 400"
    >
      <path
        d="M327,275 C297,343 215,377 145,355 C75,333 30,265 42,196 C54,127 117,68 190,62 C263,56 340,108 357,176 C374,244 357,207 327,275 Z"
        fill="#FFFFFF"
        opacity="0.07"
      />
    </svg>

    <div className="relative max-w-4xl mx-auto">
      <div className="relative mb-10 text-center md:text-left md:pl-2" data-animate>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mb-3 max-w-2xl text-white">
          Compostos 100% naturais com dosagens precisas
        </h2>
        <p className="font-sans font-normal text-base mb-4 max-w-xl text-white/85">
          Cada ingrediente foi selecionado para atuar de forma sinérgica no seu corpo
        </p>
        <div className="w-20 h-[3px] mx-auto md:mx-0 rounded-full" style={{ background: "linear-gradient(90deg, #FFFFFF, #9BAE52)" }} />


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
