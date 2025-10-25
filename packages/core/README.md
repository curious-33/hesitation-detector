# hesitation-detector

A lightweight React library for detecting user hesitation and enabling empathy-driven UI.

## Installation

```bash
npm install hesitation-detector
# or
yarn add hesitation-detector
```

## Quick Start

```tsx
import { useHesitation } from 'hesitation-detector';

function ProductButton() {
  const { hesitationLevel, isHovering, metrics } = useHesitation('#buy-button');

  if (hesitationLevel > 0.8) {
    return (
      <div>
        <button id="buy-button">Buy Now - $500</button>
        <div className="offer">
          🎉 Special offer: 5% discount just for you!
        </div>
      </div>
    );
  }

  return <button id="buy-button">Buy Now - $500</button>;
}
```

## API Reference

### Hooks

#### `useHesitation(selector, config?)`

Primary React hook that tracks hesitation on a specific element.

**Parameters:**

- `selector` (string): CSS selector for the target element (e.g., `'#buy-button'`, `'.cta-link'`)
- `config` (optional): Configuration object
  - `hoverThreshold` (number): Hover duration threshold in milliseconds (default: `3000`)
  - `jitterThreshold` (number): Cursor movement variance threshold (default: `100`)
  - `refocusThreshold` (number): Number of re-hovers to consider high hesitation (default: `2`)
  - `trackScroll` (boolean): Enable scroll tracking near the element (default: `true`)
  - `debounceMs` (number): Debounce time for score updates in milliseconds (default: `100`)

**Returns:** `HesitationResult`

```typescript
interface HesitationResult {
  hesitationLevel: number       // Score from 0 (no hesitation) to 1 (high hesitation)
  metrics: BehaviorMetrics      // Raw behavioral data
  isHovering: boolean           // Whether user is currently hovering
  suggestion: 'offer' | 'help' | 'compare' | null  // Recommended action
}
```

**Example:**

```tsx
const { hesitationLevel, metrics, isHovering, suggestion } = useHesitation(
  '#checkout-button',
  {
    hoverThreshold: 5000,    // 5 seconds
    refocusThreshold: 3,     // Trigger after 3 re-visits
  }
);

// Use the suggestion
if (suggestion === 'offer') {
  return <DiscountBanner />;
}

// Or use custom logic
if (hesitationLevel > 0.6 && metrics.refocusCount > 2) {
  return <HelpTooltip />;
}
```

### Types

#### `HesitationConfig`

Configuration options for hesitation detection.

```typescript
interface HesitationConfig {
  selector: string              // CSS selector for target element
  hoverThreshold?: number       // Hover duration threshold in ms (default: 3000)
  jitterThreshold?: number      // Cursor movement variance (default: 100)
  refocusThreshold?: number     // Re-hover count threshold (default: 2)
  trackScroll?: boolean         // Enable scroll tracking (default: true)
  debounceMs?: number          // Update debounce time in ms (default: 100)
}
```

#### `BehaviorMetrics`

Raw behavioral metrics collected during tracking.

```typescript
interface BehaviorMetrics {
  hoverDuration: number         // Total hover time in milliseconds
  refocusCount: number          // Number of times cursor returned to element
  cursorJitter: number          // Cursor movement variance (higher = more erratic)
  scrollCount: number           // Number of scroll events near the element
  firstInteractionTime: number  // Timestamp of first interaction
  lastInteractionTime: number   // Timestamp of last interaction
}
```

#### `HesitationResult`

Result object returned by the `useHesitation` hook.

```typescript
interface HesitationResult {
  hesitationLevel: number                           // 0-1 score
  metrics: BehaviorMetrics                          // Raw metrics
  isHovering: boolean                               // Current hover state
  suggestion: 'offer' | 'help' | 'compare' | null  // Action suggestion
}
```

**Suggestion Meanings:**
- `'offer'` - High hesitation (≥0.8): Show discount or special offer
- `'help'` - Medium-high hesitation (≥0.6): Provide assistance or FAQ
- `'compare'` - Medium hesitation (≥0.4): Show comparison or alternatives
- `null` - Low hesitation (<0.4): No intervention needed

### Utility Functions

#### `calculateHesitationScore(metrics, config)`

Calculates the hesitation score from behavioral metrics.

**Parameters:**
- `metrics` (BehaviorMetrics): Raw behavioral data
- `config` (Required<HesitationConfig>): Configuration with all values set

**Returns:** `number` (0-1)

**Algorithm:**
```
score = (hoverScore × 0.4) + (refocusScore × 0.3) + (jitterScore × 0.2) + (scrollScore × 0.1)

where:
  hoverScore = min(hoverDuration / hoverThreshold, 1)
  refocusScore = min(refocusCount / refocusThreshold, 1)
  jitterScore = min(cursorJitter / jitterThreshold, 1)
  scrollScore = min(scrollCount / 5, 1)
```

**Example:**

```typescript
import { calculateHesitationScore } from 'hesitation-detector';

const score = calculateHesitationScore(
  {
    hoverDuration: 4000,
    refocusCount: 3,
    cursorJitter: 150,
    scrollCount: 2,
    firstInteractionTime: 1234567890,
    lastInteractionTime: 1234567900,
  },
  {
    selector: '#btn',
    hoverThreshold: 3000,
    jitterThreshold: 100,
    refocusThreshold: 2,
    trackScroll: true,
    debounceMs: 100,
  }
);
// Returns: ~0.78
```

#### `calculateCursorJitter(positions)`

Calculates cursor movement variance from position history.

**Parameters:**
- `positions` (Array<{x: number, y: number, timestamp: number}>): Array of cursor positions

**Returns:** `number` - Standard deviation of cursor speed (higher = more jitter)

#### `getSuggestion(hesitationLevel)`

Maps hesitation level to a recommended action.

**Parameters:**
- `hesitationLevel` (number): Score from 0-1

**Returns:** `'offer' | 'help' | 'compare' | null`

**Mapping:**
- `≥ 0.8` → `'offer'`
- `≥ 0.6` → `'help'`
- `≥ 0.4` → `'compare'`
- `< 0.4` → `null`

#### `mergeConfig(config)`

Merges user config with defaults.

**Parameters:**
- `config` (HesitationConfig): Partial configuration

**Returns:** `Required<HesitationConfig>` - Complete config with all values set

## Advanced Usage

### Multiple Elements

Track hesitation on multiple elements independently:

```tsx
function ProductPage() {
  const buyButton = useHesitation('#buy-now');
  const learnMore = useHesitation('#learn-more-link');

  return (
    <>
      <button id="buy-now">Buy Now</button>
      {buyButton.hesitationLevel > 0.7 && <PriceDropAlert />}

      <a id="learn-more-link">Learn More</a>
      {learnMore.hesitationLevel > 0.5 && <VideoDemo />}
    </>
  );
}
```

### Custom Scoring Logic

Use raw metrics for custom hesitation detection:

```tsx
const { metrics, isHovering } = useHesitation('#cta-button');

// Custom logic: Trigger only if user hovers long AND returns multiple times
const showOffer =
  metrics.hoverDuration > 4000 &&
  metrics.refocusCount >= 3 &&
  metrics.cursorJitter < 50;  // Low jitter = deliberate, not confused

if (showOffer) {
  return <CustomOffer />;
}
```

### Conditional Tracking

Enable/disable scroll tracking based on viewport:

```tsx
const isMobile = window.innerWidth < 768;

const { hesitationLevel } = useHesitation('#signup-form', {
  trackScroll: !isMobile,  // Disable scroll tracking on mobile
  hoverThreshold: isMobile ? 1000 : 3000,  // Lower threshold on mobile
});
```

### Analytics Integration

Send hesitation data to your analytics platform:

```tsx
import { useHesitation } from 'hesitation-detector';
import { trackEvent } from './analytics';

function CheckoutButton() {
  const { hesitationLevel, metrics, suggestion } = useHesitation('#checkout');

  useEffect(() => {
    if (suggestion === 'offer') {
      trackEvent('high_hesitation_detected', {
        level: hesitationLevel,
        refocusCount: metrics.refocusCount,
        hoverDuration: metrics.hoverDuration,
      });
    }
  }, [suggestion]);

  // ... render logic
}
```

## How It Works

The library tracks four key behavioral signals:

1. **Hover Duration** - How long the user hovers over the element
   - Long hovers (>3s by default) indicate consideration or uncertainty

2. **Refocus Count** - How many times they return to the element
   - Multiple returns suggest comparison or doubt

3. **Cursor Jitter** - Erratic mouse movement variance
   - High jitter indicates nervousness or uncertainty
   - Calculated as standard deviation of cursor speed

4. **Scroll Patterns** - Scrolling near the element without clicking
   - Suggests the user is searching for more information

These signals are combined using a weighted formula to produce a hesitation score (0-1):

```
score = (hover × 0.4) + (refocus × 0.3) + (jitter × 0.2) + (scroll × 0.1)
```

The weights prioritize hover duration and refocus count as the strongest indicators of hesitation.

## Best Practices

### Performance

- Use `debounceMs` to control update frequency (default: 100ms)
- Higher values reduce CPU usage but decrease responsiveness
- For high-traffic sites, consider `debounceMs: 200` or higher

### Threshold Tuning

Start with defaults and adjust based on your use case:

- **E-commerce**: Lower thresholds (faster triggers) for impulse purchases
- **B2B/SaaS**: Higher thresholds (users need time to consider)
- **Content sites**: Focus on scroll patterns over hover

### A/B Testing

Test different intervention strategies:

```tsx
const variant = getABTestVariant();

const { hesitationLevel } = useHesitation('#cta', {
  hoverThreshold: variant === 'aggressive' ? 2000 : 4000,
});
```

### Privacy & Consent

The library tracks only anonymous behavioral data. No PII is collected. However:

- Inform users if you're using behavioral tracking
- Respect Do Not Track preferences if applicable
- Consider GDPR/CCPA requirements for your jurisdiction

## TypeScript Support

This library is written in TypeScript and includes full type definitions. All types are exported:

```typescript
import type {
  HesitationConfig,
  HesitationResult,
  BehaviorMetrics,
  MouseTrackingState,
} from 'hesitation-detector';
```

## License

MIT
