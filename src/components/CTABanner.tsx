import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const CTABanner = () => {
  const ref = useScrollAnimation();
  return (
    <div ref={ref} className="py-10 md:py-14 px-4 text-center bg-gradient-brand-soft">
      <a
        data-animate
        href="#precos"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("precos")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="inline-block text-white font-bold text-base md:text-lg px-10 py-4 rounded-full shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl animate-pulse-cta bg-gradient-brand"
      >
        ESCOLHER MEU KIT
      </a>
    </div>
  );
};

export default CTABanner;

