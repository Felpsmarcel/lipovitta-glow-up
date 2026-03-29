const CTABanner = () => (
  <div className="py-10 px-4 text-center" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F5F7FA 100%)" }}>
    <a
      href="#precos"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById("precos")?.scrollIntoView({ behavior: "smooth" });
      }}
      className="inline-block text-white font-bold text-base md:text-lg px-10 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl animate-pulse-cta"
      style={{ backgroundColor: "#7BA33E" }}
    >
      QUERO MINHA TRANSFORMAÇÃO
    </a>
  </div>
);

export default CTABanner;
