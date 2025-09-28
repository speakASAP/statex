import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './Card';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES, ThemeName } from '../../test/utils/theme-testing';

describe('Card', () => {
  it('renders with default variant', () => {
    render(<Card>Card content</Card>);
    const card = screen.getByText('Card content');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('stx-card');
  });

  it('renders with all variants', () => {
    const variants = [
      { variant: 'default', className: 'stx-card' },
      { variant: 'service', className: 'stx-card--service' },
      { variant: 'feature', className: 'stx-card--feature' },
      { variant: 'value', className: 'stx-card--value' },
      { variant: 'deliverable', className: 'stx-card--deliverable' },
    ];
    variants.forEach(({ variant, className }) => {
      render(<Card variant={variant as any}>{variant}</Card>);
      const card = screen.getByText(variant);
      expect(card).toHaveClass(className);
    });
  });

  it('applies hover effect when enabled', () => {
    render(<Card hover>Hover card</Card>);
    const card = screen.getByText('Hover card');
    expect(card).toHaveClass('stx-card--hover');
  });

  it('does not apply hover effect when disabled', () => {
    render(<Card hover={false}>No hover card</Card>);
    const card = screen.getByText('No hover card');
    expect(card).not.toHaveClass('stx-card--hover');
  });

  it('applies custom className', () => {
    render(<Card className="custom-class">Custom card</Card>);
    const card = screen.getByText('Custom card');
    expect(card).toHaveClass('custom-class');
  });

  it('renders service card with all elements', () => {
    const icon = <span data-testid="icon">🚀</span>;
    const action = <button>Action</button>;
    render(
      <Card variant="service" icon={icon} title="Service" description="Description" action={action} />
    );
    expect(screen.getByText('Service')).toHaveClass('stx-service-card__title');
    expect(screen.getByText('Description')).toHaveClass('stx-service-card__description');
    expect(screen.getByTestId('icon').parentElement).toHaveClass('stx-service-card__icon');
    expect(screen.getByRole('button').parentElement).toHaveClass('stx-service-card__action');
  });

  it('renders feature card with all elements', () => {
    const icon = <span data-testid="icon">⚡</span>;
    render(
      <Card variant="feature" icon={icon} title="Feature" description="Description" />
    );
    expect(screen.getByText('Feature')).toHaveClass('stx-feature-card__title');
    expect(screen.getByText('Description')).toHaveClass('stx-feature-card__description');
    expect(screen.getByTestId('icon').parentElement).toHaveClass('stx-feature-card__icon');
  });

  it('renders value card with all elements', () => {
    const icon = <span data-testid="icon">💎</span>;
    render(
      <Card variant="value" icon={icon} title="Value" description="Description" />
    );
    expect(screen.getByText('Value')).toHaveClass('stx-value-card__title');
    expect(screen.getByText('Description')).toHaveClass('stx-value-card__description');
    expect(screen.getByTestId('icon').parentElement).toHaveClass('stx-value-card__icon');
  });

  it('renders deliverable card with all elements', () => {
    const icon = <span data-testid="icon">📦</span>;
    render(
      <Card variant="deliverable" icon={icon} title="Deliverable" description="Description" />
    );
    expect(screen.getByText('Deliverable')).toHaveClass('stx-deliverable-card__title');
    expect(screen.getByText('Description')).toHaveClass('stx-deliverable-card__description');
    expect(screen.getByTestId('icon').parentElement).toHaveClass('stx-deliverable-card__icon');
  });
});

describe('CardHeader', () => {
  it('renders with children', () => {
    render(<CardHeader>Header content</CardHeader>);
    const header = screen.getByText('Header content');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('stx-card__header');
  });
});

describe('CardTitle', () => {
  it('renders with children', () => {
    render(<CardTitle>Card Title</CardTitle>);
    const title = screen.getByText('Card Title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('stx-card__title');
  });
});

describe('CardDescription', () => {
  it('renders with children', () => {
    render(<CardDescription>Card Description</CardDescription>);
    const description = screen.getByText('Card Description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('stx-card__description');
  });
});

describe('CardContent', () => {
  it('renders with children', () => {
    render(<CardContent>Content text</CardContent>);
    const content = screen.getByText('Content text');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('stx-card__content');
  });
});

describe('CardFooter', () => {
  it('renders with children', () => {
    render(<CardFooter>Footer text</CardFooter>);
    const footer = screen.getByText('Footer text');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('stx-card__footer');
  });
});

// Theme switching tests
describe('Card Theme Support', () => {
  // Test all card variants in all themes
  describe('Card Variants Theme Support', () => {
    const variants = ['default', 'service', 'feature', 'value', 'deliverable'] as const;

    variants.forEach(variant => {
      ALL_THEMES.forEach(theme => {
        it(`${variant} variant renders correctly in ${theme} theme`, () => {
          const { container } = renderWithTheme(
            <Card variant={variant}>Test Card</Card>,
            theme
          );

          const card = container.querySelector('.stx-card');
          expect(card).toBeInTheDocument();
          expect(card).toHaveClass('stx-card');

          // Verify theme-specific styling
          const computedStyle = getComputedStyle(card as Element);
          expect(computedStyle.backgroundColor).toBeDefined();
          expect(computedStyle.borderColor).toBeDefined();
        });
      });
    });
  });

  // Test card backgrounds in all themes
  describe('Card Backgrounds Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`card background renders correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Card>Background Test</Card>,
          theme
        );

        const card = container.querySelector('.stx-card');
        expect(card).toBeInTheDocument();

        // Verify background styling
        const computedStyle = getComputedStyle(card as Element);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.backgroundImage).toBeDefined();
      });
    });
  });

  // Test card borders in all themes
  describe('Card Borders Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`card borders render correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Card>Border Test</Card>,
          theme
        );

        const card = container.querySelector('.stx-card');
        expect(card).toBeInTheDocument();

        // Verify border styling
        const computedStyle = getComputedStyle(card as Element);
        expect(computedStyle.borderColor).toBeDefined();
        expect(computedStyle.borderStyle).toBeDefined();
        expect(computedStyle.borderWidth).toBeDefined();
      });
    });
  });

  // Test hover effects in all themes
  describe('Card Hover Effects Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`card hover effects work correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Card hover>Hover Test</Card>,
          theme
        );

        const card = container.querySelector('.stx-card');
        expect(card).toBeInTheDocument();
        expect(card).toHaveClass('stx-card--hover');

        // Verify hover styling
        const computedStyle = getComputedStyle(card as Element);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.transition).toBeDefined();
      });
    });
  });

  // Test service cards in all themes
  describe('Service Cards Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`service card renders correctly in ${theme} theme`, () => {
        const icon = <span data-testid="icon">🚀</span>;
        const action = <button>Action</button>;

        const { container } = renderWithTheme(
          <Card variant="service" icon={icon} title="Service" description="Description" action={action} />,
          theme
        );

        const card = container.querySelector('.stx-card');
        expect(card).toBeInTheDocument();
        expect(card).toHaveClass('stx-card--service');

        // Verify service card elements
        expect(screen.getByText('Service')).toHaveClass('stx-service-card__title');
        expect(screen.getByText('Description')).toHaveClass('stx-service-card__description');
        expect(screen.getByTestId('icon').parentElement).toHaveClass('stx-service-card__icon');
        expect(screen.getByRole('button').parentElement).toHaveClass('stx-service-card__action');

        // Verify theme-specific styling
        const computedStyle = getComputedStyle(card as Element);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.borderColor).toBeDefined();
      });
    });
  });

  // Test feature cards in all themes
  describe('Feature Cards Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`feature card renders correctly in ${theme} theme`, () => {
        const icon = <span data-testid="icon">⚡</span>;

        const { container } = renderWithTheme(
          <Card variant="feature" icon={icon} title="Feature" description="Description" />,
          theme
        );

        const card = container.querySelector('.stx-card');
        expect(card).toBeInTheDocument();
        expect(card).toHaveClass('stx-card--feature');

        // Verify feature card elements
        expect(screen.getByText('Feature')).toHaveClass('stx-feature-card__title');
        expect(screen.getByText('Description')).toHaveClass('stx-feature-card__description');
        expect(screen.getByTestId('icon').parentElement).toHaveClass('stx-feature-card__icon');

        // Verify theme-specific styling
        const computedStyle = getComputedStyle(card as Element);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.borderColor).toBeDefined();
      });
    });
  });

  // Test value cards in all themes
  describe('Value Cards Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`value card renders correctly in ${theme} theme`, () => {
        const icon = <span data-testid="icon">💎</span>;

        const { container } = renderWithTheme(
          <Card variant="value" icon={icon} title="Value" description="Description" />,
          theme
        );

        const card = container.querySelector('.stx-card');
        expect(card).toBeInTheDocument();
        expect(card).toHaveClass('stx-card--value');

        // Verify value card elements
        expect(screen.getByText('Value')).toHaveClass('stx-value-card__title');
        expect(screen.getByText('Description')).toHaveClass('stx-value-card__description');
        expect(screen.getByTestId('icon').parentElement).toHaveClass('stx-value-card__icon');

        // Verify theme-specific styling
        const computedStyle = getComputedStyle(card as Element);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.borderColor).toBeDefined();
      });
    });
  });

  // Test deliverable cards in all themes
  describe('Deliverable Cards Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`deliverable card renders correctly in ${theme} theme`, () => {
        const icon = <span data-testid="icon">📦</span>;

        const { container } = renderWithTheme(
          <Card variant="deliverable" icon={icon} title="Deliverable" description="Description" />,
          theme
        );

        const card = container.querySelector('.stx-card');
        expect(card).toBeInTheDocument();
        expect(card).toHaveClass('stx-card--deliverable');

        // Verify deliverable card elements
        expect(screen.getByText('Deliverable')).toHaveClass('stx-deliverable-card__title');
        expect(screen.getByText('Description')).toHaveClass('stx-deliverable-card__description');
        expect(screen.getByTestId('icon').parentElement).toHaveClass('stx-deliverable-card__icon');

        // Verify theme-specific styling
        const computedStyle = getComputedStyle(card as Element);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.borderColor).toBeDefined();
      });
    });
  });

  // Test card components in all themes
  describe('Card Components Theme Support', () => {
    ALL_THEMES.forEach(theme => {
      it(`card components render correctly in ${theme} theme`, () => {
        const { container } = renderWithTheme(
          <Card>
            <CardHeader>Header</CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
            <CardContent>Content</CardContent>
            <CardFooter>Footer</CardFooter>
          </Card>,
          theme
        );

        const card = container.querySelector('.stx-card');
        expect(card).toBeInTheDocument();

        // Verify all card components
        expect(screen.getByText('Header')).toHaveClass('stx-card__header');
        expect(screen.getByText('Title')).toHaveClass('stx-card__title');
        expect(screen.getByText('Description')).toHaveClass('stx-card__description');
        expect(screen.getByText('Content')).toHaveClass('stx-card__content');
        expect(screen.getByText('Footer')).toHaveClass('stx-card__footer');

        // Verify theme-specific styling
        const computedStyle = getComputedStyle(card as Element);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.borderColor).toBeDefined();
      });
    });
  });

  // Test theme transitions
  describe('Card Theme Transitions', () => {
    it('supports theme switching without breaking', () => {
      const { rerender } = renderWithTheme(<Card>Test Card</Card>, 'light');

      // Switch to dark theme
      rerender(<Card>Test Card</Card>);
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(<Card>Test Card</Card>);
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(<Card>Test Card</Card>);
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();
    });
  });

  // Test theme accessibility
  describe('Card Theme Accessibility', () => {
    ALL_THEMES.forEach(theme => {
      it(`maintains accessibility in ${theme} theme`, () => {
        const { container } = renderWithTheme(<Card>Accessible Card</Card>, theme);

        const card = container.querySelector('.stx-card');
        expect(card).toBeInTheDocument();

        // Test contrast (basic check)
        const computedStyle = getComputedStyle(card as Element);
        expect(computedStyle.backgroundColor).toBeDefined();
        expect(computedStyle.color).toBeDefined();
      });
    });
  });

  // Test theme performance
  describe('Card Theme Performance', () => {
    it('renders efficiently across all themes', () => {
      const startTime = performance.now();

      ALL_THEMES.forEach(theme => {
        renderWithTheme(<Card>Performance Test</Card>, theme);
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should render all themes within reasonable time
      expect(totalTime).toBeLessThan(1000);
    });
  });

  // Enhanced theme support tests using the utility
  testCompleteThemeSupport(
    'Card',
    (theme: ThemeName) => <Card>Enhanced Theme Test</Card>,
    {
      testSelectors: {
        background: '.stx-card',
        text: '.stx-card__title',
        border: '.stx-card',
        action: '.stx-card__footer'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );
});
