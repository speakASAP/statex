# CSS Variables Reference Guide

## Overview
This document provides a comprehensive reference for all CSS custom properties (variables) used in the StateX frontend. The variables follow a semantic naming convention with `--stx-` prefixes and are organized by category.

## Table of Contents
- [Color System](#color-system)
- [Spacing System](#spacing-system)
- [Typography System](#typography-system)
- [Component Variables](#component-variables)
- [Theme Variables](#theme-variables)
- [Layout Variables](#layout-variables)
- [Animation Variables](#animation-variables)
- [Usage Examples](#usage-examples)

## Color System

### Semantic Colors
```css
/* Surface Colors */
--stx-color-surface-primary: #FFFFFF;      /* Main background */
--stx-color-surface-secondary: #F9FAFB;   /* Secondary background */
--stx-color-surface-tertiary: #F3F4F6;    /* Tertiary background */
--stx-color-surface-overlay: rgba(0, 0, 0, 0.5); /* Modal overlays */

/* Text Colors */
--stx-color-text-primary: #111827;        /* Primary text */
--stx-color-text-secondary: #6B7280;      /* Secondary text */
--stx-color-text-tertiary: #9CA3AF;       /* Tertiary text */
--stx-color-text-inverse: #FFFFFF;        /* Text on dark backgrounds */
--stx-color-text-muted: #D1D5DB;          /* Muted text */

/* Action Colors */
--stx-color-action-primary: #3B82F6;      /* Primary buttons */
--stx-color-action-secondary: #6B7280;    /* Secondary buttons */
--stx-color-action-success: #10B981;      /* Success states */
--stx-color-action-warning: #F59E0B;      /* Warning states */
--stx-color-action-error: #EF4444;        /* Error states */
--stx-color-action-info: #06B6D4;         /* Info states */

/* Border Colors */
--stx-color-border-primary: #E5E7EB;      /* Primary borders */
--stx-color-border-secondary: #F3F4F6;    /* Secondary borders */
--stx-color-border-focus: #3B82F6;        /* Focus states */
--stx-color-border-error: #EF4444;        /* Error borders */

/* Status Colors */
--stx-color-status-success: #10B981;      /* Success indicators */
--stx-color-status-warning: #F59E0B;      /* Warning indicators */
--stx-color-status-error: #EF4444;        /* Error indicators */
--stx-color-status-info: #06B6D4;         /* Info indicators */
```

### Theme-Specific Colors
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
  --stx-color-text-primary: #F9FAFB;
  --stx-color-border-primary: #374151;
}

/* EU Theme */
[data-theme="eu"] {
  --stx-color-action-primary: #2563EB;
  --stx-color-action-secondary: #4B5563;
}

/* UAE Theme */
[data-theme="uae"] {
  --stx-color-action-primary: #059669;
  --stx-color-action-secondary: #6B7280;
}
```

## Spacing System

### Base Spacing
```css
/* Spacing Scale */
--stx-space-xs: 8px;      /* Extra small spacing */
--stx-space-sm: 16px;     /* Small spacing */
--stx-space-md: 24px;     /* Medium spacing */
--stx-space-lg: 32px;     /* Large spacing */
--stx-space-xl: 48px;     /* Extra large spacing */
--stx-space-2xl: 64px;    /* 2X large spacing */
--stx-space-3xl: 96px;    /* 3X large spacing */

/* Legacy Spacing (for backward compatibility) */
--space-xs: 8px;
--space-sm: 16px;
--space-md: 24px;
--space-lg: 32px;
--space-xl: 48px;
--space-2xl: 64px;
--space-3xl: 96px;
```

### Component Spacing
```css
/* Padding */
--stx-padding-xs: var(--stx-space-xs);
--stx-padding-sm: var(--stx-space-sm);
--stx-padding-md: var(--stx-space-md);
--stx-padding-lg: var(--stx-space-lg);
--stx-padding-xl: var(--stx-space-xl);

/* Margin */
--stx-margin-xs: var(--stx-space-xs);
--stx-margin-sm: var(--stx-space-sm);
--stx-margin-md: var(--stx-space-md);
--stx-margin-lg: var(--stx-space-lg);
--stx-margin-xl: var(--stx-space-xl);

/* Gap */
--stx-gap-xs: var(--stx-space-xs);
--stx-gap-sm: var(--stx-space-sm);
--stx-gap-md: var(--stx-space-md);
--stx-gap-lg: var(--stx-space-lg);
--stx-gap-xl: var(--stx-space-xl);
```

## Typography System

### Font Sizes
```css
/* Font Size Scale */
--stx-font-size-xs: 0.75rem;    /* 12px */
--stx-font-size-sm: 0.875rem;   /* 14px */
--stx-font-size-base: 1rem;     /* 16px */
--stx-font-size-lg: 1.125rem;   /* 18px */
--stx-font-size-xl: 1.25rem;    /* 20px */
--stx-font-size-2xl: 1.5rem;    /* 24px */
--stx-font-size-3xl: 1.875rem;  /* 30px */
--stx-font-size-4xl: 2.25rem;   /* 36px */
--stx-font-size-5xl: 3rem;      /* 48px */
--stx-font-size-6xl: 3.75rem;   /* 60px */
```

### Font Weights
```css
/* Font Weight Scale */
--stx-font-weight-light: 300;
--stx-font-weight-normal: 400;
--stx-font-weight-medium: 500;
--stx-font-weight-semibold: 600;
--stx-font-weight-bold: 700;
--stx-font-weight-extrabold: 800;
```

### Line Heights
```css
/* Line Height Scale */
--stx-line-height-tight: 1.25;
--stx-line-height-snug: 1.375;
--stx-line-height-normal: 1.5;
--stx-line-height-relaxed: 1.625;
--stx-line-height-loose: 2;
```

### Letter Spacing
```css
/* Letter Spacing Scale */
--stx-letter-spacing-tighter: -0.05em;
--stx-letter-spacing-tight: -0.025em;
--stx-letter-spacing-normal: 0em;
--stx-letter-spacing-wide: 0.025em;
--stx-letter-spacing-wider: 0.05em;
--stx-letter-spacing-widest: 0.1em;
```

## Component Variables

### Button Component
```css
/* Button Base */
--stx-button-bg: var(--stx-color-action-primary);
--stx-button-text: var(--stx-color-text-inverse);
--stx-button-border: transparent;
--stx-button-radius: 8px;
--stx-button-padding: var(--stx-padding-sm) var(--stx-padding-md);

/* Button Variants */
--stx-button-primary-bg: var(--stx-color-action-primary);
--stx-button-secondary-bg: var(--stx-color-action-secondary);
--stx-button-ghost-bg: transparent;
--stx-button-outline-bg: transparent;
--stx-button-cta-bg: var(--stx-color-action-success);

/* Button States */
--stx-button-hover-bg: var(--stx-color-action-primary);
--stx-button-active-bg: var(--stx-color-action-primary);
--stx-button-disabled-bg: var(--stx-color-text-muted);
--stx-button-disabled-text: var(--stx-color-text-tertiary);
```

### Input Component
```css
/* Input Base */
--stx-input-bg: var(--stx-color-surface-primary);
--stx-input-text: var(--stx-color-text-primary);
--stx-input-border: var(--stx-color-border-primary);
--stx-input-radius: 6px;
--stx-input-padding: var(--stx-padding-sm);

/* Input States */
--stx-input-focus-border: var(--stx-color-border-focus);
--stx-input-error-border: var(--stx-color-border-error);
--stx-input-disabled-bg: var(--stx-color-surface-secondary);
--stx-input-disabled-text: var(--stx-color-text-tertiary);
```

### Card Component
```css
/* Card Base */
--stx-card-bg: var(--stx-color-surface-primary);
--stx-card-border: var(--stx-color-border-primary);
--stx-card-radius: 12px;
--stx-card-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
--stx-card-padding: var(--stx-padding-md);

/* Card Variants */
--stx-card-elevated-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--stx-card-interactive-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
```

### Modal Component
```css
/* Modal Base */
--stx-modal-bg: var(--stx-color-surface-primary);
--stx-modal-overlay: var(--stx-color-surface-overlay);
--stx-modal-radius: 12px;
--stx-modal-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
--stx-modal-padding: var(--stx-padding-lg);

/* Modal Backdrop */
--stx-modal-backdrop-bg: rgba(0, 0, 0, 0.5);
--stx-modal-backdrop-blur: blur(4px);
```

## Theme Variables

### Theme Detection
```css
/* Theme Detection Variables */
--stx-theme-auto: auto;
--stx-theme-light: light;
--stx-theme-dark: dark;
--stx-theme-eu: eu;
--stx-theme-uae: uae;
```

### Theme Transitions
```css
/* Theme Transition Variables */
--stx-transition-duration: 0.3s;
--stx-transition-timing: ease;
--stx-transition-property: all;
```

## Layout Variables

### Container Sizes
```css
/* Container Breakpoints */
--stx-container-sm: 640px;
--stx-container-md: 768px;
--stx-container-lg: 1024px;
--stx-container-xl: 1280px;
--stx-container-2xl: 1536px;

/* Container Padding */
--stx-container-padding: var(--stx-padding-md);
```

### Grid System
```css
/* Grid Variables */
--stx-grid-columns: 12;
--stx-grid-gap: var(--stx-gap-md);
--stx-grid-gap-sm: var(--stx-gap-sm);
--stx-grid-gap-lg: var(--stx-gap-lg);
```

### Z-Index Scale
```css
/* Z-Index Scale */
--stx-z-dropdown: 1000;
--stx-z-sticky: 1020;
--stx-z-fixed: 1030;
--stx-z-modal-backdrop: 1040;
--stx-z-modal: 1050;
--stx-z-popover: 1060;
--stx-z-tooltip: 1070;
```

## Animation Variables

### Duration
```css
/* Animation Duration */
--stx-duration-75: 75ms;
--stx-duration-100: 100ms;
--stx-duration-150: 150ms;
--stx-duration-200: 200ms;
--stx-duration-300: 300ms;
--stx-duration-500: 500ms;
--stx-duration-700: 700ms;
--stx-duration-1000: 1000ms;
```

### Easing
```css
/* Animation Easing */
--stx-ease-linear: linear;
--stx-ease-in: cubic-bezier(0.4, 0, 1, 1);
--stx-ease-out: cubic-bezier(0, 0, 0.2, 1);
--stx-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Keyframes
```css
/* Common Animations */
@keyframes stx-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes stx-slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes stx-scale-in {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

## Usage Examples

### Basic Component Styling
```css
.stx-button {
  background-color: var(--stx-button-bg);
  color: var(--stx-button-text);
  padding: var(--stx-button-padding);
  border-radius: var(--stx-button-radius);
  border: 1px solid var(--stx-button-border);
  transition: all var(--stx-transition-duration) var(--stx-transition-timing);
}

.stx-button:hover {
  background-color: var(--stx-button-hover-bg);
}
```

### Responsive Design
```css
.stx-container {
  max-width: var(--stx-container-lg);
  margin: 0 auto;
  padding: 0 var(--stx-container-padding);
}

@media (max-width: 768px) {
  .stx-container {
    max-width: var(--stx-container-md);
    padding: 0 var(--stx-padding-sm);
  }
}
```

### Theme-Aware Components
```css
.stx-card {
  background-color: var(--stx-card-bg);
  border: 1px solid var(--stx-card-border);
  box-shadow: var(--stx-card-shadow);
  border-radius: var(--stx-card-radius);
  padding: var(--stx-card-padding);
}

/* Dark theme adjustments */
[data-theme="dark"] .stx-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}
```

### Dynamic Class Generation
```typescript
// Using componentClasses utility
const buttonClasses = componentClasses('stx-button', {
  variant: 'primary',
  size: 'md',
  disabled: false
});

// Result: "stx-button stx-button--primary stx-button--md"
```

## Best Practices

### 1. Use Semantic Variables
```css
/* ✅ Good - Semantic naming */
background-color: var(--stx-color-surface-primary);

/* ❌ Bad - Hardcoded values */
background-color: #FFFFFF;
```

### 2. Leverage Theme Context
```css
/* ✅ Good - Theme-aware */
color: var(--stx-color-text-primary);

/* ❌ Bad - Theme-specific */
[data-theme="light"] { color: #111827; }
[data-theme="dark"] { color: #F9FAFB; }
```

### 3. Use Consistent Spacing
```css
/* ✅ Good - Consistent spacing */
margin-bottom: var(--stx-margin-md);
padding: var(--stx-padding-lg);

/* ❌ Bad - Inconsistent spacing */
margin-bottom: 24px;
padding: 32px;
```

### 4. Maintain Accessibility
```css
/* ✅ Good - High contrast */
color: var(--stx-color-text-primary);
background-color: var(--stx-color-surface-primary);

/* ✅ Good - Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  transition: none;
}
```

## Migration Guide

### From Hardcoded Values
```css
/* Before */
.button {
  background-color: #3B82F6;
  color: #FFFFFF;
  padding: 16px 24px;
  border-radius: 8px;
}

/* After */
.stx-button {
  background-color: var(--stx-button-bg);
  color: var(--stx-button-text);
  padding: var(--stx-button-padding);
  border-radius: var(--stx-button-radius);
}
```

### From Theme-Specific Styles
```css
/* Before */
[data-theme="light"] .card { background: #FFFFFF; }
[data-theme="dark"] .card { background: #111827; }

/* After */
.stx-card {
  background-color: var(--stx-card-bg);
}
```

## Troubleshooting

### Common Issues

1. **Variable Not Defined**
   ```css
   /* Check if variable exists in design-tokens.css */
   background-color: var(--stx-color-surface-primary);
   ```

2. **Theme Not Applied**
   ```css
   /* Ensure theme attribute is set on html element */
   document.documentElement.setAttribute('data-theme', 'dark');
   ```

3. **Fallback Values**
   ```css
   /* Use fallback values for critical properties */
   background-color: var(--stx-color-surface-primary, #FFFFFF);
   ```

### Debug Tools

1. **CSS Variable Inspector**
   ```javascript
   // Check all STX variables
   const styles = getComputedStyle(document.documentElement);
   console.log(styles.getPropertyValue('--stx-color-surface-primary'));
   ```

2. **Theme Detection**
   ```javascript
   // Check current theme
   console.log(document.documentElement.getAttribute('data-theme'));
   ```

## Conclusion

This CSS variables reference guide provides a comprehensive overview of the StateX design system. By using these semantic variables consistently, you can:

- **Maintain consistency** across all components
- **Support multiple themes** seamlessly
- **Improve accessibility** with proper contrast ratios
- **Enable rapid prototyping** with standardized values
- **Reduce maintenance overhead** with centralized design tokens

For questions or contributions to this guide, please refer to the development team or update the documentation accordingly. 

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

## Border Radius System

### Border Radius Scale
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