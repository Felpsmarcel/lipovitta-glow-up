import logoImg from "@/assets/logo-lipovitta.png";

const Navbar = () => (
  <nav className="sticky top-[44px] sm:top-[40px] z-40 bg-card/95 backdrop-blur-sm border-b border-border">
    <div className="container mx-auto flex items-center justify-between py-3 px-4">
      <img src={logoImg} alt="LipoVitta por Clara Caldas" className="h-10 sm:h-12 w-auto" />
      <a
        href="#cta"
        className="hidden sm:inline-flex bg-accent text-accent-foreground font-bold text-sm px-5 py-2 rounded-full hover:bg-accent-light transition-colors"
      >
        Comprar Agora
      </a>
    </div>
  </nav>
);

export default Navbar;
