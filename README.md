# Hesitation Detector

**The Empathy Layer for Frontend Commerce**

A lightweight JavaScript/React library that detects when users hesitate and enables businesses to react instantly with smart, empathetic offers or hints.

## Project Structure

This is a monorepo containing:

- **`packages/core`** - Core hesitation detection library (TypeScript + React)
- **`packages/demo`** - Next.js demo application showcasing the library

## Quick Start

```bash
# Install dependencies
npm install

# Start development (runs Next.js demo)
npm run dev

# Build all packages
npm run build
```

## Features

- 🎯 Tracks micro-behaviors: hover duration, cursor jitter, refocus count, scroll patterns
- 📊 Computes hesitation score (0-1) using rule-based heuristics
- ⚛️ React hooks for easy integration
- 🚀 Lightweight and performant
- 🔧 Highly customizable triggers and thresholds

## Usage Example

```tsx
import { useHesitation } from "hesitation-detector";

function ProductButton() {
  const { hesitationLevel } = useHesitation("#buy-button");

  if (hesitationLevel > 0.8) {
    return <Offer>You deserve a 5% discount!</Offer>;
  }

  return <button id="buy-button">Buy Now</button>;
}
```

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

### Current: v0.1 ✨
- ✅ Core hesitation detection engine
- ✅ React Hook API (`useHesitation`)
- ✅ Real-time metric tracking (hover, refocus, jitter, scroll)
- ✅ Configurable thresholds and debouncing
- ✅ Interactive Next.js demo

### v0.2 (Coming Soon)
- 🔄 TypeScript strict mode support
- 🔄 Additional utility hooks (`useHesitationMetrics`, `useHesitationSuggestion`)
- 🔄 Vue.js adapter
- 🔄 Performance optimizations for high-traffic sites
- 🔄 Enhanced documentation and examples

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

## License

MIT
