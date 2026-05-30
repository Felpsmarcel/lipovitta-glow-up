import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
}

export const SEOHead = ({
  title,
  description,
  keywords = "lipedema, tratamento lipedema, suplemento lipedema, LipoVitta, lipovita, edema nas pernas, gordura localizada",
  ogImage = "https://cdn.abacus.ai/images/4b9c67ed-695b-4262-881c-483c94f51e98.png",
  ogType = "website",
  canonicalUrl,
}: SEOHeadProps) => {
  const siteName = "LipoVitta";
  const fullTitle = `${title} | ${siteName}`;
  const siteUrl = "https://lipovitta.site";
  const canonical = canonicalUrl || siteUrl;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#9b87f5" />

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="pt_BR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <link rel="canonical" href={canonical} />
    </Helmet>
  );
};

export default SEOHead;
