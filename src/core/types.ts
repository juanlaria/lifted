/**
 * Lifted - Type Definitions
 */

// =============================================================================
// Shadow Layer Types
// =============================================================================

/**
 * Represents a single shadow layer in the layered shadow system.
 */
export interface ShadowLayer {
  /** Horizontal offset in pixels */
  offsetX: number;
  /** Vertical offset in pixels */
  offsetY: number;
  /** Blur radius in pixels */
  blur: number;
  /** Spread radius in pixels (usually 0 for realistic shadows) */
  spread: number;
  /** Opacity of this layer (0-1) */
  opacity: number;
  /** Whether this is an inner (inset) shadow */
  inset?: boolean;
}

/**
 * Complete shadow configuration including color.
 */
export interface ShadowLayerWithColor extends ShadowLayer {
  /** Shadow color in any CSS color format */
  color: string;
}

// =============================================================================
// Light Source Types
// =============================================================================

/**
 * Static light source with a fixed angle.
 */
export interface StaticLightSource {
  type: 'static';
  /** Angle in degrees (-180 to 180, where -45 is top-left) */
  angle: number;
}

/**
 * Mouse-following light source.
 */
export interface MouseLightSource {
  type: 'mouse';
  /** Smoothing factor for mouse movement (0-1, lower = smoother) */
  smoothing?: number;
  /** Maximum angle deviation from center */
  maxAngle?: number;
  /** Fallback angle when mouse position is unavailable */
  fallbackAngle?: number;
}

/**
 * Custom light source controlled by external value.
 */
export interface CustomLightSource {
  type: 'custom';
  /** Current angle value */
  angle: number;
}

/**
 * Union of all light source types.
 */
export type LightSource = StaticLightSource | MouseLightSource | CustomLightSource;

/**
 * Shorthand light source prop type.
 * Can be a number (static angle), 'mouse', or full configuration.
 */
export type LightSourceProp = number | 'mouse' | LightSource;

// =============================================================================
// Component Props
// =============================================================================

/**
 * Props for the LiftedBox React component.
 */
export interface LiftedBoxProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * Elevation level from -1 (maximum inner shadow) to 1 (maximum drop shadow).
   * - Negative values create inset/inner shadows (pressed effect)
   * - Zero means no shadow
   * - Positive values create drop shadows (raised effect)
   * @default 0.3
   */
  elevation?: number;

  /**
   * HTML element to render as.
   * @default 'div'
   */
  as?: keyof JSX.IntrinsicElements;

  /**
   * Light source configuration.
   * @default -45 (top-left)
   */
  lightSource?: LightSourceProp;

  /**
   * Background color. Used for automatic shadow color calculation.
   */
  background?: string;

  /**
   * Manual shadow color override.
   */
  shadowColor?: string;

  /**
   * Shadow color for dark mode (when using auto-detect).
   */
  shadowColorDark?: string;

  /**
   * Shadow intensity multiplier.
   * @default 1
   */
  intensity?: number;

  /**
   * Whether to animate shadow changes.
   * @default true
   */
  animated?: boolean;

  /**
   * Transition duration in milliseconds.
   * @default 150
   */
  transitionDuration?: number;

  /**
   * Children elements.
   */
  children?: React.ReactNode;
}

// =============================================================================
// Configuration Types
// =============================================================================

/**
 * Global configuration for Lifted.
 */
export interface LiftedConfig {
  /** Whether to automatically detect dark mode */
  autoDetectDarkMode?: boolean;
  /** Default elevation for all components */
  defaultElevation?: number;
  /** Default light source for all components */
  defaultLightSource?: LightSourceProp;
  /** Color scheme override ('light' | 'dark' | 'auto') */
  colorScheme?: 'light' | 'dark' | 'auto';
  /** Disable all transitions */
  disableTransitions?: boolean;
  /** Custom color mapping function */
  customColorMapping?: (background: string, isDark: boolean) => string;
}

/**
 * Context value for LiftedProvider.
 */
export interface LiftedContextValue extends LiftedConfig {
  /** Current dark mode state */
  isDarkMode: boolean;
  /** Current mouse position (if tracking) */
  mousePosition: Position | null;
}

// =============================================================================
// Vanilla JS Types
// =============================================================================

/**
 * Options for vanilla JS initialization.
 */
export interface VanillaLiftedBoxOptions {
  elevation?: number;
  lightSource?: LightSourceProp;
  background?: string;
  shadowColor?: string;
  shadowColorDark?: string;
  intensity?: number;
  animated?: boolean;
  transitionDuration?: number;
  isDarkMode?: boolean;
}

/**
 * Instance returned by vanilla JS initialization.
 */
export interface VanillaLiftedBoxInstance {
  /** Update the elevation */
  setElevation: (elevation: number) => void;
  /** Update the light source */
  setLightSource: (source: LightSourceProp) => void;
  /** Update multiple options */
  update: (options: Partial<VanillaLiftedBoxOptions>) => void;
  /** Get current shadow CSS */
  getShadowCSS: () => string;
  /** Remove all shadow styling and cleanup */
  destroy: () => void;
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Position with x and y coordinates.
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Element bounds.
 */
export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Shadow generation options.
 */
export interface ShadowOptions {
  /**
   * Elevation level from -1 (maximum inner shadow) to 1 (maximum drop shadow).
   * @default 0.3
   */
  elevation?: number;
  lightSource?: LightSourceProp;
  background?: string;
  shadowColor?: string;
  shadowColorDark?: string;
  intensity?: number;
  isDarkMode?: boolean;
}

/**
 * Result of shadow generation.
 */
export interface ShadowResult {
  /** Calculated shadow layers */
  layers: ShadowLayerWithColor[];
  /** CSS box-shadow string */
  boxShadow: string;
  /** CSS custom properties */
  cssVariables: Record<string, string>;
}
