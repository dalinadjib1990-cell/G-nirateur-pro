import React from 'react';
import { 
  Square, Check, Lock, Sparkles, Flower2, 
  Award, Crown, Moon, Zap, Layers 
} from 'lucide-react';
import { PageFramePreset, PAGE_FRAME_PRESETS } from '../lib/designPresets';
import { soundManager } from '../audio';

interface DazzlingFrameSelectorProps {
  currentFrameId: string;
  onSelectFrame: (frameId: string) => void;
  isFreeMode: boolean;
  soundEnabled: boolean;
  docColor: string;
}

export const DazzlingFrameSelector: React.FC<DazzlingFrameSelectorProps> = ({
  currentFrameId,
  onSelectFrame,
  isFreeMode,
  soundEnabled,
  docColor,
}) => {
  const getIconForFrame = (frameId: string) => {
    switch (frameId) {
      case 'floral': return Flower2;
      case 'pedagogical': return Award;
      case 'royal_gold': return Crown;
      case 'islamic': return Moon;
      case 'neon_glow': return Zap;
      case 'certificate': return Award;
      case '3d': return Layers;
      default: return Square;
    }
  };

  const handleSelect = (frame: PageFramePreset) => {
    if (isFreeMode && frame.isPro) {
      alert('هذا الإطار الحصري متاح للمشتركين فقط. يرجى الترقية لفتحه!');
      return;
    }
    if (soundEnabled) soundManager.playTabClick();
    onSelectFrame(frame.id);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Sparkles size={15} className="text-amber-500" />
          إطار وزخرفة الصفحة (Page Frames)
        </label>
        <span className="text-[10px] font-semibold text-slate-400">
          تظهر الزخارف في المعاينة والطباعة وPDF
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {PAGE_FRAME_PRESETS.map(frame => {
          const isSelected = currentFrameId === frame.id;
          const isLocked = isFreeMode && frame.isPro;
          const Icon = getIconForFrame(frame.id);

          return (
            <button
              key={frame.id}
              type="button"
              onClick={() => handleSelect(frame)}
              className={`group relative flex flex-col items-center justify-between p-2.5 rounded-xl border-2 text-center transition-all duration-200 outline-none min-h-[90px] ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-md scale-[1.03] ring-1 ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5 shadow-xs'
              } ${isLocked ? 'grayscale opacity-75 hover:grayscale-0' : ''}`}
            >
              {/* Badge */}
              {frame.badge && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 text-[9px] font-black px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs whitespace-nowrap">
                  {frame.badge}
                </span>
              )}

              {/* Lock Badge */}
              {isLocked && (
                <div className="absolute top-1 right-1 z-20 p-0.5 rounded bg-slate-900/80 text-amber-400">
                  <Lock size={10} />
                </div>
              )}

              {/* Selected Checkmark */}
              {isSelected && (
                <div className="absolute top-1 left-1 z-20 p-0.5 rounded-full bg-indigo-600 text-white">
                  <Check size={10} strokeWidth={3} />
                </div>
              )}

              {/* Frame Visual Preview Miniature */}
              <div 
                className={`w-10 h-10 rounded-lg flex items-center justify-center relative my-1 transition-transform group-hover:scale-110 ${
                  frame.id === 'none' ? 'border border-dashed border-slate-300' : ''
                }`}
                style={{
                  borderColor: frame.id !== 'none' ? docColor : undefined,
                  borderWidth: frame.id === 'double' ? '3px' : frame.id === 'none' ? '1px' : '2px',
                  borderStyle: frame.id === 'double' ? 'double' : frame.id === 'ornate' ? 'dashed' : frame.id === 'none' ? 'dashed' : 'solid',
                  boxShadow: frame.id === 'neon_glow' ? `0 0 10px ${docColor}` : frame.id === '3d' ? '3px 3px 0 rgba(0,0,0,0.3)' : undefined
                }}
              >
                <Icon 
                  size={16} 
                  className={isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600'} 
                />
              </div>

              {/* Title & Subtitle */}
              <div>
                <span className={`text-[11px] font-black line-clamp-1 ${
                  isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {frame.label}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 line-clamp-1 block scale-90">
                  {frame.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
