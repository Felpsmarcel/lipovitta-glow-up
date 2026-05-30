import logoImg from "@/assets/logo-lipovitta.png";

const institutionalLinks = [
  { label: "Política de Privacidade", href: "#" },
  { label: "Termos de Uso", href: "#" },
];

const helpLinks = [
  { key: "trocas", label: "Trocas e Devoluções", href: "#" },
  { key: "telefone", label: <span className="whitespace-nowrap">(71) 9 9615-0401</span>, href: "https://wa.me/5571996150401", external: true },
  { key: "email", label: "lipovitta@clarinhacbr.com.br", href: "mailto:lipovitta@clarinhacbr.com.br" },
];

const paymentMethods = ["Visa", "Mastercard", "Elo", "Amex", "Pix", "Boleto"];

const Footer = () => (
  <footer className="bg-[#0F2847] py-12 md:py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        {/* Marca */}
        <div className="md:col-span-1">
          <img
            src={logoImg}
            alt="LipoVitta"
            className="h-9 mb-4"
            style={{ maxWidth: 160 }}
          />
          <p className="text-white/70 text-xs leading-relaxed max-w-xs">
            Este produto não substitui orientação médica. Resultados individuais podem variar.
          </p>
        </div>

        {/* Institucional */}
        <div>
          <h3 className="text-white text-xs uppercase tracking-wider font-semibold mb-4">
            Institucional
          </h3>
          <ul className="space-y-2">
            {institutionalLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-white/70 text-xs leading-relaxed hover:text-[#7BA33E] transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Ajuda */}
        <div>
          <h3 className="text-white text-xs uppercase tracking-wider font-semibold mb-4">
            Ajuda
          </h3>
          <ul className="space-y-2">
            {helpLinks.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="text-white/70 text-xs leading-relaxed hover:text-[#7BA33E] transition-colors break-all"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Pagamento */}
        <div>
          <h3 className="text-white text-xs uppercase tracking-wider font-semibold mb-4">
            Formas de pagamento
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="border border-white/15 text-white/60 text-[10px] uppercase tracking-wide px-2 py-1 rounded-sm"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-10 pt-6">
        <p className="text-white/50 text-xs text-center md:text-left">
          © 2026 LipoVitta por Clara Caldas. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
