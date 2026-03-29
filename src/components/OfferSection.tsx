import { useState } from "react";
import { Shield, Lock, Truck, CreditCard } from "lucide-react";

type Product = {
  name: string;
  oldPrice?: string;
  price: string;
  installment: string;
  link: string;
  extras?: string;
  badge?: string;
};

const individuais: Product[] = [
  { name: "LipoVitta Cápsula", oldPrice: "R$357", price: "R$321,30", installment: "3x R$119,13", link: "https://clarinhacbr.lojavirtualnuvem.com.br/produtos/lipovitta/" },
  { name: "Shot Matinal", price: "R$170", installment: "3x R$63,03", link: "https://clarinhacbr.lojavirtualnuvem.com.br/produtos/shot-matinal-lipovitta/" },
  { name: "Gummy VittaGlow", oldPrice: "R$289", price: "R$260", installment: "3x R$96,33", link: "https://clarinhacbr.lojavirtualnuvem.com.br/produtos/gummy-skin-glow/" },
  { name: "Shot Rush", oldPrice: "R$250", price: "R$225", installment: "3x R$75", link: "https://clarinhacbr.lojavirtualnuvem.com.br/produtos/shot-rush-pre-treino/" },
];

const kitsDuplos: Product[] = [
  { name: "2x LipoVitta", oldPrice: "R$714", price: "R$585", installment: "3x R$216,90", link: "https://clarinhacbr.lojavirtualnuvem.com.br/produtos/2-potes-de-lipovitta/" },
  { name: "2x Shot Matinal", oldPrice: "R$340", price: "R$323", installment: "3x R$110,86", extras: "+ Mixer", link: "https://clarinhacbr.lojavirtualnuvem.com.br/produtos/2-shot-matinal-lipovitta/" },
  { name: "2x Shot Rush", oldPrice: "R$500", price: "R$425", installment: "3x R$141,67", extras: "+ Mixer", link: "https://clarinhacbr.lojavirtualnuvem.com.br/produtos/kit-2-shots-rush-pre-treino/" },
  { name: "2x Gummy VittaGlow", oldPrice: "R$578", price: "R$508,64", installment: "3x R$169,55", extras: "+ Escova", link: "https://clarinhacbr.lojavirtualnuvem.com.br/produtos/kit-duas-gummys-vitaglow/" },
  { name: "Shot Rush + LipoVitta", price: "R$546,30", installment: "3x R$182,10", extras: "+ Raspador", link: "https://clarinhacbr.lojavirtualnuvem.com.br/produtos/shot-rush-lipovitta-capsulas/" },
];

const kitPremium: Product[] = [
  { name: "3x LipoVitta", oldPrice: "R$1.071", price: "R$835", installment: "3x R$309,59", link: "https://clarinhacbr.lojavirtualnuvem.com.br/produtos/3-potes-de-lipovitta/" },
  { name: "Kit Lipolover Full", oldPrice: "R$1.066", price: "R$852,80", installment: "3x R$284,27", extras: "+ Balança", link: "https://clarinhacbr.lojavirtualnuvem.com.br/produtos/kit-lipolover-full/" },
];

const tabs = [
  { key: "individuais", label: "Individuais" },
  { key: "duplos", label: "Kits Duplos" },
  { key: "premium", label: "Kit Premium" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const tabData: Record<TabKey, Product[]> = {
  individuais,
  duplos: kitsDuplos,
  premium: kitPremium,
};

const ProductCard = ({ product }: { product: Product }) => (
  <div className="bg-white rounded-2xl border border-[#E8ECF1] p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow">
    <h4 className="font-bold text-[#1B3A6B] text-lg">{product.name}</h4>
    <div className="flex items-baseline gap-2 flex-wrap">
      {product.oldPrice && (
        <span className="text-[#999] line-through text-sm">{product.oldPrice}</span>
      )}
      <span className="text-[#1B3A6B] font-extrabold text-2xl">{product.price}</span>
    </div>
    <p className="text-sm text-[#555]">ou {product.installment} sem juros</p>
    {product.extras && (
      <span className="inline-block text-xs font-semibold text-[#7BA33E] bg-[#7BA33E]/10 px-3 py-1 rounded-full w-fit">
        {product.extras}
      </span>
    )}
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-auto block text-center bg-[#7BA33E] hover:bg-[#6B9334] text-white font-bold py-3 rounded-full transition-colors text-sm"
    >
      COMPRAR AGORA
    </a>
  </div>
);

const OfferSection = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("individuais");

  return (
    <section id="precos" className="py-16 sm:py-20" style={{ background: "#F5F7FA" }}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1B3A6B] mb-3">
            Escolha o kit ideal para sua transformação
          </h2>
          <p className="text-[#666] max-w-xl mx-auto">
            Aproveite o preço exclusivo de lançamento — oferta por tempo limitado!
          </p>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#2E5EA6] to-[#7BA33E]" />
        </div>

        {/* Featured Card */}
        <div className="max-w-2xl mx-auto mb-10 bg-white rounded-2xl border-2 border-[#7BA33E] p-6 sm:p-8 shadow-xl relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7BA33E] text-white text-xs font-bold px-4 py-1 rounded-full">
            ⭐ MAIS VENDIDO
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[#1B3A6B] mt-2 mb-1">
            Kit LipoVitta + Shot Matinal
          </h3>
          <p className="text-sm text-[#555] mb-4">
            1 pote LipoVitta + 1 pote Shot Matinal + Raspador de língua grátis
          </p>
          <div className="flex items-baseline gap-3 mb-1 flex-wrap">
            <span className="text-[#999] line-through text-lg">R$527</span>
            <span className="text-[#1B3A6B] font-extrabold text-3xl sm:text-4xl">R$447,95</span>
            <span className="text-sm text-[#555]">à vista</span>
          </div>
          <p className="text-sm text-[#555] mb-3">ou 3x R$166,08 sem juros</p>
          <span className="inline-block text-xs font-semibold text-[#7BA33E] bg-[#7BA33E]/10 px-3 py-1 rounded-full mb-5">
            Economize R$79,05
          </span>
          <a
            href="https://clarinhacbr.lojavirtualnuvem.com.br/produtos/shot-matinal-lipovitta1/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center bg-[#7BA33E] hover:bg-[#6B9334] text-white font-bold py-4 rounded-full transition-colors text-lg"
          >
            COMPRAR AGORA COM DESCONTO
          </a>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-[#2E5EA6] text-white"
                  : "bg-white text-[#2E5EA6] border border-[#2E5EA6]/30 hover:bg-[#2E5EA6]/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto mb-12">
          {tabData[activeTab].map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>

        {/* Guarantee Bar */}
        <div className="bg-[#1B3A6B] rounded-2xl p-6 text-center text-white mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="w-8 h-8" />
            <span className="text-lg font-bold">Garantia de 30 dias</span>
          </div>
          <p className="text-white/80 text-sm max-w-lg mx-auto">
            Se não sentir diferença, devolvemos seu dinheiro. Sem perguntas.
          </p>
        </div>

        {/* Trust Seals */}
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { icon: Lock, text: "Compra Segura" },
            { icon: Truck, text: "Envio Rápido" },
            { icon: CreditCard, text: "Até 3x sem juros" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 bg-white rounded-full px-5 py-2.5 shadow-sm"
            >
              <Icon className="w-5 h-5 text-[#2E5EA6]" />
              <span className="text-sm font-semibold text-[#1B3A6B]">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
