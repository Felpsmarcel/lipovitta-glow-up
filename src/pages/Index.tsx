import UrgencyBar from "@/components/UrgencyBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/TestimonialsSection";

const Index = () => (
  <div className="min-h-screen bg-background">
    <UrgencyBar />
    <Navbar />
    <main>
      <HeroSection />
      <TestimonialsSection />
    </main>
  </div>
);

export default Index;
