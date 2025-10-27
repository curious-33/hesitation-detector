# @hesitation-detector/react

React hooks for detecting user hesitation and enabling empathy-driven UI.

## Installation

```bash
npm install @hesitation-detector/react
# or
yarn add @hesitation-detector/react
# or
pnpm add @hesitation-detector/react
```

## Quick Start

```tsx
import { useHesitation } from '@hesitation-detector/react';

function ProductButton() {
  const { hesitationLevel, isHovering } = useHesitation('#buy-button');

  return (
    <>
      <button id="buy-button">
        {isHovering ? 'Thinking about it?' : 'Add to Cart'}
      </button>

      {hesitationLevel > 0.7 && (
        <div className="offer">
          Special offer: Get 5% off right now!
        </div>
      )}
    </>
  );
}
```

## API Reference

### `useHesitation(selector, config?)`

Primary React hook that tracks hesitation on a specific element.

#### Parameters

- **`selector`** (string): CSS selector for the target element (e.g., `'#buy-button'`, `'.cta-link'`)
- **`config`** (optional): Configuration object
  - `hoverThreshold` (number): Hover duration threshold in ms (default: `3000`)
  - `jitterThreshold` (number): Cursor movement variance threshold (default: `100`)
  - `refocusThreshold` (number): Number of re-hovers to consider high hesitation (default: `2`)
  - `trackScroll` (boolean): Enable scroll tracking near the element (default: `true`)
  - `debounceMs` (number): Debounce time for score updates in ms (default: `100`)

#### Returns

```typescript
{
  hesitationLevel: number;      // 0-1 score (0 = no hesitation, 1 = high)
  metrics: BehaviorMetrics;     // Raw behavioral data
  isHovering: boolean;          // Currently hovering over element
  suggestion: 'offer' | 'help' | 'compare' | null;  // Recommended action
}
```

#### Suggestion Meanings

- `'offer'` - High hesitation (≥0.8): Show discount or special offer
- `'help'` - Medium-high hesitation (≥0.6): Provide assistance or FAQ
- `'compare'` - Medium hesitation (≥0.4): Show comparison or alternatives
- `null` - Low hesitation (<0.4): No intervention needed

## Examples

### Basic Usage with Suggestions

```tsx
import { useHesitation } from '@hesitation-detector/react';

function CheckoutButton() {
  const { hesitationLevel, suggestion, metrics } = useHesitation('#checkout-btn');

  const renderSuggestion = () => {
    switch (suggestion) {
      case 'offer':
        return <DiscountBanner message="10% off if you buy now!" />;
      case 'help':
        return <LiveChatPrompt />;
      case 'compare':
        return <ComparisonTable />;
      default:
        return null;
    }
  };

  return (
    <>
      <button id="checkout-btn">Proceed to Checkout</button>
      {renderSuggestion()}
    </>
  );
}
```

### Custom Configuration

```tsx
const { hesitationLevel } = useHesitation('#cta-button', {
  hoverThreshold: 5000,    // Trigger after 5 seconds
  refocusThreshold: 3,     // Require 3 re-visits
  trackScroll: false,      // Disable scroll tracking
  debounceMs: 200,         // Update every 200ms
});
```

### Multiple Elements

Track hesitation on multiple elements independently:

```tsx
function ProductPage() {
  const buyButton = useHesitation('#buy-now');
  const learnMore = useHesitation('#learn-more');
  const addToCart = useHesitation('#add-to-cart');

  return (
    <>
      <button id="buy-now">Buy Now</button>
      {buyButton.hesitationLevel > 0.7 && <PriceDropAlert />}

      <a id="learn-more">Learn More</a>
      {learnMore.suggestion === 'help' && <VideoTutorial />}

      <button id="add-to-cart">Add to Cart</button>
      {addToCart.isHovering && <QuickPreview />}
    </>
  );
}
```

### Custom Scoring Logic

Use raw metrics for custom hesitation detection:

```tsx
function CustomHesitationLogic() {
  const { metrics, isHovering } = useHesitation('#special-offer-btn');

  // Custom logic: High hover + multiple refocus + low jitter = serious consideration
  const showSpecialOffer =
    metrics.hoverDuration > 4000 &&
    metrics.refocusCount >= 3 &&
    metrics.cursorJitter < 50;  // Low jitter = deliberate, not confused

  return (
    <>
      <button id="special-offer-btn">Subscribe Now</button>
      {showSpecialOffer && (
        <div className="special-offer">
          You seem interested! Here's an exclusive 20% discount.
        </div>
      )}
    </>
  );
}
```

### Analytics Integration

Send hesitation data to your analytics platform:

```tsx
import { useHesitation } from '@hesitation-detector/react';
import { useEffect } from 'react';

function AnalyticsExample() {
  const { hesitationLevel, metrics, suggestion } = useHesitation('#checkout');

  useEffect(() => {
    // Track high hesitation events
    if (suggestion === 'offer') {
      window.analytics?.track('high_hesitation_detected', {
        element: '#checkout',
        level: hesitationLevel,
        refocusCount: metrics.refocusCount,
        hoverDuration: metrics.hoverDuration,
        cursorJitter: metrics.cursorJitter,
      });
    }
  }, [suggestion, hesitationLevel, metrics]);

  // ... render logic
}
```

### Conditional Tracking by Device

```tsx
import { useHesitation } from '@hesitation-detector/react';
import { useState, useEffect } from 'react';

function ResponsiveHesitation() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const { hesitationLevel } = useHesitation('#cta', {
    trackScroll: !isMobile,  // Disable scroll tracking on mobile
    hoverThreshold: isMobile ? 1000 : 3000,  // Lower threshold on mobile
  });

  // ... render logic
}
```

### Progressive Intervention

Show increasingly helpful content as hesitation grows:

```tsx
function ProgressiveHelp() {
  const { hesitationLevel, metrics } = useHesitation('#pricing-cta');

  return (
    <>
      <button id="pricing-cta">Choose Plan</button>

      {hesitationLevel > 0.3 && (
        <p className="hint">All plans include 14-day free trial</p>
      )}

      {hesitationLevel > 0.5 && (
        <div className="comparison">
          <ComparisonChart />
        </div>
      )}

      {hesitationLevel > 0.7 && (
        <div className="help-modal">
          <h3>Need help choosing?</h3>
          <button>Chat with sales</button>
          <button>See customer stories</button>
        </div>
      )}
    </>
  );
}
```

### A/B Testing Integration

```tsx
import { useHesitation } from '@hesitation-detector/react';

function ABTestExample() {
  const variant = getABTestVariant(); // 'control' | 'aggressive' | 'conservative'

  const config = {
    control: { hoverThreshold: 3000, refocusThreshold: 2 },
    aggressive: { hoverThreshold: 2000, refocusThreshold: 1 },
    conservative: { hoverThreshold: 5000, refocusThreshold: 3 },
  }[variant];

  const { hesitationLevel } = useHesitation('#buy-button', config);

  // Track which variant converts better
  useEffect(() => {
    if (hesitationLevel > 0.7) {
      trackABTestEvent('hesitation_triggered', { variant });
    }
  }, [hesitationLevel, variant]);

  // ... render logic
}
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import { useHesitation } from '@hesitation-detector/react';
import type {
  HesitationConfig,
  HesitationResult,
  BehaviorMetrics,
  MouseTrackingState,
} from '@hesitation-detector/core';

const result: HesitationResult = useHesitation('#button', {
  hoverThreshold: 3000,
} as HesitationConfig);
```

### Type Definitions

```typescript
interface BehaviorMetrics {
  hoverDuration: number;         // Total hover time in milliseconds
  refocusCount: number;          // Number of times cursor returned to element
  cursorJitter: number;          // Cursor movement variance (higher = more erratic)
  scrollCount: number;           // Number of scroll sessions near the element
  firstInteractionTime: number;  // Timestamp of first interaction
  lastInteractionTime: number;   // Timestamp of last interaction
}

interface HesitationResult {
  hesitationLevel: number;                           // 0-1 score
  metrics: BehaviorMetrics;                          // Raw metrics
  isHovering: boolean;                               // Current hover state
  suggestion: 'offer' | 'help' | 'compare' | null;  // Action suggestion
}
```

## How It Works

The library tracks four key behavioral signals:

1. **Hover Duration** (40% weight)
   - Measures time spent hovering over the element
   - Long hovers indicate consideration or uncertainty

2. **Refocus Count** (30% weight)
   - Counts how many times user returns to the element
   - Multiple returns suggest comparison or doubt

3. **Cursor Jitter** (20% weight)
   - Measures erratic mouse movement (speed variance)
   - High jitter indicates nervousness or uncertainty

4. **Scroll Patterns** (10% weight)
   - Tracks scrolling near the element without clicking
   - Suggests user is searching for more information

These signals are combined into a weighted score:

```
score = (hover × 0.4) + (refocus × 0.3) + (jitter × 0.2) + (scroll × 0.1)
```

## Performance

The library is highly optimized for production use:

- **Throttled mousemove tracking** - Processes events at 60fps max
- **IntersectionObserver for scroll** - No layout thrashing from getBoundingClientRect
- **Passive event listeners** - Non-blocking, smooth interactions
- **Efficient jitter calculation** - Single-pass variance algorithm
- **Small bundle size** - ~4KB gzipped

### Performance Best Practices

1. **Use appropriate debounce timing**
   ```tsx
   // High-traffic site: reduce update frequency
   const result = useHesitation('#btn', { debounceMs: 200 });
   ```

2. **Disable scroll tracking when not needed**
   ```tsx
   // Save CPU if scroll patterns aren't important
   const result = useHesitation('#btn', { trackScroll: false });
   ```

3. **Memoize config objects to prevent detector recreation**
   ```tsx
   const config = useMemo(() => ({
     hoverThreshold: 3000,
     refocusThreshold: 2,
   }), []); // Empty deps - config won't change

   const result = useHesitation('#btn', config);
   ```

## Best Practices

### Threshold Tuning

Start with defaults and adjust based on your use case:

- **E-commerce**: Lower thresholds for impulse purchases
  ```tsx
  { hoverThreshold: 2000, refocusThreshold: 1 }
  ```

- **B2B/SaaS**: Higher thresholds (users need time to consider)
  ```tsx
  { hoverThreshold: 5000, refocusThreshold: 3 }
  ```

- **Content sites**: Focus on scroll patterns
  ```tsx
  { trackScroll: true, hoverThreshold: 4000 }
  ```

### Privacy & Consent

- The library tracks only anonymous behavioral data
- No PII is collected
- All tracking happens client-side
- Consider adding a privacy notice if required by your jurisdiction

## React Compatibility

- **React 16.8+**: Hooks support required
- **React 17**: Fully supported
- **React 18**: Fully supported (including concurrent features)
- **Next.js**: Works with both Pages Router and App Router

### Next.js App Router Example

```tsx
'use client'; // Required for client components

import { useHesitation } from '@hesitation-detector/react';

export default function ProductPage() {
  const { hesitationLevel } = useHesitation('#buy-now');

  return (
    <>
      <button id="buy-now">Buy Now</button>
      {hesitationLevel > 0.7 && <SpecialOffer />}
    </>
  );
}
```

## License

MIT

## Related Packages

- [@hesitation-detector/core](../core) - Core detection engine (framework-agnostic)
- [@hesitation-detector/vue](../vue) - Vue 3 composables

## Support

- [GitHub Issues](https://github.com/yourusername/hesitation-detector/issues)
- [Documentation](https://github.com/yourusername/hesitation-detector)
