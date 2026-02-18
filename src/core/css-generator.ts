/**
 * Lifted - CSS Generator
 *
 * Combines shadow calculations with colors to produce final CSS output.
 */

import type {
  ShadowLayer,
  ShadowLayerWithColor,
  ShadowOptions,
  ShadowResult,
  Bounds,
  Position,
} from './types';

import {
  calculateShadowLayers,
  calculateLightAngle,
  normalizeLightSource,
} from './calculations';

import {
  calculateShadowColor,
  generateLayerColor,
} from './color';

// =============================================================================
// Main Shadow Generation
// =============================================================================

export function generateShadow(
  options: ShadowOptions,
  elementBounds?: Bounds,
  mousePosition?: Position | null
): ShadowResult {
  const {
    elevation = 0.3,
    lightSource: lightSourceProp,
    background,
    shadowColor: shadowColorOverride,
    shadowColorDark,
    intensity = 1,
    scale = 1,
    isDarkMode = false,
  } = options;

  const lightSource = normalizeLightSource(lightSourceProp);
  const isAmbient = lightSource.type === 'ambient';
  const lightAngle = calculateLightAngle(lightSource, elementBounds, mousePosition);
  const baseLayers = calculateShadowLayers(elevation, lightAngle, intensity, scale, isAmbient);

  let shadowColor: string;

  if (shadowColorOverride) {
    shadowColor = shadowColorOverride;
  } else if (isDarkMode && shadowColorDark) {
    shadowColor = shadowColorDark;
  } else if (background) {
    shadowColor = calculateShadowColor(background, isDarkMode);
  } else {
    shadowColor = isDarkMode ? 'hsl(0 0% 100% / 0.1)' : 'hsl(220 3% 15%)';
  }

  const layers = applyColorToLayers(baseLayers, shadowColor);
  const boxShadow = layersToCSS(layers);
  const cssVariables = generateCSSVariables(layers, elevation, lightAngle);

  return { layers, boxShadow, cssVariables };
}

export function generateBoxShadow(
  elevation: number,
  options: Partial<Omit<ShadowOptions, 'elevation'>> = {}
): string {
  const result = generateShadow({ elevation, ...options });
  return result.boxShadow;
}

// =============================================================================
// Layer Processing
// =============================================================================

function applyColorToLayers(layers: ShadowLayer[], shadowColor: string): ShadowLayerWithColor[] {
  return layers.map((layer) => ({
    ...layer,
    color: generateLayerColor(shadowColor, layer.opacity),
  }));
}

export function layersToCSS(layers: ShadowLayerWithColor[]): string {
  if (layers.length === 0) {
    return 'none';
  }

  return layers
    .map((layer) => {
      const { offsetX, offsetY, blur, spread, color, inset } = layer;
      const x = formatPx(offsetX);
      const y = formatPx(offsetY);
      const b = formatPx(blur);
      const s = formatPx(spread);
      const insetPrefix = inset ? 'inset ' : '';

      if (spread === 0) {
        return `${insetPrefix}${x} ${y} ${b} ${color}`;
      }
      return `${insetPrefix}${x} ${y} ${b} ${s} ${color}`;
    })
    .join(',\n    ');
}

function formatPx(value: number): string {
  if (value === 0) return '0';
  const rounded = Math.round(value * 100) / 100;
  return `${rounded}px`;
}

// =============================================================================
// CSS Variables Generation
// =============================================================================

function generateCSSVariables(
  layers: ShadowLayerWithColor[],
  elevation: number,
  lightAngle: number
): Record<string, string> {
  const variables: Record<string, string> = {
    '--lifted-elevation': elevation.toString(),
    '--lifted-light-angle': `${lightAngle}deg`,
    '--lifted-layers': layers.length.toString(),
    '--lifted-shadow': layersToCSS(layers),
  };

  return variables;
}

// =============================================================================
// Preset Shadows
// =============================================================================

export const ELEVATION_PRESETS = {
  deepInset: -0.75,
  inset: -0.3,
  none: 0,
  subtle: 0.15,
  small: 0.25,
  medium: 0.5,
  large: 0.75,
  xlarge: 1,
} as const;

export type ElevationPreset = keyof typeof ELEVATION_PRESETS;

export function resolveElevation(value: number | ElevationPreset): number {
  if (typeof value === 'number') {
    return value;
  }
  return ELEVATION_PRESETS[value];
}

// =============================================================================
// Style Object Generation
// =============================================================================

export function generateStyleObject(
  options: ShadowOptions,
  elementBounds?: Bounds,
  mousePosition?: Position | null
): React.CSSProperties {
  const result = generateShadow(options, elementBounds, mousePosition);

  const style: React.CSSProperties = {
    boxShadow: result.boxShadow,
  };

  if (options.background) {
    style.backgroundColor = options.background;
  }

  return style;
}

export const DEFAULT_SHADOW_TRANSITION = 'box-shadow 150ms cubic-bezier(0.2, 0.6, 0.3, 1)';

export function generateTransition(durationMs: number = 150, includeTransform: boolean = false): string {
  const easing = 'cubic-bezier(0.2, 0.6, 0.3, 1)';
  const transitions = [`box-shadow ${durationMs}ms ${easing}`];

  if (includeTransform) {
    transitions.push(`transform ${durationMs}ms ${easing}`);
  }

  return transitions.join(', ');
}
