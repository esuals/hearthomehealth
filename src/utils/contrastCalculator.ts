import { EyeComfortMetrics } from '../types/theme';

/**
 * Calculates WCAG 2.1 relative luminance for a hex color
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    return {
      r: parseInt(cleanHex[0] + cleanHex[0], 16),
      g: parseInt(cleanHex[1] + cleanHex[1], 16),
      b: parseInt(cleanHex[2] + cleanHex[2], 16),
    };
  }
  if (cleanHex.length === 6) {
    return {
      r: parseInt(cleanHex.substring(0, 2), 16),
      g: parseInt(cleanHex.substring(2, 4), 16),
      b: parseInt(cleanHex.substring(4, 6), 16),
    };
  }
  return null;
}

export function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    const sRGB = val / 255;
    return sRGB <= 0.04045 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates WCAG 2.1 contrast ratio between two colors: (L1 + 0.05) / (L2 + 0.05)
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 10) / 10;
}

/**
 * Computes eye-comfort score (0 - 100) based on contrast ratio and color temperature
 */
export function assessEyeComfort(
  textColor: string,
  bgColor: string,
  colorTempKelvin: number
): EyeComfortMetrics {
  const contrastRatio = calculateContrastRatio(textColor, bgColor);
  const wcagLevel: 'AAA' | 'AA' = contrastRatio >= 7.0 ? 'AAA' : 'AA';

  // Contrast score: 7:1 to 14:1 is optimal for reading without glare
  let contrastComfort = 100;
  if (contrastRatio < 4.5) {
    contrastComfort = 40;
  } else if (contrastRatio < 7.0) {
    contrastComfort = 80;
  } else if (contrastRatio > 18.0) {
    // Excessive blinding contrast (e.g. pure #fff on pure #000 causes halation)
    contrastComfort = 90;
  }

  // Color temperature impact on circadian rhythm & eye strain
  // 2700K - 4500K is softest on the retina
  let tempBonus = 0;
  if (colorTempKelvin <= 3500) tempBonus = 8;
  else if (colorTempKelvin <= 5000) tempBonus = 5;

  const comfortScore = Math.min(99, Math.round(contrastComfort * 0.92 + tempBonus));

  let eyeStrainIndex: EyeComfortMetrics['eyeStrainIndex'] = 'Low';
  if (comfortScore >= 92) eyeStrainIndex = 'Minimal';
  else if (comfortScore >= 80) eyeStrainIndex = 'Very Low';

  let blueLightEmission: EyeComfortMetrics['blueLightEmission'] = 'Neutral';
  if (colorTempKelvin <= 2800) blueLightEmission = 'Ultra-Low';
  else if (colorTempKelvin <= 3800) blueLightEmission = 'Low';
  else if (colorTempKelvin <= 5500) blueLightEmission = 'Moderate';

  let bestEnvironment = 'General Daylight Office & Clinic';
  if (colorTempKelvin <= 3000) bestEnvironment = 'Evening, Bedside & Low-Ambient Lighting';
  else if (contrastRatio >= 11) bestEnvironment = 'Direct Sunlight & Outdoor Touchscreens';

  return {
    contrastRatio,
    wcagLevel,
    eyeStrainIndex,
    blueLightEmission,
    colorTempKelvin,
    comfortScore,
    bestEnvironment,
  };
}
