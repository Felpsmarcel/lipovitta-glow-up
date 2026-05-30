import { MessageCircle, Mail } from "lucide-react";

const ContactSection = () => (
  <section className="pt-10 md:pt-14 pb-16 md:pb-24 bg-[#1B3A6B]">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#7BA33E] mb-8">
        Ficou com dúvida?
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
        <a
          href="https://wa.me/5571996150401"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 rounded-xl p-5 transition-colors"
        >
          <MessageCircle className="w-6 h-6 text-[#25D366]" />
          <span className="text-white font-semibold">(71) 9 9615-0401</span>
        </a>
        <a
          href="mailto:lipovitta@clarinhacbr.com.br"
          className="flex-1 flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 rounded-xl p-5 transition-colors"
        >
          <Mail className="w-6 h-6 text-[#2E5EA6]" />
          <span className="text-white font-semibold text-sm sm:text-base">lipovitta@clarinhacbr.com.br</span>
        </a>
      </div>
    </div>
  </section>
);

export default ContactSection;
