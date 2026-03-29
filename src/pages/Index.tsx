import UrgencyBar from "@/components/UrgencyBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

const Index = () => (
  <div className="min-h-screen bg-background">
    <UrgencyBar />
    <Navbar />
    <main>
      <HeroSection />
    </main>
  </div>
);

export default Index;
