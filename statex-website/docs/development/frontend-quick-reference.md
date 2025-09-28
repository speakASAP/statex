# Frontend Quick Reference

## 🚀 Quick Start

### Environment Setup
```bash
# Switch to development environment
./scripts/switch_env.sh development

# Check environment status
ls -la .env
source .env && echo "DEBUG: $DEBUG, BASE_URL: $BASE_URL"
```

### Development Commands
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
frontend/src/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── atoms/              # Basic UI components (Button, Input, Text, etc.)
│   ├── sections/           # Template-based section components
│   ├── templates/          # Template system components
│   └── providers/          # Context providers
├── hooks/                  # Custom React hooks
├── contexts/               # React contexts
├── config/                 # Configuration files
├── types/                  # TypeScript type definitions
├── styles/                 # Global styles
├── themes/                 # Theme definitions
└── test/                   # Test configuration
```

## 🎨 Template System

### Core Components
- **TemplateBuilder**: Composition-based template creation
- **TemplateRenderer**: Performance-optimized rendering
- **DynamicSection**: Lazy loading and error handling
- **SectionRegistry**: Component registration and management

### Template System Flow
```
Pages → useTemplateBuilder() → TemplateRenderer → DynamicSection → Section Components → Atom Components
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

## 🧪 Testing

### Run Tests
```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Test Categories
1. **Unit Tests**: Individual component testing
2. **Integration Tests**: Component interaction testing
3. **Template Tests**: Template system testing
4. **AB Testing Tests**: Experiment validation
5. **Performance Tests**: Loading and rendering tests
6. **Accessibility Tests**: WCAG 2.1 AA compliance

### Testing Patterns
- **Component Testing**: Render, structure, props, events
- **Template Testing**: Template building, rendering, variants
- **AB Testing**: Variant selection, analytics, performance
- **Performance Testing**: Loading times, bundle sizes, metrics


## 📊 **Performance Targets**
- **LCP**: <2.5s
- **FID**: <100ms  
- **CLS**: <0.1
- **Bundle Size**: <500KB
- **Lighthouse**: 90+

## 📱 **Breakpoints**
```css
sm: 640px    /* Mobile landscape */
md: 768px    /* Tablet */
lg: 1024px   /* Desktop */
xl: 1280px   /* Large desktop */
2xl: 1536px  /* Extra large */
```

## 🌐 **Multi-Language**
```typescript
// URL structure: /[country]-[lang]/[path]
// Examples:
/cz-cs/services/web-development
/en-us/about
/de-de/contact
```

## 🤖 **AI Integration Points**
- **Text Input**: Real-time chat interface
- **Voice Input**: Microphone recording component
- **File Upload**: Document analysis component
- **Chat History**: Context-aware responses

## 🔍 **SEO Requirements**
- Meta tags on all pages
- Structured data (JSON-LD)
- Open Graph tags
- Twitter Cards
- Hreflang for multi-language
- Sitemap generation

## 🎯 Performance

### Core Web Vitals Targets
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Lighthouse Score**: 95+ across all metrics

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

## 🔧 Development

### Build Commands
```bash
npm run build         # Production build
npm run start         # Production server
npm run lint          # ESLint check
npm run lint:fix      # Auto-fix issues
npm run format        # Prettier formatting
```

### Environment Variables
```typescript
// Import environment utilities
import { env, getFullUrl, getEmailLink } from '@/config/env';

// Environment status
const isDebug = env.DEBUG;           // true in development, false in production
const baseUrl = env.BASE_URL;        // localhost:3000 or statex.cz

// URL generation
const apiUrl = getFullUrl('/api/data');
const contactUrl = getFullUrl('/contact');

// Email links
const emailLink = getEmailLink('contact@statex.cz', 'Support Request');
```

### Environment Switching
```bash
# Development (DEBUG=true, localhost URLs)
./scripts/switch_env.sh development

# Production (DEBUG=false, production URLs)
./scripts/switch_env.sh production
```

### Environment Files
- `frontend/.env.development` - Development configuration
- `frontend/.env.production` - Production configuration
- `frontend/src/config/env.ts` - Environment utility functions

### Docker Production Deployment
```bash
# Deploy frontend container
docker compose -f docker-compose.production.yml up -d frontend

# Build and deploy all containers
docker compose -f docker-compose.production.yml up -d --build

# Check frontend container health
docker compose -f docker-compose.production.yml ps frontend
```

### AB Testing Configuration
```typescript
// config/experiments.ts
export const experiments = {
  'hero-variant': {
    variants: ['default', 'video', 'split'],
    traffic: 0.5
  },
  'pricing-layout': {
    variants: ['cards', 'table', 'toggle'],
    traffic: 0.3
  }
};
```

## 📊 Monitoring

### Performance Monitoring
- **Core Web Vitals**: Real-time monitoring
- **Bundle Analysis**: Regular bundle size tracking
- **Error Tracking**: Error boundary integration
- **User Experience**: Interaction tracking

### AB Testing Analytics
- **Conversion Tracking**: Goal completion rates
- **Engagement Metrics**: Time on page, scroll depth
- **Performance Impact**: Loading time comparison
- **User Behavior**: Interaction patterns

## 🔗 Integration

### Backend Integration
- **API Client**: Type-safe API communication
- **Authentication**: NextAuth.js integration
- **Real-time**: WebSocket connections
- **File Upload**: Multipart form handling

### External Services
- **Analytics**: Google Analytics 4
- **Error Tracking**: Sentry integration
- **CDN**: Cloudflare for static assets
- **Email**: SendGrid for notifications

## 📚 Documentation

### Core Documentation
- [Frontend Implementation Plan](frontend-implementation-plan.md)
- [Template System Overview](templates/template-system-overview.md)
- [Testing Documentation](testing.md)
- [Architecture Documentation](architecture.md)

### Component Documentation
- [Design System Summary](../design/design-system-summary.md)
- [Component Library](../design/component-library-documentation.md)
- [Brand Guidelines](../design/brand-guidelines.md)

---

*This quick reference reflects the current state of the StateX frontend as of the template system refactoring completion.* 