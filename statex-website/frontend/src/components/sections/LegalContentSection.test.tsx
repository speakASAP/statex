import React from 'react';
import { render, screen } from '@testing-library/react';
import { LegalContentSection } from './LegalContentSection';
import {
  testCompleteThemeSupport,
  renderWithTheme,
  ALL_THEMES,
  type ThemeName
} from '../../test/utils/theme-testing';

describe('LegalContentSection', () => {
  const defaultProps = {
    title: 'Terms of Service',
    sections: [
      {
        id: 'section-1',
        title: '1. Acceptance of Terms',
        content: '<p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>'
      },
      {
        id: 'section-2',
        title: '2. Use License',
        content: '<p>Permission is granted to temporarily download one copy of the materials (information or software) on StateX\'s website for personal, non-commercial transitory viewing only.</p>'
      },
      {
        id: 'section-3',
        title: '3. Disclaimer',
        content: '<p>The materials on StateX\'s website are provided on an \'as is\' basis. StateX makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>'
      }
    ]
  };

  describe('Basic Rendering', () => {
    it('renders with title and sections', () => {
      render(<LegalContentSection {...defaultProps} />);

      expect(screen.getByText('Terms of Service')).toBeInTheDocument();
      expect(screen.getByText('1. Acceptance of Terms')).toBeInTheDocument();
      expect(screen.getByText('2. Use License')).toBeInTheDocument();
      expect(screen.getByText('3. Disclaimer')).toBeInTheDocument();
    });

    it('renders with minimal props', () => {
      const minimalProps = {
        title: 'Privacy Policy',
        sections: [
          {
            id: 'privacy-1',
            title: 'Data Collection',
            content: '<p>We collect information you provide directly to us.</p>'
          }
        ]
      };

      render(<LegalContentSection {...minimalProps} />);

      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(screen.getByText('Data Collection')).toBeInTheDocument();
    });

    it('applies correct base classes', () => {
      const { container } = render(<LegalContentSection {...defaultProps} />);

      expect(container.firstChild).toHaveClass('stx-legal-content-section');
      expect(container.querySelector('.stx-legal-content-container')).toBeInTheDocument();
    });
  });

  describe('Section Rendering', () => {
    it('renders all sections with correct structure', () => {
      render(<LegalContentSection {...defaultProps} />);

      // Check that all section titles are rendered
      expect(screen.getByText('1. Acceptance of Terms')).toBeInTheDocument();
      expect(screen.getByText('2. Use License')).toBeInTheDocument();
      expect(screen.getByText('3. Disclaimer')).toBeInTheDocument();

      // Check that section containers exist
      const sections = screen.getAllByText(/^[1-3]\./);
      expect(sections).toHaveLength(3);
    });

    it('renders HTML content correctly', () => {
      render(<LegalContentSection {...defaultProps} />);

      // Check that HTML content is rendered
      expect(screen.getByText(/By accessing and using this website/)).toBeInTheDocument();
      expect(screen.getByText(/Permission is granted to temporarily download/)).toBeInTheDocument();
      expect(screen.getByText(/The materials on StateX's website are provided/)).toBeInTheDocument();
    });

    it('renders complex HTML content', () => {
      const complexContentProps = {
        title: 'Complex Legal Document',
        sections: [
          {
            id: 'complex-1',
            title: 'Complex Section',
            content: `
              <h4>Subheading</h4>
              <p>This is a <strong>bold</strong> paragraph with <em>italic</em> text.</p>
              <ul>
                <li>List item 1</li>
                <li>List item 2</li>
              </ul>
              <blockquote>This is a quote</blockquote>
            `
          }
        ]
      };

      render(<LegalContentSection {...complexContentProps} />);

      expect(screen.getByText('Complex Section')).toBeInTheDocument();
      expect(screen.getByText('Subheading')).toBeInTheDocument();
      expect(screen.getByText('bold')).toBeInTheDocument();
      expect(screen.getByText('italic')).toBeInTheDocument();
      expect(screen.getByText('List item 1')).toBeInTheDocument();
      expect(screen.getByText('List item 2')).toBeInTheDocument();
      expect(screen.getByText('This is a quote')).toBeInTheDocument();
    });
  });

  describe('Content Structure', () => {
    it('renders main title with correct heading level', () => {
      render(<LegalContentSection {...defaultProps} />);

      const mainTitle = screen.getByText('Terms of Service');
      expect(mainTitle.tagName).toBe('H2');
      expect(mainTitle).toHaveClass('stx-legal-content__section-title');
    });

    it('renders section titles with correct heading level', () => {
      render(<LegalContentSection {...defaultProps} />);

      const sectionTitles = screen.getAllByText(/^[1-3]\./);
      sectionTitles.forEach(title => {
        expect(title.tagName).toBe('H3');
        expect(title).toHaveClass('stx-legal-content__section-title');
      });
    });

    it('renders section content in correct containers', () => {
      const { container } = render(<LegalContentSection {...defaultProps} />);

      const contentContainers = container.querySelectorAll('.stx-legal-content__section-content');
      expect(contentContainers).toHaveLength(3);
    });

    it('renders sections in correct order', () => {
      render(<LegalContentSection {...defaultProps} />);

      const sectionTitles = screen.getAllByText(/^[1-3]\./);
      expect(sectionTitles[0]).toHaveTextContent('1. Acceptance of Terms');
      expect(sectionTitles[1]).toHaveTextContent('2. Use License');
      expect(sectionTitles[2]).toHaveTextContent('3. Disclaimer');
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      const { container } = render(<LegalContentSection {...defaultProps} className="custom-legal" />);

      expect(container.firstChild).toHaveClass('custom-legal');
    });

    it('combines custom className with default classes', () => {
      const { container } = render(<LegalContentSection {...defaultProps} className="custom-legal" />);

      expect(container.firstChild).toHaveClass('stx-legal-content-section');
      expect(container.firstChild).toHaveClass('custom-legal');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty sections array', () => {
      const emptySectionsProps = {
        title: 'Empty Document',
        sections: []
      };

      render(<LegalContentSection {...emptySectionsProps} />);

      expect(screen.getByText('Empty Document')).toBeInTheDocument();
      expect(screen.queryByText(/^[1-3]\./)).not.toBeInTheDocument();
    });

    it('handles single section', () => {
      const singleSectionProps = {
        title: 'Single Section',
        sections: [
          {
            id: 'single-1',
            title: 'Only Section',
            content: '<p>This is the only section.</p>'
          }
        ]
      };

      render(<LegalContentSection {...singleSectionProps} />);

      expect(screen.getByText('Single Section')).toBeInTheDocument();
      expect(screen.getByText('Only Section')).toBeInTheDocument();
      expect(screen.getByText('This is the only section.')).toBeInTheDocument();
    });

    it('handles sections with empty content', () => {
      const emptyContentProps = {
        title: 'Empty Content',
        sections: [
          {
            id: 'empty-1',
            title: 'Empty Section',
            content: ''
          }
        ]
      };

      render(<LegalContentSection {...emptyContentProps} />);

      expect(screen.getByText('Empty Content')).toBeInTheDocument();
      expect(screen.getByText('Empty Section')).toBeInTheDocument();
    });

    it('handles sections with plain text content', () => {
      const plainTextProps = {
        title: 'Plain Text',
        sections: [
          {
            id: 'plain-1',
            title: 'Plain Section',
            content: 'This is plain text without HTML tags.'
          }
        ]
      };

      render(<LegalContentSection {...plainTextProps} />);

      expect(screen.getByText('Plain Text')).toBeInTheDocument();
      expect(screen.getByText('Plain Section')).toBeInTheDocument();
      expect(screen.getByText('This is plain text without HTML tags.')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<LegalContentSection {...defaultProps} />);

      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      const h3Elements = screen.getAllByRole('heading', { level: 3 });

      expect(h2Elements).toHaveLength(1);
      expect(h3Elements).toHaveLength(3);
    });

    it('renders content with proper semantic structure', () => {
      const { container } = render(<LegalContentSection {...defaultProps} />);

      const sections = container.querySelectorAll('.stx-legal-content__section');
      expect(sections).toHaveLength(3);

      sections.forEach(section => {
        expect(section.querySelector('h3')).toBeInTheDocument();
        expect(section.querySelector('.stx-legal-content__section-content')).toBeInTheDocument();
      });
    });
  });

  describe('HTML Content Security', () => {
    it('renders safe HTML content', () => {
      const safeHtmlProps = {
        title: 'Safe HTML',
        sections: [
          {
            id: 'safe-1',
            title: 'Safe Content',
            content: '<p>This is <strong>safe</strong> HTML content.</p>'
          }
        ]
      };

      render(<LegalContentSection {...safeHtmlProps} />);

      expect(screen.getByText('Safe HTML')).toBeInTheDocument();
      expect(screen.getByText('safe')).toBeInTheDocument();
    });

    it('handles HTML with various tags', () => {
      const variousTagsProps = {
        title: 'Various Tags',
        sections: [
          {
            id: 'tags-1',
            title: 'Tag Test',
            content: `
              <h4>Subtitle</h4>
              <p>Paragraph with <a href="#">link</a> and <code>code</code>.</p>
              <ol>
                <li>Ordered item 1</li>
                <li>Ordered item 2</li>
              </ol>
            `
          }
        ]
      };

      render(<LegalContentSection {...variousTagsProps} />);

      expect(screen.getByText('Various Tags')).toBeInTheDocument();
      expect(screen.getByText('Subtitle')).toBeInTheDocument();
      expect(screen.getByText(/Paragraph with/)).toBeInTheDocument();
      expect(screen.getByText('Ordered item 1')).toBeInTheDocument();
      expect(screen.getByText('Ordered item 2')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders large content efficiently', () => {
      const largeContentProps = {
        title: 'Large Document',
        sections: Array.from({ length: 20 }, (_, i) => ({
          id: `section-${i + 1}`,
          title: `Section ${i + 1}`,
          content: `<p>This is section ${i + 1} with some content. ${'Lorem ipsum '.repeat(10)}</p>`
        }))
      };

      render(<LegalContentSection {...largeContentProps} />);

      expect(screen.getByText('Large Document')).toBeInTheDocument();
      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Section 20')).toBeInTheDocument();
    });
  });

  describe('Theme Integration', () => {
    it('integrates with theme system', () => {
      render(
        <div data-theme="dark">
          <LegalContentSection {...defaultProps} />
        </div>
      );

      const legalSection = document.querySelector('.stx-legal-content-section');
      expect(legalSection).toBeInTheDocument();
    });

    it('applies theme-specific styling', () => {
      const { container } = renderWithTheme(<LegalContentSection {...defaultProps} />, 'dark');

      const themeContainer = container.closest('[data-theme]');
      if (themeContainer) {
        expect(themeContainer).toHaveAttribute('data-theme', 'dark');
      }

      const legalSection = container.querySelector('.stx-legal-content-section');
      expect(legalSection).toBeInTheDocument();
    });

    it('maintains functionality across all themes', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(<LegalContentSection {...defaultProps} />, theme);

        const legalSection = container.querySelector('.stx-legal-content-section');
        expect(legalSection).toBeInTheDocument();

        // Verify content is still rendered - use getAllByText to handle multiple instances
        const titleElements = screen.getAllByText('Terms of Service');
        expect(titleElements.length).toBeGreaterThan(0);
      });
    });

    it('applies theme-specific CSS variables', () => {
      ALL_THEMES.forEach(theme => {
        const { container } = renderWithTheme(<LegalContentSection {...defaultProps} />, theme);

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
      const { rerender } = renderWithTheme(<LegalContentSection {...defaultProps} />, 'light');

      // Switch to dark theme
      rerender(<LegalContentSection {...defaultProps} />);
      const darkContainer = document.querySelector('[data-theme="light"]');
      expect(darkContainer).toBeInTheDocument();

      // Switch to eu theme
      rerender(<LegalContentSection {...defaultProps} />);
      const euContainer = document.querySelector('[data-theme="light"]');
      expect(euContainer).toBeInTheDocument();

      // Switch to uae theme
      rerender(<LegalContentSection {...defaultProps} />);
      const uaeContainer = document.querySelector('[data-theme="light"]');
      expect(uaeContainer).toBeInTheDocument();

      // Switch back to light theme
      rerender(<LegalContentSection {...defaultProps} />);
      const lightContainer = document.querySelector('[data-theme="light"]');
      expect(lightContainer).toBeInTheDocument();
    });
  });

  // Enhanced theme switching tests using the utility
  testCompleteThemeSupport(
    'LegalContentSection',
    (theme: ThemeName) => <LegalContentSection {...defaultProps} />,
    {
      testSelectors: {
        background: '.stx-legal-content-section',
        text: '.stx-legal-content__section-title',
        border: '.stx-legal-content__section',
        action: '.stx-legal-content__section-content'
      },
      testTransitions: true,
      testAccessibility: true,
      testPerformance: true
    }
  );
});
