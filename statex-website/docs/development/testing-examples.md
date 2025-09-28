# Component Testing Examples

## Overview

This document contains practical examples of testing different types of components according to four main parameters: STX Classes, Organism-Specific Functionality, Layout Variants, and Responsive Behavior.

## Atoms

### Button Component

```typescript
// Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  // 1. STX Classes
  describe('STX Classes', () => {
    it('renders with default STX classes', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('stx-button');
      expect(button).toHaveClass('stx-button-primary'); // default variant
      expect(button).toHaveClass('stx-button-md'); // default size
    });

    it('applies variant classes correctly', () => {
      render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass('stx-button-secondary');
    });

    it('applies size classes correctly', () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('stx-button-lg');
    });

    it('applies disabled state classes', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toHaveClass('stx-button-disabled');
    });
  });

  // 2. Organism-Specific Functionality
  describe('Organism-Specific Functionality', () => {
    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} disabled>Disabled</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('submits form when type is submit', () => {
      const handleSubmit = vi.fn();
      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Submit</Button>
        </form>
      );
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  // 3. Layout Variants
  describe('Layout Variants', () => {
    it('applies different variants correctly', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('stx-button-primary');
      
      rerender(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole('button')).toHaveClass('stx-button-ghost');
    });

    it('applies custom className', () => {
      render(<Button className="custom-button">Custom</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('stx-button');
      expect(button).toHaveClass('custom-button');
    });

    it('combines variant and size correctly', () => {
      render(<Button variant="secondary" size="sm">Small Secondary</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('stx-button-secondary');
      expect(button).toHaveClass('stx-button-sm');
    });
  });

  // 4. Responsive Behavior
  describe('Responsive Behavior', () => {
    it('maintains functionality on different screen sizes', () => {
      render(<Button>Responsive Button</Button>);
      const button = screen.getByRole('button');
      
      // Test on desktop
      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
      
      // Test on mobile (simulate small screen)
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      fireEvent(window, new Event('resize'));
      
      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
    });

    it('handles touch events on mobile', () => {
      render(<Button>Touch Button</Button>);
      const button = screen.getByRole('button');
      
      // Simulate touch event
      fireEvent.touchStart(button);
      fireEvent.touchEnd(button);
      
      expect(button).toBeInTheDocument();
    });
  });
});
```

### Input Component

```typescript
// Input.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  // 1. STX Classes
  describe('STX Classes', () => {
    it('renders with default STX classes', () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByRole('textbox');
      
      expect(input).toHaveClass('stx-input');
      expect(input).toHaveClass('stx-input-md'); // default size
    });

    it('applies error state classes', () => {
      render(<Input error placeholder="Error input" />);
      expect(screen.getByRole('textbox')).toHaveClass('stx-input-error');
    });

    it('applies disabled state classes', () => {
      render(<Input disabled placeholder="Disabled input" />);
      expect(screen.getByRole('textbox')).toHaveClass('stx-input-disabled');
    });
  });

  // 2. Organism-Specific Functionality
  describe('Organism-Specific Functionality', () => {
    it('calls onChange when value changes', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} placeholder="Test" />);
      
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'new value' }
      });
      
      expect(handleChange).toHaveBeenCalledWith('new value');
    });

    it('displays error message when provided', () => {
      render(<Input error errorMessage="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('handles focus and blur events', () => {
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();
      render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      expect(handleFocus).toHaveBeenCalled();
      
      fireEvent.blur(input);
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  // 3. Layout Variants
  describe('Layout Variants', () => {
    it('applies different sizes correctly', () => {
      const { rerender } = render(<Input size="sm" placeholder="Small" />);
      expect(screen.getByRole('textbox')).toHaveClass('stx-input-sm');
      
      rerender(<Input size="lg" placeholder="Large" />);
      expect(screen.getByRole('textbox')).toHaveClass('stx-input-lg');
    });

    it('applies custom className', () => {
      render(<Input className="custom-input" placeholder="Custom" />);
      const input = screen.getByRole('textbox');
      
      expect(input).toHaveClass('stx-input');
      expect(input).toHaveClass('custom-input');
    });
  });

  // 4. Responsive Behavior
  describe('Responsive Behavior', () => {
    it('maintains functionality on different screen sizes', () => {
      render(<Input placeholder="Responsive input" />);
      const input = screen.getByRole('textbox');
      
      expect(input).toBeInTheDocument();
      expect(input).toBeEnabled();
      
      // Test on mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      fireEvent(window, new Event('resize'));
      
      expect(input).toBeInTheDocument();
      expect(input).toBeEnabled();
    });
  });
});
```

## Molecules

### ContactForm Component

```typescript
// ContactForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactForm } from './ContactForm';

describe('ContactForm', () => {
  // 1. STX Classes
  describe('STX Classes', () => {
    it('renders form with STX classes', () => {
      render(<ContactForm />);
      
      expect(screen.getByRole('form')).toHaveClass('stx-contact-form');
      expect(screen.getByRole('form')).toHaveClass('stx-contact-form-default');
    });

    it('renders form fields with STX classes', () => {
      render(<ContactForm />);
      
      expect(screen.getByLabelText('Name')).toHaveClass('stx-input');
      expect(screen.getByLabelText('Email')).toHaveClass('stx-input');
      expect(screen.getByRole('button', { name: 'Submit' })).toHaveClass('stx-button');
    });

    it('renders error states with STX classes', () => {
      render(<ContactForm />);
      
      fireEvent.submit(screen.getByRole('form'));
      
      expect(screen.getByText('Name is required')).toHaveClass('stx-error-message');
      expect(screen.getByText('Email is required')).toHaveClass('stx-error-message');
    });
  });

  // 2. Organism-Specific Functionality
  describe('Organism-Specific Functionality', () => {
    it('submits form with valid data', async () => {
      const mockSubmit = vi.fn();
      render(<ContactForm onSubmit={mockSubmit} />);
      
      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          message: ''
        });
      });
    });

    it('validates required fields', () => {
      render(<ContactForm />);
      
      fireEvent.submit(screen.getByRole('form'));
      
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('validates email format', () => {
      render(<ContactForm />);
      
      const emailInput = screen.getByLabelText('Email');
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);
      
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
    });

    it('shows loading state during submission', async () => {
      const mockSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      render(<ContactForm onSubmit={mockSubmit} />);
      
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
      fireEvent.submit(screen.getByRole('form'));
      
      expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled();
    });
  });

  // 3. Layout Variants
  describe('Layout Variants', () => {
    it('applies compact variant', () => {
      render(<ContactForm variant="compact" />);
      expect(screen.getByRole('form')).toHaveClass('stx-contact-form-compact');
    });

    it('applies custom className', () => {
      render(<ContactForm className="custom-form" />);
      expect(screen.getByRole('form')).toHaveClass('custom-form');
    });

    it('renders with different themes', () => {
      const { rerender } = render(<ContactForm theme="light" />);
      expect(screen.getByRole('form')).toHaveClass('stx-contact-form-light');
      
      rerender(<ContactForm theme="dark" />);
      expect(screen.getByRole('form')).toHaveClass('stx-contact-form-dark');
    });
  });

  // 4. Responsive Behavior
  describe('Responsive Behavior', () => {
    it('adapts to mobile layout', () => {
      render(<ContactForm />);
      
      // Simulate mobile screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      fireEvent(window, new Event('resize'));
      
      expect(screen.getByRole('form')).toHaveClass('stx-contact-form-mobile');
    });

    it('maintains form functionality on different screen sizes', () => {
      render(<ContactForm />);
      
      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      
      // Test on desktop
      fireEvent.change(nameInput, { target: { value: 'Desktop test' } });
      expect(nameInput).toHaveValue('Desktop test');
      
      // Test on mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      fireEvent(window, new Event('resize'));
      
      fireEvent.change(emailInput, { target: { value: 'Mobile test' } });
      expect(emailInput).toHaveValue('Mobile test');
    });
  });
});
```

## Enhanced Theme Testing Examples

### Basic Theme Testing

```typescript
// Basic theme test for any component
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

### Manual Theme Testing

```typescript
// Manual theme tests for specific scenarios
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

  it('handles theme transitions smoothly', async () => {
    const { container, rerender } = renderWithTheme(
      <Button variant="primary">Test Button</Button>,
      'light'
    );
    
    // Switch to dark theme
    rerender(<Button variant="primary">Test Button</Button>);
    
    await waitFor(() => {
      const themeContainer = container.closest('[data-theme]');
      if (themeContainer) {
        expect(themeContainer).toHaveAttribute('data-theme', 'dark');
      }
    });
  });

  it('applies theme-specific CSS variables', () => {
    const { container } = renderWithTheme(
      <Button variant="primary">Test Button</Button>,
      'dark'
    );
    
    const button = screen.getByRole('button');
    const computedStyle = window.getComputedStyle(button);
    
    // Check that theme-specific CSS variables are applied
    expect(computedStyle.getPropertyValue('--stx-color-primary')).toBeDefined();
    expect(computedStyle.getPropertyValue('--stx-color-background')).toBeDefined();
  });
});
```

### Provider Theme Testing

```typescript
// Theme testing for provider components
describe('ThemeProvider', () => {
  testCompleteThemeSupport(
    'ThemeProvider',
    (theme: ThemeName) => {
      // Set the theme in localStorage before rendering
      localStorageMock.getItem.mockReturnValue(theme);
      return (
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
    },
    {
      testSelectors: {
        background: '[data-testid="current-theme"]',
        text: '[data-testid="current-theme"]',
        border: '[data-testid="current-theme"]',
        action: '[data-testid="toggle-theme"]'
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

### Section Component Theme Testing

```typescript
// Theme testing for section components
describe('HeroSection', () => {
  testCompleteThemeSupport(
    'HeroSection',
    (theme: ThemeName) => (
      <HeroSection 
        title="Test Title"
        subtitle="Test Subtitle"
        data-testid="hero-section"
      />
    ),
    {
      testSelectors: {
        background: '[data-testid="hero-section"]',
        text: '[data-testid="hero-section"] h1',
        border: '[data-testid="hero-section"]',
        action: '[data-testid="hero-section"] button'
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

### Template Theme Testing

```typescript
// Theme testing for template components
describe('TemplateRenderer', () => {
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
});
```

### Performance Testing with Themes

```typescript
// Performance testing for theme transitions
describe('Theme Performance', () => {
  it('renders in all themes within performance threshold', () => {
    const renderTimes: number[] = [];
    
    ALL_THEMES.forEach(theme => {
      const startTime = performance.now();
      
      const { container } = renderWithTheme(
        <ComplexComponent />,
        theme
      );
      
      const endTime = performance.now();
      renderTimes.push(endTime - startTime);
      
      expect(container.firstChild).toBeInTheDocument();
    });
    
    const averageTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
    const maxTime = Math.max(...renderTimes);
    
    // Performance thresholds
    expect(averageTime).toBeLessThan(250); // Average render time < 250ms
    expect(maxTime).toBeLessThan(500); // Max render time < 500ms
  });
});
```

## Organisms

### Header Component

```typescript
// Header.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  const mockNavLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  // 1. STX Classes
  describe('STX Classes', () => {
    it('renders with STX classes', () => {
      render(<Header navLinks={mockNavLinks} />);
      
      expect(screen.getByRole('banner')).toHaveClass('stx-header');
      expect(screen.getByRole('banner')).toHaveClass('stx-header-default');
    });

    it('renders navigation with STX classes', () => {
      render(<Header navLinks={mockNavLinks} />);
      
      expect(screen.getByRole('navigation')).toHaveClass('stx-header-nav');
      expect(screen.getByRole('navigation')).toHaveClass('stx-header-nav-desktop');
    });

    it('renders mobile menu with STX classes', () => {
      render(<Header navLinks={mockNavLinks} />);
      
      const mobileToggle = screen.getByLabelText('Toggle mobile menu');
      fireEvent.click(mobileToggle);
      
      expect(screen.getByRole('navigation')).toHaveClass('stx-header-nav-mobile');
      expect(screen.getByRole('navigation')).toHaveClass('stx-header-nav-mobile-open');
    });
  });

  // 2. Organism-Specific Functionality
  describe('Organism-Specific Functionality', () => {
    it('opens mobile menu when toggle clicked', () => {
      render(<Header navLinks={mockNavLinks} />);
      
      const mobileToggle = screen.getByLabelText('Toggle mobile menu');
      fireEvent.click(mobileToggle);
      
      expect(screen.getByRole('navigation')).toHaveClass('stx-header-nav-mobile-open');
    });

    it('closes mobile menu when close button clicked', () => {
      render(<Header navLinks={mockNavLinks} />);
      
      const mobileToggle = screen.getByLabelText('Toggle mobile menu');
      fireEvent.click(mobileToggle);
      
      const closeButton = screen.getByLabelText('Close mobile menu');
      fireEvent.click(closeButton);
      
      expect(screen.getByRole('navigation')).not.toHaveClass('stx-header-nav-mobile-open');
    });

    it('calls onNavigate when link is clicked', () => {
      const mockOnNavigate = vi.fn();
      render(<Header navLinks={mockNavLinks} onNavigate={mockOnNavigate} />);
      
      const servicesLink = screen.getByText('Services');
      fireEvent.click(servicesLink);
      
      expect(mockOnNavigate).toHaveBeenCalledWith('/services');
    });

    it('highlights current page', () => {
      render(<Header navLinks={mockNavLinks} currentPage="/services" />);
      
      const servicesLink = screen.getByText('Services').closest('a');
      expect(servicesLink).toHaveClass('stx-header-nav-link-active');
    });
  });

  // 3. Layout Variants
  describe('Layout Variants', () => {
    it('applies sticky variant', () => {
      render(<Header navLinks={mockNavLinks} variant="sticky" />);
      expect(screen.getByRole('banner')).toHaveClass('stx-header-sticky');
    });

    it('applies fixed variant', () => {
      render(<Header navLinks={mockNavLinks} variant="fixed" />);
      expect(screen.getByRole('banner')).toHaveClass('stx-header-fixed');
    });

    it('applies custom className', () => {
      render(<Header navLinks={mockNavLinks} className="custom-header" />);
      expect(screen.getByRole('banner')).toHaveClass('custom-header');
    });

    it('renders with different themes', () => {
      const { rerender } = render(<Header navLinks={mockNavLinks} theme="light" />);
      expect(screen.getByRole('banner')).toHaveClass('stx-header-light');
      
      rerender(<Header navLinks={mockNavLinks} theme="dark" />);
      expect(screen.getByRole('banner')).toHaveClass('stx-header-dark');
    });
  });

  // 4. Responsive Behavior
  describe('Responsive Behavior', () => {
    it('switches between desktop and mobile navigation', () => {
      render(<Header navLinks={mockNavLinks} />);
      
      // Desktop behavior
      expect(screen.getByRole('navigation')).toHaveClass('stx-header-nav-desktop');
      expect(screen.queryByLabelText('Toggle mobile menu')).not.toBeVisible();
      
      // Mobile behavior (simulate small screen)
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      fireEvent(window, new Event('resize'));
      
      expect(screen.getByLabelText('Toggle mobile menu')).toBeVisible();
    });

    it('maintains navigation functionality on different screen sizes', () => {
      const mockOnNavigate = vi.fn();
      render(<Header navLinks={mockNavLinks} onNavigate={mockOnNavigate} />);
      
      // Test desktop navigation
      const desktopServicesLink = screen.getByText('Services');
      fireEvent.click(desktopServicesLink);
      expect(mockOnNavigate).toHaveBeenCalledWith('/services');
      
      // Test mobile navigation
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      fireEvent(window, new Event('resize'));
      
      const mobileToggle = screen.getByLabelText('Toggle mobile menu');
      fireEvent.click(mobileToggle);
      
      const mobileServicesLink = screen.getByText('Services');
      fireEvent.click(mobileServicesLink);
      
      expect(mockOnNavigate).toHaveBeenCalledWith('/services');
    });

    it('handles responsive layout changes', () => {
      render(<Header navLinks={mockNavLinks} />);
      
      // Start with desktop
      expect(screen.getByRole('navigation')).toHaveClass('stx-header-nav-desktop');
      
      // Switch to mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      fireEvent(window, new Event('resize'));
      
      expect(screen.getByLabelText('Toggle mobile menu')).toBeVisible();
      
      // Switch back to desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      fireEvent(window, new Event('resize'));
      
      expect(screen.getByRole('navigation')).toHaveClass('stx-header-nav-desktop');
    });
  });
});
```

### Hero Component

```typescript
// Hero.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  // 1. STX Classes
  describe('STX Classes', () => {
    it('renders with STX classes', () => {
      render(<Hero />);
      
      expect(screen.getByRole('banner')).toHaveClass('stx-hero');
      expect(screen.getByRole('banner')).toHaveClass('stx-hero-default');
      expect(screen.getByRole('banner')).toHaveClass('stx-hero-lg');
    });

    it('renders hero content with STX classes', () => {
      render(<Hero />);
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveClass('stx-hero-headline');
      expect(screen.getByText(/Experience the future/)).toHaveClass('stx-hero-description');
    });

    it('renders form with STX classes', () => {
      render(<Hero />);
      
      expect(screen.getByRole('form')).toHaveClass('stx-hero-form');
      expect(screen.getByRole('textbox')).toHaveClass('stx-hero-form-textarea');
      expect(screen.getByRole('button', { name: /Get Free Prototype/ })).toHaveClass('stx-hero-form-submit');
    });
  });

  // 2. Organism-Specific Functionality
  describe('Organism-Specific Functionality', () => {
    it('submits form with user input', async () => {
      const mockOnSubmit = vi.fn();
      render(<Hero onSubmit={mockOnSubmit} />);
      
      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /Get Free Prototype/ });
      
      fireEvent.change(textarea, {
        target: { value: 'I want to create an e-commerce platform' }
      });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          description: 'I want to create an e-commerce platform',
          contactMethod: 'email',
          contactValue: ''
        });
      });
    });

    it('handles voice recording', () => {
      render(<Hero />);
      
      const voiceButton = screen.getByRole('button', { name: /Tell us with your voice/ });
      fireEvent.click(voiceButton);
      
      expect(voiceButton).toHaveClass('stx-hero-form-voice-btn-recording');
      expect(screen.getByText(/Recording:/)).toBeInTheDocument();
    });

    it('changes contact method', () => {
      render(<Hero />);
      
      const contactSelect = screen.getByRole('combobox');
      fireEvent.change(contactSelect, { target: { value: 'whatsapp' } });
      
      const contactInput = screen.getByRole('textbox', { name: /contact/i });
      expect(contactInput).toHaveAttribute('placeholder', '+420 774 287 541');
    });

    it('validates required fields', () => {
      render(<Hero />);
      
      const submitButton = screen.getByRole('button', { name: /Get Free Prototype/ });
      fireEvent.click(submitButton);
      
      expect(screen.getByText('Please describe your idea')).toBeInTheDocument();
      expect(screen.getByText('Please provide your contact information')).toBeInTheDocument();
    });
  });

  // 3. Layout Variants
  describe('Layout Variants', () => {
    it('applies different variants', () => {
      const { rerender } = render(<Hero variant="centered" />);
      expect(screen.getByRole('banner')).toHaveClass('stx-hero-centered');
      
      rerender(<Hero variant="minimal" />);
      expect(screen.getByRole('banner')).toHaveClass('stx-hero-minimal');
    });

    it('applies different sizes', () => {
      const { rerender } = render(<Hero size="sm" />);
      expect(screen.getByRole('banner')).toHaveClass('stx-hero-sm');
      
      rerender(<Hero size="md" />);
      expect(screen.getByRole('banner')).toHaveClass('stx-hero-md');
    });

    it('applies custom className', () => {
      render(<Hero className="custom-hero" />);
      expect(screen.getByRole('banner')).toHaveClass('custom-hero');
    });
  });

  // 4. Responsive Behavior
  describe('Responsive Behavior', () => {
    it('adapts layout for mobile devices', () => {
      render(<Hero />);
      
      // Simulate mobile screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      fireEvent(window, new Event('resize'));
      
      expect(screen.getByRole('banner')).toHaveClass('stx-hero-mobile');
    });

    it('maintains form functionality on different screen sizes', () => {
      render(<Hero />);
      
      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /Get Free Prototype/ });
      
      // Test on desktop
      fireEvent.change(textarea, { target: { value: 'Desktop test' } });
      expect(textarea).toHaveValue('Desktop test');
      
      // Test on mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      fireEvent(window, new Event('resize'));
      
      fireEvent.change(textarea, { target: { value: 'Mobile test' } });
      expect(textarea).toHaveValue('Mobile test');
      
      fireEvent.click(submitButton);
      expect(submitButton).toBeInTheDocument();
    });
  });
});
```

## Templates

### HomePageTemplate Component

```typescript
// HomePageTemplate.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomePageTemplate } from './HomePageTemplate';

describe('HomePageTemplate', () => {
  // 1. STX Classes
  describe('STX Classes', () => {
    it('renders with STX classes', () => {
      render(<HomePageTemplate />);
      
      expect(screen.getByRole('main')).toHaveClass('stx-homepage-template');
      expect(screen.getByRole('banner')).toHaveClass('stx-hero');
      expect(screen.getByRole('contentinfo')).toHaveClass('stx-footer');
    });

    it('renders sections with STX classes', () => {
      render(<HomePageTemplate />);
      
      expect(screen.getByText('Services')).toHaveClass('stx-section-title');
      expect(screen.getByText('About Us')).toHaveClass('stx-section-title');
      expect(screen.getByText('Contact')).toHaveClass('stx-section-title');
    });
  });

  // 2. Organism-Specific Functionality
  describe('Organism-Specific Functionality', () => {
    it('renders all required sections', () => {
      render(<HomePageTemplate />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument(); // Hero
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer
    });

    it('handles navigation between sections', () => {
      render(<HomePageTemplate />);
      
      const servicesLink = screen.getByText('Services').closest('a');
      expect(servicesLink).toHaveAttribute('href', '#services');
      
      const aboutLink = screen.getByText('About Us').closest('a');
      expect(aboutLink).toHaveAttribute('href', '#about');
    });

    it('displays dynamic content', () => {
      const customContent = {
        heroTitle: 'Custom Hero Title',
        services: [{ title: 'Custom Service', description: 'Custom description' }]
      };
      
      render(<HomePageTemplate content={customContent} />);
      
      expect(screen.getByText('Custom Hero Title')).toBeInTheDocument();
      expect(screen.getByText('Custom Service')).toBeInTheDocument();
    });
  });

  // 3. Layout Variants
  describe('Layout Variants', () => {
    it('applies different layout variants', () => {
      const { rerender } = render(<HomePageTemplate layout="standard" />);
      expect(screen.getByRole('main')).toHaveClass('stx-homepage-template-standard');
      
      rerender(<HomePageTemplate layout="minimal" />);
      expect(screen.getByRole('main')).toHaveClass('stx-homepage-template-minimal');
    });

    it('applies custom className', () => {
      render(<HomePageTemplate className="custom-template" />);
      expect(screen.getByRole('main')).toHaveClass('custom-template');
    });

    it('renders with different themes', () => {
      const { rerender } = render(<HomePageTemplate theme="light" />);
      expect(screen.getByRole('main')).toHaveClass('stx-homepage-template-light');
      
      rerender(<HomePageTemplate theme="dark" />);
      expect(screen.getByRole('main')).toHaveClass('stx-homepage-template-dark');
    });
  });

  // 4. Responsive Behavior
  describe('Responsive Behavior', () => {
    it('adapts layout for different screen sizes', () => {
      render(<HomePageTemplate />);
      
      // Desktop layout
      expect(screen.getByRole('main')).toHaveClass('stx-homepage-template-desktop');
      
      // Mobile layout
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      fireEvent(window, new Event('resize'));
      
      expect(screen.getByRole('main')).toHaveClass('stx-homepage-template-mobile');
    });

    it('maintains navigation functionality on mobile', () => {
      render(<HomePageTemplate />);
      
      // Simulate mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      fireEvent(window, new Event('resize'));
      
      const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
      fireEvent.click(mobileMenuButton);
      
      expect(screen.getByRole('navigation')).toHaveClass('stx-header-nav-mobile-open');
    });

    it('handles responsive content changes', () => {
      render(<HomePageTemplate />);
      
      // Desktop content
      expect(screen.getByText('Services')).toBeInTheDocument();
      
      // Mobile content (simulate different content for mobile)
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      fireEvent(window, new Event('resize'));
      
      expect(screen.getByText('Services')).toBeInTheDocument();
      // Additional mobile-specific content checks
    });
  });
});
```

## Conclusion

These examples demonstrate how to apply the four main testing parameters to different types of components:

1. **STX Classes** - verification of correct CSS class application
2. **Organism-Specific Functionality** - testing of unique functionality
3. **Layout Variants** - verification of different display variants
4. **Responsive Behavior** - testing of adaptive behavior

Each component should be tested according to all four parameters to ensure complete coverage and code quality. 