import { ShieldCheck, Truck, BadgeCheck } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const seals = [
  {
    icon: ShieldCheck,
    title: "Compra Segura",
    subtitle: "Pagamento criptografado e ambiente protegido.",
  },
  {
    icon: Truck,
    title: "Frete Grátis",
    subtitle: "Em compras acima de R$323,00 para todo o Brasil.",
  },
  {
    icon: BadgeCheck,
    title: "Garantia 30 dias",
    subtitle: "Não gostou? Devolvemos seu dinheiro sem perguntas.",
  },
];

const TrustBar = () => {
  const ref = useScrollAnimation();
  return (
    <section ref={ref} className="bg-white py-14 md:py-20 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {seals.map(({ icon: Icon, title, subtitle }) => (
          <div
            data-animate
            key={title}
            className="relative bg-white rounded-2xl p-6 overflow-hidden text-center md:text-left shadow-[0_8px_24px_rgba(70,103,180,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(70,103,180,0.14)]"
          >
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: "linear-gradient(90deg, #4667B4, #9BAE52)" }}
              aria-hidden="true"
            />
            <div className="flex items-center gap-4">
              <div
                className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(70, 103, 180, 0.12)" }}
              >
                <Icon size={26} color="#9BAE52" strokeWidth={2.2} />
              </div>
              <div className="flex-1">
                <h3
                  className="font-sans font-semibold text-base md:text-lg"
                  style={{ color: "#4667B4" }}
                >
                  {title}
                </h3>
                <p
                  className="font-sans font-normal text-sm leading-relaxed mt-0.5"
                  style={{ color: "#666" }}
                >
                  {subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBar;
