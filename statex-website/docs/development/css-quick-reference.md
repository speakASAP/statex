# CSS Variables Quick Reference

## Essential Commands

### Theme Management
```typescript
// Switch themes
setTheme('dark');
setTheme('light');
setTheme('eu');
setTheme('uae');

// Get current theme
const { theme } = useTheme();

// Check theme in localStorage
localStorage.getItem('statex-theme');
```

### Component Class Generation
```typescript
// Basic usage
const classes = componentClasses('stx-button', { variant: 'primary' });

// With multiple variants
const classes = componentClasses('stx-card', {
  variant: 'elevated',
  size: 'lg',
  interactive: true
});

// With conditional classes
const classes = componentClasses('stx-input', {
  variant: 'text',
  error: hasError,
  disabled: isDisabled
});
```

## Common CSS Patterns

### Component Base Styles
```css
.stx-component {
  background-color: var(--stx-component-bg);
  color: var(--stx-component-text);
  padding: var(--stx-component-padding);
  border-radius: var(--stx-component-radius);
  border: 1px solid var(--stx-component-border);
}
```

### Hover States
```css
.stx-component:hover {
  background-color: var(--stx-component-hover-bg);
  transform: translateY(-1px);
  box-shadow: var(--stx-component-hover-shadow);
}
```

### Focus States
```css
.stx-component:focus-visible {
  outline: 2px solid var(--stx-color-border-focus);
  outline-offset: 2px;
}
```

### Responsive Design
```css
.stx-component {
  padding: var(--stx-padding-sm);
  font-size: var(--stx-font-size-sm);
}

@media (min-width: 768px) {
  .stx-component {
    padding: var(--stx-padding-md);
    font-size: var(--stx-font-size-base);
  }
}
```

## Color Variables Quick Reference

### Surface Colors
```css
--stx-color-surface-primary    /* Main background */
--stx-color-surface-secondary  /* Secondary background */
--stx-color-surface-tertiary   /* Tertiary background */
--stx-color-surface-overlay    /* Modal overlays */
```

### Text Colors
```css
--stx-color-text-primary       /* Primary text */
--stx-color-text-secondary     /* Secondary text */
--stx-color-text-tertiary      /* Tertiary text */
--stx-color-text-inverse       /* Text on dark backgrounds */
--stx-color-text-muted         /* Muted text */
```

### Action Colors
```css
--stx-color-action-primary     /* Primary buttons */
--stx-color-action-secondary   /* Secondary buttons */
--stx-color-action-success     /* Success states */
--stx-color-action-warning     /* Warning states */
--stx-color-action-error       /* Error states */
--stx-color-action-info        /* Info states */
```

### Border Colors
```css
--stx-color-border-primary     /* Primary borders */
--stx-color-border-secondary   /* Secondary borders */
--stx-color-border-focus       /* Focus states */
--stx-color-border-error       /* Error borders */
```

## Spacing Variables Quick Reference

### Base Spacing
```css
--stx-space-xs: 8px;      /* Extra small */
--stx-space-sm: 16px;     /* Small */
--stx-space-md: 24px;     /* Medium */
--stx-space-lg: 32px;     /* Large */
--stx-space-xl: 48px;     /* Extra large */
--stx-space-2xl: 64px;    /* 2X large */
--stx-space-3xl: 96px;    /* 3X large */
```

### Component Spacing
```css
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
```

## Typography Variables Quick Reference

### Font Sizes
```css
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
--stx-font-weight-light: 300;
--stx-font-weight-normal: 400;
--stx-font-weight-medium: 500;
--stx-font-weight-semibold: 600;
--stx-font-weight-bold: 700;
--stx-font-weight-extrabold: 800;
```

## Component Variables Quick Reference

### Button Variables
```css
--stx-button-bg: var(--stx-color-action-primary);
--stx-button-text: var(--stx-color-text-inverse);
--stx-button-border: transparent;
--stx-button-radius: 8px;
--stx-button-padding: var(--stx-padding-sm) var(--stx-padding-md);
```

### Input Variables
```css
--stx-input-bg: var(--stx-color-surface-primary);
--stx-input-text: var(--stx-color-text-primary);
--stx-input-border: var(--stx-color-border-primary);
--stx-input-radius: 6px;
--stx-input-padding: var(--stx-padding-sm);
```

### Card Variables
```css
--stx-card-bg: var(--stx-color-surface-primary);
--stx-card-border: var(--stx-color-border-primary);
--stx-card-radius: 12px;
--stx-card-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
--stx-card-padding: var(--stx-padding-md);
```

## Testing Patterns

### Component Testing
```typescript
// Test component variants
it('renders with primary variant', () => {
  render(<Button variant="primary">Click me</Button>);
  expect(screen.getByRole('button')).toHaveClass('stx-button--primary');
});

// Test theme-aware styling
it('applies theme-aware background', () => {
  render(<Button>Click me</Button>);
  const button = screen.getByRole('button');
  expect(button).toHaveStyle({
    backgroundColor: 'var(--stx-button-bg)'
  });
});
```

### Theme Testing
```typescript
// Test theme switching
it('switches to dark theme', async () => {
  render(
    <ThemeProvider>
      <TestComponent />
    </ThemeProvider>
  );
  
  const darkButton = screen.getByTestId('set-dark');
  fireEvent.click(darkButton);
  
  await waitFor(() => {
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });
});
```

## Troubleshooting

### Common Issues

1. **Variable Not Defined**
   ```css
   /* Check if variable exists in design-tokens.css */
   background-color: var(--stx-color-surface-primary);
   ```

2. **Theme Not Applied**
   ```javascript
   // Check current theme
   console.log(document.documentElement.getAttribute('data-theme'));
   
   // Check localStorage
   console.log(localStorage.getItem('statex-theme'));
   ```

3. **Class Not Generated**
   ```typescript
   // Check componentClasses usage
   const classes = componentClasses('stx-button', { variant: 'primary' });
   console.log(classes); // Should output: "stx-button stx-button--primary"
   ```

### Debug Commands

```javascript
// Check all STX variables
const styles = getComputedStyle(document.documentElement);
console.log(styles.getPropertyValue('--stx-color-surface-primary'));

// Check component classes
console.log(document.querySelector('.stx-button').className);

// Check theme state
console.log({
  htmlTheme: document.documentElement.getAttribute('data-theme'),
  localStorage: localStorage.getItem('statex-theme'),
  prefersDark: window.matchMedia('(prefers-color-scheme: dark)').matches
});
```

## Performance Tips

### Optimize Class Generation
```typescript
// ✅ Good - Memoize class generation
const buttonClasses = useMemo(() => 
  componentClasses('stx-button', { variant, size, disabled }), 
  [variant, size, disabled]
);

// ❌ Bad - Recalculate on every render
const buttonClasses = componentClasses('stx-button', { variant, size, disabled });
```

### Efficient CSS Variables
```css
/* ✅ Good - Use variables for frequently changed properties */
.stx-component {
  background-color: var(--stx-color-surface-primary);
  color: var(--stx-color-text-primary);
  
  /* Use static values for rarely changed properties */
  border-radius: 8px;
  font-family: system-ui, sans-serif;
}

/* ❌ Bad - Over-use of variables */
.stx-component {
  border-radius: var(--stx-border-radius-8);
  font-family: var(--stx-font-family-system);
}
```

## Accessibility Checklist

### High Contrast Support
```css
@media (prefers-contrast: high) {
  .stx-button {
    border: 2px solid var(--stx-color-text-primary);
  }
}
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  .stx-modal {
    transition: none;
  }
}
```

### Focus States
```css
.stx-button:focus-visible {
  outline: 2px solid var(--stx-color-border-focus);
  outline-offset: 2px;
}
```

## File Structure

### Key Files
```
frontend/src/
├── styles/
│   └── design-tokens.css          # All CSS variables
├── components/
│   ├── atoms/                     # Atom components
│   ├── molecules/                 # Molecule components
│   ├── organisms/                 # Organism components
│   └── providers/
│       ├── ThemeProvider.tsx      # Theme management
│       └── VariantProvider.tsx    # Variant management
├── lib/
│   └── componentClasses.ts        # Class generation utility
└── themes/
    ├── light.css                  # Light theme overrides
    ├── dark.css                   # Dark theme overrides
    ├── eu.css                     # EU theme overrides
    └── uae.css                    # UAE theme overrides
```

### Documentation Files
```
docs/development/
├── css-migration.md               # Migration status
├── css-variables-reference.md     # Complete reference
├── css-quick-reference.md         # This file
└── development-rules.md           # Development guidelines
```

## Quick Commands

### Development
```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test Button.test.tsx

# Check test coverage
npm run test:coverage
```

### Theme Testing
```javascript
// Test all themes
['light', 'dark', 'eu', 'uae'].forEach(theme => {
  setTheme(theme);
  // Run your tests here
});
```

This quick reference provides the essential information needed to work with the CSS variables system efficiently. For detailed information, refer to the complete CSS variables reference guide. 