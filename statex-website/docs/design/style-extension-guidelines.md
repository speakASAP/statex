# Style Extension Guidelines & Naming Conventions

> **Related Documentation**  
> - [Design System Overview](design-system-summary.md)  
> - [Component Library](component-library-documentation.md)  
> - [Design Standards](design-standards.md)  
> - [Color System](colors.md)  
> - [Brand Guidelines](brand-guidelines.md)  
> - [Animation System](animation-system.md)

## Table of Contents

## Table of Contents
- [1. Introduction](#1-introduction)
- [2. Naming Conventions](#2-naming-conventions)
- [3. Component Architecture](#3-component-architecture)
- [4. Theming System](#4-theming-system)
- [5. Responsive Design](#5-responsive-design)
- [6. Accessibility](#6-accessibility)
- [7. CSS Organization](#7-css-organization)
- [8. Best Practices](#8-best-practices)

## 1. Introduction

This document outlines the style extension guidelines and naming conventions for the Statex design system. These standards ensure consistency, maintainability, and scalability across all components.

> **Note**: These guidelines work in conjunction with our [Design Standards](design-standards.md) and [Component Library](component-library-documentation.md) documentation.

## 2. Naming Conventions

### 2.1 Class Naming
- Use lowercase with hyphens for multi-word class names
- Follow BEM (Block Element Modifier) methodology
- Prefix all component classes with `stx-`

```css
/* Block */
.stx-button {}

/* Element */
.stx-button__icon {}

/* Modifier */
.stx-button--primary {}
.stx-button--disabled {}
```

### 2.2 CSS Variables
- Use kebab-case for CSS custom properties
- Group related variables with comments
- Prefix theme variables with `--theme-`

```css
:root {
  /* Colors */
  --color-primary: #0066CC;
  --color-text: #111827;
  
  /* Spacing */
  --space-sm: 8px;
  --space-md: 16px;
  
  /* Theme specific */
  --theme-primary: var(--color-primary);
}
```

## 3. Component Architecture

### 3.1 File Structure
Organize component files in the following structure:

```
components/
  Button/
    Button.tsx         # Component logic
    Button.module.css  # Component styles
    Button.test.tsx    # Component tests
    index.ts           # Public API
    types.ts           # TypeScript types
```

### 3.2 Component Structure
Each component should have:
- A base class (e.g., `.stx-button`)
- Modifier classes for variants
- State classes
- Consistent spacing and layout

```tsx
// Button.tsx
import styles from './Button.module.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary',
  size = 'md',
  disabled = false,
  children 
}: ButtonProps) {
  return (
    <button 
      className={`
        stx-button 
        stx-button--${variant}
        stx-button--${size}
        ${disabled ? 'stx-button--disabled' : ''}
      `}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

## 4. Theming System

### 4.1 Theme Variables
Define theme-specific variables in `design-tokens.css`. For more details on theming, see the [Design System Summary](design-system-summary.md#theming):

```css
:root {
  /* Light theme (default) */
  --theme-bg: #FFFFFF;
  --theme-text: #111827;
}

[data-theme="dark"] {
  --theme-bg: #1A202C;
  --theme-text: #F7FAFC;
}

[data-theme="eu"] {
  --theme-primary: #1E40AF;
  --theme-accent: #3B82F6;
}
```

### 4.2 Using Theme Variables
Always use theme variables for colors and other theme-specific values:

```css
.stx-component {
  background-color: var(--theme-bg);
  color: var(--theme-text);
  border: 1px solid var(--theme-border);
}
```

## 5. Responsive Design

### 5.1 Breakpoints
Use the following breakpoints:

```css
/* Small devices (landscape phones, 640px and up) */
@media (min-width: 640px) {}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {}

/* Large devices (desktops, 1024px and up) */
@media (min-width: 1024px) {}

/* Extra large devices (large desktops, 1280px and up) */
@media (min-width: 1280px) {}
```

### 5.2 Mobile-First Approach
- Start with mobile styles as default
- Use `min-width` media queries for larger screens
- Avoid `max-width` unless necessary

```css
.stx-component {
  /* Mobile styles */
  padding: var(--space-sm);
  
  @media (min-width: 768px) {
    /* Tablet/desktop styles */
    padding: var(--space-md);
  }
}
```

## 6. Accessibility

> **Accessibility Resources**:  
> - [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)  
> - [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)


### 6.1 Focus States
Always provide visible focus states:

```css
.stx-button:focus {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
```

### 6.2 ARIA Attributes
Use appropriate ARIA attributes:

```tsx
<button 
  className="stx-button"
  aria-label="Close dialog"
  aria-expanded={isOpen}
  aria-controls="dialog-content"
>
  Close
</button>
```

## 7. CSS Organization

### 7.1 Style Order
Organize CSS properties in the following order:
1. Layout (display, position, flex, grid)
2. Box model (width, height, margin, padding)
3. Typography (font, line-height, text-align)
4. Visual (background, border, box-shadow)
5. Misc (opacity, cursor, z-index)

```css
.stx-button {
  /* Layout */
  display: inline-flex;
  position: relative;
  
  /* Box Model */
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  margin: 0;
  
  /* Typography */
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
  
  /* Visual */
  background-color: var(--color-primary);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  
  /* Misc */
  cursor: pointer;
  transition: all 0.2s ease;
}
```

## 8. Best Practices

For implementation examples, refer to our [Component Library](component-library-documentation.md) and [Design Standards](design-standards.md).

### 8.1 Use CSS Variables
Always use CSS variables for:
- Colors
- Spacing
- Typography
- Breakpoints
- Border radius
- Shadows

### 8.2 Avoid !important
Never use `!important` unless absolutely necessary.

### 8.3 Component Composition
Compose components using CSS classes rather than duplicating styles:

```tsx
// Good
<Button className="stx-button stx-button--primary" />

// Bad
<Button className="bg-blue-600 text-white px-4 py-2 rounded" />
```

### 8.4 Performance
- Minimize CSS specificity
- Avoid deeply nested selectors
- Use CSS containment for complex components

### 8.5 Testing
- Test all interactive states
- Verify responsive behavior
- Check color contrast
- Test keyboard navigation

## 9. Linting and Formatting

### 9.1 Stylelint
Use Stylelint with the following rules:
```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "selector-class-pattern": "^stx-[a-z][a-zA-Z0-9]*$",
    "custom-property-pattern": null,
    "property-no-vendor-prefix": true,
    "selector-max-specificity": "0,3,0"
  }
}
```

### 9.2 Prettier
Use Prettier for consistent code formatting:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100,
  "bracketSameLine": false,
  "endOfLine": "lf"
}
```

## 10. Documentation

### 10.1 Component Documentation
Each component should include:
- Description
- Props table
- Examples
- Accessibility notes
- Theme support
- Responsive behavior

### 10.2 Storybook
Use Storybook to document:
- Component variants
- Interactive examples
- Accessibility information
- Design tokens

## 11. Versioning

### 11.1 Semantic Versioning
Follow semantic versioning for style changes:
- **MAJOR**: Breaking changes
- **MINOR**: New features (non-breaking)
- **PATCH**: Bug fixes (non-breaking)

### 11.2 Changelog
Maintain a `CHANGELOG.md` with:
- Version number
- Release date
- Added features
- Changed components
- Bug fixes
- Breaking changes
