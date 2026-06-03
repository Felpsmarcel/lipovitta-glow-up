import logoImg from "@/assets/logo-lipovitta.png";
import { paymentIcons } from "@/components/PaymentIcons";

const institutionalLinks = [
  { label: "Política de Privacidade", href: "#" },
  { label: "Termos de Uso", href: "#" },
];

const helpLinks = [
  { key: "trocas", label: "Trocas e Devoluções", href: "#" },
  {
    key: "telefone",
    label: <span className="whitespace-nowrap">(71) 9 9615-0401</span>,
    href: "https://wa.me/5571996150401",
    external: true,
  },
  {
    key: "email",
    label: "lipovitta@clarinhacbr.com.br",
    href: "mailto:lipovitta@clarinhacbr.com.br",
  },
];

const Footer = () => (
  <footer className="relative bg-[#4667B4] py-14 md:py-20">
    {/* Linha-costura gradiente no topo */}
    <div
      aria-hidden="true"
      className="absolute top-0 left-0 right-0 h-[2px]"
      style={{ background: "linear-gradient(90deg, #4667B4, #9BAE52)" }}
    />

    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
        {/* Marca */}
        <div className="md:col-span-4">
          <img
            src={logoImg}
            alt="LipoVitta"
            className="h-10 mb-5"
            style={{ maxWidth: 180, filter: "brightness(0) invert(1)" }}
          />
          <p className="text-white/75 text-sm leading-relaxed max-w-xs">
            Cuidado diário para mulheres que convivem com lipedema. Criado por
            Clara Caldas.
          </p>
          <p className="text-white/55 text-xs leading-relaxed max-w-xs mt-3">
            Este produto não substitui orientação médica. Resultados individuais
            podem variar.
          </p>
        </div>

        {/* Institucional */}
        <div className="md:col-span-2">
          <h3 className="text-xs uppercase tracking-[2px] font-semibold mb-4" style={{ color: "#B8C77A" }}>
            Institucional
          </h3>
          <ul className="space-y-2.5">
            {institutionalLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-white/80 text-sm hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Ajuda */}
        <div className="md:col-span-3">
          <h3 className="text-xs uppercase tracking-[2px] font-semibold mb-4" style={{ color: "#B8C77A" }}>
            Ajuda
          </h3>
          <ul className="space-y-2.5">
            {helpLinks.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="text-white/80 text-sm hover:text-white transition-colors break-all"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Pagamento */}
        <div className="md:col-span-3">
          <h3 className="text-xs uppercase tracking-[2px] font-semibold mb-4" style={{ color: "#B8C77A" }}>
            Formas de pagamento
          </h3>
          <div className="flex flex-wrap gap-2">
            {paymentIcons.map(({ name, Icon }) => (
              <div
                key={name}
                title={name}
                className="bg-white rounded-md px-2 h-8 flex items-center justify-center shadow-sm"
                style={{ minWidth: 44 }}
              >
                <Icon className="h-5 w-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/15 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-white/60 text-xs text-center md:text-left">
          © 2026 LipoVitta por Clara Caldas. Todos os direitos reservados.
        </p>
        <p className="text-white/60 text-xs">
          Feito com cuidado para mulheres reais.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
