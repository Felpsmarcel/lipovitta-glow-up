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

import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ExitIntentPopup from "@/components/ExitIntentPopup";

const Index = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Tratamento Natural para Lipedema"
      description="LipoVitta: Suplemento natural clinicamente testado para reduzir sintomas do lipedema. Alívio da dor, redução do inchaço e melhora da circulação. Fórmula exclusiva com ingredientes naturais."
      keywords="lipedema tratamento, suplemento para lipedema, como tratar lipedema, lipedema tem cura, LipoVitta"
      ogType="website"
      canonicalUrl="https://lipovitta.site/"
    />
    <Navbar />
    <main>
      <HeroSection />
      <RoutineSection />
      <TestimonialsSection />
      <BenefitsSection />
      <CTABanner />
      <ForWhoSection />
      <HowToUseSection />
      <IngredientsSection />
      <CTABanner />
      <OfferSection />
      <ProductsSection />
      <FAQSection />
      
    </main>
    <Footer />
    <WhatsAppButton />
    <ExitIntentPopup />
  </div>
);

export default Index;
