import { Shield, Check, Tag } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import capsulasImg from "@/assets/capsulas-lipovitta.png";
import shotMatinalAbacaxiImg from "@/assets/shot-matinal-abacaxi.jpg";
import shotMatinalLimaoImg from "@/assets/shot-matinal-limao.jpg";
import shotMatinalTangerinaImg from "@/assets/shot-matinal-tangerina.jpg";
import comboImg from "@/assets/combo-lipovitta.png.asset.json";
import kitShotRushImg from "@/assets/kit-shot-rush-capsulas.png.asset.json";
import { useGiftFlow, type SelectedKit } from "@/context/GiftFlowContext";

const LINK_CAPSULAS = "https://seguro.lipovitta.site/r/RMTIX51GQN";
const LINK_PROTOCOLO = "https://seguro.lipovitta.site/b/RPQ0CD6N6Q8C";
const LINK_SHOT = "https://seguro.lipovitta.site/r/PW60UM0Y2J";
const LINK_KIT_RUSH = "https://seguro.lipovitta.site/b/3QUPWLJZ74U8";

const KIT_CAPSULAS: SelectedKit = { id: "capsulas", name: "LipoVitta Cápsulas", productCount: 1, checkoutUrl: LINK_CAPSULAS };
const KIT_SHOT: SelectedKit = { id: "shot-matinal", name: "Shot Matinal LipoVitta", productCount: 1, checkoutUrl: LINK_SHOT };
const KIT_RUSH: SelectedKit = { id: "kit-rush", name: "Kit Shot Rush + Cápsulas", productCount: 2, checkoutUrl: LINK_KIT_RUSH };
const KIT_PROTOCOLO: SelectedKit = { id: "protocolo", name: "Protocolo Completo LipoVitta", productCount: 3, checkoutUrl: LINK_PROTOCOLO };

const OfferSection = () => {
  const sectionRef = useScrollAnimation();
  const { selectKit } = useGiftFlow();

  return (
    <section ref={sectionRef} id="precos" className="pt-24 md:pt-32 pb-16 md:pb-20" style={{ background: "#F5F7FA" }}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#4667B4] mb-3">
            Comece sua rotina LipoVitta
          </h2>
          <p className="font-sans font-normal text-[#555] text-base sm:text-lg">
            Escolha como quer começar. Você pode adicionar complementos depois.
          </p>
          <p className="font-sans font-normal text-sm text-[#888] mt-2">
            Frete grátis em compras a partir de R$323,00.
          </p>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#4667B4] to-[#9BAE52]" />
        </div>

        {/* CARD 4 — Kit Shot Rush + Cápsulas (destacado no topo) */}
        <div className="max-w-6xl mx-auto mb-10 scroll-mt-32" id="kit-rush-anchor">
          <article
            id="card-kit-rush-top"
            className="relative bg-white rounded-2xl border border-[#E8ECF1] overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 scroll-mt-32"
          >
            <div className="lg:col-span-12 bg-gradient-to-r from-[#4667B4] to-[#9BAE52] text-white text-center py-2 text-xs sm:text-sm font-bold uppercase tracking-wide">
              Novo Kit · Energia + Base diária do Sistema LipoVitta
            </div>

            <div className="lg:col-span-5 relative bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF1] flex items-center justify-center p-4 sm:p-6 min-h-[280px]">
              <img
                src={kitShotRushImg.url}
                alt="Kit Shot Rush sabor Melancia + Cápsulas LipoVitta"
                className="w-full h-full max-h-[420px] object-contain"
                loading="lazy"
              />
            </div>

            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col">
              <span className="inline-block self-start text-xs font-semibold uppercase tracking-wide text-white bg-[#E63946] px-3 py-1 rounded-full mb-3">
                Sabor Melancia
              </span>
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-[#4667B4] mb-2 leading-tight">
                Kit Shot Rush + Cápsulas LipoVitta
              </h3>
              <p className="font-sans text-[#4667B4] font-medium text-sm sm:text-base mb-3">
                Energia, vitalidade e cuidado corporal em uma rotina só.
              </p>
              <p className="font-sans text-[#555] text-sm sm:text-base mb-4">
                Une o Shot Rush sabor Melancia (disposição e performance) com a Cápsula LipoVitta, motor do Sistema LipoVitta por Clara Caldas.
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {["Zero açúcares", "Sem glúten", "Sem lactose", "180g", "30 cápsulas"].map((s) => (
                  <span
                    key={s}
                    className="text-[11px] sm:text-xs font-semibold text-[#4667B4] bg-[#EEF2FA] border border-[#D9E2F1] px-2.5 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mb-5">
                <ul className="space-y-2">
                  <li className="text-xs font-bold uppercase tracking-wide text-[#888] mb-1">O que vem</li>
                  <li className="flex items-start gap-2 text-[#333] text-sm">
                    <Check className="w-4 h-4 text-[#9BAE52] shrink-0 mt-0.5" />
                    <span>1 Shot Rush sabor Melancia (180g)</span>
                  </li>
                  <li className="flex items-start gap-2 text-[#333] text-sm">
                    <Check className="w-4 h-4 text-[#9BAE52] shrink-0 mt-0.5" />
                    <span>1 Cápsulas LipoVitta (30 cápsulas)</span>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="text-xs font-bold uppercase tracking-wide text-[#888] mb-1">Pensado para</li>
                  {[
                    "Energia e disposição diária",
                    "Vitalidade e vigor na rotina",
                    "Apoio à constância no Sistema LipoVitta",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[#333] text-sm">
                      <Check className="w-4 h-4 text-[#9BAE52] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-4 border-t border-[#EEF2FA] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className="text-[#4667B4] font-extrabold text-3xl sm:text-4xl leading-none">R$546,30</p>
                  <p className="text-sm text-[#666] mt-1">ou 3x de R$182,10 sem juros</p>
                </div>
                <button
                  type="button"
                  onClick={() => selectKit(KIT_RUSH)}
                  className="inline-block text-center bg-[#9BAE52] hover:bg-[#8A9D45] text-white font-bold rounded-full transition-colors text-base sm:text-lg px-8 py-4 min-h-[56px] shadow-md"
                >
                  COMPRAR KIT AGORA
                </button>
              </div>
              <p className="text-xs text-[#777] mt-3">
                Frete grátis · Garantia de 30 dias
              </p>
            </div>
          </article>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-5 max-w-6xl mx-auto items-start mb-10">
          {/* CARD 1 — Cápsulas */}
          <article
            id="card-capsulas"
            className="lg:col-span-5 bg-white rounded-2xl border border-[#E8ECF1] p-7 sm:p-9 flex flex-col shadow-xl lg:-translate-y-2"
          >
            <span className="inline-block self-start text-xs font-semibold uppercase tracking-wide text-white bg-[#4667B4] px-3 py-1 rounded-full mb-4">
              Fórmula principal
            </span>
            <div className="h-56 sm:h-64 rounded-xl bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF1] flex items-center justify-center overflow-hidden mb-5">
              <img src={capsulasImg} alt="LipoVitta Cápsulas" className="h-full w-full object-contain" loading="lazy" />
            </div>

            <h3 className="font-sans font-semibold text-2xl sm:text-3xl text-[#4667B4] mb-2">
              LipoVitta Cápsulas
            </h3>
            <p className="font-sans font-normal text-[#555] text-base mb-4">
              A fórmula principal da rotina LipoVitta. Apoia o cuidado diário com circulação, sensação de pernas pesadas e bem-estar.
            </p>
            <ul className="space-y-2 mb-5">
              {["Contém Dimpless® patenteado", "Frete grátis incluso", "Garantia de 30 dias"].map((b) => (
                <li key={b} className="flex items-start gap-2 text-[#333] text-sm sm:text-base">
                  <Check className="w-5 h-5 text-[#9BAE52] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 bg-[#9BAE52] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-2 shadow-sm">
                  <Tag className="w-3.5 h-3.5" />
                  10% OFF comprando hoje
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[#999] line-through text-sm">R$357,00</span>
                  <p className="text-[#4667B4] font-extrabold text-3xl sm:text-4xl leading-none">R$321,30</p>
                  <span className="inline-flex items-center bg-[#e8f5e0] text-[#4a7c2e] text-xs font-bold px-2.5 py-1 rounded-full">
                    Economize 10%
                  </span>
                </div>
                <p className="text-sm text-[#666] mt-1">ou 3x de R$107,10 sem juros</p>
              </div>
              <button
                type="button"
                onClick={() => selectKit(KIT_CAPSULAS)}
                className="block w-full text-center bg-[#9BAE52] hover:bg-[#8A9D45] text-white font-bold rounded-full transition-colors text-base sm:text-lg py-4 sm:py-5 min-h-[56px]"
              >
                COMEÇAR MINHA ROTINA
              </button>
              <p className="text-xs text-[#777] text-center mt-3">
                Adicione Shot Matinal, Gummy ou Shot Rush logo abaixo.
              </p>
            </div>
          </article>

          {/* CARD 2 — Protocolo Completo */}
          <article
            id="card-protocolo"
            className="lg:col-span-4 relative bg-white rounded-2xl border-2 border-[#9BAE52] p-6 sm:p-7 flex flex-col shadow-2xl"
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
              <span className="bg-[#9BAE52] text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow">
                MAIS ESCOLHIDO
              </span>
              <span className="bg-[#4667B4] text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow">
                Economize 10%
              </span>
            </div>


            <button
              type="button"
              onClick={() => selectKit(KIT_PROTOCOLO)}
              aria-label="Escolher Protocolo Completo LipoVitta"
              className="block w-full h-44 sm:h-52 rounded-xl bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF1] overflow-hidden mb-5 mt-2 transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#9BAE52]"
            >
              <img src={comboImg.url} alt="Cápsulas LipoVitta com Shot Matinal" className="h-full w-full object-contain" loading="lazy" />
            </button>
            <h3 className="font-sans font-semibold text-2xl sm:text-3xl text-[#4667B4] mb-1">
              Protocolo Completo LipoVitta
            </h3>
            <p className="font-sans font-medium text-[#4667B4] text-sm sm:text-base mb-3">
              Cápsula + Shot Matinal. A rotina completa em um único pedido.
            </p>
            <p className="font-sans font-normal text-[#555] text-sm sm:text-base mb-4">
              A combinação pensada para quem quer começar com a rotina completa: a Cápsula como base diária e o Shot Matinal apoiando o início da manhã.
            </p>
            <ul className="space-y-2 mb-5">
              <li className="flex items-start gap-2 text-[#4667B4] font-semibold text-sm sm:text-base">
                <Check className="w-5 h-5 text-[#9BAE52] shrink-0 mt-0.5" />
                <span>LipoVitta Cápsulas (fórmula principal)</span>
              </li>
              <li className="flex items-start gap-2 text-[#4667B4] font-semibold text-sm sm:text-base">
                <Check className="w-5 h-5 text-[#9BAE52] shrink-0 mt-0.5" />
                <span>Shot Matinal (ritual da manhã)</span>
              </li>
              {["Cápsula + Shot juntos em um pedido", "Frete grátis incluso", "Garantia de 30 dias"].map((b) => (
                <li key={b} className="flex items-start gap-2 text-[#333] text-sm sm:text-base">
                  <Check className="w-5 h-5 text-[#9BAE52] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 bg-[#9BAE52] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-2 shadow-sm">
                  <Tag className="w-3.5 h-3.5" />
                  10% OFF comprando hoje
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[#999] line-through text-sm">R$527,00</span>
                  <p className="text-[#4667B4] font-extrabold text-3xl sm:text-4xl leading-none">R$474,30</p>
                  <span className="inline-flex items-center bg-[#e8f5e0] text-[#4a7c2e] text-xs font-bold px-2.5 py-1 rounded-full">
                    Economize 10%
                  </span>
                </div>
                <p className="text-sm text-[#666] mt-1">ou 3x de R$158,10 sem juros</p>
              </div>
              <button
                type="button"
                onClick={() => selectKit(KIT_PROTOCOLO)}
                className="block w-full text-center bg-[#9BAE52] hover:bg-[#8A9D45] text-white font-bold rounded-full transition-colors text-base py-4 min-h-[52px]"
              >
                ESCOLHER PROTOCOLO COMPLETO
              </button>
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

            <h3 className="font-sans font-semibold text-xl sm:text-2xl text-[#4667B4] mb-2">
              Shot Matinal LipoVitta
            </h3>
            <p className="font-sans font-normal text-[#555] text-sm mb-4">
              Apoia o início da manhã com cuidado para inchaço matinal, intestino e disposição. Pensado para combinar com a Cápsula LipoVitta.
            </p>
            <ul className="space-y-2 mb-5">
              {["Suporte para a manhã", "Sabor agradável", "Fácil de incluir na rotina"].map((b) => (
                <li key={b} className="flex items-start gap-2 text-[#333] text-sm">
                  <Check className="w-4 h-4 text-[#9BAE52] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 bg-[#9BAE52] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-2 shadow-sm">
                  <Tag className="w-3.5 h-3.5" />
                  10% OFF comprando hoje
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[#999] line-through text-xs">R$170,00</span>
                  <p className="text-[#4667B4] font-bold text-2xl sm:text-3xl leading-none">R$153,00</p>
                  <span className="inline-flex items-center bg-[#e8f5e0] text-[#4a7c2e] text-[11px] font-bold px-2 py-0.5 rounded-full">
                    Economize 10%
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#666] mt-1">ou 3x de R$51,00 sem juros</p>
              </div>
              <a
                href={LINK_SHOT}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center border-2 border-[#4667B4] text-[#4667B4] hover:bg-[#4667B4] hover:text-white font-bold rounded-full transition-colors text-sm py-3 min-h-[48px]"
              >
                ADICIONAR À MINHA ROTINA
              </a>
              <p className="text-xs text-[#777] text-center mt-3">
                Combine com a Cápsula para liberar frete grátis escolhendo o Protocolo Completo.
              </p>
              <a
                href="#card-protocolo"
                className="block text-center text-xs text-[#4667B4] underline underline-offset-2 hover:text-[#4667B4] mt-2"
              >
                Ver Protocolo Completo
              </a>
            </div>
          </article>
        </div>




        {/* Guarantee Block */}
        <div className="max-w-3xl mx-auto bg-white border border-[#E8ECF1] rounded-2xl p-6 text-center mb-6 shadow-sm">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="w-7 h-7 text-[#4667B4]" />
            <span className="text-lg font-bold text-[#4667B4]">Garantia de 30 dias</span>
          </div>
          <p className="text-[#555] text-sm max-w-lg mx-auto">
            Se não fizer sentido para a sua rotina, devolvemos seu dinheiro. Sem perguntas.
          </p>
        </div>

        <p className="max-w-3xl mx-auto text-[11px] text-[#888] text-center leading-relaxed px-4">
          Este produto não é medicamento. Não substitui uma alimentação equilibrada. Não tem finalidade de diagnosticar, tratar, curar ou prevenir doenças. Gestantes, lactantes, crianças, pessoas com doenças ou em uso de medicamentos devem consultar um profissional de saúde antes do uso.
        </p>
      </div>
    </section>

  );
};

export default OfferSection;
