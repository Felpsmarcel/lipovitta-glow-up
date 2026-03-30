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
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ExitIntentPopup from "@/components/ExitIntentPopup";


const Index = () => (
  <div className="min-h-screen bg-background">
    <UrgencyBar />
    <div className="h-[44px] sm:h-[40px]" />
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
      <ProductsSection />
      <OfferSection />
      <FAQSection />
      <ContactSection />
    </main>
    <Footer />
    <WhatsAppButton />
    <ExitIntentPopup />
  </div>
);

export default Index;
