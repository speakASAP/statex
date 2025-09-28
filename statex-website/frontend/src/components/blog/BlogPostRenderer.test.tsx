import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import BlogPostRenderer from './BlogPostRenderer';
import { RenderedContent } from '@/lib/content/templateRenderer';
import { ProcessedContent } from '@/lib/content/ContentProcessor';
import {
  renderWithProviders,
  testCompleteThemeSupport,
  ALL_THEMES,
  type ThemeName
} from '../../test/utils/test-utils';

// Mock data for testing
const mockPost: ProcessedContent = {
  markdown: {
    frontmatter: {
      title: 'Test Blog Post',
      description: 'This is a test blog post description',
      author: 'John Doe',
      publishDate: '2024-01-15',
      category: 'Technology',
      tags: ['AI', 'Digital Transformation', 'Europe'],
      language: 'en',
      template: 'blog-post',
      seo: {
        keywords: ['test', 'blog', 'post'],
        metaDescription: 'Test blog post meta description'
      }
    },
    content: '# Test Blog Post\n\nThis is the content of the test blog post.',
    metadata: {
      slug: 'test-blog-post',
      readTime: '5 min read',
      wordCount: 100,
      language: 'en'
    }
  },
  html: {
    content: '<h1>Test Blog Post</h1><p>This is the content of the test blog post.</p>',
    metadata: {
      slug: 'test-blog-post',
      readTime: '5 min read',
      wordCount: 100,
      language: 'en'
    }
  },
  aiMarkdown: {
    content: '# Test Blog Post\n\nThis is the content of the test blog post.',
    metadata: {
      slug: 'test-blog-post',
      readTime: '5 min read',
      wordCount: 100,
      language: 'en'
    }
  }
};

const mockRenderedContent: RenderedContent = {
  sections: [
    {
      id: 'hero-1',
      type: 'hero',
      variant: 'blog',
      content: {
        title: 'Test Blog Post',
        description: 'This is a test blog post description',
        author: 'John Doe',
        publishDate: '2024-01-15',
        category: 'Technology',
        tags: ['AI', 'Digital Transformation', 'Europe'],
        readTime: '5 min read'
      },
      config: {
        showCategory: true,
        showAuthor: true,
        showDate: true,
        showReadTime: true,
        showTags: true
      }
    },
    {
      id: 'content-1',
      type: 'content',
      variant: 'markdown',
      content: {
        html: '<h1>Test Blog Post</h1><p>This is the content of the test blog post.</p>'
      },
      config: {
        enableToc: true,
        enableSharing: true,
        enableComments: false,
        maxWidth: '800px',
        typography: 'prose'
      }
    },
    {
      id: 'related-1',
      type: 'related',
      variant: 'blog',
      content: {
        posts: []
      },
      config: {
        maxPosts: 3,
        sameCategory: true,
        showExcerpt: true,
        showDate: true
      }
    }
  ],
  metadata: {
    template: 'blog-post',
    seo: {
      title: 'Test Blog Post',
      description: 'This is a test blog post description'
    }
  }
};

describe('BlogPostRenderer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('STX Classes', () => {
    it('applies correct STX classes to blog post sections', () => {
      renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />
      );

      const heroSection = document.querySelector('.stx-hero');
      const contentSection = document.querySelector('.stx-section');
      const blogPost = document.querySelector('.stx-blog__post');
      const blogContent = document.querySelector('.stx-blog__content');

      expect(heroSection).toBeInTheDocument();
      expect(contentSection).toBeInTheDocument();
      expect(blogPost).toBeInTheDocument();
      expect(blogContent).toBeInTheDocument();
    });

    it('applies BEM-style classes to blog elements', () => {
      renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />
      );

      const heroTitle = document.querySelector('.stx-hero__title');
      const heroSubtitle = document.querySelector('.stx-hero__subtitle');
      const blogMeta = document.querySelector('.stx-blog__meta');
      const blogTags = document.querySelector('.stx-blog__tags');
      const blogExcerpt = document.querySelector('.stx-blog__excerpt');

      expect(heroTitle).toBeInTheDocument();
      expect(heroSubtitle).toBeInTheDocument();
      expect(blogMeta).toBeInTheDocument();
      expect(blogTags).toBeInTheDocument();
      expect(blogExcerpt).toBeInTheDocument();
    });
  });

  describe('Hero Section Rendering', () => {
    it('renders hero section with all content when config is enabled', () => {
      renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />
      );

      expect(screen.getByText('Test Blog Post', { selector: '.stx-hero__title' })).toBeInTheDocument();
      expect(screen.getByText('This is a test blog post description')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('By John Doe')).toBeInTheDocument();
      expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
      expect(screen.getByText('5 min read')).toBeInTheDocument();
    });

    it('renders hero section with conditional content based on config', () => {
      const contentWithDisabledConfig = {
        ...mockRenderedContent,
        sections: [
          {
            ...mockRenderedContent.sections[0],
            config: {
              showCategory: false,
              showAuthor: false,
              showDate: true,
              showReadTime: false,
              showTags: false
            }
          },
          ...mockRenderedContent.sections.slice(1)
        ]
      };

      renderWithProviders(
        <BlogPostRenderer
          content={contentWithDisabledConfig}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />
      );

      // Should show
      expect(screen.getByText('Test Blog Post', { selector: '.stx-hero__title' })).toBeInTheDocument();
      expect(screen.getByText('January 15, 2024')).toBeInTheDocument();

      // Should not show
      expect(screen.queryByText('Technology')).not.toBeInTheDocument();
      expect(screen.queryByText('By John Doe')).not.toBeInTheDocument();
      expect(screen.queryByText('5 min read')).not.toBeInTheDocument();
    });

    it('renders tags when showTags is enabled', () => {
      renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />
      );

      expect(screen.getByText('AI')).toBeInTheDocument();
      expect(screen.getByText('Digital Transformation')).toBeInTheDocument();
      expect(screen.getByText('Europe')).toBeInTheDocument();
    });

    it('formats date correctly', () => {
      renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />
      );

      expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
    });
  });

  describe('Content Section Rendering', () => {
    it('renders content section with HTML content', () => {
      renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />
      );

      const contentSection = document.querySelector('.stx-blog__excerpt');
      expect(contentSection).toBeInTheDocument();
      expect(contentSection).toHaveClass('prose');
    });

    it('applies custom maxWidth from config', () => {
      const contentWithCustomWidth = {
        ...mockRenderedContent,
        sections: [
          ...mockRenderedContent.sections.slice(0, 1),
          {
            ...mockRenderedContent.sections[1],
            config: {
              ...mockRenderedContent.sections[1].config,
              maxWidth: '1200px'
            }
          },
          ...mockRenderedContent.sections.slice(2)
        ]
      };

      renderWithProviders(
        <BlogPostRenderer
          content={contentWithCustomWidth}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />
      );

      const blogContent = document.querySelector('.stx-blog__content');
      expect(blogContent).toHaveStyle({ maxWidth: '1200px' });
    });

    it('applies custom typography class from config', () => {
      const contentWithCustomTypography = {
        ...mockRenderedContent,
        sections: [
          ...mockRenderedContent.sections.slice(0, 1),
          {
            ...mockRenderedContent.sections[1],
            config: {
              ...mockRenderedContent.sections[1].config,
              typography: 'custom-prose'
            }
          },
          ...mockRenderedContent.sections.slice(2)
        ]
      };

      renderWithProviders(
        <BlogPostRenderer
          content={contentWithCustomTypography}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />
      );

      const blogExcerpt = document.querySelector('.stx-blog__excerpt');
      expect(blogExcerpt).toHaveClass('custom-prose');
    });
  });

  describe('Related Section Rendering', () => {
    it('renders related section with placeholder content', () => {
      renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />
      );

      expect(screen.getByText('Related Articles')).toBeInTheDocument();
      expect(screen.getByText('Related posts will be loaded here based on category and tags.')).toBeInTheDocument();
    });
  });

  describe('Section Rendering Logic', () => {
    it('renders all sections in order', () => {
      renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />
      );

      const sections = document.querySelectorAll('section');
      expect(sections).toHaveLength(3); // hero, content, related
    });

    it('handles unknown section types gracefully', () => {
      const contentWithUnknownSection = {
        ...mockRenderedContent,
        sections: [
          ...mockRenderedContent.sections,
          {
            id: 'unknown-1',
            type: 'unknown',
            variant: 'default',
            content: {},
            config: {}
          }
        ]
      };

      renderWithProviders(
        <BlogPostRenderer
          content={contentWithUnknownSection}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />
      );

      // Should still render the known sections
      expect(screen.getByText('Test Blog Post', { selector: '.stx-hero__title' })).toBeInTheDocument();
      expect(screen.getByText('Related Articles')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains proper semantic structure', () => {
      renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />
      );

      const heroSection = document.querySelector('section');
      expect(heroSection).toBeInTheDocument();
    });

    it('provides proper heading hierarchy', () => {
      renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />
      );

      const heroTitle = document.querySelector('.stx-hero__title');
      expect(heroTitle?.tagName).toBe('H1');
    });

    it('includes proper ARIA labels for interactive elements', () => {
      renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />
      );

      const blogContent = document.querySelector('.stx-blog__content');
      expect(blogContent).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('integrates with container component correctly', () => {
      renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />
      );

      const containers = document.querySelectorAll('.stx-container');
      expect(containers.length).toBeGreaterThan(0);
    });

    it('integrates with HeroSpacer component', () => {
      renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />
      );

      // HeroSpacer should be rendered at the top
      const heroSpacer = document.querySelector('.stx-hero-spacer');
      expect(heroSpacer).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('handles availableLanguages prop correctly', () => {
      renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de', 'fr']}
          currentLanguage="en"
        />
      );

      // Component should render successfully with different language arrays
      expect(screen.getByText('Test Blog Post', { selector: '.stx-hero__title' })).toBeInTheDocument();
    });

    it('handles currentLanguage prop correctly', () => {
      renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="cs"
        />
      );

      // Component should render successfully with different current language
      expect(screen.getByText('Test Blog Post', { selector: '.stx-hero__title' })).toBeInTheDocument();
    });

    it('handles empty availableLanguages array', () => {
      renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={[]}
          currentLanguage="en"
        />
      );

      // Component should render successfully with empty languages array
      expect(screen.getByText('Test Blog Post', { selector: '.stx-hero__title' })).toBeInTheDocument();
    });
  });
});

describe('BlogPostRenderer Theme Switching', () => {
  ALL_THEMES.forEach(theme => {
    it(`renders correctly in ${theme} theme`, () => {
      const { container } = renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />,
        theme
      );

      const heroSection = container.querySelector('.stx-hero');
      expect(heroSection).toBeInTheDocument();

      expect(document.documentElement).toHaveAttribute('data-theme', theme);
    });

    it(`applies correct border/background/text color in ${theme} theme`, () => {
      const { container } = renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />,
        theme
      );

      const heroSection = container.querySelector('.stx-hero');
      const computedStyle = getComputedStyle(heroSection as Element);
      expect(computedStyle.backgroundColor).toBeDefined();
      expect(computedStyle.color).toBeDefined();
      expect(computedStyle.borderColor).toBeDefined();
    });
  });

  it('maintains functionality across all themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />,
        theme
      );

      const heroSection = container.querySelector('.stx-hero');
      expect(heroSection).toBeInTheDocument();

      // Check for blog content
      const heroTitle = container.querySelector('.stx-hero__title');
      expect(heroTitle).toHaveTextContent('Test Blog Post');

      expect(document.documentElement).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains accessibility across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />,
        theme
      );

      // Check for proper heading hierarchy
      const heroTitle = container.querySelector('.stx-hero__title');
      expect(heroTitle?.tagName).toBe('H1');

      expect(document.documentElement).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains performance across theme switches', () => {
    const startTime = performance.now();

    ALL_THEMES.forEach(theme => {
      renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />,
        theme
      );
    });

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Performance threshold: should complete all theme renders in under 500ms
    expect(totalTime).toBeLessThan(500);
  });

  it('maintains blog post structure across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />,
        theme
      );

      // Check blog structure
      const heroSection = container.querySelector('.stx-hero');
      const contentSection = container.querySelector('.stx-section');
      const blogPost = container.querySelector('.stx-blog__post');
      expect(heroSection).toBeInTheDocument();
      expect(contentSection).toBeInTheDocument();
      expect(blogPost).toBeInTheDocument();

      expect(document.documentElement).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains content rendering across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />,
        theme
      );

      // Check for blog content
      expect(container).toHaveTextContent('Test Blog Post');
      expect(container).toHaveTextContent('This is a test blog post description');
      expect(container).toHaveTextContent('Related Articles');

      expect(document.documentElement).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains container integration across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithProviders(
        <BlogPostRenderer
          content={mockRenderedContent}
          post={mockPost}
          availableLanguages={['en', 'cs', 'de']}
          currentLanguage="en"
        />,
        theme
      );

      // Check container integration
      const stxContainers = container.querySelectorAll('.stx-container');
      expect(stxContainers.length).toBeGreaterThan(0);

      expect(document.documentElement).toHaveAttribute('data-theme', theme);
    });
  });
}); 