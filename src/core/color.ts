/**
 * Lifted - Color Utilities
 *
 * Functions for parsing colors and calculating shadow colors
 * based on Josh Comeau's "Goldilocks color" technique.
 */

// =============================================================================
// Color Parsing
// =============================================================================

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function parseColor(color: string): HSL | null {
  const hex = color.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    return hexToHSL(color);
  }

  const hsl = color.match(/^hsl\(\s*([\d.]+)\s*,?\s*([\d.]+)%?\s*,?\s*([\d.]+)%?\s*\)/i);
  if (hsl) {
    return {
      h: parseFloat(hsl[1]),
      s: parseFloat(hsl[2]),
      l: parseFloat(hsl[3]),
    };
  }

  const rgb = color.match(/^rgb\(\s*([\d.]+)\s*,?\s*([\d.]+)\s*,?\s*([\d.]+)\s*\)/i);
  if (rgb) {
    return rgbToHSL({
      r: parseFloat(rgb[1]),
      g: parseFloat(rgb[2]),
      b: parseFloat(rgb[3]),
    });
  }

  return null;
}

export function hexToHSL(hex: string): HSL {
  let r = 0, g = 0, b = 0;

  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length >= 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }

  return rgbToHSL({ r, g, b });
}

export function rgbToHSL({ r, g, b }: RGB): HSL {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// =============================================================================
// Shadow Color Calculation
// =============================================================================

export function calculateShadowColor(background: string, isDarkMode: boolean = false): string {
  const hsl = parseColor(background);

  if (!hsl) {
    return isDarkMode ? 'hsl(0 0% 100% / 0.1)' : 'hsl(220 3% 15%)';
  }

  if (isDarkMode) {
    const shadowSat = Math.max(0, hsl.s - 20);
    const shadowLight = Math.min(100, hsl.l + 30);
    return `hsl(${hsl.h} ${shadowSat}% ${shadowLight}%)`;
  } else {
    const shadowSat = Math.max(0, hsl.s * 0.6);
    const shadowLight = Math.max(10, hsl.l * 0.5);
    return `hsl(${hsl.h} ${shadowSat}% ${shadowLight}%)`;
  }
}

export function generateLayerColor(baseColor: string, opacity: number): string {
  const hsl = parseColor(baseColor);

  if (!hsl) {
    return `hsl(220 3% 15% / ${opacity})`;
  }

  return `hsl(${hsl.h} ${hsl.s}% ${hsl.l}% / ${opacity})`;
}

export function isLightColor(color: string): boolean {
  const hsl = parseColor(color);
  return hsl ? hsl.l > 50 : true;
}
