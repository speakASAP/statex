import React from 'react';
import { render, screen } from '@testing-library/react';
import { FeaturesSection } from './FeaturesSection';
import { testCompleteThemeSupport, renderWithTheme, ALL_THEMES, ThemeName } from '../../test/utils/theme-testing';

describe('FeaturesSection Component', () => {
  const defaultProps = {
    title: 'Why Choose StateX?',
    features: [
      {
        icon: '🤖',
        title: 'AI-Powered Development',
        description: 'Advanced AI algorithms that understand your requirements and generate working code.'
      },
      {
        icon: '⚡',
        title: '24-Hour Delivery',
        description: 'Get your prototype delivered within 24 hours, guaranteed.'
      },
      {
        icon: '🎯',
        title: 'No Coding Required',
        description: 'Simply describe your idea and let our AI do the heavy lifting.'
      }
    ]
  };

  describe('Basic Rendering', () => {
    it('renders the section with title', () => {
      render(<FeaturesSection {...defaultProps} />);

      expect(screen.getByText('Why Choose StateX?')).toBeInTheDocument();
    });

    it('renders all features', () => {
      render(<FeaturesSection {...defaultProps} />);

      expect(screen.getByText('AI-Powered Development')).toBeInTheDocument();
      expect(screen.getByText('24-Hour Delivery')).toBeInTheDocument();
      expect(screen.getByText('No Coding Required')).toBeInTheDocument();
    });

    it('renders feature descriptions', () => {
      render(<FeaturesSection {...defaultProps} />);

      expect(screen.getByText('Advanced AI algorithms that understand your requirements and generate working code.')).toBeInTheDocument();
      expect(screen.getByText('Get your prototype delivered within 24 hours, guaranteed.')).toBeInTheDocument();
      expect(screen.getByText('Simply describe your idea and let our AI do the heavy lifting.')).toBeInTheDocument();
    });

    it('renders feature icons', () => {
      render(<FeaturesSection {...defaultProps} />);

      expect(screen.getByText('🤖')).toBeInTheDocument();
      expect(screen.getByText('⚡')).toBeInTheDocument();
      expect(screen.getByText('🎯')).toBeInTheDocument();
    });
  });

  describe('Structure and Semantics', () => {
    it('has correct section structure', () => {
      render(<FeaturesSection {...defaultProps} />);

      const section = screen.getByText('Why Choose StateX?').closest('section');
      expect(section).toHaveClass('stx-features-section');
    });

    it('has correct heading hierarchy', () => {
      render(<FeaturesSection {...defaultProps} />);

      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('Why Choose StateX?');

      const featureHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(featureHeadings).toHaveLength(3);
    });

    it('has proper container structure', () => {
      render(<FeaturesSection {...defaultProps} />);

      const container = screen.getByText('Why Choose StateX?').closest('.stx-features-container');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Content Customization', () => {
    it('renders custom title', () => {
      render(<FeaturesSection {...defaultProps} title="Custom Title" />);

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('renders custom features', () => {
      const customFeatures = [
        {
          icon: '🚀',
          title: 'Custom Feature',
          description: 'Custom description for testing.'
        }
      ];

      render(<FeaturesSection {...defaultProps} features={customFeatures} />);

      expect(screen.getByText('Custom Feature')).toBeInTheDocument();
      expect(screen.getByText('Custom description for testing.')).toBeInTheDocument();
      expect(screen.getByText('🚀')).toBeInTheDocument();
    });
  });

  describe('Layout Variations', () => {
    it('renders grid layout correctly', () => {
      render(<FeaturesSection {...defaultProps} layout="grid" />);

      const featuresContainer = screen.getByText('AI-Powered Development').closest('.stx-features');
      expect(featuresContainer).toHaveClass('stx-features--grid');
    });

    it('renders list layout correctly', () => {
      render(<FeaturesSection {...defaultProps} layout="list" />);

      const featuresContainer = screen.getByText('AI-Powered Development').closest('.stx-features');
      expect(featuresContainer).toHaveClass('stx-features--list');
    });

    it('renders cards layout correctly', () => {
      render(<FeaturesSection {...defaultProps} layout="cards" />);

      const featuresContainer = screen.getByText('AI-Powered Development').closest('.stx-features');
      expect(featuresContainer).toHaveClass('stx-features--cards');
    });

    it('defaults to grid layout when no layout specified', () => {
      render(<FeaturesSection {...defaultProps} />);

      const featuresContainer = screen.getByText('AI-Powered Development').closest('.stx-features');
      expect(featuresContainer).toHaveClass('stx-features--grid');
    });
  });

  describe('Feature Item Structure', () => {
    it('renders feature items with correct classes for grid layout', () => {
      render(<FeaturesSection {...defaultProps} layout="grid" />);

      const featureItems = screen.getAllByText(/AI-Powered Development|24-Hour Delivery|No Coding Required/);
      featureItems.forEach(item => {
        const featureItem = item.closest('.stx-features__item');
        expect(featureItem).toHaveClass('stx-features__item--grid');
      });
    });

    it('renders feature items with correct classes for list layout', () => {
      render(<FeaturesSection {...defaultProps} layout="list" />);

      const featureItems = screen.getAllByText(/AI-Powered Development|24-Hour Delivery|No Coding Required/);
      featureItems.forEach(item => {
        const featureItem = item.closest('.stx-features__item');
        expect(featureItem).toHaveClass('stx-features__item--list');
      });
    });

    it('renders feature icons in correct containers', () => {
      render(<FeaturesSection {...defaultProps} />);

      const icons = ['🤖', '⚡', '🎯'];
      icons.forEach(icon => {
        const iconContainer = screen.getByText(icon).closest('.stx-features__icon');
        expect(iconContainer).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles empty features array', () => {
      render(<FeaturesSection {...defaultProps} features={[]} />);

      const section = screen.getByText('Why Choose StateX?').closest('section');
      expect(section).toBeInTheDocument();

      // Should not crash, but may show empty features container
      const featuresContainer = section?.querySelector('.stx-features');
      expect(featuresContainer).toBeInTheDocument();
    });

    it('handles invalid layout gracefully', () => {
      render(<FeaturesSection {...defaultProps} layout="invalid" as any />);

      const section = screen.getByText('Why Choose StateX?').closest('section');
      expect(section).toBeInTheDocument();
      // Should fall back to default grid layout
      const featuresContainer = screen.getByText('AI-Powered Development').closest('.stx-features');
      expect(featuresContainer).toHaveClass('stx-features--grid');
    });

    it('handles missing title gracefully', () => {
      render(<FeaturesSection {...defaultProps} title="" />);

      const section = screen.getByRole('heading', { level: 2 }).closest('section');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<FeaturesSection {...defaultProps} />);

      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toBeInTheDocument();

      const featureHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(featureHeadings).toHaveLength(3);
    });

    it('has descriptive text content', () => {
      render(<FeaturesSection {...defaultProps} />);

      expect(screen.getByText('Why Choose StateX?')).toBeInTheDocument();
      expect(screen.getByText('AI-Powered Development')).toBeInTheDocument();
      expect(screen.getByText('Advanced AI algorithms that understand your requirements and generate working code.')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders without performance issues', () => {
      const startTime = performance.now();

      render(<FeaturesSection {...defaultProps} />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render quickly (less than 200ms to be more realistic)
      expect(renderTime).toBeLessThan(200);
    });
  });

  // Enhanced theme support tests using the utility
  testCompleteThemeSupport(
    'FeaturesSection',
    (theme: ThemeName) => <FeaturesSection {...defaultProps} />,
    {
      testSelectors: {
        background: '.stx-features-section',
        text: '.stx-features__title',
        border: '.stx-features-section',
        action: '.stx-features__item'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true,
      testEnhancedIntegration: true,
      testEnhancedPerformance: true
    }
  );
});
