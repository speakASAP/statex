# Frontend Component Testing Guidelines

## 🔗 Related Documentation

- **[A/B Testing Guide](ab-testing-guide.md)** - Complete A/B testing implementation and usage
- **[Template System Testing](templates/testing-guidelines.md)** - Template system specific testing
- **[Frontend Architecture](frontend.md)** - Complete frontend technical specifications
- **[Performance Optimization](optimized-resource-loading-strategy.md)** - Performance testing strategies
- **[Implementation Plan](../IMPLEMENTATION_PLAN.md)** - Project status and testing milestones

## Overview

This guide describes the standards and requirements for testing all frontend components in the Statex project. Each component must be tested according to **six main parameters** to ensure code quality, reliability, and A/B testing compatibility.

## Six Main Testing Parameters

### 1. STX Classes (CSS Classes and Styling)

**Purpose:** Ensure that the component correctly applies CSS classes and conforms to the design system.

**What to test:**
- Main containers have correct STX classes
- Nested elements use appropriate classes
- Component variants (variant) apply correct classes
- Sizes (size) are correctly reflected in CSS classes
- States (active, disabled, hover) have corresponding classes

**Example:**
```typescript
it('renders with STX classes', () => {
  render(<Button variant="primary" size="md">Click me</Button>);
  
  const button = screen.getByRole('button');
  expect(button).toHaveClass('stx-button');
  expect(button).toHaveClass('stx-button--primary');
  expect(button).toHaveClass('stx-button--md');
});
```

### 2. Organism-Specific Functionality

**Purpose:** Test the unique functionality of each organism component.

**What to test:**
- Main user scenarios
- Event handling (clicks, changes, form submissions)
- Data validation
- Asynchronous operations
- Integration with external APIs
- Component states (loading, error, success)

**Example:**
```typescript
it('submits form with valid data', async () => {
  const mockOnSubmit = vi.fn();
  render(<ContactForm onSubmit={mockOnSubmit} />);
  
  const nameInput = screen.getByLabelText('Name');
  const emailInput = screen.getByLabelText('Email');
  const submitButton = screen.getByRole('button', { name: 'Submit' });
  
  fireEvent.change(nameInput, { target: { value: 'John Doe' } });
  fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
  fireEvent.click(submitButton);
  
  await waitFor(() => {
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com'
    });
  });
});
```

### 3. Layout Variants

**Purpose:** Ensure the component works correctly with different display variants.

**What to test:**
- Different component variants (variant)
- Different sizes (size)
- Custom className
- Props for appearance customization
- Adaptability and responsive behavior

**Example:**
```typescript
it('applies different variants correctly', () => {
  const { rerender } = render(<Button variant="primary">Button</Button>);
  expect(screen.getByRole('button')).toHaveClass('stx-button--primary');
  
  rerender(<Button variant="secondary">Button</Button>);
  expect(screen.getByRole('button')).toHaveClass('stx-button--secondary');
});

it('applies custom className', () => {
  render(<Button className="custom-button">Button</Button>);
  expect(screen.getByRole('button')).toHaveClass('custom-button');
});
```

### 4. Responsive Behavior

**Purpose:** Test correct component operation on different screen sizes.

**What to test:**
- Functionality on mobile devices
- Functionality on tablets
- Functionality on desktop
- Switching between mobile and desktop menus
- Adaptive controls
- State preservation when screen size changes
- Adaptive layout changes
- Touch interactions on mobile
- Keyboard navigation

**Example:**
```typescript
import { testCompleteThemeSupport } from '@/test/utils/theme-testing';

describe('Button responsive behavior', () => {
  it('adapts to mobile viewport', () => {
    // Set mobile viewport
    Object.defineProperty(window, 'innerWidth', { value: 375 });
    Object.defineProperty(window, 'innerHeight', { value: 667 });
    
    render(<Button size="responsive">Mobile Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('stx-button--mobile');
  });

  it('supports touch interactions', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Touch me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.touchStart(button);
    fireEvent.touchEnd(button);
    
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### 5. Enhanced Theme Integration and Switching

**Purpose:** Ensure components work correctly across all supported themes and handle theme transitions properly.

**What to test:**
- Component rendering in all supported themes (light, dark, eu, uae)
- Theme switching functionality
- CSS variable application and inheritance
- Theme transition animations
- Accessibility in different themes
- Theme-specific styling and behavior

**Implementation using the theme testing utility:**

```typescript
import { 
  testCompleteThemeSupport, 
  renderWithTheme, 
  ALL_THEMES,
  type ThemeName 
} from '../../test/utils/theme-testing';

describe('ComponentName', () => {
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
});
```

**Example manual theme test:**

describe('Theme Integration', () => {
  it('renders correctly in all themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Button variant="primary">Test Button</Button>,
        theme
      );
      
      const themeContainer = container.closest('[data-theme]');
      if (themeContainer) {
        expect(themeContainer).toHaveAttribute('data-theme', theme);
      }
      
      expect(container.firstChild).toBeInTheDocument();
    });
  });
}

  it('handles theme transitions smoothly', async () => {
    const { container, rerender } = renderWithTheme(
      <Button variant="primary">Test Button</Button>,
      'light'
    );
  }

    // Switch to dark theme
    rerender(
      <Button variant="primary">Test Button</Button>
    );
    
    await waitFor(() => {
      const themeContainer = container.closest('[data-theme]');
      if (themeContainer) {
        expect(themeContainer).toHaveAttribute('data-theme', 'dark');
      }
    });

### 6. A/B Testing Integration

**What to test:**
- Component renders with A/B test variants
- Conversion tracking functions correctly
- Performance is not impacted by A/B testing
- Variant configurations are applied properly
- Analytics events are triggered correctly

**Example:**
```typescript
import { ABTestManager } from '@/config/abTestConfig';
import { render, screen, fireEvent } from '@testing-library/react';

describe('HeroSection A/B Testing', () => {
  beforeEach(() => {
    // Reset A/B test state
    ABTestManager.getInstance().clearAssignments();
  });

  it('renders classic hero variant correctly', () => {
    const manager = ABTestManager.getInstance();
    manager.forceAssign('test_user', 'homepage-hero-variants', 'hero-classic');
    
    render(<HeroSection userId="test_user" />);
    
    expect(screen.getByText('Transform Your Business with AI')).toBeInTheDocument();
    expect(screen.getByText('Get Free Prototype')).toBeInTheDocument();
  });

  it('renders benefit-focused hero variant correctly', () => {
    const manager = ABTestManager.getInstance();
    manager.forceAssign('test_user', 'homepage-hero-variants', 'hero-benefit-focused');
    
    render(<HeroSection userId="test_user" />);
    
    expect(screen.getByText('Ship Software 10x Faster with AI')).toBeInTheDocument();
    expect(screen.getByText('Start Your Project Today')).toBeInTheDocument();
    expect(screen.getByText('24-hour delivery')).toBeInTheDocument();
  });

  it('renders urgency hero variant correctly', () => {
    const manager = ABTestManager.getInstance();
    manager.forceAssign('test_user', 'homepage-hero-variants', 'hero-urgency');
    
    render(<HeroSection userId="test_user" />);
    
    expect(screen.getByText('Limited Time: Free AI Development')).toBeInTheDocument();
    expect(screen.getByText('Claim Your Spot Now')).toBeInTheDocument();
    expect(screen.getByText('50 spots remaining')).toBeInTheDocument();
  });

  it('tracks conversions on CTA clicks', () => {
    const trackingSpy = vi.spyOn(ABTestManager.prototype, 'trackConversion');
    const manager = ABTestManager.getInstance();
    manager.forceAssign('test_user', 'homepage-hero-variants', 'hero-classic');
    
    render(<HeroSection userId="test_user" />);
    
    const ctaButton = screen.getByText('Get Free Prototype');
    fireEvent.click(ctaButton);
    
    expect(trackingSpy).toHaveBeenCalledWith('test_user', 'homepage-hero-variants', 'hero_cta_click');
  });

  it('maintains performance across variants', async () => {
    const performanceStart = performance.now();
    
    render(<HeroSection userId="test_user" />);
    
    const performanceEnd = performance.now();
    const renderTime = performanceEnd - performanceStart;
    
    // Should render within 50ms
    expect(renderTime).toBeLessThan(50);
  });

  it('applies correct A/B test classes', () => {
    const manager = ABTestManager.getInstance();
    manager.forceAssign('test_user', 'homepage-hero-variants', 'hero-benefit-focused');
    
    render(<HeroSection userId="test_user" />);
    
    const heroElement = screen.getByTestId('hero-section');
    expect(heroElement).toHaveClass('stx-hero--benefit-focused');
  });
});
```

## A/B Testing Specific Test Patterns

### Testing Multiple Experiments

```typescript
describe('Page Layout A/B Testing', () => {
  it('handles multiple concurrent experiments', () => {
    const manager = ABTestManager.getInstance();
    
    // Set up multiple experiments
    manager.forceAssign('test_user', 'homepage-hero-variants', 'hero-classic');
    manager.forceAssign('test_user', 'homepage-layout-variants', 'layout-conversion-optimized');
    
    render(<HomePage userId="test_user" />);
    
    // Test hero variant
    expect(screen.getByText('Transform Your Business with AI')).toBeInTheDocument();
    
    // Test layout variant (testimonials should appear before features)
    const sections = screen.getAllByTestId(/section/);
    const testimonialIndex = sections.findIndex(el => el.getAttribute('data-testid')?.includes('testimonials'));
    const featuresIndex = sections.findIndex(el => el.getAttribute('data-testid')?.includes('features'));
    
    expect(testimonialIndex).toBeLessThan(featuresIndex);
  });
});
```

**What the enhanced theme tests cover:**

- **Theme Integration:** Verifies component renders correctly in all themes
- **Theme Switching:** Tests smooth transitions between themes
- **CSS Variable Validation:** Ensures proper CSS variable application
- **Accessibility:** Validates ARIA attributes and contrast ratios
- **Performance:** Measures render times and transition performance
- **Integration:** Tests component behavior with theme providers
- **Enhanced Performance:** Advanced performance metrics and thresholds

### Testing Conversion Tracking

```typescript
describe('Conversion Tracking', () => {
  it('tracks form submissions with A/B test context', async () => {
    const trackingSpy = vi.spyOn(ABTestManager.prototype, 'trackConversion');
    const manager = ABTestManager.getInstance();
    manager.forceAssign('test_user', 'homepage-hero-variants', 'hero-urgency');
    
    render(<ContactForm userId="test_user" />);
    
    // Fill out form
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByText('Submit'));
    
    await waitFor(() => {
      expect(trackingSpy).toHaveBeenCalledWith(
        'test_user', 
        'homepage-hero-variants', 
        'form_submission',
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com'
        })
      );
    });
  });

  it('tracks different conversion types', () => {
    const trackingSpy = vi.spyOn(ABTestManager.prototype, 'trackConversion');
    
    render(<HeroSection userId="test_user" />);
    
    // Test multiple conversion points
    fireEvent.click(screen.getByText('Get Free Prototype'));
    fireEvent.click(screen.getByText('See Success Stories'));
    
    expect(trackingSpy).toHaveBeenCalledWith('test_user', 'homepage-hero-variants', 'hero_cta_click');
    expect(trackingSpy).toHaveBeenCalledWith('test_user', 'homepage-hero-variants', 'secondary_cta_click');
  });
});
```

## Test File Structure

Each test file should follow the following structure:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  // 1. STX Classes
  describe('STX Classes', () => {
    it('renders with default STX classes', () => {
      // Test main CSS classes
    });
    
    it('renders with variant classes', () => {
      // Test variant classes
    });
    
    it('renders with size classes', () => {
      // Test size classes
    });
  });

  // 2. Organism-Specific Functionality
  describe('Organism-Specific Functionality', () => {
    it('handles user interactions', () => {
      // Test main functionality
    });
    
    it('validates input data', () => {
      // Test validation
    });
    
    it('handles async operations', () => {
      // Test async operations
    });
  });

  // 3. Layout Variants
  describe('Layout Variants', () => {
    it('applies different variants correctly', () => {
      // Test different variants
    });
    
    it('applies custom className', () => {
      // Test custom classes
    });
  });

  // 4. Responsive Behavior
  describe('Responsive Behavior', () => {
    it('maintains functionality on different screen sizes', () => {
      // Test adaptability
    });
    
    it('handles responsive layout changes', () => {
      // Test layout changes
    });
  });
  
  // 5. A/B testing
  describe('A/B testing', () => {
    it('maintains functionality on different variants', () => {
      // Test adaptability
    });
    
    it('handles responsive layout changes', () => {
      // Test layout changes
    });
    
    it('handles theme switches', () => {
      // Test layout changes
    });
  });
});
```

### Testing Performance Impact

```typescript
describe('A/B Testing Performance', () => {
  it('does not significantly impact bundle size', async () => {
    // Mock bundle analyzer
    const bundleAnalyzer = vi.fn();
    
    // Test with A/B testing enabled
    render(<HomePage userId="test_user" abTestingEnabled={true} />);
    const bundleWithAB = await bundleAnalyzer.getBundleSize();
    
    // Test with A/B testing disabled
    render(<HomePage userId="test_user" abTestingEnabled={false} />);
    const bundleWithoutAB = await bundleAnalyzer.getBundleSize();
    
    // A/B testing should add less than 10KB
    expect(bundleWithAB - bundleWithoutAB).toBeLessThan(10 * 1024);
  });

  it('maintains Core Web Vitals performance', async () => {
    const performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lcp = entries.find(entry => entry.entryType === 'largest-contentful-paint');
      
      if (lcp) {
        // LCP should be under 2.5 seconds
        expect(lcp.startTime).toBeLessThan(2500);
      }
    });
    
    performanceObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    
    render(<HomePage userId="test_user" />);
    
    // Wait for performance entries
    await new Promise(resolve => setTimeout(resolve, 3000));
  });
});
```

### Mandatory Requirements

1. **100% coverage across four parameters** - each component must have tests for all four categories
2. **Minimum code coverage** - at least 80% line coverage
3. **User scenario testing** - all main user paths must be covered
4. **Edge case testing** - boundary cases and error handling
5. **Accessibility testing** - ARIA attributes and semantics verification

### Recommendations

1. **Use userEvent instead of fireEvent** for more realistic testing
2. **Wrap async operations in waitFor** for correct testing
3. **Use act() for React component state updates**
4. **Mock external dependencies** (APIs, browser APIs)
5. **Test component integration**

## Component Testing Structure

### Standard Test File Template

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { testCompleteThemeSupport } from '@/test/utils/theme-testing';
import { ABTestManager } from '@/config/abTestConfig';
import { YourComponent } from './YourComponent';

describe('YourComponent', () => {
  beforeEach(() => {
    // Reset any global state
    ABTestManager.getInstance().clearAssignments();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // 1. STX Classes Testing
  describe('STX Classes', () => {
    it('renders with correct base classes', () => {
      render(<YourComponent />);
      expect(screen.getByTestId('your-component')).toHaveClass('stx-your-component');
    });

    it('applies variant classes correctly', () => {
      render(<YourComponent variant="primary" />);
      expect(screen.getByTestId('your-component')).toHaveClass('stx-your-component--primary');
    });
  });

  // 2. Functionality Testing
  describe('Functionality', () => {
    it('handles user interactions correctly', () => {
      const handleClick = vi.fn();
      render(<YourComponent onClick={handleClick} />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalled();
    });
  });

  // 3. Layout Variants Testing
  describe('Layout Variants', () => {
    it('adapts to different sizes', () => {
      const { rerender } = render(<YourComponent size="sm" />);
      expect(screen.getByTestId('your-component')).toHaveClass('stx-your-component--sm');
      
      rerender(<YourComponent size="lg" />);
      expect(screen.getByTestId('your-component')).toHaveClass('stx-your-component--lg');
    });
  });

  // 4. Responsive Behavior Testing
  describe('Responsive Behavior', () => {
    it('adapts to mobile viewport', () => {
      // Test mobile-specific behavior
    });

    it('supports keyboard navigation', () => {
      // Test keyboard accessibility
    });
  });

  // 5. A/B Testing Integration
  describe('A/B Testing Integration', () => {
    it('renders with A/B test variants', () => {
      const manager = ABTestManager.getInstance();
      manager.forceAssign('test_user', 'your-experiment', 'variant-b');
      
      render(<YourComponent userId="test_user" />);
      
      // Test variant-specific behavior
    });

    it('tracks conversions correctly', () => {
      const trackingSpy = vi.spyOn(ABTestManager.prototype, 'trackConversion');
      
      render(<YourComponent userId="test_user" />);
      fireEvent.click(screen.getByRole('button'));
      
      expect(trackingSpy).toHaveBeenCalled();
    });
  });

  // Theme Support Testing
  describe('Theme Support', () => {
    testCompleteThemeSupport(() => <YourComponent />, {
      expectedClasses: ['stx-your-component'],
      themesToTest: ['light', 'dark', 'eu', 'uae']
    });
  });
});
```

## A/B Testing Test Utilities

### Custom Test Utilities

```typescript
// test/utils/ab-testing.ts
import { ABTestManager } from '@/config/abTestConfig';

export const withABTest = (userId: string, experimentId: string, variantId: string) => {
  beforeEach(() => {
    const manager = ABTestManager.getInstance();
    manager.forceAssign(userId, experimentId, variantId);
  });

  afterEach(() => {
    ABTestManager.getInstance().clearAssignments();
  });
};

export const expectConversionTracked = (userId: string, experimentId: string, conversionType: string) => {
  const trackingSpy = vi.spyOn(ABTestManager.prototype, 'trackConversion');
  
  return {
    toHaveBeenCalled: () => {
      expect(trackingSpy).toHaveBeenCalledWith(userId, experimentId, conversionType);
    },
    toHaveBeenCalledWith: (value?: any) => {
      expect(trackingSpy).toHaveBeenCalledWith(userId, experimentId, conversionType, value);
    }
  };
};

export const testAllVariants = (experimentId: string, variants: string[], testFn: (variant: string) => void) => {
  variants.forEach(variant => {
    describe(`Variant: ${variant}`, () => {
      withABTest('test_user', experimentId, variant);
      testFn(variant);
    });
  });
};
```

### Integration Test Examples

```typescript
// Integration test for complete A/B testing flow
describe('Homepage A/B Testing Integration', () => {
  testAllVariants('homepage-hero-variants', ['hero-classic', 'hero-benefit-focused', 'hero-urgency'], (variant) => {
    it(`renders ${variant} variant correctly`, () => {
      render(<HomePage userId="test_user" />);
      
      switch (variant) {
        case 'hero-classic':
          expect(screen.getByText('Transform Your Business with AI')).toBeInTheDocument();
          break;
        case 'hero-benefit-focused':
          expect(screen.getByText('Ship Software 10x Faster with AI')).toBeInTheDocument();
          break;
        case 'hero-urgency':
          expect(screen.getByText('Limited Time: Free AI Development')).toBeInTheDocument();
          break;
      }
    });

    it(`tracks conversions for ${variant}`, () => {
      render(<HomePage userId="test_user" />);
      
      const ctaButton = screen.getByRole('button', { name: /get|start|claim/i });
      fireEvent.click(ctaButton);
      
      expectConversionTracked('test_user', 'homepage-hero-variants', 'hero_cta_click').toHaveBeenCalled();
    });
  });
});
```

## Performance Testing for A/B Tests

### Bundle Size Testing

```typescript
describe('A/B Testing Bundle Impact', () => {
  it('keeps A/B testing overhead minimal', async () => {
    // Test that A/B testing adds minimal overhead
    const baseBundle = await getBundleSize({ abTesting: false });
    const abTestBundle = await getBundleSize({ abTesting: true });
    
    const overhead = abTestBundle - baseBundle;
    expect(overhead).toBeLessThan(15 * 1024); // Less than 15KB overhead
  });
});
```

## Tools and Libraries

### Main Tools

- **Vitest** - main testing framework
- **@testing-library/react** - utilities for testing React components
- **@testing-library/user-event** - user action simulation
- **@testing-library/jest-dom** - additional matchers

### Core Web Vitals Testing

```typescript
describe('A/B Testing Core Web Vitals', () => {
  it('maintains LCP performance across variants', async () => {
    const variants = ['hero-classic', 'hero-benefit-focused', 'hero-urgency'];
    
    for (const variant of variants) {
      const manager = ABTestManager.getInstance();
      manager.forceAssign('test_user', 'homepage-hero-variants', variant);
      
      const startTime = performance.now();
      render(<HomePage userId="test_user" />);
      
      // Wait for largest contentful paint
      await screen.findByTestId('hero-section');
      const endTime = performance.now();
      
      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(100); // Under 100ms render time
    }
  });
});
```

## Accessibility Testing with A/B Tests

```typescript
describe('A/B Testing Accessibility', () => {
  it('maintains accessibility across all variants', async () => {
    const variants = ['hero-classic', 'hero-benefit-focused', 'hero-urgency'];
    
    for (const variant of variants) {
      const manager = ABTestManager.getInstance();
      manager.forceAssign('test_user', 'homepage-hero-variants', variant);
      
      const { container } = render(<HomePage userId="test_user" />);
      
      // Run accessibility tests
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it('preserves keyboard navigation in all variants', () => {
    testAllVariants('homepage-hero-variants', ['hero-classic', 'hero-benefit-focused', 'hero-urgency'], () => {
      render(<HomePage userId="test_user" />);
      
      // Test tab navigation
      const firstButton = screen.getAllByRole('button')[0];
      firstButton.focus();
      expect(document.activeElement).toBe(firstButton);
      
      // Test that all interactive elements are reachable
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('tabindex', expect.stringMatching(/^-?[0-9]+$/));
      });
    });
  });
});
```

## Testing Checklist

### Component-Level Testing
- [ ] STX classes applied correctly
- [ ] Functionality works as expected
- [ ] Layout variants render properly
- [ ] Responsive behavior functions correctly
- [ ] A/B test variants render without errors
- [ ] Conversion tracking triggers correctly
- [ ] Performance remains optimal across variants
- [ ] Accessibility maintained in all variants

### Integration Testing
- [ ] Multiple A/B experiments work together
- [ ] Page-level variant combinations function correctly
- [ ] Analytics events fire appropriately
- [ ] User assignments persist correctly
- [ ] Fallback behavior works when A/B testing fails

### Performance Testing
- [ ] Bundle size impact is minimal
- [ ] Core Web Vitals remain optimal
- [ ] Memory usage is stable across variants
- [ ] No performance regressions in any variant

### Production Readiness
- [ ] A/B test configuration loads correctly
- [ ] Error boundaries catch A/B test failures
- [ ] Graceful degradation when experiments are disabled
- [ ] Analytics integration functions properly
- [ ] GDPR compliance maintained for EU users

## Related Testing Documentation

- **[A/B Testing Guide](ab-testing-guide.md)** - Complete A/B testing implementation
- **[Template System Testing](templates/testing-guidelines.md)** - Template-specific testing strategies
- **[Performance Testing](optimized-resource-loading-strategy.md)** - Performance optimization testing
- **[Theme Testing Utils](../design/brand-guidelines.md)** - Design system testing utilities

## 🔗 Quick Navigation for QA Engineers

### **Essential Testing Documentation**
1. **[A/B Testing Guide](ab-testing-guide.md)** - A/B testing validation procedures and testing checklist
2. **[Template Testing](templates/template-testing.md)** - Template system testing strategies
3. **[Performance Testing](optimized-resource-loading-strategy.md)** - Performance validation and Core Web Vitals testing
4. **[Frontend Architecture](frontend.md)** - Technical implementation understanding

### **Testing Workflow**
1. **Component Testing**: Follow 5-parameter testing strategy (STX Classes, Functionality, Layout Variants, Responsive, A/B Testing)
2. **A/B Test Validation**: Test all 6 variant combinations using development controller
3. **Performance Testing**: Verify Core Web Vitals maintained across all A/B test variants
4. **Cross-Browser Testing**: Validate A/B testing works across different browsers and devices

### **Key Testing Areas**
- **A/B Test Functionality**: All 6 combinations render correctly
- **Conversion Tracking**: Analytics events fire properly
- **Performance Impact**: <15KB A/B testing overhead maintained
- **SEO Compliance**: No negative impact on search rankings
- **Accessibility**: WCAG 2.1 AA compliance across all variants

## Conclusion

Following this guide ensures:

- **Reliability** - components work stably under various conditions
- **Maintainability** - easy to make changes without breaking functionality
- **Quality** - high code standards and user experience
- **Documentation** - tests serve as living documentation of components

Every developer should follow these standards when creating new components and updating existing ones. 