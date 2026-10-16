import { useEffect, useState } from "react";
import { getPreBlackPhase, type PreBlackPhase } from "@/config/preBlack";

/**
 * Fase reativa da campanha: reavalia a cada segundo e ao voltar à aba,
 * para a virada acontecer mesmo com a página já aberta. Cleanup completo.
 */
export function usePreBlackPhase(forced?: PreBlackPhase): PreBlackPhase {
  const [phase, setPhase] = useState<PreBlackPhase>(() => forced ?? getPreBlackPhase());
  useEffect(() => {
    if (forced) {
      setPhase(forced);
      return;
    }
    let timer: ReturnType<typeof setInterval> | undefined;
    const update = () => setPhase(getPreBlackPhase());
    const visibility = () => {
      clearInterval(timer);
      update();
      if (!document.hidden) timer = setInterval(update, 1000);
    };
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [forced]);
  return forced ?? phase;
}
