import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const faqs = [
  {
    q: "Qual a diferença entre Shot Matinal e Cápsula LipoVitta?",
    a: "O Shot Matinal foi pensado para o início do dia, com foco em inchaço matinal, intestino e disposição. A Cápsula LipoVitta é a fórmula principal da rotina, com suporte diário à circulação, inflamação e aparência da celulite.",
  },
  {
    q: "Preciso comprar os dois?",
    a: "Você pode começar por um produto individual. Mas o Protocolo Completo é o mais escolhido porque combina o cuidado da manhã com o suporte diário da Cápsula.",
  },
  {
    q: "Tenho diagnóstico de lipedema. Posso usar?",
    a: "O LipoVitta foi pensado para mulheres que convivem com sinais associados ao lipedema. Se você tem diagnóstico, faz uso de medicamentos ou possui condição específica, recomendamos conversar com seu profissional de saúde.",
  },
  {
    q: "Serve para quem suspeita de lipedema?",
    a: "O produto pode apoiar uma rotina de cuidado, mas não substitui diagnóstico ou acompanhamento profissional. Se você sente pernas pesadas, inchaço recorrente e celulite dolorosa, vale buscar avaliação especializada.",
  },
  {
    q: "Em quanto tempo posso perceber diferença?",
    a: "A experiência varia de pessoa para pessoa. Muitas mulheres relatam percepção de mais leveza e melhora na rotina com o uso contínuo, especialmente após algumas semanas de constância.",
  },
  {
    q: "Tem glúten ou açúcar?",
    a: "A Cápsula LipoVitta é Sem Glúten. As informações nutricionais completas, incluindo presença de açúcar, estão descritas no rótulo de cada produto. Em caso de dúvida, fale com a gente antes da compra.",
  },
  {
    q: "Posso tomar com outros medicamentos?",
    a: "Se você usa medicamentos, está grávida, amamentando ou possui condição de saúde específica, consulte seu profissional de saúde antes de iniciar o uso.",
  },
  {
    q: "Como funciona a garantia?",
    a: "Você tem garantia de 30 dias conforme as condições informadas na página e no atendimento LipoVitta.",
  },
];


const FAQSection = () => {
  const ref = useScrollAnimation();
  return (
  <section ref={ref} className="pt-14 md:pt-20 pb-14 md:pb-20" style={{ background: "#F5F7FA" }}>
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
