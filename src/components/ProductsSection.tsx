import { Check } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import capsulasImg from "@/assets/capsulas-lipovitta.png";
import shotMatinalImg from "@/assets/shot-matinal.jpg";
import gummyImg from "@/assets/gummy-vittaglow.png";
import shotRushImg from "@/assets/shot-rush.jpg";

const ProductsSection = () => {
  const sectionRef = useScrollAnimation();

  return (
    <section
      ref={sectionRef}
      id="complementos"
      className="pt-20 md:pt-28 pb-16 md:pb-24 bg-white"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1B3A6B] mb-4">
            Potencialize sua rotina com a Cápsula LipoVitta
          </h2>
          <p className="text-base sm:text-lg text-[#444] mb-3">
            A Cápsula é a base. O Shot Matinal é o complemento que fecha sua
            rotina diária.
          </p>
          <p className="text-sm text-[#666]">
            Adicione ao seu pedido e receba tudo junto, com frete grátis a
            partir de R$323,00.
          </p>
          <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#2E5EA6] to-[#7BA33E]" />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card A — Shot Matinal (destaque, ocupa 2 colunas no desktop) */}
          <article className="md:col-span-2 md:row-span-2 bg-white rounded-3xl border-2 border-[#7BA33E] p-6 sm:p-8 shadow-lg flex flex-col">
            <span className="self-start bg-[#7BA33E] text-white text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-full mb-5">
              Combina perfeitamente com a Cápsula
            </span>

            <div className="rounded-2xl bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF1] p-4 mb-6 flex items-center justify-center gap-3 h-56 sm:h-64">
              <img
                src={shotMatinalImg}
                alt="Frasco do Shot Matinal LipoVitta"
                className="h-full w-auto object-contain"
                loading="lazy"
              />
              <img
                src={capsulasImg}
                alt="Pote da Cápsula LipoVitta"
                className="h-full w-auto object-contain"
                loading="lazy"
              />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1B3A6B] mb-2">
              Shot Matinal LipoVitta
            </h3>
            <p className="text-base font-semibold text-[#2E5EA6] mb-3">
              O ritual da manhã que potencializa sua Cápsula.
            </p>
            <p className="text-[#555] mb-5 leading-relaxed">
              A Cápsula cuida da sua rotina ao longo do dia. O Shot Matinal
              apoia o início da manhã com cuidado para inchaço, intestino e
              disposição. Juntos, formam a rotina completa.
            </p>

            <ul className="space-y-2 mb-6">
              {[
                "Apoia o controle do inchaço matinal",
                "Suporte para o intestino logo ao acordar",
                "Sabor agradável, fácil de incluir na rotina",
                "Combina com a Cápsula LipoVitta",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2 text-[#444]">
                  <Check className="w-5 h-5 text-[#7BA33E] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-baseline gap-2 flex-wrap mb-1">
              <span className="text-[#1B3A6B] font-extrabold text-3xl">
                R$170,00
              </span>
            </div>
            <p className="text-sm text-[#555] mb-5">
              ou 3x de R$63,03 sem juros
            </p>

            <div className="bg-[#7BA33E]/10 border border-[#7BA33E]/30 rounded-xl p-4 mb-3">
              <p className="text-sm font-semibold text-[#1B3A6B]">
                Cápsula + Shot Matinal juntos: economia de R$79,05 no Protocolo
                Completo.
              </p>
            </div>
            <a
              href="#precos"
              className="text-sm text-[#2E5EA6] underline underline-offset-2 hover:text-[#1B3A6B] mb-6 inline-block"
            >
              Ver Protocolo Completo
            </a>

            <a
              href="https://clarinhacbr.lojavirtualnuvem.com.br/produtos/shot-matinal-lipovitta/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto block text-center bg-[#2E5EA6] hover:bg-[#1B3A6B] text-white font-bold py-3 px-6 rounded-full transition-colors text-base"
            >
              Adicionar Shot Matinal à minha rotina
            </a>
            <p className="text-xs text-[#777] text-center mt-2">
              Receba junto com sua Cápsula.
            </p>
          </article>

          {/* Card B — Gummy VittaGlow */}
          <article className="bg-white rounded-2xl border border-[#E8ECF1] p-5 flex flex-col">
            <span className="self-start text-[11px] font-semibold uppercase tracking-wide text-[#2E5EA6] border border-[#2E5EA6]/30 px-3 py-1 rounded-full mb-3">
              Combina com a Cápsula
            </span>
            <div className="rounded-xl bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF1] h-36 flex items-center justify-center mb-4 overflow-hidden">
              <img
                src={gummyImg}
                alt="Pote do Gummy VittaGlow Colágeno"
                className="h-full w-auto object-contain"
                loading="lazy"
              />
            </div>
            <h3 className="text-lg font-bold text-[#1B3A6B] mb-2">
              Gummy VittaGlow Colágeno
            </h3>
            <p className="text-sm text-[#555] mb-3 leading-relaxed">
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

          {/* Card C — Shot Rush */}
          <article className="bg-white rounded-2xl border border-[#E8ECF1] p-5 flex flex-col">
            <span className="self-start text-[11px] font-semibold uppercase tracking-wide text-[#2E5EA6] border border-[#2E5EA6]/30 px-3 py-1 rounded-full mb-3">
              Combina com a Cápsula
            </span>
            <div className="rounded-xl bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF1] h-36 flex items-center justify-center mb-4 overflow-hidden">
              <img
                src={shotRushImg}
                alt="Frasco do Shot Rush Pré-Treino"
                className="h-full w-auto object-contain"
                loading="lazy"
              />
            </div>
            <h3 className="text-lg font-bold text-[#1B3A6B] mb-2">
              Shot Rush Pré-Treino
            </h3>
            <p className="text-sm text-[#555] mb-3 leading-relaxed">
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

        {/* Rodapé da seção */}
        <div className="max-w-2xl mx-auto text-center mt-12 md:mt-16">
          <p className="text-[#555] mb-4 leading-relaxed">
            A Cápsula LipoVitta continua sendo a base da rotina. O Shot Matinal
            é o complemento natural. Gummy e Shot Rush são opcionais conforme
            sua necessidade.
          </p>
          <a
            href="#precos"
            className="text-[#2E5EA6] underline underline-offset-4 font-medium hover:text-[#1B3A6B]"
          >
            Voltar para a Cápsula LipoVitta
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
