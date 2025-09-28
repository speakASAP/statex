# Testing Summary

## Overview

This document provides a quick reference for the four main testing parameters and key requirements for frontend component testing.

## Four Main Testing Parameters

### 1. STX Classes (CSS Classes and Styling)
- **Purpose:** Ensure correct CSS class application
- **What to test:** Main containers, variants, sizes, states, nested elements
- **Example:** `expect(button).toHaveClass('stx-button-primary')`

### 2. Organism-Specific Functionality
- **Purpose:** Test unique component functionality
- **What to test:** User scenarios, events, validation, async operations, states
- **Example:** Form submission, API calls, user interactions

### 3. Layout Variants
- **Purpose:** Test different display variants
- **What to test:** Variants, sizes, custom classes, props
- **Example:** `variant="primary"`, `size="lg"`, `className="custom"`

### 4. Responsive Behavior
- **Purpose:** Test adaptive behavior on different screen sizes
- **What to test:** Mobile, tablet, desktop functionality, layout changes
- **Example:** Mobile menu, touch events, responsive classes

### 5. Enhanced Theme Testing
- **Purpose:** Ensure components work correctly across all supported themes
- **What to test:** Theme rendering, switching, transitions, accessibility, performance
- **Example:** `testCompleteThemeSupport('ComponentName', renderFunction, options)`

## Enhanced Theme Testing

### Overview
Enhanced theme testing ensures components work correctly across all supported themes (light, dark, eu, uae) and handle theme transitions properly.

### Key Features
- **Multi-theme rendering:** Tests component in all supported themes
- **Theme switching:** Validates smooth transitions between themes
- **CSS variable validation:** Ensures proper CSS variable application
- **Accessibility testing:** Validates ARIA attributes and contrast ratios
- **Performance monitoring:** Measures render times and transition performance
- **Integration testing:** Tests component behavior with theme providers

### Implementation
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
  (theme: ThemeName) => <ComponentName />,
  {
    testTransitions: true,
    testAccessibility: true,
    testPerformance: true,
    testEnhancedIntegration: true,
    testEnhancedPerformance: true
  }
);
```

### Supported Components
Enhanced theme tests are implemented for:
- **Atoms:** Button, Input, Modal, Toast, Container, Flex, Grid, Stack, Spinner
- **Sections:** Hero, Process, Pricing, Testimonials, ContactForm, CTA, Features, Blog
- **Providers:** ThemeProvider, DesignSystemProvider, ABTestProvider, LanguageProvider, VariantProvider
- **Templates:** TemplateRenderer, DynamicSection
- **Sections:** HeaderSection, FooterSection, LegalContentSection

## Test File Structure

```typescript
describe('ComponentName', () => {
  describe('STX Classes', () => {
    // Test CSS classes
  });

  describe('Organism-Specific Functionality', () => {
    // Test unique functionality
  });

  describe('Layout Variants', () => {
    // Test different variants
  });

  describe('Responsive Behavior', () => {
    // Test responsive behavior
  });
});
```

## Key Requirements

### Mandatory
- ✅ 100% coverage across four parameters
- ✅ Minimum 80% code coverage
- ✅ All user scenarios covered
- ✅ Edge cases and error handling
- ✅ Accessibility testing

### Recommendations
- ✅ Use `userEvent` instead of `fireEvent`
- ✅ Wrap async operations in `waitFor`
- ✅ Use `act()` for React state updates
- ✅ Mock external dependencies
- ✅ Test component integration

## Quality Metrics

### Quantitative
- Code coverage ≥ 80%
- Execution time < 30 seconds
- Number of tests ≥ 4 per component
- Passing test rate ≥ 95%

### Qualitative
- All four parameters covered
- Tests are readable and understandable
- Documentation is current
- No regressions occur

## Quick Commands

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Test specific component
npm test -- ComponentName.test.tsx

# Check coverage across four parameters
node scripts/check-test-coverage.js

# Check test quality
node scripts/check-test-quality.js
```

## Tools

- **Vitest** - main testing framework
- **@testing-library/react** - React testing utilities
- **@testing-library/user-event** - user action simulation
- **@testing-library/jest-dom** - additional matchers

## Best Practices

1. **Structure tests logically** - group by four parameters
2. **Use descriptive names** - clear test descriptions
3. **Test user behavior** - focus on user interactions
4. **Mock external dependencies** - isolate component testing
5. **Maintain test independence** - no shared state between tests
6. **Clean up after tests** - proper resource cleanup
7. **Test edge cases** - boundary conditions and error states
8. **Keep tests fast** - optimize for speed

## Common Patterns

### Testing CSS Classes
```typescript
it('renders with STX classes', () => {
  render(<Component />);
  expect(screen.getByRole('main')).toHaveClass('stx-component');
});
```

### Testing User Interactions
```typescript
it('handles user interactions', async () => {
  const mockHandler = vi.fn();
  render(<Component onAction={mockHandler} />);
  
  await userEvent.click(screen.getByRole('button'));
  expect(mockHandler).toHaveBeenCalled();
});
```

### Testing Variants
```typescript
it('applies different variants', () => {
  const { rerender } = render(<Component variant="primary" />);
  expect(screen.getByRole('main')).toHaveClass('stx-component-primary');
  
  rerender(<Component variant="secondary" />);
  expect(screen.getByRole('main')).toHaveClass('stx-component-secondary');
});
```

### Testing Responsive Behavior
```typescript
it('adapts to mobile layout', () => {
  render(<Component />);
  
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 768,
  });
  
  fireEvent(window, new Event('resize'));
  expect(screen.getByRole('main')).toHaveClass('stx-component-mobile');
});
```

## Conclusion

Following these guidelines ensures:
- **Reliability** - components work stably
- **Maintainability** - easy to make changes
- **Quality** - high code standards
- **Documentation** - tests serve as living documentation

Every component should be tested according to all four parameters for complete coverage and quality assurance. 