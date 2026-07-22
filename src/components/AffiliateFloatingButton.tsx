import { Link } from "react-router-dom";

const AffiliateFloatingButton = () => (
  <Link
    to="/afiliados"
    aria-label="Seja Afiliada LipoVitta"
    className="fixed bottom-24 right-6 z-50 inline-flex items-center gap-2 rounded-full px-4 h-12 text-white text-sm font-semibold shadow-lg hover:brightness-110 transition"
    style={{ backgroundColor: "#4667B4" }}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M4 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
    Seja Afiliada
  </Link>
);

export default AffiliateFloatingButton;
