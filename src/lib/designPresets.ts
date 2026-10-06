import React from 'react';
import { 
  BookOpen, Sparkles, Palette, Award, Flower2, Moon, 
  Leaf, Crown, Shield, Hexagon, Zap, Star, Compass, 
  Smile, Printer, GraduationCap, Heart, Coffee, Layers 
} from 'lucide-react';

export interface DesignStylePreset {
  id: string;
  label: string;
  subtitle: string;
  category: 'pedagogical' | 'luxury' | 'creative' | 'classic' | 'visual';
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  accentColor: string;
  gradient: string;
  bubbleGlow: string;
  badge?: string;
  isPro?: boolean;
}

export const DESIGN_STYLE_PRESETS: DesignStylePreset[] = [
  {
    id: 'pedagogical_official',
    label: 'بيداغوجي رسمي (الجيل الثاني)',
    subtitle: 'نمط المذكرة الوزارية الرسمية بمحطات الدرس الأربعة',
    category: 'pedagogical',
    icon: Award,
    color: '#1d4ed8', // Royal Blue
    accentColor: '#f97316',
    gradient: 'from-blue-600 via-indigo-600 to-blue-800',
    bubbleGlow: 'rgba(29, 78, 216, 0.7)',
    badge: 'موصى به ⭐',
    isPro: false,
  },
  {
    id: 'floral_elegance',
    label: 'زهري ورود راقي',
    subtitle: 'إطار ورود ناعمة وطبيعية مع لمسات باستيل أنيقة',
    category: 'luxury',
    icon: Flower2,
    color: '#0f766e', // Teal / Botanical
    accentColor: '#f43f5e',
    gradient: 'from-teal-600 via-emerald-600 to-rose-500',
    bubbleGlow: 'rgba(15, 118, 110, 0.7)',
    badge: 'جديد مبهر 🌸',
    isPro: true,
  },
  {
    id: 'royal_gold',
    label: 'ملكي ذهبي فاخر',
    subtitle: 'تدرجات الذهب الخالص مع تيجان وزخارف فخمة',
    category: 'luxury',
    icon: Crown,
    color: '#b45309', // Amber / Gold
    accentColor: '#fbbf24',
    gradient: 'from-amber-500 via-yellow-600 to-amber-700',
    bubbleGlow: 'rgba(217, 119, 6, 0.8)',
    badge: 'VIP فاخر 👑',
    isPro: true,
  },
  {
    id: 'islamic_arabesque',
    label: 'إسلامي أرابيسك أصيل',
    subtitle: 'زخارف هندسية أندلسية ونجوم ثمانية عريقة',
    category: 'classic',
    icon: Moon,
    color: '#047857', // Emerald
    accentColor: '#ca8a04',
    gradient: 'from-emerald-700 via-teal-800 to-emerald-900',
    bubbleGlow: 'rgba(4, 120, 87, 0.7)',
    badge: 'أصيل 🕌',
    isPro: true,
  },
  {
    id: 'cyber_neon',
    label: 'نيون تقني عصري',
    subtitle: 'تدرجات سيان وأرجواني متوهجة لأساتذة الإعلام الآلي والعلوم',
    category: 'creative',
    icon: Zap,
    color: '#0284c7', // Cyan
    accentColor: '#8b5cf6',
    gradient: 'from-cyan-500 via-sky-600 to-violet-600',
    bubbleGlow: 'rgba(2, 132, 199, 0.8)',
    badge: 'عصري ⚡',
    isPro: true,
  },
  {
    id: 'cosmic_starlight',
    label: 'كوزميك فضائي أرجواني',
    subtitle: 'سماء ليلية نجوم براقة ولمسات سحرية ملهمة',
    category: 'creative',
    icon: Sparkles,
    color: '#6366f1', // Indigo / Purple
    accentColor: '#ec4899',
    gradient: 'from-indigo-600 via-purple-600 to-pink-600',
    bubbleGlow: 'rgba(99, 102, 241, 0.8)',
    badge: 'إبداعي ✨',
    isPro: true,
  },
  {
    id: 'style1',
    label: 'كلاسيكي أزرق تعليمي',
    subtitle: 'التصميم المعتمد الأكثر وضوحاً وسهولة في الطباعة',
    category: 'classic',
    icon: BookOpen,
    color: '#1e40af', // Blue
    accentColor: '#3b82f6',
    gradient: 'from-blue-700 via-blue-600 to-indigo-700',
    bubbleGlow: 'rgba(30, 64, 175, 0.7)',
    isPro: false,
  },
  {
    id: 'nature_fresh',
    label: 'طبيعي أخضر منعش',
    subtitle: 'أوراق الشجر ودرجات الأخضر الطبيعي للعلوم والأحياء',
    category: 'creative',
    icon: Leaf,
    color: '#15803d', // Green
    accentColor: '#84cc16',
    gradient: 'from-green-600 via-emerald-600 to-lime-600',
    bubbleGlow: 'rgba(21, 128, 61, 0.7)',
    isPro: true,
  },
  {
    id: 'geometric_math',
    label: 'هندسي دقيق (رياضيات)',
    subtitle: 'أشكال سداسية وشبكات هندسية دقيقة للمواد العلمية',
    category: 'pedagogical',
    icon: Hexagon,
    color: '#0891b2', // Cyan
    accentColor: '#0e7490',
    gradient: 'from-cyan-600 via-teal-600 to-blue-700',
    bubbleGlow: 'rgba(8, 145, 178, 0.7)',
    isPro: true,
  },
  {
    id: 'playful_kids',
    label: 'كرتوني طفولي مرح',
    subtitle: 'ألوان زاهية وأشكال محببة للتعليم الابتدائي والتحضيري',
    category: 'creative',
    icon: Smile,
    color: '#db2777', // Pink
    accentColor: '#f59e0b',
    gradient: 'from-pink-500 via-rose-500 to-amber-500',
    bubbleGlow: 'rgba(219, 39, 119, 0.7)',
    badge: 'للصغار 🎈',
    isPro: true,
  },
  {
    id: 'academic_executive',
    label: 'أكاديمي جامعي رصين',
    subtitle: 'طابع التخرج والشهادات الجامعية الرفيعة',
    category: 'classic',
    icon: GraduationCap,
    color: '#4338ca', // Deep Indigo
    accentColor: '#6366f1',
    gradient: 'from-indigo-800 via-blue-900 to-slate-900',
    bubbleGlow: 'rgba(67, 56, 202, 0.7)',
    isPro: true,
  },
  {
    id: 'style5',
    label: 'أبيض وأسود اقتصادي',
    subtitle: 'تصميم رمادي عالي التباين موفر لحبر الطابعات والنسخ',
    category: 'classic',
    icon: Printer,
    color: '#334155', // Slate
    accentColor: '#64748b',
    gradient: 'from-slate-700 via-slate-800 to-slate-900',
    bubbleGlow: 'rgba(51, 65, 85, 0.7)',
    isPro: false,
  }
];

export const VISUAL_STYLE_PRESETS: DesignStylePreset[] = [
  {
    id: 'visual_nature',
    label: 'تفاعلي - طبيعة وحياة',
    subtitle: 'رسوم كرتونية وشخصيات مبهجة للأطفال مع نباتات وألوان منعشة',
    category: 'visual',
    icon: Leaf,
    color: '#15803d',
    accentColor: '#84cc16',
    gradient: 'from-green-500 via-emerald-600 to-lime-500',
    bubbleGlow: 'rgba(21, 128, 61, 0.7)',
    badge: 'تفاعلي 🍃',
    isPro: true,
  },
  {
    id: 'visual_elegant',
    label: 'تفاعلي - حوار وأناقة',
    subtitle: 'شخصيات طلاب ومعلمين وفقاعات حوار راقية بألوان بنفسجية',
    category: 'visual',
    icon: Palette,
    color: '#9333ea',
    accentColor: '#ec4899',
    gradient: 'from-purple-600 via-fuchsia-600 to-pink-500',
    bubbleGlow: 'rgba(147, 51, 234, 0.7)',
    badge: 'تفاعلي 🎨',
    isPro: true,
  },
  {
    id: 'visual_geometric',
    label: 'تفاعلي - استكشاف وهندسة',
    subtitle: 'مجسمات تفاعلية ثلاثية الأبعاد وألغاز برتقالية مشوقة',
    category: 'visual',
    icon: Hexagon,
    color: '#ea580c',
    accentColor: '#f59e0b',
    gradient: 'from-orange-500 via-amber-600 to-red-500',
    bubbleGlow: 'rgba(234, 88, 12, 0.7)',
    badge: 'تفاعلي 📐',
    isPro: true,
  }
];

export interface PageFramePreset {
  id: string;
  label: string;
  subtitle: string;
  previewClass: string;
  badge?: string;
  isPro?: boolean;
}

export const PAGE_FRAME_PRESETS: PageFramePreset[] = [
  {
    id: 'none',
    label: 'بدون إطار',
    subtitle: 'صفحة نظيفة بكامل المساحة',
    previewClass: 'border-0',
    isPro: false,
  },
  {
    id: 'pedagogical',
    label: 'إطار بيداغوجي رسمي (صورة 1)',
    subtitle: 'إطار رسمي مزدوج مع ترويسة وزارية وأركان هندسية',
    previewClass: 'border-2 border-blue-600',
    badge: 'رسمي 📜',
    isPro: false,
  },
  {
    id: 'floral',
    label: 'إطار زهري ورود فاخر (صورة 2)',
    subtitle: 'باقات زهور ناعمة وفروع نباتية بالأركان الأربعة',
    previewClass: 'border-2 border-teal-500',
    badge: 'مبهر 🌸',
    isPro: true,
  },
  {
    id: 'royal_gold',
    label: 'إطار ذهبي ملكي متعدد الطبقات',
    subtitle: 'خطوط ذهبية متوازية مع زخارف تيجان بالأركان',
    previewClass: 'border-2 border-amber-500',
    badge: 'ملكي 👑',
    isPro: true,
  },
  {
    id: 'islamic',
    label: 'إطار أرابيسك إسلامي أصيل',
    subtitle: 'نجوم ثمانية أندلسية وزخارف نباتية متقنة',
    previewClass: 'border-2 border-emerald-600',
    badge: 'تراثي 🕌',
    isPro: true,
  },
  {
    id: 'neon_glow',
    label: 'إطار نيون متدرج مشع',
    subtitle: 'حواف مضيئة بتدرج السيان والبنفسجي العصري',
    previewClass: 'border-2 border-cyan-400',
    badge: 'نيون ⚡',
    isPro: true,
  },
  {
    id: 'double',
    label: 'إطار مزدوج كلاسيكي',
    subtitle: 'خط مزدوج أنيق ومرتب للطباعة',
    previewClass: 'border-4 border-double border-slate-700',
    isPro: false,
  },
  {
    id: 'ornate',
    label: 'إطار مزخرف مميز',
    subtitle: 'خط منقط داخلي ومستمر خارجي',
    previewClass: 'border-2 border-dashed border-indigo-600',
    isPro: true,
  },
  {
    id: 'certificate',
    label: 'إطار شهادة تشريفية',
    subtitle: 'إطار شرفي للأوراق الامتحانية والشهادات التقديرية',
    previewClass: 'border-4 border-indigo-800',
    badge: 'شرفي 🎓',
    isPro: true,
  },
  {
    id: '3d',
    label: 'إطار 3D مقعر ذو عمق',
    subtitle: 'حواف ثلاثية الأبعاد بظلال تضفي عمقاً بصرياً',
    previewClass: 'border-t-2 border-l-2 border-b-4 border-r-4 border-slate-800',
    isPro: true,
  }
];
