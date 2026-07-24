import { Check, Gift as GiftIcon } from "lucide-react";
import { useGiftFlow } from "@/context/GiftFlowContext";
import { appendGiftUtm, getEligibleGifts } from "@/data/gifts";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { generateEventId, trackEvent } from "@/lib/metaPixel";

const GiftSelectionSection = () => {
  const { selectedKit, selectedGiftId, setSelectedGiftId } = useGiftFlow();

  if (!selectedKit) return null;

  const eligible = getEligibleGifts(selectedKit.productCount);
  const selectedGift = eligible.find((g) => g.id === selectedGiftId) ?? null;

  const handleCheckout = () => {
    if (!selectedGift) return;
    const eventId = generateEventId();
    trackEvent(
      "InitiateCheckout",
      {
        content_ids: selectedKit.sku ? [selectedKit.sku] : undefined,
        content_name: selectedKit.name,
        content_type: "product",
        currency: "BRL",
        value: selectedKit.value,
        num_items: selectedKit.productCount,
        gift: selectedGift.utm,
      },
      { eventID: eventId }
    );
    const url = appendGiftUtm(selectedKit.checkoutUrl, selectedGift.utm, eventId);
    window.open(url, "_blank", "noopener");
  };

  return (
    <section
      id="escolha-brinde"
      className="scroll-mt-24 py-16 md:py-20 bg-gradient-brand-soft"
      aria-label="Escolha do brinde"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#4667B4] bg-white border border-[#D9E2F1] px-3 py-1.5 rounded-full mb-4">
            <GiftIcon className="w-3.5 h-3.5" /> Etapa final · {selectedKit.name}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#4667B4] mb-3">
            Seu cuidado vem com um presente.
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#555]">
            Quanto mais completa sua rotina, mais especial seu presente. Escolha o seu abaixo — você leva um.
          </p>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            eligible.length >= 4 ? "lg:grid-cols-4" : eligible.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
          } gap-4 sm:gap-5 max-w-5xl mx-auto`}
        >
          {eligible.map((gift) => {
            const isSelected = gift.id === selectedGiftId;
            return (
              <button
                key={gift.id}
                type="button"
                onClick={() => setSelectedGiftId(gift.id)}
                aria-pressed={isSelected}
                className={`relative text-left bg-white rounded-2xl overflow-hidden transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4667B4] ${
                  isSelected
                    ? "border-2 border-[#4667B4] shadow-xl scale-[1.02]"
                    : "border border-[#E8ECF1] shadow-sm hover:shadow-md hover:border-[#9BAE52]"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-[#4667B4] text-white flex items-center justify-center shadow-md">
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </span>
                )}
                <div className="aspect-square bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF1] flex items-center justify-center p-6">
                  <ResponsiveImage
                    picture={gift.image}
                    alt={gift.nome}
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-sans font-bold text-lg text-[#4667B4] mb-1">{gift.nome}</h3>
                  <p className="font-quote text-sm text-[#9BAE52]">{gift.linha}</p>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-sm text-[#777] mt-6 max-w-xl mx-auto">
          Você escolhe 1 presente por pedido. O presente é enviado junto com seu kit.
        </p>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleCheckout}
            disabled={!selectedGift}
            className={`inline-block text-white font-bold text-base sm:text-lg px-10 py-4 rounded-full shadow-md transition-all duration-300 ${
              selectedGift
                ? "bg-gradient-brand hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
                : "bg-[#B7BFC9] opacity-70 cursor-not-allowed"
            }`}
          >
            Finalizar minha compra
          </button>
        </div>
      </div>
    </section>
  );
};

export default GiftSelectionSection;
