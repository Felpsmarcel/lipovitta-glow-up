import { Shield, Lock, Truck, CreditCard, Check, Tag } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import capsulasImg from "@/assets/capsulas-lipovitta.png";
import shotMatinalAbacaxiImg from "@/assets/shot-matinal-abacaxi.jpg";
import shotMatinalLimaoImg from "@/assets/shot-matinal-limao.jpg";
import shotMatinalTangerinaImg from "@/assets/shot-matinal-tangerina.jpg";
import comboImg from "@/assets/combo-lipovitta.jpg";

const LINK_CAPSULAS = "https://clarinhacbr.lojavirtualnuvem.com.br/produtos/lipovitta/";
const LINK_PROTOCOLO = "https://clarinhacbr.lojavirtualnuvem.com.br/produtos/shot-matinal-lipovitta1/";
const LINK_SHOT = "https://clarinhacbr.lojavirtualnuvem.com.br/produtos/shot-matinal-lipovitta/";

const OfferSection = () => {
  const sectionRef = useScrollAnimation();

  return (
    <section ref={sectionRef} id="precos" className="pt-24 md:pt-32 pb-16 md:pb-20" style={{ background: "#F5F7FA" }}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1B3A6B] mb-3">
            Comece sua rotina LipoVitta
          </h2>
          <p className="font-sans font-normal text-[#555] text-base sm:text-lg">
            Escolha como quer começar. Você pode adicionar complementos depois.
          </p>
          <p className="font-sans font-normal text-sm text-[#888] mt-2">
            Frete grátis em compras a partir de R$323,00.
          </p>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#2E5EA6] to-[#7BA33E]" />
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-5 max-w-6xl mx-auto items-start mb-10">
          {/* CARD 1 — Cápsulas */}
          <article
            id="card-capsulas"
            className="lg:col-span-5 bg-white rounded-2xl border border-[#E8ECF1] p-7 sm:p-9 flex flex-col shadow-xl lg:-translate-y-2"
          >
            <span className="inline-block self-start text-xs font-semibold uppercase tracking-wide text-white bg-[#1B3A6B] px-3 py-1 rounded-full mb-4">
              Fórmula principal
            </span>
            <div className="h-56 sm:h-64 rounded-xl bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF1] flex items-center justify-center overflow-hidden mb-5">
              <img src={capsulasImg} alt="LipoVitta Cápsulas" className="h-full w-full object-contain" loading="lazy" />
            </div>

            <h3 className="font-sans font-semibold text-2xl sm:text-3xl text-[#1B3A6B] mb-2">
              LipoVitta Cápsulas
            </h3>
            <p className="font-sans font-normal text-[#555] text-base mb-4">
              A fórmula principal da rotina LipoVitta. Apoia o cuidado diário com circulação, sensação de pernas pesadas e bem-estar.
            </p>
            <ul className="space-y-2 mb-5">
              {["Contém Dimpless® patenteado", "Frete grátis incluso", "Garantia de 30 dias"].map((b) => (
                <li key={b} className="flex items-start gap-2 text-[#333] text-sm sm:text-base">
                  <Check className="w-5 h-5 text-[#7BA33E] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <div className="mb-4">
                <p className="text-[#1B3A6B] font-extrabold text-3xl sm:text-4xl leading-none">R$357,00</p>
                <p className="text-sm text-[#666] mt-1">ou 3x de R$119,00 sem juros</p>
              </div>
              <a
                href={LINK_CAPSULAS}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-[#7BA33E] hover:bg-[#6B9334] text-white font-bold rounded-full transition-colors text-base sm:text-lg py-4 sm:py-5 min-h-[56px]"
              >
                COMEÇAR MINHA ROTINA
              </a>
              <p className="text-xs text-[#777] text-center mt-3">
                Adicione Shot Matinal, Gummy ou Shot Rush logo abaixo.
              </p>
            </div>
          </article>

          {/* CARD 2 — Protocolo Completo */}
          <article
            id="card-protocolo"
            className="lg:col-span-4 relative bg-white rounded-2xl border-2 border-[#7BA33E] p-6 sm:p-7 flex flex-col shadow-2xl"
          >
            {/* Mancha orgânica decorativa (clipada dentro do card) */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <svg
                aria-hidden="true"
                className="hidden md:block absolute -bottom-16 -right-12 w-64 h-64"
                viewBox="0 0 400 400"
              >
                <path
                  d="M327,275 C297,343 215,377 145,355 C75,333 30,265 42,196 C54,127 117,68 190,62 C263,56 340,108 357,176 C374,244 357,207 327,275 Z"
                  fill="#8FAE82"
                  opacity="0.08"
                />
              </svg>
            </div>

            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 max-w-[95%]">
              <span className="bg-[#7BA33E] text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow">
                MAIS ESCOLHIDO
              </span>
              <span className="bg-[#1B3A6B] text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow">
                Economia de R$79,05
              </span>
            </div>


            <div className="h-44 sm:h-52 rounded-xl bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF1] flex items-center justify-center overflow-hidden mb-5 mt-2">
              <img src={comboImg} alt="Cápsulas LipoVitta com Shot Matinal" className="h-full w-full object-contain" loading="lazy" />
            </div>
            <h3 className="font-sans font-semibold text-2xl sm:text-3xl text-[#1B3A6B] mb-1">
              Protocolo Completo LipoVitta
            </h3>
            <p className="font-sans font-medium text-[#2E5EA6] text-sm sm:text-base mb-3">
              Cápsula + Shot Matinal. A rotina completa em um único pedido.
            </p>
            <p className="font-sans font-normal text-[#555] text-sm sm:text-base mb-4">
              A combinação pensada para quem quer começar com a rotina completa: a Cápsula como base diária e o Shot Matinal apoiando o início da manhã.
            </p>
            <ul className="space-y-2 mb-5">
              <li className="flex items-start gap-2 text-[#1B3A6B] font-semibold text-sm sm:text-base">
                <Check className="w-5 h-5 text-[#7BA33E] shrink-0 mt-0.5" />
                <span>LipoVitta Cápsulas (fórmula principal)</span>
              </li>
              <li className="flex items-start gap-2 text-[#1B3A6B] font-semibold text-sm sm:text-base">
                <Check className="w-5 h-5 text-[#7BA33E] shrink-0 mt-0.5" />
                <span>Shot Matinal (ritual da manhã)</span>
              </li>
              {["Frete grátis incluso", "Economia de R$79,05 em relação à compra separada", "Garantia de 30 dias"].map((b) => (
                <li key={b} className="flex items-start gap-2 text-[#333] text-sm sm:text-base">
                  <Check className="w-5 h-5 text-[#7BA33E] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="bg-[#F5F7FA] rounded-xl p-4 mb-4 space-y-1.5">
              <div className="flex justify-between text-sm text-[#666]">
                <span>Comprando separado:</span>
                <span className="line-through">R$527,00</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-semibold text-[#1B3A6B]">
                <span>No Protocolo:</span>
                <span>R$447,95</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-[#7BA33E] pt-1.5 border-t border-[#E8ECF1]">
                <span>Você economiza:</span>
                <span>R$79,05</span>
              </div>
            </div>

            <div className="mt-auto">
              <div className="mb-4">
                <span className="text-[#999] line-through text-sm mr-2">R$527,00</span>
                <p className="text-[#1B3A6B] font-extrabold text-3xl sm:text-4xl leading-none">R$447,95</p>
                <p className="text-sm text-[#666] mt-1">ou 3x de R$166,08 sem juros</p>
              </div>
              <a
                href={LINK_PROTOCOLO}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-[#7BA33E] hover:bg-[#6B9334] text-white font-bold rounded-full transition-colors text-base py-4 min-h-[52px]"
              >
                ESCOLHER PROTOCOLO COMPLETO
              </a>
              <p className="text-xs text-[#777] text-center mt-3">
                A escolha de 7 em cada 10 clientes.
              </p>
            </div>
          </article>

          {/* CARD 3 — Shot Matinal */}
          <article
            id="card-shot"
            className="lg:col-span-3 bg-white rounded-2xl border border-[#E8ECF1] p-5 sm:p-6 flex flex-col shadow-sm lg:translate-y-6"
          >
            <span className="inline-block self-start text-xs font-medium text-[#666] border border-[#D1D5DB] px-3 py-1 rounded-full mb-4">
              Complemento matinal
            </span>
            <div className="h-32 sm:h-36 rounded-xl bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF1] flex items-center justify-center gap-2 px-2 overflow-hidden mb-2">
              <img src={shotMatinalAbacaxiImg} alt="Shot Matinal LipoVitta sabor Abacaxi" className="h-full w-auto object-contain" loading="lazy" />
              <img src={shotMatinalLimaoImg} alt="Shot Matinal LipoVitta sabor Limão" className="h-full w-auto object-contain" loading="lazy" />
              <img src={shotMatinalTangerinaImg} alt="Shot Matinal LipoVitta sabor Tangerina" className="h-full w-auto object-contain" loading="lazy" />
            </div>
            <p className="text-xs text-center text-[#666] mb-4">Sabores: Abacaxi, Limão e Tangerina</p>

            <h3 className="font-sans font-semibold text-xl sm:text-2xl text-[#1B3A6B] mb-2">
              Shot Matinal LipoVitta
            </h3>
            <p className="font-sans font-normal text-[#555] text-sm mb-4">
              Apoia o início da manhã com cuidado para inchaço matinal, intestino e disposição. Pensado para combinar com a Cápsula LipoVitta.
            </p>
            <ul className="space-y-2 mb-5">
              {["Suporte para a manhã", "Sabor agradável", "Fácil de incluir na rotina"].map((b) => (
                <li key={b} className="flex items-start gap-2 text-[#333] text-sm">
                  <Check className="w-4 h-4 text-[#7BA33E] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <div className="mb-4">
                <p className="text-[#1B3A6B] font-bold text-2xl sm:text-3xl leading-none">R$170,00</p>
                <p className="text-xs sm:text-sm text-[#666] mt-1">ou 3x de R$63,03 sem juros</p>
              </div>
              <a
                href={LINK_SHOT}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center border-2 border-[#2E5EA6] text-[#2E5EA6] hover:bg-[#2E5EA6] hover:text-white font-bold rounded-full transition-colors text-sm py-3 min-h-[48px]"
              >
                ADICIONAR À MINHA ROTINA
              </a>
              <p className="text-xs text-[#777] text-center mt-3">
                Combine com a Cápsula para liberar frete grátis e economizar R$79,05 escolhendo o Protocolo Completo.
              </p>
              <a
                href="#card-protocolo"
                className="block text-center text-xs text-[#2E5EA6] underline underline-offset-2 hover:text-[#1B3A6B] mt-2"
              >
                Ver Protocolo Completo
              </a>
            </div>
          </article>
        </div>

        {/* Guarantee Block */}
        <div className="max-w-3xl mx-auto bg-white border border-[#E8ECF1] rounded-2xl p-6 text-center mb-6 shadow-sm">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="w-7 h-7 text-[#2E5EA6]" />
            <span className="text-lg font-bold text-[#1B3A6B]">Garantia de 30 dias</span>
          </div>
          <p className="text-[#555] text-sm max-w-lg mx-auto">
            Se não fizer sentido para a sua rotina, devolvemos seu dinheiro. Sem perguntas.
          </p>
        </div>

        {/* Trust Seals */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: Lock, text: "Compra segura" },
            { icon: Truck, text: "Envio rápido para todo o Brasil" },
            { icon: CreditCard, text: "Até 3x sem juros" },
            { icon: Shield, text: "Garantia de 30 dias" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-[#E8ECF1]"
            >
              <Icon className="w-4 h-4 text-[#2E5EA6]" />
              <span className="text-xs sm:text-sm font-semibold text-[#1B3A6B]">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
