import React from 'react';

interface FrameDecorationsProps {
  frameId: string;
  color: string;
}

export const FrameDecorations: React.FC<FrameDecorationsProps> = ({ frameId, color }) => {
  if (frameId === 'floral') {
    // Beautiful botanical floral corner flourishes inspired by user's second photo!
    return (
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
        {/* Top-Right Floral Bouquet */}
        <div className="absolute top-2 right-2 w-36 h-36 opacity-85">
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full drop-shadow-sm">
            {/* Soft Leaves */}
            <path d="M140 20 C110 25, 90 45, 95 70 C100 45, 125 30, 140 20Z" fill="#10b981" fillOpacity="0.45" />
            <path d="M120 10 C100 20, 85 35, 80 55 C90 35, 110 20, 120 10Z" fill="#059669" fillOpacity="0.5" />
            <path d="M150 40 C130 50, 115 70, 125 95 C130 70, 145 50, 150 40Z" fill="#34d399" fillOpacity="0.5" />
            {/* Delicate Stems */}
            <path d="M155 5 Q110 40, 70 85" stroke="#047857" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M120 30 Q100 65, 60 95" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M140 15 Q135 60, 95 105" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Main Rose / Flower Bloom */}
            <circle cx="115" cy="45" r="14" fill="#fb7185" fillOpacity="0.8" />
            <circle cx="112" cy="42" r="10" fill="#f43f5e" fillOpacity="0.85" />
            <circle cx="114" cy="43" r="6" fill="#e11d48" />
            <circle cx="115" cy="44" r="2.5" fill="#fef08a" />
            {/* Secondary Flower (Peach/Pastel) */}
            <circle cx="85" cy="70" r="11" fill="#fbcfe8" fillOpacity="0.85" />
            <circle cx="83" cy="68" r="7" fill="#f472b6" fillOpacity="0.9" />
            <circle cx="84" cy="69" r="3" fill="#db2777" />
            {/* Small Buds */}
            <circle cx="138" cy="22" r="5" fill="#fda4af" />
            <circle cx="148" cy="35" r="4" fill="#fecdd3" />
            <circle cx="68" cy="92" r="4.5" fill="#fda4af" />
          </svg>
        </div>

        {/* Top-Left Floral Bouquet */}
        <div className="absolute top-2 left-2 w-36 h-36 opacity-85 scale-x-[-1]">
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full drop-shadow-sm">
            <path d="M140 20 C110 25, 90 45, 95 70 C100 45, 125 30, 140 20Z" fill="#10b981" fillOpacity="0.45" />
            <path d="M120 10 C100 20, 85 35, 80 55 C90 35, 110 20, 120 10Z" fill="#059669" fillOpacity="0.5" />
            <path d="M150 40 C130 50, 115 70, 125 95 C130 70, 145 50, 150 40Z" fill="#34d399" fillOpacity="0.5" />
            <path d="M155 5 Q110 40, 70 85" stroke="#047857" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="115" cy="45" r="14" fill="#fb7185" fillOpacity="0.8" />
            <circle cx="112" cy="42" r="10" fill="#f43f5e" fillOpacity="0.85" />
            <circle cx="114" cy="43" r="6" fill="#e11d48" />
            <circle cx="115" cy="44" r="2.5" fill="#fef08a" />
            <circle cx="85" cy="70" r="11" fill="#fbcfe8" fillOpacity="0.85" />
            <circle cx="83" cy="68" r="7" fill="#f472b6" fillOpacity="0.9" />
            <circle cx="138" cy="22" r="5" fill="#fda4af" />
          </svg>
        </div>

        {/* Bottom-Right Floral Bouquet */}
        <div className="absolute bottom-2 right-2 w-36 h-36 opacity-85 scale-y-[-1]">
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full drop-shadow-sm">
            <path d="M140 20 C110 25, 90 45, 95 70 C100 45, 125 30, 140 20Z" fill="#10b981" fillOpacity="0.45" />
            <path d="M155 5 Q110 40, 70 85" stroke="#047857" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="115" cy="45" r="14" fill="#fb7185" fillOpacity="0.8" />
            <circle cx="112" cy="42" r="10" fill="#f43f5e" fillOpacity="0.85" />
            <circle cx="85" cy="70" r="11" fill="#fbcfe8" fillOpacity="0.85" />
          </svg>
        </div>

        {/* Bottom-Left Floral Bouquet */}
        <div className="absolute bottom-2 left-2 w-36 h-36 opacity-85 scale-[-1]">
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full drop-shadow-sm">
            <path d="M140 20 C110 25, 90 45, 95 70 C100 45, 125 30, 140 20Z" fill="#10b981" fillOpacity="0.45" />
            <path d="M155 5 Q110 40, 70 85" stroke="#047857" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="115" cy="45" r="14" fill="#fb7185" fillOpacity="0.8" />
            <circle cx="112" cy="42" r="10" fill="#f43f5e" fillOpacity="0.85" />
            <circle cx="85" cy="70" r="11" fill="#fbcfe8" fillOpacity="0.85" />
          </svg>
        </div>
      </div>
    );
  }

  if (frameId === 'royal_gold') {
    return (
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
        {/* Golden Corner Filigrees in All 4 Corners */}
        {['top-2 right-2', 'top-2 left-2 rotate-90', 'bottom-2 left-2 rotate-180', 'bottom-2 right-2 -rotate-90'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-20 h-20 text-amber-500 opacity-90`}>
            <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
              <path d="M5 5 L45 5 C40 15, 30 25, 20 30 C15 35, 10 40, 5 45 Z" fill="currentColor" fillOpacity="0.15" />
              <path d="M2 2 L75 2 M2 2 L2 75" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
              <path d="M8 8 L60 8 M8 8 L8 60" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="14" cy="14" r="5" fill="#f59e0b" />
              <circle cx="14" cy="14" r="2.5" fill="#fef08a" />
              <path d="M14 28 C22 28, 28 22, 28 14" stroke="#d97706" strokeWidth="1.5" fill="none" />
              <path d="M20 40 C35 35, 40 20, 40 10" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
            </svg>
          </div>
        ))}
      </div>
    );
  }

  if (frameId === 'islamic') {
    return (
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
        {/* Islamic 8-Point Star Corners */}
        {['top-2 right-2', 'top-2 left-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-16 h-16 text-emerald-700 opacity-90`}>
            <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
              <rect x="5" y="5" width="22" height="22" transform="rotate(45 16 16)" fill="#047857" fillOpacity="0.25" stroke="#059669" strokeWidth="1.5" />
              <rect x="5" y="5" width="22" height="22" fill="#047857" fillOpacity="0.25" stroke="#047857" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="4" fill="#fbbf24" />
              <path d="M2 2 L55 2 M2 2 L2 55" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M6 6 L45 6 M6 6 L6 45" stroke="#10b981" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
        ))}
      </div>
    );
  }

  if (frameId === 'pedagogical') {
    return (
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
        {/* Crisp Corner Brackets & Header Accent Ribbons */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700" />
        {['top-2 right-2', 'top-2 left-2 scale-x-[-1]', 'bottom-2 right-2 scale-y-[-1]', 'bottom-2 left-2 scale-[-1]'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-12 h-12 text-blue-700 opacity-80`}>
            <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
              <path d="M2 2 L35 2 L35 8 L8 8 L8 35 L2 35 Z" fill={color || '#1d4ed8'} />
              <circle cx="16" cy="16" r="3" fill="#f97316" />
            </svg>
          </div>
        ))}
      </div>
    );
  }

  return null;
};
