import { SEOHead } from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RoutineSection from "@/components/RoutineSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BenefitsSection from "@/components/BenefitsSection";
import CTABanner from "@/components/CTABanner";
import ForWhoSection from "@/components/ForWhoSection";
import HowToUseSection from "@/components/HowToUseSection";
import IngredientsSection from "@/components/IngredientsSection";
import ProductsSection from "@/components/ProductsSection";
import OfferSection from "@/components/OfferSection";
import FAQSection from "@/components/FAQSection";
import SectionSwoosh from "@/components/SectionSwoosh";
import TrustBar from "@/components/TrustBar";
import GiftSelectionSection from "@/components/GiftSelectionSection";
import { GiftFlowProvider } from "@/context/GiftFlowContext";
import { PromoProvider } from "@/context/PromoContext";

import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AffiliateFloatingButton from "@/components/AffiliateFloatingButton";
import ExitIntentPopup from "@/components/ExitIntentPopup";

const isAugust2026 = () => {
  const now = new Date();
  return now >= new Date("2026-08-01T00:00:00-03:00") && now <= new Date("2026-08-31T23:59:59-03:00");
};

const Index = () => (
  <GiftFlowProvider>
    <PromoProvider>
      <div className="min-h-screen bg-background">
        <SEOHead
          title={isAugust2026() ? "Aniversário LipoVitta - Até 40% OFF" : "Comprar LipoVitta - Oferta Exclusiva"}
          description={isAugust2026() ? "Aniversário LipoVitta em agosto: desconto progressivo automático de até 40% OFF + PAC grátis acima de R$400. Sem cupom, válido só este mês!" : "Adquira LipoVitta com desconto exclusivo. Frete grátis, garantia de 30 dias e resultados comprovados. Aproveite a promoção limitada!"}
          keywords={isAugust2026() ? "LipoVitta aniversário, desconto LipoVitta, promoção LipoVitta agosto" : "comprar LipoVitta, LipoVitta preço, LipoVitta onde comprar"}
          ogType="product"
          canonicalUrl="https://lipovitta.site/"
        />
      <Navbar />
      <main>
        {/* Hero: branco */}
        <HeroSection />

        {/* Routine: light grey */}
        <RoutineSection />

        {/* Testimonials: branco (denso) */}
        <TestimonialsSection />

        {/* → Benefits: AZUL */}
        <SectionSwoosh direction="white-to-blue" />
        <BenefitsSection />

        {/* → CTA: branco/soft */}
        <SectionSwoosh direction="blue-to-white" />
        <CTABanner location="banner_beneficios" eyebrow="Quer sentir isso na sua rotina?" label="VER A CÁPSULA LIPOVITTA" />


        {/* → ForWho: AZUL */}
        <SectionSwoosh direction="white-to-blue" />
        <ForWhoSection />

        {/* → HowToUse: branco */}
        <SectionSwoosh direction="blue-to-white" />
        <HowToUseSection />

        {/* → Ingredients: AZUL */}
        <SectionSwoosh direction="white-to-blue" />
        <IngredientsSection />

        {/* → CTA: branco/soft */}
        <SectionSwoosh direction="blue-to-white" />
        <CTABanner location="banner_ingredientes" eyebrow="Ingredientes escolhidos com critério. Rotina simples." label="ESCOLHER MEU KIT" />

        {/* Offer: light grey */}
        <OfferSection />

        {/* Escolha de brinde — aparece após clicar em comprar */}
        <GiftSelectionSection />

        {/* Products: branco */}
        <ProductsSection />

        {/* → FAQ: AZUL */}
        <SectionSwoosh direction="white-to-blue" />
        <FAQSection />

        {/* → TrustBar: branco */}
        <SectionSwoosh direction="blue-to-white" />
        <TrustBar />
      </main>

      {/* → Footer: AZUL */}
      <SectionSwoosh direction="white-to-blue" />

      <Footer />
      <WhatsAppButton />
      <AffiliateFloatingButton />

      <ExitIntentPopup />
    </div>
  </PromoProvider>
  </GiftFlowProvider>
);

export default Index;
