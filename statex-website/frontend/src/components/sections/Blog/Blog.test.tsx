import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Blog } from './Blog';
import {
  testCompleteThemeSupport,
  renderWithTheme,
  ALL_THEMES,
  type ThemeName
} from '../../../test/utils/theme-testing';

// Mock data for testing
const mockBlogPosts = [
  {
    id: '1',
    title: 'Test Blog Post 1',
    excerpt: 'This is a test blog post excerpt',
    date: '2024-01-15',
    author: 'John Doe',
    slug: 'test-blog-post-1',
    category: 'Technology',
    readTime: '5 min read',
    featured: true
  },
  {
    id: '2',
    title: 'Test Blog Post 2',
    excerpt: 'Another test blog post excerpt',
    date: '2024-01-10',
    author: 'Jane Smith',
    slug: 'test-blog-post-2',
    category: 'Business',
    readTime: '3 min read',
    featured: false
  }
];

describe('Blog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('STX Classes', () => {
    it('applies correct STX classes to blog section', () => {
      render(<Blog posts={mockBlogPosts} priority="low" />);

      const blogSection = document.querySelector('.stx-blog');
      expect(blogSection).toBeInTheDocument();
      expect(blogSection).toHaveClass('stx-blog--default');
      expect(blogSection).toHaveAttribute('data-section-priority', 'low');
    });

    it('applies variant classes correctly', () => {
      render(<Blog posts={mockBlogPosts} variant="grid" />);

      const blogSection = document.querySelector('.stx-blog');
      expect(blogSection).toHaveAttribute('data-section-variant', 'grid');
    });

    it('applies priority classes correctly', () => {
      render(<Blog posts={mockBlogPosts} priority="high" />);

      const blogSection = document.querySelector('.stx-blog');
      expect(blogSection).toHaveAttribute('data-section-priority', 'high');
    });

    it('applies AI optimization classes when enabled', () => {
      render(<Blog posts={mockBlogPosts} aiOptimized={true} />);

      const blogSection = document.querySelector('.stx-blog');
      expect(blogSection).toHaveAttribute('data-ai-optimized', 'true');
    });

    it('applies custom className', () => {
      render(<Blog posts={mockBlogPosts} className="custom-blog" />);

      const blogSection = document.querySelector('.stx-blog');
      expect(blogSection).toHaveClass('custom-blog');
    });

    it('applies BEM-style classes to blog elements', () => {
      render(<Blog posts={mockBlogPosts} />);

      const blogContainer = document.querySelector('.stx-blog-container');
      const blogHeader = document.querySelector('.stx-blog-header');
      const blogTitle = document.querySelector('.stx-blog__title');
      const blogDescription = document.querySelector('.stx-blog__description');
      const blogContent = document.querySelector('.stx-blog__content');
      const blogPosts = document.querySelector('.stx-blog__posts');

      expect(blogContainer).toBeInTheDocument();
      expect(blogHeader).toBeInTheDocument();
      expect(blogTitle).toBeInTheDocument();
      expect(blogDescription).toBeInTheDocument();
      expect(blogContent).toBeInTheDocument();
      expect(blogPosts).toBeInTheDocument();
    });
  });

  describe('Template Section Functionality', () => {
    it('renders default title and description', () => {
      render(<Blog posts={mockBlogPosts} />);

      expect(screen.getByText('Latest Blog Posts')).toBeInTheDocument();
      expect(screen.getByText('Stay updated with our latest insights and news')).toBeInTheDocument();
    });

    it('renders custom title and description', () => {
      render(
        <Blog
          posts={mockBlogPosts}
          title="Custom Blog Title"
          description="Custom blog description"
        />
      );

      expect(screen.getByText('Custom Blog Title')).toBeInTheDocument();
      expect(screen.getByText('Custom blog description')).toBeInTheDocument();
    });

    it('renders blog posts for default variant', () => {
      render(<Blog posts={mockBlogPosts} variant="default" />);

      expect(screen.getByText('Test Blog Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Blog Post 2')).toBeInTheDocument();
    });

    it('renders blog posts for grid variant', () => {
      render(<Blog posts={mockBlogPosts} variant="grid" />);

      expect(screen.getByText('Test Blog Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Blog Post 2')).toBeInTheDocument();
    });

    it('renders blog posts for list variant', () => {
      render(<Blog posts={mockBlogPosts} variant="list" />);

      expect(screen.getByText('Test Blog Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Blog Post 2')).toBeInTheDocument();
    });

    it('handles empty posts array', () => {
      render(<Blog posts={[]} />);

      // Should still render the header and footer
      expect(screen.getByText('Latest Blog Posts')).toBeInTheDocument();
      expect(screen.getByText('View All Posts')).toBeInTheDocument();
    });

    it('handles undefined posts prop', () => {
      render(<Blog posts={undefined as any} />);

      // Should still render the header and footer
      expect(screen.getByText('Latest Blog Posts')).toBeInTheDocument();
      expect(screen.getByText('View All Posts')).toBeInTheDocument();
    });
  });

  describe('Data Attributes', () => {
    it('applies correct data attributes', () => {
      render(<Blog posts={mockBlogPosts} priority="high" aiOptimized={true} />);

      const blogSection = document.querySelector('.stx-blog');
      expect(blogSection).toHaveAttribute('data-section-type', 'blog');
      expect(blogSection).toHaveAttribute('data-section-variant', 'default');
      expect(blogSection).toHaveAttribute('data-section-priority', 'high');
      expect(blogSection).toHaveAttribute('data-ai-optimized', 'true');
    });

    it('applies AB test data attribute when provided', () => {
      const abTest = { experimentId: 'test-exp', variant: 'A' };
      render(<Blog posts={mockBlogPosts} abTest={abTest} />);

      const blogSection = document.querySelector('.stx-blog');
      expect(blogSection).toHaveAttribute('data-ab-test', 'test-exp');
    });
  });

  describe('Event Handling', () => {
    it('renders successfully with blog posts', () => {
      render(<Blog posts={mockBlogPosts} />);

      // Component renders successfully
      expect(screen.getByText('Latest Blog Posts')).toBeInTheDocument();
    });

    it('renders successfully without blog posts', () => {
      render(<Blog posts={[]} />);

      // Component renders successfully even without posts
      expect(screen.getByText('Latest Blog Posts')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains proper semantic structure', () => {
      render(<Blog posts={mockBlogPosts} />);

      const blogSection = document.querySelector('section');
      expect(blogSection).toBeInTheDocument();
      expect(blogSection).toHaveAttribute('data-section-type', 'blog');
    });

    it('provides proper heading hierarchy', () => {
      render(<Blog posts={mockBlogPosts} />);

      const blogTitle = document.querySelector('.stx-blog__title');
      expect(blogTitle).toBeInTheDocument();
      expect(blogTitle?.tagName).toBe('H2');
    });
  });

  describe('Integration', () => {
    it('integrates with container component correctly', () => {
      render(<Blog posts={mockBlogPosts} />);

      const container = document.querySelector('.stx-container');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('stx-container--default'); // Updated class name
    });

    it('integrates with text components correctly', () => {
      render(<Blog posts={mockBlogPosts} />);

      const title = document.querySelector('.stx-blog__title');
      const description = document.querySelector('.stx-blog__description');
      const posts = document.querySelector('.stx-blog__posts');

      expect(title).toHaveClass('stx-text', 'stx-text--h2'); // Updated class name
      expect(description).toHaveClass('stx-text', 'stx-text--body-large'); // Updated class name
      expect(posts).toBeInTheDocument();
    });
  });
});

describe('Blog Theme Switching', () => {
  ALL_THEMES.forEach(theme => {
    it(`renders correctly in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Blog posts={mockBlogPosts} />, theme);
      const blog = container.querySelector('.stx-blog');
      expect(blog).toBeInTheDocument();
      // Theme container check
      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });

    it(`applies correct border/background/text color in ${theme} theme`, () => {
      const { container } = renderWithTheme(<Blog posts={mockBlogPosts} />, theme);
      const blog = container.querySelector('.stx-blog');
      const computedStyle = getComputedStyle(blog as Element);
      expect(computedStyle.backgroundColor).toBeDefined();
      expect(computedStyle.color).toBeDefined();
      expect(computedStyle.borderColor).toBeDefined();
    });
  });

  it('maintains functionality across all themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(<Blog posts={mockBlogPosts} />, theme);
      const blog = container.querySelector('.stx-blog');
      expect(blog).toBeInTheDocument();
      expect(blog).toHaveClass('stx-blog');

      // Check for blog content
      const blogTitle = container.querySelector('.stx-blog__title');
      expect(blogTitle).toHaveTextContent('Latest Blog Posts');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('applies theme-specific styling for different variants', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Blog posts={mockBlogPosts} variant="grid" />,
        theme
      );
      const blog = container.querySelector('.stx-blog');
      expect(blog).toHaveAttribute('data-section-variant', 'grid');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains accessibility across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Blog posts={mockBlogPosts} />,
        theme
      );
      const blog = container.querySelector('.stx-blog');
      expect(blog).toHaveAttribute('data-section-type', 'blog');

      // Check for proper heading hierarchy
      const blogTitle = container.querySelector('.stx-blog__title');
      expect(blogTitle?.tagName).toBe('H2');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles theme transitions smoothly', () => {
    // Test light theme
    const { container: lightContainer } = renderWithTheme(
      <Blog posts={mockBlogPosts} />,
      'light'
    );
    let themeContainer = lightContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'light');

    // Test dark theme
    const { container: darkContainer } = renderWithTheme(
      <Blog posts={mockBlogPosts} />,
      'dark'
    );
    themeContainer = darkContainer.querySelector('[data-theme]');
    expect(themeContainer).toHaveAttribute('data-theme', 'dark');
  });

  it('maintains performance across theme switches', () => {
    const startTime = performance.now();

    ALL_THEMES.forEach(theme => {
      renderWithTheme(
        <Blog posts={mockBlogPosts} />, theme
      );
    });

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Performance threshold: should complete all theme renders in under 250ms
    expect(totalTime).toBeLessThan(250);
  });

  it('applies correct blog styling across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Blog posts={mockBlogPosts} />,
        theme
      );
      const blog = container.querySelector('.stx-blog');
      expect(blog).toBeInTheDocument();

      // Check blog structure
      const blogContainer = container.querySelector('.stx-blog-container');
      const blogHeader = container.querySelector('.stx-blog-header');
      const blogContent = container.querySelector('.stx-blog__content');
      expect(blogContainer).toBeInTheDocument();
      expect(blogHeader).toBeInTheDocument();
      expect(blogContent).toBeInTheDocument();

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles different variants across themes', () => {
    const variants = ['default', 'grid', 'list'] as const;

    ALL_THEMES.forEach(theme => {
      variants.forEach(variant => {
        const { container } = renderWithTheme(
          <Blog posts={mockBlogPosts} variant={variant} />,
          theme
        );
        const blog = container.querySelector('.stx-blog');
        expect(blog).toHaveAttribute('data-section-variant', variant);

        const themeContainer = container.querySelector('[data-theme]');
        expect(themeContainer).toHaveAttribute('data-theme', theme);
      });
    });
  });

  it('maintains blog post rendering across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Blog posts={mockBlogPosts} />,
        theme
      );

      // Check for blog posts
      expect(container).toHaveTextContent('Test Blog Post 1');
      expect(container).toHaveTextContent('Test Blog Post 2');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('handles empty posts across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Blog posts={[]} />,
        theme
      );

      // Should still render header and footer
      expect(container).toHaveTextContent('Latest Blog Posts');
      expect(container).toHaveTextContent('View All Posts');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains custom className across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Blog posts={mockBlogPosts} className="custom-blog-class" />,
        theme
      );
      const blog = container.querySelector('.stx-blog');
      expect(blog).toHaveClass('custom-blog-class', 'stx-blog');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains priority attributes across themes', () => {
    const priorities = ['low', 'medium', 'high'] as const;

    ALL_THEMES.forEach(theme => {
      priorities.forEach(priority => {
        const { container } = renderWithTheme(
          <Blog posts={mockBlogPosts} priority={priority} />,
          theme
        );
        const blog = container.querySelector('.stx-blog');
        expect(blog).toHaveAttribute('data-section-priority', priority);

        const themeContainer = container.querySelector('[data-theme]');
        expect(themeContainer).toHaveAttribute('data-theme', theme);
      });
    });
  });

  it('maintains AI optimization attributes across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Blog posts={mockBlogPosts} aiOptimized={true} />,
        theme
      );
      const blog = container.querySelector('.stx-blog');
      expect(blog).toHaveAttribute('data-ai-optimized', 'true');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains AB test attributes across themes', () => {
    const abTest = { experimentId: 'test-exp', variant: 'A' };

    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Blog posts={mockBlogPosts} abTest={abTest} />,
        theme
      );
      const blog = container.querySelector('.stx-blog');
      expect(blog).toHaveAttribute('data-ab-test', 'test-exp');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains semantic structure across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Blog posts={mockBlogPosts} />,
        theme
      );

      // Check semantic structure
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('data-section-type', 'blog');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains container integration across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Blog posts={mockBlogPosts} />,
        theme
      );

      // Check container integration
      const stxContainer = container.querySelector('.stx-container');
      expect(stxContainer).toBeInTheDocument();

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });

  it('maintains text component integration across themes', () => {
    ALL_THEMES.forEach(theme => {
      const { container } = renderWithTheme(
        <Blog posts={mockBlogPosts} />,
        theme
      );

      // Check text component integration
      const title = container.querySelector('.stx-blog__title');
      const description = container.querySelector('.stx-blog__description');
      expect(title).toHaveClass('stx-text', 'stx-text--h2');
      expect(description).toHaveClass('stx-text', 'stx-text--body-large');

      const themeContainer = container.querySelector('[data-theme]');
      expect(themeContainer).toHaveAttribute('data-theme', theme);
    });
  });
});
