# Advanced Examples

This guide showcases advanced usage patterns and real-world scenarios for Hesitation Detector.

## Table of Contents

- [E-commerce Examples](#e-commerce-examples)
- [SaaS & B2B Examples](#saas--b2b-examples)
- [Analytics Integration](#analytics-integration)
- [A/B Testing](#ab-testing)
- [Multi-Step Forms](#multi-step-forms)
- [Progressive Disclosure](#progressive-disclosure)
- [Cross-Component Communication](#cross-component-communication)
- [Custom Scoring Algorithms](#custom-scoring-algorithms)

## E-commerce Examples

### Dynamic Pricing with Hesitation

Show progressive discounts as hesitation increases:

```tsx
import { useHesitation } from '@hesitation-detector/react';

function DynamicPricingButton() {
  const { hesitationLevel, metrics } = useHesitation('#buy-button');

  const getDiscount = () => {
    if (hesitationLevel < 0.5) return 0;
    if (hesitationLevel < 0.7) return 5;
    if (hesitationLevel < 0.85) return 10;
    return 15;
  };

  const discount = getDiscount();
  const originalPrice = 99;
  const finalPrice = originalPrice * (1 - discount / 100);

  return (
    <>
      <button id="buy-button" className="cta-button">
        Buy Now - ${finalPrice.toFixed(2)}
        {discount > 0 && (
          <span className="discount">
            ({discount}% off - was ${originalPrice})
          </span>
        )}
      </button>

      {hesitationLevel > 0.6 && (
        <p className="urgency">
          This discount expires when you leave this page!
        </p>
      )}
    </>
  );
}
```

### Cart Abandonment Prevention

Detect hesitation on checkout button and offer help:

```tsx
import { useHesitation } from '@hesitation-detector/react';
import { useState } from 'react';

function CheckoutWithSupport() {
  const [showChat, setShowChat] = useState(false);
  const { hesitationLevel, suggestion, metrics } = useHesitation('#checkout-btn');

  // High refocus + high hover = user is comparing/uncertain
  const isComparing = metrics.refocusCount >= 3 && metrics.hoverDuration > 5000;

  // High jitter = confused/nervous
  const isConfused = metrics.cursorJitter > 120;

  return (
    <>
      <button id="checkout-btn" className="checkout-button">
        Proceed to Checkout
      </button>

      {isComparing && (
        <div className="help-banner">
          <h4>Comparing options?</h4>
          <p>We offer free returns within 30 days</p>
          <button onClick={() => setShowChat(true)}>
            Chat with us
          </button>
        </div>
      )}

      {isConfused && !isComparing && (
        <div className="help-banner">
          <h4>Need help?</h4>
          <p>Our support team is here to answer any questions</p>
          <button onClick={() => setShowChat(true)}>
            Start live chat
          </button>
        </div>
      )}

      {hesitationLevel > 0.8 && !showChat && (
        <div className="final-offer">
          <h4>Special Offer!</h4>
          <p>Get 10% off + free shipping if you complete your order now</p>
          <button className="claim-offer">Claim Offer</button>
        </div>
      )}

      {showChat && <LiveChatWidget />}
    </>
  );
}
```

### Product Recommendations Based on Hesitation

```tsx
import { useHesitation } from '@hesitation-detector/react';

function ProductPageWithRecommendations() {
  const buyButton = useHesitation('#buy-now');
  const addToCart = useHesitation('#add-to-cart');

  // High hesitation on main CTA but interest in product
  const shouldShowAlternatives =
    buyButton.hesitationLevel > 0.7 &&
    buyButton.metrics.hoverDuration > 4000;

  // User interacted with both buttons - indecisive
  const isIndecisive =
    buyButton.metrics.refocusCount > 2 &&
    addToCart.metrics.refocusCount > 2;

  return (
    <div className="product-page">
      <div className="product-main">
        <h1>Premium Smartphone - $799</h1>
        <button id="buy-now">Buy Now</button>
        <button id="add-to-cart">Add to Cart</button>
      </div>

      {shouldShowAlternatives && (
        <div className="alternatives">
          <h3>Looking for something else?</h3>
          <AlternativeProducts />
        </div>
      )}

      {isIndecisive && (
        <div className="comparison">
          <h3>Compare Plans</h3>
          <ComparisonTable />
        </div>
      )}
    </div>
  );
}
```

## SaaS & B2B Examples

### Pricing Page Hesitation

Help users choose the right plan:

```tsx
import { useHesitation } from '@hesitation-detector/react';

function PricingTiers() {
  const basic = useHesitation('#basic-plan');
  const pro = useHesitation('#pro-plan');
  const enterprise = useHesitation('#enterprise-plan');

  // Find the plan with highest hesitation
  const mostHesitantPlan = [
    { name: 'Basic', level: basic.hesitationLevel },
    { name: 'Pro', level: pro.hesitationLevel },
    { name: 'Enterprise', level: enterprise.hesitationLevel },
  ].sort((a, b) => b.level - a.level)[0];

  const showHelp = mostHesitantPlan.level > 0.6;

  return (
    <>
      <div className="pricing-grid">
        <PricingCard id="basic-plan" plan="Basic" price={29} />
        <PricingCard id="pro-plan" plan="Pro" price={99} />
        <PricingCard id="enterprise-plan" plan="Enterprise" price="Custom" />
      </div>

      {showHelp && (
        <div className="help-center">
          <h3>Need help choosing {mostHesitantPlan.name}?</h3>
          <div className="help-options">
            <button onClick={() => showComparisonFor(mostHesitantPlan.name)}>
              Compare features
            </button>
            <button onClick={() => startChat()}>
              Chat with sales
            </button>
            <button onClick={() => scheduleDemo()}>
              Schedule a demo
            </button>
          </div>
        </div>
      )}
    </>
  );
}
```

### Trial Signup Optimization

```tsx
import { useHesitation } from '@hesitation-detector/react';

function TrialSignup() {
  const { hesitationLevel, metrics, suggestion } = useHesitation('#start-trial');

  return (
    <>
      <button id="start-trial" className="cta-primary">
        Start Free Trial
      </button>

      {hesitationLevel > 0.4 && hesitationLevel < 0.7 && (
        <ul className="trust-signals">
          <li>✓ No credit card required</li>
          <li>✓ Cancel anytime</li>
          <li>✓ Full access to all features</li>
        </ul>
      )}

      {suggestion === 'help' && (
        <div className="social-proof">
          <h4>Join 10,000+ companies already using our platform</h4>
          <CustomerLogos />
          <TestimonialCarousel />
        </div>
      )}

      {suggestion === 'offer' && (
        <div className="extended-trial">
          <h4>Special Offer!</h4>
          <p>Get 30 days free instead of 14 - just for you</p>
          <button className="claim-extended">Claim 30-Day Trial</button>
        </div>
      )}
    </>
  );
}
```

## Analytics Integration

### Google Analytics

```tsx
import { useHesitation } from '@hesitation-detector/react';
import { useEffect, useRef } from 'react';

function AnalyticsTrackedButton() {
  const { hesitationLevel, metrics, suggestion } = useHesitation('#cta-button');
  const lastSuggestion = useRef<string | null>(null);

  // Track hesitation levels
  useEffect(() => {
    if (hesitationLevel > 0.7 && hesitationLevel !== 0) {
      window.gtag?.('event', 'high_hesitation', {
        event_category: 'hesitation',
        event_label: '#cta-button',
        value: Math.round(hesitationLevel * 100),
        hover_duration: metrics.hoverDuration,
        refocus_count: metrics.refocusCount,
        cursor_jitter: metrics.cursorJitter,
      });
    }
  }, [hesitationLevel > 0.7]);

  // Track suggestion changes
  useEffect(() => {
    if (suggestion && suggestion !== lastSuggestion.current) {
      window.gtag?.('event', 'suggestion_shown', {
        event_category: 'hesitation',
        event_label: suggestion,
        hesitation_level: hesitationLevel,
      });
      lastSuggestion.current = suggestion;
    }
  }, [suggestion]);

  return <button id="cta-button">Call to Action</button>;
}
```

### Segment

```tsx
import { useHesitation } from '@hesitation-detector/react';
import { useEffect } from 'react';

function SegmentTracking() {
  const { hesitationLevel, metrics, suggestion, isHovering } = useHesitation('#purchase-btn');

  // Track hover events
  useEffect(() => {
    if (isHovering) {
      window.analytics?.track('Button Hover Started', {
        element_id: '#purchase-btn',
        page: window.location.pathname,
      });
    } else if (metrics.hoverDuration > 0) {
      window.analytics?.track('Button Hover Ended', {
        element_id: '#purchase-btn',
        hover_duration: metrics.hoverDuration,
        refocus_count: metrics.refocusCount,
        hesitation_level: hesitationLevel,
        suggestion,
      });
    }
  }, [isHovering]);

  // Track high hesitation
  useEffect(() => {
    if (hesitationLevel > 0.8) {
      window.analytics?.track('High Hesitation Detected', {
        element_id: '#purchase-btn',
        hesitation_level: hesitationLevel,
        metrics: {
          hover_duration: metrics.hoverDuration,
          refocus_count: metrics.refocusCount,
          cursor_jitter: metrics.cursorJitter,
          scroll_count: metrics.scrollCount,
        },
      });
    }
  }, [hesitationLevel > 0.8]);

  return <button id="purchase-btn">Purchase</button>;
}
```

## A/B Testing

### With Custom A/B Framework

```tsx
import { useHesitation } from '@hesitation-detector/react';
import { useMemo } from 'react';

function ABTestHesitation() {
  const variant = getABTestVariant('hesitation_test'); // 'control' | 'variant_a' | 'variant_b'

  const config = useMemo(() => {
    switch (variant) {
      case 'control':
        return { hoverThreshold: 3000, refocusThreshold: 2 };
      case 'variant_a':
        // Aggressive: Trigger earlier
        return { hoverThreshold: 2000, refocusThreshold: 1 };
      case 'variant_b':
        // Conservative: Trigger later
        return { hoverThreshold: 5000, refocusThreshold: 3 };
      default:
        return { hoverThreshold: 3000, refocusThreshold: 2 };
    }
  }, [variant]);

  const { hesitationLevel, suggestion } = useHesitation('#buy-button', config);

  // Track conversions
  const handleClick = () => {
    trackABTestConversion('hesitation_test', variant, {
      hesitation_level: hesitationLevel,
      suggestion_shown: suggestion,
    });
    processPurchase();
  };

  return (
    <>
      <button id="buy-button" onClick={handleClick}>
        Buy Now
      </button>
      {suggestion === 'offer' && <OfferBanner variant={variant} />}
    </>
  );
}
```

### With Optimizely

```tsx
import { useHesitation } from '@hesitation-detector/react';
import { useMemo, useEffect } from 'react';

function OptimizelyTest() {
  const optimizely = window.optimizely;
  const experiment = optimizely?.get('state').getExperimentStates()['hesitation_experiment'];
  const variant = experiment?.variation?.key || 'control';

  const config = useMemo(() => ({
    hoverThreshold: variant === 'aggressive' ? 2000 : 3000,
    refocusThreshold: variant === 'aggressive' ? 1 : 2,
  }), [variant]);

  const { hesitationLevel, suggestion } = useHesitation('#cta', config);

  // Track as custom event in Optimizely
  useEffect(() => {
    if (suggestion === 'offer') {
      optimizely?.push({
        type: 'event',
        eventName: 'hesitation_offer_shown',
        tags: {
          hesitation_level: hesitationLevel,
        },
      });
    }
  }, [suggestion]);

  return <button id="cta">Get Started</button>;
}
```

## Multi-Step Forms

### Form Completion Optimization

```tsx
import { useHesitation } from '@hesitation-detector/react';
import { useState } from 'react';

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const { hesitationLevel, metrics } = useHesitation('#next-step-btn');

  const showHelp = hesitationLevel > 0.6 && metrics.refocusCount >= 2;

  return (
    <div className="form-container">
      <FormStep step={step} />

      <button id="next-step-btn" onClick={() => setStep(step + 1)}>
        {step === 3 ? 'Submit' : 'Next Step'}
      </button>

      {showHelp && (
        <div className="form-help">
          <h4>Need help with this step?</h4>
          {step === 1 && <Step1Help />}
          {step === 2 && <Step2Help />}
          {step === 3 && (
            <>
              <SecurityBadges />
              <p>Your information is secure and encrypted</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
```

## Progressive Disclosure

### Show More Information Based on Hesitation

```tsx
import { useHesitation } from '@hesitation-detector/react';

function ProgressiveProductDetails() {
  const { hesitationLevel, metrics } = useHesitation('#learn-more');

  return (
    <div className="product-details">
      <h2>Premium Widget</h2>
      <p className="basic-description">
        The best widget for your needs
      </p>

      {hesitationLevel > 0.3 && (
        <div className="additional-info">
          <h3>Key Features</h3>
          <FeatureList />
        </div>
      )}

      {hesitationLevel > 0.5 && (
        <div className="detailed-specs">
          <h3>Technical Specifications</h3>
          <SpecsTable />
        </div>
      )}

      {hesitationLevel > 0.7 && (
        <div className="social-proof">
          <h3>What Our Customers Say</h3>
          <Reviews />
          <VideoTestimonials />
        </div>
      )}

      <button id="learn-more">Learn More</button>
    </div>
  );
}
```

## Cross-Component Communication

### Share Hesitation State Across Components

```tsx
import { useHesitation } from '@hesitation-detector/react';
import { createContext, useContext } from 'react';

// Create a context for hesitation state
const HesitationContext = createContext(null);

function ProductPage() {
  const hesitationState = useHesitation('#main-cta');

  return (
    <HesitationContext.Provider value={hesitationState}>
      <Header />
      <ProductDetails />
      <CTAButton />
      <Footer />
    </HesitationContext.Provider>
  );
}

function Header() {
  const { hesitationLevel } = useContext(HesitationContext);

  return (
    <header>
      {hesitationLevel > 0.7 && (
        <div className="header-banner">
          🎉 Special offer available - don't miss out!
        </div>
      )}
    </header>
  );
}

function CTAButton() {
  const { isHovering } = useContext(HesitationContext);

  return (
    <button id="main-cta" className={isHovering ? 'pulsing' : ''}>
      Buy Now
    </button>
  );
}

function Footer() {
  const { suggestion, hesitationLevel } = useContext(HesitationContext);

  if (suggestion !== 'offer') return <StandardFooter />;

  return (
    <footer className="sticky-footer">
      <div className="special-offer">
        Get {hesitationLevel > 0.9 ? '20%' : '10%'} off - Limited time!
      </div>
    </footer>
  );
}
```

## Custom Scoring Algorithms

### Industry-Specific Scoring

```tsx
import { useHesitation } from '@hesitation-detector/react';
import { useMemo } from 'react';

function CustomScoringExample() {
  const { metrics, isHovering } = useHesitation('#enterprise-btn');

  // Custom scoring for B2B/Enterprise
  // Weight refocus and hover more heavily than jitter
  const customScore = useMemo(() => {
    const hoverScore = Math.min(metrics.hoverDuration / 5000, 1); // 5s threshold
    const refocusScore = Math.min(metrics.refocusCount / 4, 1);   // 4 refocus threshold
    const scrollScore = Math.min(metrics.scrollCount / 3, 1);      // 3 scroll threshold

    // B2B: Ignore jitter (decision-makers take their time)
    return hoverScore * 0.5 + refocusScore * 0.35 + scrollScore * 0.15;
  }, [metrics]);

  const customSuggestion = useMemo(() => {
    if (customScore >= 0.8) return 'demo';      // Offer demo
    if (customScore >= 0.6) return 'contact';   // Contact sales
    if (customScore >= 0.4) return 'case_study'; // Show case studies
    return null;
  }, [customScore]);

  return (
    <>
      <button id="enterprise-btn">Request Enterprise Quote</button>

      {customSuggestion === 'demo' && (
        <DemoScheduler />
      )}

      {customSuggestion === 'contact' && (
        <ContactSalesForm />
      )}

      {customSuggestion === 'case_study' && (
        <CaseStudies />
      )}
    </>
  );
}
```

### Time-Based Scoring

```tsx
import { useHesitation } from '@hesitation-detector/react';
import { useMemo, useEffect, useState } from 'react';

function TimeBasedHesitation() {
  const [timeOnPage, setTimeOnPage] = useState(0);
  const { hesitationLevel, metrics } = useHesitation('#subscribe-btn');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnPage((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Adjust hesitation based on time spent on page
  const adjustedScore = useMemo(() => {
    let score = hesitationLevel;

    // User spent >2min on page + high hesitation = very interested
    if (timeOnPage > 120 && hesitationLevel > 0.7) {
      score = Math.min(hesitationLevel * 1.2, 1); // Boost score
    }

    // User just arrived (<30s) + hesitation = probably just browsing
    if (timeOnPage < 30 && hesitationLevel > 0.5) {
      score = hesitationLevel * 0.7; // Reduce score
    }

    return score;
  }, [hesitationLevel, timeOnPage]);

  return (
    <>
      <button id="subscribe-btn">Subscribe</button>

      {adjustedScore > 0.8 && timeOnPage > 120 && (
        <div className="premium-offer">
          <h3>You've been reading for a while!</h3>
          <p>Get 3 months free when you subscribe today</p>
        </div>
      )}
    </>
  );
}
```

## Vue Examples

### E-commerce with Vue

```vue
<script setup>
import { useHesitation } from '@hesitation-detector/vue';
import { computed } from 'vue';

const { hesitationLevel, metrics } = useHesitation('#buy-button');

const discountPercent = computed(() => {
  if (hesitationLevel.value < 0.5) return 0;
  if (hesitationLevel.value < 0.7) return 5;
  if (hesitationLevel.value < 0.85) return 10;
  return 15;
});

const originalPrice = 99;
const finalPrice = computed(() =>
  (originalPrice * (1 - discountPercent.value / 100)).toFixed(2)
);
</script>

<template>
  <button id="buy-button" class="cta-button">
    Buy Now - ${{ finalPrice }}
    <span v-if="discountPercent > 0" class="discount">
      ({{ discountPercent }}% off - was ${{ originalPrice }})
    </span>
  </button>

  <p v-if="hesitationLevel > 0.6" class="urgency">
    This discount expires when you leave this page!
  </p>
</template>
```

## License

MIT
