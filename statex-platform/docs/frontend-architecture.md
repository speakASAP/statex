# Frontend Architecture

## Overview

The Statex platform frontend is designed for maximum performance, SEO optimization, and AI agent compatibility. It features a responsive, mobile-first design with advanced personalization, A/B testing capabilities, and multi-language support including RTL languages like Arabic.

## Design Principles

### Performance First
- **Core Web Vitals Optimization**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Lighthouse Score**: 95+ across all metrics
- **Mobile Performance**: 90+ mobile performance score
- **Bundle Size**: < 200KB initial JavaScript bundle
- **Image Optimization**: WebP/AVIF with lazy loading
- **Critical CSS**: Inlined critical styles, deferred non-critical CSS

### SEO Optimization
- **Semantic HTML**: Proper heading hierarchy, ARIA labels
- **Meta Tags**: Dynamic meta descriptions, Open Graph, Twitter Cards
- **Structured Data**: JSON-LD schema markup
- **Sitemap**: Auto-generated XML sitemaps
- **Robots.txt**: Optimized for search engine crawling
- **Page Speed**: < 3s load time on 3G networks

### AI Agent Compatibility
- **Dual Content Delivery**: HTML for humans, Markdown for AI agents
- **Clean Markdown**: No styling, pure text content
- **Structured Data**: Machine-readable content format
- **API Endpoints**: Dedicated AI-friendly content APIs
- **Content Versioning**: Versioned content for AI consumption

## Technology Stack

### Core Framework
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **React Query**: Server state management
- **Zustand**: Client state management

### Performance Tools
- **Vercel Analytics**: Real-time performance monitoring
- **Web Vitals**: Core Web Vitals tracking
- **Bundle Analyzer**: Bundle size optimization
- **Lighthouse CI**: Automated performance testing
- **Image Optimization**: Next.js Image component with optimization

### Internationalization
- **next-intl**: Internationalization framework
- **ICU Message Format**: Advanced i18n features
- **RTL Support**: Right-to-left language support
- **Locale Detection**: Automatic language detection
- **Dynamic Imports**: Locale-specific code splitting

## Architecture Components

### 1. Content Management System

#### Static Site Generation (SSG)
```typescript
// pages/[...slug].tsx
export async function getStaticPaths() {
  const content = await getAllContent();
  return {
    paths: content.map(item => ({
      params: { slug: item.slug.split('/') }
    })),
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params, locale }) {
  const content = await getContentBySlug(params.slug.join('/'), locale);
  const aiContent = await getAIContentBySlug(params.slug.join('/'));
  
  return {
    props: {
      content,
      aiContent,
      locale,
      seo: generateSEO(content, locale)
    },
    revalidate: 3600 // 1 hour
  };
}
```

#### Dual Content Delivery
```typescript
// components/ContentRenderer.tsx
interface ContentRendererProps {
  content: Content;
  userAgent: 'human' | 'ai';
  locale: string;
}

export function ContentRenderer({ content, userAgent, locale }: ContentRendererProps) {
  if (userAgent === 'ai') {
    return <AIContentRenderer content={content.aiContent} />;
  }
  
  return <HumanContentRenderer content={content} locale={locale} />;
}

// AI Content Renderer - Pure Markdown
function AIContentRenderer({ content }: { content: AIContent }) {
  return (
    <div className="ai-content">
      <h1>{content.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content.markdown }} />
      <div className="metadata">
        <p>Language: {content.language}</p>
        <p>Last Updated: {content.updatedAt}</p>
        <p>Content ID: {content.id}</p>
      </div>
    </div>
  );
}
```

### 2. Personalization Engine

#### User Detection and Theming
```typescript
// hooks/usePersonalization.ts
export function usePersonalization() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    const detectUserProfile = async () => {
      const profile = await detectUserProfile();
      setUserProfile(profile);
      applyPersonalization(profile);
    };
    
    detectUserProfile();
  }, []);
  
  return { userProfile, applyTheme, applyLanguage };
}

// utils/userDetection.ts
export async function detectUserProfile(): Promise<UserProfile> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language;
  const country = await detectCountry();
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const localTime = new Date().toLocaleTimeString();
  
  return {
    timezone,
    language,
    country,
    theme: isDarkMode ? 'dark' : 'light',
    localTime,
    deviceType: detectDeviceType(),
    connectionSpeed: await detectConnectionSpeed()
  };
}
```

#### Theme Management
```typescript
// components/ThemeProvider.tsx
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { userProfile } = usePersonalization();
  const [theme, setTheme] = useState<Theme>('light');
  
  useEffect(() => {
    if (userProfile) {
      const themeConfig = generateThemeConfig(userProfile);
      setTheme(themeConfig);
      applyTheme(themeConfig);
    }
  }, [userProfile]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### 3. A/B Testing System

#### AI-Driven A/B Testing
```typescript
// components/ABTestProvider.tsx
interface ABTestConfig {
  testId: string;
  variants: Variant[];
  trafficAllocation: number;
  aiOptimization: boolean;
  humanApproval: boolean;
}

export function ABTestProvider({ children }: { children: React.ReactNode }) {
  const [activeTests, setActiveTests] = useState<ABTest[]>([]);
  
  useEffect(() => {
    const loadActiveTests = async () => {
      const tests = await getActiveABTests();
      setActiveTests(tests);
    };
    
    loadActiveTests();
  }, []);
  
  return (
    <ABTestContext.Provider value={{ activeTests, trackConversion }}>
      {children}
    </ABTestContext.Provider>
  );
}

// AI A/B Test Management
export class AIABTestManager {
  async createTest(config: ABTestConfig): Promise<ABTest> {
    // AI generates test variants
    const variants = await this.aiGenerateVariants(config);
    
    // Human approval required
    const approvedVariants = await this.requestHumanApproval(variants);
    
    // Deploy test
    return await this.deployTest({
      ...config,
      variants: approvedVariants
    });
  }
  
  async optimizeTest(testId: string): Promise<void> {
    const test = await this.getTest(testId);
    const performance = await this.analyzeTestPerformance(testId);
    
    // AI optimization
    const optimizedVariants = await this.aiOptimizeVariants(test, performance);
    
    // Human approval for changes
    const approvedChanges = await this.requestHumanApproval(optimizedVariants);
    
    // Apply optimizations
    await this.applyOptimizations(testId, approvedChanges);
  }
}
```

#### Variant Management
```typescript
// components/ABTestVariant.tsx
interface ABTestVariantProps {
  testId: string;
  variantId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ABTestVariant({ testId, variantId, children, fallback }: ABTestVariantProps) {
  const { activeTests, trackConversion } = useABTest();
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    const test = activeTests.find(t => t.id === testId);
    if (test && test.activeVariant === variantId) {
      setIsActive(true);
      trackConversion(testId, 'view');
    }
  }, [activeTests, testId, variantId, trackConversion]);
  
  if (!isActive) return fallback || null;
  
  return <>{children}</>;
}
```

### 4. Multi-Language Support

#### Internationalization Setup
```typescript
// i18n/config.ts
export const locales = [
  'en', 'cs', 'sk', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ar', 'zh', 'ja', 'ko'
] as const;

export const rtlLocales = ['ar', 'he', 'fa', 'ur'] as const;

export const defaultLocale = 'en';

export const localeConfig = {
  en: { name: 'English', flag: '🇺🇸', dir: 'ltr' },
  cs: { name: 'Čeština', flag: '🇨🇿', dir: 'ltr' },
  ar: { name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  // ... other locales
};

// next.config.js
const nextConfig = {
  i18n: {
    locales: locales,
    defaultLocale: 'en',
    localeDetection: true
  },
  experimental: {
    appDir: true
  }
};
```

#### RTL Support
```typescript
// components/RTLProvider.tsx
export function RTLProvider({ children, locale }: { children: React.ReactNode; locale: string }) {
  const isRTL = rtlLocales.includes(locale as any);
  
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [isRTL, locale]);
  
  return (
    <div className={isRTL ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
}

// styles/rtl.css
.rtl {
  direction: rtl;
  text-align: right;
}

.rtl .flex {
  flex-direction: row-reverse;
}

.rtl .ml-4 {
  margin-left: 0;
  margin-right: 1rem;
}
```

### 5. Performance Optimization

#### Image Optimization
```typescript
// components/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export function OptimizedImage({ src, alt, priority, sizes, quality = 75 }: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      priority={priority}
      sizes={sizes}
      quality={quality}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      className="transition-opacity duration-300"
      onLoad={() => console.log('Image loaded')}
    />
  );
}
```

#### Code Splitting
```typescript
// components/LazyComponent.tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded" />,
  ssr: false
});

export function LazyComponent() {
  return <HeavyComponent />;
}
```

#### Critical CSS
```typescript
// styles/critical.css
/* Critical CSS - Inlined in HTML */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 1rem;
}

/* Non-critical CSS - Loaded asynchronously */
@import url('./non-critical.css') screen and (min-width: 768px);
```

### 6. SEO Optimization

#### Meta Tags Management
```typescript
// components/SEOHead.tsx
interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url: string;
  locale: string;
  type?: 'website' | 'article';
}

export function SEOHead({ title, description, keywords, image, url, locale, type = 'website' }: SEOHeadProps) {
  const fullTitle = `${title} | Statex Platform`;
  const fullUrl = `https://statex.cz${url}`;
  const fullImage = image ? `https://statex.cz${image}` : 'https://statex.cz/og-image.jpg';
  
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords?.join(', ')} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content={locale} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Statex Platform",
            "url": fullUrl,
            "description": description,
            "inLanguage": locale,
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${fullUrl}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
    </Head>
  );
}
```

#### Sitemap Generation
```typescript
// pages/sitemap.xml.tsx
export async function getServerSideProps({ res }) {
  const content = await getAllContent();
  const locales = await getSupportedLocales();
  
  const sitemap = generateSitemap(content, locales);
  
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
  
  return { props: {} };
}

function generateSitemap(content: Content[], locales: string[]): string {
  const baseUrl = 'https://statex.cz';
  const urls = content.flatMap(item => 
    locales.map(locale => ({
      loc: `${baseUrl}/${locale}${item.slug}`,
      lastmod: item.updatedAt,
      changefreq: 'weekly',
      priority: item.priority
    }))
  );
  
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.map(url => `
        <url>
          <loc>${url.loc}</loc>
          <lastmod>${url.lastmod}</lastmod>
          <changefreq>${url.changefreq}</changefreq>
          <priority>${url.priority}</priority>
        </url>
      `).join('')}
    </urlset>`;
}
```

### 7. AI Agent Content API

#### AI-Friendly Content Endpoints
```typescript
// pages/api/content/[slug]/ai.ts
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  
  const content = await getAIContent(params.slug, locale);
  
  if (!content) {
    return new Response('Not Found', { status: 404 });
  }
  
  return new Response(JSON.stringify(content), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

// AI Content Format
interface AIContent {
  id: string;
  slug: string;
  title: string;
  content: string; // Pure markdown
  language: string;
  updatedAt: string;
  metadata: {
    wordCount: number;
    readingTime: number;
    topics: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
  };
  structuredData: {
    headings: Array<{ level: number; text: string; id: string }>;
    links: Array<{ text: string; url: string }>;
    images: Array<{ alt: string; src: string }>;
  };
}
```

#### Content Versioning for AI
```typescript
// utils/aiContentVersioning.ts
export class AIContentVersionManager {
  async getContentVersion(slug: string, locale: string, version?: string): Promise<AIContent> {
    if (version) {
      return await this.getSpecificVersion(slug, locale, version);
    }
    
    return await this.getLatestVersion(slug, locale);
  }
  
  async getContentHistory(slug: string, locale: string): Promise<ContentVersion[]> {
    return await this.getVersionHistory(slug, locale);
  }
  
  async createContentSnapshot(content: Content): Promise<ContentVersion> {
    const snapshot = {
      id: generateId(),
      contentId: content.id,
      version: content.version,
      content: this.sanitizeForAI(content),
      createdAt: new Date().toISOString(),
      checksum: this.calculateChecksum(content)
    };
    
    await this.storeVersion(snapshot);
    return snapshot;
  }
  
  private sanitizeForAI(content: Content): string {
    // Remove all HTML tags, styles, scripts
    // Convert to pure markdown
    // Remove tracking pixels, analytics
    // Clean up whitespace
    return this.convertToMarkdown(content);
  }
}
```

## Deployment Configuration

### Docker Configuration
```dockerfile
# Dockerfile.frontend
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder
COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Kubernetes Deployment
```yaml
# frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: statex-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: statex/frontend:latest
        ports:
        - containerPort: 80
        env:
        - name: NODE_ENV
          value: production
        - name: NEXT_PUBLIC_API_URL
          value: https://api.statex.cz
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
```

## Performance Monitoring

### Core Web Vitals Tracking
```typescript
// utils/analytics.ts
export function trackWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    // Send to analytics
    gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true
    });
  }
}

// pages/_app.tsx
export function reportWebVitals(metric: any) {
  trackWebVitals(metric);
}
```

### A/B Testing Analytics
```typescript
// utils/abTesting.ts
export function trackABTestConversion(testId: string, variantId: string, conversion: string) {
  gtag('event', 'ab_test_conversion', {
    test_id: testId,
    variant_id: variantId,
    conversion_type: conversion,
    event_category: 'A/B Testing'
  });
}
```

This frontend architecture ensures maximum performance, SEO optimization, and AI agent compatibility while providing a seamless user experience across all devices and languages.
