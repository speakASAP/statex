# Component Testing Quality Checklist

## Overview

This checklist helps ensure that all component tests meet quality standards and cover all four main testing parameters.

## Four Testing Parameters - Checklist

### ✅ 1. STX Classes (CSS Classes and Styling)

**Required checks:**

- [ ] **Main containers** have correct STX classes
  - [ ] Root component element
  - [ ] Main component sections
  - [ ] Nested containers

- [ ] **Component variants** apply correct classes
  - [ ] `variant="primary"` → `stx-component-primary`
  - [ ] `variant="secondary"` → `stx-component-secondary`
  - [ ] `variant="ghost"` → `stx-component-ghost`

- [ ] **Component sizes** are correctly reflected
  - [ ] `size="sm"` → `stx-component-sm`
  - [ ] `size="md"` → `stx-component-md`
  - [ ] `size="lg"` → `stx-component-lg`

- [ ] **Component states** have corresponding classes
  - [ ] `disabled` → `stx-component-disabled`
  - [ ] `active` → `stx-component-active`
  - [ ] `loading` → `stx-component-loading`
  - [ ] `error` → `stx-component-error`

- [ ] **Nested elements** use correct classes
  - [ ] Buttons inside component
  - [ ] Input fields
  - [ ] Icons and images
  - [ ] Text elements

**Example tests:**
```typescript
it('renders with STX classes', () => {
  render(<Component />);
  expect(screen.getByRole('main')).toHaveClass('stx-component');
});

it('applies variant classes', () => {
  render(<Component variant="primary" />);
  expect(screen.getByRole('main')).toHaveClass('stx-component-primary');
});

it('applies size classes', () => {
  render(<Component size="lg" />);
  expect(screen.getByRole('main')).toHaveClass('stx-component-lg');
});
```

### ✅ 2. Organism-Specific Functionality

**Required checks:**

- [ ] **Main user scenarios**
  - [ ] Clicks on buttons and links
  - [ ] Data input in forms
  - [ ] Form submissions
  - [ ] Navigation between pages

- [ ] **Event handling**
  - [ ] `onClick` events
  - [ ] `onChange` events
  - [ ] `onSubmit` events
  - [ ] `onFocus` and `onBlur` events

- [ ] **Data validation**
  - [ ] Required fields
  - [ ] Email format
  - [ ] Minimum/maximum length
  - [ ] Custom validation rules

- [ ] **Asynchronous operations**
  - [ ] API calls
  - [ ] Data loading
  - [ ] Error handling
  - [ ] Loading states

- [ ] **Integration with external APIs**
  - [ ] Mocking API calls
  - [ ] Handling successful responses
  - [ ] Handling network errors
  - [ ] Timeouts

- [ ] **Component states**
  - [ ] Initial state
  - [ ] Loading state
  - [ ] Success state
  - [ ] Error state
  - [ ] Empty state

**Example tests:**
```typescript
it('handles form submission', async () => {
  const mockSubmit = vi.fn();
  render(<Form onSubmit={mockSubmit} />);
  
  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: 'John Doe' }
  });
  fireEvent.submit(screen.getByRole('form'));
  
  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe'
    });
  });
});

it('validates required fields', () => {
  render(<Form />);
  fireEvent.submit(screen.getByRole('form'));
  
  expect(screen.getByText('Name is required')).toBeInTheDocument();
});
```

### ✅ 3. Layout Variants

**Required checks:**

- [ ] **Different component variants**
  - [ ] All available `variant` props
  - [ ] Combinations of `variant` and `size`
  - [ ] Impact of variants on appearance

- [ ] **Different sizes**
  - [ ] All available `size` props
  - [ ] Content adaptation to size
  - [ ] Element scaling

- [ ] **Custom className**
  - [ ] Application of user classes
  - [ ] Compatibility with STX classes
  - [ ] Priority of custom classes

- [ ] **Props for customization**
  - [ ] `className` prop
  - [ ] `style` prop
  - [ ] Custom component props

- [ ] **Adaptability**
  - [ ] Behavior on different screens
  - [ ] Switching between variants
  - [ ] Responsive classes

**Example tests:**
```typescript
it('applies different variants correctly', () => {
  const { rerender } = render(<Component variant="primary" />);
  expect(screen.getByRole('main')).toHaveClass('stx-component-primary');
  
  rerender(<Component variant="secondary" />);
  expect(screen.getByRole('main')).toHaveClass('stx-component-secondary');
});

it('applies custom className', () => {
  render(<Component className="custom-class" />);
  expect(screen.getByRole('main')).toHaveClass('custom-class');
});
```

### ✅ 4. Responsive Behavior

**Required checks:**

- [ ] **Functionality on mobile devices**
  - [ ] Touch events
  - [ ] Mobile menu
  - [ ] Adaptive controls

- [ ] **Functionality on tablets**
  - [ ] Intermediate screen sizes
  - [ ] Hybrid behavior
  - [ ] Touch optimization

- [ ] **Functionality on desktop**
  - [ ] Hover effects
  - [ ] Keyboard navigation
  - [ ] Full functionality

- [ ] **Switching between modes**
  - [ ] Mobile ↔ Desktop menu
  - [ ] Adaptive components
  - [ ] State preservation

- [ ] **Adaptive controls**
  - [ ] Buttons and links
  - [ ] Forms and input fields
  - [ ] Navigation

- [ ] **State preservation**
  - [ ] When screen size changes
  - [ ] When orientation switches
  - [ ] When page refreshes

**Example tests:**
```typescript
it('maintains functionality on different screen sizes', () => {
  render(<Navigation />);
  
  // Desktop behavior
  expect(screen.getByRole('navigation')).toHaveClass('stx-navigation-desktop');
  
  // Mobile behavior (simulate small screen)
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 768,
  });
  
  fireEvent(window, new Event('resize'));
  
  const mobileToggle = screen.getByLabelText('Toggle mobile menu');
  fireEvent.click(mobileToggle);
  
  expect(screen.getByRole('navigation')).toHaveClass('stx-navigation-mobile');
});
```

### ✅ 5. Enhanced Theme Testing

**Required checks:**

- [ ] **Multi-theme rendering**
  - [ ] Component renders in light theme
  - [ ] Component renders in dark theme
  - [ ] Component renders in eu theme
  - [ ] Component renders in uae theme

- [ ] **Theme switching functionality**
  - [ ] Smooth transitions between themes
  - [ ] Theme state preservation
  - [ ] Theme-specific behavior

- [ ] **CSS variable validation**
  - [ ] Theme-specific CSS variables applied
  - [ ] CSS variable inheritance
  - [ ] Color contrast compliance

- [ ] **Accessibility in themes**
  - [ ] ARIA attributes in all themes
  - [ ] Contrast ratios meet WCAG standards
  - [ ] Keyboard navigation works in all themes

- [ ] **Performance during theme changes**
  - [ ] Render times within thresholds
  - [ ] Transition performance
  - [ ] Memory usage optimization

- [ ] **Integration with theme providers**
  - [ ] ThemeProvider integration
  - [ ] DesignSystemProvider integration
  - [ ] ABTestProvider integration

**Implementation using theme testing utility:**
```typescript
import { 
  testCompleteThemeSupport, 
  renderWithTheme, 
  ALL_THEMES,
  type ThemeName 
} from '../../test/utils/theme-testing';

// Enhanced theme support tests
testCompleteThemeSupport(
  'ComponentName',
  (theme: ThemeName) => (
    <ComponentName 
      variant="primary"
      data-testid="test-component"
    />
  ),
  {
    testSelectors: {
      background: '[data-testid="test-component"]',
      text: '[data-testid="test-component"]',
      border: '[data-testid="test-component"]',
      action: '[data-testid="test-component"]'
    },
    testTransitions: true,
    testAccessibility: true,
    testPerformance: true,
    testEnhancedIntegration: true,
    testEnhancedPerformance: true
  }
);
```

**Manual theme test example:**
```typescript
it('renders correctly in all themes', () => {
  ALL_THEMES.forEach(theme => {
    const { container } = renderWithTheme(
      <Component variant="primary" />,
      theme
    );
    
    const themeContainer = container.closest('[data-theme]');
    if (themeContainer) {
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    }
    
    expect(container.firstChild).toBeInTheDocument();
  });
});
```

## Additional Quality Checks

### ✅ Test File Structure

- [ ] **Proper describe block organization**
  - [ ] Main describe for component
  - [ ] Nested describe for each category
  - [ ] Logical test grouping

- [ ] **Imports and setup**
  - [ ] All necessary imports
  - [ ] Mocks and setup
  - [ ] Constants and utilities

- [ ] **Test naming**
  - [ ] Descriptive names
  - [ ] Team consistency
  - [ ] Clarity for other developers

### ✅ Test File Structure with Enhanced Theme Testing

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { 
  testCompleteThemeSupport, 
  renderWithTheme, 
  ALL_THEMES,
  type ThemeName 
} from '../../test/utils/theme-testing';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  // 1. STX Classes
  describe('STX Classes', () => {
    // Test CSS classes
  });

  // 2. Organism-Specific Functionality
  describe('Organism-Specific Functionality', () => {
    // Test unique functionality
  });

  // 3. Layout Variants
  describe('Layout Variants', () => {
    // Test different variants
  });

  // 4. Responsive Behavior
  describe('Responsive Behavior', () => {
    // Test responsive behavior
  });

  // 5. Enhanced Theme Testing
  describe('Enhanced Theme Testing', () => {
    // Enhanced theme support tests using utility
    testCompleteThemeSupport(
      'ComponentName',
      (theme: ThemeName) => (
        <ComponentName 
          variant="primary"
          data-testid="test-component"
        />
      ),
      {
        testSelectors: {
          background: '[data-testid="test-component"]',
          text: '[data-testid="test-component"]',
          border: '[data-testid="test-component"]',
          action: '[data-testid="test-component"]'
        },
        testTransitions: true,
        testAccessibility: true,
        testPerformance: true,
        testEnhancedIntegration: true,
        testEnhancedPerformance: true
      }
    );

    // Manual theme tests for specific scenarios
    it('renders correctly in all themes', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(
          <ComponentName variant="primary" />,
          theme
        );
        
        const themeContainer = container.closest('[data-theme]');
        if (themeContainer) {
          expect(themeContainer).toHaveAttribute('data-theme', theme);
        }
        
        expect(container.firstChild).toBeInTheDocument();
      });
    });
  });
});
```

### ✅ Code Coverage

- [ ] **Minimum 80% coverage**
  - [ ] All main functions
  - [ ] All conditional branches
  - [ ] Error handling

- [ ] **Edge cases**
  - [ ] Empty data
  - [ ] Invalid data
  - [ ] Boundary values

- [ ] **Integration tests**
  - [ ] Component interactions
  - [ ] Data flows
  - [ ] Application states

### ✅ Test Performance

- [ ] **Execution time**
  - [ ] Individual test < 1 second
  - [ ] Full suite < 30 seconds
  - [ ] Slow test optimization

- [ ] **Parallel execution**
  - [ ] Test independence
  - [ ] No conflicts
  - [ ] Proper cleanup

- [ ] **Resources**
  - [ ] Minimal memory usage
  - [ ] Efficient mocks
  - [ ] Proper resource cleanup

### ✅ Accessibility (Accessibility)

- [ ] **ARIA attributes**
  - [ ] `aria-label` for elements without text
  - [ ] `aria-describedby` for descriptions
  - [ ] `aria-expanded` for expandable elements

- [ ] **HTML semantics**
  - [ ] Correct HTML tags
  - [ ] Logical structure
  - [ ] Headings and navigation

- [ ] **Keyboard navigation**
  - [ ] Tab order
  - [ ] Enter/Space for activation
  - [ ] Escape for closing

### ✅ Security

- [ ] **Input validation**
  - [ ] XSS protection
  - [ ] SQL injection protection
  - [ ] Client and server validation

- [ ] **Error handling**
  - [ ] No sensitive information disclosure
  - [ ] Graceful degradation
  - [ ] User-friendly error messages

## Commands for Verification

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests for specific component
npm test -- ComponentName.test.tsx

# Run tests in watch mode
npm run test:watch

# Linter check
npm run lint

# TypeScript type check
npm run type-check
```

## Success Metrics

### Quantitative Indicators

- [ ] **Code coverage ≥ 80%**
- [ ] **Execution time < 30 seconds**
- [ ] **Number of tests ≥ 4 per component**
- [ ] **Passing test rate ≥ 95%**

### Qualitative Indicators

- [ ] **All four parameters covered**
- [ ] **Tests are readable and understandable**
- [ ] **Documentation is current**
- [ ] **No regressions occur**

## Conclusion

Using this checklist ensures:

1. **Complete testing coverage** - all component aspects are covered
2. **Code quality** - high development standards
3. **Maintainability** - easy to make changes
4. **Reliability** - stable operation in production

Regularly use this checklist when creating new tests and updating existing ones to maintain high codebase quality. 