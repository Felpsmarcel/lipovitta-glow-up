import { Check } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import gummyImg from "@/assets/gummy-vittaglow.png";
import shotRushImg from "@/assets/shot-rush.jpg";

const ProductsSection = () => {
  const sectionRef = useScrollAnimation();

  return (
    <section
      ref={sectionRef}
      id="complementos"
      className="pt-12 md:pt-16 pb-16 md:pb-20 bg-white"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1B3A6B] mb-4">
            Complementos opcionais para sua rotina
          </h2>
          <p className="font-sans font-normal text-base sm:text-lg text-[#444] mb-3">
            Produtos que combinam com a Cápsula LipoVitta para quem quer ir além.
          </p>
          <p className="font-sans font-normal text-sm text-[#666]">
            Frete grátis em compras a partir de R$323,00.
          </p>
          <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#2E5EA6] to-[#7BA33E]" />
        </div>

        {/* Cards grid — 2 complementos opcionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Gummy VittaGlow */}
          <article className="bg-white rounded-2xl border border-[#E8ECF1] p-5 flex flex-col">
            <span className="self-start text-[11px] font-semibold uppercase tracking-wide text-[#2E5EA6] border border-[#2E5EA6]/30 px-3 py-1 rounded-full mb-3">
              Combina com a Cápsula
            </span>
            <div className="rounded-xl bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF1] h-44 flex items-center justify-center mb-4 overflow-hidden">
              <img
                src={gummyImg}
                alt="Pote do Gummy VittaGlow Colágeno"
                className="h-full w-auto object-contain"
                loading="lazy"
              />
            </div>
            <h3 className="font-sans font-semibold text-lg text-[#1B3A6B] mb-2">
              Gummy VittaGlow Colágeno
            </h3>
            <p className="font-sans font-normal text-base text-[#555] mb-3 leading-relaxed">
              Cuidado extra para pele, cabelo e firmeza. Pensado para somar à
              sua rotina com a Cápsula LipoVitta.
            </p>
            <ul className="space-y-1.5 mb-4">
              {["Colágeno verisol", "Sabor agradável", "Uso diário simples"].map(
                (b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-sm text-[#444]"
                  >
                    <Check className="w-4 h-4 text-[#7BA33E] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                )
              )}
            </ul>
            <div className="mb-3">
              <span className="text-[#1B3A6B] font-extrabold text-xl">
                R$260,00
              </span>
              <p className="text-xs text-[#555]">ou 3x R$96,33 sem juros</p>
            </div>
            <a
              href="https://clarinhacbr.lojavirtualnuvem.com.br/produtos/gummy-skin-glow/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto block text-center border-2 border-[#2E5EA6] text-[#2E5EA6] hover:bg-[#2E5EA6] hover:text-white font-semibold py-2.5 rounded-full transition-colors text-sm"
            >
              Adicionar à minha rotina
            </a>
            <p className="text-[11px] text-[#777] text-center mt-2">
              Receba junto com sua Cápsula.
            </p>
          </article>

          {/* Shot Rush */}
          <article className="bg-white rounded-2xl border border-[#E8ECF1] p-5 flex flex-col">
            <span className="self-start text-[11px] font-semibold uppercase tracking-wide text-[#2E5EA6] border border-[#2E5EA6]/30 px-3 py-1 rounded-full mb-3">
              Combina com a Cápsula
            </span>
            <div className="rounded-xl bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF1] h-44 flex items-center justify-center mb-4 overflow-hidden">
              <img
                src={shotRushImg}
                alt="Frasco do Shot Rush Pré-Treino"
                className="h-full w-auto object-contain"
                loading="lazy"
              />
            </div>
            <h3 className="font-sans font-semibold text-lg text-[#1B3A6B] mb-2">
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
                  <Check className="w-4 h-4 text-[#7BA33E] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mb-3">
              <span className="text-[#1B3A6B] font-extrabold text-xl">
                R$225,00
              </span>
              <p className="text-xs text-[#555]">ou 3x R$75,00 sem juros</p>
            </div>
            <a
              href="https://clarinhacbr.lojavirtualnuvem.com.br/produtos/shot-rush-pre-treino/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto block text-center border-2 border-[#2E5EA6] text-[#2E5EA6] hover:bg-[#2E5EA6] hover:text-white font-semibold py-2.5 rounded-full transition-colors text-sm"
            >
              Adicionar à minha rotina
            </a>
            <p className="text-[11px] text-[#777] text-center mt-2">
              Receba junto com sua Cápsula.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
