import { useEffect, useState } from "react";
import { getPreBlackCountdown } from "@/config/preBlack";

export default function PreBlackCountdown() {
  const [countdown, setCountdown] = useState(() => getPreBlackCountdown());
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const update = () => setCountdown(getPreBlackCountdown());
    const visibility = () => {
      clearInterval(timer);
      update();
      if (!document.hidden) timer = setInterval(update, 1000);
    };
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  const units = [[countdown.days, "Dias"], [countdown.hours, "Horas"], [countdown.minutes, "Minutos"], [countdown.seconds, "Segundos"]] as const;
  return (
    <div className="pb-clock-wrap">
      <div className="pb-clock" role="timer" aria-label={countdown.started ? "A Pré Black já começou" : "Tempo até a Pré Black"}>
        {units.map(([value, label]) => <div className="pb-clock-unit" key={label}><span>{String(value).padStart(2, "0")}</span><small>{label}</small></div>)}
      </div>
      {countdown.started && <p className="pb-started" role="status">A Pré Black começou. Confira as ofertas no grupo VIP.</p>}
    </div>
  );
}