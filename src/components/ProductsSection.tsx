import { Check, Tag } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import shotRushImg from "@/assets/shot-rush.jpg";
import gummyImg from "@/assets/gummy-vittaglow.png";

type Complemento = {
  id: string;
  inStock: boolean;
  render: () => JSX.Element;
};

const complementos: Complemento[] = [
  {
    id: "shot-rush",
    inStock: true,
    render: () => (
      <article
        key="shot-rush"
        className="bg-white rounded-2xl border border-[#E8ECF1] p-5 flex flex-col"
      >
        <span className="self-start text-[11px] font-semibold uppercase tracking-wide text-[#4667B4] border border-[#4667B4]/30 px-3 py-1 rounded-full mb-3">
          Combina com a Cápsula
        </span>
        <div className="relative rounded-xl bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF1] h-44 flex items-center justify-center mb-4 overflow-hidden">
          <span className="absolute top-2 left-2 z-10 bg-[#9BAE52] text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow-md">
            Temos estoque
          </span>
          <img
            src={shotRushImg}
            alt="Frasco do Shot Rush Pré-Treino sabor Frutas Vermelhas"
            className="h-full w-auto object-contain"
            loading="lazy"
          />
        </div>
        <h3 className="font-sans font-semibold text-lg text-[#4667B4] mb-2">
          Shot Rush Pré-Treino
        </h3>
        <p className="font-sans font-normal text-base text-[#555] mb-3 leading-relaxed">
          Apoio para disposição antes do movimento. Pensado para somar à
          sua rotina com a Cápsula LipoVitta.
        </p>
        <ul className="space-y-1.5 mb-4">
          {[
            "Energia natural",
            "Fácil de tomar",
            "Sem estimulantes agressivos",
          ].map((b) => (
            <li
              key={b}
              className="flex items-start gap-2 text-sm text-[#444]"
            >
              <Check className="w-4 h-4 text-[#9BAE52] shrink-0 mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mb-3">
          <span className="inline-flex items-center gap-1.5 bg-[#9BAE52] text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-2 shadow-sm">
            <Tag className="w-3.5 h-3.5" />
            10% OFF comprando hoje
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#999] line-through text-xs">R$225,00</span>
            <span className="text-[#4667B4] font-extrabold text-xl">
              R$202,50
            </span>
            <span className="inline-flex items-center bg-[#e8f5e0] text-[#4a7c2e] text-[11px] font-bold px-2 py-0.5 rounded-full">
              Economize 10%
            </span>
          </div>
          <p className="text-xs text-[#555] mt-1">ou 3x R$67,50 sem juros</p>
        </div>
        <a
          href="https://clarinhacbr.lojavirtualnuvem.com.br/produtos/shot-rush-pre-treino/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto block text-center border-2 border-[#4667B4] text-[#4667B4] hover:bg-[#4667B4] hover:text-white font-semibold py-2.5 rounded-full transition-colors text-sm"
        >
          Adicionar à minha rotina
        </a>
        <p className="text-[11px] text-[#777] text-center mt-2">
          Receba junto com sua Cápsula.
        </p>
      </article>
    ),
  },
  {
    // Mantido como referência futura — fora de estoque, não renderiza.
    id: "gummy",
    inStock: false,
    render: () => (
      <article key="gummy" className="hidden">
        <img src={gummyImg} alt="" />
      </article>
    ),
  },
];

const ProductsSection = () => {
  const sectionRef = useScrollAnimation();
  const visiveis = complementos.filter((p) => p.inStock);

  if (visiveis.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="complementos"
      className="pt-12 md:pt-16 pb-16 md:pb-20 bg-white"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#4667B4] mb-4">
            Complementos opcionais para sua rotina
          </h2>
          <p className="font-sans font-normal text-base sm:text-lg text-[#444] mb-3">
            Produtos que combinam com a Cápsula LipoVitta para quem quer ir além.
          </p>
          <p className="font-sans font-normal text-sm text-[#666]">
            Frete grátis em compras a partir de R$323,00.
          </p>
          <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#4667B4] to-[#9BAE52]" />
        </div>

        {/* Cards grid — apenas complementos em estoque */}
        <div
          className={
            visiveis.length === 1
              ? "max-w-md mx-auto"
              : "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          }
        >
          {visiveis.map((p) => p.render())}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
