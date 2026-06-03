interface SectionSwooshProps {
  /**
   * white-to-blue: top half is white, swoosh curves into blue below.
   * blue-to-white: top half is blue, swoosh curves into white below.
   */
  direction: "white-to-blue" | "blue-to-white";
  className?: string;
}

const BLUE = "#4667B4";
const GREEN = "#9BAE52";

const SectionSwoosh = ({ direction, className = "" }: SectionSwooshProps) => {
  const isWhiteToBlue = direction === "white-to-blue";
  const topColor = isWhiteToBlue ? "#FFFFFF" : BLUE;
  const bottomColor = isWhiteToBlue ? BLUE : "#FFFFFF";

  // Curve path: gentle S-curve across full width
  const curvePath = isWhiteToBlue
    ? "M0,0 C360,80 1080,0 1440,60 L1440,120 L0,120 Z"
    : "M0,60 C360,0 1080,120 1440,40 L1440,120 L0,120 Z";

  // Stroke path: a slim brand-gradient ribbon riding the curve
  const strokePath = isWhiteToBlue
    ? "M0,4 C360,84 1080,4 1440,64"
    : "M0,64 C360,4 1080,124 1440,44";

  const gradId = `swoosh-grad-${direction}`;

  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden -mt-px -mb-px pointer-events-none ${className}`}
      style={{ height: 90, backgroundColor: topColor }}
    >
      <svg
        className="block w-full h-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={BLUE} />
            <stop offset="100%" stopColor={GREEN} />
          </linearGradient>
        </defs>
        <path d={curvePath} fill={bottomColor} />
        <path
          d={strokePath}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeOpacity="0.55"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default SectionSwoosh;
