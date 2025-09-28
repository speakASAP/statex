# Frontend Architecture Documentation

## 🎯 Overview

The StateX frontend is built with **Next.js 14**, **React 18**, **TypeScript 5**, and **Vitest** testing framework, and **composition-based template system**, focusing on high performance, excellent user experience, and seamless integration with our Fastify backend.

## 📚 Documentation Index

### Core Documentation
- [Frontend Implementation Plan](frontend-implementation-plan.md) - Detailed implementation roadmap
- [Development Plan](../../development-plan.md) - Complete project plan
- [Markdown-First Architecture Plan](markdown-first-architecture-plan.md) - Content architecture and rendering system
- [Frontend Quick Reference](frontend-quick-reference.md) - Quick reference guide
- [Frontend Summary](frontend-summary.md) - High-level overview
- [Testing Documentation](testing.md) - Comprehensive testing guide
- [Testing Guidelines](testing-guidelines.md) - Component testing standards including A/B testing
- [Architecture Documentation](architecture.md) - System architecture details
- [Technology Stack](technology.md) - Complete technology decisions and cost analysis
- [Backend Documentation](backend.md) - Fastify performance optimization

### A/B Testing System
- **[A/B Testing Guide](ab-testing-guide.md)** - Complete A/B testing implementation and usage guide
- [SEO & Analytics](seo.md) - SEO-compliant A/B testing and analytics integration
- [Performance Optimization](optimized-resource-loading-strategy.md) - Performance monitoring for A/B tests

### Template System Documentation
- [Template System Overview](templates/template-system-overview.md) - Complete guide to the modern template system
- [Template Builder Documentation](templates/template-builder.md) - TemplateBuilder pattern and usage
- [Template System Architecture](templates/architecture.md) - Detailed template system architecture
- [Template Testing Guidelines](templates/testing-guidelines.md) - Template system testing strategies

### Design System Documentation
- [Design System Summary](../design/design-system-summary.md) - Design system overview
- [Component Library Documentation](../design/component-library-documentation.md) - Component library guide
- [Brand Guidelines](../design/brand-guidelines.md) - Brand and design guidelines
- [PWA Requirements](pwa-requirements.md) - Progressive Web App features

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   ├── about/              # About pages
│   │   ├── services/           # Service pages
│   │   ├── solutions/          # Solution pages
│   │   ├── contact/            # Contact pages
│   │   ├── legal/              # Legal pages
│   │   └── prototype/          # Prototype pages
│   ├── components/             # React components
│   │   ├── atoms/              # Basic UI components (Button, Input, Text, etc.)
│   │   ├── sections/           # Template-based section components
│   │   │   ├── HeroSection.tsx # Hero section component
│   │   │   ├── FeaturesSection.tsx # Features section component
│   │   │   ├── ProcessSection.tsx # Process section component
│   │   │   ├── PricingSection.tsx # Pricing section component
│   │   │   ├── ContactFormSection.tsx # Contact form section component
│   │   │   ├── TestimonialsSection.tsx # Testimonials section component
│   │   │   ├── HeaderSection.tsx # Header section component
│   │   │   ├── FooterSection.tsx # Footer section component
│   │   │   ├── DynamicSection.tsx # Dynamic section renderer
│   │   │   ├── SectionRegistry.ts # Section component registry
│   │   │   └── types.ts        # Section type definitions
│   │   ├── templates/          # Template system components
│   │   │   ├── TemplateBuilder.ts # Template composition builder
│   │   │   ├── TemplateRenderer.tsx # Template rendering engine
│   │   │   ├── TemplateConfig.ts # Template configuration
│   │   │   ├── SectionRegistry.ts # Section component registry
│   │   │   ├── DynamicSection.tsx # Dynamic section renderer
│   │   │   └── useTemplateBuilder.ts # Template building hook
│   │   └── providers/          # Context providers
│   │       ├── ThemeProvider.tsx # Theme management
│   │       ├── LanguageProvider.tsx # Language management
│   │       └── VariantProvider.tsx # Variant management
│   ├── hooks/                  # Custom React hooks
│   │   ├── useTemplateBuilder.ts # Template building hook
│   │   └── useABTesting.ts     # A/B testing hooks (useABTest, useConversionTracking, etc.)
│   ├── contexts/               # React contexts
│   │   └── ABTestProvider.tsx  # A/B testing context provider
│   ├── config/                 # Configuration files
│   │   ├── abTestConfig.ts     # A/B testing experiments and configuration
│   │   └── componentConfigs.ts # Component-specific configurations for A/B testing
│   ├── types/                  # TypeScript type definitions
│   │   └── templates.ts        # Template system types
│   ├── styles/                 # Global styles
│   │   └── design-tokens.css   # Design tokens
│   ├── themes/                 # Theme definitions
│   │   ├── light.css           # Light theme
│   │   ├── dark.css            # Dark theme
│   │   ├── eu.css              # EU theme
│   │   └── uae.css             # UAE theme
│   └── test/                   # Test configuration
│       └── setup.ts            # Test setup
├── public/                     # Static assets
├── package.json                # Dependencies and scripts
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── vitest.config.mjs           # Vitest configuration
└── tsconfig.json               # TypeScript configuration
```

## 🎨 Template System Architecture

The StateX frontend uses a **modern composition-based template system** that provides:

### Core Features
- **Template Builder Pattern**: Composition-based template creation
- **Dynamic Section Rendering**: Lazy-loaded section components
- **A/B Testing Integration**: Complete experimentation framework with multiple variant combinations
- **Performance Optimization**: Automatic code splitting and lazy loading
- **Type Safety**: Full TypeScript coverage

### A/B Testing System
- **Hero Variants**: 3 different hero messaging approaches (Classic, Benefit-focused, Urgency)
- **Layout Variants**: 2 different section orderings (Standard, Conversion-optimized)
- **Total Combinations**: 6 possible user experiences (3 × 2)
- **Conversion Tracking**: Automatic and manual conversion tracking
- **Development Tools**: Visual A/B test controller for easy testing
- **Production Ready**: SEO-safe, GDPR-compliant, analytics-integrated

**See [A/B Testing Guide](ab-testing-guide.md) for complete implementation details.**
- **Theme Support**: Multi-theme architecture (light, dark, eu, uae)
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance

### Template System Flow
```
Pages → useTemplateBuilder() → TemplateRenderer → DynamicSection → Section Components → Atom Components
```

### Key Components

#### TemplateBuilder
The core template composition engine that allows building complex page layouts through configuration.

```typescript
// TemplateBuilder usage example
const template = useTemplateBuilder()
  .addSection('hero', 'default', {
    title: 'Welcome to StateX',
    subtitle: 'AI-powered development',
    cta: { primary: 'Get Started', secondary: 'Learn More' }
  })
  .addSection('features', 'grid', {
    title: 'Our Features',
    features: [...]
  })
  .build();
```

#### TemplateRenderer
Renders templates with performance optimization and AB testing support.

#### DynamicSection
Handles lazy loading, error boundaries, and variant management for individual sections.

#### SectionRegistry
Manages section component registration and variant resolution.

### Design System with BEM Methodology
```typescript
// BEM methodology with STX prefixing
const designSystem = {
  naming: {
    pattern: 'BEM (Block__Element--Modifier)',
    prefix: 'STX (Statex)',
    examples: [
      'stx-button',
      'stx-button__icon',
      'stx-button--primary',
      'stx-button--large'
    ]
  },
  
  themes: {
    light: 'Light theme with light backgrounds',
    dark: 'Dark theme with dark backgrounds',
    eu: 'EU theme with European styling',
    uae: 'UAE theme with Arabic RTL support'
  },
  
  accessibility: {
    wcag: 'WCAG 2.1 AA compliance',
    aria: 'ARIA attributes for screen readers',
    keyboard: 'Keyboard navigation support',
    contrast: 'High contrast ratios'
  }
};
```
### Section Types
- **Hero**: Landing page hero sections
- **Features**: Feature showcases
- **Process**: Step-by-step processes
- **Pricing**: Pricing plans and tables
- **ContactForm**: Contact forms and prototypes
- **Testimonials**: Customer testimonials
- **Header**: Page headers with navigation
- **Footer**: Page footers with links
- **Blog**: Blog post displays
- **LegalContent**: Legal page content

## 🎯 Technology Stack

### Core Technologies
- **Next.js 14**: Latest App Router, Server Components, optimizations
- **React 18**: Concurrent features, Suspense, modern hooks
- **TypeScript 5**: Strict typing, latest features
- **CSS Modules + Design Tokens**: Scoped styling, theme system
- **Vitest + Testing Library**: Modern testing stack
- **ESLint + Prettier**: Code quality tools

### Template System
- **TemplateBuilder**: Composition-based template creation
- **TemplateRenderer**: Performance-optimized rendering
- **DynamicSection**: Lazy loading and error handling
- **SectionRegistry**: Component registration and management
- **AB Testing**: Built-in experimentation framework

### Performance Features
- **Code Splitting**: Automatic by Next.js
- **Lazy Loading**: Components load on demand
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Built-in tools
- **Caching**: Static generation + ISR
- **CDN Ready**: Static asset optimization

## 🧪 Testing Strategy

### Testing Framework
- **Vitest**: Fast unit testing
- **Testing Library**: Component testing
- **JSDOM**: DOM simulation
- **MSW**: API mocking

### Test Categories
1. **Unit Tests**: Individual component testing
2. **Integration Tests**: Component interaction testing
3. **Template Tests**: Template system testing
4. **AB Testing Tests**: Experiment validation
5. **Performance Tests**: Loading and rendering tests
6. **Accessibility Tests**: WCAG 2.1 AA compliance

### Testing Patterns
- **Component Testing**: Render, structure, props, events, STX classes
- **Template Testing**: Template building, rendering, variants
- **A/B Testing**: Variant selection, conversion tracking, performance impact
- **Cross-Variant Testing**: All 6 A/B test combinations validation
- **Integration Testing**: Multiple experiments working together

**Testing Guidelines**: See [Testing Guidelines](testing-guidelines.md) for comprehensive testing strategies including A/B testing patterns.
- **Performance Testing**: Loading times, bundle sizes, metrics

## 🚀 Development Workflow

### Setup
```bash
cd frontend
npm install
npm run dev
```

### Testing
```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Building
```bash
npm run build         # Production build
npm run start         # Production server
```

### Code Quality
```bash
npm run lint          # ESLint check
npm run lint:fix      # Auto-fix issues
npm run format        # Prettier formatting
```

## 📊 Performance Metrics

### Current Performance
- **Lighthouse Score**: 95+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Optimization Features
- **Code Splitting**: Automatic by Next.js
- **Lazy Loading**: Components load on demand
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Built-in tools
- **Caching**: Static generation + ISR
- **CDN Ready**: Static asset optimization

## 🎨 Design System

### Design Tokens
- **Colors**: Primary, secondary, accent, semantic colors
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Consistent spacing scale
- **Border Radius**: Rounded corner values
- **Shadows**: Elevation and depth
- **Breakpoints**: Responsive design breakpoints

### Component Library
- **Atoms**: Basic UI components (Button, Input, Text, etc.)
- **Sections**: Template-based section components
- **Templates**: Template system components
- **Providers**: Context providers for state management

### Theme System
- **Light Theme**: Default light appearance
- **Dark Theme**: Dark mode support
- **EU Theme**: European market customization
- **UAE Theme**: Middle Eastern market customization

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.statex.cz
NEXT_PUBLIC_AB_TESTING_ENABLED=true
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 📱 Progressive Web App (PWA) Features

### Service Worker Configuration
```typescript
// public/sw.js
const CACHE_NAME = 'statex-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/static/js/bundle.js',
  '/static/css/main.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
```

### PWA Manifest
```json
// public/manifest.json
{
  "name": "Statex AI Prototyping",
  "short_name": "Statex",
  "description": "AI-powered prototype generation platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### A/B Testing Configuration

```typescript
// config/abTestConfig.ts - Current Implementation
export const abTestExperiments = {
  'homepage-hero-variants': {
    variants: [
      { id: 'hero-classic', weight: 33 },
      { id: 'hero-benefit-focused', weight: 33 },
      { id: 'hero-urgency', weight: 34 }
    ],
    isActive: true,
    trafficAllocation: 100
  },
  'homepage-layout-variants': {
    variants: [
      { id: 'layout-standard', weight: 50 },
      { id: 'layout-conversion-optimized', weight: 50 }
    ],
    isActive: true,
    trafficAllocation: 100
  }
};

// Usage in components
import { useABTest } from '@/hooks/useABTesting';

function HomePage({ userId }) {
  const heroTest = useABTest('homepage-hero-variants', userId);
  const layoutTest = useABTest('homepage-layout-variants', userId);
  
  return (
    <div className="homepage">
      <HeroSection variant={heroTest.variantId} />
      {layoutTest.config.sections.map(section => 
        renderSection(section)
      )}
    </div>
  );
}
```

**Complete Guide**: [A/B Testing Guide](ab-testing-guide.md)
```

## 🔗 Quick Navigation for Developers

### **Essential Documentation**
1. **[A/B Testing Guide](ab-testing-guide.md)** - Complete A/B testing usage and implementation
2. **[Testing Guidelines](testing-guidelines.md)** - Testing strategies including A/B test validation
3. **[Template System](templates/)** - Template system documentation and patterns
4. **[Frontend Quick Reference](frontend-quick-reference.md)** - Essential commands and patterns

### **Development Workflow**
1. **Setup**: Run `npm run dev` for development server
2. **A/B Testing**: Visit http://localhost:3000 for visual A/B test controller
3. **Testing**: Use `npm run test` for comprehensive test validation
4. **Performance**: Monitor Core Web Vitals impact with A/B testing

### **Key Implementation Files**
- **A/B Testing Config**: `frontend/src/config/abTestConfig.ts`
- **React Hooks**: `frontend/src/hooks/useABTesting.ts`
- **Template Components**: `frontend/src/components/sections/`
- **Design Tokens**: `frontend/src/styles/design-tokens.css`

## 🌍 Internationalization (i18n)

### Next.js i18n Configuration
```typescript
// next.config.js
module.exports = {
  i18n: {
    locales: ['en', 'de', 'fr', 'it', 'es', 'nl', 'cs', 'pl', 'ru', 'ar'],
    defaultLocale: 'en',
    localeDetection: true,
  },
};
```

## 📈 Monitoring & Analytics

### Performance Monitoring
- Real User Monitoring (RUM) with Web Vitals
- Error tracking with Sentry
- Custom performance metrics
- User behavior analytics (GDPR compliant)

### A/B Testing Setup
- Feature flags for testing different UI variations
- Conversion rate optimization
- CTA button testing
- Form optimization testing

### Web Vitals Tracking
```typescript
// lib/vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to Google Analytics 4
  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_label: metric.id,
    non_interaction: true,
  });
}

export function reportWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

### Animation Performance Best Practices
```typescript
// Optimized CSS animations for 60fps performance
const AnimationConfig = {
  // Use transform and opacity for best performance
  preferredProperties: ['transform', 'opacity'],
  
  // Avoid these properties for animations
  avoidProperties: ['width', 'height', 'top', 'left', 'margin', 'padding'],
  
  // Use will-change for complex animations
  willChange: 'transform, opacity',
  
  // Optimal animation durations
  durations: {
    micro: '150ms',    // Button hovers, small UI changes
    short: '300ms',    // Card hovers, modal transitions
    medium: '500ms',   // Page transitions, complex animations
    long: '1000ms'     // Loading animations, entrance effects
  }
};

// Performance-optimized animation component
export const OptimizedAnimation = ({ children, type = 'fadeIn' }) => {
  const animationClasses = {
    fadeIn: 'animate-fadeIn',
    slideUp: 'animate-slideUp',
    scaleIn: 'animate-scaleIn',
    rotateIn: 'animate-rotateIn'
  };
  
  return (
    <div 
      className={`${animationClasses[type]} will-change-transform`}
      style={{ 
        animationFillMode: 'both',
        animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {children}
    </div>
  );
};
```

## 🔒 Security Considerations

### Content Security Policy
```typescript
// next.config.js
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;
```

### Input Validation
```typescript
// lib/validations.ts
import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  files: z.array(z.instanceof(File)).optional(),
});
```

- **Core Web Vitals**: Real-time monitoring
- **Bundle Analysis**: Regular bundle size tracking
- **Error Tracking**: Error boundary integration
- **User Experience**: Interaction tracking

### AB Testing Analytics
- **Conversion Tracking**: Goal completion rates
- **Engagement Metrics**: Time on page, scroll depth
- **Performance Impact**: Loading time comparison
- **User Behavior**: Interaction patterns

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Docker Deployment
```dockerfile
FROM node:23-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Configuration
- **Development**: Local development with hot reload
- **Staging**: Pre-production testing environment
- **Production**: Live production environment

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Vitest Documentation](https://vitest.dev)

### Best Practices
- [React Best Practices](https://react.dev/learn)
- [Next.js Best Practices](https://nextjs.org/docs/basic-features)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook)
- [Testing Best Practices](https://testing-library.com/docs/guiding-principles)

---

*This documentation reflects the current state of the StateX frontend architecture as of the template system refactoring completion.*

## 🚀 Build & Deployment

### Build Configuration
```typescript
// next.config.js
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    optimizeCss: true,
  },
};
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://api.statex.cz
NEXT_PUBLIC_SITE_URL=https://statex.cz
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
OPENAI_API_KEY=sk-...
```

### Deployment Pipeline
1. **Build**: Next.js production build
2. **Test**: Run all test suites
3. **Security Scan**: Dependency vulnerability check
4. **Deploy**: Upload to production server
5. **Smoke Test**: Basic functionality verification

---

This frontend architecture leverages **Vitest for superior testing performance**, **modern React patterns**, and **seamless Fastify backend integration** to deliver a high-performance, user-friendly AI prototyping platform while supporting the EU market requirements and AI integration features.
