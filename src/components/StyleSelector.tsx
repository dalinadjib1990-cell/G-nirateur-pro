import React from 'react';
import { Check, Lock, Sparkles } from 'lucide-react';
import { STYLES_REGISTRY, StyleDefinition } from '../lib/designSystem';
import { Style3DIcon } from './Style3DIcon';

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
          <span>نظام التصميم والهويات البصرية ثلاثية الأبعاد (12 قالباً بيداغوجياً بألوان حية قوية)</span>
        </label>
        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
          <span>✨ أيقونات مجسمة 3D وألوان ساطعة جذابة</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
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
              className={`group relative flex flex-col justify-between p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border text-right overflow-hidden shadow-sm hover:shadow-xl ${
                isSelected
                  ? 'bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-indigo-600 dark:border-indigo-400 shadow-xl shadow-indigo-500/20 ring-2 ring-indigo-500/50 transform scale-[1.03]'
                  : 'bg-white/90 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:scale-[1.01]'
              } ${isLocked ? 'opacity-70 grayscale hover:grayscale-0' : ''}`}
            >
              {/* Pro Lock or Selected Badge */}
              <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1">
                {isLocked ? (
                  <span className="flex items-center gap-0.5 bg-slate-950/90 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500/40 shadow-md">
                    <Lock size={10} />
                    <span>PRO</span>
                  </span>
                ) : isSelected ? (
                  <span className="flex items-center gap-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md animate-pulse">
                    <Check size={12} strokeWidth={3} />
                    <span>مُختار</span>
                  </span>
                ) : null}
              </div>

              {/* 3D Iconic Visual Presentation Box */}
              <div 
                className="w-full h-24 rounded-xl mb-3 overflow-hidden border relative flex items-center justify-between p-2 transition-all duration-300 group-hover:scale-[1.02] shadow-inner"
                style={{
                  background: style.tokens.surfaceAccent 
                    ? `linear-gradient(135deg, ${style.tokens.background} 0%, ${style.tokens.surfaceAccent} 100%)` 
                    : style.tokens.background,
                  borderColor: style.tokens.border,
                }}
              >
                {/* 3D Icon Graphic */}
                <div className="relative z-10 flex-shrink-0 drop-shadow-md transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1">
                  <Style3DIcon artDirection={style.artDirection} size={58} />
                </div>

                {/* Mini Preview Card simulating the Document structure with vibrant accents */}
                <div className="flex-1 h-full flex flex-col justify-between py-0.5 pr-2 pl-0.5">
                  {/* Top Bar with Primary Strong Color */}
                  <div 
                    className="w-full h-3.5 rounded flex items-center justify-between px-1.5 shadow-xs"
                    style={{
                      backgroundColor: style.tokens.primary,
                      color: '#ffffff',
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white/70" />
                    <div className="w-12 h-1 bg-white/80 rounded-full" />
                  </div>

                  {/* Middle Simulated Pedagogical Block */}
                  <div 
                    className="w-full flex-1 my-1 rounded p-1 flex flex-col justify-center border"
                    style={{
                      backgroundColor: style.tokens.surface,
                      borderColor: style.tokens.accent,
                      borderRightWidth: '3px',
                    }}
                  >
                    <div className="w-full h-1.5 rounded-full mb-1" style={{ backgroundColor: style.tokens.accent }} />
                    <div className="w-3/4 h-1 rounded-full" style={{ backgroundColor: style.tokens.secondary }} />
                  </div>

                  {/* Bottom Mini Tag */}
                  <div className="flex items-center justify-between text-[9px] font-bold">
                    <span 
                      className="px-1.5 py-0.2 rounded text-[8.5px] font-extrabold text-white shadow-xs"
                      style={{ backgroundColor: style.tokens.secondary }}
                    >
                      3D
                    </span>
                    <span className="w-8 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                  </div>
                </div>
              </div>

              {/* Style Titles */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <h4 className={`text-xs font-black truncate ${
                      isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-slate-100'
                    }`}>
                      {style.nameAr}
                    </h4>
                    <span className="text-[9.5px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-tight">
                      {style.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-2.5 font-medium">
                    {style.descriptionAr}
                  </p>
                </div>

                {/* Color Swatch Palette Dots with Vibrant Depth */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    {style.palette.map((color, idx) => (
                      <span
                        key={idx}
                        className="w-3.5 h-3.5 rounded-full border border-black/15 dark:border-white/20 shadow-sm transition-transform duration-200 hover:scale-125"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-slate-700 dark:text-slate-200">
                    {style.tagline}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
