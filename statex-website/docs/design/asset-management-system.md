# Visual Asset Management System for Statex

## 🔧 Practical Solution for 100+ Animated Elements

### **1. Recommended Formats (based on your mockups analysis)**

**CSS animations (priority #1):**
- ✅ Size: 7-16KB per full section (like your demos)
- ✅ Scalability: Easy to change colors, sizes
- ✅ Performance: GPU acceleration
- ✅ SEO: Indexed by search engines

**SVG animations (priority #2):**
- ✅ Vector graphics, small size
- ✅ Programmable CSS/JS
- ✅ Accessibility-friendly

**WebP/AVIF (priority #3):**
- ✅ Only for complex illustrations
- ✅ Lazy loading mandatory

---

## 🏗️ Unification System

### File Structure:
```
/src/assets/
  /animations/
    /css/               # Ваши существующие CSS анимации
      hero-section.scss
      mobile-app.scss  
      services.scss
    /generated/         # AI-generated
      /prompts/         # JSON with prompts for repetition
      /variants/        # Different sizes/colors
  /styles/
    /base/
      _animations.scss  # Basic animations
      _variables.scss   # CSS custom properties
    /components/
      _hero.scss
      _services.scss
      _cards.scss
```

### CSS Custom Properties (unification):
```scss
:root {
  /* Animations */
  --stx-anim-duration-fast: 0.3s;
  --stx-anim-duration-normal: 0.6s; 
  --stx-anim-duration-slow: 1.2s;
  --stx-ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --stx-ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  /* Sizes (responsive) */
  --stx-size-xs: 16px;
  --stx-size-sm: 24px; 
  --stx-size-md: 32px;
  --stx-size-lg: 48px;
  --stx-size-xl: 64px;
  
  /* Colors from your brand book */
  --stx-primary: #0066CC;
  --stx-accent: #00AAFF;
  --stx-gradient-hero: linear-gradient(135deg, #001122 0%, #0066CC 50%, #0099FF 100%);
}
```

### Prefix System (style isolation):
```scss
/* Prefixes to avoid conflicts */
.stx-anim-         /* Animated elements */
.stx-hero-         /* Hero section */
.stx-service-      /* Services */
.stx-feature-      /* Features */
.stx-ui-           /* UI elements */
.stx-bg-           /* Background elements */

/* BEM-style modifiers */
.-primary          /* Primary variant */
.-secondary        /* Secondary */
.-sm, -md, -lg     /* Sizes */
.-delay-1, -delay-2, -delay-3  /* Animation delays */
```

---

## 🤖 Configuration for AI Generation

### JSON configurations for prompts:
```json
// /assets/animations/generated/prompts/hero-animations.json
{
  "category": "hero-animations",
  "baseStyle": "modern, clean, tech-oriented, professional",
  "brandColors": ["#0066CC", "#00AAFF", "#FFFFFF"],
  "existingMockup": "docs/design/mockups/statex_hero_demo.html",
  "animations": {
    "floating-shapes": {
      "prompt": "Create CSS keyframes for 3 geometric shapes floating animation, similar to existing mockup. Generate SCSS code with stx- prefixes. Colors: #0066CC, #00AAFF. Animation: 6s ease-in-out infinite, different delays.",
      "cssClass": "stx-anim-float",
      "variants": ["square", "circle", "triangle"],
      "modifiers": ["-delay-1", "-delay-2", "-delay-3"],
      "outputFormat": "scss"
    },
    "background-grid": {
      "prompt": "Create CSS animation for moving grid background pattern, like in existing hero demo. SCSS with CSS custom properties, stx- prefixes, 10s linear infinite.",
      "cssClass": "stx-bg-grid",
      "outputFormat": "scss"
    }
  }
}
```

### Resource Switching Automation:
```typescript
// AssetManager.ts
export class AssetManager {
  // Switch all resources by theme
  switchTheme(theme: 'light' | 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
    
    // CSS custom properties will automatically change colors
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--stx-primary', '#0080FF');
      root.style.setProperty('--stx-bg-color', '#1a1a1a');
    } else {
      root.style.setProperty('--stx-primary', '#0066CC'); 
      root.style.setProperty('--stx-bg-color', '#FFFFFF');
    }
  }

  // Language switching with RTL support
  switchLanguage(lang: string) {
    document.documentElement.setAttribute('lang', lang);
    
    if (['ar', 'he'].includes(lang)) {
      document.documentElement.setAttribute('dir', 'rtl');
      document.body.classList.add('rtl-layout');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.body.classList.remove('rtl-layout');
    }
  }
}
```

---

## ♿ Accessibility and SEO

### Keyboard Navigation:
```scss
.stx-interactive {
  &:focus-visible {
    outline: 2px solid var(--stx-primary);
    outline-offset: 2px;
    border-radius: 4px;
  }
}

// For animated elements
.stx-anim-float:focus-visible {
  animation-play-state: paused; /* Stop animation on focus */
}
```

### SEO-optimized markup:
```html
<section class="stx-hero-section" 
         itemscope itemtype="https://schema.org/WebPageElement">
  
  <!-- Background elements -->
  <div class="stx-bg-grid" role="presentation" aria-hidden="true"></div>
  
  <div class="stx-anim-float stx-shape-square -delay-1" 
       role="presentation" 
       aria-hidden="true"
       data-lazy-animation="float"></div>
  
  <!-- Main content -->
  <div class="hero-content">
    <h1 itemprop="headline">AI-Powered Rapid Prototyping</h1>
    <p itemprop="description">Transform ideas into prototypes</p>
    <button class="cta-button stx-interactive" 
            aria-label="Start your AI prototype project">
      Start Project
    </button>
  </div>
</section>
```

### Meta tags for animations:
```html
<head>
  <meta name="animation-preference" content="auto">
  <meta name="reduced-motion" content="respect-user-preference">
  
  <!-- Preload критичных анимаций -->
  <link rel="preload" href="/assets/animations/css/hero-section.css" as="style">
</head>
```

---

## 🚀 Производительность и Lazy Loading

### Intersection Observer для анимаций:
```javascript
// utils/lazyAnimations.js
const lazyAnimationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const element = entry.target;
      const animationType = element.dataset.lazyAnimation;
      
      // Добавляем анимацию только когда элемент виден
      element.classList.add(`stx-anim-${animationType}`);
      
      // Отключаем наблюдение за этим элементом
      lazyAnimationObserver.unobserve(element);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '50px'
});

// Инициализация
document.querySelectorAll('[data-lazy-animation]').forEach(el => {
  lazyAnimationObserver.observe(el);
});
```

### CSS-only lazy loading:
```scss
.stx-anim-lazy {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s var(--stx-ease-smooth);
  
  &.stx-animate-in {
    opacity: 1;
    transform: translateY(0);
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .stx-anim-float,
  .stx-anim-pulse,
  .stx-bg-grid {
    animation: none;
  }
  
  .stx-anim-lazy {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

---

## 📋 Практический план внедрения

### Шаг 1: Извлечение из mockups
Преобразуйте ваши существующие CSS анимации в компонентную систему:

1. **hero_demo.html** → `_hero-animations.scss`
2. **mobile_demo.html** → `_mobile-animations.scss`  
3. **services_demo.html** → `_services-animations.scss`

### Шаг 2: Унификация
```scss
// _base-animations.scss
@import 'hero-animations';
@import 'mobile-animations';
@import 'services-animations';

// Unified animation utilities
.stx-anim-base {
  transition: all var(--stx-anim-duration-normal) var(--stx-ease-smooth);
}
```

### Шаг 3: ИИ-генерация новых элементов
Используйте JSON-конфигурации для создания промптов:
```
"Создай CSS анимацию в стиле существующих mockups Statex. 
Используй префикс stx-, цвета #0066CC и #00AAFF, 
современный tech стиль, оптимизируй для производительности."
```

### Шаг 4: Автоматизация
```bash
# Скрипт для обновления всех анимаций
npm run generate:animations
npm run optimize:css
npm run test:accessibility
```

## 🔍 SEO улучшения для asset-management

### Оптимизированная загрузка ресурсов:
```html
<!-- Критичные ресурсы с preload -->
<head>
  <link rel="preload" href="/assets/images/hero-bg-critical.webp" as="image">
  <link rel="preload" href="/assets/fonts/Inter-Bold.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/css/critical.css" as="style">
  
  <!-- DNS prefetch для внешних ресурсов -->
  <link rel="dns-prefetch" href="//fonts.googleapis.com">
  <link rel="dns-prefetch" href="//www.google-analytics.com">
  
  <!-- Meta для производительности -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0066CC">
  
  <!-- Critical CSS inline -->
  <style data-critical>
    /* Критичные стили для above-the-fold контента */
    .hero { min-height: 100vh; background: #0066CC; }
    .hero-title { font-size: 3.5rem; color: white; }
  </style>
</head>
```

### Structured Data для изображений:
```json
{
  "@context": "https://schema.org",
  "@type": "ImageObject",
  "contentUrl": "/assets/images/hero-bg-a.webp",
  "width": 1920,
  "height": 1080,
  "caption": "AI-powered rapid prototyping services visualization",
  "creator": {
    "@type": "Organization", 
    "name": "Statex"
  },
  "license": "https://statex.cz/license",
  "acquireLicensePage": "https://statex.cz/contact"
}
```

### Performance monitoring для ресурсов:
```javascript
// Мониторинг производительности ресурсов с SEO метриками
const monitorResourcePerformance = () => {
  // Отслеживание загрузки изображений
  const imagePerformance = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.initiatorType === 'img') {
        gtag('event', 'resource_timing', {
          event_category: 'Performance',
          event_label: 'Image Load',
          value: Math.round(entry.duration),
          custom_parameter_resource: entry.name.split('/').pop()
        });
      }
    });
  });
  
  imagePerformance.observe({entryTypes: ['resource']});
  
  // Мониторинг размера ресурсов для performance budget
  const resourceObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      const resourceSize = entry.transferSize;
      const resourceType = entry.initiatorType;
      
      // Предупреждение о больших ресурсах
      if (resourceSize > 200 * 1024) { // 200KB
        console.warn(`Large resource detected: ${entry.name} (${resourceSize} bytes)`);
        
        gtag('event', 'large_resource', {
          event_category: 'Performance',
          event_label: resourceType,
          value: Math.round(resourceSize / 1024), // KB
          custom_parameter_url: entry.name
        });
      }
    });
  });
  
  resourceObserver.observe({entryTypes: ['resource']});
};
```

**Итог:** Система обеспечивает:
- ✅ **SEO-оптимизация**: Полная микроразметка, structured data, preload директивы
- ✅ **Минимальный размер**: Критичные ресурсы ≤14KB, lazy loading остальных  
- ✅ **AB-тестирование**: Динамическая загрузка вариантов без конфликтов
- ✅ **Производительность**: Core Web Vitals мониторинг, performance budgets
- ✅ **Масштабируемость**: Управление сотнями элементов с легкой модификацией для ИИ 