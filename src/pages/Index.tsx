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
      title="Suplemento Natural para Lipedema, Celulite e Inchaço"
      description="LipoVitta: suplemento 100% natural com Curcumina, Dimpless® e Resveratrol para reduzir inchaço, celulite e sintomas do lipedema. Resultados que você sente e vê."
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
