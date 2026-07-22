import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import logoImg from "@/assets/logo-lipovitta.png";
import AffiliateForm from "@/components/affiliates/AffiliateForm";
import PartnerForm from "@/components/affiliates/PartnerForm";

type Tab = "afiliada" | "parceiro";

const Afiliados = () => {
  const [tab, setTab] = useState<Tab>("afiliada");

  const isAffiliate = tab === "afiliada";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Programa de Afiliadas e Parceiros LipoVitta"
        description="Cadastre-se como afiliada ou parceiro comercial LipoVitta. Divulgue ou revenda produtos de cuidado para lipedema."
        canonicalUrl="https://lipovitta.site/afiliados"
      />

      <header className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImg} alt="LipoVitta" className="h-9 w-auto" />
          </Link>
          <Link to="/" className="text-sm text-[#4667B4] hover:underline font-medium">
            ← Voltar ao site
          </Link>
        </div>
      </header>

      <main className="flex-1 py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold uppercase tracking-[2px] text-[#9BAE52] mb-4">
              {isAffiliate ? "Programa de Afiliadas" : "Parceiros Comerciais"}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-[#4667B4] leading-tight mb-4">
              {isAffiliate ? "Seja afiliada LipoVitta" : "Seja parceiro LipoVitta"}
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed max-w-lg mx-auto">
              {isAffiliate
                ? "Divulgue uma marca criada com cuidado para mulheres reais que convivem com lipedema. Preencha o formulário e nossa equipe entra em contato pelo WhatsApp."
                : "Para farmácias, clínicas, nutricionistas, personal trainers e lojas de suplementos interessadas em revenda ou parceria com a LipoVitta."}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white border border-border rounded-full p-1 shadow-sm">
              <TabBtn active={tab === "afiliada"} onClick={() => setTab("afiliada")}>
                Afiliada (Creator)
              </TabBtn>
              <TabBtn active={tab === "parceiro"} onClick={() => setTab("parceiro")}>
                Parceiro Comercial
              </TabBtn>
            </div>
          </div>

          {isAffiliate ? <AffiliateForm /> : <PartnerForm />}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const TabBtn = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 md:px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
      active
        ? "text-white"
        : "text-[#4667B4] hover:bg-[#4667B4]/5"
    }`}
    style={active ? { backgroundColor: "#4667B4" } : undefined}
  >
    {children}
  </button>
);

export default Afiliados;

// Re-export shared helpers used by both forms
export const STATES = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
export const NOTIFY_EMAIL = "lipovitta@clarinhacbr.com.br";

export const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-xs uppercase tracking-[1.5px] font-semibold text-[#4667B4] mb-2">
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
  </div>
);

export const inputCls = (err?: string) =>
  `w-full rounded-lg border px-4 py-3 text-sm bg-white outline-none transition-colors ${
    err
      ? "border-red-400 focus:border-red-500"
      : "border-border focus:border-[#4667B4]"
  }`;

export const SuccessCard = ({ title, message }: { title: string; message: string }) => (
  <div className="bg-white border border-[#9BAE52]/40 rounded-2xl p-8 md:p-10 text-center shadow-sm">
    <div className="w-14 h-14 rounded-full bg-[#9BAE52]/15 flex items-center justify-center mx-auto mb-4">
      <svg className="w-7 h-7 text-[#9BAE52]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h2 className="font-serif text-2xl text-[#4667B4] mb-2">{title}</h2>
    <p className="text-muted-foreground text-sm mb-6">{message}</p>
    <Link
      to="/"
      className="inline-flex font-semibold text-sm px-5 py-2.5 rounded-full text-white transition-colors"
      style={{ backgroundColor: "#4667B4" }}
    >
      Voltar ao site
    </Link>
  </div>
);
