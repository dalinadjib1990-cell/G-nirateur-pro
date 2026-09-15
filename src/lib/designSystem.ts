import React from 'react';

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
  palette: string[]; // 4 or 5 hex codes for the preview swatch
  headerStyle: string;
  footerStyle: string;
}

export const STYLES_REGISTRY: StyleDefinition[] = [
  {
    id: 'royal_academy',
    legacyId: 'style1',
    name: 'Royal Academy',
    nameAr: 'الأكاديمية الملكية',
    tagline: 'أكاديمي فاخر ورسمي',
    descriptionAr: 'هوية جامعية فاخرة - كحلي ملكي + أزرق داكن + لمسات ذهبية نبيلة مع إطار مزدوج متقن.',
    isPro: false,
    tokens: {
      primary: '#0f274a',
      secondary: '#1e40af',
      accent: '#c59b27',
      background: '#ffffff',
      surface: '#f8fafc',
      surfaceAccent: '#fefce8',
      text: '#0f172a',
      mutedText: '#475569',
      border: '#cbd5e1',
      heading: '#0f274a',
      tableHeader: '#0f274a',
      tableHeaderColor: '#ffffff',
      tableStripe: '#f8fafc',
      tableBorder: '#cbd5e1',
      success: '#15803d',
      warning: '#b45309',
      danger: '#b91c1c',
      info: '#1d4ed8'
    },
    fontFamily: "'Amiri', 'Traditional Arabic', serif",
    headingFont: "'Amiri', 'Cairo', serif",
    borderRadius: '4px',
    shadow: '0 2px 6px -1px rgba(15, 39, 74, 0.08)',
    frameType: 'double_gold',
    palette: ['#0f274a', '#1e40af', '#c59b27', '#f8fafc', '#ffffff'],
    headerStyle: 'royal_banner',
    footerStyle: 'royal_crest'
  },
  {
    id: 'smart_tech',
    legacyId: 'style6',
    name: 'Smart Tech',
    nameAr: 'التقني الذكي',
    tagline: 'تكنولوجيا وتعليم رقمي',
    descriptionAr: 'هوية تقنية معاصرة - أزرق كهربائي + بنفسجي كوانتوم + سيان ساطع مع زوايا هندسية وشارات رقمية.',
    isPro: true,
    tokens: {
      primary: '#0284c7',
      secondary: '#6366f1',
      accent: '#06b6d4',
      background: '#ffffff',
      surface: '#f0fdfa',
      surfaceAccent: '#f5f3ff',
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
    fontFamily: "'Space Grotesk', 'IBM Plex Sans Arabic', 'Cairo', sans-serif",
    headingFont: "'Space Grotesk', 'Changa', sans-serif",
    borderRadius: '6px',
    shadow: '0 4px 12px -2px rgba(2, 132, 199, 0.12)',
    frameType: 'tech_hud',
    palette: ['#0284c7', '#6366f1', '#06b6d4', '#e0f2fe', '#ffffff'],
    headerStyle: 'tech_hud',
    footerStyle: 'tech_statusbar'
  },
  {
    id: 'education_pro',
    legacyId: 'style8',
    name: 'Education Pro',
    nameAr: 'التربوي المحترف',
    tagline: 'تنظيم بيداغوجي فائق الوضوح',
    descriptionAr: 'مخصص للمدرس المحترف - أزرق داكن + تيل + أبيض ناصع مع تنظيم صارم للأهداف، الكفاءات، والتقويم.',
    isPro: true,
    tokens: {
      primary: '#0f766e',
      secondary: '#1e40af',
      accent: '#0d9488',
      background: '#ffffff',
      surface: '#f0fdfa',
      surfaceAccent: '#f8fafc',
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
    headingFont: "'Cairo', sans-serif",
    borderRadius: '6px',
    shadow: '0 2px 8px -1px rgba(15, 118, 110, 0.1)',
    frameType: 'side_rail',
    palette: ['#0f766e', '#1e40af', '#0d9488', '#f0fdfa', '#ffffff'],
    headerStyle: 'pro_header',
    footerStyle: 'pro_footer'
  },
  {
    id: 'emerald_school',
    legacyId: 'style3',
    name: 'Emerald School',
    nameAr: 'المدرسة الزمردية',
    tagline: 'كتاب مدرسي راقٍ',
    descriptionAr: 'أخضر زمردي داكن + أخضر ربيعي + كريمي فاخر، يمنح شعور الكتب المدرسية الفاخرة والطبيعة المريحة للعين.',
    isPro: true,
    tokens: {
      primary: '#065f46',
      secondary: '#059669',
      accent: '#10b981',
      background: '#ffffff',
      surface: '#f0fdf4',
      surfaceAccent: '#fffbeb',
      text: '#064e3b',
      mutedText: '#334155',
      border: '#a7f3d0',
      heading: '#065f46',
      tableHeader: '#065f46',
      tableHeaderColor: '#ffffff',
      tableStripe: '#ecfdf5',
      tableBorder: '#6ee7b7',
      success: '#047857',
      warning: '#d97706',
      danger: '#b91c1c',
      info: '#0284c7'
    },
    fontFamily: "'Tajawal', 'Cairo', sans-serif",
    headingFont: "'Cairo', 'Tajawal', sans-serif",
    borderRadius: '8px',
    shadow: '0 3px 10px -2px rgba(6, 95, 70, 0.1)',
    frameType: 'emerald_ornate',
    palette: ['#065f46', '#059669', '#10b981', '#f0fdf4', '#ffffff'],
    headerStyle: 'emerald_crest',
    footerStyle: 'emerald_leaves'
  },
  {
    id: 'power_red',
    legacyId: 'style5',
    name: 'Power Red',
    nameAr: 'الأحمر القوي (مكثف)',
    tagline: 'مراجعة مكثفة وتركيز عالٍ',
    descriptionAr: 'أحمر قرمزي بارز + عنابي + رمادي داكن + أبيض، ترويسات وشارات جريئة مخصصة للمراجعات المكثفة والاستدراك.',
    isPro: true,
    tokens: {
      primary: '#991b1b',
      secondary: '#b91c1c',
      accent: '#ef4444',
      background: '#ffffff',
      surface: '#fef2f2',
      surfaceAccent: '#f8fafc',
      text: '#0f172a',
      mutedText: '#475569',
      border: '#fecaca',
      heading: '#7f1d1d',
      tableHeader: '#991b1b',
      tableHeaderColor: '#ffffff',
      tableStripe: '#fff1f2',
      tableBorder: '#fca5a5',
      success: '#15803d',
      warning: '#c2410c',
      danger: '#991b1b',
      info: '#1e40af'
    },
    fontFamily: "'Cairo', 'Changa', sans-serif",
    headingFont: "'Changa', 'Cairo', sans-serif",
    borderRadius: '4px',
    shadow: '0 4px 14px -3px rgba(153, 27, 27, 0.15)',
    frameType: 'power_banner',
    palette: ['#991b1b', '#b91c1c', '#ef4444', '#fef2f2', '#ffffff'],
    headerStyle: 'power_bar',
    footerStyle: 'power_footer'
  },
  {
    id: 'purple_ai',
    legacyId: 'style2',
    name: 'Purple AI',
    nameAr: 'ذكاء بنفسجي (AI)',
    tagline: 'منصة ذكاء اصطناعي حديثة',
    descriptionAr: 'بنفسجي ملكي عميق + ماجنتا رقمي + لمسات فيروزية ذكية، يحول المذكرة إلى مستند تقني مستقبلي تفاعلي.',
    isPro: true,
    tokens: {
      primary: '#5b21b6',
      secondary: '#7c3aed',
      accent: '#c026d3',
      background: '#ffffff',
      surface: '#faf5ff',
      surfaceAccent: '#fdf4ff',
      text: '#1e1b4b',
      mutedText: '#4b5563',
      border: '#e9d5ff',
      heading: '#4c1d95',
      tableHeader: '#5b21b6',
      tableHeaderColor: '#ffffff',
      tableStripe: '#f5f3ff',
      tableBorder: '#d8b4fe',
      success: '#059669',
      warning: '#d97706',
      danger: '#dc2626',
      info: '#7c3aed'
    },
    fontFamily: "'Tajawal', 'Space Grotesk', 'Cairo', sans-serif",
    headingFont: "'Changa', 'Cairo', sans-serif",
    borderRadius: '10px',
    shadow: '0 4px 16px -2px rgba(91, 33, 182, 0.12)',
    frameType: 'purple_digital',
    palette: ['#5b21b6', '#7c3aed', '#c026d3', '#faf5ff', '#ffffff'],
    headerStyle: 'ai_digital',
    footerStyle: 'ai_neural'
  },
  {
    id: 'orange_active',
    legacyId: 'style10',
    name: 'Orange Active',
    nameAr: 'النشط التفاعلي',
    tagline: 'تعلم نشط وطاقة تعليمية',
    descriptionAr: 'برتقالي شمسي دافئ + كحلي داكن + أبيض، مليء بالحيوية مخصص للأنشطة الصفية والاستكشاف التفاعلي.',
    isPro: true,
    tokens: {
      primary: '#c2410c',
      secondary: '#1e3a8a',
      accent: '#f97316',
      background: '#ffffff',
      surface: '#fff7ed',
      surfaceAccent: '#f8fafc',
      text: '#0f172a',
      mutedText: '#475569',
      border: '#fed7aa',
      heading: '#9a3412',
      tableHeader: '#c2410c',
      tableHeaderColor: '#ffffff',
      tableStripe: '#fffaf5',
      tableBorder: '#fdba74',
      success: '#15803d',
      warning: '#ea580c',
      danger: '#dc2626',
      info: '#0284c7'
    },
    fontFamily: "'Cairo', 'Almarai', sans-serif",
    headingFont: "'Cairo', 'Changa', sans-serif",
    borderRadius: '8px',
    shadow: '0 3px 12px -2px rgba(194, 65, 12, 0.12)',
    frameType: 'orange_dynamic',
    palette: ['#c2410c', '#f97316', '#1e3a8a', '#fff7ed', '#ffffff'],
    headerStyle: 'active_sporty',
    footerStyle: 'active_dots'
  },
  {
    id: 'math_pro',
    legacyId: 'style13',
    name: 'Mathematics Pro',
    nameAr: 'الرياضيات والعلوم PRO',
    tagline: 'شبكات هندسية ومعادلات دقيقة',
    descriptionAr: 'أزرق هندسي + سيان تخطيطي + كحلي تقني مع خلفيات شبكة خفيفة ومربعات مبرهنات رياضية فائقة النقاء.',
    isPro: true,
    tokens: {
      primary: '#1e3a8a',
      secondary: '#0284c7',
      accent: '#0e7490',
      background: '#ffffff',
      surface: '#f0f9ff',
      surfaceAccent: '#f8fafc',
      text: '#0b1329',
      mutedText: '#334155',
      border: '#bae6fd',
      heading: '#172554',
      tableHeader: '#1e3a8a',
      tableHeaderColor: '#ffffff',
      tableStripe: '#f8fafc',
      tableBorder: '#7dd3fc',
      success: '#059669',
      warning: '#b45309',
      danger: '#b91c1c',
      info: '#1d4ed8'
    },
    fontFamily: "'Space Grotesk', 'Cairo', 'Amiri', sans-serif",
    headingFont: "'Space Grotesk', 'Cairo', sans-serif",
    borderRadius: '3px',
    shadow: '0 2px 8px -1px rgba(30, 58, 138, 0.1)',
    frameType: 'math_grid',
    palette: ['#1e3a8a', '#0284c7', '#0e7490', '#f0f9ff', '#ffffff'],
    headerStyle: 'math_formula_header',
    footerStyle: 'math_grid_footer'
  },
  {
    id: 'teaching_cards',
    legacyId: 'style9',
    name: 'Teaching Cards',
    nameAr: 'البطاقات التعليمية المعيارية',
    tagline: 'نظام بطاقات مستقلة لكل عنصر',
    descriptionAr: 'كل عنصر بيداغوجي هو بطاقة متناسقة (هدف، كفاءة، وضعية، قاعدة، تمرين، تقويم) مع أيقونة مميزة وألوان مستقلة.',
    isPro: true,
    tokens: {
      primary: '#1d4ed8',
      secondary: '#4338ca',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f8fafc',
      surfaceAccent: '#f1f5f9',
      text: '#0f172a',
      mutedText: '#475569',
      border: '#cbd5e1',
      heading: '#1e3a8a',
      tableHeader: '#1d4ed8',
      tableHeaderColor: '#ffffff',
      tableStripe: '#f8fafc',
      tableBorder: '#cbd5e1',
      success: '#16a34a',
      warning: '#d97706',
      danger: '#dc2626',
      info: '#2563eb'
    },
    fontFamily: "'IBM Plex Sans Arabic', 'Cairo', sans-serif",
    headingFont: "'Cairo', 'IBM Plex Sans Arabic', sans-serif",
    borderRadius: '12px',
    shadow: '0 3px 12px -2px rgba(29, 78, 216, 0.09)',
    frameType: 'cards_modular',
    palette: ['#1d4ed8', '#4338ca', '#f59e0b', '#f8fafc', '#ffffff'],
    headerStyle: 'modular_card_header',
    footerStyle: 'modular_card_footer'
  },
  {
    id: 'dz_education',
    legacyId: 'style14',
    name: 'DZ Education',
    nameAr: 'التربية الجزائرية (الجيل الثاني)',
    tagline: 'أصالة تربوية وهوية جزائرية',
    descriptionAr: 'أخضر وطني راقٍ + أبيض ناصع + لمسات ياقوتية خفيفة مع زخرفة هندسية مغاربية ناعمة توافق المنهاج الوطني.',
    isPro: false,
    tokens: {
      primary: '#047857',
      secondary: '#15803d',
      accent: '#b91c1c',
      background: '#ffffff',
      surface: '#f0fdf4',
      surfaceAccent: '#fef2f2',
      text: '#064e3b',
      mutedText: '#374151',
      border: '#bbf7d0',
      heading: '#064e3b',
      tableHeader: '#047857',
      tableHeaderColor: '#ffffff',
      tableStripe: '#f7fee7',
      tableBorder: '#86efac',
      success: '#15803d',
      warning: '#b45309',
      danger: '#b91c1c',
      info: '#047857'
    },
    fontFamily: "'Amiri', 'Tajawal', 'Cairo', serif",
    headingFont: "'Amiri', 'Cairo', serif",
    borderRadius: '6px',
    shadow: '0 2px 8px -1px rgba(4, 120, 87, 0.1)',
    frameType: 'dz_geometric',
    palette: ['#047857', '#15803d', '#b91c1c', '#f0fdf4', '#ffffff'],
    headerStyle: 'dz_republic_header',
    footerStyle: 'dz_traditional_footer'
  },
  {
    id: 'premium_editorial',
    legacyId: 'style15',
    name: 'Premium Editorial',
    nameAr: 'المجلة الأكاديمية (Editorial)',
    tagline: 'إصدار فاخر من دور النشر',
    descriptionAr: 'طباعة تحريرية رفيعة - أسود فحمي فاخر + خطوط ذهبية نحاسية دقيقة + مساحات بيضاء متوازنة وعناوين ضخمة.',
    isPro: true,
    tokens: {
      primary: '#18181b',
      secondary: '#27272a',
      accent: '#b45309',
      background: '#ffffff',
      surface: '#fafafa',
      surfaceAccent: '#fffbeb',
      text: '#09090b',
      mutedText: '#52525b',
      border: '#e4e4e7',
      heading: '#18181b',
      tableHeader: '#18181b',
      tableHeaderColor: '#ffffff',
      tableStripe: '#f4f4f5',
      tableBorder: '#d4d4d8',
      success: '#15803d',
      warning: '#b45309',
      danger: '#991b1b',
      info: '#27272a'
    },
    fontFamily: "'El Messiri', 'Amiri', serif",
    headingFont: "'El Messiri', 'Cairo', serif",
    borderRadius: '2px',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    frameType: 'editorial_rules',
    palette: ['#18181b', '#27272a', '#b45309', '#fafafa', '#ffffff'],
    headerStyle: 'editorial_cover',
    footerStyle: 'editorial_colophon'
  },
  {
    id: 'kids_smart',
    legacyId: 'style7',
    name: 'Kids Smart',
    nameAr: 'الابتدائي المرح والذكي',
    tagline: 'ألوان مشرقة ومحفزة للطفل',
    descriptionAr: 'مخصص للتعليم الابتدائي - أصفر دافئ + برتقالي + أزرق سماوي + أخضر تفاحي مع نجوم وشارات أنشطة محببة.',
    isPro: true,
    tokens: {
      primary: '#0284c7',
      secondary: '#f59e0b',
      accent: '#10b981',
      background: '#ffffff',
      surface: '#fefce8',
      surfaceAccent: '#f0fdf4',
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
    borderRadius: '16px',
    shadow: '0 4px 14px -3px rgba(2, 132, 199, 0.15)',
    frameType: 'kids_playful',
    palette: ['#0284c7', '#f59e0b', '#10b981', '#fefce8', '#ffffff'],
    headerStyle: 'kids_star_header',
    footerStyle: 'kids_mascot_footer'
  }
];

export function getStyleById(id: string): StyleDefinition {
  const found = STYLES_REGISTRY.find(s => s.id === id || s.legacyId === id);
  return found || STYLES_REGISTRY[0];
}

/**
 * Intelligent Content Detector & Document Styler
 * Detects pedagogical constructs (Learning situation, Objectives, Competencies, Rules, Examples, Exercises, etc.)
 * and transforms them into high-craft, print-ready components fitting the active Design System style.
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
  const t = style.tokens;

  // We parse into DOM to execute robust structural & semantic transformations
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  // 1. Inject root CSS variables container wrapper if not present
  const body = doc.body;

  // 2. Identify and transform Table Headers (e.g., Pedagogical grids & Timetables)
  const tables = Array.from(body.querySelectorAll('table'));
  tables.forEach((table, tableIdx) => {
    // Determine if it's the top document header table
    const isHeaderTable = tableIdx === 0 && (
      table.innerHTML.includes('الجمهورية الجزائرية') || 
      table.innerHTML.includes('المؤسسة') || 
      table.innerHTML.includes('الأستاذ')
    );

    if (isHeaderTable) {
      applyStyleToHeaderTable(table, style, meta);
      return;
    }

    // Normal content or pedagogical stage tables
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.margin = '10px 0 14px 0';
    table.style.fontFamily = style.fontFamily;
    table.style.fontSize = '12px';
    table.style.pageBreakInside = 'auto';

    // Th styling
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

    // Tr & Td styling
    table.querySelectorAll('tbody tr, tr').forEach((tr, rowIdx) => {
      const elTr = tr as HTMLElement;
      elTr.style.pageBreakInside = 'avoid';
      elTr.style.breakInside = 'avoid';

      // Check if this tr has th or td
      const tds = Array.from(elTr.querySelectorAll('td'));
      if (tds.length > 0 && rowIdx > 0) {
        if (rowIdx % 2 === 0) {
          elTr.style.backgroundColor = t.tableStripe;
        } else {
          elTr.style.backgroundColor = '#ffffff';
        }
      }

      tds.forEach(td => {
        const elTd = td as HTMLElement;
        elTd.style.padding = '8px 10px';
        elTd.style.border = `1px solid ${t.tableBorder}`;
        elTd.style.verticalAlign = 'top';
        elTd.style.lineHeight = '1.6';
      });
    });
  });

  // 3. Smart Pedagogical Detection & Card Transformation
  // Scan all block elements (divs, sections, blockquotes, article, p)
  const candidateBlocks = Array.from(body.querySelectorAll('div, section, blockquote, p'));
  
  candidateBlocks.forEach(block => {
    const text = block.textContent || '';
    const trimmed = text.trim();
    if (trimmed.length === 0) return;

    // Check if block was already processed
    if (block.getAttribute('data-styled') === 'true') return;

    // A: الوضعية التعلمية / وضعية مشكلة / نشاط استكشافي
    if (
      (trimmed.startsWith('وضعية تعلمية') || 
       trimmed.startsWith('الوضعية التعلمية') || 
       trimmed.startsWith('وضعية مشكلة') || 
       trimmed.startsWith('الوضعية الانطلاقية') || 
       trimmed.startsWith('نشاط استكشافي') ||
       trimmed.startsWith('بناء التعلمات')) &&
      trimmed.length > 15
    ) {
      renderLearningSituationCard(block as HTMLElement, style);
      block.setAttribute('data-styled', 'true');
      return;
    }

    // B: الهدف التعلمي / الكفاءة المستهدفة
    if (
      (trimmed.startsWith('الهدف التعلمي') || trimmed.startsWith('أهداف الدرس') || trimmed.startsWith('الهدف :') || trimmed.startsWith('الهدف:')) &&
      trimmed.length > 10
    ) {
      renderObjectiveCard(block as HTMLElement, style);
      block.setAttribute('data-styled', 'true');
      return;
    }

    if (
      (trimmed.startsWith('الكفاءة المستهدفة') || trimmed.startsWith('الكفاءة الختامية') || trimmed.startsWith('الكفاءة:')) &&
      trimmed.length > 10
    ) {
      renderCompetencyCard(block as HTMLElement, style);
      block.setAttribute('data-styled', 'true');
      return;
    }

    // C: القاعدة / المبرهنة / التعريف / الحوصلة
    if (
      (trimmed.startsWith('قاعدة') || 
       trimmed.startsWith('القاعدة') || 
       trimmed.startsWith('مبرهنة') || 
       trimmed.startsWith('المبرهنة') || 
       trimmed.startsWith('خاصية') || 
       trimmed.startsWith('الخاصية') || 
       trimmed.startsWith('تعريف') || 
       trimmed.startsWith('التعريف')) &&
      trimmed.length > 10
    ) {
      renderRuleCard(block as HTMLElement, style);
      block.setAttribute('data-styled', 'true');
      return;
    }

    // D: الحوصلة / إرساء الموارد / خلاصة
    if (
      (trimmed.startsWith('حوصلة') || 
       trimmed.startsWith('الحوصلة') || 
       trimmed.startsWith('إرساء الموارد') || 
       trimmed.startsWith('خلاصة') || 
       trimmed.startsWith('الخلاصة')) &&
      trimmed.length > 10
    ) {
      renderSummaryCard(block as HTMLElement, style);
      block.setAttribute('data-styled', 'true');
      return;
    }

    // E: مثال محلول / أمثلة
    if (
      (trimmed.startsWith('مثال محلول') || 
       trimmed.startsWith('مثال تطبيقي') || 
       trimmed.startsWith('مثال 1') || 
       trimmed.startsWith('مثال 2') || 
       trimmed.startsWith('مثال:') || 
       trimmed.startsWith('أمثلة:')) &&
      trimmed.length > 8
    ) {
      renderExampleCard(block as HTMLElement, style);
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
      trimmed.length > 8
    ) {
      renderWarningCard(block as HTMLElement, style);
      block.setAttribute('data-styled', 'true');
      return;
    }

    // G: تمرين / مسألة
    if (
      (trimmed.startsWith('تمرين') || 
       trimmed.startsWith('التمرين الأول') || 
       trimmed.startsWith('التمرين الثاني') || 
       trimmed.startsWith('التمرين الثالث') || 
       trimmed.startsWith('التمرين 1') || 
       trimmed.startsWith('التمرين 2') || 
       trimmed.startsWith('تطبيق مباشر') || 
       trimmed.startsWith('إعادة استثمار')) &&
      trimmed.length > 12
    ) {
      renderExerciseCard(block as HTMLElement, style);
      block.setAttribute('data-styled', 'true');
      return;
    }
  });

  // 4. Transform Headings (h1, h2, h3, h4) into eye-catching banners matching the active style
  const headings = Array.from(body.querySelectorAll('h1, h2, h3, h4'));
  headings.forEach(h => {
    const el = h as HTMLElement;
    const tag = el.tagName.toLowerCase();
    
    el.style.fontFamily = style.headingFont;
    el.style.pageBreakAfter = 'avoid';
    el.style.breakAfter = 'avoid';
    el.style.lineHeight = '1.3';

    if (tag === 'h1') {
      el.style.fontSize = '20px';
      el.style.fontWeight = '800';
      el.style.color = t.heading;
      el.style.margin = '14px 0 10px 0';
      el.style.padding = '8px 14px';
      el.style.background = `linear-gradient(90deg, ${t.surface} 0%, transparent 100%)`;
      el.style.borderRight = `5px solid ${t.primary}`;
      el.style.borderRadius = style.borderRadius;
    } else if (tag === 'h2') {
      el.style.fontSize = '16px';
      el.style.fontWeight = '700';
      el.style.color = t.primary;
      el.style.margin = '12px 0 8px 0';
      el.style.padding = '6px 10px';
      el.style.background = t.surface;
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
  });

  return body.innerHTML;
}

/**
 * Restructures top table header into the specific style banner
 */
function applyStyleToHeaderTable(table: HTMLTableElement, style: StyleDefinition, meta?: any) {
  const t = style.tokens;
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.marginBottom = '14px';
  table.style.pageBreakInside = 'avoid';
  table.style.breakInside = 'avoid';
  table.style.fontFamily = style.fontFamily;
  table.style.borderRadius = style.borderRadius;
  table.style.overflow = 'hidden';

  // Apply distinct visual identities to the top banner
  if (style.headerStyle === 'royal_banner') {
    table.style.background = `linear-gradient(135deg, ${t.primary} 0%, #1e3a8a 60%, #0f172a 100%)`;
    table.style.color = '#ffffff';
    table.style.border = `2px solid ${t.accent}`;
    table.style.boxShadow = '0 4px 12px rgba(15, 39, 74, 0.15)';
  } else if (style.headerStyle === 'tech_hud') {
    table.style.background = `linear-gradient(135deg, #0284c7 0%, #3b82f6 50%, #6366f1 100%)`;
    table.style.color = '#ffffff';
    table.style.border = `2px solid ${t.accent}`;
    table.style.borderRadius = '8px';
  } else if (style.headerStyle === 'power_bar') {
    table.style.background = `linear-gradient(135deg, #991b1b 0%, #b91c1c 60%, #7f1d1d 100%)`;
    table.style.color = '#ffffff';
    table.style.borderBottom = `4px solid #ef4444`;
  } else if (style.headerStyle === 'emerald_crest') {
    table.style.background = `linear-gradient(135deg, #064e3b 0%, #047857 60%, #065f46 100%)`;
    table.style.color = '#ffffff';
    table.style.border = `2px solid ${t.accent}`;
  } else if (style.headerStyle === 'dz_republic_header') {
    table.style.background = `linear-gradient(135deg, #047857 0%, #065f46 60%, #064e3b 100%)`;
    table.style.color = '#ffffff';
    table.style.border = `2px solid #10b981`;
    table.style.borderBottom = `3px solid #b91c1c`;
  } else if (style.headerStyle === 'kids_star_header') {
    table.style.background = `linear-gradient(135deg, #0284c7 0%, #38bdf8 50%, #f59e0b 100%)`;
    table.style.color = '#ffffff';
    table.style.borderRadius = '16px';
    table.style.border = `3px solid #facc15`;
  } else if (style.headerStyle === 'editorial_cover') {
    table.style.background = `#ffffff`;
    table.style.color = '#18181b';
    table.style.borderTop = `4px solid #18181b`;
    table.style.borderBottom = `2px solid #b45309`;
  } else {
    table.style.backgroundColor = t.primary;
    table.style.color = '#ffffff';
    table.style.border = `1px solid ${t.border}`;
  }

  // Ensure all cells have white text (or black text for editorial)
  const isLightHeader = style.headerStyle === 'editorial_cover';
  const textColor = isLightHeader ? '#18181b' : '#ffffff';

  table.querySelectorAll('td, th, div, span, b, strong').forEach(el => {
    (el as HTMLElement).style.color = textColor;
  });
}

/**
 * 🎯 COMPONENT: Learning Situation Card (الوضعية التعلمية)
 */
function renderLearningSituationCard(el: HTMLElement, style: StyleDefinition) {
  const t = style.tokens;
  const originalHtml = el.innerHTML;

  el.className = `${el.className} avoid-break situation-card`.trim();
  el.style.backgroundColor = t.surface;
  el.style.border = `2px solid ${t.primary}`;
  el.style.borderRight = `6px solid ${t.primary}`;
  el.style.borderRadius = style.borderRadius;
  el.style.padding = '12px 14px';
  el.style.margin = '12px 0 14px 0';
  el.style.boxShadow = style.shadow;
  el.style.pageBreakInside = 'avoid';
  el.style.breakInside = 'avoid';
  el.style.fontFamily = style.fontFamily;
  el.style.position = 'relative';

  // Format the inner content cleanly with an executive banner
  el.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1.5px dashed ${t.border};">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background-color: ${t.primary}; color: #ffffff; font-size: 14px;">
          🧭
        </span>
        <span style="font-family: ${style.headingFont}; font-weight: 800; font-size: 15px; color: ${t.primary};">
          الوضعية التعلمية (نشاط بناء التعلمات والاستكشاف)
        </span>
      </div>
      <span style="background-color: ${t.primary}; color: #ffffff; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 12px;">
        مرحلة الاكتشاف والتقصي
      </span>
    </div>
    <div style="color: ${t.text}; font-size: 12.5px; line-height: 1.7;">
      ${originalHtml}
    </div>
  `;
}

/**
 * 🎯 COMPONENT: Objective Card (الهدف التعلمي)
 */
function renderObjectiveCard(el: HTMLElement, style: StyleDefinition) {
  const t = style.tokens;
  const originalHtml = el.innerHTML;

  el.className = `${el.className} avoid-break objective-card`.trim();
  el.style.backgroundColor = t.surfaceAccent;
  el.style.border = `1.5px solid ${t.accent}`;
  el.style.borderRight = `5px solid ${t.accent}`;
  el.style.borderRadius = style.borderRadius;
  el.style.padding = '8px 12px';
  el.style.margin = '8px 0 10px 0';
  el.style.pageBreakInside = 'avoid';
  el.style.breakInside = 'avoid';

  el.innerHTML = `
    <div style="display: flex; align-items: flex-start; gap: 8px;">
      <span style="font-size: 16px; line-height: 1;">🎯</span>
      <div style="flex: 1; font-size: 12px; color: ${t.text}; line-height: 1.6;">
        ${originalHtml}
      </div>
    </div>
  `;
}

/**
 * 🧠 COMPONENT: Competency Card (الكفاءة المستهدفة)
 */
function renderCompetencyCard(el: HTMLElement, style: StyleDefinition) {
  const t = style.tokens;
  const originalHtml = el.innerHTML;

  el.className = `${el.className} avoid-break competency-card`.trim();
  el.style.backgroundColor = t.surface;
  el.style.border = `1.5px solid ${t.secondary}`;
  el.style.borderRight = `5px solid ${t.secondary}`;
  el.style.borderRadius = style.borderRadius;
  el.style.padding = '8px 12px';
  el.style.margin = '8px 0 10px 0';
  el.style.pageBreakInside = 'avoid';
  el.style.breakInside = 'avoid';

  el.innerHTML = `
    <div style="display: flex; align-items: flex-start; gap: 8px;">
      <span style="font-size: 16px; line-height: 1;">🧠</span>
      <div style="flex: 1; font-size: 12px; color: ${t.text}; line-height: 1.6;">
        ${originalHtml}
      </div>
    </div>
  `;
}

/**
 * 📌 COMPONENT: Rule / Theorem Card (القاعدة / المبرهنة)
 */
function renderRuleCard(el: HTMLElement, style: StyleDefinition) {
  const t = style.tokens;
  const originalHtml = el.innerHTML;

  el.className = `${el.className} avoid-break rule-card`.trim();
  el.style.backgroundColor = style.id === 'royal_academy' ? '#fefce8' : t.surface;
  el.style.border = `2px solid ${t.accent}`;
  el.style.borderRight = `6px solid ${t.accent}`;
  el.style.borderRadius = style.borderRadius;
  el.style.padding = '10px 14px';
  el.style.margin = '10px 0 12px 0';
  el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
  el.style.pageBreakInside = 'avoid';
  el.style.breakInside = 'avoid';

  el.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
      <span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 4px; background-color: ${t.accent}; color: #ffffff; font-size: 12px;">
        📌
      </span>
      <span style="font-family: ${style.headingFont}; font-weight: 800; font-size: 13.5px; color: ${t.heading};">
        قاعدة ومفهوم أساسي
      </span>
    </div>
    <div style="color: ${t.text}; font-size: 12.5px; line-height: 1.7; font-weight: 500;">
      ${originalHtml}
    </div>
  `;
}

/**
 * 📝 COMPONENT: Summary / Synthesis Card (الحوصلة)
 */
function renderSummaryCard(el: HTMLElement, style: StyleDefinition) {
  const t = style.tokens;
  const originalHtml = el.innerHTML;

  el.className = `${el.className} avoid-break summary-card`.trim();
  el.style.backgroundColor = t.surface;
  el.style.border = `2px solid ${t.primary}`;
  el.style.borderRight = `6px solid ${t.primary}`;
  el.style.borderRadius = style.borderRadius;
  el.style.padding = '12px 14px';
  el.style.margin = '12px 0 14px 0';
  el.style.pageBreakInside = 'avoid';
  el.style.breakInside = 'avoid';

  el.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1.5px solid ${t.border};">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 16px;">📚</span>
        <span style="font-family: ${style.headingFont}; font-weight: 800; font-size: 14.5px; color: ${t.primary};">
          الحوصلة وإرساء التعلمات
        </span>
      </div>
      <span style="font-size: 10.5px; color: ${t.mutedText}; font-weight: bold;">خلاصة المورد المعرفي</span>
    </div>
    <div style="color: ${t.text}; font-size: 12.5px; line-height: 1.7;">
      ${originalHtml}
    </div>
  `;
}

/**
 * ✏️ COMPONENT: Example Card (مثال محلول)
 */
function renderExampleCard(el: HTMLElement, style: StyleDefinition) {
  const t = style.tokens;
  const originalHtml = el.innerHTML;

  el.className = `${el.className} avoid-break example-card`.trim();
  el.style.backgroundColor = '#f8fafc';
  el.style.border = `1.5px solid ${t.secondary}`;
  el.style.borderRight = `4px solid ${t.secondary}`;
  el.style.borderRadius = style.borderRadius;
  el.style.padding = '9px 12px';
  el.style.margin = '8px 0 10px 0';
  el.style.pageBreakInside = 'avoid';
  el.style.breakInside = 'avoid';

  el.innerHTML = `
    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 5px;">
      <span style="font-size: 14px;">✏️</span>
      <span style="font-family: ${style.headingFont}; font-weight: 700; font-size: 12.5px; color: ${t.secondary};">
        مثال توضيحي وتطبيق نموذجي
      </span>
    </div>
    <div style="color: ${t.text}; font-size: 12px; line-height: 1.65;">
      ${originalHtml}
    </div>
  `;
}

/**
 * ⚠️ COMPONENT: Warning / Common Errors Card
 */
function renderWarningCard(el: HTMLElement, style: StyleDefinition) {
  const t = style.tokens;
  const originalHtml = el.innerHTML;

  el.className = `${el.className} avoid-break warning-card`.trim();
  el.style.backgroundColor = '#fffbeb';
  el.style.border = `1.5px solid #fde047`;
  el.style.borderRight = `5px solid #eab308`;
  el.style.borderRadius = style.borderRadius;
  el.style.padding = '8px 12px';
  el.style.margin = '8px 0 10px 0';
  el.style.pageBreakInside = 'avoid';
  el.style.breakInside = 'avoid';

  el.innerHTML = `
    <div style="display: flex; align-items: flex-start; gap: 8px;">
      <span style="font-size: 15px; line-height: 1;">⚠️</span>
      <div style="flex: 1; font-size: 12px; color: #78350f; line-height: 1.6; font-weight: 500;">
        ${originalHtml}
      </div>
    </div>
  `;
}

/**
 * ⭐ COMPONENT: Exercise Card with distinctive numbered badge
 */
function renderExerciseCard(el: HTMLElement, style: StyleDefinition) {
  const t = style.tokens;
  const originalHtml = el.innerHTML;

  el.className = `${el.className} avoid-break exercise-card`.trim();
  el.style.backgroundColor = '#ffffff';
  el.style.border = `1.5px solid ${t.border}`;
  el.style.borderTop = `3px solid ${t.primary}`;
  el.style.borderRadius = style.borderRadius;
  el.style.padding = '10px 14px';
  el.style.margin = '10px 0 14px 0';
  el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)';
  el.style.pageBreakInside = 'avoid';
  el.style.breakInside = 'avoid';

  el.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid ${t.border};">
      <div style="display: flex; align-items: center; gap: 6px;">
        <span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background-color: ${t.primary}; color: #ffffff; font-size: 11px; font-weight: bold;">
          ★
        </span>
        <span style="font-family: ${style.headingFont}; font-weight: 700; font-size: 13px; color: ${t.primary};">
          تطبيق وإعادة استثمار
        </span>
      </div>
      <span style="font-size: 11px; color: ${t.mutedText}; font-weight: bold;">عمل فردي / ثنائي</span>
    </div>
    <div style="color: ${t.text}; font-size: 12px; line-height: 1.65;">
      ${originalHtml}
    </div>
  `;
}
