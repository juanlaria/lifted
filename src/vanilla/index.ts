/**
 * Lifted - Vanilla JavaScript Module
 */

export {
  initLiftedBox,
  initAllLiftedBoxes,
  applyLift,
  removeLift,
  getLiftCSS,
} from './init';

export {
  generateShadow,
  generateBoxShadow,
  layersToCSS,
  ELEVATION_PRESETS,
  resolveElevation,
} from '../core/css-generator';

export {
  calculateShadowLayers,
  calculateLightAngle,
  normalizeLightSource,
} from '../core/calculations';

export {
  calculateShadowColor,
  parseColor,
  isLightColor,
} from '../core/color';

export type {
  VanillaLiftedBoxOptions,
  VanillaLiftedBoxInstance,
  ShadowOptions,
  ShadowResult,
  LightSourceProp,
  LightSource,
} from '../core/types';

export type { ElevationPreset } from '../core/css-generator';
