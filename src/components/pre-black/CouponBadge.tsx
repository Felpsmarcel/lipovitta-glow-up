import { usePreBlackCampaign } from "@/context/PreBlackCampaignContext";
import { PRE_BLACK_COUPON } from "@/config/campaignPricing";

/** Selo 30% OFF + cupom, visível somente com a Pré Black no ar. */
export default function CouponBadge({ className = "" }: { className?: string }) {
  const { phase } = usePreBlackCampaign();
  if (phase !== "live") return null;
  return (
    <div className={`flex flex-wrap items-center gap-2 rounded-xl bg-[#1B2A4A] px-3 py-2 text-white ${className}`}>
      <span className="font-extrabold text-lg leading-none text-[#9BAE52]">30% OFF</span>
      <span className="text-xs leading-tight">
        com o cupom <strong className="tracking-wide">{PRE_BLACK_COUPON}</strong> no checkout
      </span>
    </div>
  );
}
