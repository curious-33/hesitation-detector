# @hesitation-detector/vue

Vue 3 composables for detecting user hesitation and enabling empathy-driven UI.

## Installation

```bash
npm install @hesitation-detector/vue
# or
yarn add @hesitation-detector/vue
# or
pnpm add @hesitation-detector/vue
```

## Quick Start

```vue
<script setup>
import { useHesitation } from '@hesitation-detector/vue';

const { hesitationLevel, isHovering } = useHesitation('#buy-button');
</script>

<template>
  <button id="buy-button">
    {{ isHovering ? 'Thinking about it?' : 'Add to Cart' }}
  </button>

  <div v-if="hesitationLevel > 0.7" class="offer">
    Special offer: Get 5% off right now!
  </div>
</template>
```

## API Reference

### `useHesitation(selector, config?)`

Primary Vue composable that tracks hesitation on a specific element.

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
  hesitationLevel: Ref<number>;      // 0-1 score (0 = no hesitation, 1 = high)
  metrics: Reactive<BehaviorMetrics>; // Raw behavioral data
  isHovering: Ref<boolean>;          // Currently hovering over element
  suggestion: Ref<'offer' | 'help' | 'compare' | null>;  // Recommended action
}
```

#### Suggestion Meanings

- `'offer'` - High hesitation (≥0.8): Show discount or special offer
- `'help'` - Medium-high hesitation (≥0.6): Provide assistance or FAQ
- `'compare'` - Medium hesitation (≥0.4): Show comparison or alternatives
- `null` - Low hesitation (<0.4): No intervention needed

## Examples

### Basic Usage with Suggestions

```vue
<script setup>
import { useHesitation } from '@hesitation-detector/vue';

const { hesitationLevel, suggestion, metrics } = useHesitation('#checkout-btn');
</script>

<template>
  <button id="checkout-btn">Proceed to Checkout</button>

  <DiscountBanner v-if="suggestion === 'offer'" />
  <LiveChatPrompt v-if="suggestion === 'help'" />
  <ComparisonTable v-if="suggestion === 'compare'" />
</template>
```

### Custom Configuration

```vue
<script setup>
import { useHesitation } from '@hesitation-detector/vue';

const { hesitationLevel } = useHesitation('#cta-button', {
  hoverThreshold: 5000,    // Trigger after 5 seconds
  refocusThreshold: 3,     // Require 3 re-visits
  trackScroll: false,      // Disable scroll tracking
  debounceMs: 200,         // Update every 200ms
});
</script>

<template>
  <button id="cta-button">Call to Action</button>
  <SpecialOffer v-if="hesitationLevel > 0.8" />
</template>
```

### Multiple Elements

Track hesitation on multiple elements independently:

```vue
<script setup>
import { useHesitation } from '@hesitation-detector/vue';

const buyButton = useHesitation('#buy-now');
const learnMore = useHesitation('#learn-more');
const addToCart = useHesitation('#add-to-cart');
</script>

<template>
  <button id="buy-now">Buy Now</button>
  <PriceDropAlert v-if="buyButton.hesitationLevel > 0.7" />

  <a id="learn-more">Learn More</a>
  <VideoTutorial v-if="learnMore.suggestion === 'help'" />

  <button id="add-to-cart">Add to Cart</button>
  <QuickPreview v-if="addToCart.isHovering" />
</template>
```

### Custom Scoring Logic

Use raw metrics for custom hesitation detection:

```vue
<script setup>
import { useHesitation } from '@hesitation-detector/vue';
import { computed } from 'vue';

const { metrics, isHovering } = useHesitation('#special-offer-btn');

// Custom logic: High hover + multiple refocus + low jitter = serious consideration
const showSpecialOffer = computed(() =>
  metrics.hoverDuration > 4000 &&
  metrics.refocusCount >= 3 &&
  metrics.cursorJitter < 50  // Low jitter = deliberate, not confused
);
</script>

<template>
  <button id="special-offer-btn">Subscribe Now</button>
  <div v-if="showSpecialOffer" class="special-offer">
    You seem interested! Here's an exclusive 20% discount.
  </div>
</template>
```

### Analytics Integration

Send hesitation data to your analytics platform:

```vue
<script setup>
import { useHesitation } from '@hesitation-detector/vue';
import { watch } from 'vue';

const { hesitationLevel, metrics, suggestion } = useHesitation('#checkout');

watch(suggestion, (newSuggestion) => {
  if (newSuggestion === 'offer') {
    window.analytics?.track('high_hesitation_detected', {
      element: '#checkout',
      level: hesitationLevel.value,
      refocusCount: metrics.refocusCount,
      hoverDuration: metrics.hoverDuration,
      cursorJitter: metrics.cursorJitter,
    });
  }
});
</script>

<template>
  <button id="checkout">Checkout</button>
</template>
```

### Reactive Metrics Display

Show live metrics during hover:

```vue
<script setup>
import { useHesitation } from '@hesitation-detector/vue';

const { hesitationLevel, metrics, isHovering } = useHesitation('#product-btn');
</script>

<template>
  <button id="product-btn">View Product</button>

  <div v-if="isHovering" class="metrics-panel">
    <h4>Live Metrics</h4>
    <p>Hesitation: {{ (hesitationLevel * 100).toFixed(0) }}%</p>
    <p>Hover Time: {{ (metrics.hoverDuration / 1000).toFixed(1) }}s</p>
    <p>Refocus Count: {{ metrics.refocusCount }}</p>
    <p>Cursor Jitter: {{ metrics.cursorJitter.toFixed(1) }}</p>
  </div>
</template>
```

### Conditional Tracking by Device

```vue
<script setup>
import { useHesitation } from '@hesitation-detector/vue';
import { ref, onMounted } from 'vue';

const isMobile = ref(false);

onMounted(() => {
  isMobile.value = window.innerWidth < 768;
});

const { hesitationLevel } = useHesitation('#cta', {
  trackScroll: !isMobile.value,
  hoverThreshold: isMobile.value ? 1000 : 3000,
});
</script>

<template>
  <button id="cta">Call to Action</button>
  <MobileOffer v-if="isMobile && hesitationLevel > 0.6" />
  <DesktopOffer v-if="!isMobile && hesitationLevel > 0.7" />
</template>
```

### Progressive Intervention

Show increasingly helpful content as hesitation grows:

```vue
<script setup>
import { useHesitation } from '@hesitation-detector/vue';

const { hesitationLevel, metrics } = useHesitation('#pricing-cta');
</script>

<template>
  <button id="pricing-cta">Choose Plan</button>

  <p v-if="hesitationLevel > 0.3" class="hint">
    All plans include 14-day free trial
  </p>

  <div v-if="hesitationLevel > 0.5" class="comparison">
    <ComparisonChart />
  </div>

  <div v-if="hesitationLevel > 0.7" class="help-modal">
    <h3>Need help choosing?</h3>
    <button>Chat with sales</button>
    <button>See customer stories</button>
  </div>
</template>
```

### Computed Properties with Hesitation Data

```vue
<script setup>
import { useHesitation } from '@hesitation-detector/vue';
import { computed } from 'vue';

const { hesitationLevel, metrics } = useHesitation('#subscribe-btn');

const hesitationCategory = computed(() => {
  if (hesitationLevel.value > 0.8) return 'high';
  if (hesitationLevel.value > 0.5) return 'medium';
  if (hesitationLevel.value > 0.2) return 'low';
  return 'none';
});

const offerMessage = computed(() => {
  switch (hesitationCategory.value) {
    case 'high': return '20% off - Limited time!';
    case 'medium': return 'Free shipping on this item';
    case 'low': return 'Join 10,000+ happy customers';
    default: return null;
  }
});
</script>

<template>
  <button id="subscribe-btn">Subscribe</button>
  <div v-if="offerMessage" class="offer" :class="hesitationCategory">
    {{ offerMessage }}
  </div>
</template>
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import { useHesitation } from '@hesitation-detector/vue';
import type {
  HesitationConfig,
  BehaviorMetrics,
  MouseTrackingState,
} from '@hesitation-detector/core';
import type { Ref } from 'vue';

// All return values are typed
const {
  hesitationLevel,  // Ref<number>
  metrics,          // Reactive<BehaviorMetrics>
  isHovering,       // Ref<boolean>
  suggestion,       // Ref<'offer' | 'help' | 'compare' | null>
} = useHesitation('#button', {
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
   ```vue
   <script setup>
   // High-traffic site: reduce update frequency
   const result = useHesitation('#btn', { debounceMs: 200 });
   </script>
   ```

2. **Disable scroll tracking when not needed**
   ```vue
   <script setup>
   // Save CPU if scroll patterns aren't important
   const result = useHesitation('#btn', { trackScroll: false });
   </script>
   ```

3. **Define config outside setup to prevent recreation**
   ```vue
   <script setup>
   const config = {
     hoverThreshold: 3000,
     refocusThreshold: 2,
   };

   const result = useHesitation('#btn', config);
   </script>
   ```

## Best Practices

### Threshold Tuning

Start with defaults and adjust based on your use case:

- **E-commerce**: Lower thresholds for impulse purchases
  ```vue
  <script setup>
  const result = useHesitation('#btn', {
    hoverThreshold: 2000,
    refocusThreshold: 1
  });
  </script>
  ```

- **B2B/SaaS**: Higher thresholds (users need time to consider)
  ```vue
  <script setup>
  const result = useHesitation('#btn', {
    hoverThreshold: 5000,
    refocusThreshold: 3
  });
  </script>
  ```

- **Content sites**: Focus on scroll patterns
  ```vue
  <script setup>
  const result = useHesitation('#btn', {
    trackScroll: true,
    hoverThreshold: 4000
  });
  </script>
  ```

### Privacy & Consent

- The library tracks only anonymous behavioral data
- No PII is collected
- All tracking happens client-side
- Consider adding a privacy notice if required by your jurisdiction

## Vue Compatibility

- **Vue 3.0+**: Composition API required
- **Vue 2**: Not supported (use @hesitation-detector/core directly)
- **Nuxt 3**: Fully supported

### Nuxt 3 Example

```vue
<!-- pages/product.vue -->
<script setup>
import { useHesitation } from '@hesitation-detector/vue';

const { hesitationLevel } = useHesitation('#buy-now');
</script>

<template>
  <div>
    <button id="buy-now">Buy Now</button>
    <SpecialOffer v-if="hesitationLevel > 0.7" />
  </div>
</template>
```

## Composables Reference

### Main Composable

- **`useHesitation(selector, config?)`** - Primary hesitation detection composable

### Additional Composables (Coming Soon)

- **`useHesitationMetrics(selector, config?)`** - Returns only metrics (lighter weight)
- **`useHesitationSuggestion(selector, config?)`** - Returns only suggestion
- **`useHesitationDebug(selector, config?)`** - Debug mode with console logging

## License

MIT

## Related Packages

- [@hesitation-detector/core](../core) - Core detection engine (framework-agnostic)
- [@hesitation-detector/react](../react) - React hooks

## Support

- [GitHub Issues](https://github.com/yourusername/hesitation-detector/issues)
- [Documentation](https://github.com/yourusername/hesitation-detector)
