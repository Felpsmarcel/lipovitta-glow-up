import claraPreBlack from "@/assets/clara-foto.jpg";
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
import { usePreBlackCampaign, PreBlackDemoNotice } from "@/context/PreBlackCampaignContext";


const Index = () => {
  const { phase } = usePreBlackCampaign();
  const live = phase === "live";

  return (
  <GiftFlowProvider>
    <div className={`min-h-screen bg-background${live ? " lipovitta-campaign" : ""}`}>
      <PreBlackDemoNotice />
        <SEOHead
          title={live ? "Pré Black LipoVitta — 30% OFF em todos os produtos" : "Pré Black LipoVitta — 18/10 às 8h"}
          description={live
            ? "A Pré Black LipoVitta começou: 30% OFF em todos os produtos. Escolha seus favoritos e aproveite."
            : "A Pré Black LipoVitta começa em 18/10 às 8h da Bahia: 30% OFF em todos os produtos."}
          keywords="comprar LipoVitta, LipoVitta preço, LipoVitta onde comprar"
          ogType="product"
          canonicalUrl="https://lipovitta.site/"
        />
      <Navbar />
      <PreBlackHomeBanner />
      <main>
        {/* Hero: versão comercial Pré-Black após a abertura; hero padrão antes */}
        {live ? (
          <div className="pre-black pre-black-live">
            <PreBlackLiveHero offersHref="#precos" trackLocation="home_live" />
          </div>
        ) : (
          <HeroSection />
        )}

        {live && <><OfferSection /><ProductsSection /><GiftSelectionSection /></>}

        {live && <section className="pb-clara" aria-labelledby="pb-clara-title"><div className="pb-clara-inner">
          <img src={claraPreBlack} alt="Clara Caldas com as Cápsulas LipoVitta" width="900" height="1600" loading="lazy" />
          <div><small>LipoVitta por Clara Caldas</small><h2 id="pb-clara-title">Seu cuidado.<br />Sua rotina. Sua LipoVitta.</h2><p>Cápsulas, Shot Matinal e Shot Rush: escolha os produtos que combinam com a sua rotina e aproveite 30% de desconto na Pré Black.</p><a href="#precos">ESCOLHER MEUS FAVORITOS</a></div>
        </div></section>}

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
        {!live && <><OfferSection /><ProductsSection /><GiftSelectionSection /></>}

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

      {!live && <ExitIntentPopup />}
    </div>
  </GiftFlowProvider>
  );
};

export default Index;
