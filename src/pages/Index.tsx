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

import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ExitIntentPopup from "@/components/ExitIntentPopup";

const Index = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Comprar LipoVitta - Oferta Exclusiva"
      description="Adquira LipoVitta com desconto exclusivo. Frete grátis, garantia de 30 dias e resultados comprovados. Aproveite a promoção limitada!"
      keywords="comprar LipoVitta, LipoVitta preço, LipoVitta onde comprar"
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
      <CTABanner />

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
      <CTABanner />

      {/* Offer: light grey */}
      <OfferSection />

      {/* Products: branco */}
      <ProductsSection />

      {/* → FAQ: AZUL */}
      <SectionSwoosh direction="white-to-blue" />
      <FAQSection />
      <SectionSwoosh direction="blue-to-white" />
    </main>
    <Footer />
    <WhatsAppButton />
    <ExitIntentPopup />
  </div>
);

export default Index;
