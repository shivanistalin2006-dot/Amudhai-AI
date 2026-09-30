import React from 'react';

interface ZeroPlateLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  showTagline?: boolean;
  theme?: 'dark' | 'light';
}

export const ZeroPlateLogo: React.FC<ZeroPlateLogoProps> = ({
  size = 40,
  className = '',
  showText = false,
  showTagline = false,
  theme = 'light',
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Visual Logo Mark: Plate + Leaf + Zero-Waste Cycle + Gold Accent */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="emeraldGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#174C3C" />
            <stop offset="1" stopColor="#2E8059" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F5D77F" />
            <stop offset="1" stopColor="#D5AD58" />
          </linearGradient>
          <filter id="subtleShadow" x="-2" y="-2" width="84" height="84" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#174C3C" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Outer Circular Plate Base */}
        <circle cx="40" cy="40" r="38" fill="url(#emeraldGrad)" filter="url(#subtleShadow)" />
        <circle cx="40" cy="40" r="35" fill="#F7F8F2" stroke="url(#goldGrad)" strokeWidth="1.8" />
        <circle cx="40" cy="40" r="28" fill="#FFFFFF" stroke="#E2ECE5" strokeWidth="1.2" />
        <circle cx="40" cy="40" r="22" fill="#F7F8F2" stroke="#C6E6D2" strokeWidth="1" />

        {/* Zero-Waste Continuous Regeneration Cycle Arrows */}
        {/* Top-Right Arc */}
        <path d="M 40 12 A 28 28 0 0 1 68 40" stroke="#2E8059" strokeWidth="3" strokeLinecap="round" />
        <polygon points="68,36 72,43 64,43" fill="#2E8059" transform="rotate(30 68 40)" />

        {/* Bottom-Right Arc */}
        <path d="M 68 40 A 28 28 0 0 1 40 68" stroke="#174C3C" strokeWidth="3" strokeLinecap="round" />
        <polygon points="40,68 47,64 47,72" fill="#D5AD58" />

        {/* Bottom-Left Arc with Gold Accent */}
        <path d="M 40 68 A 28 28 0 0 1 12 40" stroke="#D5AD58" strokeWidth="3" strokeLinecap="round" />
        <polygon points="12,44 8,37 16,37" fill="#2E8059" transform="rotate(-30 12 40)" />

        {/* Top-Left Arc */}
        <path d="M 12 40 A 28 28 0 0 1 40 12" stroke="#2E8059" strokeWidth="3" strokeLinecap="round" />
        <polygon points="40,12 33,16 33,8" fill="#2E8059" />

        {/* Botanical Organic Leaf Symbol (Center-Right in Plate) */}
        <path
          d="M 29 51 C 26 38, 34 25, 49 21 C 51 34, 43 48, 29 51 Z"
          fill="#2E8059"
          stroke="#174C3C"
          strokeWidth="1.2"
        />
        {/* Leaf Primary Spine */}
        <path d="M 31 49 C 36 43, 42 34, 48 26" stroke="#C6E6D2" strokeWidth="1.6" strokeLinecap="round" />
        {/* Golden Secondary Vein */}
        <path d="M 37 42 Q 42 42 45 37" stroke="#D5AD58" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 35 45 Q 39 45 41 42" stroke="#C6E6D2" strokeWidth="1" strokeLinecap="round" />
      </svg>

      {/* Typography Lockup */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-extrabold tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-[#174C3C]'
              } text-lg md:text-xl`}
            >
              ZeroPlate
            </span>
            <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-[#2E8059] text-white shadow-xs border border-[#D5AD58]/50">
              AI
            </span>
          </div>
          {showTagline && (
            <span
              className={`text-[11px] font-medium tracking-wide mt-0.5 ${
                theme === 'dark' ? 'text-[#D5AD58]' : 'text-[#2E8059]'
              }`}
            >
              Smart Food. Zero Waste.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
