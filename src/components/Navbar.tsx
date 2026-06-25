import { useState, useEffect } from "react";
import lipovittaLogo from "@/assets/lipovitta-logo.png.asset.json";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-[44px] sm:top-[40px] z-40 backdrop-blur-sm border-b transition-colors duration-300 ${
        scrolled ? "border-transparent" : "border-border"
      }`}
      style={{ backgroundColor: scrolled ? "#4667B4" : "rgba(255,255,255,0.95)" }}
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-4 gap-3">
        <img
          src={lipovittaLogo.url}
          alt="LipoVitta por Clara Caldas"
          className="h-10 w-auto rounded"
          loading="lazy"
        />
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#card-kit-rush-top"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("card-kit-rush-top")?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full transition-colors ${
              scrolled ? "text-white hover:bg-white/15" : "text-[#4667B4] hover:bg-[#EEF2FA]"
            }`}
          >
            <span className="inline-block text-[9px] font-bold uppercase tracking-wide text-white bg-[#E63946] px-1.5 py-0.5 rounded-full">Novo</span>
            Kit Rush
          </a>
          <a
            href="#precos"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("precos")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex font-bold text-sm px-5 py-2 rounded-full transition-colors text-white"
            style={{ backgroundColor: "#9BAE52" }}
          >
            COMPRAR AGORA
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
