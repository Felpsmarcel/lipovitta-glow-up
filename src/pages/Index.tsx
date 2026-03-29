import UrgencyBar from "@/components/UrgencyBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BenefitsSection from "@/components/BenefitsSection";
import ForWhoSection from "@/components/ForWhoSection";
import HowToUseSection from "@/components/HowToUseSection";
import IngredientsSection from "@/components/IngredientsSection";
import ProductsSection from "@/components/ProductsSection";

const Index = () => (
  <div className="min-h-screen bg-background">
    <UrgencyBar />
    <Navbar />
    <main>
      <HeroSection />
      <TestimonialsSection />
      <BenefitsSection />
      <ForWhoSection />
      <HowToUseSection />
      <IngredientsSection />
      <ProductsSection />
    </main>
  </div>
);

export default Index;
