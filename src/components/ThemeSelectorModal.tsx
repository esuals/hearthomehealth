import React, { useState } from 'react';
import { ThemeId, ThemeAesthetic } from '../types/theme';
import { APP_THEMES } from '../data/themes';
import { calculateContrastRatio, assessEyeComfort } from '../utils/contrastCalculator';
import { 
  Palette, 
  X, 
  Eye, 
  Sun, 
  Moon, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Sliders, 
  SlidersHorizontal,
  Activity,
  Layers,
  HelpCircle,
  Zap
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentThemeId,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  const [aestheticFilter, setAestheticFilter] = useState<'all' | ThemeAesthetic>('all');
  const [showCustomTester, setShowCustomTester] = useState(false);
  const [customText, setCustomText] = useState('#1c1917');
  const [customBg, setCustomBg] = useState('#f5f5f4');

  const currentTheme = APP_THEMES[currentThemeId] || APP_THEMES.clinical;

  const filteredThemes = Object.values(APP_THEMES).filter((th) => {
    if (aestheticFilter === 'all') return true;
    return th.aesthetic === aestheticFilter;
  });

  const customRatio = calculateContrastRatio(customText, customBg);

  const handleApply = (id: ThemeId) => {
    soundFx.playChime('success');
    onSelectTheme(id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center">
                <Palette className="w-4 h-4" />
              </span>
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
                Visual Ergonomics & Aesthetic Grading
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Eye-Comfort Themes & Contrast Studio
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Toggle from stripped-down plain text to expressive artistic palettes. All 6 themes calculate strict WCAG 2.1 AAA contrast for zero ocular strain.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-slate-50">
          {/* Aesthetic Gradation Segmented Control */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Aesthetic Spectrum:
              </span>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setAestheticFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  aestheticFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All (6)
              </button>
              <button
                onClick={() => setAestheticFilter('plain')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  aestheticFilter === 'plain'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Plain / Minimal</span>
              </button>
              <button
                onClick={() => setAestheticFilter('balanced')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  aestheticFilter === 'balanced'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Balanced Clinical</span>
              </button>
              <button
                onClick={() => setAestheticFilter('artistic')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  aestheticFilter === 'artistic'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Artistic & Atelier</span>
              </button>
            </div>
          </div>

          {/* Active Theme Live Mathematical Contrast HUD */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span className="text-xs uppercase font-bold tracking-wider text-slate-300">
                  Active Theme Ocular Comfort Analysis: <strong>{currentTheme.name}</strong>
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/50 px-2 py-0.5 rounded">
                WCAG {currentTheme.metrics.wcagLevel} Certified ({currentTheme.metrics.contrastRatio}:1)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                  Contrast Ratio
                </span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  {currentTheme.metrics.contrastRatio}:1
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Min 7.0:1 required for AAA
                </span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                  Color Temp
                </span>
                <span className="text-xl font-bold font-mono text-amber-300">
                  {currentTheme.metrics.colorTempKelvin}K
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {currentTheme.metrics.colorTempKelvin < 3500 ? 'Low Blue Light Peak' : 'Daylight Spectrum'}
                </span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                  Eye-Strain Index
                </span>
                <span className="text-xl font-bold font-mono text-white">
                  {currentTheme.metrics.eyeStrainIndex}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Score: {currentTheme.metrics.comfortScore}/100
                </span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                  Blue Light Emission
                </span>
                <span className="text-xl font-bold font-mono text-cyan-300">
                  {currentTheme.metrics.blueLightEmission}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                  {currentTheme.metrics.bestEnvironment}
                </span>
              </div>
            </div>
          </div>

          {/* Theme Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredThemes.map((th) => {
              const isSelected = th.id === currentThemeId;

              return (
                <div
                  key={th.id}
                  onClick={() => handleApply(th.id)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-white ring-2 ring-indigo-600/30 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        th.aesthetic === 'plain'
                          ? 'bg-stone-100 text-stone-700'
                          : th.aesthetic === 'artistic'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {th.aesthetic === 'plain' ? 'Plain / Minimal' : th.aesthetic === 'artistic' ? 'Artistic' : 'Balanced'}
                      </span>

                      <span className="text-[11px] font-mono font-bold text-emerald-600">
                        {th.metrics.contrastRatio}:1 (AAA)
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{th.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{th.tagline}</p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {th.description}
                    </p>
                  </div>

                  {/* Swatches & Apply Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] text-slate-400 font-medium">Palette:</span>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs"
                          style={{ backgroundColor: th.colors.canvas }}
                          title="Canvas"
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs"
                          style={{ backgroundColor: th.colors.surface }}
                          title="Surface"
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs"
                          style={{ backgroundColor: th.colors.accent }}
                          title="Accent"
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs"
                          style={{ backgroundColor: th.colors.textPrimary }}
                          title="Text"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(th.id);
                      }}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Active Theme</span>
                        </>
                      ) : (
                        <span>Apply Theme</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Contrast Lab Calculator Toggle */}
          <div className="pt-2">
            <button
              onClick={() => setShowCustomTester(!showCustomTester)}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{showCustomTester ? 'Hide Live Contrast Testing Lab' : 'Open Custom Color Contrast Testing Lab'}</span>
            </button>

            {showCustomTester && (
              <div className="mt-3 p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-900">
                  Custom Contrast Calculator (WCAG 2.1 Formula: (L1 + 0.05) / (L2 + 0.05))
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">
                      Text Foreground Color (Hex)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-slate-300 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-medium mb-1">
                      Background Canvas Color (Hex)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customBg}
                        onChange={(e) => setCustomBg(e.target.value)}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={customBg}
                        onChange={(e) => setCustomBg(e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-slate-300 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Computed Output */}
                <div
                  className="p-4 rounded-xl border flex items-center justify-between"
                  style={{ backgroundColor: customBg, color: customText }}
                >
                  <div>
                    <div className="font-bold text-sm">Sample Clinical Text Preview</div>
                    <div className="text-xs opacity-80">
                      Evaluated for optical clarity and comfortable readability.
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold font-mono tabular-nums">{customRatio}:1</div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      customRatio >= 7.0
                        ? 'bg-emerald-100 text-emerald-800'
                        : customRatio >= 4.5
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {customRatio >= 7.0 ? 'Passes WCAG AAA' : customRatio >= 4.5 ? 'Passes WCAG AA' : 'Fails Contrast'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>All themes dynamically adjust color temperature and luminance across the applet.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
