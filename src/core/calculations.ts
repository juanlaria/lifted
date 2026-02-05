/**
 * Lifted - Shadow Calculations
 *
 * Core algorithm for calculating layered shadows based on:
 * - Tobias Ahlin's powers-of-2 layering technique
 * - Josh Comeau's elevation and light source principles
 */

import type {
  ShadowLayer,
  LightSource,
  LightSourceProp,
  Position,
  Bounds,
} from './types';

// =============================================================================
// Constants
// =============================================================================

export const MAX_LAYERS = 5;
export const BASE_OPACITY = 0.075;
export const DEFAULT_LIGHT_ANGLE = -45;
export const DEFAULT_MAX_MOUSE_ANGLE = 60;

// =============================================================================
// Light Source Utilities
// =============================================================================

export function normalizeLightSource(source: LightSourceProp | undefined): LightSource {
  if (source === undefined) {
    return { type: 'static', angle: DEFAULT_LIGHT_ANGLE };
  }
  if (typeof source === 'number') {
    return { type: 'static', angle: source };
  }
  if (source === 'mouse') {
    return {
      type: 'mouse',
      smoothing: 0.1,
      maxAngle: DEFAULT_MAX_MOUSE_ANGLE,
      fallbackAngle: DEFAULT_LIGHT_ANGLE,
    };
  }
  return source;
}

export function calculateLightAngle(
  lightSource: LightSource,
  elementBounds?: Bounds,
  mousePosition?: Position | null
): number {
  switch (lightSource.type) {
    case 'static':
    case 'custom':
      return lightSource.angle;

    case 'mouse': {
      if (!mousePosition || !elementBounds) {
        return lightSource.fallbackAngle ?? DEFAULT_LIGHT_ANGLE;
      }

      const elementCenterX = elementBounds.x + elementBounds.width / 2;
      const elementCenterY = elementBounds.y + elementBounds.height / 2;
      const deltaX = mousePosition.x - elementCenterX;
      const deltaY = mousePosition.y - elementCenterY;

      // Calculate angle from element to mouse (light comes FROM mouse position)
      // atan2 gives angle where 0 = right, 90 = down, -90 = up, 180/-180 = left
      const angleRad = Math.atan2(deltaY, deltaX);
      // Convert to degrees and flip 180° so shadow falls AWAY from light source
      const angleDeg = angleRad * (180 / Math.PI) + 180;

      return angleDeg;
    }

    default:
      return DEFAULT_LIGHT_ANGLE;
  }
}

export function angleToOffsetRatios(angleDeg: number): { ratioX: number; ratioY: number } {
  const angleRad = angleDeg * (Math.PI / 180);
  return {
    ratioX: Math.cos(angleRad),
    ratioY: Math.sin(angleRad),
  };
}

// =============================================================================
// Shadow Layer Calculations
// =============================================================================

/**
 * Calculates shadow layers based on elevation level.
 * Uses the powers-of-2 technique from Tobias Ahlin.
 *
 * @param elevation - Value from -1 (inner shadow) to 1 (drop shadow)
 * @param lightAngle - Angle of light source in degrees
 * @param intensity - Opacity multiplier (default 1)
 * @param scale - Size multiplier for offset and blur (default 1)
 */
export function calculateShadowLayers(
  elevation: number,
  lightAngle: number = DEFAULT_LIGHT_ANGLE,
  intensity: number = 1,
  scale: number = 1
): ShadowLayer[] {
  const clampedElevation = Math.max(-1, Math.min(1, elevation));

  if (clampedElevation === 0) {
    return [];
  }

  const isInset = clampedElevation < 0;
  const absElevation = Math.abs(clampedElevation);
  const activeLayerCount = absElevation * MAX_LAYERS;
  const { ratioX, ratioY } = angleToOffsetRatios(lightAngle);
  const directionMultiplier = isInset ? -1 : 1;

  const layers: ShadowLayer[] = [];

  for (let i = 0; i < MAX_LAYERS; i++) {
    const layerIndex = i + 1;
    const baseOffset = Math.pow(2, i) * scale; // Apply scale to base offset

    if (layerIndex <= activeLayerCount) {
      layers.push({
        offsetX: baseOffset * ratioX * directionMultiplier,
        offsetY: baseOffset * ratioY * directionMultiplier,
        blur: baseOffset,
        spread: 0,
        opacity: BASE_OPACITY * intensity,
        inset: isInset,
      });
    } else if (layerIndex - 1 < activeLayerCount) {
      const partial = activeLayerCount - (layerIndex - 1);
      layers.push({
        offsetX: baseOffset * ratioX * partial * directionMultiplier,
        offsetY: baseOffset * ratioY * partial * directionMultiplier,
        blur: baseOffset * partial,
        spread: 0,
        opacity: BASE_OPACITY * partial * intensity,
        inset: isInset,
      });
    }
  }

  return layers;
}

// =============================================================================
// Utility Functions
// =============================================================================

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function smoothPosition(current: Position, target: Position, smoothing: number): Position {
  return {
    x: lerp(current.x, target.x, smoothing),
    y: lerp(current.y, target.y, smoothing),
  };
}
