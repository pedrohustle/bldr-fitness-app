// src/assets/mascotAxel.jsx
import React from "react";

export default function MascotAxelSVG(props) {
  return (
    <svg
      width={180}
      height={200}
      viewBox="0 0 180 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <radialGradient id="skinGradient" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#b8860b" />
          <stop offset="100%" stopColor="#704d00" />
        </radialGradient>
        <linearGradient id="shirtGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000000" />
          <stop offset="100%" stopColor="#3d3d3d" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB" >
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#d4af37" floodOpacity="0.7" />
        </filter>
      </defs>

      {/* Cabeça */}
      <circle cx="90" cy="50" r="30" fill="url(#skinGradient)" filter="url(#shadow)" />

      {/* Olhos */}
      <ellipse cx="75" cy="45" rx="7" ry="9" fill="#d4af37" />
      <ellipse cx="105" cy="45" rx="7" ry="9" fill="#d4af37" />

      {/* Sobrancelhas */}
      <rect x="65" y="30" width="20" height="6" rx="2" fill="#d4af37" />
      <rect x="95" y="30" width="20" height="6" rx="2" fill="#d4af37" />

      {/* Boca */}
      <path
        d="M70 65 Q90 85 110 65"
        stroke="#d4af37"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Pescoço */}
      <rect x="75" y="80" width="30" height="20" fill="url(#skinGradient)" rx="7" filter="url(#shadow)" />

      {/* Corpo */}
      <rect x="50" y="100" width="80" height="90" fill="url(#shirtGradient)" rx="25" filter="url(#shadow)" />

      {/* Detalhes dourados camisa */}
      <rect x="85" y="130" width="10" height="50" fill="#d4af37" rx="5" />
      <rect x="65" y="160" width="60" height="15" fill="#d4af37" rx="10" />

      {/* Braços */}
      <rect x="30" y="110" width="25" height="35" fill="url(#shirtGradient)" rx="15" filter="url(#shadow)" />
      <rect x="125" y="110" width="25" height="35" fill="url(#shirtGradient)" rx="15" filter="url(#shadow)" />

      {/* Mãos fechadas */}
      <circle cx="42" cy="135" r="14" fill="#d4af37" filter="url(#shadow)" />
      <circle cx="138" cy="135" r="14" fill="#d4af37" filter="url(#shadow)" />
    </svg>
  );
}
