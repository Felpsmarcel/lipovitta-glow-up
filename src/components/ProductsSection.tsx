import { Check, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { useGiftFlow, type SelectedKit } from "@/context/GiftFlowContext";
import { usePromo } from "@/context/PromoContext";
import { trackCtaClick } from "@/lib/tracking";
import shotRushImg from "@/assets/shot-rush.jpg?w=300;600;900&format=avif;webp;jpg&as=picture";
import gummyImg from "@/assets/gummy-vittaglow.png?w=300;600;900&format=avif;webp;png&as=picture";

const ProductPrice = ({ kit }: { kit: SelectedKit }) => {
  const { isPromoActive, formatMoney, applyDiscount } = usePromo();
  const discounted = isPromoActive ? applyDiscount(kit.value, kit.productCount) : kit.value;
  return (
    <div className="mb-3">
      {isPromoActive && (
        <span className="inline-flex items-center gap-1.5 bg-[#E63946] text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-1.5">
          <Sparkles className="w-3 h-3" />
          20% OFF automático
        </span>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        {isPromoActive && (
          <span className="text-[#5F5F5F] line-through text-sm">
            R${formatMoney(kit.value)}
          </span>
        )}
        <span className="text-[#4667B4] font-extrabold text-xl">
          R${formatMoney(discounted)}
        </span>
        {isPromoActive && (
          <span className="inline-flex items-center bg-[#e8f5e0] text-[#4a7c2e] text-[10px] font-bold px-2 py-0.5 rounded-full">
            Economize {formatMoney(kit.value - discounted)}
          </span>
        )}
      </div>
      <p className="text-xs text-[#555] mt-1">ou 3x R${formatMoney(discounted / 3)} sem juros</p>
    </div>
  );
};

const KIT_SHOT_RUSH: SelectedKit = {
  id: "shot-rush",
  name: "Shot Rush Pré-Treino",
  productCount: 1,
  checkoutUrl: "https://seguro.lipovitta.site/r/5NYVZ7D8UT",
  value: 225,
  sku: "5NYVZ7D8UT",
};

type Complemento = {
  id: string;
  inStock: boolean;
  render: (onBuy: () => void, kit: SelectedKit) => JSX.Element;
};

const complementos: Complemento[] = [
  {
    id: "shot-rush",
    inStock: true,
    render: (onBuy, kit) => (
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
          <ResponsiveImage
            picture={shotRushImg}
            alt="Frasco do Shot Rush Pré-Treino sabor Frutas Vermelhas"
            className="h-full w-auto object-contain"
            loading="lazy"
            sizes="(min-width: 768px) 400px, 90vw"
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
        <ProductPrice kit={kit} />

        <button
          type="button"
          onClick={onBuy}
          className="mt-auto block w-full text-center border-2 border-[#4667B4] text-[#4667B4] hover:bg-[#4667B4] hover:text-white font-semibold py-2.5 rounded-full transition-colors text-sm"
        >
          COMPRAR SHOT RUSH
        </button>
        <p className="text-[11px] text-[#5F5F5F] text-center mt-2">
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
        <ResponsiveImage picture={gummyImg} alt="" />

      </article>
    ),
  },
];

const ProductsSection = () => {
  const sectionRef = useScrollAnimation();
  const { selectKit } = useGiftFlow();
  const { isPromoActive, applyDiscount } = usePromo();
  const visiveis = complementos.filter((p) => p.inStock);

  const promoShotRush: SelectedKit = {
    ...KIT_SHOT_RUSH,
    value: isPromoActive ? applyDiscount(KIT_SHOT_RUSH.value, KIT_SHOT_RUSH.productCount) : KIT_SHOT_RUSH.value,
  };

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
            {isPromoActive
              ? "PAC grátis em compras acima de R$400. Desconto automático no checkout."
              : "Frete grátis em compras a partir de R$323,00."}
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
          {visiveis.map((p) =>
            p.render(() => {
              trackCtaClick({
                location: "complemento_shot_rush",
                label: "COMPRAR SHOT RUSH",
                productName: promoShotRush.name,
                sku: promoShotRush.sku,
                value: promoShotRush.value,
                eventName: "InitiateCheckout",
              });
              selectKit(promoShotRush);
            }, KIT_SHOT_RUSH)
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
