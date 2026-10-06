import React, { useState } from 'react';
import { 
  Sparkles, Check, Lock, Layers, Palette, Compass, 
  RotateCw, Orbit, Flame, Award, Eye
} from 'lucide-react';
import { DesignStylePreset, DESIGN_STYLE_PRESETS, VISUAL_STYLE_PRESETS } from '../lib/designPresets';
import { soundManager } from '../audio';

interface DazzlingStyleSelectorProps {
  currentStyleId: string;
  onSelectStyle: (styleId: string, color: string) => void;
  isFreeMode: boolean;
  soundEnabled: boolean;
  isVisualMode?: boolean;
}

export const DazzlingStyleSelector: React.FC<DazzlingStyleSelectorProps> = ({
  currentStyleId,
  onSelectStyle,
  isFreeMode,
  soundEnabled,
  isVisualMode = false,
}) => {
  const [viewMode, setViewMode] = useState<'bubbles' | 'cards'>('bubbles');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pedagogical' | 'luxury' | 'creative' | 'classic'>('all');

  const stylesList: DesignStylePreset[] = isVisualMode ? VISUAL_STYLE_PRESETS : DESIGN_STYLE_PRESETS;

  const filteredStyles = stylesList.filter(s => {
    if (isVisualMode || selectedCategory === 'all') return true;
    return s.category === selectedCategory;
  });

  const selectedStyle = stylesList.find(s => s.id === currentStyleId) || stylesList[0];

  const handleSelect = (style: DesignStylePreset) => {
    if (isFreeMode && style.isPro) {
      alert('هذا الستايل الحصري متاح للمشتركين فقط. يرجى الترقية لفتحه والاستمتاع بكافة مميزاته!');
      return;
    }
    if (soundEnabled) soundManager.playTabClick();
    onSelectStyle(style.id, style.color);
  };

  return (
    <div className="space-y-4">
      {/* Header with Mode Toggle & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md animate-pulse">
              <Sparkles size={16} />
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-ping" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
              ستايل التصميم والألوان المبهرة
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                {stylesList.length} ستايل
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              اختر مظهر مذكرتك: فقاعات ثلاثية الأبعاد تدور أو كروت متفاعلة
            </p>
          </div>
        </div>

        {/* View Mode Toggle: Rotating Bubbles vs Rotating Cards */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) soundManager.playTabClick();
              setViewMode('bubbles');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'bubbles'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="عرض فقاعات تدور 3D"
          >
            <Orbit size={14} className={viewMode === 'bubbles' ? 'animate-spin-slow' : ''} />
            <span>فقاعات تدور</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) soundManager.playTabClick();
              setViewMode('cards');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'cards'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="عرض كروت 3D متفاعلة"
          >
            <Layers size={14} />
            <span>كروت 3D</span>
          </button>
        </div>
      </div>

      {/* Category Pills (When not in visual mode) */}
      {!isVisualMode && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'pedagogical', label: 'بيداغوجي رسمي 📜' },
            { id: 'luxury', label: 'زهري وملكي 👑' },
            { id: 'creative', label: 'إبداعي وعصري ⚡' },
            { id: 'classic', label: 'كلاسيكي واقتصادي 📚' },
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* VIEW MODE 1: ROTATING 3D BUBBLES */}
      {viewMode === 'bubbles' ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3.5 py-2">
          {filteredStyles.map(style => {
            const isSelected = currentStyleId === style.id;
            const isLocked = isFreeMode && style.isPro;
            const Icon = style.icon;

            return (
              <button
                key={style.id}
                type="button"
                onClick={() => handleSelect(style)}
                className={`group relative flex flex-col items-center justify-start p-2 rounded-2xl transition-all duration-300 text-center outline-none ${
                  isSelected 
                    ? 'scale-105 bg-gradient-to-b from-indigo-50/70 to-purple-50/70 dark:from-indigo-950/40 dark:to-purple-950/40 ring-2 ring-indigo-500 dark:ring-indigo-400 shadow-lg' 
                    : 'hover:scale-105 hover:-translate-y-1 bg-white/40 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-xs'
                } ${isLocked ? 'grayscale opacity-75 hover:grayscale-0' : ''}`}
              >
                {/* Badge Tag */}
                {style.badge && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs whitespace-nowrap">
                    {style.badge}
                  </span>
                )}

                {/* Lock Overlay */}
                {isLocked && (
                  <div className="absolute top-1.5 right-1.5 z-20 p-1 rounded-full bg-slate-900/80 text-amber-400 border border-amber-500/30 shadow-xs">
                    <Lock size={10} />
                  </div>
                )}

                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-1.5 left-1.5 z-20 p-1 rounded-full bg-emerald-500 text-white shadow-md animate-bounce">
                    <Check size={11} strokeWidth={3} />
                  </div>
                )}

                {/* ROTATING 3D SPHERICAL BUBBLE CONTAINER */}
                <div className="relative w-16 h-16 flex items-center justify-center my-1.5">
                  {/* Outer Orbiting Track & Spinning Starlight Dot */}
                  <div 
                    className={`absolute inset-[-6px] rounded-full pointer-events-none transition-opacity duration-300 ${
                      isSelected ? 'opacity-100' : 'opacity-40 group-hover:opacity-90'
                    }`}
                  >
                    {/* Spinning Conic Gradient Halo Ring */}
                    <div 
                      className={`w-full h-full rounded-full border border-dashed animate-spin-slow ${
                        isSelected ? 'border-indigo-400 dark:border-indigo-300' : 'border-slate-300 dark:border-slate-600'
                      }`}
                    />
                    
                    {/* Orbiting Starlight Orb 1 */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full animate-orbit">
                      <div 
                        className="w-2.5 h-2.5 rounded-full shadow-md"
                        style={{ backgroundColor: style.accentColor || style.color }}
                      />
                    </div>

                    {/* Orbiting Starlight Orb 2 (Faster) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full animate-orbit-fast">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-sm" />
                    </div>
                  </div>

                  {/* Pulsing Glow Aura behind bubble */}
                  {isSelected && (
                    <div 
                      className="absolute inset-0 rounded-full animate-pulse-glow blur-md"
                      style={{ backgroundColor: style.bubbleGlow }}
                    />
                  )}

                  {/* 3D Glass / Crystal Bubble Sphere */}
                  <div
                    className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 overflow-hidden ${
                      isSelected ? 'animate-float-bubble scale-105' : 'group-hover:scale-110'
                    }`}
                    style={{
                      background: `radial-gradient(circle at 32% 28%, #ffffff 0%, ${style.color}ee 40%, ${style.color} 75%, #0f172a 140%)`,
                      boxShadow: isSelected 
                        ? `0 10px 20px -3px ${style.color}80, inset 0 -4px 8px rgba(0,0,0,0.4), inset 0 3px 6px rgba(255,255,255,0.7)`
                        : `0 4px 10px -2px rgba(0,0,0,0.25), inset 0 -3px 6px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.6)`
                    }}
                  >
                    {/* Primary Specular Reflection Highlight (Glass Gleam) */}
                    <div className="absolute top-1.5 left-2 w-5 h-2.5 bg-white/70 rounded-full blur-[0.6px] -rotate-45 pointer-events-none group-hover:bg-white/90 transition-opacity" />
                    
                    {/* Secondary Bottom Rim Light */}
                    <div className="absolute bottom-1 right-2 w-4 h-1.5 bg-white/20 rounded-full blur-[1px] pointer-events-none" />

                    {/* Central Icon */}
                    <Icon size={24} className="text-white relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:rotate-12" />
                  </div>
                </div>

                {/* Label */}
                <span className={`text-[11px] font-extrabold line-clamp-1 mt-1 transition-colors ${
                  isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300 group-hover:text-indigo-600'
                }`}>
                  {style.label}
                </span>

                {/* Subtitle / Note */}
                <span className="text-[9px] text-slate-400 dark:text-slate-500 line-clamp-1 scale-90">
                  {style.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        /* VIEW MODE 2: ROTATING 3D FLOATING CARDS */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-2">
          {filteredStyles.map(style => {
            const isSelected = currentStyleId === style.id;
            const isLocked = isFreeMode && style.isPro;
            const Icon = style.icon;

            return (
              <button
                key={style.id}
                type="button"
                onClick={() => handleSelect(style)}
                className={`group relative text-right p-3.5 rounded-2xl border-2 transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[110px] ${
                  isSelected
                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-transparent dark:from-indigo-950/50 dark:to-slate-900 shadow-xl scale-[1.02] ring-2 ring-indigo-400/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-indigo-300 dark:hover:border-indigo-700 hover:-translate-y-1 hover:shadow-md'
                } ${isLocked ? 'grayscale opacity-75 hover:grayscale-0' : ''}`}
              >
                {/* Ambient Color Glow in corner */}
                <div 
                  className="absolute -top-10 -left-10 w-28 h-28 rounded-full blur-2xl opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"
                  style={{ backgroundColor: style.color }}
                />

                {/* Top Row: Icon + Badge + Lock */}
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2.5">
                    {/* Rotating Mini 3D Sphere */}
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center relative shadow-md overflow-hidden shrink-0 group-hover:rotate-12 transition-transform"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, #ffffff 0%, ${style.color} 50%, #0f172a 130%)`,
                        boxShadow: `0 4px 10px ${style.color}50`
                      }}
                    >
                      <div className="absolute top-1 left-1.5 w-3 h-1.5 bg-white/70 rounded-full blur-[0.5px] -rotate-45" />
                      <Icon size={18} className="text-white relative z-10 drop-shadow" />
                    </div>

                    <div>
                      <h5 className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                        {style.label}
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        )}
                      </h5>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {style.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {style.badge && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 whitespace-nowrap">
                        {style.badge}
                      </span>
                    )}
                    {isLocked ? (
                      <div className="p-1 rounded-full bg-slate-800 text-amber-400">
                        <Lock size={12} />
                      </div>
                    ) : isSelected ? (
                      <div className="p-1 rounded-full bg-indigo-600 text-white shadow-sm">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Bottom Row: Palette Preview Chips */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 mt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-400">تدرج الألوان:</span>
                    <div className="flex items-center -space-x-1 space-x-reverse">
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 shadow-xs" 
                        style={{ backgroundColor: style.color }}
                        title="اللون الرئيسي"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 shadow-xs" 
                        style={{ backgroundColor: style.accentColor }}
                        title="اللون الثانوي"
                      />
                      <div 
                        className={`w-6 h-3 rounded-full bg-gradient-to-r ${style.gradient} border border-white/50 shadow-xs`}
                        title="تدرج الترويسة"
                      />
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {isSelected ? 'محدد حالياً ✓' : 'اختيار النمط ←'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ACTIVE PREVIEW BANNER */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden"
            style={{
              background: `radial-gradient(circle at 30% 30%, #ffffff 0%, ${selectedStyle.color} 50%, #0f172a 140%)`,
              boxShadow: `0 0 15px ${selectedStyle.color}80`
            }}
          >
            <div className="absolute top-1 left-1.5 w-3 h-1.5 bg-white/70 rounded-full blur-[0.5px] -rotate-45" />
            {React.createElement(selectedStyle.icon, { size: 20, className: "text-white drop-shadow" })}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-300">النمط المختار للتوليد:</span>
              <span className="text-xs font-black text-white">{selectedStyle.label}</span>
              {selectedStyle.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/40">
                  {selectedStyle.badge}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300/90 mt-0.5">
              {selectedStyle.subtitle}
            </p>
          </div>
        </div>

        {/* Lesson Stages Preview (تهيئة، أنشطة، حوصلة، تطبيق) */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700/60">
          <span className="text-[10px] font-bold text-slate-400">محطات المذكرة:</span>
          <span className="px-1.5 py-0.5 rounded-md bg-orange-500/20 text-orange-300 text-[9px] font-bold">تهيئة 🟠</span>
          <span className="px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[9px] font-bold">أنشطة 🔵</span>
          <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">حوصلة 🟢</span>
          <span className="px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[9px] font-bold">تطبيق 🟣</span>
        </div>
      </div>
    </div>
  );
};
