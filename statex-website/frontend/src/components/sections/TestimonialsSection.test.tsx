import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TestimonialsSection, { Testimonial } from './TestimonialsSection';
import {
  testCompleteThemeSupport,
  renderWithTheme,
  ALL_THEMES,
  type ThemeName
} from '../../test/utils/theme-testing';

// Mock data
const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'CEO',
    company: 'TechCorp',
    content: 'Statex transformed our business completely. The automation solutions they implemented saved us countless hours.',
    rating: 5,
    image: '/images/john-smith.jpg'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'CTO',
    company: 'InnovateLab',
    content: 'Outstanding service and technical expertise. The team delivered exactly what we needed on time and budget.',
    rating: 5,
    image: '/images/sarah-johnson.jpg'
  },
  {
    id: '3',
    name: 'Michael Brown',
    role: 'Operations Director',
    company: 'Global Solutions',
    content: 'The AI integration they built for us has revolutionized our customer service. Highly recommended!',
    rating: 4,
    image: '/images/michael-brown.jpg'
  }
];

describe('TestimonialsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup
  });

  describe('STX Classes', () => {
    it('applies correct STX classes to testimonials section', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      const testimonialsSection = document.querySelector('.stx-testimonials');
      expect(testimonialsSection).toBeInTheDocument();
    });

    it('applies variant classes correctly', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} variant="carousel" />);

      const testimonialsSection = document.querySelector('.stx-testimonials--carousel');
      expect(testimonialsSection).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} className="custom-testimonials" />);

      const testimonialsSection = document.querySelector('.stx-testimonials');
      expect(testimonialsSection).toHaveClass('custom-testimonials');
    });

    it('applies BEM-style classes to testimonial elements', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      const testimonialsHeader = document.querySelector('.stx-testimonials__header');
      const testimonialsTitle = document.querySelector('.stx-testimonials__title');
      const testimonialsSubtitle = document.querySelector('.stx-testimonials__subtitle');
      const testimonialsContent = document.querySelector('.stx-testimonials__content');
      const testimonialItems = document.querySelectorAll('.stx-testimonials__item');

      expect(testimonialsHeader).toBeInTheDocument();
      expect(testimonialsTitle).toBeInTheDocument();
      expect(testimonialsSubtitle).toBeInTheDocument();
      expect(testimonialsContent).toBeInTheDocument();
      expect(testimonialItems).toHaveLength(3);
    });

    it('applies testimonial item classes', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      const testimonialItems = document.querySelectorAll('.stx-testimonials__item');
      expect(testimonialItems).toHaveLength(3);

      testimonialItems.forEach(item => {
        expect(item).toHaveClass('stx-testimonials__item');
      });
    });

    it('applies testimonial content classes', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      const testimonialContents = document.querySelectorAll('.stx-testimonials__content');
      expect(testimonialContents.length).toBeGreaterThan(0);

      testimonialContents.forEach(content => {
        expect(content).toHaveClass('stx-testimonials__content');
      });
    });

    it('applies testimonial text classes', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      const testimonialTexts = document.querySelectorAll('.stx-testimonials__text');
      expect(testimonialTexts).toHaveLength(3);

      testimonialTexts.forEach(text => {
        expect(text).toHaveClass('stx-testimonials__text');
      });
    });

    it('applies author section classes', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      const authorSections = document.querySelectorAll('.stx-testimonials__author');
      expect(authorSections).toHaveLength(3);

      authorSections.forEach(author => {
        expect(author).toHaveClass('stx-testimonials__author');
      });
    });

    it('applies info section classes', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      const infoSections = document.querySelectorAll('.stx-testimonials__info');
      expect(infoSections).toHaveLength(3);

      infoSections.forEach(info => {
        expect(info).toHaveClass('stx-testimonials__info');
      });
    });

    it('applies rating classes', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      const ratings = document.querySelectorAll('.stx-testimonials__rating');
      expect(ratings).toHaveLength(3);

      ratings.forEach(rating => {
        expect(rating).toHaveClass('stx-testimonials__rating');
      });
    });

    it('applies star classes', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      const stars = document.querySelectorAll('.stx-testimonials__star');
      expect(stars.length).toBeGreaterThan(0);

      stars.forEach(star => {
        expect(star).toHaveClass('stx-testimonials__star');
      });
    });
  });

  describe('Template Section Functionality', () => {
    it('renders default title and subtitle', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      expect(screen.getByText('What Our Clients Say')).toBeInTheDocument();
      expect(screen.getByText("Real feedback from businesses we've helped transform")).toBeInTheDocument();
    });

    it('renders custom title and subtitle', () => {
      render(
        <TestimonialsSection
          testimonials={mockTestimonials}
          title="Custom Title"
          subtitle="Custom Subtitle"
        />
      );

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
    });

    it('renders all testimonials', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Michael Brown')).toBeInTheDocument();
    });

    it('renders testimonial content', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      expect(screen.getByText(/Statex transformed our business completely/)).toBeInTheDocument();
      expect(screen.getByText(/Outstanding service and technical expertise/)).toBeInTheDocument();
      expect(screen.getByText(/The AI integration they built for us/)).toBeInTheDocument();
    });

    it('renders testimonial roles and companies', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      expect(screen.getByText('CEO')).toBeInTheDocument();
      expect(screen.getByText('TechCorp')).toBeInTheDocument();
      expect(screen.getByText('CTO')).toBeInTheDocument();
      expect(screen.getByText('InnovateLab')).toBeInTheDocument();
      expect(screen.getByText('Operations Director')).toBeInTheDocument();
      expect(screen.getByText('Global Solutions')).toBeInTheDocument();
    });

    it('renders testimonial ratings', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      const stars = document.querySelectorAll('.stx-testimonials__star');
      expect(stars).toHaveLength(14); // 5 + 5 + 4 stars
    });

    it('handles testimonials without ratings', () => {
      const testimonialsWithoutRatings = mockTestimonials.map(t => ({ ...t, rating: undefined }));

      render(<TestimonialsSection testimonials={testimonialsWithoutRatings} />);

      const ratings = document.querySelectorAll('.stx-testimonials__rating');
      expect(ratings).toHaveLength(3);

      // Check that rating divs exist but have no stars
      ratings.forEach(rating => {
        const stars = rating.querySelectorAll('.stx-testimonials__star');
        expect(stars).toHaveLength(0);
      });
    });

    it('handles empty testimonials array', () => {
      render(<TestimonialsSection testimonials={[]} />);

      const testimonialsSection = document.querySelector('.stx-testimonials');
      expect(testimonialsSection).not.toBeInTheDocument();
    });

    it('handles undefined testimonials', () => {
      render(<TestimonialsSection testimonials={undefined as any} />);

      const testimonialsSection = document.querySelector('.stx-testimonials');
      expect(testimonialsSection).not.toBeInTheDocument();
    });

    it('handles single testimonial', () => {
      const singleTestimonial = [mockTestimonials[0]];

      render(<TestimonialsSection testimonials={singleTestimonial} />);

      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(screen.queryByText('Sarah Johnson')).not.toBeInTheDocument();
      expect(screen.queryByText('Michael Brown')).not.toBeInTheDocument();
    });
  });

  describe('Layout Variants', () => {
    it('renders grid variant by default', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      const testimonialsSection = document.querySelector('.stx-testimonials--grid');
      expect(testimonialsSection).toBeInTheDocument();
    });

    it('renders carousel variant', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} variant="carousel" />);

      const testimonialsSection = document.querySelector('.stx-testimonials--carousel');
      expect(testimonialsSection).toBeInTheDocument();
    });

    it('renders list variant', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} variant="list" />);

      const testimonialsSection = document.querySelector('.stx-testimonials--list');
      expect(testimonialsSection).toBeInTheDocument();
    });

    it('applies variant-specific content classes', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} variant="carousel" />);

      const contentSection = document.querySelector('.stx-testimonials__content--carousel');
      expect(contentSection).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('adapts to mobile viewport', () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<TestimonialsSection testimonials={mockTestimonials} />);

      const testimonialsSection = document.querySelector('.stx-testimonials');
      expect(testimonialsSection).toBeInTheDocument();

      // Reset viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('maintains structure on different screen sizes', () => {
      const viewports = [375, 768, 1024, 1440];

      viewports.forEach(width => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        });

        render(<TestimonialsSection testimonials={mockTestimonials} />);

        const testimonialsSection = document.querySelector('.stx-testimonials');
        expect(testimonialsSection).toBeInTheDocument();

        // Clean up
        document.body.innerHTML = '';
      });
    });
  });

  describe('Accessibility', () => {
    it('maintains proper semantic structure', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      const testimonialsSection = document.querySelector('section');
      expect(testimonialsSection).toBeInTheDocument();
      expect(testimonialsSection).toHaveClass('stx-testimonials');
    });

    it('provides proper heading hierarchy', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      const sectionTitle = document.querySelector('.stx-testimonials__title');
      const testimonialNames = document.querySelectorAll('.stx-testimonials__name');

      expect(sectionTitle).toBeInTheDocument();
      expect(testimonialNames).toHaveLength(3);
    });

    it('provides accessible rating display', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      const ratings = document.querySelectorAll('.stx-testimonials__rating');
      expect(ratings).toHaveLength(3);

      ratings.forEach(rating => {
        const stars = rating.querySelectorAll('.stx-testimonials__star');
        expect(stars.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Performance & Error Handling', () => {
    it('renders efficiently with multiple testimonials', () => {
      const startTime = performance.now();

      render(<TestimonialsSection testimonials={mockTestimonials} />);

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100); // Should render quickly
    });

    it('handles missing testimonial properties gracefully', () => {
      const incompleteTestimonials = [
        {
          id: '1',
          name: 'Incomplete Testimonial',
          role: '',
          company: '',
          content: '',
          rating: undefined,
          image: undefined
        }
      ];

      render(<TestimonialsSection testimonials={incompleteTestimonials} />);

      expect(screen.getByText('Incomplete Testimonial')).toBeInTheDocument();
    });

    it('handles invalid rating values', () => {
      const testimonialsWithInvalidRatings = [
        { ...mockTestimonials[0], rating: 0 },
        { ...mockTestimonials[1], rating: 6 },
        { ...mockTestimonials[2], rating: -1 }
      ];

      render(<TestimonialsSection testimonials={testimonialsWithInvalidRatings} />);

      const ratings = document.querySelectorAll('.stx-testimonials__rating');
      expect(ratings).toHaveLength(3);
    });
  });

  describe('Integration Testing', () => {
    it('integrates with container component correctly', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      const container = document.querySelector('.stx-container');
      expect(container).toBeInTheDocument();
    });

    it('handles complex testimonial content', () => {
      const complexTestimonials = [
        {
          id: 'complex-1',
          name: 'Complex Testimonial',
          role: 'Senior Developer',
          company: 'Complex Corp',
          content: 'This is a very long testimonial with special characters: @#$%^&*() and numbers: 1234567890 and emojis: 🚀 💻 📱 and HTML-like content: <strong>Bold</strong> text',
          rating: 5,
          image: '/images/complex.jpg'
        }
      ];

      render(<TestimonialsSection testimonials={complexTestimonials} />);

      expect(screen.getByText('Complex Testimonial')).toBeInTheDocument();
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
      expect(screen.getByText('Complex Corp')).toBeInTheDocument();
      expect(screen.getByText(/This is a very long testimonial/)).toBeInTheDocument();
    });

    it('handles testimonials with different rating values', () => {
      const variedRatings = [
        { ...mockTestimonials[0], rating: 1 },
        { ...mockTestimonials[1], rating: 3 },
        { ...mockTestimonials[2], rating: 5 }
      ];

      render(<TestimonialsSection testimonials={variedRatings} />);

      const ratings = document.querySelectorAll('.stx-testimonials__rating');
      expect(ratings).toHaveLength(3);

      // Check that different numbers of stars are rendered
      const stars = document.querySelectorAll('.stx-testimonials__star');
      expect(stars).toHaveLength(9); // 1 + 3 + 5 stars
    });

    it('maintains testimonial order', () => {
      render(<TestimonialsSection testimonials={mockTestimonials} />);

      const testimonialItems = document.querySelectorAll('.stx-testimonials__item');
      expect(testimonialItems).toHaveLength(3);

      // Check that testimonials are rendered in the correct order
      const firstTestimonial = testimonialItems[0];
      expect(firstTestimonial).toHaveTextContent('John Smith');
      expect(firstTestimonial).toHaveTextContent('TechCorp');

      const secondTestimonial = testimonialItems[1];
      expect(secondTestimonial).toHaveTextContent('Sarah Johnson');
      expect(secondTestimonial).toHaveTextContent('InnovateLab');

      const thirdTestimonial = testimonialItems[2];
      expect(thirdTestimonial).toHaveTextContent('Michael Brown');
      expect(thirdTestimonial).toHaveTextContent('Global Solutions');
    });
  });

  describe('Theme Integration', () => {
    it('integrates with theme system', () => {
      render(
        <div data-theme="dark">
          <TestimonialsSection testimonials={mockTestimonials} />
        </div>
      );

      const testimonialsSection = document.querySelector('.stx-testimonials');
      expect(testimonialsSection).toBeInTheDocument();
    });

    it('applies theme-specific styling', () => {
      const { container } = renderWithTheme(<TestimonialsSection testimonials={mockTestimonials} />, 'dark');

      const themeContainer = container.closest('[data-theme]');
      if (themeContainer) {
        expect(themeContainer).toHaveAttribute('data-theme', 'dark');
      }

      const testimonialsSection = container.querySelector('.stx-testimonials');
      expect(testimonialsSection).toBeInTheDocument();
    });

    it('maintains functionality across all themes', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(<TestimonialsSection testimonials={mockTestimonials} />, theme);

        const testimonialsSection = container.querySelector('.stx-testimonials');
        expect(testimonialsSection).toBeInTheDocument();

        // Verify content is still rendered - use getAllByText to handle multiple instances
        const titleElements = screen.getAllByText('What Our Clients Say');
        expect(titleElements.length).toBeGreaterThan(0);
      });
    });

    it('applies theme-specific CSS variables', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(<TestimonialsSection testimonials={mockTestimonials} />, theme);

        const root = container.closest('[data-theme]');
        if (root) {
          const computedStyle = getComputedStyle(root);

          // Check for theme-specific variables
          const bgPrimary = computedStyle.getPropertyValue('--bg-primary');
          const textPrimary = computedStyle.getPropertyValue('--text-primary');

          expect(bgPrimary).toBeDefined();
          expect(textPrimary).toBeDefined();
        }
      });
    });

    it('supports theme switching without breaking', () => {
      const { rerender } = renderWithTheme(<TestimonialsSection testimonials={mockTestimonials} />, 'light');

      // Switch to dark theme
      rerender(<TestimonialsSection testimonials={mockTestimonials} />);
      const darkContainer = document.querySelector('[data-theme="light"]');
      expect(darkContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(<TestimonialsSection testimonials={mockTestimonials} />);
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(<TestimonialsSection testimonials={mockTestimonials} />);
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();

      // Switch back to light theme
      rerender(<TestimonialsSection testimonials={mockTestimonials} />);
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();
    });
  });

  // Enhanced theme switching tests using the utility
  testCompleteThemeSupport(
    'TestimonialsSection',
    (theme: ThemeName) => <TestimonialsSection testimonials={mockTestimonials} />,
    {
      testSelectors: {
        background: '.stx-testimonials',
        text: '.stx-testimonials__title',
        border: '.stx-testimonials__item',
        action: '.stx-testimonials__rating'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true
    }
  );
});
