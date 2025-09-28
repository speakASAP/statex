# Frontend Design Tokens Reference

**Related documentation:**
- [Frontend README (Design Section)](frontend-readme.md)
- [CSS Variables Reference Guide](../development/css-variables-reference.md)
- [CSS Quick Reference](../development/css-quick-reference.md)
- [Development Rules](../development/development-rules.md)
- [General Design Overview](design.md)
- [Design Concept](design-concept.md)
- [Brand Guidelines](brand-guidelines.md)
- [Component Library Documentation](component-library-documentation.md)
- [Design System Summary](design-system-summary.md)
- [Layout Specifications](layout-specifications.md)
- [Animation System](animation-system.md)
- [Graphics Specifications](graphics-specifications.md)

---

# StateX Design Tokens System

## Overview

The StateX frontend uses a comprehensive design token system implemented as CSS custom properties (variables) with semantic naming conventions. This system provides consistent design values across the entire application and supports multiple themes for EU and UAE markets.

## Architecture

### CSS Custom Properties System
- **Location**: `frontend/src/styles/design-tokens.css`
- **Naming Convention**: All variables use `--stx-` prefixes for semantic organization
- **Purpose**: Centralized design tokens with runtime theming support
- **Benefits**: Theme switching, accessibility support, reduced maintenance overhead

### Design System Integration
- **Primary Source**: [CSS Variables Reference Guide](../development/css-variables-reference.md)
- **Brand Guidelines**: [Brand Guidelines](brand-guidelines.md)
- **Animation System**: [Animation System](animation-system.md)
- **Graphics Strategy**: [Graphics Specifications](graphics-specifications.md)

## Color System

### Semantic Color Variables
The StateX technology-focused color system uses semantic naming for better maintainability and theme switching:

```css
:root {
  /* Surface Colors - Backgrounds and containers */
  --stx-color-surface-primary: #FFFFFF;      /* Main background */
  --stx-color-surface-secondary: #F9FAFB;    /* Secondary background */
  --stx-color-surface-tertiary: #F3F4F6;     /* Tertiary background */
  --stx-color-surface-overlay: rgba(0, 0, 0, 0.5); /* Modal overlays */

  /* Text Colors - All text content */
  --stx-color-text-primary: #111827;         /* Primary text */
  --stx-color-text-secondary: #6B7280;       /* Secondary text */
  --stx-color-text-tertiary: #9CA3AF;        /* Tertiary text */
  --stx-color-text-inverse: #FFFFFF;         /* Text on dark backgrounds */
  --stx-color-text-muted: #D1D5DB;           /* Muted text */

  /* Action Colors - Interactive elements */
  --stx-color-action-primary: #3B82F6;       /* Primary buttons */
  --stx-color-action-secondary: #6B7280;     /* Secondary buttons */
  --stx-color-action-success: #10B981;       /* Success states */
  --stx-color-action-warning: #F59E0B;       /* Warning states */
  --stx-color-action-error: #EF4444;         /* Error states */
  --stx-color-action-info: #06B6D4;          /* Info states */

  /* Border Colors - All borders and dividers */
  --stx-color-border-primary: #E5E7EB;       /* Primary borders */
  --stx-color-border-secondary: #F3F4F6;     /* Secondary borders */
  --stx-color-border-focus: #3B82F6;         /* Focus states */
  --stx-color-border-error: #EF4444;         /* Error borders */
}
```

### Theme-Specific Color Overrides
StateX supports four themes with color overrides:

```css
/* Light Theme (Default) */
[data-theme="light"] {
  --stx-color-surface-primary: #FFFFFF;
  --stx-color-text-primary: #111827;
  --stx-color-border-primary: #E5E7EB;
}

/* Dark Theme */
[data-theme="dark"] {
  --stx-color-surface-primary: #111827;
  --stx-color-surface-secondary: #1F2937;
  --stx-color-text-primary: #F9FAFB;
  --stx-color-text-secondary: #D1D5DB;
  --stx-color-border-primary: #374151;
}

/* EU Theme - Professional blue focus */
[data-theme="eu"] {
  --stx-color-action-primary: #2563EB;
  --stx-color-action-secondary: #4B5563;
  --stx-color-border-focus: #2563EB;
}

/* UAE Theme - Professional green focus */
[data-theme="uae"] {
  --stx-color-action-primary: #059669;
  --stx-color-action-secondary: #6B7280;
  --stx-color-border-focus: #059669;
}
```

### Usage Examples
```css
/* Component styling with semantic variables */
.stx-button--primary {
  background-color: var(--stx-color-action-primary);
  color: var(--stx-color-text-inverse);
  border: 1px solid var(--stx-color-action-primary);
}

/* Theme-aware card component */
.stx-card {
  background-color: var(--stx-color-surface-primary);
  color: var(--stx-color-text-primary);
  border: 1px solid var(--stx-color-border-primary);
}
```

## Typography System

### Font Family Variables
```css
:root {
  /* Primary Font Stack */
  --stx-font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  
  /* System Font Stack (fallback) */
  --stx-font-family-system: system-ui, -apple-system, sans-serif;
  
  /* Arabic Support for UAE Market */
  --stx-font-family-arabic: 'Noto Sans Arabic', 'Arabic UI Display', 'Tahoma', sans-serif;
  
  /* Monospace for code */
  --stx-font-family-mono: 'JetBrains Mono', 'Consolas', 'Monaco', monospace;
}
```

### Typography Scale
StateX uses a modular typography scale for consistent text sizing:

```css
:root {
  /* Font Size Scale */
  --stx-font-size-xs: 0.75rem;     /* 12px - Micro text */
  --stx-font-size-sm: 0.875rem;    /* 14px - Small text */
  --stx-font-size-base: 1rem;      /* 16px - Body text */
  --stx-font-size-lg: 1.125rem;    /* 18px - Large body */
  --stx-font-size-xl: 1.25rem;     /* 20px - Card headlines */
  --stx-font-size-2xl: 1.5rem;     /* 24px - Subsection headlines */
  --stx-font-size-3xl: 1.875rem;   /* 30px - Section headlines */
  --stx-font-size-4xl: 2.25rem;    /* 36px - Page headlines */
  --stx-font-size-5xl: 3rem;       /* 48px - Hero headlines */
  --stx-font-size-6xl: 3.75rem;    /* 60px - Display headlines */

  /* Font Weight Scale */
  --stx-font-weight-light: 300;     /* Subtle text */
  --stx-font-weight-normal: 400;    /* Body text */
  --stx-font-weight-medium: 500;    /* Emphasized text */
  --stx-font-weight-semibold: 600;  /* Subheadings */
  --stx-font-weight-bold: 700;      /* Headlines */
  --stx-font-weight-extrabold: 800; /* Display text */

  /* Line Height Scale */
  --stx-line-height-tight: 1.25;    /* Headlines */
  --stx-line-height-snug: 1.375;    /* Subheadings */
  --stx-line-height-normal: 1.5;    /* Body text */
  --stx-line-height-relaxed: 1.625; /* Large text */
  --stx-line-height-loose: 2;       /* Spacing emphasis */

  /* Letter Spacing Scale */
  --stx-letter-spacing-tighter: -0.05em;
  --stx-letter-spacing-tight: -0.025em;
  --stx-letter-spacing-normal: 0em;
  --stx-letter-spacing-wide: 0.025em;
  --stx-letter-spacing-wider: 0.05em;
  --stx-letter-spacing-widest: 0.1em;
}
```

### Typography Usage Examples
```css
/* Hero title styling */
.stx-text--hero {
  font-family: var(--stx-font-family-primary);
  font-size: var(--stx-font-size-5xl);
  font-weight: var(--stx-font-weight-bold);
  line-height: var(--stx-line-height-tight);
  letter-spacing: var(--stx-letter-spacing-tight);
}

/* Body text styling */
.stx-text--body {
  font-family: var(--stx-font-family-primary);
  font-size: var(--stx-font-size-base);
  font-weight: var(--stx-font-weight-normal);
  line-height: var(--stx-line-height-normal);
}

/* Arabic text support */
[dir="rtl"] .stx-text {
  font-family: var(--stx-font-family-arabic);
}
```

## Spacing System

### 8px Baseline Grid
StateX uses an 8px baseline grid system for consistent spacing across all components:

```css
:root {
  /* Base Spacing Scale */
  --stx-space-xs: 8px;      /* Extra small spacing */
  --stx-space-sm: 16px;     /* Small spacing */
  --stx-space-md: 24px;     /* Medium spacing */
  --stx-space-lg: 32px;     /* Large spacing */
  --stx-space-xl: 48px;     /* Extra large spacing */
  --stx-space-2xl: 64px;    /* 2X large spacing */
  --stx-space-3xl: 96px;    /* 3X large spacing */

  /* Component-Specific Spacing */
  --stx-padding-xs: var(--stx-space-xs);
  --stx-padding-sm: var(--stx-space-sm);
  --stx-padding-md: var(--stx-space-md);
  --stx-padding-lg: var(--stx-space-lg);
  --stx-padding-xl: var(--stx-space-xl);

  --stx-margin-xs: var(--stx-space-xs);
  --stx-margin-sm: var(--stx-space-sm);
  --stx-margin-md: var(--stx-space-md);
  --stx-margin-lg: var(--stx-space-lg);
  --stx-margin-xl: var(--stx-space-xl);

  --stx-gap-xs: var(--stx-space-xs);
  --stx-gap-sm: var(--stx-space-sm);
  --stx-gap-md: var(--stx-space-md);
  --stx-gap-lg: var(--stx-space-lg);
  --stx-gap-xl: var(--stx-space-xl);
}
```

### Spacing Usage Examples
```css
/* Card component spacing */
.stx-card {
  padding: var(--stx-padding-lg);
  margin-bottom: var(--stx-margin-md);
  gap: var(--stx-gap-md);
}

/* Section spacing */
.stx-section {
  padding: var(--stx-padding-2xl) 0;
  margin-bottom: var(--stx-margin-xl);
}

/* Form group spacing */
.stx-form-group {
  margin-bottom: var(--stx-margin-md);
  gap: var(--stx-gap-sm);
}
```

## Border Radius System

### Consistent Border Radius Scale
```css
:root {
  /* Border Radius Scale */
  --stx-radius-none: 0px;        /* No radius */
  --stx-radius-sm: 4px;          /* Small elements */
  --stx-radius-md: 6px;          /* Standard elements */
  --stx-radius-lg: 8px;          /* Inputs and buttons */
  --stx-radius-xl: 12px;         /* Cards and containers */
  --stx-radius-2xl: 16px;        /* Large containers */
  --stx-radius-3xl: 24px;        /* Hero containers */
  --stx-radius-full: 9999px;     /* Pills and badges */
}
```

### Border Radius Usage Examples
```css
/* Button styling */
.stx-button {
  border-radius: var(--stx-radius-lg);
}

/* Card styling */
.stx-card {
  border-radius: var(--stx-radius-xl);
}

/* Input styling */
.stx-input {
  border-radius: var(--stx-radius-md);
}

/* Badge styling */
.stx-badge {
  border-radius: var(--stx-radius-full);
}
```

## Shadow System

### Layered Shadow Scale
```css
:root {
  /* Shadow System */
  --stx-shadow-none: none;
  --stx-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --stx-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --stx-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --stx-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --stx-shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --stx-shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}
```

### Shadow Usage Examples
```css
/* Card with subtle shadow */
.stx-card {
  box-shadow: var(--stx-shadow-sm);
}

/* Card hover state */
.stx-card:hover {
  box-shadow: var(--stx-shadow-md);
}

/* Modal shadow */
.stx-modal {
  box-shadow: var(--stx-shadow-2xl);
}

/* Inset input shadow */
.stx-input {
  box-shadow: var(--stx-shadow-inner);
}
```

## Transition System

### Animation Duration and Easing
```css
:root {
  /* Animation Duration */
  --stx-duration-75: 75ms;
  --stx-duration-100: 100ms;
  --stx-duration-150: 150ms;
  --stx-duration-200: 200ms;
  --stx-duration-300: 300ms;
  --stx-duration-500: 500ms;
  --stx-duration-700: 700ms;
  --stx-duration-1000: 1000ms;

  /* Animation Easing */
  --stx-ease-linear: linear;
  --stx-ease-in: cubic-bezier(0.4, 0, 1, 1);
  --stx-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --stx-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --stx-ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* Common Transitions */
  --stx-transition-fast: all var(--stx-duration-150) var(--stx-ease-out);
  --stx-transition-normal: all var(--stx-duration-300) var(--stx-ease-in-out);
  --stx-transition-slow: all var(--stx-duration-500) var(--stx-ease-in-out);
}
```

### Transition Usage Examples
```css
/* Button transitions */
.stx-button {
  transition: var(--stx-transition-normal);
}

/* Fast hover transitions */
.stx-card:hover {
  transition: var(--stx-transition-fast);
}

/* Theme transition */
* {
  transition: background-color var(--stx-duration-300) var(--stx-ease-in-out),
              color var(--stx-duration-300) var(--stx-ease-in-out),
              border-color var(--stx-duration-300) var(--stx-ease-in-out);
}
```

## Component-Specific Variables

### Button Component Variables
```css
:root {
  /* Button Base */
  --stx-button-bg: var(--stx-color-action-primary);
  --stx-button-text: var(--stx-color-text-inverse);
  --stx-button-border: var(--stx-color-action-primary);
  --stx-button-radius: var(--stx-radius-lg);
  --stx-button-padding: var(--stx-padding-sm) var(--stx-padding-md);
  --stx-button-shadow: var(--stx-shadow-sm);

  /* Button Variants */
  --stx-button-primary-bg: var(--stx-color-action-primary);
  --stx-button-secondary-bg: var(--stx-color-action-secondary);
  --stx-button-ghost-bg: transparent;
  --stx-button-outline-bg: transparent;
  --stx-button-cta-bg: var(--stx-color-action-success);

  /* Button States */
  --stx-button-hover-shadow: var(--stx-shadow-md);
  --stx-button-active-shadow: var(--stx-shadow-inner);
  --stx-button-disabled-bg: var(--stx-color-text-muted);
  --stx-button-disabled-text: var(--stx-color-text-tertiary);
}
```

### Input Component Variables
```css
:root {
  /* Input Base */
  --stx-input-bg: var(--stx-color-surface-primary);
  --stx-input-text: var(--stx-color-text-primary);
  --stx-input-border: var(--stx-color-border-primary);
  --stx-input-radius: var(--stx-radius-md);
  --stx-input-padding: var(--stx-padding-sm);
  --stx-input-shadow: var(--stx-shadow-inner);

  /* Input States */
  --stx-input-focus-border: var(--stx-color-border-focus);
  --stx-input-focus-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  --stx-input-error-border: var(--stx-color-border-error);
  --stx-input-error-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
  --stx-input-disabled-bg: var(--stx-color-surface-secondary);
  --stx-input-disabled-text: var(--stx-color-text-tertiary);
}
```

### Card Component Variables
```css
:root {
  /* Card Base */
  --stx-card-bg: var(--stx-color-surface-primary);
  --stx-card-border: var(--stx-color-border-primary);
  --stx-card-radius: var(--stx-radius-xl);
  --stx-card-shadow: var(--stx-shadow-sm);
  --stx-card-padding: var(--stx-padding-lg);

  /* Card Variants */
  --stx-card-elevated-shadow: var(--stx-shadow-lg);
  --stx-card-interactive-shadow: var(--stx-shadow-md);
  --stx-card-interactive-hover-shadow: var(--stx-shadow-xl);
}
```

## Layout Variables

### Container and Grid System
```css
:root {
  /* Container Breakpoints */
  --stx-container-sm: 640px;
  --stx-container-md: 768px;
  --stx-container-lg: 1024px;
  --stx-container-xl: 1280px;
  --stx-container-2xl: 1536px;

  /* Container Padding */
  --stx-container-padding: var(--stx-padding-md);
  --stx-container-padding-sm: var(--stx-padding-sm);
  --stx-container-padding-lg: var(--stx-padding-lg);

  /* Grid System */
  --stx-grid-columns: 12;
  --stx-grid-gap: var(--stx-gap-md);
  --stx-grid-gap-sm: var(--stx-gap-sm);
  --stx-grid-gap-lg: var(--stx-gap-lg);

  /* Z-Index Scale */
  --stx-z-dropdown: 1000;
  --stx-z-sticky: 1020;
  --stx-z-fixed: 1030;
  --stx-z-modal-backdrop: 1040;
  --stx-z-modal: 1050;
  --stx-z-popover: 1060;
  --stx-z-tooltip: 1070;
}
```

## Usage Guidelines

### Best Practices
1. **Use Semantic Variables**: Always use semantic variable names (e.g., `--stx-color-surface-primary`) instead of hardcoded values
2. **Theme Awareness**: Ensure all components work across all themes (light, dark, eu, uae)
3. **Consistent Spacing**: Use the 8px baseline grid for all spacing decisions
4. **Accessibility**: Support high contrast, reduced motion, and RTL reading directions
5. **Performance**: Leverage CSS variable inheritance for efficient styling

### Component Development Pattern
```css
/* Component base class */
.stx-component {
  /* Use semantic variables */
  background-color: var(--stx-component-bg);
  color: var(--stx-component-text);
  padding: var(--stx-component-padding);
  border-radius: var(--stx-component-radius);
  
  /* Include transition for theme switching */
  transition: var(--stx-transition-normal);
}

/* Component variants using BEM methodology */
.stx-component--primary {
  background-color: var(--stx-color-action-primary);
  color: var(--stx-color-text-inverse);
}

/* Component states */
.stx-component:hover {
  box-shadow: var(--stx-component-hover-shadow);
  transform: translateY(-1px);
}

.stx-component:focus-visible {
  outline: 2px solid var(--stx-color-border-focus);
  outline-offset: 2px;
}
```

## Migration Guide

### From Legacy Variables
If migrating from older variable names, use this mapping:

```css
/* Old → New */
--primary-blue → --stx-color-action-primary
--accent-green → --stx-color-action-success
--gray-50 → --stx-color-surface-secondary
--gray-900 → --stx-color-text-primary
--space-xs → --stx-space-xs (unchanged)
--radius-sm → --stx-radius-sm (unchanged)
```

### Theme Migration
```css
/* Old theme approach */
.light-theme { color: #111827; }
.dark-theme { color: #F9FAFB; }

/* New theme approach */
.stx-text {
  color: var(--stx-color-text-primary);
}
```

## Accessibility Considerations

### High Contrast Support
```css
@media (prefers-contrast: high) {
  :root {
    --stx-color-border-primary: #000000;
    --stx-color-text-primary: #000000;
  }
}
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
```

### RTL Support for UAE Market
```css
[dir="rtl"] {
  font-family: var(--stx-font-family-arabic);
}

[dir="rtl"] .stx-component {
  text-align: right;
}
```

## Conclusion

The StateX design token system provides a robust foundation for consistent, maintainable, and accessible UI development. By using semantic CSS variables with the `--stx-` prefix, we ensure:

- **Consistency** across all components and themes
- **Maintainability** through centralized design decisions
- **Accessibility** with support for user preferences
- **Performance** through efficient CSS variable usage
- **Scalability** for future design system evolution

For detailed implementation guidelines and examples, refer to the [CSS Variables Reference Guide](../development/css-variables-reference.md) and [Development Rules](../development/development-rules.md). 