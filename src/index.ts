/**
 * Lifted - Main Entry Point
 *
 * Beautiful, realistic CSS shadows with layered depth.
 */

// Core exports
export {
  generateShadow,
  generateBoxShadow,
  layersToCSS,
  ELEVATION_PRESETS,
  resolveElevation,
  generateStyleObject,
  generateTransition,
  DEFAULT_SHADOW_TRANSITION,
} from './core/css-generator';

export {
  calculateShadowLayers,
  calculateLightAngle,
  normalizeLightSource,
  angleToOffsetRatios,
  MAX_LAYERS,
  BASE_OPACITY,
  DEFAULT_LIGHT_ANGLE,
} from './core/calculations';

export {
  calculateShadowColor,
  parseColor,
  hexToHSL,
  rgbToHSL,
  isLightColor,
  generateLayerColor,
} from './core/color';

// Type exports
export type {
  ShadowLayer,
  ShadowLayerWithColor,
  ShadowOptions,
  ShadowResult,
  LightSource,
  LightSourceProp,
  StaticLightSource,
  MouseLightSource,
  CustomLightSource,
  Position,
  Bounds,
  LiftedBoxProps,
  LiftedConfig,
  LiftedContextValue,
  VanillaLiftedBoxOptions,
  VanillaLiftedBoxInstance,
} from './core/types';

export type { ElevationPreset } from './core/css-generator';
