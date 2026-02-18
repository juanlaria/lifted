# Lifted

Beautiful, realistic CSS shadows with layered depth.

Inspired by [Josh Comeau's "Designing Beautiful Shadows"](https://www.joshwcomeau.com/css/designing-shadows/) and [Tobias Ahlin's "Smoother & sharper shadows"](https://tobiasahlin.com/blog/layered-smooth-box-shadows/).

## Features

- **Layered shadows** using powers-of-2 technique for realistic depth
- **Continuous elevation** (-1 to 1) with smooth interpolation
- **Inner shadows** - negative elevation creates inset/pressed effects
- **Dynamic light source** - static angles or mouse/cursor tracking
- **Color-matched shadows** - automatically derives shadow color from background
- **Dark mode support** - automatic detection + manual override
- **Framework agnostic** - works with React, vanilla JS, or any framework
- **Next.js App Router compatible** - includes "use client" directives

## Installation

```bash
npm install @juanlaria/lifted
```

## Quick Start

### React

```tsx
import { LiftedBox } from '@juanlaria/lifted/react';

// Raised card
<LiftedBox elevation={0.5} background="#FDFDFD">
  Card content
</LiftedBox>

// Pressed/inset effect
<LiftedBox elevation={-0.3} background="#F5F5F5">
  Pressed button
</LiftedBox>

// Mouse-tracking light
<LiftedBox elevation={0.6} lightSource="mouse">
  Dynamic shadows!
</LiftedBox>
```

### Vanilla JavaScript

```javascript
import { initLiftedBox } from '@juanlaria/lifted/vanilla';

const instance = initLiftedBox(element, {
  elevation: 0.5,
  background: '#FDFDFD',
});

instance.setElevation(-0.2); // Inner shadow
instance.destroy(); // Cleanup
```

## API Reference

### LiftedBox Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `elevation` | `number` | `0.3` | Elevation level from `-1` (max inner shadow) to `1` (max drop shadow). Negative = inset, zero = none, positive = raised. |
| `as` | `keyof JSX.IntrinsicElements` | `'div'` | HTML element to render as (`'div'`, `'section'`, `'button'`, etc.). |
| `lightSource` | `number \| 'mouse' \| 'ambient' \| LightSource` | `-45` | Light source configuration. Number = angle in degrees, `'mouse'` = follows cursor, `'ambient'` = even shadow on all sides. |
| `background` | `string` | — | Background color (CSS). Used to auto-calculate shadow color. |
| `shadowColor` | `string` | — | Manual shadow color override (CSS color). |
| `shadowColorDark` | `string` | — | Shadow color for dark mode when using auto-detect. |
| `intensity` | `number` | `1` | Shadow opacity multiplier. `0.5` = lighter, `1` = normal, `2` = darker. |
| `scale` | `number` | `1` | Shadow size multiplier. `0.5` = smaller/contained (~8px max), `1` = default (~16px max), `2` = larger/dramatic (~32px max). |
| `animated` | `boolean` | `true` | Whether to animate shadow changes with transitions. Automatically disabled when using `lightSource="mouse"` for smooth tracking. |
| `transitionDuration` | `number` | `150` | Transition duration in milliseconds. |
| `children` | `React.ReactNode` | — | Content to render inside the component. |

Plus all standard HTML div attributes (`className`, `style`, `onClick`, etc.).

### Light Source Options

```tsx
// Static angle (degrees, -180 to 180)
// -45 = top-left, 0 = left, 45 = top-right, 90 = top
<LiftedBox lightSource={-45} />

// Mouse tracking (follows cursor)
<LiftedBox lightSource="mouse" />

// Full configuration object
<LiftedBox
  lightSource={{
    type: 'mouse',
    fallbackAngle: -45,  // Angle when mouse unavailable (default: -45)
  }}
/>

// Custom controlled angle
<LiftedBox
  lightSource={{
    type: 'custom',
    angle: myAngleState,
  }}
/>

// Ambient light - even shadow on all edges (no directional offset)
// Great for "detaching" elements from their container
<LiftedBox lightSource="ambient" elevation={0.5} />
```

### Elevation Values

| Value | Effect |
|-------|--------|
| `-1` | Maximum inner shadow (deeply pressed) |
| `-0.5` | Medium inner shadow |
| `-0.3` | Subtle pressed effect |
| `0` | No shadow |
| `0.3` | Subtle raised card |
| `0.5` | Medium elevation |
| `0.75` | High elevation (modals, dropdowns) |
| `1` | Maximum floating effect |

### Vanilla JS API

#### `initLiftedBox(element, options)`

Initializes shadow on a DOM element.

```typescript
const instance = initLiftedBox(element, {
  elevation: 0.5,
  lightSource: -45,
  background: '#FFFFFF',
  shadowColor: undefined,      // Auto-calculated from background
  shadowColorDark: undefined,  // For dark mode
  intensity: 1,
  animated: true,
  transitionDuration: 150,
  isDarkMode: false,
});
```

#### Instance Methods

| Method | Description |
|--------|-------------|
| `setElevation(n)` | Update elevation (`-1` to `1`) |
| `setLightSource(source)` | Update light source |
| `update(options)` | Update multiple options at once |
| `getShadowCSS()` | Get current `box-shadow` CSS string |
| `destroy()` | Remove shadows and cleanup listeners |

### Utility Functions

```typescript
import {
  generateBoxShadow,
  applyLift,
  removeLift,
  getLiftCSS
} from '@juanlaria/lifted/vanilla';

// Generate CSS string directly
const css = generateBoxShadow(0.5, { background: '#FFF' });
// → "0.7px 0.7px 1px hsl(...)..."

// Apply shadow to element (one-time, no instance)
applyLift(element, 0.5, { background: '#FFF' });

// Remove shadow from element
removeLift(element);

// Get CSS without applying
const shadowCSS = getLiftCSS(0.5, { background: '#FFF' });
```

### Presets

```typescript
import { ELEVATION_PRESETS } from '@juanlaria/lifted';

// Available presets:
ELEVATION_PRESETS.deepInset  // -0.75
ELEVATION_PRESETS.inset      // -0.3
ELEVATION_PRESETS.none       // 0
ELEVATION_PRESETS.subtle     // 0.15
ELEVATION_PRESETS.small      // 0.25
ELEVATION_PRESETS.medium     // 0.5
ELEVATION_PRESETS.large      // 0.75
ELEVATION_PRESETS.xlarge     // 1
```

### Hooks (React)

```typescript
import { useElevation, useDarkMode } from '@juanlaria/lifted/react';

// Interactive elevation with hover/active states
const { elevation, elevationProps } = useElevation({
  base: 0.3,    // Default state
  hover: 0.5,   // On hover
  active: -0.1, // On click (inner shadow!)
});

<LiftedBox elevation={elevation} {...elevationProps}>
  Interactive card
</LiftedBox>

// Dark mode detection (SSR-safe)
const isDark = useDarkMode();
```

## TypeScript

Full TypeScript support included. Key types:

```typescript
import type {
  LiftedBoxProps,
  LightSource,
  LightSourceProp,
  VanillaLiftedBoxOptions,
  VanillaLiftedBoxInstance,
  ShadowOptions,
  ShadowResult,
} from '@juanlaria/lifted';
```

## License

MIT © Juan Laria
