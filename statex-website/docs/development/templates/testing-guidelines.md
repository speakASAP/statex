# Template System Testing Guidelines

## Overview

This document outlines comprehensive testing strategies for the modern template system, including unit tests, integration tests, AB testing validation, and performance testing.

## Testing Strategy

### 1. Unit Testing

#### Template Builder Tests

```typescript
// TemplateBuilder.test.ts
import { TemplateBuilder } from '@/components/templates/TemplateBuilder';
import { describe, it, expect } from 'vitest';

describe('TemplateBuilder', () => {
  it('should create a valid template with required fields', () => {
    const template = new TemplateBuilder()
      .withId('test-template')
      .withName('Test Template')
      .withSections([
        { type: 'hero', variant: 'default', priority: 'high' }
      ])
      .build();

    expect(template.config.id).toBe('test-template');
    expect(template.config.name).toBe('Test Template');
    expect(template.sections).toHaveLength(1);
    expect(template.metadata.totalSections).toBe(1);
  });

  it('should validate required fields', () => {
    expect(() => {
      new TemplateBuilder().build();
    }).toThrow('Template validation failed');
  });

  it('should calculate performance score correctly', () => {
    const template = new TemplateBuilder()
      .withId('test')
      .withName('Test')
      .withSections([
        { type: 'hero', variant: 'default', priority: 'high' },
        { type: 'features', variant: 'grid', priority: 'high' }
      ])
      .build();

    expect(template.metadata.performanceScore).toBeGreaterThan(80);
  });
});
```

#### Section Component Tests

```typescript
// Hero.test.tsx
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero/Hero';
import { describe, it, expect } from 'vitest';

describe('Hero Section', () => {
  it('should render with default props', () => {
    render(<Hero />);
    
    expect(screen.getByText('Transform Your Ideas Into Working Prototypes in 24 Hours')).toBeInTheDocument();
    expect(screen.getByText(/Experience the future of software development/)).toBeInTheDocument();
  });

  it('should render service variant correctly', () => {
    render(
      <Hero 
        variant="service"
        title="Custom Service Title"
        subtitle="Custom Subtitle"
      />
    );
    
    expect(screen.getByText('Custom Service Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
  });

  it('should handle loading and error states', () => {
    const onLoad = vi.fn();
    const onError = vi.fn();
    
    render(
      <Hero 
        onLoad={onLoad}
        onError={onError}
        backgroundImage="invalid-url"
      />
    );
    
    // Test error handling for invalid image
    expect(onError).toHaveBeenCalled();
  });

  it('should apply AB test classes correctly', () => {
    render(
      <Hero 
        abTest={{
          experimentId: 'hero-test',
          variant: 'B'
        }}
      />
    );
    
    const heroSection = screen.getByRole('region');
    expect(heroSection).toHaveAttribute('data-ab-test', 'hero-test');
  });
});
```

#### Dynamic Section Tests

```typescript
// DynamicSection.test.tsx
import { render, screen } from '@testing-library/react';
import { DynamicSection } from '@/components/sections/DynamicSection';
import { describe, it, expect, vi } from 'vitest';

describe('DynamicSection', () => {
  it('should render section with correct variant', () => {
    const section = {
      type: 'hero',
      variant: 'service',
      data: { title: 'Test Title' },
      priority: 'high' as const
    };

    render(<DynamicSection section={section} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should handle section loading states', () => {
    const section = {
      type: 'hero',
      variant: 'default',
      data: {},
      priority: 'high' as const
    };

    render(<DynamicSection section={section} />);
    
    // Should show loading skeleton initially
    expect(screen.getByTestId('section-loading')).toBeInTheDocument();
  });

  it('should handle section errors gracefully', () => {
    const section = {
      type: 'nonexistent',
      variant: 'default',
      data: {},
      priority: 'high' as const
    };

    render(<DynamicSection section={section} />);
    
    expect(screen.getByText(/Error loading nonexistent section/)).toBeInTheDocument();
  });
});
```

### 2. Integration Testing

#### Template Renderer Tests

```typescript
// TemplateRenderer.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { TemplateBuilder } from '@/components/templates/TemplateBuilder';
import { describe, it, expect, vi } from 'vitest';

describe('TemplateRenderer', () => {
  it('should render complete template with all sections', async () => {
    const template = new TemplateBuilder()
      .withId('test-template')
      .withName('Test Template')
      .withSections([
        { type: 'hero', variant: 'default', priority: 'high' },
        { type: 'cta', variant: 'primary', priority: 'high' }
      ])
      .build();

    render(<TemplateRenderer template={template} />);
    
    await waitFor(() => {
      expect(screen.getByText('Transform Your Ideas Into Working Prototypes in 24 Hours')).toBeInTheDocument();
      expect(screen.getByText('Ready to Transform Your Ideas?')).toBeInTheDocument();
    });
  });

  it('should track section loading progress', async () => {
    const onSectionLoad = vi.fn();
    const onTemplateLoad = vi.fn();
    
    const template = new TemplateBuilder()
      .withId('test-template')
      .withName('Test Template')
      .withSections([
        { type: 'hero', variant: 'default', priority: 'high' }
      ])
      .build();

    render(
      <TemplateRenderer 
        template={template}
        onSectionLoad={onSectionLoad}
        onTemplateLoad={onTemplateLoad}
      />
    );
    
    await waitFor(() => {
      expect(onSectionLoad).toHaveBeenCalledWith('hero');
      expect(onTemplateLoad).toHaveBeenCalledWith(template);
    });
  });

  it('should show performance warnings for low scores', async () => {
    const template = new TemplateBuilder()
      .withId('test-template')
      .withName('Test Template')
      .withSections([
        { type: 'hero', variant: 'default', priority: 'high' },
        { type: 'features', variant: 'grid', priority: 'high' },
        { type: 'testimonials', variant: 'carousel', priority: 'low' },
        { type: 'blog', variant: 'grid', priority: 'low' },
        { type: 'pricing', variant: 'cards', priority: 'medium' }
      ])
      .build();

    render(<TemplateRenderer template={template} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Template performance score/)).toBeInTheDocument();
    });
  });
});
```

### 3. AB Testing Tests

#### Experiment Configuration Tests

```typescript
// experiments.test.ts
import { ABExperiments, validateExperiment, calculateExperimentPower } from '@/lib/ab-testing/experiments';
import { describe, it, expect } from 'vitest';

describe('AB Testing Experiments', () => {
  it('should have valid experiment configurations', () => {
    Object.values(ABExperiments).forEach(experiment => {
      const errors = validateExperiment(experiment);
      expect(errors).toHaveLength(0);
    });
  });

  it('should calculate experiment power correctly', () => {
    const experiment = ABExperiments['hero-variants'];
    const power = calculateExperimentPower(experiment);
    
    expect(power).toBeGreaterThan(0);
    expect(power).toBeLessThanOrEqual(1);
  });

  it('should validate traffic distribution', () => {
    const invalidExperiment = {
      ...ABExperiments['hero-variants'],
      traffic: [0.5, 0.3] // Doesn't sum to 100%
    };

    const errors = validateExperiment(invalidExperiment);
    expect(errors).toContain('Traffic distribution must sum to 100%');
  });
});
```

#### Template Theme Testing

**Enhanced theme testing for template components ensures they work correctly across all supported themes and handle theme transitions properly.**

```typescript
// TemplateRenderer.test.tsx - Enhanced Theme Tests
import { 
  testCompleteThemeSupport, 
  renderWithTheme, 
  ALL_THEMES,
  type ThemeName 
} from '../../test/utils/theme-testing';

describe('TemplateRenderer', () => {
  // Enhanced theme support tests for template rendering
  testCompleteThemeSupport(
    'TemplateRenderer',
    (theme: ThemeName) => {
      const template = new TemplateBuilder()
        .withId('test-template')
        .withName('Test Template')
        .withSections([
          { type: 'hero', variant: 'default', priority: 'high' },
          { type: 'cta', variant: 'primary', priority: 'high' }
        ])
        .build();

      return (
        <TemplateRenderer 
          template={template}
          data-testid="template-renderer"
        />
      );
    },
    {
      testSelectors: {
        background: '[data-testid="template-renderer"]',
        text: '[data-testid="template-renderer"]',
        border: '[data-testid="template-renderer"]',
        action: '[data-testid="template-renderer"]'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );

  // Manual theme tests for specific template scenarios
  describe('Theme Integration', () => {
    it('renders template sections with correct theme styling', () => {
      ALL_THEMES.forEach(theme => {
        const template = new TemplateBuilder()
          .withId('test-template')
          .withName('Test Template')
          .withSections([
            { type: 'hero', variant: 'default', priority: 'high' }
          ])
          .build();

        const { container } = renderWithTheme(
          <TemplateRenderer template={template} />,
          theme
        );

        const themeContainer = container.closest('[data-theme]');
        if (themeContainer) {
          expect(themeContainer).toHaveAttribute('data-theme', theme);
        }

        // Verify template content renders
        expect(screen.getByText('Transform Your Ideas Into Working Prototypes in 24 Hours')).toBeInTheDocument();
      });
    });

    it('handles theme transitions during template rendering', async () => {
      const template = new TemplateBuilder()
        .withId('test-template')
        .withName('Test Template')
        .withSections([
          { type: 'hero', variant: 'default', priority: 'high' }
        ])
        .build();

      const { container, rerender } = renderWithTheme(
        <TemplateRenderer template={template} />,
        'light'
      );

      // Switch to dark theme
      rerender(<TemplateRenderer template={template} />);

      await waitFor(() => {
        const themeContainer = container.closest('[data-theme]');
        if (themeContainer) {
          expect(themeContainer).toHaveAttribute('data-theme', 'dark');
        }
      });
    });
  });
});
```

#### Dynamic Section Theme Tests

```typescript
// DynamicSection.test.tsx - Enhanced Theme Tests
describe('DynamicSection', () => {
  // Enhanced theme support tests
  testCompleteThemeSupport(
    'DynamicSection',
    (theme: ThemeName) => {
      const section = {
        id: 'test-section',
        type: 'hero',
        variant: 'default',
        data: { title: 'Test Title' },
        priority: 'high' as const
      };

      return (
        <DynamicSection 
          section={section}
          data-testid="dynamic-section"
        />
      );
    },
    {
      testSelectors: {
        background: '[data-testid="dynamic-section"]',
        text: '[data-testid="dynamic-section"]',
        border: '[data-testid="dynamic-section"]',
        action: '[data-testid="dynamic-section"]'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );

  describe('Theme Integration', () => {
    it('renders dynamic sections with theme-specific styling', () => {
      ALL_THEMES.forEach(theme => {
        const section = {
          id: 'test-section',
          type: 'hero',
          variant: 'default',
          data: { title: 'Test Title' },
          priority: 'high' as const
        };

        const { container } = renderWithTheme(
          <DynamicSection section={section} />,
          theme
        );

        const themeContainer = container.closest('[data-theme]');
        if (themeContainer) {
          expect(themeContainer).toHaveAttribute('data-theme', theme);
        }

        expect(screen.getByText('Test Title')).toBeInTheDocument();
      });
    });
  });
});
```

#### AB Test Hook Tests

```typescript
// useABTest.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useABTest } from '@/lib/ab-testing/useABTest';
import { describe, it, expect, vi } from 'vitest';

describe('useABTest Hook', () => {
  it('should assign user to experiment variant', async () => {
    const { result } = renderHook(() => 
      useABTest('hero-variants', 'hero', {
        userId: 'test-user',
        enableTracking: false
      })
    );

    await waitFor(() => {
      expect(result.current.variant).toBeDefined();
      expect(['A', 'B', 'C']).toContain(result.current.variant);
    });
  });

  it('should track conversions correctly', async () => {
    const trackConversion = vi.fn();
    
    const { result } = renderHook(() => 
      useABTest('hero-variants', 'hero', {
        userId: 'test-user',
        enableTracking: false
      })
    );

    await waitFor(() => {
      result.current.trackConversion('cta_click', 1);
      expect(trackConversion).toHaveBeenCalled();
    });
  });

  it('should handle forced variants', async () => {
    const { result } = renderHook(() => 
      useABTest('hero-variants', 'hero', {
        userId: 'test-user',
        forceVariant: 'B',
        enableTracking: false
      })
    );

    await waitFor(() => {
      expect(result.current.variant).toBe('B');
      expect(result.current.isControl).toBe(false);
    });
  });
});
```

### 4. Performance Testing

#### Template Performance Tests

```typescript
// performance.test.ts
import { TemplateBuilder } from '@/components/templates/TemplateBuilder';
import { describe, it, expect } from 'vitest';

describe('Template Performance', () => {
  it('should maintain good performance with optimal sections', () => {
    const template = new TemplateBuilder()
      .withId('performance-test')
      .withName('Performance Test')
      .withSections([
        { type: 'hero', variant: 'default', priority: 'high' },
        { type: 'cta', variant: 'primary', priority: 'high' }
      ])
      .build();

    expect(template.metadata.performanceScore).toBeGreaterThan(90);
  });

  it('should penalize heavy templates', () => {
    const heavyTemplate = new TemplateBuilder()
      .withId('heavy-test')
      .withName('Heavy Test')
      .withSections([
        { type: 'hero', variant: 'default', priority: 'high' },
        { type: 'features', variant: 'grid', priority: 'high' },
        { type: 'testimonials', variant: 'carousel', priority: 'low' },
        { type: 'blog', variant: 'grid', priority: 'low' },
        { type: 'pricing', variant: 'cards', priority: 'medium' },
        { type: 'process', variant: 'timeline', priority: 'medium' }
      ])
      .build();

    expect(heavyTemplate.metadata.performanceScore).toBeLessThan(90);
  });
});
```

### 5. Accessibility Testing

#### Section Accessibility Tests

```typescript
// accessibility.test.tsx
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Hero } from '@/components/sections/Hero/Hero';
import { describe, it, expect } from 'vitest';

expect.extend(toHaveNoViolations);

describe('Section Accessibility', () => {
  it('should meet WCAG 2.1 AA standards', async () => {
    const { container } = render(<Hero />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading structure', () => {
    render(<Hero />);
    
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent('Transform Your Ideas Into Working Prototypes in 24 Hours');
  });

  it('should support keyboard navigation', () => {
    render(
      <Hero 
        primaryCTA={{
          text: 'Get Started',
          href: '/prototype'
        }}
      />
    );
    
    const button = screen.getByRole('link', { name: 'Get Started' });
    expect(button).toHaveAttribute('href', '/prototype');
  });
});
```

### 6. Visual Regression Testing

#### Template Visual Tests

```typescript
// visual.test.tsx
import { render } from '@testing-library/react';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { TemplateBuilder } from '@/components/templates/TemplateBuilder';
import { describe, it, expect } from 'vitest';

describe('Template Visual Regression', () => {
  it('should render service page template consistently', () => {
    const template = TemplateBuilder.createServicePage({
      hero: {
        title: 'Test Service',
        description: 'Test description'
      }
    });

    const { container } = render(<TemplateRenderer template={template} />);
    
    // Take screenshot for visual regression testing
    expect(container).toMatchSnapshot();
  });

  it('should render home page template consistently', () => {
    const template = TemplateBuilder.createHomePage();
    const { container } = render(<TemplateRenderer template={template} />);
    
    expect(container).toMatchSnapshot();
  });
});
```

## Test Configuration

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    }
  }
});
```

### Test Setup

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    reload: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn()
    }
  })
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

## Testing Best Practices

### 1. Test Organization

- Group tests by component/feature
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests focused and isolated

### 2. Mocking Strategy

- Mock external dependencies (APIs, analytics)
- Use realistic test data
- Avoid over-mocking internal components
- Test error boundaries and edge cases

### 3. Performance Testing

- Test template build performance
- Monitor bundle size impact
- Test lazy loading behavior
- Validate performance scores

### 4. AB Testing Validation

- Test variant assignment logic
- Validate traffic distribution
- Test conversion tracking
- Verify experiment configuration

### 5. Accessibility Compliance

- Test keyboard navigation
- Validate ARIA attributes
- Test screen reader compatibility
- Check color contrast ratios

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Template System Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Run accessibility tests
        run: npm run test:a11y
      
      - name: Generate coverage report
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Test Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest --config vitest.unit.config.ts",
    "test:integration": "vitest --config vitest.integration.config.ts",
    "test:a11y": "vitest --config vitest.a11y.config.ts",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui"
  }
}
```

## Coverage Targets

- **Unit Tests**: >90% coverage
- **Integration Tests**: >80% coverage
- **AB Testing**: 100% coverage
- **Accessibility**: 100% coverage for critical paths
- **Performance**: All templates tested for performance scores

## Monitoring and Reporting

### Test Results Dashboard

- Track test execution time
- Monitor coverage trends
- Report AB testing validation
- Alert on performance regressions

### Quality Gates

- All tests must pass
- Coverage targets must be met
- No accessibility violations
- Performance scores within acceptable range
- AB testing configuration validated 