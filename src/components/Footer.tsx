import logoImg from "@/assets/logo-lipovitta.png";

const Footer = () => (
  <footer className="bg-[#0F2847] py-10">
    <div className="container mx-auto px-4 text-center">
      <img src={logoImg} alt="LipoVitta" className="h-10 mx-auto mb-5" style={{ maxWidth: 180 }} />
      <p className="text-[#999] text-xs max-w-lg mx-auto mb-3 leading-relaxed">
        Este produto não substitui orientação médica. Resultados individuais podem variar.
      </p>
      <p className="text-[#999] text-xs mb-4">
        © 2026 LipoVitta por Clara Caldas. Todos os direitos reservados.
      </p>
      <div className="flex justify-center gap-4">
        <a href="#" className="text-[#7BA33E] text-xs hover:underline">Política de Privacidade</a>
        <span className="text-[#999] text-xs">|</span>
        <a href="#" className="text-[#7BA33E] text-xs hover:underline">Termos de Uso</a>
      </div>
    </div>
  </footer>
);

export default Footer;
