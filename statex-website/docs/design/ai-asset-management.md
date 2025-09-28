# AI Asset Management System for Statex

## 🎯 Visual Asset Management System for AI Generation

### Folder Structure

```
/src/assets/
  /images/
    /static/                    # Static images
      /backgrounds/
      /photos/
      /illustrations/
    /generated/                 # AI-generated resources
      /hero/
      /services/
      /features/
      /icons/
      /animations/
    /config/                    # AI configurations
      /prompts/                 # JSON files with prompts
      /templates/               # Generation templates
      /variants/                # Size and format variants
  /animations/
    /css/                       # CSS animations
    /svg/                       # SVG with animations
    /lottie/                    # Lottie animations (if needed)
  /styles/
    /components/                # Component styles
    /animations/                # Animation styles
    /utilities/                 # Utility classes
```

### File Naming System

```bash
# Prefixes by content type
hero-{type}-{variant}-{size}.{ext}
service-{name}-{variant}-{size}.{ext}
feature-{name}-{state}-{size}.{ext}
icon-{category}-{name}-{size}.{ext}
bg-{type}-{variant}-{size}.{ext}
anim-{type}-{variant}.{ext}

# Examples:
hero-background-primary-1920w.webp
hero-background-primary-768w.webp
service-ai-development-card-400w.webp
icon-tech-brain-24.svg
anim-float-shapes-primary.css
```

### Configuration for AI Generation

```json
// /assets/config/prompts/hero-section.json
{
  "category": "hero",
  "baseStyle": "modern, clean, professional, tech-oriented",
  "brandColors": ["#0066CC", "#00AAFF", "#FFFFFF"],
  "dimensions": {
    "desktop": "1920x1080",
    "tablet": "768x1024", 
    "mobile": "375x812"
  },
  "assets": {
    "hero-background-primary": {
      "prompt": "Create a modern, high-tech background with subtle geometric patterns, blue gradient (#0066CC to #00AAFF), floating abstract shapes, minimal grid overlay, professional atmosphere, 1920x1080px",
      "variants": ["primary", "secondary", "dark"],
      "formats": ["webp", "avif", "jpg"],
      "sizes": ["1920w", "1440w", "768w", "375w"],
      "cssClass": "stx-hero-bg",
      "lazyLoad": true
    },
    "hero-shapes-floating": {
      "prompt": "Create 3 geometric shapes (square, circle, triangle) with blue gradients, suitable for CSS animation, transparent background, modern tech style",
      "type": "css-animation",
      "cssClass": "stx-anim-float",
      "variants": ["square", "circle", "triangle"],
      "animationType": "float"
    }
  }
}
```

```json
// /assets/config/prompts/services-section.json
{
  "category": "services",
  "baseStyle": "professional, modern, clean, business-oriented",
  "brandColors": ["#0066CC", "#00AAFF", "#FFFFFF"],
  "assets": {
    "service-icons": {
      "prompt": "Create minimalist line icons for IT services: AI brain, code blocks, e-commerce cart, responsive design, server modernization, consulting. Style: 2px stroke, blue color (#0066CC), 64x64px, transparent background",
      "type": "svg-icons",
      "services": [
        "ai-development",
        "rapid-prototyping", 
        "custom-software",
        "e-commerce",
        "legacy-modernization",
        "responsive-design"
      ],
      "formats": ["svg"],
      "sizes": ["24", "32", "48", "64"],
      "cssClass": "stx-service-icon"
    },
    "service-cards-bg": {
      "prompt": "Create subtle background patterns for service cards, light gradients, professional appearance, suitable for white cards with blue accents",
      "variants": ["pattern-1", "pattern-2", "pattern-3"],
      "formats": ["webp", "svg"],
      "cssClass": "stx-service-card-bg"
    }
  }
}
```

### Generation Automation

```javascript
// /scripts/generate-assets.js
const fs = require('fs');
const path = require('path');

class AssetGenerator {
  constructor(configPath) {
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    this.outputPath = './src/assets/generated/';
  }

  // Generate all resources based on configuration
  async generateAll() {
    for (const [assetName, assetConfig] of Object.entries(this.config.assets)) {
      await this.generateAsset(assetName, assetConfig);
    }
  }

  // Generate individual resource
  async generateAsset(name, config) {
    console.log(`Generating ${name}...`);
    
    // Create AI prompt
    const aiPrompt = this.buildPrompt(config);
    
    // Save prompt for reuse
    this.savePrompt(name, aiPrompt, config);
    
    // Generate CSS classes if needed
    if (config.cssClass) {
      this.generateCSS(name, config);
    }
    
    // Generate HTML templates
    this.generateHTMLTemplate(name, config);
  }

  // Build AI prompt
  buildPrompt(config) {
    let prompt = config.prompt;
    
    // Add common project styles
    prompt += ` Style: ${this.config.baseStyle}.`;
    prompt += ` Colors: ${this.config.brandColors.join(', ')}.`;
    
    // Add technical requirements
    if (config.formats) {
      prompt += ` Output formats: ${config.formats.join(', ')}.`;
    }
    
    return prompt;
  }

  // Save prompt for reuse
  savePrompt(name, prompt, config) {
    const promptData = {
      name,
      prompt,
      config,
      generatedAt: new Date().toISOString(),
      version: "1.0"
    };
    
    const filePath = path.join(this.outputPath, 'prompts', `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(promptData, null, 2));
  }

  // Generate CSS for resource
  generateCSS(name, config) {
    let css = '';
    
    if (config.cssClass) {
      css += `.${config.cssClass} {\n`;
      
      if (config.type === 'css-animation') {
        css += `  animation: ${config.animationType} 6s ease-in-out infinite;\n`;
      }
      
      if (config.lazyLoad) {
        css += `  opacity: 0;\n`;
        css += `  transition: opacity 0.3s ease;\n`;
        css += `}\n\n`;
        css += `.${config.cssClass}.loaded {\n`;
        css += `  opacity: 1;\n`;
      }
      
      css += '}\n\n';
    }

    // Responsive варианты
    if (config.sizes) {
      css += `@media (max-width: 768px) {\n`;
      css += `  .${config.cssClass} {\n`;
      css += `    background-image: url('./generated/${name}-768w.webp');\n`;
      css += `  }\n`;
      css += `}\n\n`;
    }

    const cssPath = path.join(this.outputPath, 'styles', `${name}.scss`);
    fs.writeFileSync(cssPath, css);
  }

  // Генерация HTML шаблона
  generateHTMLTemplate(name, config) {
    let html = '';
    
    if (config.type === 'css-animation') {
      html = `<div class="${config.cssClass} stx-anim-lazy" 
                   role="presentation" 
                   aria-hidden="true"></div>\n`;
    } else if (config.type === 'svg-icons') {
      html = `<div class="${config.cssClass}-container">\n`;
      config.services?.forEach(service => {
        html += `  <svg class="${config.cssClass} ${config.cssClass}-${service}" 
                      width="64" height="64"
                      role="img" 
                      aria-label="${service} service icon">\n`;
        html += `    <use href="#icon-${service}"></use>\n`;
        html += `  </svg>\n`;
      });
      html += `</div>\n`;
    }

    const htmlPath = path.join(this.outputPath, 'templates', `${name}.html`);
    fs.writeFileSync(htmlPath, html);
  }
}

// Запуск генерации
const generator = new AssetGenerator('./src/assets/config/prompts/hero-section.json');
generator.generateAll();
```

### Интеграция с фронтендом

```typescript
// /src/utils/AssetManager.ts
export class AssetManager {
  private static instance: AssetManager;
  private loadedAssets: Map<string, boolean> = new Map();
  private observers: Map<string, IntersectionObserver> = new Map();

  static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager();
    }
    return AssetManager.instance;
  }

  // Инициализация lazy loading для ресурсов
  initLazyLoading() {
    const lazyElements = document.querySelectorAll('.stx-anim-lazy');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadAsset(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    lazyElements.forEach(el => observer.observe(el));
  }

  // Загрузка конкретного ресурса
  private async loadAsset(element: HTMLElement) {
    const assetName = element.dataset.asset;
    if (!assetName || this.loadedAssets.get(assetName)) return;

    try {
      // Загрузка изображения если есть
      if (element.dataset.src) {
        await this.preloadImage(element.dataset.src);
        element.style.backgroundImage = `url(${element.dataset.src})`;
      }

      // Добавление анимации
      element.classList.add('stx-animate-in');
      this.loadedAssets.set(assetName, true);

      // Запуск кастомной анимации если есть
      if (element.dataset.animation) {
        this.startAnimation(element, element.dataset.animation);
      }

    } catch (error) {
      console.error(`Failed to load asset: ${assetName}`, error);
    }
  }

  // Предварительная загрузка изображения
  private preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }

  // Запуск анимации
  private startAnimation(element: HTMLElement, animationType: string) {
    switch (animationType) {
      case 'float':
        element.classList.add('stx-anim-float');
        break;
      case 'pulse':
        element.classList.add('stx-anim-pulse');
        break;
      case 'rotate':
        element.classList.add('stx-anim-rotate');
        break;
    }
  }

  // Смена темы/языка
  switchTheme(theme: 'light' | 'dark') {
    const themeElements = document.querySelectorAll('[data-theme-asset]');
    themeElements.forEach(el => {
      const baseAsset = el.dataset.themeAsset;
      const newSrc = `./assets/generated/${baseAsset}-${theme}.webp`;
      (el as HTMLElement).style.backgroundImage = `url(${newSrc})`;
    });
  }

  // Смена языка с адаптацией ресурсов
  switchLanguage(lang: string) {
    const langElements = document.querySelectorAll('[data-lang-asset]');
    langElements.forEach(el => {
      const baseAsset = el.dataset.langAsset;
      const newSrc = `./assets/generated/${baseAsset}-${lang}.webp`;
      if (this.assetExists(newSrc)) {
        (el as HTMLElement).style.backgroundImage = `url(${newSrc})`;
      }
    });
  }

  // Проверка существования ресурса
  private assetExists(src: string): boolean {
    // Implement check logic
    return true;
  }
}
```

### HTML шаблоны с мета-данными

```html
<!-- Hero секция с полной SEO оптимизацией -->
<section class="stx-hero-section" 
         itemscope itemtype="https://schema.org/WebPageElement"
         data-section="hero">
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Statex",
    "description": "AI-powered rapid prototyping services",
    "url": "https://statex.cz"
  }
  </script>

  <!-- Фоновые анимированные элементы -->
  <div class="stx-bg-grid" 
       role="presentation" 
       aria-hidden="true"></div>
  
  <!-- Плавающие фигуры с lazy loading -->
  <div class="stx-anim-float stx-shape-square stx-anim-lazy -delay-1" 
       data-asset="hero-shape-square"
       data-animation="float"
       style="top: 20%; left: 10%;"
       role="presentation" 
       aria-hidden="true"></div>
       
  <div class="stx-anim-float stx-shape-circle stx-anim-lazy -delay-2"
       data-asset="hero-shape-circle" 
       data-animation="float"
       style="top: 60%; right: 15%;"
       role="presentation" 
       aria-hidden="true"></div>
       
  <div class="stx-anim-float stx-shape-triangle stx-anim-lazy -delay-3"
       data-asset="hero-shape-triangle"
       data-animation="float" 
       style="bottom: 30%; left: 20%;"
       role="presentation" 
       aria-hidden="true"></div>

  <!-- Основной контент -->
  <div class="hero-content" itemprop="mainEntity">
    <h1 class="hero-title" itemprop="headline">
      AI-Powered Rapid Prototyping
    </h1>
    <p class="hero-subtitle" itemprop="description">
      Transform your ideas into working prototypes in minutes
    </p>
    <button class="cta-button stx-interactive" 
            type="button"
            aria-label="Start your AI prototype project"
            data-action="start-project">
      Start Your Project
    </button>
  </div>

  <!-- Индикаторы AI процесса -->
  <div class="ai-visualization stx-anim-lazy -delay-4" 
       role="img" 
       aria-label="AI processing visualization">
    <div class="ai-node stx-anim-pulse" aria-hidden="true"></div>
    <div class="ai-node stx-anim-pulse" aria-hidden="true"></div>
    <div class="ai-node stx-anim-pulse" aria-hidden="true"></div>
    <div class="ai-node stx-anim-pulse" aria-hidden="true"></div>
  </div>
</section>
```

### Инициализация системы

```javascript
// /src/main.js
import { AssetManager } from './utils/AssetManager';

document.addEventListener('DOMContentLoaded', () => {
  const assetManager = AssetManager.getInstance();
  
  // Инициализация lazy loading
  assetManager.initLazyLoading();
  
  // Обработка смены языка
  document.addEventListener('languageChange', (e) => {
    assetManager.switchLanguage(e.detail.language);
  });
  
  // Обработка смены темы  
  document.addEventListener('themeChange', (e) => {
    assetManager.switchTheme(e.detail.theme);
  });
});
```

## Инструкция для ИИ-генерации

### 1. Запуск генерации:
```bash
node scripts/generate-assets.js
```

### 2. Промпты для ИИ будут сохранены в:
```
/assets/generated/prompts/{asset-name}.json
```

### 3. Готовые CSS классы в:
```
/assets/generated/styles/{asset-name}.scss
```

### 4. HTML шаблоны в:
```
/assets/generated/templates/{asset-name}.html
```

Эта система позволит вам легко масштабировать визуальные ресурсы, изменять дизайн и поручать генерацию ИИ с сохранением консистентности и производительности. 