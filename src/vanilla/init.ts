/**
 * Lifted - Vanilla JavaScript Integration
 */

import type {
  VanillaLiftedBoxOptions,
  VanillaLiftedBoxInstance,
  Position,
  Bounds,
} from '../core/types';

import { generateShadow, generateTransition } from '../core/css-generator';
import { normalizeLightSource, smoothPosition } from '../core/calculations';

// =============================================================================
// Main Initialization Function
// =============================================================================

export function initLiftedBox(
  element: HTMLElement,
  options: VanillaLiftedBoxOptions = {}
): VanillaLiftedBoxInstance {
  let currentOptions = { ...options };
  let mousePosition: Position | null = null;
  let smoothedPosition: Position | null = null;
  let animationFrame: number | null = null;
  let isDestroyed = false;

  const lightSource = normalizeLightSource(currentOptions.lightSource);

  function getBounds(): Bounds {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    };
  }

  function updateShadow() {
    if (isDestroyed) return;

    const result = generateShadow(
      {
        elevation: currentOptions.elevation ?? 0.3,
        lightSource: currentOptions.lightSource,
        background: currentOptions.background,
        shadowColor: currentOptions.shadowColor,
        shadowColorDark: currentOptions.shadowColorDark,
        intensity: currentOptions.intensity ?? 1,
        isDarkMode: currentOptions.isDarkMode ?? false,
      },
      getBounds(),
      smoothedPosition
    );

    element.style.boxShadow = result.boxShadow;
  }

  function handleMouseMove(event: MouseEvent) {
    mousePosition = { x: event.clientX, y: event.clientY };

    if (lightSource.type === 'mouse') {
      const smoothing = lightSource.smoothing ?? 0.1;

      if (smoothedPosition) {
        smoothedPosition = smoothPosition(smoothedPosition, mousePosition, smoothing);
      } else {
        smoothedPosition = mousePosition;
      }

      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateShadow);
    }
  }

  // Initial setup
  if (currentOptions.background) {
    element.style.backgroundColor = currentOptions.background;
  }

  if (currentOptions.animated !== false) {
    element.style.transition = generateTransition(currentOptions.transitionDuration ?? 150);
  }

  updateShadow();

  // Mouse tracking
  if (lightSource.type === 'mouse') {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
  }

  // Return instance
  return {
    setElevation(elevation: number) {
      currentOptions.elevation = elevation;
      updateShadow();
    },

    setLightSource(source) {
      currentOptions.lightSource = source;
      updateShadow();
    },

    update(newOptions) {
      currentOptions = { ...currentOptions, ...newOptions };
      if (newOptions.background) {
        element.style.backgroundColor = newOptions.background;
      }
      updateShadow();
    },

    getShadowCSS() {
      return element.style.boxShadow;
    },

    destroy() {
      isDestroyed = true;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      window.removeEventListener('mousemove', handleMouseMove);
      element.style.boxShadow = '';
      element.style.transition = '';
    },
  };
}

// =============================================================================
// Utility Functions
// =============================================================================

export function initAllLiftedBoxes(
  selector: string = '[data-lifted]',
  defaultOptions: VanillaLiftedBoxOptions = {}
): VanillaLiftedBoxInstance[] {
  const elements = document.querySelectorAll<HTMLElement>(selector);
  return Array.from(elements).map((el) => {
    const dataElevation = el.dataset.liftedElevation;
    const options: VanillaLiftedBoxOptions = {
      ...defaultOptions,
      elevation: dataElevation ? parseFloat(dataElevation) : defaultOptions.elevation,
    };
    return initLiftedBox(el, options);
  });
}

export function applyLift(element: HTMLElement, elevation: number, options: Partial<VanillaLiftedBoxOptions> = {}): void {
  const result = generateShadow({ elevation, ...options });
  element.style.boxShadow = result.boxShadow;
}

export function removeLift(element: HTMLElement): void {
  element.style.boxShadow = '';
}

export function getLiftCSS(elevation: number, options: Partial<VanillaLiftedBoxOptions> = {}): string {
  const result = generateShadow({ elevation, ...options });
  return result.boxShadow;
}
