# SEO-Optimized AB Testing System for Statex

## 🎯 Architecture for Multiple Frontend Systems

### Problems we solve:
1. **SEO**: Structured data, micromarkup, Core Web Vitals
2. **AB Testing**: Variant isolation without mixing
3. **Performance**: Minimal size of each variant
4. **Scalability**: Easy addition of new themes/variants

---

## 🏗️ Modular Architecture

### File Structure:
```
/src/
  /variants/                    # AB test variants
    /variant-a/                 # Main design
      /components/
        hero.scss
        services.scss
        animations.scss
      /assets/
        hero-bg-a.webp
        icons-set-a.svg
      manifest.json             # Variant metadata
    /variant-b/                 # Alternative design
      /components/
        hero.scss
        services.scss
        animations.scss
      /assets/
        hero-bg-b.webp
        icons-set-b.svg
      manifest.json
    /variant-dark/              # Dark theme
      /components/
        hero.scss
        services.scss
      manifest.json
  /shared/                      # Shared components
    /base/
      reset.scss
      typography.scss
      utilities.scss
    /seo/
      structured-data.js
      meta-tags.js
      analytics.js
  /system/                      # Management system
    variant-loader.js
    seo-injector.js
    performance-monitor.js
```

### Variant Manifest:
```json
// /variants/variant-a/manifest.json
{
  "id": "variant-a",
  "name": "Original Design",
  "description": "Hero-focused design with blue gradients",
  "version": "1.0.0",
  "target": "eu-market",
  "performance": {
    "criticalCSS": 8.5,        // KB
    "totalCSS": 24.2,          // KB
    "images": 156.8,           // KB
    "totalSize": 189.5         // KB
  },
  "seo": {
    "structuredData": true,
    "microdata": true,
    "coreWebVitals": "green",
    "accessibility": "wcag-aa"
  },
  "files": {
    "critical": [
      "components/hero.scss",
      "assets/hero-bg-a-critical.webp"
    ],
    "deferred": [
      "components/services.scss",
      "components/animations.scss",
      "assets/hero-bg-a-full.webp"
    ]
  },
  "analytics": {
    "conversionGoals": ["hero-cta", "service-inquiry"],
    "testHypothesis": "Blue gradient hero increases conversions"
  }
}
```

---

## 🔍 SEO Optimization

### Improved Structured Data for animations:
```html
  <!-- Basic HTML with SEO optimizations -->
<section class="stx-hero stx-variant-{VARIANT_ID}" 
         itemscope itemtype="https://schema.org/WebPageElement"
         data-variant="{VARIANT_ID}"
         data-test-name="{TEST_NAME}"
         data-seo-section="hero">

  <!-- Structured Data for each variant -->
  <script type="application/ld+json" data-variant-schema>
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Statex",
    "description": "AI-powered rapid prototyping services",
    "url": "https://statex.cz",
    "sameAs": [
      "https://linkedin.com/company/statex",
      "https://github.com/statex"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "AI Development Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Prototype Development",
            "description": "24-48 hour AI-powered prototyping",
            "provider": "Statex"
          }
        }
      ]
    }
  }
  </script>

  <!-- Preload critical resources by variant -->
  <link rel="preload" 
        href="/variants/{VARIANT_ID}/assets/hero-bg-critical.webp" 
        as="image" 
        data-variant-critical>
  <link rel="preload" 
        href="/variants/{VARIANT_ID}/components/hero.css" 
        as="style" 
        data-variant-critical>

  <!-- Animated elements with SEO attributes -->
  <div class="stx-bg-grid" 
       role="presentation" 
       aria-hidden="true"
       data-animation="grid-move"
       data-performance="gpu-accelerated"></div>

  <div class="stx-anim-float stx-shape-square" 
       role="presentation" 
       aria-hidden="true"
       data-animation="float"
       data-animation-delay="0s"
       data-accessibility="decorative"></div>

  <!-- Main content with micromarkup -->
  <div class="hero-content" itemprop="mainContentOfPage">
    <h1 class="hero-title" 
        itemprop="headline"
        data-analytics="hero-title"
        data-test-element="primary-headline">
      AI-Powered Rapid Prototyping
    </h1>
    
    <p class="hero-subtitle" 
       itemprop="description"
       data-analytics="hero-subtitle"
       data-test-element="value-proposition">
      Transform ideas into prototypes in 24-48 hours. EU & UAE markets.
    </p>
    
    <button class="cta-button" 
            type="button"
            aria-label="Start your AI prototype project - free consultation"
            data-analytics="hero-cta"
            data-conversion-goal="lead-generation"
            data-test-element="primary-cta"
            itemscope itemtype="https://schema.org/Action"
            itemprop="potentialAction">
      <span itemprop="name">Start Your Project</span>
    </button>
  </div>

  <!-- Breadcrumb for SEO -->
  <nav aria-label="Breadcrumb" class="sr-only">
    <ol itemscope itemtype="https://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a itemprop="item" href="/">
          <span itemprop="name">Home</span>
        </a>
        <meta itemprop="position" content="1">
      </li>
    </ol>
  </nav>
</section>
```

### Meta-теги для Core Web Vitals:
```html
<head>
  <!-- Основные SEO теги -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI-Powered Rapid Prototyping | Statex</title>
  <meta name="description" content="Transform ideas into working prototypes in 24-48 hours. Professional AI solutions for EU and UAE markets.">
  
  <!-- Core Web Vitals оптимизация -->
  <meta name="performance-target" content="lcp<2.5s,fid<100ms,cls<0.1">
  <meta name="critical-resource-hint" content="preload-hero-css">
  
  <!-- AB тест метаданные -->
  <meta name="test-variant" content="{VARIANT_ID}">
  <meta name="test-name" content="{TEST_NAME}">
  <meta name="test-split" content="50/50">
  
  <!-- Structured Data для поисковых движков -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Statex",
    "url": "https://statex.cz",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://statex.cz/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
  </script>
  
  <!-- Critical CSS injection point -->
  <style data-variant-critical>
    /* Критичные стили инжектируются сюда */
  </style>
  
  <!-- Deferred CSS loading -->
  <link rel="preload" 
        href="/variants/{VARIANT_ID}/styles/complete.css" 
        as="style" 
        onload="this.onload=null;this.rel='stylesheet'"
        data-variant-deferred>
</head>
```

---

## ⚡ Система динамической загрузки

### Variant Loader:
```typescript
// /system/variant-loader.js
class VariantLoader {
  private currentVariant: string = '';
  private loadedStyles: Set<string> = new Set();
  private criticalLoaded: boolean = false;

  async loadVariant(variantId: string): Promise<void> {
    try {
      // Загружаем манифест варианта
      const manifest = await this.fetchManifest(variantId);
      
      // Загружаем критичные ресурсы первыми
      await this.loadCriticalResources(manifest);
      
      // Отмечаем SEO метрики
      this.updateSEOMetrics(manifest);
      
      // Загружаем отложенные ресурсы
      this.loadDeferredResources(manifest);
      
      // Обновляем текущий вариант
      this.currentVariant = variantId;
      
      // Аналитика
      this.trackVariantLoad(variantId, manifest);
      
    } catch (error) {
      console.error(`Failed to load variant ${variantId}:`, error);
      // Fallback к базовому варианту
      this.loadVariant('variant-a');
    }
  }

  private async fetchManifest(variantId: string) {
    const response = await fetch(`/variants/${variantId}/manifest.json`);
    return response.json();
  }

  private async loadCriticalResources(manifest: any) {
    const promises = manifest.files.critical.map(async (file: string) => {
      if (file.endsWith('.scss') || file.endsWith('.css')) {
        return this.loadCSS(`/variants/${manifest.id}/${file}`);
      }
      if (file.endsWith('.webp') || file.endsWith('.jpg')) {
        return this.preloadImage(`/variants/${manifest.id}/${file}`);
      }
    });

    await Promise.all(promises);
    this.criticalLoaded = true;
    
    // Обновляем Core Web Vitals метрику
    this.markLCP();
  }

  private loadCSS(href: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedStyles.has(href)) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => {
        this.loadedStyles.add(href);
        resolve();
      };
      link.onerror = reject;
      
      document.head.appendChild(link);
    });
  }

  private preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }

  private updateSEOMetrics(manifest: any) {
    // Обновляем meta теги
    document.querySelector('meta[name="test-variant"]')
      ?.setAttribute('content', manifest.id);
    
    // Обновляем structured data
    const schemaScript = document.querySelector('[data-variant-schema]');
    if (schemaScript && manifest.seo.structuredData) {
      // Инжектируем специфичные для варианта данные
      this.updateStructuredData(manifest);
    }
  }

  private loadDeferredResources(manifest: any) {
    // Загружаем отложенные ресурсы с низким приоритетом
    requestIdleCallback(() => {
      manifest.files.deferred.forEach((file: string) => {
        if (file.endsWith('.scss') || file.endsWith('.css')) {
          this.loadCSS(`/variants/${manifest.id}/${file}`);
        }
      });
    });
  }

  // Система изоляции стилей
  isolateVariantStyles(variantId: string) {
    // Добавляем namespace класс к body
    document.body.className = document.body.className
      .replace(/variant-\w+/g, '')
      .trim();
    document.body.classList.add(`variant-${variantId}`);
    
    // Обновляем CSS custom properties
    this.updateCSSVariables(variantId);
  }

  private updateCSSVariables(variantId: string) {
    const root = document.documentElement;
    
    // Загружаем специфичные для варианта переменные
    fetch(`/variants/${variantId}/variables.json`)
      .then(res => res.json())
      .then(variables => {
        Object.entries(variables).forEach(([key, value]) => {
          root.style.setProperty(`--${key}`, value as string);
        });
      });
  }

  private markLCP() {
    // Помечаем LCP элемент для измерений
    const hero = document.querySelector('.stx-hero');
    if (hero) {
      hero.setAttribute('data-lcp-candidate', 'true');
    }
  }

  private trackVariantLoad(variantId: string, manifest: any) {
    // Аналитика загрузки варианта
    if (typeof gtag !== 'undefined') {
      gtag('event', 'variant_loaded', {
        event_category: 'AB_Test',
        event_label: variantId,
        custom_parameter_performance: manifest.performance.totalSize,
        custom_parameter_hypothesis: manifest.analytics.testHypothesis
      });
    }
  }
}
```

### Изоляция стилей по вариантам:
```scss
// Система изоляции CSS по вариантам
:root {
  // Базовые переменные (общие)
  --stx-font-family: 'Inter', sans-serif;
  --stx-border-radius: 8px;
  --stx-transition: 0.3s ease;
}

// Variant A: Оригинальный дизайн
.variant-a {
  --stx-primary: #0066CC;
  --stx-accent: #00AAFF;
  --stx-gradient: linear-gradient(135deg, #001122 0%, #0066CC 50%, #0099FF 100%);
  --stx-hero-bg: url('/variants/variant-a/assets/hero-bg-a.webp');
}

// Variant B: Альтернативный дизайн  
.variant-b {
  --stx-primary: #CC6600;
  --stx-accent: #FF9900;
  --stx-gradient: linear-gradient(135deg, #221100 0%, #CC6600 50%, #FF9900 100%);
  --stx-hero-bg: url('/variants/variant-b/assets/hero-bg-b.webp');
}

// Variant Dark: Темная тема
.variant-dark {
  --stx-primary: #0080FF;
  --stx-accent: #00CCFF;
  --stx-gradient: linear-gradient(135deg, #111111 0%, #333333 50%, #0080FF 100%);
  --stx-hero-bg: url('/variants/variant-dark/assets/hero-bg-dark.webp');
  --stx-text-color: #FFFFFF;
  --stx-bg-color: #1a1a1a;
}

// Компоненты используют CSS переменные
.stx-hero {
  background: var(--stx-gradient);
  color: var(--stx-text-color, #FFFFFF);
  
  &::before {
    background-image: var(--stx-hero-bg);
  }
}

.stx-cta-button {
  background: linear-gradient(135deg, var(--stx-primary), var(--stx-accent));
  transition: var(--stx-transition);
}

// Медиа-запросы для производительности
@media (max-width: 768px) {
  .variant-a, .variant-b, .variant-dark {
    --stx-hero-bg: url('/variants/common/hero-bg-mobile.webp');
  }
}
```

### Performance Monitor:
```typescript
// /system/performance-monitor.js
class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  private variantId: string = '';

  init(variantId: string) {
    this.variantId = variantId;
    this.observeMetrics();
  }

  private observeMetrics() {
    // Core Web Vitals
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    
    // Кастомные метрики
    this.observeVariantLoadTime();
    this.observeAnimationPerformance();
  }

  private observeLCP() {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.metrics.set('lcp', lastEntry.startTime);
      
      // Отправляем в аналитику
      gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: 'LCP',
        value: Math.round(lastEntry.startTime),
        custom_parameter_variant: this.variantId
      });
    }).observe({entryTypes: ['largest-contentful-paint']});
  }

  private observeAnimationPerformance() {
    // Мониторим производительность анимаций
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    animatedElements.forEach(element => {
      const observer = new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach(entry => {
          if (entry.duration > 16.67) { // Более 60fps
            console.warn(`Animation performance issue:`, {
              element: element.className,
              duration: entry.duration,
              variant: this.variantId
            });
          }
        });
      });
      
      observer.observe({entryTypes: ['measure']});
    });
  }

  getMetrics() {
    return {
      variant: this.variantId,
      metrics: Object.fromEntries(this.metrics),
      timestamp: Date.now()
    };
  }
}
```

---

## 🚀 Инициализация системы

### Главный файл приложения:
```typescript
// /src/main.ts
import { VariantLoader } from './system/variant-loader';
import { PerformanceMonitor } from './system/performance-monitor';
import { SEOInjector } from './system/seo-injector';

class StatexApp {
  private variantLoader: VariantLoader;
  private performanceMonitor: PerformanceMonitor;
  private seoInjector: SEOInjector;

  constructor() {
    this.variantLoader = new VariantLoader();
    this.performanceMonitor = new PerformanceMonitor();
    this.seoInjector = new SEOInjector();
  }

  async init() {
    // Определяем вариант для загрузки
    const variantId = this.determineVariant();
    
    // Инжектируем SEO метаданные
    await this.seoInjector.injectMeta(variantId);
    
    // Загружаем вариант
    await this.variantLoader.loadVariant(variantId);
    
    // Запускаем мониторинг производительности
    this.performanceMonitor.init(variantId);
    
    // Инициализируем анимации
    this.initAnimations();
  }

  private determineVariant(): string {
    // AB-тест логика
    const testConfig = {
      'hero-gradient-test': {
        'variant-a': 0.5,    // 50%
        'variant-b': 0.5     // 50%
      },
      'dark-theme-test': {
        'variant-a': 0.8,       // 80%
        'variant-dark': 0.2     // 20%
      }
    };

    // Проверяем URL параметры для принудительного варианта
    const urlParams = new URLSearchParams(window.location.search);
    const forceVariant = urlParams.get('variant');
    if (forceVariant) {
      return forceVariant;
    }

    // Проверяем localStorage для постоянства
    const savedVariant = localStorage.getItem('statex-variant');
    if (savedVariant) {
      return savedVariant;
    }

    // Случайное распределение
    const activeTest = 'hero-gradient-test'; // Конфигурируемо
    const variants = testConfig[activeTest];
    const random = Math.random();
    let cumulative = 0;

    for (const [variant, probability] of Object.entries(variants)) {
      cumulative += probability;
      if (random < cumulative) {
        localStorage.setItem('statex-variant', variant);
        return variant;
      }
    }

    return 'variant-a'; // Fallback
  }

  private initAnimations() {
    // Lazy loading анимаций с учетом производительности
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '50px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activateAnimation(entry.target as HTMLElement);
          animationObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('[data-animation]').forEach(el => {
      animationObserver.observe(el);
    });
  }

  private activateAnimation(element: HTMLElement) {
    const animationType = element.dataset.animation;
    const delay = element.dataset.animationDelay || '0s';
    
    // Добавляем анимацию с задержкой
    setTimeout(() => {
      element.classList.add(`stx-anim-${animationType}`, 'stx-animate-in');
    }, parseFloat(delay) * 1000);
  }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
  const app = new StatexApp();
  app.init();
});
```

---

## 📋 Практическое использование

### 1. Создание нового варианта:
```bash
# Создание структуры нового варианта
mkdir -p src/variants/variant-c/{components,assets}

# Копирование базового манифеста
cp src/variants/variant-a/manifest.json src/variants/variant-c/
# Редактирование метаданных варианта
```

### 2. A/B тест конфигурация:
```json
{
  "tests": {
    "hero-cta-test": {
      "hypothesis": "Orange CTA button increases conversions",
      "variants": {
        "variant-a": {"traffic": 0.5, "description": "Blue CTA"},
        "variant-orange": {"traffic": 0.5, "description": "Orange CTA"}
      },
      "goals": ["hero-cta-click", "contact-form-submit"],
      "duration": "14-days"
    }
  }
}
```

### 3. SEO мониторинг по вариантам:
```typescript
// Отслеживание SEO метрик по вариантам
const seoMetrics = {
  'variant-a': {
    lcp: 2.1,     // секунды
    fid: 45,      // миллисекунды  
    cls: 0.08,    // индекс
    seoScore: 95  // Lighthouse SEO
  },
  'variant-b': {
    lcp: 1.8,
    fid: 52,
    cls: 0.12,
    seoScore: 92
  }
};
```

**Результат**: Система позволяет легко управлять множественными frontend вариантами с изоляцией стилей, оптимальной производительностью и полной SEO-совместимостью. 