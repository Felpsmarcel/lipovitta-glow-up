import { createContext, useContext, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { resolvePreBlackPhase, type PreBlackPhase } from "@/config/preBlack";
import { usePreBlackPhase } from "@/hooks/usePreBlackPhase";

const CampaignContext = createContext<{ phase: PreBlackPhase; demo: boolean } | null>(null);

/** One campaign clock for copy, prices, selection and the checkout summary. */
export function PreBlackCampaignProvider({ children }: { children: ReactNode }) {
  const { search } = useLocation();
  const realPhase = usePreBlackPhase();
  const override = resolvePreBlackPhase(search);
  const phase = override.demo ? override.phase : realPhase;
  return <CampaignContext.Provider value={{ phase, demo: override.demo }}>{children}</CampaignContext.Provider>;
}

export function usePreBlackCampaign() {
  const campaign = useContext(CampaignContext);
  if (!campaign) throw new Error("PreBlackCampaignProvider is required");
  return campaign;
}

export function PreBlackDemoNotice() {
  const { demo } = usePreBlackCampaign();
  if (!demo) return null;
  return <p role="status" className="pb-demo-notice">Prévia da campanha · preços de demonstração · checkout desativado nesta visualização.</p>;
}
