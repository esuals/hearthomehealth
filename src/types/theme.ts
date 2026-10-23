export type ThemeId = 'clinical' | 'plain' | 'nocturne' | 'sage' | 'circadian' | 'artistic';

export type ThemeAesthetic = 'plain' | 'balanced' | 'artistic';

export interface EyeComfortMetrics {
  contrastRatio: number; // e.g. 11.4
  wcagLevel: 'AAA' | 'AA';
  eyeStrainIndex: 'Minimal' | 'Very Low' | 'Low';
  blueLightEmission: 'Ultra-Low' | 'Low' | 'Moderate' | 'Neutral';
  colorTempKelvin: number; // 2400K - 6500K
  comfortScore: number; // 0 - 100
  bestEnvironment: string;
}

export interface AppTheme {
  id: ThemeId;
  name: string;
  tagline: string;
  aesthetic: ThemeAesthetic; // 'plain' vs 'balanced' vs 'artistic'
  description: string;
  colors: {
    canvas: string;
    surface: string;
    surfaceSecondary: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
    accentHover: string;
    accentLight: string;
    accentText: string;
  };
  metrics: EyeComfortMetrics;
  classNames: {
    bodyBg: string;
    cardBg: string;
    cardBorder: string;
    textPrimary: string;
    textSecondary: string;
    heroGradient: string;
    accentBtn: string;
    accentBadge: string;
  };
}
