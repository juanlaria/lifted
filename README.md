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

## Installation

```bash
npm install lifted
```

## Quick Start

### React

```tsx
import { LiftedBox } from 'lifted/react';

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
import { initLiftedBox } from 'lifted/vanilla';

const instance = initLiftedBox(element, {
  elevation: 0.5,
  background: '#FDFDFD',
});

instance.setElevation(-0.2); // Inner shadow
instance.destroy(); // Cleanup
```

## Elevation Values

| Value | Effect |
|-------|--------|
| `-1` | Maximum inner shadow |
| `-0.3` | Standard pressed effect |
| `0` | No shadow |
| `0.3` | Subtle raised card |
| `0.5` | Medium elevation |
| `1` | Maximum floating effect |

## License

MIT © Juan Laria
