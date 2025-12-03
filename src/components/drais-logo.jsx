export function DraisLogo({ className = "w-12 h-12", variant = "default" }) {
  const colors = {
    default: {
      bg: "url(#gradient1)",
      accent: "#3a86ff"
    },
    light: {
      bg: "#0466c8",
      accent: "#3a86ff"
    },
    dark: {
      bg: "#001845",
      accent: "#3a86ff"
    }
  };

  const currentColors = colors[variant] || colors.default;

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#0466c8', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#3a86ff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#8338ec', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ffbe0b', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#fb5607', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Main D shape */}
      <path
        d="M 20 15 L 45 15 C 65 15 80 30 80 50 C 80 70 65 85 45 85 L 20 85 Z"
        fill={currentColors.bg}
        stroke="url(#accent-gradient)"
        strokeWidth="2"
      />
      
      {/* Inner decorative line */}
      <path
        d="M 35 30 L 45 30 C 58 30 68 40 68 50 C 68 60 58 70 45 70 L 35 70"
        fill="none"
        stroke={currentColors.accent}
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Accent dot */}
      <circle cx="72" cy="25" r="4" fill="url(#accent-gradient)" />
    </svg>
  );
}

export function DraisIcon({ className = "w-6 h-6" }) {
  return <DraisLogo className={className} />;
}
