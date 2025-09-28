# Statex Component Library Documentation

> **Related Documentation**  
> - [Style Extension Guidelines](style-extension-guidelines.md)  
> - [Design Standards](design-standards.md)  
> - [Color System](colors.md)  
> - [Brand Guidelines](brand-guidelines.md)

## 📋 Overview

The Statex Component Library is a comprehensive collection of reusable UI components designed to support AB testing across multiple variants while maintaining design consistency and performance optimization.

### Key Features
- **50+ Reusable Components** across component categories
- **4 Languages** with real-time translation (EN/CS/DE/AR)
- **4 Dynamic Themes** with instant switching (Light/Dark/EU/UAE)
- **4 Frontend Variants** with live layout changes (Modern/Classic/Minimal/Corporate)
- **Production Demo System** built into navigation
- **Responsive Design** with mobile-first approach
- **Accessibility Compliant** (WCAG 2.1 AA + RTL support)
- **Performance Optimized** with CSS custom properties
- **SEO-Friendly** with semantic markup and multilingual support

## 🎨 Style Guidelines

For comprehensive style guidance, refer to our [Style Extension Guidelines](style-extension-guidelines.md) which cover:
- Naming conventions
- Component architecture
- Theming system
- Responsive design
- Accessibility
- CSS organization
- Best practices

## Color System Integration

All components use the standardized color system defined in our [Color System Documentation](colors.md). The color system includes:

- **Brand Colors**: Primary and accent colors with light/dark variants
- **Status Colors**: For success, warning, error, and info states
- **Theme Support**: Built-in theming for light/dark and regional variants
- **Accessibility**: WCAG 2.1 AA compliant contrast ratios

For detailed color usage and theming guidelines, refer to the [Color System Documentation](colors.md).

## 🎯 Live Demo System - Production Ready

### 🌍 Multi-Language Support
- **English** 🇬🇧 - Primary international language
- **Czech (Čeština)** 🇨🇿 - Local Czech market
- **German (Deutsch)** 🇩🇪 - DACH region expansion  
- **Arabic (العربية)** 🇦🇪 - UAE market with RTL support

**Typography Consistency**: All languages use identical Inter font family with consistent letter-spacing and font-weight to ensure uniform visual appearance across all language variants.

### 🎨 Dynamic Theme Switching
- **Light Theme** ☀️ - Clean, professional appearance
- **Dark Theme** 🌙 - Modern dark mode for developers
- **European Theme** 🇪🇺 - Refined colors for EU business clients
- **UAE Theme** 🇦🇪 - Gold accents for Middle Eastern market

### ⚡ Frontend Variant System
- **Modern Frontend** 🔥 - Rounded corners, glass effects, animations
- **Classic Frontend** 📐 - Traditional business styling, minimal borders
- **Minimal Frontend** ✨ - Clean lines, no borders, flat design
- **Corporate Frontend** 🏢 - Conservative styling for enterprise clients

### 🎯 Production Demo Features
- **Real-time Content Translation** - Instant language switching with proper content
- **Visual Theme Changes** - Live color scheme and styling updates
- **Layout Transformations** - Frontend variants change visual structure
- **Navigation Integration** - Controls built into every page header
- **Keyboard Shortcuts** - Power user controls for rapid switching
- **Analytics Tracking** - Full interaction monitoring for optimization

## 🧩 Component Categories

### 1. Navigation Components

#### Header Component (`.stx-header`)
- **Purpose**: Fixed navigation header with backdrop blur
- **Features**: Responsive, variant theming, accessibility
- **Usage**: Main site navigation

```html
<header class="stx-header">
    <nav class="stx-nav-container">
        <a href="#" class="stx-logo">Statex.cz</a>
        <ul class="stx-nav-menu">
            <li><a href="#" class="stx-nav-link">Services</a></li>
            <li><a href="#" class="stx-nav-link active">Solutions</a></li>
        </ul>
        
        <!-- Production Demo Controls -->
        <div class="nav-controls">
            <!-- Language Switcher -->
            <select class="nav-select" onchange="switchLanguage(this.value)">
                <option value="en">🇬🇧 EN</option>
                <option value="cs">🇨🇿 CS</option>
                <option value="de">🇩🇪 DE</option>
                <option value="ar">🇦🇪 AR</option>
            </select>
            
            <!-- Theme Switcher -->
            <button class="nav-theme-btn" onclick="toggleThemeMenu()">🎨</button>
            
            <!-- Frontend Switcher -->
            <button class="nav-frontend-btn" onclick="toggleFrontendMenu()">⚡</button>
        </div>
        
        <a href="#" class="stx-cta-button">Get Started</a>
    </nav>
</header>
```

#### Navigation Menu (`.stx-nav-menu`)
- **Purpose**: Horizontal navigation links
- **Features**: Active states, hover effects
- **Responsive**: Hidden on mobile (<768px)

### 2. Button Components

#### Primary CTA Button (`.stx-cta-button`)
- **Purpose**: Main call-to-action buttons
- **Features**: Gradient background, hover animations, variant theming
- **Accessibility**: 44px minimum touch target

```html
<button class="stx-cta-button">Start Your Project</button>
<a href="/contact" class="stx-cta-button">Get Started</a>
```

#### Secondary Button (`.stx-secondary-button`)
- **Purpose**: Secondary actions
- **Features**: Outline style, hover fill effect

#### Submit Button (`.stx-submit-button`)
- **Purpose**: Form submissions
- **Features**: Full-width, larger padding, green gradient

### 3. Card Components

#### Service Card (`.stx-service-card`)
- **Purpose**: Service offerings display
- **Features**: Icon, title, description, CTA
- **Animation**: Hover lift effect

```html
<div class="stx-service-card">
    <div class="stx-service-card-icon">🚀</div>
    <h4 class="stx-service-card-title">AI-Powered Development</h4>
    <p class="stx-service-card-description">Transform your ideas...</p>
    <button class="stx-cta-button">Learn More</button>
</div>
```

#### Feature Card (`.stx-feature-card`)
- **Purpose**: Feature highlights
- **Features**: Icon + title, border hover effect

#### Value Card (`.stx-value-card`)
- **Purpose**: Company values, benefits
- **Features**: Centered layout, icon emphasis

#### Deliverable Card (`.stx-deliverable-card`)
- **Purpose**: Project deliverables
- **Features**: Left border accent, slide animation

### 4. Form Components

#### Form Group (`.stx-form-group`)
- **Purpose**: Form field organization
- **Features**: Consistent spacing, label association

```html
<div class="stx-form-group">
    <label class="stx-form-label" for="email">Email Address</label>
    <input type="email" class="stx-form-input" id="email" required>
</div>
```

#### Form Input (`.stx-form-input`)
- **Purpose**: Text inputs, textareas, selects
- **Features**: Focus states, validation styling
- **Accessibility**: Proper focus management

#### Form Row (`.stx-form-row`)
- **Purpose**: Horizontal field layout
- **Responsive**: Stacks on mobile

### 5. Layout Components

#### Hero Section (`.stx-hero`)
- **Purpose**: Landing page hero areas
- **Features**: Background patterns, gradient overlay
- **Content**: Title, subtitle, actions, trust indicators

```html
<section class="stx-hero">
    <div class="stx-hero-container">
        <div class="stx-hero-content">
            <h1 class="stx-hero-title">Transform Ideas into <span class="stx-highlight">AI-Powered Prototypes</span></h1>
            <p class="stx-hero-subtitle">Get working prototypes in 24-48 hours...</p>
            <div class="stx-hero-actions">
                <button class="stx-cta-button">Start Your Project</button>
                <button class="stx-secondary-button">View Examples</button>
            </div>
        </div>
    </div>
</section>
```

#### Trust Indicators (`.stx-trust-indicators`)
- **Purpose**: Build credibility with badges
- **Features**: Icon + text combinations
- **Examples**: "24-48h Delivery", "EU Compliant", "AI-Powered"

### 6. Typography Components

#### Heading Scale
- **H1** (`.stx-heading-1`): 3rem, 700 weight - Hero titles
- **H2** (`.stx-heading-2`): 2.25rem, 600 weight - Section titles  
- **H3** (`.stx-heading-3`): 1.875rem, 600 weight - Subsections
- **H4** (`.stx-heading-4`): 1.25rem, 600 weight - Component titles

#### Paragraph Variants
- **Large** (`.stx-paragraph-large`): 1.125rem - Hero subtitles
- **Regular** (`.stx-paragraph`): 1rem - Body text
- **Small** (`.stx-paragraph-small`): 0.875rem - Captions

#### Text Treatments
- **Highlight** (`.stx-text-highlight`): Gradient text effect
- **Muted** (`.stx-text-muted`): Secondary text color
- **Bold** (`.stx-text-bold`): Emphasized text

### 7. Interactive Components

#### Accordion (`.stx-accordion`)
- **Purpose**: FAQ sections, expandable content
- **Features**: Smooth animations, keyboard navigation
- **Accessibility**: ARIA states, focus management

```html
<div class="stx-accordion">
    <div class="stx-accordion-item">
        <button class="stx-accordion-header" onclick="toggleAccordion(this)">
            <span>What is included in the free prototype?</span>
            <span class="stx-accordion-icon">+</span>
        </button>
        <div class="stx-accordion-content">
            <p>Your free prototype includes...</p>
        </div>
    </div>
</div>
```

#### Progress Steps (`.stx-progress-steps`)
- **Purpose**: Process visualization
- **Features**: Completed, active, pending states
- **Responsive**: Vertical layout on mobile

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary-blue: #0066CC;
--primary-blue-light: #3385DD;
--primary-blue-dark: #004499;
--accent-green: #00CC66;
--accent-green-light: #33DD88;
--accent-green-dark: #009944;

/* Neutral Scale */
--gray-50: #F9FAFB;   /* Backgrounds */
--gray-100: #F3F4F6;  /* Light backgrounds */
--gray-200: #E5E7EB;  /* Borders */
--gray-300: #D1D5DB;  /* Disabled states */
--gray-400: #9CA3AF;  /* Placeholders */
--gray-500: #6B7280;  /* Secondary text */
--gray-600: #4B5563;  /* Body text */
--gray-700: #374151;  /* Headings */
--gray-800: #1F2937;  /* Dark text */
--gray-900: #111827;  /* Primary text */
```

### Typography Scale
```css
/* Font Sizes */
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
--font-size-5xl: 3rem;      /* 48px */
--font-size-6xl: 3.75rem;   /* 60px */
```

### Spacing System
```css
/* 8px baseline grid */
--space-xs: 8px;
--space-sm: 16px;
--space-md: 24px;
--space-lg: 32px;
--space-xl: 48px;
--space-2xl: 64px;
--space-3xl: 96px;
```

### Border Radius
```css
--radius-sm: 4px;    /* Small elements */
--radius-md: 8px;    /* Cards, inputs */
--radius-lg: 12px;   /* Large cards */
--radius-xl: 16px;   /* Hero sections */
--radius-full: 9999px; /* Pills, buttons */
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px
- **Large**: > 1200px

### Mobile Optimizations
- Navigation menu hidden, replaced with hamburger
- Form rows stack vertically
- Button groups become vertical
- Hero title reduces to 1.875rem
- Progress steps stack vertically
- Variant switcher becomes static

## ♿ Accessibility Features

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 ratio for normal text
- **Focus Management**: Visible focus indicators
- **Keyboard Navigation**: All interactive elements accessible
- **Screen Readers**: Semantic markup and ARIA labels
- **Touch Targets**: Minimum 44px for mobile

### Implementation Examples
```html
<!-- Proper labeling -->
<label class="stx-form-label" for="email">Email Address</label>
<input type="email" class="stx-form-input" id="email" aria-required="true">

<!-- Button accessibility -->
<button class="stx-cta-button" aria-label="Start your AI prototype project">
    Start Your Project
</button>

<!-- Accordion accessibility -->
<button class="stx-accordion-header" 
        aria-expanded="false" 
        aria-controls="content-1">
    What is included?
</button>
<div class="stx-accordion-content" id="content-1" role="region">
    Content here...
</div>
```

## 🚀 Performance Optimization

### CSS Architecture
- **CSS Custom Properties**: Easy theme switching
- **Critical CSS**: Above-the-fold styles prioritized
- **Lazy Loading**: Non-critical components deferred
- **GPU Acceleration**: Transform-based animations

### Bundle Size Targets
- **Critical CSS**: < 8.5KB
- **Total CSS**: < 25KB
- **JavaScript**: < 5KB
- **Total Component Library**: < 200KB

### Animation Performance
```css
/* Preferred properties for 60fps animations */
.stx-card:hover {
    transform: translateY(-2px); /* GPU accelerated */
    /* Avoid: top, left, width, height */
}

/* Optimal durations */
--transition-fast: 150ms;  /* Micro-interactions */
--transition-base: 300ms;  /* Standard transitions */
--transition-slow: 500ms;  /* Complex animations */
```

## 🔧 Implementation Guide

### Basic Setup
1. Include Inter font from Google Fonts
2. Add component-library.html styles to your project
3. Use `stx-` prefixed classes for components
4. Apply variant classes to body element

### Production Demo System Usage
```javascript
// Language switching with content translation
function switchLanguage(language) {
    document.documentElement.setAttribute('data-lang', language);
    updateContent(language); // Translates all text content
    trackDemoAction('language_switch', language);
}

// Theme switching with visual changes
function switchTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-european', 'theme-uae');
    if (theme !== 'light') {
        document.body.classList.add(`theme-${theme}`);
    }
    trackDemoAction('theme_switch', theme);
}

// Frontend variant switching with layout changes
function switchFrontend(frontend) {
    document.body.classList.remove('frontend-modern', 'frontend-classic', 'frontend-minimal', 'frontend-corporate');
    document.body.classList.add(`frontend-${frontend}`);
    showChangeNotification(`Frontend switched to ${frontend.toUpperCase()}! 🚀`);
    trackDemoAction('frontend_switch', frontend);
}

// Usage Examples
switchLanguage('cs'); // Switch to Czech with content translation
switchTheme('uae');   // Switch to UAE gold theme
switchFrontend('minimal'); // Switch to minimal design with notification
```

### Component Extraction
```javascript
// Get component CSS classes
const components = window.StatexComponentLibrary.getComponents();
console.log(components.buttons); // ['.stx-cta-button', '.stx-secondary-button', ...]

// Export specific component styles
window.StatexComponentLibrary.exportComponentCSS('navigation');
```

## 🧪 Testing Guidelines

### Component Testing
- **Visual Regression**: Test all variants for consistency
- **Responsive Testing**: Verify mobile/tablet/desktop layouts
- **Accessibility Testing**: Screen reader and keyboard navigation
- **Performance Testing**: Core Web Vitals compliance

### AB Testing Implementation
```html
<!-- Variant assignment -->
<body class="variant-b">
    <!-- Components automatically inherit variant styling -->
    <button class="stx-cta-button">Get Started</button>
</body>
```

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **CSS Features**: Custom properties, Grid, Flexbox
- **JavaScript**: ES6+ features used

## 🚀 Production Demo System - Sales Tool

### Marketing Power Features
The live demo system is designed as a powerful sales tool that will "wow" potential clients by showing real-time transformations:

#### 🎯 Client Demonstration Flow
1. **Language Switch** - Show international market reach
2. **Theme Change** - Demonstrate brand customization capabilities  
3. **Frontend Transformation** - Prove technical flexibility and expertise
4. **Real-time Updates** - Showcase development speed and efficiency

#### 💰 Sales Impact Strategy
- **Visual Shock Factor** - Instant transformations create "wow" moments
- **Technical Credibility** - Live switching proves development expertise
- **Market Reach** - Multi-language support shows global capabilities
- **Customization Power** - Theme variants demonstrate brand flexibility

#### 🎪 Demo Script for Sales
```
"Watch this - we can instantly switch your website to different markets..."
[Switch language to Arabic with RTL layout]

"Need a different brand feel? No problem..."
[Switch from Light to UAE gold theme]

"Want a completely different design approach? Here..."
[Switch from Modern to Corporate frontend]

"All of this happens in real-time, just like your users will experience."
```

## 📊 Analytics Integration

### Advanced Demo Tracking
```javascript
// Track complete demo state changes
function trackDemoAction(action, value) {
    gtag('event', 'demo_interaction', {
        event_category: 'Live_Demo',
        event_label: `${action}_${value}`,
        custom_parameter_state: JSON.stringify({
            language: currentState.language,
            theme: currentState.theme,
            frontend: currentState.frontend
        })
    });
}

// Track client demo sessions
gtag('event', 'demo_session_start', {
    event_category: 'Sales_Demo',
    event_label: 'client_presentation'
});
```

## 🔄 Maintenance & Updates

### Version Control
- **Component Versioning**: Track component changes
- **Variant Updates**: Maintain consistency across variants
- **Performance Monitoring**: Regular Core Web Vitals checks
- **Accessibility Audits**: Quarterly compliance reviews

### Future Enhancements
- **Additional Variants**: Market-specific customizations
- **Component Extensions**: New interactive elements
- **Performance Optimizations**: Further bundle size reduction
- **Advanced Animations**: Enhanced micro-interactions

---

## 📞 Support & Contribution

For questions, improvements, or bug reports related to the Component Library:
- Review implementation in `docs/design/mockups/component-library.html`
- Check design specifications in `docs/design/layout-specifications.md`
- Reference AB testing system in `docs/design/seo-ab-testing-system.md`

**Last Updated**: Milestone 4 Implementation
**Total Components**: 50+
**Supported Variants**: 5
**Browser Compatibility**: Modern browsers (95%+ global support) 