# Testing Strategy Documentation

## 🎯 Overview

This document outlines the comprehensive testing strategy for the StateX frontend, built with **Vitest**, **React Testing Library**, and modern testing patterns optimized for our **composition-based template system**.

## 📚 Related Documentation

- [Template System Overview](templates/template-system-overview.md) - Template system testing strategies
- [Template Builder Documentation](templates/template-builder.md) - TemplateBuilder testing patterns
- [Template Testing Guidelines](templates/testing-guidelines.md) - Template system testing strategies
- [Template System Architecture](templates/architecture.md) - Template system architecture testing
- [Frontend Implementation Plan](frontend-implementation-plan.md) - Testing implementation roadmap
- [Development Plan](../../development-plan.md) - Complete project plan


## 🧪 Testing Framework
### Quality Assurance Principles
- **Test-Driven Development**: Write tests before implementation where applicable
- **Coverage Goals**: Minimum 80% code coverage for critical business logic
- **Continuous Testing**: Automated testing in CI/CD pipeline with **Vitest**
- **Risk-Based Testing**: Focus testing efforts on high-risk, high-impact areas
- **User-Centric Testing**: Prioritize testing from user perspective
- **Performance-First**: Leverage Vitest's 10x performance improvement for faster development cycles
- **Template Testing**: Comprehensive testing of composition-based templates and AB testing

### Core Technologies
- **Vitest**: Fast unit testing with native ESM support
- **React Testing Library**: Component testing with user-centric approach
- **JSDOM**: DOM simulation for component testing
- **MSW**: API mocking for integration tests
- **Testing Library**: User-centric testing utilities

### Why Vitest over Jest

| Feature | Jest | Vitest | Advantage |
|---------|------|--------|-----------|
| **Test Speed** | Slow | **10x faster** | Native ESM, instant HMR |
| **TypeScript** | External setup | **Built-in** | Zero configuration |
| **Development Experience** | Static | **Hot reload tests** | Instant feedback |
| **Vite Integration** | None | **Native** | Shared configuration |
| **Bundle Size** | Large | **Smaller** | Better tree shaking |
| **Modern Features** | Limited | **Full ES2022** | Latest JavaScript features |

## 🏗️ Test Structure

### Test Categories

1. **Unit Tests**: Individual component testing
2. **Integration Tests**: Component interaction testing
3. **Template Tests**: Template system testing
4. **AB Testing Tests**: Experiment validation
5. **Performance Tests**: Loading and rendering tests
6. **Accessibility Tests**: WCAG 2.1 AA compliance

### Test Organization

```
frontend/src/
├── components/
│   ├── atoms/
│   │   ├── Button.test.tsx
│   │   ├── Input.test.tsx
│   │   └── Text.test.tsx
│   ├── sections/
│   │   ├── HeroSection.test.tsx
│   │   ├── FeaturesSection.test.tsx
│   │   └── ContactFormSection.test.tsx
│   └── templates/
│       ├── TemplateBuilder.test.ts
│       ├── TemplateRenderer.test.tsx
│       └── DynamicSection.test.tsx
├── hooks/
│   ├── useTemplateBuilder.test.ts
│   └── useABTest.test.ts
└── test/
    └── setup.ts
```

## 🎯 Testing Patterns

### Component Testing

#### Basic Component Test
```typescript
// __tests__/components/atoms/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/atoms/Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByRole('button', { name: /test button/i })).toBeInTheDocument();
  });

  it('applies correct variant classes', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('stx-button--primary');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

#### Section Component Test
```typescript
// __tests__/components/sections/HeroSection.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from '@/components/sections/HeroSection';

describe('HeroSection Component', () => {
  const defaultProps = {
    title: 'Welcome to StateX',
    subtitle: 'AI-powered development',
    cta: {
      primary: 'Get Started',
      secondary: 'Learn More'
    }
  };

  it('renders with correct content', () => {
    render(<HeroSection {...defaultProps} />);
    
    expect(screen.getByText('Welcome to StateX')).toBeInTheDocument();
    expect(screen.getByText('AI-powered development')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /learn more/i })).toBeInTheDocument();
  });

  it('applies correct theme classes', () => {
    render(<HeroSection {...defaultProps} theme="dark" />);
    const section = screen.getByRole('banner');
    expect(section).toHaveClass('stx-hero-section--dark');
  });

  it('handles variant changes', () => {
    render(<HeroSection {...defaultProps} variant="video" />);
    const section = screen.getByRole('banner');
    expect(section).toHaveClass('stx-hero-section--video');
  });
});
```

### Template System Testing

#### TemplateBuilder Test
```typescript
// __tests__/components/templates/TemplateBuilder.test.ts
import { describe, it, expect } from 'vitest';
import { TemplateBuilder } from '@/components/templates/TemplateBuilder';

describe('TemplateBuilder', () => {
  it('creates a valid template', () => {
    const template = new TemplateBuilder()
      .withId('test-template')
      .withName('Test Template')
      .withSection({
        type: 'hero',
        variant: 'default',
        data: { title: 'Test' }
      })
      .build();

    expect(template.id).toBe('test-template');
    expect(template.name).toBe('Test Template');
    expect(template.sections).toHaveLength(1);
  });

  it('validates required fields', () => {
    expect(() => {
      new TemplateBuilder().build();
    }).toThrow('Template ID is required');
  });

  it('applies performance optimizations', () => {
    const template = new TemplateBuilder()
      .withId('test')
      .withName('Test')
      .withSection({ type: 'hero', data: {} })
      .withSection({ type: 'features', data: {} })
      .withPerformanceOptimization()
      .build();

    expect(template.sections[0].priority).toBe('high');
    expect(template.sections[1].priority).toBe('high');
  });
});
```

#### TemplateRenderer Test
```typescript
// __tests__/components/templates/TemplateRenderer.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { TemplateBuilder } from '@/components/templates/TemplateBuilder';

describe('TemplateRenderer Component', () => {
  it('renders template sections', () => {
    const template = new TemplateBuilder()
      .withId('test')
      .withName('Test')
      .withSection({
        type: 'hero',
        variant: 'default',
        data: { title: 'Test Hero' }
      })
      .build();

    render(<TemplateRenderer template={template} />);
    expect(screen.getByText('Test Hero')).toBeInTheDocument();
  });

  it('handles AB testing variants', () => {
    const template = new TemplateBuilder()
      .withId('test')
      .withName('Test')
      .withSection({
        type: 'hero',
        variant: 'default',
        data: { title: 'Test Hero' }
      })
      .withABTest('hero-variant', 'B')
      .build();

    render(<TemplateRenderer template={template} />);
    const section = screen.getByRole('banner');
    expect(section).toHaveAttribute('data-ab-test', 'hero-variant');
  });

  it('applies theme classes', () => {
    const template = new TemplateBuilder()
      .withId('test')
      .withName('Test')
      .withSection({
        type: 'hero',
        variant: 'default',
        data: { title: 'Test Hero' }
      })
      .build();

    render(<TemplateRenderer template={template} theme="dark" />);
    const container = screen.getByRole('main');
    expect(container).toHaveClass('stx-template--dark');
  });
});
```

### Hook Testing

#### useTemplateBuilder Test
```typescript
// __tests__/hooks/useTemplateBuilder.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTemplateBuilder } from '@/hooks/useTemplateBuilder';

describe('useTemplateBuilder Hook', () => {
  it('creates a template with sections', () => {
    const { result } = renderHook(() => useTemplateBuilder());

    act(() => {
      result.current.addSection('hero', 'default', {
        title: 'Test Hero',
        subtitle: 'Test Subtitle'
      });
    });

    const template = result.current.build();
    expect(template.sections).toHaveLength(1);
    expect(template.sections[0].type).toBe('hero');
  });

  it('handles template configuration', () => {
    const { result } = renderHook(() => useTemplateBuilder());

    act(() => {
      result.current
        .withId('test-template')
        .withName('Test Template')
        .withLayout('hero');
    });

    const template = result.current.build();
    expect(template.id).toBe('test-template');
    expect(template.name).toBe('Test Template');
    expect(template.layout).toBe('hero');
  });
});
```

### AB Testing Testing

#### AB Test Validation
```typescript
// __tests__/components/templates/ABTesting.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ABTestProvider } from '@/contexts/ABTestProvider';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';

describe('AB Testing Integration', () => {
  it('assigns users to variants', () => {
    const mockExperiment = {
      'hero-variant': {
        variants: ['A', 'B'],
        traffic: 0.5
      }
    };

    render(
      <ABTestProvider experiments={mockExperiment}>
        <TemplateRenderer template={template} />
      </ABTestProvider>
    );

    // Verify variant assignment
    const section = screen.getByRole('banner');
    expect(section).toHaveAttribute('data-section-variant');
  });

  it('tracks experiment events', () => {
    const mockTrack = vi.fn();
    
    render(
      <ABTestProvider experiments={mockExperiment} onTrack={mockTrack}>
        <TemplateRenderer template={template} />
      </ABTestProvider>
    );

    // Simulate user interaction
    fireEvent.click(screen.getByRole('button'));
    
    expect(mockTrack).toHaveBeenCalledWith('hero-variant', 'A', 'click');
  });
});
```

## 🎨 Design System Testing

### Theme Testing
```typescript
// __tests__/components/ThemeProvider.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

describe('Theme System', () => {
  it('applies light theme', () => {
    render(
      <ThemeProvider theme="light">
        <div data-testid="test-element">Test</div>
      </ThemeProvider>
    );

    const element = screen.getByTestId('test-element');
    expect(element.closest('[data-theme="light"]')).toBeInTheDocument();
  });

  it('applies dark theme', () => {
    render(
      <ThemeProvider theme="dark">
        <div data-testid="test-element">Test</div>
      </ThemeProvider>
    );

    const element = screen.getByTestId('test-element');
    expect(element.closest('[data-theme="dark"]')).toBeInTheDocument();
  });

  it('supports EU theme', () => {
    render(
      <ThemeProvider theme="eu">
        <div data-testid="test-element">Test</div>
      </ThemeProvider>
    );

    const element = screen.getByTestId('test-element');
    expect(element.closest('[data-theme="eu"]')).toBeInTheDocument();
  });
});
```

### Responsive Testing
```typescript
// __tests__/components/Responsive.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResponsiveWrapper } from '@/components/atoms/ResponsiveWrapper';

describe('Responsive Design', () => {
  it('renders mobile layout', () => {
    // Mock viewport for mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(
      <ResponsiveWrapper>
        <div data-testid="mobile-content">Mobile Content</div>
      </ResponsiveWrapper>
    );

    expect(screen.getByTestId('mobile-content')).toBeInTheDocument();
  });

  it('renders desktop layout', () => {
    // Mock viewport for desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    });

    render(
      <ResponsiveWrapper>
        <div data-testid="desktop-content">Desktop Content</div>
      </ResponsiveWrapper>
    );

    expect(screen.getByTestId('desktop-content')).toBeInTheDocument();
  });
});
```

## ♿ Accessibility Testing

### WCAG 2.1 AA Compliance
```typescript
// __tests__/components/Accessibility.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '@/components/atoms/Button';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('meets WCAG 2.1 AA standards', async () => {
    const { container } = render(
      <Button aria-label="Test button">Test</Button>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', () => {
    render(
      <div>
        <Button>First</Button>
        <Button>Second</Button>
      </div>
    );

    const firstButton = screen.getByRole('button', { name: /first/i });
    const secondButton = screen.getByRole('button', { name: /second/i });

    firstButton.focus();
    expect(firstButton).toHaveFocus();

    // Test tab navigation
    userEvent.tab();
    expect(secondButton).toHaveFocus();
  });

  it('provides proper ARIA labels', () => {
    render(
      <Button aria-label="Submit form" aria-describedby="submit-help">
        Submit
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Submit form');
    expect(button).toHaveAttribute('aria-describedby', 'submit-help');
  });
});
```

## 🚀 Performance Testing

### Bundle Size Testing
```typescript
// __tests__/performance/BundleSize.test.ts
import { describe, it, expect } from 'vitest';
import { getBundleSize } from '@/utils/bundleAnalyzer';

describe('Bundle Size', () => {
  it('main bundle is under 500KB', () => {
    const bundleSize = getBundleSize('main');
    expect(bundleSize).toBeLessThan(500 * 1024); // 500KB
  });

  it('template chunks are under 100KB', () => {
    const templateChunkSize = getBundleSize('template');
    expect(templateChunkSize).toBeLessThan(100 * 1024); // 100KB
  });
});
```

### Render Performance Testing
```typescript
// __tests__/performance/RenderPerformance.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { measureRenderTime } from '@/utils/performance';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';

describe('Render Performance', () => {
  it('renders template within 100ms', async () => {
    const template = createComplexTemplate();
    
    const renderTime = await measureRenderTime(() => {
      render(<TemplateRenderer template={template} />);
    });

    expect(renderTime).toBeLessThan(100); // 100ms
  });

  it('lazy loads sections efficiently', async () => {
    const template = createTemplateWithManySections();
    
    const { container } = render(<TemplateRenderer template={template} />);
    
    // Check that only visible sections are rendered
    const renderedSections = container.querySelectorAll('[data-section-type]');
    expect(renderedSections.length).toBeLessThanOrEqual(3); // Above the fold
  });
});
```

## 🔧 Test Configuration

### Vitest Configuration
```typescript
// vitest.config.mjs
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

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
        '**/*.config.*',
        '**/coverage/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Test Setup
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock AB testing
vi.mock('@/contexts/ABTestProvider', () => ({
  useABTest: () => ({
    getVariant: vi.fn(() => 'A'),
    track: vi.fn(),
  }),
}));

// Mock template system
vi.mock('@/components/templates/SectionRegistry', () => ({
  SectionRegistry: {
    getSection: vi.fn(() => ({ component: vi.fn(() => null) })),
    getDefaultVariant: vi.fn(() => 'default'),
  },
}));
```

## 📊 Test Coverage

### Coverage Targets
- **Statements**: 90%
- **Branches**: 85%
- **Functions**: 90%
- **Lines**: 90%

### Coverage Reports
```bash
npm run test:coverage
```

This generates:
- **Text Report**: Console output
- **JSON Report**: Machine-readable data
- **HTML Report**: Interactive web interface

## 🚀 CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Test

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
    
    - name: Run tests
      run: npm run test:coverage
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
```

## 📈 Test Metrics

### Performance Metrics
- **Test Execution Time**: < 30 seconds
- **Memory Usage**: < 512MB
- **Coverage**: > 90%
- **Reliability**: > 99%

### Quality Metrics
- **Test Reliability**: No flaky tests
- **Test Maintainability**: Clear, readable tests
- **Test Performance**: Fast execution
- **Test Coverage**: Comprehensive coverage

## 🔍 Debugging Tests

### Common Issues
1. **Async Operations**: Use `waitFor` for async operations
2. **Mocking**: Ensure proper mock setup
3. **Environment**: Check test environment configuration
4. **Timing**: Handle timing-sensitive operations

### Debug Commands
```bash
# Run specific test file
npm test -- Button.test.tsx

# Run tests in watch mode
npm run test:watch

# Run tests with verbose output
npm test -- --verbose

# Run tests with coverage
npm run test:coverage
```

## 📚 Best Practices

### Test Organization
1. **Group Related Tests**: Use describe blocks effectively
2. **Clear Test Names**: Descriptive test names
3. **Arrange-Act-Assert**: Follow AAA pattern
4. **Test Isolation**: Each test should be independent

### Test Data
1. **Use Factories**: Create test data factories
2. **Mock External Dependencies**: Mock APIs and services
3. **Use Realistic Data**: Use realistic test data
4. **Clean Up**: Clean up after tests

### Performance
1. **Fast Tests**: Keep tests fast
2. **Parallel Execution**: Run tests in parallel
3. **Efficient Mocks**: Use efficient mocking strategies
4. **Minimal Setup**: Minimize test setup time

---

*This testing documentation reflects the current state of the StateX frontend testing strategy as of the template system refactoring completion.* 