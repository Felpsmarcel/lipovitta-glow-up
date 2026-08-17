import { usePromo } from "@/context/PromoContext";
import { Gift, ShoppingBag, Package } from "lucide-react";

interface PromoDiscountRulerProps {
  activeCount?: number;
}

const tiers = [
  { count: 1, discount: 20, icon: ShoppingBag, label: "1 produto" },
  { count: 2, discount: 30, icon: Gift, label: "2 produtos" },
  { count: 3, discount: 40, icon: Package, label: "3+ produtos" },
];

const PromoDiscountRuler = ({ activeCount }: PromoDiscountRulerProps) => {
  const { isPromoActive } = usePromo();
  if (!isPromoActive) return null;

  return (
    <div className="max-w-3xl mx-auto mb-10">
      <div className="bg-white rounded-2xl border border-[#E8ECF1] p-4 sm:p-6 shadow-sm">
        <p className="text-center text-sm sm:text-base font-semibold text-[#4667B4] mb-4">
          Quanto mais produtos, maior o desconto — automático, sem cupom:
        </p>
        <div className="grid grid-cols-3 gap-3">
          {tiers.map((tier) => {
            const isActive = activeCount === tier.count || (tier.count === 3 && (activeCount ?? 0) >= 3);
            const Icon = tier.icon;
            return (
              <div
                key={tier.count}
                className={`relative text-center rounded-xl p-3 sm:p-4 transition-colors ${
                  isActive
                    ? "bg-gradient-to-br from-[#4667B4] to-[#9BAE52] text-white shadow-md"
                    : "bg-[#F5F7FA] text-[#4667B4]"
                }`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-2 ${isActive ? "text-white" : "text-[#9BAE52]"}`} />
                <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-1">{tier.label}</p>
                <p className="text-lg sm:text-2xl font-extrabold leading-none">{tier.discount}%</p>
                <p className="text-[10px] sm:text-xs font-medium mt-1 opacity-90">OFF</p>
                {isActive && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#E63946] text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    Você aqui
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PromoDiscountRuler;
