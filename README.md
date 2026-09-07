# Hesitation Detector

**The Empathy Layer for Frontend Commerce**

A lightweight JavaScript/React library that detects when users hesitate and enables businesses to react instantly with smart, empathetic offers or hints.

## Project Structure

This is a monorepo containing:

- **`packages/core`** - Framework-agnostic core detection engine ([docs](./packages/core/README.md))
- **`packages/react`** - React hooks ([docs](./packages/react/README.md))
- **`packages/vue`** - Vue 3 composables ([docs](./packages/vue/README.md))
- **`packages/demo`** - Next.js interactive demo application

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [@hesitation-detector/core](./packages/core) | 0.2.0 | Core detection engine (framework-agnostic) |
| [@hesitation-detector/react](./packages/react) | 0.2.0 | React hooks for hesitation detection |
| [@hesitation-detector/vue](./packages/vue) | 0.2.0 | Vue 3 composables for hesitation detection |

## Quick Start

```bash
# Install dependencies
npm install

# Start development (runs Next.js demo)
npm run dev

# Build all packages
npm run build
```

### Install a Single Package

```bash
npm install @hesitation-detector/core     # framework-agnostic
npm install @hesitation-detector/react    # + React hook
npm install @hesitation-detector/vue      # + Vue 3 composable
```

## Features

- 🎯 **Behavioral Tracking**: Hover duration, cursor jitter, refocus count, scroll patterns
- 📊 **Smart Scoring**: Rule-based hesitation score (0-1) with weighted metrics
- ⚛️ **Framework Support**: React hooks and Vue 3 composables
- 🚀 **Production-Ready**: Highly optimized for high-traffic sites
  - Throttled mousemove tracking (60fps max)
  - IntersectionObserver for scroll detection
  - Passive event listeners
  - ~4KB gzipped
- 🔧 **Highly Customizable**: Configurable thresholds, debouncing, and tracking options
- 📦 **Framework-Agnostic Core**: Use with any framework or vanilla JS
- 🎨 **TypeScript Support**: Full type definitions included

## Usage Examples

### React

```tsx
import { useHesitation } from '@hesitation-detector/react';

function ProductButton() {
  const { hesitationLevel, isHovering } = useHesitation('#buy-button');

  return (
    <>
      <button id="buy-button">
        {isHovering ? 'Thinking about it?' : 'Buy Now'}
      </button>
      {hesitationLevel > 0.8 && (
        <div className="offer">You deserve a 5% discount!</div>
      )}
    </>
  );
}
```

### Vue 3

```vue
<script setup>
import { useHesitation } from '@hesitation-detector/vue';

const { hesitationLevel, isHovering } = useHesitation('#buy-button');
</script>

<template>
  <button id="buy-button">
    {{ isHovering ? 'Thinking about it?' : 'Buy Now' }}
  </button>
  <div v-if="hesitationLevel > 0.8" class="offer">
    You deserve a 5% discount!
  </div>
</template>
```

### Vanilla JS

```typescript
import { HesitationDetector } from '@hesitation-detector/core';

const detector = new HesitationDetector('#buy-button', {
  hoverThreshold: 3000,
  refocusThreshold: 2,
}, (state) => {
  if (state.hesitationLevel > 0.8) {
    showOffer();
  }
});

detector.start();
```

### Real-World: Cart Abandonment Prevention

Combine metrics for smarter triggers — e.g. offer live chat only when the user looks confused, not just hesitant:

```tsx
import { useHesitation } from '@hesitation-detector/react';

function CheckoutWithSupport() {
  const { hesitationLevel, metrics } = useHesitation('#checkout-btn');

  const isComparing = metrics.refocusCount >= 3 && metrics.hoverDuration > 5000;
  const isConfused = metrics.cursorJitter > 120;

  return (
    <>
      <button id="checkout-btn">Complete Purchase</button>
      {hesitationLevel > 0.6 && isComparing && (
        <p>Comparing options? Check our <a href="/compare">comparison guide</a>.</p>
      )}
      {isConfused && <button onClick={openLiveChat}>Need help? Chat with us</button>}
    </>
  );
}
```

More patterns (dynamic pricing, A/B testing, multi-step forms, custom scoring) live in [EXAMPLES.md](./EXAMPLES.md).

## Demo

Try the interactive demo to see hesitation detection in action:

```bash
npm run dev
```

Then open [http://localhost:3000/demo](http://localhost:3000/demo) in your browser.

### What the Demo Shows

The demo includes a product page with real-time hesitation tracking:

- **Live Metrics Panel**: See hover duration, refocus count, cursor jitter, and scroll count update in real-time
- **Hesitation Score**: Visual indicator showing the calculated hesitation level (0-100%)
- **Smart Offers**: When hesitation crosses 70%, a contextual discount offer appears automatically
- **Interactive Instructions**: Step-by-step guide to trigger different hesitation signals

### How to Test

1. Hover over the "Add to Cart" button and hold for 2+ seconds
2. Move your cursor in circles while hovering (creates jitter)
3. Leave and return to the button multiple times (increases refocus count)
4. Scroll near the button without clicking
5. Watch the metrics and hesitation score update in real-time

The demo showcases how small behavioral signals can be combined to detect user uncertainty and trigger empathetic UI responses.

## Roadmap

### v0.2 ✨ (Current)
- ✅ Core hesitation detection engine
- ✅ React Hook API (`useHesitation`)
- ✅ Vue 3 Composition API (`useHesitation`)
- ✅ Real-time metric tracking (hover, refocus, jitter, scroll)
- ✅ Configurable thresholds and debouncing
- ✅ Interactive Next.js demo
- ✅ TypeScript strict mode support
- ✅ Performance optimizations for high-traffic sites
  - Throttled mousemove tracking (60fps)
  - IntersectionObserver for scroll detection
  - Passive event listeners
  - Single-pass jitter calculation
- ✅ Enhanced documentation and examples
- ✅ Framework-specific guides (React, Vue)
- 🔄 Additional utility hooks (`useHesitationMetrics`, `useHesitationSuggestion`)

### v1.0 (Q2 2025)
- 📊 Analytics dashboard with visualization
- 🎨 Custom trigger system (define your own hesitation patterns)
- 🔌 Plugin architecture for custom metrics
- 📦 Vanilla JS version (framework-agnostic)
- 🧪 A/B testing integration helpers
- 📈 Aggregate metrics and session replay

### v2.0 (Q3 2025)
- 🤖 AI-based pattern learning (TensorFlow.js)
- 📚 Pre-trained models for common use cases (e-commerce, SaaS, content)
- 🎯 Personalized hesitation thresholds per user
- 🔮 Predictive analytics (predict abandonment before it happens)
- 🌐 Cross-session tracking and insights

### v3.0 (Future)
- 🧩 Low-code rule builder for non-developers
- 📱 Mobile SDK (React Native)
- 🔗 Integrations with major platforms (Shopify, WordPress, etc.)
- 🌍 Multi-language support for global audiences
- 🛡️ Privacy-first mode with local-only processing

## Documentation

- **[Performance Guide](./PERFORMANCE.md)** - Optimization best practices, benchmarks, and profiling
- **[Advanced Examples](./EXAMPLES.md)** - Real-world use cases and integration patterns
- **[Core API](./packages/core/README.md)** - Framework-agnostic core documentation
- **[React Guide](./packages/react/README.md)** - React hooks and examples
- **[Vue Guide](./packages/vue/README.md)** - Vue 3 composables and examples

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
