import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, Sparkles, Grid, X, Check } from 'lucide-react';
import { soundManager } from '../audio';

interface SymbolItem {
  char: string;
  name: string;
}

interface SymbolCategory {
  id: string;
  name: string;
  icon: string;
  symbols: SymbolItem[];
}

const SYMBOL_CATEGORIES: SymbolCategory[] = [
  {
    id: 'school',
    name: 'تقييم ومُعلّم',
    icon: '⭐',
    symbols: [
      { char: '⭐', name: 'نجمة ذهبية' },
      { char: '🌟', name: 'نجمة متلألئة' },
      { char: '💫', name: 'تميز' },
      { char: '🏆', name: 'كأس التفوق' },
      { char: '🥇', name: 'المركز الأول' },
      { char: '🥈', name: 'المركز الثاني' },
      { char: '🥉', name: 'المركز الثالث' },
      { char: '🎖️', name: 'وسام تقدير' },
      { char: '🎯', name: 'هدف دقيق' },
      { char: '💯', name: 'علامة كاملة' },
      { char: '✅', name: 'صح' },
      { char: '❌', name: 'خطأ' },
      { char: '⭕', name: 'إجابة دائرية' },
      { char: '❓', name: 'سؤال' },
      { char: '❗', name: 'تنبيه مهم' },
      { char: '🎓', name: 'نجاح وتخرج' },
      { char: '🏫', name: 'مدرسة' },
      { char: '📚', name: 'كتب دراسية' },
      { char: '📝', name: 'ورقة اختبار' },
      { char: '✏️', name: 'قلم كتابة' },
      { char: '🖊️', name: 'قلم حبر' },
      { char: '📌', name: 'دبوس أحمر' },
      { char: '📍', name: 'تحديد موقع' },
      { char: '📎', name: 'مشبك أوراق' },
      { char: '✂️', name: 'قص قصاصة' },
      { char: '💡', name: 'فكرة ممتازة' },
      { char: '🔔', name: 'جرس حصة' },
      { char: '✍️', name: 'توقيع وتصحيح' },
      { char: '👏', name: 'تشجيع أحسنت' },
      { char: '👍', name: 'جيد جداً' }
    ]
  },
  {
    id: 'math',
    name: 'رياضيات وهندسة',
    icon: '📐',
    symbols: [
      { char: '📐', name: 'كوس قائم' },
      { char: '📏', name: 'مسطرة مدرجة' },
      { char: '➕', name: 'جمع' },
      { char: '➖', name: 'طرح' },
      { char: '✖️', name: 'ضرب' },
      { char: '➗', name: 'قسمة' },
      { char: '🟰', name: 'يساوي' },
      { char: '♾️', name: 'لانهاية' },
      { char: '🧮', name: 'معداد حاسب' },
      { char: '📊', name: 'مخطط أعمدة' },
      { char: '📈', name: 'منحنى متزايد' },
      { char: '📉', name: 'منحنى متناقص' },
      { char: '🔺', name: 'مثلث أحمر' },
      { char: '🔻', name: 'مثلث مقلوب' },
      { char: '🔹', name: 'معين أزرق' },
      { char: '🔶', name: 'معين برتقالي' },
      { char: '🛑', name: 'ثماني منتظم' },
      { char: '⭕', name: 'دائرة' },
      { char: '🧭', name: 'منقلة وبوصلة' },
      { char: '🔢', name: 'أرقام' },
      { char: 'π', name: 'باي Pi' },
      { char: '√', name: 'جذر تربيعي' },
      { char: 'Σ', name: 'مجموع Sigma' },
      { char: '∫', name: 'تكامل' },
      { char: 'Δ', name: 'دلتا' },
      { char: 'α', name: 'ألفا' },
      { char: 'β', name: 'بيتا' },
      { char: 'θ', name: 'ثيتا' },
      { char: '≈', name: 'تقريباً' },
      { char: '≠', name: 'لا يساوي' },
      { char: '≤', name: 'أصغر أو يساوي' },
      { char: '≥', name: 'أكبر أو يساوي' }
    ]
  },
  {
    id: 'science',
    name: 'علوم وتكنولوجيا',
    icon: '🧪',
    symbols: [
      { char: '🧪', name: 'أنبوب تجارب' },
      { char: '🧫', name: 'طبق بكتيريا' },
      { char: '🔬', name: 'مجهر إلكتروني' },
      { char: '🧬', name: 'شريط DNA' },
      { char: '🔭', name: 'منظار فلكي' },
      { char: '💻', name: 'حاسوب محمول' },
      { char: '🖥️', name: 'شاشة حاسوب' },
      { char: '📱', name: 'هاتف ذكي' },
      { char: '⌨️', name: 'لوحة إدخال' },
      { char: '⚛️', name: 'نواة وذرة' },
      { char: '⚙️', name: 'ترس ميكانيكي' },
      { char: '🧲', name: 'مغناطيس' },
      { char: '⚡', name: 'تيار كهربائي' },
      { char: '🔋', name: 'بطارية طاقة' },
      { char: '📡', name: 'التقاط إشارة' },
      { char: '🚀', name: 'صاروخ فضاء' },
      { char: '🛰️', name: 'قمر صناعي' },
      { char: '🤖', name: 'روبوت آلي' },
      { char: '🔌', name: 'قابس كهرباء' },
      { char: '🌡️', name: 'ميزان حرارة' },
      { char: '☀️', name: 'طاقة شمسية' },
      { char: '🌙', name: 'طور القمر' },
      { char: '🪐', name: 'كوكب زحل' }
    ]
  },
  {
    id: 'emojis',
    name: 'إيموجيات وتعبيرات',
    icon: '😀',
    symbols: [
      { char: '😀', name: 'ابتسامة ترحيب' },
      { char: '😊', name: 'سعادتك' },
      { char: '😎', name: 'تفوق وذكاء' },
      { char: '🤔', name: 'تفكير وتحليل' },
      { char: '🤓', name: 'باحث عبقري' },
      { char: '🧐', name: 'تدقيق وملاحظة' },
      { char: '🥳', name: 'احتفال بالنجاح' },
      { char: '🤩', name: 'مبهر جداً' },
      { char: '👍', name: 'موافق ممتاز' },
      { char: '👎', name: 'بحاجة لمراجعة' },
      { char: '👏', name: 'مصفق للمجتهد' },
      { char: '🙌', name: 'دعاء وتحية' },
      { char: '🤝', name: 'تعاون ومشاركة' },
      { char: '🧠', name: 'عقل وتفكير' },
      { char: '👁️', name: 'عين الملاحظة' },
      { char: '👤', name: 'تلميذ' },
      { char: '💬', name: 'ملاحظة المعلم' },
      { char: '💭', name: 'فكرة السؤال' },
      { char: '🎉', name: 'مظاهر النجاح' },
      { char: '🎈', name: 'بالون مبهج' },
      { char: '🎨', name: 'ألوان وفنون' }
    ]
  },
  {
    id: 'nature',
    name: 'طبيعة وأحياء',
    icon: '🌱',
    symbols: [
      { char: '🌱', name: 'برعم نبتة' },
      { char: '🍃', name: 'ورقة خضراء' },
      { char: '🌿', name: 'عشب طبيعي' },
      { char: '🌾', name: 'سلسلة سنابل' },
      { char: '🌲', name: 'صنوبريات' },
      { char: '🌳', name: 'شجرة مورقة' },
      { char: '🌴', name: 'نخلة' },
      { char: '🌵', name: 'نبات الصبار' },
      { char: '🌷', name: 'زهرة التوليب' },
      { char: '🌸', name: 'زهر أزهار' },
      { char: '🌹', name: 'وردة حمراء' },
      { char: '🌻', name: 'عباد الشمس' },
      { char: '🍎', name: 'تفاح حمراء' },
      { char: '🍏', name: 'تفاح خضراء' },
      { char: '🍋', name: 'حمضيات' },
      { char: '🍇', name: 'ثمار العنب' },
      { char: '🌍', name: 'الكرة الأرضية' },
      { char: '🌧️', name: 'أمطار وتساقط' },
      { char: '❄️', name: 'بلورات ثلج' },
      { char: '🌊', name: 'أمواج البحر' },
      { char: '🌋', name: 'ظاهرة البركان' }
    ]
  },
  {
    id: 'arrows',
    name: 'أسهم وإشارات',
    icon: '➡️',
    symbols: [
      { char: '➡️', name: 'سهم نحو اليمين' },
      { char: '⬅️', name: 'سهم نحو اليسار' },
      { char: '⬆️', name: 'سهم نحو الأعلى' },
      { char: '⬇️', name: 'سهم نحو الأسفل' },
      { char: '↗️', name: 'سهم أعلى اليمين' },
      { char: '↘️', name: 'سهم أسفل اليمين' },
      { char: '🔄', name: 'دورة وتكرار' },
      { char: '↩️', name: 'سهم تراجع' },
      { char: '↪️', name: 'سهم إعادة' },
      { char: '🛑', name: 'إشارة توقف' },
      { char: '⚠️', name: 'خطر وتحذير' },
      { char: 'ℹ️', name: 'معلومات إضافية' },
      { char: '🚩', name: 'راية النقطة' },
      { char: '🎯', name: 'علامة الهدف' },
      { char: '🔴', name: 'نقطة حمراء' },
      { char: '🔵', name: 'نقطة زرقاء' },
      { char: '🟢', name: 'نقطة خضراء' },
      { char: '🟡', name: 'نقطة صفراء' },
      { char: '⬛', name: 'مربع أسود' },
      { char: '⬜', name: 'مربع أبيض' },
      { char: '🟧', name: 'مربع برتقالي' },
      { char: '🟪', name: 'مربع بنفسجي' }
    ]
  }
];

interface SymbolBarProps {
  onSelectSymbol: (symbol: string) => void;
  soundEnabled?: boolean;
}

export default function SymbolBar({ onSelectSymbol, soundEnabled = true }: SymbolBarProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>(['⭐', '🧪', '📐', '🧬', '⚡', '🌱', '💯', '✅']);
  const [lastAddedSymbol, setLastAddedSymbol] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSelect = (symbol: string) => {
    if (soundEnabled) soundManager.playTabClick();
    onSelectSymbol(symbol);
    setLastAddedSymbol(symbol);
    setTimeout(() => setLastAddedSymbol(null), 1200);

    // Update recently used
    setRecentlyUsed(prev => {
      const filtered = prev.filter(s => s !== symbol);
      return [symbol, ...filtered].slice(0, 10);
    });
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (soundEnabled) soundManager.playTabClick();
    if (scrollRef.current) {
      // Note: RTL scroll behavior handling
      const amount = direction === 'left' ? -240 : 240;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Filter symbols based on category or search
  const getVisibleSymbols = () => {
    if (activeCategory === 'recent') {
      return recentlyUsed.map(char => ({ char, name: 'رمز مستخدم مؤخراً' }));
    }

    let categories = SYMBOL_CATEGORIES;
    if (activeCategory !== 'all') {
      categories = SYMBOL_CATEGORIES.filter(c => c.id === activeCategory);
    }

    let allSyms: SymbolItem[] = [];
    categories.forEach(c => {
      allSyms.push(...c.symbols);
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      allSyms = allSyms.filter(s => s.name.toLowerCase().includes(q) || s.char.includes(q));
    }

    // Deduplicate
    const seen = new Set<string>();
    return allSyms.filter(s => {
      if (seen.has(s.char)) return false;
      seen.add(s.char);
      return true;
    });
  };

  const visibleSymbols = getVisibleSymbols();

  return (
    <div className="w-full flex flex-col gap-1.5 bg-slate-900/90 text-white p-2 rounded-xl border border-slate-700/80 shadow-md">
      {/* Category selector strip & search modal trigger */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar pb-1 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1 shrink-0 px-1">
            <Sparkles size={13} /> رموز وإيموجيات:
          </span>
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition shrink-0 ${
              activeCategory === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            الكل ({SYMBOL_CATEGORIES.reduce((acc, c) => acc + c.symbols.length, 0)})
          </button>
          <button
            onClick={() => setActiveCategory('recent')}
            className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition shrink-0 ${
              activeCategory === 'recent'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🕒 الأخيرة
          </button>
          {SYMBOL_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2 py-0.5 rounded-md font-medium text-[11px] flex items-center gap-1 transition shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Modal opener button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-2 py-0.5 bg-indigo-600/90 hover:bg-indigo-600 text-white text-[11px] rounded-md font-semibold flex items-center gap-1 transition shrink-0 border border-indigo-400/50 shadow-xs mr-auto"
          title="فتح المكتبة الشاملة للرموز والإيموجيات مع إمكانية البحث"
        >
          <Grid size={12} />
          <span>المكتبة الشاملة</span>
        </button>
      </div>

      {/* Main Horizontal Scrollable Symbol Ribbon */}
      <div className="relative flex items-center w-full group">
        {/* Scroll Right Button (in RTL, advances forward) */}
        <button
          onClick={() => handleScroll('right')}
          className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-indigo-600 text-slate-200 hover:text-white transition shrink-0 border border-slate-700 shadow-md z-10 active:scale-95"
          title="تمرير الرموز لليمين"
          aria-label="تمرير الرموز لليمين"
        >
          <ChevronRight size={16} />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-1.5 overflow-x-auto scroll-smooth py-1 px-2 no-scrollbar flex-1 select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {visibleSymbols.map((item, idx) => (
            <button
              key={`${item.char}-${idx}`}
              onClick={() => handleSelect(item.char)}
              title={`${item.name} - انقر للإدراج`}
              className="group/sym relative p-1 bg-slate-800/90 hover:bg-indigo-600 active:scale-90 hover:scale-110 transition-all rounded-lg border border-slate-700/80 hover:border-indigo-400 text-lg flex items-center justify-center min-w-[36px] h-[36px] shrink-0 cursor-pointer shadow-xs"
            >
              <span className="leading-none">{item.char}</span>
            </button>
          ))}
        </div>

        {/* Scroll Left Button */}
        <button
          onClick={() => handleScroll('left')}
          className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-indigo-600 text-slate-200 hover:text-white transition shrink-0 border border-slate-700 shadow-md z-10 active:scale-95"
          title="تمرير الرموز لليسار"
          aria-label="تمرير الرموز لليسار"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Feedback toast when symbol added */}
        {lastAddedSymbol && (
          <div className="absolute left-1/2 -top-8 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-bounce z-20 pointer-events-none">
            <Check size={14} /> تم إدراج {lastAddedSymbol} بنجاح
          </div>
        )}
      </div>

      {/* Full Library Modal Picker */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">مكتبة الرموز والإيموجيات التعليمية</h3>
                  <p className="text-xs text-slate-400">انقر على أي رمز لإدراجه مباشرة في المعاينة</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search and Category Filter Bar inside Modal */}
            <div className="p-3 bg-slate-950/50 border-b border-slate-800 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ابحث عن رمز أو إيموجي (مثل: نجمة، مجهر، كتاب، صح...)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </div>

            {/* Categories Tabs in Modal */}
            <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition shrink-0 ${
                  activeCategory === 'all'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                الكل
              </button>
              {SYMBOL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Grid Content */}
            <div className="p-4 overflow-y-auto flex-1 max-h-[50vh] space-y-4">
              {(activeCategory === 'all' ? SYMBOL_CATEGORIES : SYMBOL_CATEGORIES.filter(c => c.id === activeCategory)).map((cat) => {
                const categorySymbols = searchQuery.trim()
                  ? cat.symbols.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.char.includes(searchQuery))
                  : cat.symbols;

                if (categorySymbols.length === 0) return null;

                return (
                  <div key={cat.id} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 border-b border-slate-800 pb-1">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-500 font-normal">({categorySymbols.length})</span>
                    </div>

                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                      {categorySymbols.map((item, idx) => (
                        <button
                          key={`${cat.id}-${item.char}-${idx}`}
                          onClick={() => {
                            handleSelect(item.char);
                            setIsModalOpen(false);
                          }}
                          className="p-2 bg-slate-800/80 hover:bg-indigo-600 hover:border-indigo-400 active:scale-90 transition rounded-xl border border-slate-700 flex flex-col items-center justify-center gap-1 group text-2xl hover:shadow-lg"
                          title={item.name}
                        >
                          <span className="group-hover:scale-125 transition-transform">{item.char}</span>
                          <span className="text-[9px] text-slate-400 group-hover:text-indigo-100 truncate w-full text-center">
                            {item.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {visibleSymbols.length === 0 && (
                <div className="text-center py-10 text-slate-400 space-y-2">
                  <div className="text-3xl">🔍</div>
                  <p className="text-sm">لم نجد أي رمز يطابق البحث "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-indigo-400 underline hover:text-indigo-300"
                  >
                    عرض جميع الرموز
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>انقر على أي رمز لإدراجه في وثيقة المعاينة تلقائياً.</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
