import CountdownTimer from "./CountdownTimer";

const targetDate = new Date(Date.now() + 48 * 60 * 60 * 1000);

const UrgencyBar = () => (
  <div className="fixed top-0 left-0 right-0 z-50 bg-accent text-accent-foreground py-2 px-4">
    <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
      <span className="font-bold text-xs sm:text-sm">
        🔥 OFERTA DE LANÇAMENTO — Desconto exclusivo por tempo limitado!
      </span>
      <CountdownTimer targetDate={targetDate} />
    </div>
  </div>
);

export default UrgencyBar;
