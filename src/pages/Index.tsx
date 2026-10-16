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

import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AffiliateFloatingButton from "@/components/AffiliateFloatingButton";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import PreBlackHomeBanner from "@/components/PreBlackHomeBanner";
import PreBlackLiveHero from "@/components/pre-black/PreBlackLiveHero";
import { resolvePreBlackPhase } from "@/config/preBlack";
import { usePreBlackPhase } from "@/hooks/usePreBlackPhase";
import { useLocation } from "react-router-dom";


const Index = () => {
  const { search } = useLocation();
  const { phase: forced, demo } = resolvePreBlackPhase(search);
  const phase = usePreBlackPhase(demo ? forced : undefined);
  const live = phase === "live";

  return (
  <GiftFlowProvider>
    <div className="min-h-screen bg-background">
        <SEOHead
          title={live ? "Pré Black LipoVitta — ofertas no ar" : "Comprar LipoVitta - Oferta Exclusiva"}
          description={live
            ? "A Pré Black LipoVitta começou. Escolha seu kit e aproveite as condições disponíveis, com brindes especiais."
            : "Adquira LipoVitta com desconto exclusivo. Frete grátis, garantia de 30 dias e resultados comprovados. Aproveite a promoção limitada!"}
          keywords="comprar LipoVitta, LipoVitta preço, LipoVitta onde comprar"
          ogType="product"
          canonicalUrl="https://lipovitta.site/"
        />
      <Navbar />
      {!live && <PreBlackHomeBanner />}
      <main>
        {/* Hero: versão comercial Pré-Black após a abertura; hero padrão antes */}
        {live ? <PreBlackLiveHero offersHref="#precos" trackLocation="home_live" /> : <HeroSection />}

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
  </GiftFlowProvider>
  );
};

export default Index;
