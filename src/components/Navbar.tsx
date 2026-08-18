import { useState, useEffect } from "react";
import lipovittaLogo from "@/assets/lipovitta-logo.png.asset.json";
import { trackCtaClick } from "@/lib/tracking";

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
          width={160}
          height={40}
          className="h-10 w-auto max-w-[150px] sm:max-w-none object-contain rounded"
          loading="eager"
          decoding="async"
        />

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#precos"
            onClick={(e) => {
              e.preventDefault();
              trackCtaClick({ location: "navbar", label: "COMPRAR AGORA" });
              document.getElementById("precos")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex whitespace-nowrap font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full transition-colors text-white"
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
