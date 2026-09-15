import React from 'react';
import { Check, Lock, Sparkles } from 'lucide-react';
import { STYLES_REGISTRY, StyleDefinition } from '../lib/designSystem';

interface StyleSelectorProps {
  selectedStyleId: string;
  onSelectStyle: (styleId: string) => void;
  isFreeMode: boolean;
  soundEnabled?: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyleId,
  onSelectStyle,
  isFreeMode,
  soundEnabled = false,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Sparkles size={14} className="text-amber-500" />
          <span>نظام التصميم والهوية البصرية للمذكرة (12 قالباً بيداغوجياً)</span>
        </label>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          هويات بصرية حقيقية مخصصة للطباعة والنشر المدرسي
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {STYLES_REGISTRY.map((style: StyleDefinition) => {
          const isSelected = selectedStyleId === style.id || selectedStyleId === style.legacyId;
          const isLocked = isFreeMode && style.isPro;

          return (
            <div
              key={style.id}
              onClick={() => {
                if (isLocked) {
                  alert('هذا النمط الاحترافي متاح للمشتركين فقط. يرجى الترقية لفتحه!');
                  return;
                }
                onSelectStyle(style.id);
              }}
              className={`group relative flex flex-col justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 border text-right overflow-hidden ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 shadow-lg shadow-indigo-500/15 ring-2 ring-indigo-500/40 transform scale-[1.02]'
                  : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700/70 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-md'
              } ${isLocked ? 'opacity-65 grayscale hover:grayscale-0' : ''}`}
            >
              {/* Pro Lock or Selected Badge */}
              <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1">
                {isLocked ? (
                  <span className="flex items-center gap-0.5 bg-slate-900/90 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-amber-500/30 shadow-sm">
                    <Lock size={10} />
                    <span>PRO</span>
                  </span>
                ) : isSelected ? (
                  <span className="flex items-center gap-1 bg-indigo-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                    <Check size={11} strokeWidth={3} />
                    <span>مُختار</span>
                  </span>
                ) : null}
              </div>

              {/* Archetype Visual Mini-Preview */}
              <div 
                className="w-full h-16 rounded-lg mb-2.5 overflow-hidden border relative flex flex-col justify-between p-1.5 transition-transform duration-300 group-hover:scale-[1.02]"
                style={{
                  backgroundColor: style.tokens.background,
                  borderColor: style.tokens.border,
                }}
              >
                {/* Mini Top Banner */}
                <div 
                  className="w-full h-3 rounded-sm flex items-center justify-between px-1"
                  style={{
                    backgroundColor: style.tokens.primary,
                    color: '#ffffff',
                  }}
                >
                  <div className="w-1/3 h-1 bg-white/40 rounded-full" />
                  <div className="w-1/4 h-1 bg-white/60 rounded-full" />
                </div>

                {/* Mini Document Elements Mockup */}
                <div className="flex gap-1.5 flex-1 items-center px-0.5 py-1">
                  {/* Mini Content Card */}
                  <div 
                    className="flex-1 h-full rounded border flex flex-col justify-center px-1 gap-1"
                    style={{
                      backgroundColor: style.tokens.surface,
                      borderColor: style.tokens.accent,
                      borderRightWidth: '2px',
                    }}
                  >
                    <div className="w-3/4 h-1 rounded-full" style={{ backgroundColor: style.tokens.primary }} />
                    <div className="w-1/2 h-0.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
                  </div>
                  
                  {/* Mini Secondary Box */}
                  <div 
                    className="w-1/3 h-full rounded border flex flex-col justify-center items-center px-1"
                    style={{
                      backgroundColor: style.tokens.surfaceAccent || style.tokens.surface,
                      borderColor: style.tokens.secondary,
                    }}
                  >
                    <div className="w-3 h-3 rounded-full mb-0.5" style={{ backgroundColor: style.tokens.secondary }} />
                    <div className="w-4 h-0.5 bg-slate-400 rounded-full" />
                  </div>
                </div>

                {/* Mini Footer Line */}
                <div className="w-full flex items-center justify-between pt-0.5 border-t border-slate-200">
                  <div className="w-6 h-0.5 bg-slate-300 rounded-full" />
                  <div className="w-3 h-0.5" style={{ backgroundColor: style.tokens.accent }} />
                </div>
              </div>

              {/* Style Titles */}
              <div>
                <div className="flex items-baseline justify-between mb-0.5">
                  <h4 className={`text-xs font-black truncate ${
                    isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {style.nameAr}
                  </h4>
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">
                    {style.name}
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed mb-2 font-medium">
                  {style.descriptionAr}
                </p>
              </div>

              {/* Color Swatch Palette Dots */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  {style.palette.map((color, idx) => (
                    <span
                      key={idx}
                      className="w-3 h-3 rounded-full border border-black/10 dark:border-white/20 shadow-xs"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <span className="text-[9.5px] font-semibold text-slate-600 dark:text-slate-300">
                  {style.tagline}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
