import React from 'react';

interface Style3DIconProps {
  artDirection: string;
  className?: string;
  size?: number;
}

export const Style3DIcon: React.FC<Style3DIconProps> = ({ artDirection, className = '', size = 52 }) => {
  switch (artDirection) {
    // 1️⃣ 3D Educational Board (سبورة كلاسيكية ثلاثية الأبعاد)
    case 'board_3d':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <filter id="shadow3d_1" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.35" />
            </filter>
            <linearGradient id="frameGrad1" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#b45309" />
              <stop offset="0.5" stopColor="#d97706" />
              <stop offset="1" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="boardGrad1" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1e3a8a" />
              <stop offset="0.7" stopColor="#0f274a" />
              <stop offset="1" stopColor="#0a192f" />
            </linearGradient>
            <radialGradient id="screwGrad" cx="50%" cy="50%" r="50%">
              <stop stopColor="#f8fafc" />
              <stop offset="0.7" stopColor="#94a3b8" />
              <stop offset="1" stopColor="#475569" />
            </radialGradient>
            <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
              <stop stopColor="#fef08a" />
              <stop offset="0.4" stopColor="#f59e0b" />
              <stop offset="1" stopColor="#b45309" />
            </radialGradient>
          </defs>
          {/* 3D Board Frame with Depth */}
          <rect x="5" y="7" width="54" height="46" rx="8" fill="#451a03" />
          <rect x="4" y="5" width="56" height="46" rx="8" fill="url(#frameGrad1)" filter="url(#shadow3d_1)" />
          {/* Inner Chalk/Magnetic Board Surface */}
          <rect x="9" y="10" width="46" height="36" rx="5" fill="url(#boardGrad1)" />
          <rect x="9" y="10" width="46" height="12" rx="4" fill="white" fillOpacity="0.08" />
          {/* 4 Corner Screws 3D */}
          <circle cx="7" cy="8" r="1.8" fill="url(#screwGrad)" />
          <circle cx="57" cy="8" r="1.8" fill="url(#screwGrad)" />
          <circle cx="7" cy="48" r="1.8" fill="url(#screwGrad)" />
          <circle cx="57" cy="48" r="1.8" fill="url(#screwGrad)" />
          {/* Content Lines */}
          <path d="M14 18H32M14 24H28" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M14 30H40" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.85" />
          <path d="M14 36H24" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
          {/* 3D Golden Floating Sphere / Badge */}
          <circle cx="44" cy="22" r="7.5" fill="url(#sphereGrad)" filter="url(#shadow3d_1)" />
          <path d="M41 22H47M44 19V25" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          {/* Wooden Chalk Holder Shelf */}
          <rect x="16" y="47" width="32" height="4.5" rx="2" fill="#78350f" />
          <rect x="20" y="45.5" width="8" height="2" rx="1" fill="#ffffff" />
          <rect x="30" y="45.5" width="6" height="2" rx="1" fill="#facc15" />
        </svg>
      );

    // 2️⃣ Math Infographic (الإنفوجرافيك الرياضي الملون)
    case 'math_infographic':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="orangeGrad2" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffedd5" />
              <stop offset="1" stopColor="#fed7aa" />
            </linearGradient>
            <linearGradient id="hubGrad2" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ea580c" />
              <stop offset="1" stopColor="#c2410c" />
            </linearGradient>
            <radialGradient id="nodeGrad1" cx="35%" cy="35%" r="65%">
              <stop stopColor="#38bdf8" />
              <stop offset="1" stopColor="#0284c7" />
            </radialGradient>
            <radialGradient id="nodeGrad2" cx="35%" cy="35%" r="65%">
              <stop stopColor="#4ade80" />
              <stop offset="1" stopColor="#16a34a" />
            </radialGradient>
          </defs>
          {/* Math Grid Background */}
          <rect x="4" y="4" width="56" height="56" rx="12" fill="url(#orangeGrad2)" stroke="#f97316" strokeWidth="2" />
          <path d="M4 20H60M4 36H60M4 48H60M20 4V60M36 4V60M48 4V60" stroke="#fdba74" strokeWidth="0.8" strokeDasharray="2 2" />
          {/* Connector Pipes 3D */}
          <path d="M32 32L18 16M32 32L46 16M32 32L32 50" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M32 32L18 16M32 32L46 16M32 32L32 50" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
          {/* Central Math Hub 3D */}
          <circle cx="32" cy="32" r="11" fill="#9a3412" />
          <circle cx="32" cy="30.5" r="11" fill="url(#hubGrad2)" />
          <text x="32" y="34.5" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">π</text>
          {/* Orbiting Satellite Nodes 3D */}
          <circle cx="18" cy="16" r="6" fill="#0369a1" />
          <circle cx="18" cy="15" r="6" fill="url(#nodeGrad1)" />
          <text x="18" y="18" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">∑</text>

          <circle cx="46" cy="16" r="6" fill="#15803d" />
          <circle cx="46" cy="15" r="6" fill="url(#nodeGrad2)" />
          <text x="46" y="18" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">√</text>

          {/* 3D Fraction Bar */}
          <rect x="22" y="48" width="20" height="8" rx="3" fill="#ffffff" stroke="#c2410c" strokeWidth="1.5" />
          <text x="32" y="54" fill="#c2410c" fontSize="7" fontWeight="900" textAnchor="middle">½ + ¾</text>
        </svg>
      );

    // 3️⃣ Blueprint (المخطط الهندسي الأزرق)
    case 'blueprint':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="blueSheetGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1e3a8a" />
              <stop offset="1" stopColor="#0c4a6e" />
            </linearGradient>
          </defs>
          {/* Blueprint Dark Blue Plate */}
          <rect x="4" y="6" width="56" height="52" rx="4" fill="#0f172a" />
          <rect x="4" y="4" width="56" height="52" rx="4" fill="url(#blueSheetGrad)" stroke="#38bdf8" strokeWidth="2" />
          {/* Precision Engineering Grid */}
          <path d="M4 16H60M4 28H60M4 40H60M16 4V56M28 4V56M40 4V56M52 4V56" stroke="#0284c7" strokeWidth="0.7" />
          {/* 3D Protractor / Compass Triangle */}
          <path d="M14 44L44 44L29 18Z" fill="#38bdf8" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="2" strokeLinejoin="round" />
          {/* Right Angle Marker */}
          <path d="M14 36H22V44" stroke="#facc15" strokeWidth="1.8" />
          <circle cx="18" cy="40" r="1.2" fill="#facc15" />
          {/* Measurement Dimension Lines */}
          <path d="M14 48H44" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M14 46V50M44 46V50" stroke="#ffffff" strokeWidth="1.5" />
          {/* Ruler Scale Top */}
          <rect x="10" y="7" width="44" height="5" rx="1" fill="#f8fafc" />
          <path d="M14 7V10M18 7V11M22 7V10M26 7V11M30 7V10M34 7V11M38 7V10M42 7V11M46 7V10M50 7V12" stroke="#0f172a" strokeWidth="1" />
        </svg>
      );

    // 4️⃣ Premium Textbook (الكتاب المدرسي الفاخر)
    case 'textbook':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="bookCoverGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#047857" />
              <stop offset="0.7" stopColor="#065f46" />
              <stop offset="1" stopColor="#064e3b" />
            </linearGradient>
            <linearGradient id="goldRibbon" x1="0" y1="0" x2="0" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#facc15" />
              <stop offset="1" stopColor="#ca8a04" />
            </linearGradient>
          </defs>
          {/* 3D Book Base Stack */}
          <path d="M6 48C18 45 46 45 58 48V56C46 53 18 53 6 56Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
          {/* Thick Hardcover Book with Perspective */}
          <rect x="8" y="7" width="48" height="42" rx="4" fill="#022c22" />
          <rect x="6" y="5" width="50" height="42" rx="4" fill="url(#bookCoverGrad)" stroke="#34d399" strokeWidth="1.8" />
          {/* Spine 3D Crease */}
          <path d="M16 5V47" stroke="#064e3b" strokeWidth="2.5" />
          <path d="M18 5V47" stroke="#34d399" strokeWidth="1" strokeOpacity="0.5" />
          {/* Golden Gilded Filigree Frame */}
          <rect x="22" y="11" width="28" height="30" rx="2" fill="none" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="4 2" />
          {/* Royal Seal Emblem */}
          <circle cx="36" cy="24" r="7" fill="#047857" stroke="#facc15" strokeWidth="1.5" />
          <polygon points="36,19 38,23 42,24 39,27 40,31 36,29 32,31 33,27 30,24 34,23" fill="#facc15" />
          {/* Golden Bookmark Ribbon Hanging */}
          <path d="M44 5V22L47 19L50 22V5H44Z" fill="url(#goldRibbon)" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.3))" />
          {/* Latin/Arabic Text Lines */}
          <path d="M26 34H46M28 37H44" stroke="#a7f3d0" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    // 5️⃣ Gamified Education (التعليم التفاعلي والألعاب)
    case 'gamified':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <radialGradient id="shieldGrad" cx="40%" cy="30%" r="70%">
              <stop stopColor="#ef4444" />
              <stop offset="0.6" stopColor="#dc2626" />
              <stop offset="1" stopColor="#991b1b" />
            </radialGradient>
            <linearGradient id="goldCup" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fef08a" />
              <stop offset="0.5" stopColor="#eab308" />
              <stop offset="1" stopColor="#a16207" />
            </linearGradient>
          </defs>
          {/* 3D Shield Outline */}
          <path d="M32 4L54 12V32C54 44 44 54 32 60C20 54 10 44 10 32V12L32 4Z" fill="#7f1d1d" />
          <path d="M32 6L52 14V32C52 43 43 52 32 57C21 52 12 43 12 32V14L32 6Z" fill="url(#shieldGrad)" stroke="#facc15" strokeWidth="2.5" />
          {/* Inner Crest Lines */}
          <path d="M32 9V54" stroke="#fca5a5" strokeWidth="1" strokeOpacity="0.4" />
          {/* 3D Golden Trophy in Center */}
          <path d="M24 20H40V28C40 33 36 36 32 36C28 36 24 33 24 28V20Z" fill="url(#goldCup)" />
          <path d="M22 22H24V26C24 27 22 27 22 26V22Z" fill="#fef08a" />
          <path d="M40 22H42V26C42 27 40 27 40 26V22Z" fill="#fef08a" />
          <rect x="29" y="36" width="6" height="6" fill="#ca8a04" />
          <path d="M25 42H39L41 45H23L25 42Z" fill="#a16207" />
          {/* Golden Sparkles & XP Badge */}
          <polygon points="46,14 47,17 50,18 47,19 46,22 45,19 42,18 45,17" fill="#fde047" />
          <polygon points="17,26 18,28 20,29 18,30 17,32 16,30 14,29 16,28" fill="#fde047" />
          {/* XP Pill at bottom */}
          <rect x="21" y="47" width="22" height="7" rx="3.5" fill="#facc15" stroke="#78350f" strokeWidth="1" />
          <text x="32" y="52.5" fill="#78350f" fontSize="6.5" fontWeight="900" textAnchor="middle">+100 XP</text>
        </svg>
      );

    // 6️⃣ Smart AI Education (التعليم الرقمي والذكاء الاصطناعي)
    case 'smart_ai':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <radialGradient id="cyberGlow" cx="50%" cy="50%" r="50%">
              <stop stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="1" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="aiChipGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1e1b4b" />
              <stop offset="0.7" stopColor="#0f172a" />
              <stop offset="1" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          {/* HUD Tech Hexagon / Rounded Outer Shield */}
          <rect x="4" y="6" width="56" height="52" rx="10" fill="#020617" />
          <rect x="4" y="4" width="56" height="52" rx="10" fill="url(#aiChipGrad)" stroke="#06b6d4" strokeWidth="2" />
          {/* Cybernetic Circuit Traces */}
          <path d="M12 12H20L26 18H38L44 12H52" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="12" r="2" fill="#06b6d4" />
          <circle cx="52" cy="12" r="2" fill="#06b6d4" />
          <path d="M12 52H20L26 46H38L44 52H52" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="52" r="2" fill="#6366f1" />
          <circle cx="52" cy="52" r="2" fill="#6366f1" />
          {/* Glowing Central AI Core / Brain Metaphor */}
          <circle cx="32" cy="31" r="14" fill="url(#cyberGlow)" />
          <rect x="22" y="21" width="20" height="20" rx="5" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" />
          {/* 3D Glowing Quantum AI Spark */}
          <polygon points="32,23 34,29 40,31 34,33 32,39 30,33 24,31 30,29" fill="#06b6d4" />
          <circle cx="32" cy="31" r="2.5" fill="#ffffff" />
          {/* Digital Nodes */}
          <circle cx="27" cy="26" r="1" fill="#a5f3fc" />
          <circle cx="37" cy="26" r="1" fill="#a5f3fc" />
          <circle cx="27" cy="36" r="1" fill="#a5f3fc" />
          <circle cx="37" cy="36" r="1" fill="#a5f3fc" />
        </svg>
      );

    // 7️⃣ Notebook 3D (دفتر الأنشطة الملموس ثلاثي الأبعاد)
    case 'notebook_3d':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <filter id="noteShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="1" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.2" />
            </filter>
            <linearGradient id="stickyYellow" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fef08a" />
              <stop offset="1" stopColor="#fde047" />
            </linearGradient>
          </defs>
          {/* Notebook Page with Realistic 3D Shadow */}
          <rect x="7" y="9" width="50" height="50" rx="4" fill="#e2e8f0" />
          <rect x="6" y="7" width="50" height="50" rx="4" fill="#fcfbf7" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Quad Graph Paper Grid Lines */}
          <path d="M12 12H50M12 18H50M12 24H50M12 30H50M12 36H50M12 42H50M12 48H50" stroke="#bae6fd" strokeWidth="0.8" />
          <path d="M18 12V52M26 12V52M34 12V52M42 12V52" stroke="#bae6fd" strokeWidth="0.8" />
          {/* Red Margin Line */}
          <path d="M46 7V57" stroke="#f87171" strokeWidth="1.2" strokeOpacity="0.8" />
          {/* Metallic Spiral Rings Top (3D Loops) */}
          {[12, 20, 28, 36, 44].map((x, i) => (
            <g key={i}>
              <ellipse cx={x} cy="7" rx="2" ry="4" fill="#64748b" />
              <ellipse cx={x} cy="6" rx="1.8" ry="3.8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
            </g>
          ))}
          {/* Tilted Yellow Sticky Note with 3D Pin 📌 */}
          <g transform="rotate(-6 30 36)">
            <rect x="18" y="24" width="24" height="22" rx="2" fill="url(#stickyYellow)" filter="url(#noteShadow)" />
            <path d="M22 30H38M22 35H34" stroke="#a16207" strokeWidth="1.2" strokeLinecap="round" />
            {/* Red Pushpin 3D */}
            <circle cx="30" cy="26" r="3" fill="#dc2626" />
            <circle cx="29" cy="25" r="1" fill="#ffffff" />
            <path d="M30 29L31 33" stroke="#475569" strokeWidth="1.2" />
          </g>
        </svg>
      );

    // 8️⃣ Color Block (الكتل اللونية الحديثة)
    case 'color_block':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="tealGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0f766e" />
              <stop offset="1" stopColor="#115e59" />
            </linearGradient>
          </defs>
          {/* Bold Bauhaus Color Partition Base */}
          <rect x="4" y="6" width="56" height="52" rx="6" fill="#042f2e" />
          <rect x="4" y="4" width="56" height="52" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Left/Right Bold Color Blocks */}
          <path d="M4 4H26V56H4V4Z" fill="url(#tealGrad)" />
          {/* Top Yellow Accent Bar */}
          <rect x="26" y="4" width="34" height="14" fill="#f59e0b" />
          <text x="32" y="14" fill="#ffffff" fontSize="8" fontWeight="900" fontFamily="sans-serif">BLOCK</text>
          {/* Lower Blue Accent Card */}
          <rect x="30" y="22" width="26" height="16" rx="3" fill="#1e40af" />
          <text x="43" y="33" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">01</text>
          {/* Large Section Number in Block */}
          <text x="15" y="36" fill="#ffffff" fontSize="22" fontWeight="900" textAnchor="middle">A</text>
          {/* Clean Geometric Dividers */}
          <rect x="30" y="42" width="18" height="3" rx="1.5" fill="#0f766e" />
          <rect x="30" y="48" width="26" height="3" rx="1.5" fill="#e2e8f0" />
        </svg>
      );

    // 9️⃣ Mind Map (الخريطة الذهنية المتشعبة)
    case 'mind_map':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <radialGradient id="purpleMapGrad" cx="35%" cy="35%" r="65%">
              <stop stopColor="#a855f7" />
              <stop offset="0.7" stopColor="#7c3aed" />
              <stop offset="1" stopColor="#5b21b6" />
            </radialGradient>
            <radialGradient id="pinkNode" cx="35%" cy="35%" r="65%">
              <stop stopColor="#f472b6" />
              <stop offset="1" stopColor="#db2777" />
            </radialGradient>
            <radialGradient id="cyanNode" cx="35%" cy="35%" r="65%">
              <stop stopColor="#38bdf8" />
              <stop offset="1" stopColor="#0284c7" />
            </radialGradient>
            <radialGradient id="amberNode" cx="35%" cy="35%" r="65%">
              <stop stopColor="#fbbf24" />
              <stop offset="1" stopColor="#d97706" />
            </radialGradient>
          </defs>
          {/* Canvas Background with Subtle Glow */}
          <rect x="4" y="6" width="56" height="52" rx="14" fill="#3b0764" />
          <rect x="4" y="4" width="56" height="52" rx="14" fill="#faf5ff" stroke="#c084fc" strokeWidth="2" />
          {/* Organic Radiating Tree Connectors (Bezier Curves) */}
          <path d="M32 32C24 32 18 24 16 16" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 32C40 32 46 24 48 16" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 32C24 32 18 40 16 48" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 32C40 32 46 40 48 48" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
          {/* Glowing Central Master Concept Hub */}
          <circle cx="32" cy="34" r="11" fill="#4c1d95" />
          <circle cx="32" cy="32" r="11" fill="url(#purpleMapGrad)" />
          <circle cx="32" cy="32" r="7" fill="white" fillOpacity="0.2" />
          <circle cx="32" cy="32" r="4" fill="#ffffff" />
          {/* Branch Satellite Nodes */}
          <circle cx="16" cy="16" r="6" fill="url(#pinkNode)" />
          <circle cx="48" cy="16" r="6" fill="url(#cyanNode)" />
          <circle cx="16" cy="48" r="6" fill="url(#amberNode)" />
          <circle cx="48" cy="48" r="6" fill="url(#purpleMapGrad)" />
        </svg>
      );

    // 🔟 Algerian Educational Premium (المنهاج الجزائري الملكي)
    case 'dz_premium':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="dzGreenGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#007a3d" />
              <stop offset="0.6" stopColor="#006633" />
              <stop offset="1" stopColor="#004d26" />
            </linearGradient>
            <radialGradient id="rubyRed" cx="35%" cy="35%" r="65%">
              <stop stopColor="#ef4444" />
              <stop offset="0.7" stopColor="#d21034" />
              <stop offset="1" stopColor="#991b1b" />
            </radialGradient>
          </defs>
          {/* Flag Tricolor Framed Canvas with 3D Bevel */}
          <rect x="4" y="6" width="56" height="52" rx="6" fill="#022c16" />
          <rect x="4" y="4" width="56" height="52" rx="6" fill="#ffffff" stroke="#006633" strokeWidth="2" />
          {/* Emerald Green Left Stripe */}
          <path d="M4 4H32V56H4V4Z" fill="url(#dzGreenGrad)" />
          {/* Pure White Right Stripe with Maghrebi Geometry */}
          <rect x="32" y="4" width="28" height="52" fill="#ffffff" />
          {/* 3D Islamic 8-Point Star Motif in Header */}
          <g transform="translate(46, 14)">
            <rect x="-4" y="-4" width="8" height="8" fill="#10b981" />
            <rect x="-4" y="-4" width="8" height="8" fill="#006633" transform="rotate(45)" />
            <circle cx="0" cy="0" r="2" fill="#facc15" />
          </g>
          {/* Algerian Official Crescent & Star 3D Center */}
          <g transform="translate(32, 32)">
            {/* Red Crescent */}
            <circle cx="0" cy="0" r="12" fill="url(#rubyRed)" />
            <circle cx="3.5" cy="0" r="9.5" fill="#ffffff" />
            {/* Red 5-Point Star */}
            <polygon points="5,-3 6,0 9,1 6,2 6,5 4,3 1,4 3,1 2,-2 4,-1" fill="url(#rubyRed)" />
          </g>
          {/* Golden Republic Ribbon Bar */}
          <rect x="10" y="48" width="44" height="4.5" rx="2" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
        </svg>
      );

    // 1️⃣1️⃣ Creative Primary Education (الابتدائي الإبداعي والكرتوني)
    case 'kids_creative':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#e0f2fe" />
              <stop offset="1" stopColor="#bae6fd" />
            </linearGradient>
            <radialGradient id="locoRed" cx="35%" cy="35%" r="65%">
              <stop stopColor="#f87171" />
              <stop offset="1" stopColor="#dc2626" />
            </radialGradient>
            <linearGradient id="wagonYellow" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fef08a" />
              <stop offset="1" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          {/* Playful Cheerful Rounded Canvas */}
          <rect x="4" y="6" width="56" height="52" rx="14" fill="#0369a1" />
          <rect x="4" y="4" width="56" height="52" rx="14" fill="url(#skyGrad)" stroke="#38bdf8" strokeWidth="2.5" />
          {/* Puffy Cloud Top */}
          <path d="M12 16C12 13 15 11 18 12C20 9 25 9 27 12C29 10 33 11 34 14C37 14 38 18 36 20H13C11 19 11 17 12 16Z" fill="#ffffff" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.1))" />
          {/* Smiling Sun with Rays */}
          <circle cx="48" cy="14" r="5.5" fill="#facc15" />
          <circle cx="48" cy="14" r="3.5" fill="#f59e0b" />
          {/* Railway Tracks */}
          <path d="M6 46H58" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M10 44V48M18 44V48M26 44V48M34 44V48M42 44V48M50 44V48" stroke="#94a3b8" strokeWidth="2" />
          {/* Number Train Engine 3D 🚂 */}
          <rect x="36" y="28" width="18" height="15" rx="3" fill="url(#locoRed)" />
          <rect x="32" y="34" width="8" height="9" rx="2" fill="#ef4444" />
          <rect x="48" y="23" width="4" height="6" rx="1" fill="#475569" />
          <circle cx="38" cy="44" r="3.5" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="48" cy="44" r="3.5" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
          {/* Number Wagon 1 2 3 */}
          <rect x="14" y="32" width="16" height="11" rx="2" fill="url(#wagonYellow)" stroke="#d97706" strokeWidth="1" />
          <text x="22" y="41" fill="#78350f" fontSize="8" fontWeight="900" textAnchor="middle">123</text>
          <circle cx="18" cy="44" r="3" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="26" cy="44" r="3" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
          {/* Connector link */}
          <path d="M30 38H34" stroke="#475569" strokeWidth="2" />
        </svg>
      );

    // 1️⃣2️⃣ Master Infographic (البوستر الإنفوجرافي الشامل)
    case 'master_infographic':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="posterDarkGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0f172a" />
              <stop offset="0.7" stopColor="#1e293b" />
              <stop offset="1" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          {/* Master A4 Infographic Board with 3D Depth */}
          <rect x="4" y="6" width="56" height="52" rx="5" fill="#090d16" />
          <rect x="4" y="4" width="56" height="52" rx="5" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
          {/* Top Hero Banner */}
          <rect x="4" y="4" width="56" height="14" rx="4" fill="url(#posterDarkGrad)" />
          <rect x="10" y="8" width="22" height="3" rx="1.5" fill="#38bdf8" />
          <rect x="10" y="13" width="14" height="2" rx="1" fill="#facc15" />
          <circle cx="52" cy="11" r="3.5" fill="#f59e0b" />
          {/* Infographic 3-Step Pipeline Flow */}
          <rect x="8" y="22" width="13" height="18" rx="2" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.2" />
          <circle cx="14.5" cy="27" r="3" fill="#2563eb" />
          <text x="14.5" y="29.5" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle">1</text>
          <path d="M10 33H19M10 36H16" stroke="#93c5fd" strokeWidth="1" />

          <path d="M22 31L26 31" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />

          <rect x="27" y="22" width="13" height="18" rx="2" fill="#fefce8" stroke="#eab308" strokeWidth="1.2" />
          <circle cx="33.5" cy="27" r="3" fill="#ca8a04" />
          <text x="33.5" y="29.5" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle">2</text>
          <path d="M29 33H38M29 36H35" stroke="#fde047" strokeWidth="1" />

          <path d="M41 31L45 31" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />

          <rect x="46" y="22" width="13" height="18" rx="2" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.2" />
          <circle cx="52.5" cy="27" r="3" fill="#16a34a" />
          <text x="52.5" y="29.5" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle">3</text>
          <path d="M48 33H57M48 36H54" stroke="#86efac" strokeWidth="1" />

          {/* Bottom Summary Bar */}
          <rect x="8" y="44" width="48" height="7" rx="2" fill="#0f172a" />
          <rect x="12" y="46.5" width="28" height="2" rx="1" fill="#38bdf8" />
          <circle cx="48" cy="47.5" r="1.8" fill="#22c55e" />
        </svg>
      );
  }
};
