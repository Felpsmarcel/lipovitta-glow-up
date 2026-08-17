import CountdownTimer from "./CountdownTimer";
import { usePromo } from "@/context/PromoContext";
import { Cake, Gift, Truck } from "lucide-react";

const UrgencyBar = () => {
  const { isPromoActive, endsAt } = usePromo();

  if (isPromoActive) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#4667B4] to-[#9BAE52] text-white py-2 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
          <span className="inline-flex items-center gap-1.5 font-bold text-xs sm:text-sm">
            <Cake className="w-4 h-4" />
            ANIVERSÁRIO LIPOVITTA
          </span>
          <span className="hidden sm:inline text-white/60">|</span>
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm">
            <Gift className="w-3.5 h-3.5" />
            Até 40% OFF automático
          </span>
          <span className="hidden sm:inline text-white/60">|</span>
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm">
            <Truck className="w-3.5 h-3.5" />
            PAC grátis &gt; R$400
          </span>
          <CountdownTimer targetDate={endsAt} className="text-white" />
        </div>
      </div>
    );
  }

  const targetDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-accent text-accent-foreground py-2 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
        <span className="font-bold text-xs sm:text-sm">
          OFERTA DE LANÇAMENTO — Desconto exclusivo por tempo limitado!
        </span>
        <CountdownTimer targetDate={targetDate} />
      </div>
    </div>
  );
};

export default UrgencyBar;
