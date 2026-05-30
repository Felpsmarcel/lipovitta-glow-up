import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const faqs = [
  {
    q: "O Lipovitta vai funcionar pra mim?",
    a: "O LipoVitta é um suplemento alimentar com ativos naturais selecionados para fazer parte de uma rotina de cuidado diário. Os resultados variam de pessoa para pessoa e ele não substitui orientação médica. Por isso oferecemos garantia de 30 dias: se não fizer sentido para a sua rotina, devolvemos seu dinheiro.",
  },
  {
    q: "Em quanto tempo terei resultados?",
    a: "Varia de organismo para organismo. Algumas clientes relatam sensação de leveza nas primeiras semanas. O uso contínuo, aliado a hábitos saudáveis, potencializa os efeitos percebidos.",
  },
  {
    q: "Como devo usar o LipoVitta?",
    a: "1 cápsula por dia, após o café da manhã, com um copo cheio de água. Uso diário potencializa os efeitos.",
  },
  {
    q: "Como usar o Shot Matinal?",
    a: "1 dose (5g) diluída em água, logo ao acordar em jejum. Uso diário fortalece imunidade e reduz inflamações.",
  },
  {
    q: "Tem contraindicação?",
    a: "Gestantes, lactantes e pessoas com restrições devem consultar um profissional. Quem usa medicamentos para diabetes ou anticoagulantes deve ter acompanhamento médico.",
  },
  {
    q: "Qual a garantia?",
    a: "Oferecemos garantia de 30 dias. Se não sentir diferença, devolvemos seu dinheiro sem perguntas.",
  },
];

const FAQSection = () => {
  const ref = useScrollAnimation();
  return (
  <section ref={ref} className="py-16 sm:py-20" style={{ background: "#F5F7FA" }}>
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1B3A6B] mb-3">
          Perguntas Frequentes
        </h2>
        <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-[#2E5EA6] to-[#7BA33E]" />
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="bg-white rounded-xl border border-[#E8ECF1] px-5 overflow-hidden"
          >
            <AccordionTrigger className="font-sans font-semibold text-base text-left text-[#1B3A6B] hover:no-underline [&>svg]:text-[#2E5EA6]">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="font-sans font-normal text-base text-[#555] leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
  );
};

export default FAQSection;
