// ============================================================================
// 🎨 RADICAL VISUAL REDESIGN: 12 DISTINCT PEDAGOGICAL ART DIRECTIONS
// ============================================================================
// High-craft, infographic-level educational design system for Algerian & Arab curricula.
// Replaces generic boxes with 12 complete visual languages (3D board, math infographic,
// blueprint, textbook, gamified, smart AI, 3D notebook, color block, mind map, etc.)

export interface StyleTokens {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceAccent: string;
  text: string;
  mutedText: string;
  border: string;
  heading: string;
  tableHeader: string;
  tableHeaderColor: string;
  tableStripe: string;
  tableBorder: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
}

export interface StyleDefinition {
  id: string;
  legacyId: string;
  name: string;
  nameAr: string;
  tagline: string;
  descriptionAr: string;
  isPro?: boolean;
  tokens: StyleTokens;
  fontFamily: string;
  headingFont: string;
  borderRadius: string;
  shadow: string;
  frameType: 
    | 'double_gold' 
    | 'tech_hud' 
    | 'side_rail' 
    | 'emerald_ornate' 
    | 'power_banner' 
    | 'purple_digital' 
    | 'orange_dynamic' 
    | 'math_grid' 
    | 'cards_modular' 
    | 'dz_geometric' 
    | 'editorial_rules' 
    | 'kids_playful';
  palette: string[];
  headerStyle: string;
  footerStyle: string;
  artDirection: 
    | 'board_3d'
    | 'math_infographic'
    | 'blueprint'
    | 'textbook'
    | 'gamified'
    | 'smart_ai'
    | 'notebook_3d'
    | 'color_block'
    | 'mind_map'
    | 'dz_premium'
    | 'kids_creative'
    | 'master_infographic';
  bgCss: string;
}

export const STYLES_REGISTRY: StyleDefinition[] = [
  // ==========================================================================
  // STYLE 01 — 3D EDUCATIONAL BOARD (اللوح التعليمي ثلاثي الأبعاد)
  // Inspired by Reference Image 2: Floating dimensional classroom board,
  // metallic screws, glass panels, 3D sphere badges with +/-
  // ==========================================================================
  {
    id: 'royal_academy',
    legacyId: 'style1',
    name: '3D Educational Board',
    nameAr: 'اللوح التعليمي 3D (مجسم)',
    tagline: 'لوح صفي ثلاثي الأبعاد بعمق حقيقي',
    descriptionAr: 'لوح تعليمي عائم مع براغي معدنية بالأركان، ألواح زجاجية شفافة، وكرات ثلاثية الأبعاد للأعداد النسبية والرموز.',
    isPro: false,
    tokens: {
      primary: '#0f274a',
      secondary: '#1e40af',
      accent: '#f59e0b',
      background: '#eef2f6',
      surface: '#ffffff',
      surfaceAccent: '#f0f4f8',
      text: '#0f172a',
      mutedText: '#475569',
      border: '#cbd5e1',
      heading: '#0f274a',
      tableHeader: '#0f274a',
      tableHeaderColor: '#ffffff',
      tableStripe: '#f8fafc',
      tableBorder: '#94a3b8',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#0284c7'
    },
    fontFamily: "'Amiri', 'Traditional Arabic', serif",
    headingFont: "'Cairo', 'Amiri', serif",
    borderRadius: '12px',
    shadow: '0 12px 28px rgba(15, 39, 74, 0.12), 0 2px 6px rgba(15, 39, 74, 0.06)',
    frameType: 'double_gold',
    palette: ['#0f274a', '#1e40af', '#f59e0b', '#e2e8f0', '#ffffff'],
    headerStyle: 'board_3d_header',
    footerStyle: 'board_3d_footer',
    artDirection: 'board_3d',
    bgCss: 'radial-gradient(circle at 50% 0%, #f8fafc 0%, #e2e8f0 100%)'
  },

  // ==========================================================================
  // STYLE 02 — COLORFUL MATH INFOGRAPHIC (الإنفوجرافيك الرياضي الملون)
  // Inspired by Reference Image 3: Warm amber/orange graph background,
  // central concept hub with branching connectors, math badges, fraction bars
  // ==========================================================================
  {
    id: 'orange_active',
    legacyId: 'style10',
    name: 'Math Infographic',
    nameAr: 'الإنفوجرافيك الرياضي الملون',
    tagline: 'مخطط بصري متشعب ومجسم للرياضيات',
    descriptionAr: 'هوية إنفوجرافيك برتقالية دافئة مع خلفية شبكة بيانية، عقدة مفهوم مركزية متفرعة، ونماذج كسور بصرية وأسهم رابطة.',
    isPro: true,
    tokens: {
      primary: '#c2410c',
      secondary: '#0284c7',
      accent: '#f97316',
      background: '#fffbf5',
      surface: '#ffffff',
      surfaceAccent: '#fff7ed',
      text: '#1c1917',
      mutedText: '#57534e',
      border: '#fed7aa',
      heading: '#9a3412',
      tableHeader: '#c2410c',
      tableHeaderColor: '#ffffff',
      tableStripe: '#fff7ed',
      tableBorder: '#fdba74',
      success: '#16a34a',
      warning: '#ea580c',
      danger: '#dc2626',
      info: '#0284c7'
    },
    fontFamily: "'Cairo', 'Almarai', sans-serif",
    headingFont: "'Changa', 'Cairo', sans-serif",
    borderRadius: '10px',
    shadow: '0 8px 22px rgba(194, 65, 12, 0.12)',
    frameType: 'orange_dynamic',
    palette: ['#c2410c', '#f97316', '#0284c7', '#fff7ed', '#ffffff'],
    headerStyle: 'infographic_hub_header',
    footerStyle: 'infographic_hub_footer',
    artDirection: 'math_infographic',
    bgCss: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #ffedd5 19px, #ffedd5 20px), repeating-linear-gradient(90deg, #fffbf5, #fffbf5 19px, #ffedd5 19px, #ffedd5 20px)'
  },

  // ==========================================================================
  // STYLE 03 — EDUCATIONAL BLUEPRINT (المخطط الهندسي الأزرق)
  // Technical graph-paper grid, ruler marks, right-angle markers, coordinate labels
  // ==========================================================================
  {
    id: 'math_pro',
    legacyId: 'style13',
    name: 'Educational Blueprint',
    nameAr: 'المخطط الهندسي الأزرق (Blueprint)',
    tagline: 'شبكة رسم بياني ومسطرة قياس تقنية',
    descriptionAr: 'مخطط هندسي تقني بخلفية ميليمترية زرقاء، زوايا قائمة، قياسات أطوال، محاور إحداثيات، وتأطير مهندسين معماري.',
    isPro: true,
    tokens: {
      primary: '#1e3a8a',
      secondary: '#0284c7',
      accent: '#0e7490',
      background: '#f8fafc',
      surface: '#ffffff',
      surfaceAccent: '#f0f9ff',
      text: '#0f172a',
      mutedText: '#334155',
      border: '#bae6fd',
      heading: '#172554',
      tableHeader: '#1e3a8a',
      tableHeaderColor: '#ffffff',
      tableStripe: '#f0f9ff',
      tableBorder: '#7dd3fc',
      success: '#059669',
      warning: '#d97706',
      danger: '#dc2626',
      info: '#0284c7'
    },
    fontFamily: "'Space Grotesk', 'Cairo', monospace",
    headingFont: "'Space Grotesk', 'Cairo', sans-serif",
    borderRadius: '4px',
    shadow: '0 4px 14px rgba(30, 58, 138, 0.1)',
    frameType: 'math_grid',
    palette: ['#1e3a8a', '#0284c7', '#0e7490', '#e0f2fe', '#ffffff'],
    headerStyle: 'blueprint_header',
    footerStyle: 'blueprint_footer',
    artDirection: 'blueprint',
    bgCss: 'repeating-linear-gradient(0deg, transparent, transparent 15px, #e2e8f0 15px, #e2e8f0 16px), repeating-linear-gradient(90deg, #f8fafc, #f8fafc 15px, #e2e8f0 15px, #e2e8f0 16px)'
  },

  // ==========================================================================
  // STYLE 04 — PREMIUM TEXTBOOK (الكتاب المدرسي الفاخر)
  // Inspired by Reference Images 4 & 5: Professional published textbook,
  // ornate borders, ribbon-cut exercise tabs, theorem boxes
  // ==========================================================================
  {
    id: 'emerald_school',
    legacyId: 'style3',
    name: 'Premium Textbook',
    nameAr: 'الكتاب المدرسي الفاخر (دار النشر)',
    tagline: 'إخراج رسمي احترافي من دور النشر',
    descriptionAr: 'تصميم كتاب مدرسي راقٍ بأطر زخرفية مطبوعة، أشرطة تمارين مسننة، عناوين فصول فخمة، وصناديق مبرهنات نموذجية.',
    isPro: true,
    tokens: {
      primary: '#065f46',
      secondary: '#047857',
      accent: '#b45309',
      background: '#fafaf9',
      surface: '#ffffff',
      surfaceAccent: '#f0fdf4',
      text: '#1c1917',
      mutedText: '#44403c',
      border: '#a7f3d0',
      heading: '#064e3b',
      tableHeader: '#065f46',
      tableHeaderColor: '#ffffff',
      tableStripe: '#ecfdf5',
      tableBorder: '#6ee7b7',
      success: '#047857',
      warning: '#b45309',
      danger: '#b91c1c',
      info: '#0284c7'
    },
    fontFamily: "'Amiri', 'Tajawal', 'Cairo', serif",
    headingFont: "'Amiri', 'Cairo', serif",
    borderRadius: '6px',
    shadow: '0 4px 14px rgba(6, 95, 70, 0.08)',
    frameType: 'emerald_ornate',
    palette: ['#065f46', '#047857', '#b45309', '#f0fdf4', '#ffffff'],
    headerStyle: 'textbook_ribbon_header',
    footerStyle: 'textbook_footer',
    artDirection: 'textbook',
    bgCss: 'linear-gradient(180deg, #ffffff 0%, #fafaf9 100%)'
  },

  // ==========================================================================
  // STYLE 05 — GAMIFIED EDUCATION (التعلم التفاعلي والألعاب)
  // Classroom quest gamification: Level 1 Launch, Level 2 Challenge, Level 3 Boss,
  // XP badges (+100 XP), achievement stars, progress bar
  // ==========================================================================
  {
    id: 'power_red',
    legacyId: 'style5',
    name: 'Gamified Education',
    nameAr: 'التعليم التفاعلي والألعاب (Gamified)',
    tagline: 'مستويات وتحديات وشارات نقاط XP',
    descriptionAr: 'يحول الدرس إلى مغامرة تعليمية بمستويات (الانطلاق 🚀، التحدي ⚡، الأبطال 🏆)، نقاط XP، وشريط إنجاز مرحلي.',
    isPro: true,
    tokens: {
      primary: '#b91c1c',
      secondary: '#ea580c',
      accent: '#facc15',
      background: '#fffdf5',
      surface: '#ffffff',
      surfaceAccent: '#fef2f2',
      text: '#18181b',
      mutedText: '#52525b',
      border: '#fecaca',
      heading: '#991b1b',
      tableHeader: '#b91c1c',
      tableHeaderColor: '#ffffff',
      tableStripe: '#fff1f2',
      tableBorder: '#fca5a5',
      success: '#16a34a',
      warning: '#f59e0b',
      danger: '#b91c1c',
      info: '#2563eb'
    },
    fontFamily: "'Cairo', 'Changa', sans-serif",
    headingFont: "'Changa', 'Cairo', sans-serif",
    borderRadius: '12px',
    shadow: '0 6px 20px rgba(185, 28, 28, 0.12)',
    frameType: 'power_banner',
    palette: ['#b91c1c', '#ea580c', '#facc15', '#fef2f2', '#ffffff'],
    headerStyle: 'gamified_quest_header',
    footerStyle: 'gamified_footer',
    artDirection: 'gamified',
    bgCss: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 50%, #fef2f2 100%)'
  },

  // ==========================================================================
  // STYLE 06 — SMART AI EDUCATION (التعليم الرقمي والذكاء الاصطناعي)
  // Futuristic cyber-education design: Neon cyan/indigo HUD, circuit lines,
  // smart AI assistant tips, digital nodes
  // ==========================================================================
  {
    id: 'smart_tech',
    legacyId: 'style6',
    name: 'Smart AI Education',
    nameAr: 'التعليم الرقمي والذكاء الاصطناعي',
    tagline: 'واجهة مستقبلية رقمية عالية التقنية',
    descriptionAr: 'تصميم سيبراني تقني بتدرجات السيان والبنفسجي الكوانتومي، شارات كبسولية HUD، وعقد بيانات ذكية وتنبيهات تفاعلية.',
    isPro: true,
    tokens: {
      primary: '#0284c7',
      secondary: '#6366f1',
      accent: '#06b6d4',
      background: '#f8fafc',
      surface: '#ffffff',
      surfaceAccent: '#f0f9ff',
      text: '#0f172a',
      mutedText: '#475569',
      border: '#bae6fd',
      heading: '#0369a1',
      tableHeader: '#0369a1',
      tableHeaderColor: '#ffffff',
      tableStripe: '#f0f9ff',
      tableBorder: '#7dd3fc',
      success: '#059669',
      warning: '#d97706',
      danger: '#dc2626',
      info: '#0284c7'
    },
    fontFamily: "'Space Grotesk', 'IBM Plex Sans Arabic', sans-serif",
    headingFont: "'Space Grotesk', 'Changa', sans-serif",
    borderRadius: '10px',
    shadow: '0 8px 24px rgba(2, 132, 199, 0.15)',
    frameType: 'tech_hud',
    palette: ['#0284c7', '#6366f1', '#06b6d4', '#e0f2fe', '#ffffff'],
    headerStyle: 'ai_hud_header',
    footerStyle: 'ai_hud_footer',
    artDirection: 'smart_ai',
    bgCss: 'radial-gradient(circle at 100% 0%, #e0f2fe 0%, #f8fafc 60%, #ffffff 100%)'
  },

  // ==========================================================================
  // STYLE 07 — NOTEBOOK 3D (دفتر الأنشطة الملموس ثلاثي الأبعاد)
  // Inspired by Reference Image 1: Physical spiral notebook, quad graph paper,
  // pinned notes with 📌, sticky notes with 45° tape, paper clips 📎
  // ==========================================================================
  {
    id: 'teaching_cards',
    legacyId: 'style9',
    name: 'Notebook 3D',
    nameAr: 'دفتر الأنشطة الملموس 3D',
    tagline: 'ورق مربعات حقيقي، دبابيس وأوراق لاصقة',
    descriptionAr: 'يحاكي الدفتر المدرسي الملموس بحلقات سلك علوية، ورق مربعات كراس، بطاقات مثبتة بدبابيس 📌، ولواصق صفراء مائلة.',
    isPro: true,
    tokens: {
      primary: '#0369a1',
      secondary: '#b45309',
      accent: '#eab308',
      background: '#fcfbf7',
      surface: '#ffffff',
      surfaceAccent: '#fef9c3',
      text: '#1e293b',
      mutedText: '#64748b',
      border: '#cbd5e1',
      heading: '#0c4a6e',
      tableHeader: '#0369a1',
      tableHeaderColor: '#ffffff',
      tableStripe: '#f8fafc',
      tableBorder: '#94a3b8',
      success: '#15803d',
      warning: '#b45309',
      danger: '#b91c1c',
      info: '#0284c7'
    },
    fontFamily: "'IBM Plex Sans Arabic', 'Cairo', sans-serif",
    headingFont: "'Cairo', 'Changa', sans-serif",
    borderRadius: '8px',
    shadow: '0 8px 20px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
    frameType: 'cards_modular',
    palette: ['#0369a1', '#eab308', '#b45309', '#fef9c3', '#ffffff'],
    headerStyle: 'notebook_spiral_header',
    footerStyle: 'notebook_footer',
    artDirection: 'notebook_3d',
    bgCss: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #e2e8f0 19px, #e2e8f0 20px), repeating-linear-gradient(90deg, #fcfbf7, #fcfbf7 19px, #e2e8f0 19px, #e2e8f0 20px)'
  },

  // ==========================================================================
  // STYLE 08 — COLOR BLOCK EDUCATION (الكتل اللونية الحديثة)
  // Bold Bauhaus color blocks, oversized section numbers 01, 02, 03, color partitions
  // ==========================================================================
  {
    id: 'education_pro',
    legacyId: 'style8',
    name: 'Color Block Education',
    nameAr: 'الكتل اللونية الحديثة (Color Block)',
    tagline: 'تقسيمات بصرية هندسية وأرقام عملاقة',
    descriptionAr: 'تصميم بوهوسي حديث بكتل لونية صلبة، أرقام أقسام ضخمة (01، 02، 03)، وهرمية بصرية بالغة الدقة والوضوح.',
    isPro: true,
    tokens: {
      primary: '#0f766e',
      secondary: '#1e40af',
      accent: '#f59e0b',
      background: '#f8fafc',
      surface: '#ffffff',
      surfaceAccent: '#f0fdfa',
      text: '#0f172a',
      mutedText: '#334155',
      border: '#ccfbf1',
      heading: '#115e59',
      tableHeader: '#0f766e',
      tableHeaderColor: '#ffffff',
      tableStripe: '#f0fdfa',
      tableBorder: '#99f6e4',
      success: '#15803d',
      warning: '#b45309',
      danger: '#b91c1c',
      info: '#0f766e'
    },
    fontFamily: "'Cairo', 'Tajawal', sans-serif",
    headingFont: "'Changa', 'Cairo', sans-serif",
    borderRadius: '4px',
    shadow: '0 4px 16px rgba(15, 118, 110, 0.1)',
    frameType: 'side_rail',
    palette: ['#0f766e', '#1e40af', '#f59e0b', '#f0fdfa', '#ffffff'],
    headerStyle: 'color_block_header',
    footerStyle: 'color_block_footer',
    artDirection: 'color_block',
    bgCss: 'linear-gradient(90deg, #f0fdfa 0%, #ffffff 40%, #ffffff 100%)'
  },

  // ==========================================================================
  // STYLE 09 — MIND MAP LESSON (الخريطة الذهنية التعليمية)
  // Radial knowledge map, central radiating concept hub with branches leading
  // to Definition, Rule, Example, Activity, Summary
  // ==========================================================================
  {
    id: 'purple_ai',
    legacyId: 'style2',
    name: 'Mind Map Lesson',
    nameAr: 'الخريطة الذهنية المتشعبة (Mind Map)',
    tagline: 'هيكلة المفاهيم كخريطة معرفية مترابطة',
    descriptionAr: 'ينظم عناصر المذكرة كخريطة ذهنية مرئية: المفهوم في المركز وتتفرع منه مسارات ملونة للقواعد والأمثلة والأنشطة.',
    isPro: true,
    tokens: {
      primary: '#6d28d9',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#fcfaff',
      surface: '#ffffff',
      surfaceAccent: '#faf5ff',
      text: '#1e1b4b',
      mutedText: '#4b5563',
      border: '#e9d5ff',
      heading: '#5b21b6',
      tableHeader: '#6d28d9',
      tableHeaderColor: '#ffffff',
      tableStripe: '#faf5ff',
      tableBorder: '#d8b4fe',
      success: '#059669',
      warning: '#d97706',
      danger: '#dc2626',
      info: '#7c3aed'
    },
    fontFamily: "'Tajawal', 'Cairo', sans-serif",
    headingFont: "'Cairo', 'Changa', sans-serif",
    borderRadius: '16px',
    shadow: '0 8px 24px rgba(109, 40, 217, 0.12)',
    frameType: 'purple_digital',
    palette: ['#6d28d9', '#8b5cf6', '#ec4899', '#faf5ff', '#ffffff'],
    headerStyle: 'mindmap_hub_header',
    footerStyle: 'mindmap_footer',
    artDirection: 'mind_map',
    bgCss: 'radial-gradient(circle at 50% 30%, #f3e8ff 0%, #fcfaff 60%, #ffffff 100%)'
  },

  // ==========================================================================
  // STYLE 10 — ALGERIAN EDUCATIONAL PREMIUM (المنهاج الجزائري الملكي)
  // Official Algerian educational identity: Emerald green, pure white, ruby red,
  // 8-point Islamic geometric star motifs ۞, republic header
  // ==========================================================================
  {
    id: 'dz_education',
    legacyId: 'style14',
    name: 'Algerian Premium',
    nameAr: 'المنهاج الجزائري الملكي (الجيل الثاني)',
    tagline: 'أصالة وطنية مع زخارف هندسية مغاربية',
    descriptionAr: 'هوية وطنية راقية بألوان العلم (أخضر زمردي + أبيض + أحمر ياقوتي)، نجوم ثمانية ۞، وترويسة رسمية فخمة لوزارة التربية.',
    isPro: false,
    tokens: {
      primary: '#006633',
      secondary: '#047857',
      accent: '#d21034',
      background: '#f8fbf9',
      surface: '#ffffff',
      surfaceAccent: '#f0fdf4',
      text: '#064e3b',
      mutedText: '#374151',
      border: '#bbf7d0',
      heading: '#006633',
      tableHeader: '#006633',
      tableHeaderColor: '#ffffff',
      tableStripe: '#f0fdf4',
      tableBorder: '#86efac',
      success: '#006633',
      warning: '#b45309',
      danger: '#d21034',
      info: '#047857'
    },
    fontFamily: "'Amiri', 'Tajawal', 'Cairo', serif",
    headingFont: "'Amiri', 'Cairo', serif",
    borderRadius: '6px',
    shadow: '0 4px 14px rgba(0, 102, 51, 0.1)',
    frameType: 'dz_geometric',
    palette: ['#006633', '#047857', '#d21034', '#f0fdf4', '#ffffff'],
    headerStyle: 'dz_republic_seal_header',
    footerStyle: 'dz_republic_footer',
    artDirection: 'dz_premium',
    bgCss: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 15%, #ffffff 85%, #f0fdf4 100%)'
  },

  // ==========================================================================
  // STYLE 11 — CREATIVE PRIMARY EDUCATION (الابتدائي الإبداعي والكرتوني)
  // Inspired by Reference Image 1: Number train, jumping arcs for decimals ↷ ↷,
  // friendly clouds, star stickers, young learner focus
  // ==========================================================================
  {
    id: 'kids_smart',
    legacyId: 'style7',
    name: 'Creative Primary',
    nameAr: 'الابتدائي الإبداعي (قطار الأعداد)',
    tagline: 'قطار الأعداد، قفزات الفاصلة، وسحب ملونة',
    descriptionAr: 'مخصص للطور الابتدائي والمتوسط الصغار: قطار أرقام، أسهم قفز للفاصلة العشرية ↷ ↷، سحب ملونة، وشارات نجوم محفزة.',
    isPro: true,
    tokens: {
      primary: '#0284c7',
      secondary: '#f59e0b',
      accent: '#10b981',
      background: '#fffdf5',
      surface: '#ffffff',
      surfaceAccent: '#fefce8',
      text: '#0f172a',
      mutedText: '#475569',
      border: '#fde047',
      heading: '#0369a1',
      tableHeader: '#0284c7',
      tableHeaderColor: '#ffffff',
      tableStripe: '#fefce8',
      tableBorder: '#facc15',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#06b6d4'
    },
    fontFamily: "'Almarai', 'Changa', 'Cairo', sans-serif",
    headingFont: "'Changa', 'Almarai', sans-serif",
    borderRadius: '18px',
    shadow: '0 8px 22px rgba(2, 132, 199, 0.14)',
    frameType: 'kids_playful',
    palette: ['#0284c7', '#f59e0b', '#10b981', '#fefce8', '#ffffff'],
    headerStyle: 'kids_train_header',
    footerStyle: 'kids_train_footer',
    artDirection: 'kids_creative',
    bgCss: 'linear-gradient(180deg, #f0f9ff 0%, #fffdf5 40%, #ffffff 100%)'
  },

  // ==========================================================================
  // STYLE 12 — MASTER INFOGRAPHIC (البوستر الإنفوجرافي الشامل)
  // Full-page pedagogical infographic poster: Hero Banner -> Concept Anchor ->
  // Visual Flow Pipeline -> Formula Spotlight -> Step Columns -> Challenge
  // ==========================================================================
  {
    id: 'premium_editorial',
    legacyId: 'style15',
    name: 'Master Infographic',
    nameAr: 'البوستر الإنفوجرافي الشامل (Master)',
    tagline: 'بوستر تعليمي بصري متكامل من أول الصفحة لآخرها',
    descriptionAr: 'يحول صفحة A4 إلى بوستر إنفوجرافي بمسار تدفق مرئي، نوافذ مقارنة خطوة بخطوة، وإبراز ضخم للقوانين والتمارين.',
    isPro: true,
    tokens: {
      primary: '#0f172a',
      secondary: '#2563eb',
      accent: '#f59e0b',
      background: '#f8fafc',
      surface: '#ffffff',
      surfaceAccent: '#eff6ff',
      text: '#09090b',
      mutedText: '#52525b',
      border: '#cbd5e1',
      heading: '#0f172a',
      tableHeader: '#0f172a',
      tableHeaderColor: '#ffffff',
      tableStripe: '#f8fafc',
      tableBorder: '#cbd5e1',
      success: '#16a34a',
      warning: '#f59e0b',
      danger: '#dc2626',
      info: '#2563eb'
    },
    fontFamily: "'El Messiri', 'Cairo', serif",
    headingFont: "'El Messiri', 'Cairo', serif",
    borderRadius: '8px',
    shadow: '0 8px 24px rgba(15, 23, 42, 0.1)',
    frameType: 'editorial_rules',
    palette: ['#0f172a', '#2563eb', '#f59e0b', '#eff6ff', '#ffffff'],
    headerStyle: 'master_poster_header',
    footerStyle: 'master_poster_footer',
    artDirection: 'master_infographic',
    bgCss: 'linear-gradient(180deg, #f1f5f9 0%, #ffffff 10%, #ffffff 90%, #f1f5f9 100%)'
  }
];

export function getStyleById(id: string): StyleDefinition {
  const found = STYLES_REGISTRY.find(s => s.id === id || s.legacyId === id);
  return found || STYLES_REGISTRY[0];
}

/**
 * 🎨 Transformed HTML Engine:
 * Ingests any document HTML, detects pedagogical constructs, and reconstructs
 * the composition into a breathtaking visual infographic adhering to the selected Art Direction.
 */
export function transformDocumentToStyle(
  rawHtml: string, 
  styleId: string, 
  meta?: {
    school?: string;
    subject?: string;
    teacher?: string;
    level?: string;
    domain?: string;
    topic?: string;
    duration?: string;
    typeLabel?: string;
  }
): string {
  if (!rawHtml || typeof rawHtml !== 'string') return rawHtml;

  const style = getStyleById(styleId);
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');
  const body = doc.body;

  // 1. Transform Header Table if found
  const tables = Array.from(body.querySelectorAll('table'));
  tables.forEach((table, tableIdx) => {
    const isHeaderTable = tableIdx === 0 && (
      table.innerHTML.includes('الجمهورية') || 
      table.innerHTML.includes('المؤسسة') || 
      table.innerHTML.includes('الأستاذ') ||
      table.innerHTML.includes('المادة')
    );

    if (isHeaderTable) {
      applyArtDirectionHeader(table, style, meta);
      return;
    }

    // Regular pedagogical tables styling
    applyPedagogicalTableStyle(table, style);
  });

  // 2. Extract or Synthesize Topic & Learning Goals for Infographic Anchors
  const topicName = meta?.topic || extractTopicFromDocument(body) || 'الدرس المستهدف';

  // 3. Scan & Transform Pedagogical Blocks into rich components
  const blocks = Array.from(body.querySelectorAll('div, section, blockquote, p'));
  
  blocks.forEach(block => {
    const text = block.textContent || '';
    const trimmed = text.trim();
    if (trimmed.length === 0) return;
    if (block.getAttribute('data-styled') === 'true') return;

    // A: الوضعية التعلمية / نشاط استكشافي / وضعية مشكلة
    if (
      (trimmed.startsWith('وضعية تعلمية') || 
       trimmed.startsWith('الوضعية التعلمية') || 
       trimmed.startsWith('وضعية مشكلة') || 
       trimmed.startsWith('الوضعية الانطلاقية') || 
       trimmed.startsWith('نشاط استكشافي') ||
       trimmed.startsWith('أكتشف') ||
       trimmed.startsWith('بناء التعلمات')) &&
      trimmed.length > 12
    ) {
      renderLearningSituationComponent(block as HTMLElement, style);
      block.setAttribute('data-styled', 'true');
      return;
    }

    // B: الهدف التعلمي / الكفاءة المستهدفة
    if (
      (trimmed.startsWith('الهدف التعلمي') || 
       trimmed.startsWith('أهداف الدرس') || 
       trimmed.startsWith('الهدف :') || 
       trimmed.startsWith('الهدف:')) &&
      trimmed.length > 8
    ) {
      renderObjectiveComponent(block as HTMLElement, style);
      block.setAttribute('data-styled', 'true');
      return;
    }

    if (
      (trimmed.startsWith('الكفاءة المستهدفة') || 
       trimmed.startsWith('الكفاءة الختامية') || 
       trimmed.startsWith('الكفاءة:')) &&
      trimmed.length > 8
    ) {
      renderCompetencyComponent(block as HTMLElement, style);
      block.setAttribute('data-styled', 'true');
      return;
    }

    // C: القاعدة / المبرهنة / التعريف / الخاصية
    if (
      (trimmed.startsWith('قاعدة') || 
       trimmed.startsWith('القاعدة') || 
       trimmed.startsWith('مبرهنة') || 
       trimmed.startsWith('المبرهنة') || 
       trimmed.startsWith('خاصية') || 
       trimmed.startsWith('الخاصية') || 
       trimmed.startsWith('تعريف') || 
       trimmed.startsWith('التعريف')) &&
      trimmed.length > 8
    ) {
      renderRuleComponent(block as HTMLElement, style);
      block.setAttribute('data-styled', 'true');
      return;
    }

    // D: الحوصلة / إرساء الموارد / الخلاصة
    if (
      (trimmed.startsWith('حوصلة') || 
       trimmed.startsWith('الحوصلة') || 
       trimmed.startsWith('إرساء الموارد') || 
       trimmed.startsWith('خلاصة') || 
       trimmed.startsWith('الخلاصة')) &&
      trimmed.length > 8
    ) {
      renderSummaryComponent(block as HTMLElement, style);
      block.setAttribute('data-styled', 'true');
      return;
    }

    // E: مثال محلول / أمثلة تطبيقية
    if (
      (trimmed.startsWith('مثال محلول') || 
       trimmed.startsWith('مثال تطبيقي') || 
       trimmed.startsWith('مثال 1') || 
       trimmed.startsWith('مثال 2') || 
       trimmed.startsWith('مثال:') || 
       trimmed.startsWith('أمثلة:')) &&
      trimmed.length > 6
    ) {
      renderExampleComponent(block as HTMLElement, style);
      block.setAttribute('data-styled', 'true');
      return;
    }

    // F: ملاحظة / تنبيه / خطأ شائع / تذكّر
    if (
      (trimmed.startsWith('ملاحظة') || 
       trimmed.startsWith('تنبيه') || 
       trimmed.startsWith('خطأ شائع') || 
       trimmed.startsWith('تذكّر') || 
       trimmed.startsWith('معلومة هامة') || 
       trimmed.startsWith('إرشاد:')) &&
      trimmed.length > 6
    ) {
      renderWarningComponent(block as HTMLElement, style);
      block.setAttribute('data-styled', 'true');
      return;
    }

    // G: تمرين / تطبيق / إعادة استثمار
    if (
      (trimmed.startsWith('تمرين') || 
       trimmed.startsWith('التمرين الأول') || 
       trimmed.startsWith('التمرين الثاني') || 
       trimmed.startsWith('التمرين الثالث') || 
       trimmed.startsWith('التمرين 1') || 
       trimmed.startsWith('التمرين 2') || 
       trimmed.startsWith('تطبيق مباشر') || 
       trimmed.startsWith('إعادة استثمار') ||
       trimmed.startsWith('المسألة')) &&
      trimmed.length > 10
    ) {
      renderExerciseComponent(block as HTMLElement, style);
      block.setAttribute('data-styled', 'true');
      return;
    }
  });

  // 4. Transform Headings into Art Direction Banners
  const headings = Array.from(body.querySelectorAll('h1, h2, h3, h4'));
  headings.forEach(h => {
    applyHeadingArtDirection(h as HTMLElement, style);
  });

  // 5. Enhance Math Content with Visual Diagram Metaphors
  injectVisualMetaphors(body, style, topicName);

  return body.innerHTML;
}

// ============================================================================
// 🎨 HEADER STYLES PER ART DIRECTION
// ============================================================================
function applyArtDirectionHeader(table: HTMLTableElement, style: StyleDefinition, meta?: any) {
  const t = style.tokens;
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.marginBottom = '14px';
  table.style.pageBreakInside = 'avoid';
  table.style.breakInside = 'avoid';
  table.style.fontFamily = style.fontFamily;
  table.style.overflow = 'hidden';

  switch (style.artDirection) {
    case 'board_3d':
      // Metallic floating board with corner rivets
      table.style.background = `linear-gradient(135deg, ${t.primary} 0%, #1e3a8a 60%, #0f172a 100%)`;
      table.style.borderRadius = '12px';
      table.style.border = `2px solid ${t.accent}`;
      table.style.boxShadow = '0 10px 24px rgba(15, 39, 74, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)';
      table.style.position = 'relative';
      break;

    case 'math_infographic':
      // Warm amber infographic hub with rounded capsules
      table.style.background = `linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #f97316 100%)`;
      table.style.borderRadius = '16px';
      table.style.border = `2px solid #f97316`;
      table.style.boxShadow = '0 8px 20px rgba(194, 65, 12, 0.2)';
      break;

    case 'blueprint':
      // Technical draft title block
      table.style.background = `linear-gradient(135deg, #1e3a8a 0%, #0369a1 100%)`;
      table.style.borderRadius = '2px';
      table.style.border = `2px solid #38bdf8`;
      table.style.outline = `1px dashed #7dd3fc`;
      table.style.outlineOffset = '-4px';
      break;

    case 'textbook':
      // Published textbook luxury ribbon with ornate borders
      table.style.background = `linear-gradient(135deg, #065f46 0%, #047857 70%, #064e3b 100%)`;
      table.style.borderRadius = '4px';
      table.style.border = `3px double #d97706`;
      table.style.borderBottom = `5px solid #d97706`;
      break;

    case 'gamified':
      // Quest Launch Header with Trophy & XP Badges
      table.style.background = `linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #ea580c 100%)`;
      table.style.borderRadius = '16px';
      table.style.border = `3px solid #facc15`;
      table.style.boxShadow = '0 8px 24px rgba(185, 28, 28, 0.25)';
      break;

    case 'smart_ai':
      // Futuristic HUD Top Panel
      table.style.background = `linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0284c7 100%)`;
      table.style.borderRadius = '8px';
      table.style.border = `2px solid #06b6d4`;
      table.style.borderTop = `4px solid #6366f1`;
      break;

    case 'notebook_3d':
      // Spiral Notebook Rings & Craft paper header
      table.style.background = `linear-gradient(135deg, #0369a1 0%, #0284c7 100%)`;
      table.style.borderRadius = '8px';
      table.style.border = `2px solid #075985`;
      table.style.boxShadow = '0 6px 16px rgba(3, 105, 161, 0.15)';
      break;

    case 'color_block':
      // Bauhaus Split Block
      table.style.background = `#0f766e`;
      table.style.borderRadius = '0px';
      table.style.borderRight = `12px solid #f59e0b`;
      table.style.borderBottom = `3px solid #1e40af`;
      break;

    case 'mind_map':
      // Organic Mind Map Radiating Capsule
      table.style.background = `linear-gradient(135deg, #5b21b6 0%, #7c3aed 60%, #ec4899 100%)`;
      table.style.borderRadius = '24px';
      table.style.border = `2px solid #e9d5ff`;
      break;

    case 'dz_premium':
      // Republic Emblem & Maghrebi Filigree
      table.style.background = `linear-gradient(135deg, #006633 0%, #047857 70%, #004d26 100%)`;
      table.style.borderRadius = '6px';
      table.style.border = `2px solid #10b981`;
      table.style.borderBottom = `4px solid #d21034`;
      break;

    case 'kids_creative':
      // Cheerful Sky Blue & Train Cloud Header
      table.style.background = `linear-gradient(135deg, #0284c7 0%, #38bdf8 50%, #f59e0b 100%)`;
      table.style.borderRadius = '20px';
      table.style.border = `3px solid #facc15`;
      break;

    case 'master_infographic':
    default:
      // Master Editorial Banner
      table.style.background = `linear-gradient(135deg, #0f172a 0%, #1e293b 70%, #2563eb 100%)`;
      table.style.borderRadius = '8px';
      table.style.border = `2px solid #3b82f6`;
      table.style.borderBottom = `4px solid #f59e0b`;
      break;
  }

  // Ensure high contrast white text on the header
  table.querySelectorAll('td, th, div, span, b, strong').forEach(el => {
    (el as HTMLElement).style.color = '#ffffff';
  });
}

function applyPedagogicalTableStyle(table: HTMLTableElement, style: StyleDefinition) {
  const t = style.tokens;
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.margin = '10px 0 14px 0';
  table.style.fontFamily = style.fontFamily;
  table.style.fontSize = '12px';
  table.style.pageBreakInside = 'auto';

  table.querySelectorAll('th').forEach(th => {
    const el = th as HTMLElement;
    el.style.backgroundColor = t.tableHeader;
    el.style.color = t.tableHeaderColor;
    el.style.padding = '8px 10px';
    el.style.fontWeight = 'bold';
    el.style.border = `1px solid ${t.tableBorder}`;
    el.style.fontFamily = style.headingFont;
    el.style.textAlign = 'center';
    el.style.fontSize = '12.5px';
  });

  table.querySelectorAll('tbody tr, tr').forEach((tr, rowIdx) => {
    const elTr = tr as HTMLElement;
    elTr.style.pageBreakInside = 'avoid';
    elTr.style.breakInside = 'avoid';

    const tds = Array.from(elTr.querySelectorAll('td'));
    if (tds.length > 0 && rowIdx > 0) {
      elTr.style.backgroundColor = rowIdx % 2 === 0 ? t.tableStripe : '#ffffff';
    }

    tds.forEach(td => {
      const elTd = td as HTMLElement;
      elTd.style.padding = '8px 10px';
      elTd.style.border = `1px solid ${t.tableBorder}`;
      elTd.style.verticalAlign = 'top';
      elTd.style.lineHeight = '1.6';
    });
  });
}

// ============================================================================
// 🎯 COMPONENT 1: Learning Situation / Exploration Card (الوضعية التعلمية)
// ============================================================================
function renderLearningSituationComponent(el: HTMLElement, style: StyleDefinition) {
  const t = style.tokens;
  const originalHtml = el.innerHTML;
  el.className = `${el.className} avoid-break situation-card`.trim();
  el.style.margin = '14px 0 16px 0';
  el.style.pageBreakInside = 'avoid';
  el.style.breakInside = 'avoid';
  el.style.fontFamily = style.fontFamily;

  let badgeIcon = '🧭';
  let badgeTitle = 'الوضعية التعلمية (بناء التعلمات والاستكشاف)';
  let stageLabel = 'مرحلة الاكتشاف والتقصي';
  let cardHtml = '';

  if (style.artDirection === 'board_3d') {
    // 3D Glass Board Card with rivets & depth
    el.style.backgroundColor = '#ffffff';
    el.style.border = `2px solid ${t.primary}`;
    el.style.borderRadius = '14px';
    el.style.boxShadow = '0 10px 25px rgba(15, 39, 74, 0.1), inset 0 1px 0 rgba(255,255,255,0.8)';
    el.style.padding = '14px 16px';
    cardHtml = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, ${t.primary}, ${t.secondary}); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 4px 8px rgba(0,0,0,0.15);">
            ${badgeIcon}
          </span>
          <div>
            <span style="font-family: ${style.headingFont}; font-weight: 800; font-size: 15px; color: ${t.primary}; display: block;">
              ${badgeTitle}
            </span>
            <span style="font-size: 10.5px; color: ${t.mutedText};">السياق البيداغوجي والنشاط التجريبي</span>
          </div>
        </div>
        <span style="background: linear-gradient(135deg, ${t.primary}, ${t.secondary}); color: #ffffff; font-size: 10.5px; font-weight: bold; padding: 3px 10px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          ${stageLabel}
        </span>
      </div>
      <div style="color: ${t.text}; font-size: 12.5px; line-height: 1.75;">
        ${originalHtml}
      </div>
    `;
  } else if (style.artDirection === 'notebook_3d') {
    // Tactile notebook craft card with pushpin & scotch tape
    el.style.backgroundColor = '#fffef5';
    el.style.border = `1.5px solid #cbd5e1`;
    el.style.borderRadius = '8px';
    el.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)';
    el.style.padding = '14px 16px';
    el.style.position = 'relative';
    cardHtml = `
      <div style="position: absolute; top: -10px; right: 20px; font-size: 18px; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.2));">📌</div>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1.5px dashed #cbd5e1;">
        <span style="font-family: ${style.headingFont}; font-weight: 800; font-size: 14.5px; color: ${t.primary};">
          ${badgeIcon} ${badgeTitle}
        </span>
        <span style="background: #fef08a; color: #854d0e; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 4px; border: 1px solid #fde047;">
          نشاط في الكراس ✍️
        </span>
      </div>
      <div style="color: ${t.text}; font-size: 12.5px; line-height: 1.7;">
        ${originalHtml}
      </div>
    `;
  } else if (style.artDirection === 'gamified') {
    // Gamified Level 1 Launch Pad
    el.style.backgroundColor = '#ffffff';
    el.style.border = `2px solid ${t.primary}`;
    el.style.borderRadius = '14px';
    el.style.boxShadow = '0 6px 18px rgba(185, 28, 28, 0.12)';
    el.style.padding = '14px 16px';
    cardHtml = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 2px solid #fee2e2;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="background: #b91c1c; color: #fff; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 6px;">
            المستوى 1 🚀
          </span>
          <span style="font-family: ${style.headingFont}; font-weight: 800; font-size: 14.5px; color: #991b1b;">
            مرحلة الانطلاق والاستكشاف
          </span>
        </div>
        <span style="background: #fef08a; color: #854d0e; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 12px; border: 1px solid #facc15;">
          +50 XP ⚡
        </span>
      </div>
      <div style="color: ${t.text}; font-size: 12.5px; line-height: 1.7;">
        ${originalHtml}
      </div>
    `;
  } else if (style.artDirection === 'blueprint') {
    // Technical draftsman block
    el.style.backgroundColor = '#ffffff';
    el.style.border = `1.5px solid #0284c7`;
    el.style.borderRight = `6px solid #1e3a8a`;
    el.style.borderRadius = '2px';
    el.style.padding = '12px 14px';
    cardHtml = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #bae6fd;">
        <span style="font-family: monospace; font-size: 10px; color: #0284c7; font-weight: bold;">
          [SEC-01 // SITUATION_STUDY]
        </span>
        <span style="font-family: ${style.headingFont}; font-weight: 800; font-size: 14px; color: #1e3a8a;">
          📐 الوضعية التعلمية الاستكشافية
        </span>
      </div>
      <div style="color: ${t.text}; font-size: 12px; line-height: 1.7;">
        ${originalHtml}
      </div>
    `;
  } else {
    // Default high-contrast infographic card
    el.style.backgroundColor = t.surface;
    el.style.border = `1.5px solid ${t.border}`;
    el.style.borderRight = `6px solid ${t.primary}`;
    el.style.borderRadius = style.borderRadius;
    el.style.padding = '12px 14px';
    el.style.boxShadow = style.shadow;
    cardHtml = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1.5px solid ${t.border};">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: ${t.primary}; color: #ffffff; font-size: 14px;">
            ${badgeIcon}
          </span>
          <span style="font-family: ${style.headingFont}; font-weight: 800; font-size: 14.5px; color: ${t.primary};">
            ${badgeTitle}
          </span>
        </div>
        <span style="background-color: ${t.primary}; color: #ffffff; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 12px;">
          ${stageLabel}
        </span>
      </div>
      <div style="color: ${t.text}; font-size: 12.5px; line-height: 1.7;">
        ${originalHtml}
      </div>
    `;
  }

  el.innerHTML = cardHtml;
}

// ============================================================================
// 🎯 COMPONENT 2: Learning Objective Card (الهدف التعلمي)
// ============================================================================
function renderObjectiveComponent(el: HTMLElement, style: StyleDefinition) {
  const t = style.tokens;
  const originalHtml = el.innerHTML;
  el.className = `${el.className} avoid-break objective-card`.trim();
  el.style.backgroundColor = style.artDirection === 'board_3d' ? '#f0fdf4' : t.surfaceAccent;
  el.style.border = `1.5px solid ${t.accent}`;
  el.style.borderRight = `5px solid ${t.accent}`;
  el.style.borderRadius = style.borderRadius;
  el.style.padding = '8px 12px';
  el.style.margin = '8px 0 10px 0';
  el.style.pageBreakInside = 'avoid';
  el.style.breakInside = 'avoid';

  el.innerHTML = `
    <div style="display: flex; align-items: flex-start; gap: 10px;">
      <span style="display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: ${t.accent}; color: #ffffff; font-size: 12px; font-weight: bold; flex-shrink: 0; margin-top: 1px;">
        🎯
      </span>
      <div style="flex: 1; font-size: 12.5px; color: ${t.text}; line-height: 1.65;">
        ${originalHtml}
      </div>
    </div>
  `;
}

// ============================================================================
// 🧠 COMPONENT 3: Target Competency Card (الكفاءة المستهدفة)
// ============================================================================
function renderCompetencyComponent(el: HTMLElement, style: StyleDefinition) {
  const t = style.tokens;
  const originalHtml = el.innerHTML;
  el.className = `${el.className} avoid-break competency-card`.trim();
  el.style.backgroundColor = style.artDirection === 'notebook_3d' ? '#f0fdf4' : t.surface;
  el.style.border = `1.5px solid ${t.secondary}`;
  el.style.borderRight = `5px solid ${t.secondary}`;
  el.style.borderRadius = style.borderRadius;
  el.style.padding = '8px 12px';
  el.style.margin = '8px 0 10px 0';
  el.style.pageBreakInside = 'avoid';
  el.style.breakInside = 'avoid';

  el.innerHTML = `
    <div style="display: flex; align-items: flex-start; gap: 10px;">
      <span style="display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: ${t.secondary}; color: #ffffff; font-size: 12px; font-weight: bold; flex-shrink: 0; margin-top: 1px;">
        🧠
      </span>
      <div style="flex: 1; font-size: 12.5px; color: ${t.text}; line-height: 1.65;">
        ${originalHtml}
      </div>
    </div>
  `;
}

// ============================================================================
// 📌 COMPONENT 4: Rule & Theorem Panel (القاعدة والمفهوم الأساسي)
// ============================================================================
function renderRuleComponent(el: HTMLElement, style: StyleDefinition) {
  const t = style.tokens;
  const originalHtml = el.innerHTML;
  el.className = `${el.className} avoid-break rule-card`.trim();
  el.style.margin = '12px 0 14px 0';
  el.style.pageBreakInside = 'avoid';
  el.style.breakInside = 'avoid';
  el.style.fontFamily = style.fontFamily;

  if (style.artDirection === 'board_3d') {
    // Floating Acrylic Rule Card with embossed pill badge
    el.style.backgroundColor = '#ffffff';
    el.style.border = `2px solid ${t.accent}`;
    el.style.borderRadius = '12px';
    el.style.padding = '12px 16px';
    el.style.boxShadow = '0 10px 24px rgba(0,0,0,0.08), inset 0 2px 0 rgba(255,255,255,0.9)';
    el.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 2px solid #f1f5f9;">
        <span style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #ffffff; padding: 4px 14px; border-radius: 20px; font-weight: 800; font-size: 12.5px; box-shadow: 0 2px 6px rgba(217, 119, 6, 0.3);">
          📌 قاعدة ومفهوم جوهري
        </span>
        <span style="font-size: 11px; color: ${t.mutedText}; font-weight: bold;">تطبيق إلزامي</span>
      </div>
      <div style="color: ${t.text}; font-size: 13px; line-height: 1.75; font-weight: 500;">
        ${originalHtml}
      </div>
    `;
  } else if (style.artDirection === 'notebook_3d') {
    // Yellow Sticky Note with 45° tape & realistic shadow
    el.style.backgroundColor = '#fef9c3';
    el.style.border = `1.5px solid #fde047`;
    el.style.borderRadius = '6px';
    el.style.padding = '14px 16px';
    el.style.boxShadow = '0 8px 18px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05)';
    el.style.position = 'relative';
    el.innerHTML = `
      <div style="position: absolute; top: -8px; left: 16px; width: 44px; height: 16px; background: rgba(254, 240, 138, 0.7); border: 1px solid rgba(250, 204, 21, 0.5); transform: rotate(-8deg); box-shadow: 0 1px 2px rgba(0,0,0,0.1);"></div>
      <div style="font-family: ${style.headingFont}; font-weight: 800; font-size: 13.5px; color: #854d0e; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
        <span>📌</span> <span>قاعدة هامة للحفظ والفهم:</span>
      </div>
      <div style="color: #713f12; font-size: 12.5px; line-height: 1.75; font-weight: 600;">
        ${originalHtml}
      </div>
    `;
  } else if (style.artDirection === 'gamified') {
    // Power-up Card
    el.style.backgroundColor = '#fffbeb';
    el.style.border = `2px solid #f59e0b`;
    el.style.borderRadius = '12px';
    el.style.padding = '12px 14px';
    el.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <span style="background: #f59e0b; color: #fff; padding: 3px 10px; border-radius: 6px; font-weight: 800; font-size: 12px;">
          ⚡ مهارة مكتسبة (قاعدة الدرس)
        </span>
        <span style="font-weight: bold; color: #b45309; font-size: 11px;">🏆 بطاقة المفهوم</span>
      </div>
      <div style="color: #78350f; font-size: 12.5px; line-height: 1.7; font-weight: 600;">
        ${originalHtml}
      </div>
    `;
  } else {
    // Crisp formal Rule panel
    el.style.backgroundColor = '#fffbeb';
    el.style.border = `2px solid ${t.accent}`;
    el.style.borderRight = `6px solid ${t.accent}`;
    el.style.borderRadius = style.borderRadius;
    el.style.padding = '12px 14px';
    el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
    el.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
        <span style="display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 4px; background-color: ${t.accent}; color: #ffffff; font-size: 13px;">
          📌
        </span>
        <span style="font-family: ${style.headingFont}; font-weight: 800; font-size: 14px; color: ${t.heading};">
          قاعدة ومفهوم أساسي
        </span>
      </div>
      <div style="color: ${t.text}; font-size: 12.5px; line-height: 1.7; font-weight: 500;">
        ${originalHtml}
      </div>
    `;
  }
}

// ============================================================================
// 📚 COMPONENT 5: Synthesis / Summary Card (الحوصلة وإرساء الموارد)
// ============================================================================
function renderSummaryComponent(el: HTMLElement, style: StyleDefinition) {
  const t = style.tokens;
  const originalHtml = el.innerHTML;
  el.className = `${el.className} avoid-break summary-card`.trim();
  el.style.backgroundColor = t.surface;
  el.style.border = `2px solid ${t.primary}`;
  el.style.borderRight = `6px solid ${t.primary}`;
  el.style.borderRadius = style.borderRadius;
  el.style.padding = '12px 16px';
  el.style.margin = '14px 0 16px 0';
  el.style.boxShadow = style.shadow;
  el.style.pageBreakInside = 'avoid';
  el.style.breakInside = 'avoid';

  el.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 2px solid ${t.border};">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px;">📚</span>
        <span style="font-family: ${style.headingFont}; font-weight: 800; font-size: 15px; color: ${t.primary};">
          الحوصلة وإرساء التعلمات
        </span>
      </div>
      <span style="font-size: 11px; color: ${t.mutedText}; font-weight: bold;">خلاصة المورد المعرفي</span>
    </div>
    <div style="color: ${t.text}; font-size: 12.5px; line-height: 1.75;">
      ${originalHtml}
    </div>
  `;
}

// ============================================================================
// ✏️ COMPONENT 6: Example Card (مثال محلول وتطبيق نموذجي)
// ============================================================================
function renderExampleComponent(el: HTMLElement, style: StyleDefinition) {
  const t = style.tokens;
  const originalHtml = el.innerHTML;
  el.className = `${el.className} avoid-break example-card`.trim();
  el.style.backgroundColor = '#f8fafc';
  el.style.border = `1.5px solid ${t.secondary}`;
  el.style.borderRight = `4px solid ${t.secondary}`;
  el.style.borderRadius = style.borderRadius;
  el.style.padding = '10px 14px';
  el.style.margin = '10px 0 12px 0';
  el.style.pageBreakInside = 'avoid';
  el.style.breakInside = 'avoid';

  el.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
      <span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 4px; background: ${t.secondary}; color: #ffffff; font-size: 12px;">
        ✏️
      </span>
      <span style="font-family: ${style.headingFont}; font-weight: 700; font-size: 13px; color: ${t.secondary};">
        مثال تطبيقي ونموذج حل خطوة بخطوة
      </span>
    </div>
    <div style="color: ${t.text}; font-size: 12px; line-height: 1.7;">
      ${originalHtml}
    </div>
  `;
}

// ============================================================================
// ⚠️ COMPONENT 7: Warning / Pro-Tip Card (تنبيه وملاحظة هامة)
// ============================================================================
function renderWarningComponent(el: HTMLElement, style: StyleDefinition) {
  const originalHtml = el.innerHTML;
  el.className = `${el.className} avoid-break warning-card`.trim();
  el.style.backgroundColor = '#fffbeb';
  el.style.border = `1.5px solid #fde047`;
  el.style.borderRight = `5px solid #eab308`;
  el.style.borderRadius = style.borderRadius;
  el.style.padding = '9px 13px';
  el.style.margin = '8px 0 10px 0';
  el.style.pageBreakInside = 'avoid';
  el.style.breakInside = 'avoid';

  el.innerHTML = `
    <div style="display: flex; align-items: flex-start; gap: 10px;">
      <span style="font-size: 16px; line-height: 1;">⚠️</span>
      <div style="flex: 1; font-size: 12px; color: #78350f; line-height: 1.65; font-weight: 500;">
        ${originalHtml}
      </div>
    </div>
  `;
}

// ============================================================================
// ⭐ COMPONENT 8: Exercise & Reinvestment Card (التمارين وإعادة الاستثمار)
// ============================================================================
function renderExerciseComponent(el: HTMLElement, style: StyleDefinition) {
  const t = style.tokens;
  const originalHtml = el.innerHTML;
  el.className = `${el.className} avoid-break exercise-card`.trim();
  el.style.margin = '12px 0 16px 0';
  el.style.pageBreakInside = 'avoid';
  el.style.breakInside = 'avoid';
  el.style.fontFamily = style.fontFamily;

  if (style.artDirection === 'textbook') {
    // Textbook Ribbon-cut Exercise Tab (Reference Images 4 & 5)
    el.style.backgroundColor = '#ffffff';
    el.style.border = `1.5px solid #a7f3d0`;
    el.style.borderRadius = '4px';
    el.style.padding = '12px 14px';
    el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
    el.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1.5px solid #ecfdf5;">
        <span style="background: linear-gradient(135deg, #065f46, #047857); color: #ffffff; padding: 4px 14px; font-weight: bold; font-size: 12.5px; border-radius: 4px; box-shadow: 0 2px 4px rgba(6, 95, 70, 0.2);">
          التمرين الأول ★ تطبيق مباشر
        </span>
        <span style="font-size: 11px; color: #047857; font-weight: bold;">سلسلة تمارين المنهاج</span>
      </div>
      <div style="color: ${t.text}; font-size: 12.5px; line-height: 1.7;">
        ${originalHtml}
      </div>
    `;
  } else if (style.artDirection === 'gamified') {
    // Boss Challenge Card
    el.style.backgroundColor = '#ffffff';
    el.style.border = `2px solid #ea580c`;
    el.style.borderRadius = '14px';
    el.style.padding = '12px 16px';
    el.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 2px solid #ffedd5;">
        <span style="background: #ea580c; color: #fff; padding: 4px 12px; border-radius: 8px; font-weight: 800; font-size: 12.5px;">
          المستوى 2 ⚡ تحدي التمرين
        </span>
        <span style="background: #fef08a; color: #854d0e; font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 12px;">
          +100 XP
        </span>
      </div>
      <div style="color: ${t.text}; font-size: 12.5px; line-height: 1.7;">
        ${originalHtml}
      </div>
    `;
  } else {
    // Default high-grade exercise card
    el.style.backgroundColor = '#ffffff';
    el.style.border = `1.5px solid ${t.border}`;
    el.style.borderTop = `4px solid ${t.primary}`;
    el.style.borderRadius = style.borderRadius;
    el.style.padding = '12px 14px';
    el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
    el.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid ${t.border};">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background-color: ${t.primary}; color: #ffffff; font-size: 11px; font-weight: bold;">
            ★
          </span>
          <span style="font-family: ${style.headingFont}; font-weight: 700; font-size: 13.5px; color: ${t.primary};">
            تطبيق وإعادة استثمار
          </span>
        </div>
        <span style="font-size: 11px; color: ${t.mutedText}; font-weight: bold;">عمل فردي / ثنائي</span>
      </div>
      <div style="color: ${t.text}; font-size: 12.5px; line-height: 1.7;">
        ${originalHtml}
      </div>
    `;
  }
}

// ============================================================================
// 🎨 HEADING ART DIRECTION
// ============================================================================
function applyHeadingArtDirection(el: HTMLElement, style: StyleDefinition) {
  const t = style.tokens;
  const tag = el.tagName.toLowerCase();
  el.style.fontFamily = style.headingFont;
  el.style.pageBreakAfter = 'avoid';
  el.style.breakAfter = 'avoid';
  el.style.lineHeight = '1.35';

  if (tag === 'h1') {
    el.style.fontSize = '20px';
    el.style.fontWeight = '800';
    el.style.color = t.heading;
    el.style.margin = '14px 0 10px 0';
    el.style.padding = '8px 14px';
    el.style.background = `linear-gradient(90deg, ${t.surface} 0%, transparent 100%)`;
    el.style.borderRight = `6px solid ${t.primary}`;
    el.style.borderRadius = style.borderRadius;
  } else if (tag === 'h2') {
    el.style.fontSize = '16px';
    el.style.fontWeight = '700';
    el.style.color = t.primary;
    el.style.margin = '12px 0 8px 0';
    el.style.padding = '6px 10px';
    el.style.background = t.surfaceAccent;
    el.style.borderRight = `4px solid ${t.secondary}`;
    el.style.borderBottom = `1px solid ${t.border}`;
    el.style.borderRadius = style.borderRadius;
  } else {
    el.style.fontSize = '14px';
    el.style.fontWeight = '700';
    el.style.color = t.text;
    el.style.margin = '10px 0 6px 0';
    el.style.paddingRight = '6px';
    el.style.borderRight = `3px solid ${t.accent}`;
  }
}

// ============================================================================
// 🔬 INJECT VISUAL METAPHORS & INFOGRAPHIC DIAGRAMS
// ============================================================================
function injectVisualMetaphors(body: HTMLElement, style: StyleDefinition, topicName: string) {
  const fullText = body.textContent || '';

  // Check if this document involves Signed Numbers (الأعداد النسبية)
  const hasSignedNumbers = fullText.includes('أعداد نسبية') || fullText.includes('عدد نسبي') || fullText.includes('جداء عددين') || fullText.includes('موجب') && fullText.includes('سالب');
  if (hasSignedNumbers && !body.querySelector('.signed-numbers-diagram')) {
    const signedDiagram = createSignedNumbersDiagram(style);
    insertDiagramNearFirstRule(body, signedDiagram);
  }

  // Check if this document involves Fractions (الكسور)
  const hasFractions = fullText.includes('كسر') || fullText.includes('الكسور') || fullText.includes('بسط') && fullText.includes('مقام');
  if (hasFractions && !body.querySelector('.fraction-diagram')) {
    const fractionDiagram = createFractionVisualizer(style);
    insertDiagramNearFirstRule(body, fractionDiagram);
  }

  // Check if this document involves Decimals & Place Value (أعداد عشرية، ضرب في 10)
  const hasDecimals = fullText.includes('عشري') || fullText.includes('فاصلة') || fullText.includes('الضرب في 10') || fullText.includes('القسمة على 10');
  if (hasDecimals && !body.querySelector('.decimal-jump-diagram')) {
    const decimalDiagram = createDecimalJumpDiagram(style);
    insertDiagramNearFirstRule(body, decimalDiagram);
  }

  // Check if this document involves Geometry (مثلث، قائم، زاوية، مساحة)
  const hasGeometry = fullText.includes('مثلث') || fullText.includes('قائم') || fullText.includes('مستطيل') || fullText.includes('مساحة');
  if (hasGeometry && !body.querySelector('.geometry-diagram')) {
    const geomDiagram = createGeometryVisualizer(style);
    insertDiagramNearFirstRule(body, geomDiagram);
  }
}

function insertDiagramNearFirstRule(body: HTMLElement, diagramHtml: string) {
  const ruleOrSummary = body.querySelector('.rule-card, .situation-card, .summary-card, h2');
  if (ruleOrSummary && ruleOrSummary.parentNode) {
    const container = document.createElement('div');
    container.innerHTML = diagramHtml;
    ruleOrSummary.parentNode.insertBefore(container.firstElementChild || container, ruleOrSummary.nextSibling);
  }
}

// 🟢 🔴 SIGNED NUMBERS VISUALIZER (Reference Image 2 style!)
function createSignedNumbersDiagram(style: StyleDefinition): string {
  return `
    <div class="signed-numbers-diagram avoid-break" style="margin: 12px 0 16px 0; padding: 12px 16px; background: #f8fafc; border: 2px solid #cbd5e1; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
      <div style="font-family: ${style.headingFont}; font-weight: bold; font-size: 13px; color: ${style.tokens.primary}; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
        <span>🎯</span> <span>قاعدة الإشارات في جداء الأعداد النسبية (نموذج بصري تفاعلي):</span>
      </div>
      <div style="display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap; gap: 10px; font-size: 13px; font-weight: bold;">
        <div style="display: flex; align-items: center; gap: 4px; background: #ffffff; padding: 6px 12px; border-radius: 20px; border: 1.5px solid #86efac; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
          <span style="width: 22px; height: 22px; border-radius: 50%; background: #16a34a; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 2px 4px rgba(22,163,74,0.3);">+</span>
          <span>×</span>
          <span style="width: 22px; height: 22px; border-radius: 50%; background: #16a34a; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 2px 4px rgba(22,163,74,0.3);">+</span>
          <span>=</span>
          <span style="color: #16a34a;">(+) موجـب</span>
        </div>
        <div style="display: flex; align-items: center; gap: 4px; background: #ffffff; padding: 6px 12px; border-radius: 20px; border: 1.5px solid #86efac; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
          <span style="width: 22px; height: 22px; border-radius: 50%; background: #dc2626; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 4px rgba(220,38,38,0.3);">-</span>
          <span>×</span>
          <span style="width: 22px; height: 22px; border-radius: 50%; background: #dc2626; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 4px rgba(220,38,38,0.3);">-</span>
          <span>=</span>
          <span style="color: #16a34a;">(+) موجـب</span>
        </div>
        <div style="display: flex; align-items: center; gap: 4px; background: #ffffff; padding: 6px 12px; border-radius: 20px; border: 1.5px solid #fca5a5; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
          <span style="width: 22px; height: 22px; border-radius: 50%; background: #16a34a; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px;">+</span>
          <span>×</span>
          <span style="width: 22px; height: 22px; border-radius: 50%; background: #dc2626; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px;">-</span>
          <span>=</span>
          <span style="color: #dc2626;">(-) سـالب</span>
        </div>
      </div>
    </div>
  `;
}

// 🍰 FRACTION VISUALIZER (Reference Image 3 style!)
function createFractionVisualizer(style: StyleDefinition): string {
  return `
    <div class="fraction-diagram avoid-break" style="margin: 12px 0 16px 0; padding: 12px 16px; background: #fff7ed; border: 2px solid #fed7aa; border-radius: 12px;">
      <div style="font-family: ${style.headingFont}; font-weight: bold; font-size: 13px; color: #c2410c; margin-bottom: 8px;">
        📊 تمثيل الكسور التوضيحي (الأجزاء من الكل):
      </div>
      <div style="display: flex; justify-content: space-around; align-items: center; gap: 14px; flex-wrap: wrap;">
        <!-- 1/2 bar -->
        <div style="text-align: center;">
          <div style="font-weight: bold; font-size: 12px; color: #ea580c; margin-bottom: 4px;">1 / 2 (نصف)</div>
          <div style="width: 100px; height: 22px; border: 2px solid #ea580c; border-radius: 4px; display: flex; overflow: hidden; background: #ffffff;">
            <div style="width: 50%; height: 100%; background: #ea580c;"></div>
            <div style="width: 50%; height: 100%; background: transparent;"></div>
          </div>
        </div>
        <!-- 3/4 bar -->
        <div style="text-align: center;">
          <div style="font-weight: bold; font-size: 12px; color: #0284c7; margin-bottom: 4px;">3 / 4 (ثلاثة أرباع)</div>
          <div style="width: 100px; height: 22px; border: 2px solid #0284c7; border-radius: 4px; display: flex; overflow: hidden; background: #ffffff;">
            <div style="width: 75%; height: 100%; background: #0284c7;"></div>
            <div style="width: 25%; height: 100%; background: transparent;"></div>
          </div>
        </div>
        <!-- Pie fraction SVG -->
        <div style="text-align: center; display: flex; align-items: center; gap: 8px;">
          <svg width="40" height="40" viewBox="0 0 32 32">
            <circle r="16" cx="16" cy="16" fill="#fed7aa" />
            <path d="M16 16 L16 0 A16 16 0 0 1 32 16 Z" fill="#ea580c" />
          </svg>
          <div style="font-size: 11px; font-weight: bold; color: #7c2d12;">قطاع دائري (1/4)</div>
        </div>
      </div>
    </div>
  `;
}

// 🚂 DECIMAL JUMP ARCS (Reference Image 1 style!)
function createDecimalJumpDiagram(style: StyleDefinition): string {
  return `
    <div class="decimal-jump-diagram avoid-break" style="margin: 12px 0 16px 0; padding: 12px 16px; background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 12px;">
      <div style="font-family: ${style.headingFont}; font-weight: bold; font-size: 13px; color: #047857; margin-bottom: 8px;">
        🚂 قفزات الفاصلة العشرية (إزاحة المراتب بحسب عدد الأصفار):
      </div>
      <div style="display: flex; justify-content: center; align-items: center; gap: 20px; font-family: monospace; font-size: 14px; font-weight: bold; direction: ltr;">
        <div style="background: #ffffff; padding: 6px 14px; border-radius: 8px; border: 1.5px solid #86efac; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <span>78.5 ÷ 100 = </span>
          <span style="color: #047857; font-size: 16px;">0.785</span>
          <span style="font-size: 11px; color: #15803d; display: block; margin-top: 2px; font-family: sans-serif;">(مرتبتان لليسار ↷ ↷)</span>
        </div>
        <div style="background: #ffffff; padding: 6px 14px; border-radius: 8px; border: 1.5px solid #86efac; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <span>4.25 × 10 = </span>
          <span style="color: #047857; font-size: 16px;">42.5</span>
          <span style="font-size: 11px; color: #15803d; display: block; margin-top: 2px; font-family: sans-serif;">(مرتبة لليمين ↶)</span>
        </div>
      </div>
    </div>
  `;
}

// 📐 GEOMETRY VISUALIZER (Reference Image 5 style!)
function createGeometryVisualizer(style: StyleDefinition): string {
  return `
    <div class="geometry-diagram avoid-break" style="margin: 12px 0 16px 0; padding: 12px 16px; background: #f0f9ff; border: 2px solid #bae6fd; border-radius: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="font-family: ${style.headingFont}; font-weight: bold; font-size: 13px; color: #0369a1; margin-bottom: 4px;">
            📐 تمثيل هندسي دقيق: المثلث القائم والنسب المثلثية
          </div>
          <div style="font-size: 11.5px; color: #0284c7; line-height: 1.6;">
            في المثلث القائم SRT: جيب التمام = الضلع المجاور ÷ الوتر<br/>
            <span dir="ltr" style="display: inline-block; font-weight: bold; margin-top: 4px;">cos ∠SRT = RT / ST</span>
          </div>
        </div>
        <!-- Right angle triangle SVG -->
        <svg width="120" height="70" viewBox="0 0 120 70">
          <polygon points="10,60 110,60 110,10" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" />
          <!-- Right angle square marker -->
          <rect x="95" y="45" width="15" height="15" fill="none" stroke="#0284c7" stroke-width="1.5" />
          <!-- Vertex labels -->
          <text x="5" y="65" font-size="10" font-weight="bold" fill="#0f172a">S</text>
          <text x="112" y="65" font-size="10" font-weight="bold" fill="#0f172a">R</text>
          <text x="112" y="10" font-size="10" font-weight="bold" fill="#0f172a">T</text>
        </svg>
      </div>
    </div>
  `;
}

function extractTopicFromDocument(body: HTMLElement): string {
  const h1 = body.querySelector('h1');
  if (h1 && h1.textContent) return h1.textContent.trim();
  const titleEl = body.querySelector('.topic, strong');
  if (titleEl && titleEl.textContent) return titleEl.textContent.trim();
  return '';
}
