# Statex Animation System

## 🎯 CSS-Based Animation System (extracted from mockups)

### Basic Animations

```scss
// Main CSS variables for animations
:root {
  --stx-anim-duration-fast: 0.3s;
  --stx-anim-duration-normal: 0.6s;
  --stx-anim-duration-slow: 1.2s;
  --stx-ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --stx-ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  // Colors from brand book
  --stx-primary: #0066CC;
  --stx-accent: #00AAFF;
  --stx-gradient-hero: linear-gradient(135deg, #001122 0%, #0066CC 50%, #0099FF 100%);
}

// Floating elements (from hero_demo.html)
.stx-anim-float {
  animation: stx-float 6s ease-in-out infinite;
  
  &.-delay-1 { animation-delay: 0s; }
  &.-delay-2 { animation-delay: 2s; }
  &.-delay-3 { animation-delay: 4s; }
}

@keyframes stx-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

// Pulsation (from mobile_demo.html)
.stx-anim-pulse {
  animation: stx-pulse 2s ease-in-out infinite;
}

@keyframes stx-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

// Globe rotation (from hero_demo.html)
.stx-anim-rotate {
  animation: stx-rotate 10s linear infinite;
}

@keyframes stx-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// Wave animation (from mobile_demo.html)
.stx-anim-waveform {
  display: flex;
  align-items: end;
  gap: 3px;
  height: 40px;
  justify-content: center;
  
  .wave-bar {
    width: 4px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 2px;
    animation: stx-waveform 1.5s ease-in-out infinite;
    
    &:nth-child(1) { height: 20px; animation-delay: 0s; }
    &:nth-child(2) { height: 35px; animation-delay: 0.1s; }
    &:nth-child(3) { height: 25px; animation-delay: 0.2s; }
    &:nth-child(4) { height: 40px; animation-delay: 0.3s; }
    &:nth-child(5) { height: 15px; animation-delay: 0.4s; }
    &:nth-child(6) { height: 30px; animation-delay: 0.5s; }
  }
}

@keyframes stx-waveform {
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
}

// Progress bar animation
.stx-anim-progress {
  width: 200px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
  
  .progress-fill {
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 3px;
    animation: stx-progress-fill 3s ease-out infinite;
  }
}

@keyframes stx-progress-fill {
  0% { width: 0%; }
  100% { width: 100%; }
}
```

### Component Styles

```scss
// Hero section
.stx-hero-section {
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--stx-gradient-hero);
  overflow: hidden;
}

// Background grid
.stx-bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: stx-grid-move 10s linear infinite;
}

@keyframes stx-grid-move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

// Geometric shapes
.stx-shape-square {
  background: linear-gradient(45deg, var(--stx-primary), var(--stx-accent));
  transform: rotate(45deg);
}

.stx-shape-circle {
  background: linear-gradient(45deg, var(--stx-accent), var(--stx-primary));
  border-radius: 50%;
}

.stx-shape-triangle {
  background: linear-gradient(45deg, var(--stx-primary), #FFFFFF);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

// Service cards (from services_demo.html)
.stx-service-card {
  background: white;
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: all var(--stx-anim-duration-normal) var(--stx-ease-smooth);
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, var(--stx-primary), var(--stx-accent));
  }
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 60px rgba(0, 102, 204, 0.15);
    
    .stx-service-icon {
      transform: scale(1.1) rotate(5deg);
    }
  }
}

.stx-service-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--stx-primary), var(--stx-accent));
  border-radius: 20px;
  color: white;
  font-size: 2rem;
  transition: all var(--stx-anim-duration-normal) var(--stx-ease-bounce);
}
```

### Responsive адаптация

```scss
@media (max-width: 768px) {
  .stx-hero-title {
    font-size: 2.5rem;
  }
  
  .stx-shape-square,
  .stx-shape-circle,
  .stx-shape-triangle {
    width: 60px;
    height: 60px;
  }
  
  .stx-anim-float {
    animation-duration: 4s; // Быстрее на мобильных
  }
}
```

### Доступность и производительность

```scss
// Отключение анимаций для пользователей с reduced motion
@media (prefers-reduced-motion: reduce) {
  .stx-anim-float,
  .stx-anim-pulse,
  .stx-anim-rotate,
  .stx-bg-grid {
    animation: none;
  }
  
  .stx-service-card {
    transition: none;
  }
}

// Focus states для доступности
.stx-interactive {
  &:focus-visible {
    outline: 2px solid var(--stx-primary);
    outline-offset: 2px;
    border-radius: 4px;
  }
  
  &:focus:not(:focus-visible) {
    outline: none;
  }
}
```

### Lazy Loading анимаций

```scss
.stx-anim-lazy {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s var(--stx-ease-smooth);
  
  &.stx-animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  // Задержки для последовательного появления
  &.-delay-1 { transition-delay: 0.1s; }
  &.-delay-2 { transition-delay: 0.2s; }
  &.-delay-3 { transition-delay: 0.3s; }
}
```

## JavaScript для Intersection Observer

```javascript
// Инициализация lazy анимаций
const initLazyAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('stx-animate-in');
        animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.stx-anim-lazy').forEach(el => {
    animationObserver.observe(el);
  });
};

// Запуск после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLazyAnimations);
} else {
  initLazyAnimations();
}
```

## Использование в HTML с SEO-оптимизацией

```html
<!-- SEO-оптимизированная hero секция -->
<section class="stx-hero-section" 
         itemscope itemtype="https://schema.org/WebPageElement"
         data-seo-section="hero"
         aria-label="AI-Powered Rapid Prototyping Services">
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "AI Prototype Development",
    "description": "24-48 hour AI-powered prototyping services",
    "provider": {
      "@type": "Organization",
      "name": "Statex"
    }
  }
  </script>
  
  <!-- Preload критичных ресурсов -->
  <link rel="preload" href="/assets/hero-bg-critical.webp" as="image">
  <link rel="preload" href="/assets/fonts/Inter-Bold.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- Анимированные фоновые элементы -->
  <div class="stx-bg-grid" 
       role="presentation" 
       aria-hidden="true"
       data-animation="grid-move"
       data-performance="gpu-accelerated"></div>
  
  <div class="stx-anim-float stx-shape-square -delay-1" 
       style="width: 100px; height: 100px; top: 20%; left: 10%;"
       role="presentation" 
       aria-hidden="true"
       data-animation="float"
       data-animation-purpose="visual-enhancement"></div>
       
  <div class="stx-anim-float stx-shape-circle -delay-2" 
       style="width: 60px; height: 60px; top: 60%; right: 15%;"
       role="presentation" 
       aria-hidden="true"
       data-animation="float"
       data-animation-purpose="visual-enhancement"></div>
       
  <div class="stx-anim-float stx-shape-triangle -delay-3" 
       style="width: 80px; height: 80px; bottom: 30%; left: 20%;"
       role="presentation" 
       aria-hidden="true"
       data-animation="float"
       data-animation-purpose="visual-enhancement"></div>
  
  <!-- Основной контент с микроразметкой -->
  <div class="hero-content" itemprop="mainContentOfPage">
    <h1 class="hero-title" 
        itemprop="headline"
        data-analytics="hero-title">
      AI-Powered Rapid Prototyping
    </h1>
    <p class="hero-subtitle" 
       itemprop="description"
       data-analytics="hero-subtitle">
      Transform your ideas into working prototypes in 24-48 hours
    </p>
    <button class="cta-button stx-interactive" 
            type="button"
            aria-label="Start your AI prototype project - free consultation"
            data-analytics="hero-cta"
            data-conversion-goal="lead-generation"
            itemscope itemtype="https://schema.org/Action"
            itemprop="potentialAction">
      <span itemprop="name">Start Your Project</span>
    </button>
  </div>
  
  <!-- Breadcrumb для SEO (скрытый) -->
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

<!-- SEO-оптимизированные карточки услуг -->
<section class="services-grid" 
         itemscope itemtype="https://schema.org/ItemList"
         aria-label="AI Development Services">
  <div class="stx-service-card stx-anim-lazy -delay-1"
       itemscope itemtype="https://schema.org/Service"
       itemprop="itemListElement">
    <div class="stx-service-icon" 
         role="img" 
         aria-label="AI Development Icon">🧠</div>
    <h3 itemprop="name">AI Development</h3>
    <p itemprop="description">Custom AI solutions powered by machine learning</p>
    <meta itemprop="serviceType" content="AI Development">
    <meta itemprop="provider" content="Statex">
  </div>
  
  <!-- Дополнительные карточки с аналогичной разметкой -->
</section>
```

## Конфигурация для ИИ-генерации

```json
{
  "animationSystem": {
    "prefix": "stx-",
    "baseClasses": [
      "anim-float",
      "anim-pulse", 
      "anim-rotate",
      "anim-lazy"
    ],
    "modifiers": [
      "-delay-1", "-delay-2", "-delay-3",
      "-primary", "-secondary", "-accent",
      "-sm", "-md", "-lg"
    ],
    "cssVariables": {
      "durations": ["fast", "normal", "slow"],
      "easings": ["smooth", "bounce"],
      "colors": ["primary", "accent", "gradient-hero"]
    }
  }
}
```

## SEO-оптимизированный JavaScript

```javascript
// Улучшенная инициализация lazy анимаций с SEO-метриками
const initSEOAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
  };

  // Отслеживание LCP (Largest Contentful Paint)
  const lcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    
    // Отправляем LCP метрику в аналитику
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: 'LCP',
        value: Math.round(lastEntry.startTime)
      });
    }
  });
  lcpObserver.observe({entryTypes: ['largest-contentful-paint']});

  // Анимации с учетом производительности
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animationType = element.dataset.animation;
        
        // Добавляем анимацию с оптимизацией
        entry.target.classList.add('stx-animate-in');
        
        // Трекинг взаимодействия для SEO
        if (element.dataset.analytics) {
          gtag('event', 'animation_viewed', {
            event_category: 'Engagement',
            event_label: element.dataset.analytics,
            custom_parameter_section: element.dataset.seoSection || 'unknown'
          });
        }
        
        animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Наблюдаем за всеми анимированными элементами
  document.querySelectorAll('.stx-anim-lazy, [data-animation]').forEach(el => {
    animationObserver.observe(el);
  });
};

// CLS (Cumulative Layout Shift) мониторинг
const initCLSMonitoring = () => {
  let clsValue = 0;
  let clsEntries = [];

  const clsObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      // Игнорируем сдвиги от пользовательских действий
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        clsEntries.push(entry);
      }
    }
    
    // Отправляем CLS метрику
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: 'CLS',
        value: Math.round(clsValue * 1000)
      });
    }
  });
  
  clsObserver.observe({entryTypes: ['layout-shift']});
};

// Запуск после загрузки DOM с SEO оптимизацией
document.addEventListener('DOMContentLoaded', () => {
  // Проверяем поддержку браузера
  if ('IntersectionObserver' in window && 'PerformanceObserver' in window) {
    initSEOAnimations();
    initCLSMonitoring();
  } else {
    // Fallback для старых браузеров
    document.querySelectorAll('.stx-anim-lazy').forEach(el => {
      el.classList.add('stx-animate-in');
    });
  }
  
  // Structured Data для анимированных элементов
  updateAnimationStructuredData();
});

// Обновление structured data для анимаций
const updateAnimationStructuredData = () => {
  const animatedSections = document.querySelectorAll('[data-seo-section]');
  
  animatedSections.forEach(section => {
    const sectionType = section.dataset.seoSection;
    const animations = section.querySelectorAll('[data-animation]');
    
    if (animations.length > 0) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPageElement",
        "name": `${sectionType} Section`,
        "description": `Interactive ${sectionType} section with animations`,
        "interactionStatistic": {
          "@type": "InteractionCounter",
          "interactionType": "ViewAction",
          "userInteractionCount": 0
        }
      };
      
      // Добавляем structured data в head
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      script.dataset.seoSection = sectionType;
      document.head.appendChild(script);
    }
  });
};
```

## Performance Budget для анимаций

```scss
// Система ограничения производительности
@mixin animation-performance-check {
  // Отключаем сложные анимации на слабых устройствах
  @media (max-width: 768px) and (max-resolution: 150dpi) {
    animation: none !important;
    transform: none !important;
  }
  
  // Уменьшаем анимации при низкой производительности
  @media (prefers-reduced-motion: reduce) {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// Применяем ко всем анимациям
.stx-anim-float,
.stx-anim-pulse,
.stx-anim-rotate {
  @include animation-performance-check;
  
  // GPU ускорение только для современных браузеров
  @supports (transform: translateZ(0)) {
    will-change: transform;
    transform: translateZ(0);
  }
}
```

## AB-тестирование интеграция

```scss
// Варианты анимаций для AB-тестов
.variant-a {
  .stx-anim-float {
    animation-duration: 6s;
    animation-timing-function: ease-in-out;
  }
}

.variant-b {
  .stx-anim-float {
    animation-duration: 4s;
    animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
}

.variant-minimal {
  .stx-anim-float,
  .stx-anim-pulse,
  .stx-bg-grid {
    animation: none;
  }
  
  .stx-service-card {
    transition: box-shadow 0.2s ease;
    
    &:hover {
      transform: none;
      box-shadow: 0 4px 12px rgba(0, 102, 204, 0.1);
    }
  }
}
``` 