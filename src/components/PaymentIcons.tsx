// Inline SVG payment brand icons. Simplified marks designed to read clearly
// at small sizes inside white pill containers.

type IconProps = { className?: string };

const base = "block";

export const VisaIcon = ({ className = "" }: IconProps) => (
  <svg
    role="img"
    aria-label="Visa"
    viewBox="0 0 48 16"
    className={`${base} ${className}`}
  >
    <title>Visa</title>
    <text
      x="24"
      y="13"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="14"
      fontStyle="italic"
      fill="#1A1F71"
      letterSpacing="0.5"
    >
      VISA
    </text>
  </svg>
);

export const MastercardIcon = ({ className = "" }: IconProps) => (
  <svg
    role="img"
    aria-label="Mastercard"
    viewBox="0 0 48 28"
    className={`${base} ${className}`}
  >
    <title>Mastercard</title>
    <circle cx="19" cy="14" r="9" fill="#EB001B" />
    <circle cx="29" cy="14" r="9" fill="#F79E1B" />
    <path
      d="M24 7.5a9 9 0 0 1 0 13 9 9 0 0 1 0-13z"
      fill="#FF5F00"
    />
  </svg>
);

export const EloIcon = ({ className = "" }: IconProps) => (
  <svg
    role="img"
    aria-label="Elo"
    viewBox="0 0 48 28"
    className={`${base} ${className}`}
  >
    <title>Elo</title>
    <circle cx="24" cy="14" r="11" fill="#000000" />
    <circle cx="24" cy="14" r="4" fill="#FFF200" />
    <path d="M20 14a4 4 0 0 1 4-4v3a1 1 0 0 0-1 1z" fill="#EF4123" />
    <path d="M28 14a4 4 0 0 1-4 4v-3a1 1 0 0 0 1-1z" fill="#00A4E0" />
  </svg>
);

export const AmexIcon = ({ className = "" }: IconProps) => (
  <svg
    role="img"
    aria-label="American Express"
    viewBox="0 0 48 28"
    className={`${base} ${className}`}
  >
    <title>American Express</title>
    <rect x="0" y="0" width="48" height="28" rx="3" fill="#2E77BB" />
    <text
      x="24"
      y="17"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="8"
      fill="#FFFFFF"
      letterSpacing="0.5"
    >
      AMEX
    </text>
  </svg>
);

export const PixIcon = ({ className = "" }: IconProps) => (
  <svg
    role="img"
    aria-label="Pix"
    viewBox="0 0 48 28"
    className={`${base} ${className}`}
  >
    <title>Pix</title>
    <g transform="translate(4 2)">
      <path
        d="M12 0l5 5-3 3a3 3 0 0 0-4 0L7 5l5-5z"
        fill="#32BCAD"
      />
      <path
        d="M24 12l-5 5-3-3a3 3 0 0 0 0-4l3-3 5 5z"
        fill="#32BCAD"
      />
      <path
        d="M12 24l-5-5 3-3a3 3 0 0 0 4 0l3 3-5 5z"
        fill="#32BCAD"
      />
      <path
        d="M0 12l5-5 3 3a3 3 0 0 0 0 4l-3 3-5-5z"
        fill="#32BCAD"
      />
    </g>
    <text
      x="34"
      y="17"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="800"
      fontSize="9"
      fill="#32BCAD"
    >
      pix
    </text>
  </svg>
);

export const BoletoIcon = ({ className = "" }: IconProps) => (
  <svg
    role="img"
    aria-label="Boleto"
    viewBox="0 0 48 28"
    className={`${base} ${className}`}
  >
    <title>Boleto</title>
    <g fill="#1A1A1A">
      <rect x="4" y="6" width="2" height="16" />
      <rect x="8" y="6" width="1" height="16" />
      <rect x="11" y="6" width="3" height="16" />
      <rect x="16" y="6" width="1" height="16" />
      <rect x="19" y="6" width="2" height="16" />
      <rect x="23" y="6" width="1" height="16" />
      <rect x="26" y="6" width="3" height="16" />
      <rect x="31" y="6" width="1" height="16" />
      <rect x="34" y="6" width="2" height="16" />
      <rect x="38" y="6" width="3" height="16" />
      <rect x="43" y="6" width="1" height="16" />
    </g>
  </svg>
);

export const paymentIcons = [
  { name: "Visa", Icon: VisaIcon },
  { name: "Mastercard", Icon: MastercardIcon },
  { name: "Elo", Icon: EloIcon },
  { name: "Amex", Icon: AmexIcon },
  { name: "Pix", Icon: PixIcon },
  { name: "Boleto", Icon: BoletoIcon },
];
