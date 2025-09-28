import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { LanguageSwitcher } from '@/components/atoms/LanguageSwitcher';
import { LanguageAwareBlog } from '@/components/blog/LanguageAwareBlog';

// Mock the fetch function
global.fetch = vi.fn();

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/blog',
}));

// Mock BlogPageClient component
vi.mock('@/components/blog/BlogPageClient', () => ({
  BlogPageClient: ({ posts }: { posts: any[] }) => (
    <div data-testid="blog-page-client">
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <div key={index} data-testid={`blog-post-${index}`}>
            {post.markdown.frontmatter.title}
          </div>
        ))
      ) : (
        <div data-testid="no-posts">No posts found</div>
      )}
    </div>
  ),
}));

const mockEnglishPosts = [
  {
    markdown: {
      frontmatter: {
        title: 'English Post 1',
        description: 'English description 1',
        category: 'Technology',
        publishDate: '2024-01-01',
        tags: ['tech'],
        seo: {
          metaDescription: 'English meta description 1',
        },
      },
      metadata: {
        slug: 'english-post-1',
        readTime: '5 min read',
      },
    },
    blogImage: {
      id: 'image-1',
      alt: 'English image 1',
    },
  },
];

const mockFrenchPosts = [
  {
    markdown: {
      frontmatter: {
        title: 'French Post 1',
        description: 'French description 1',
        category: 'Business',
        publishDate: '2024-01-01',
        tags: ['business'],
        seo: {
          metaDescription: 'French meta description 1',
        },
      },
      metadata: {
        slug: 'french-post-1',
        readTime: '3 min read',
      },
    },
    blogImage: {
      id: 'image-1',
      alt: 'French image 1',
    },
  },
];

const renderWithProviders = (component: React.ReactElement) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe('Language-Aware Blog Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should switch language and load different posts', async () => {
    // Mock initial English posts
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ posts: mockEnglishPosts, language: 'en', count: 1 }),
    });

    renderWithProviders(
      <div>
        <LanguageSwitcher variant="buttons" />
        <LanguageAwareBlog />
      </div>
    );

    // Wait for initial English posts to load
    await waitFor(() => {
      expect(screen.getByText('English Post 1')).toBeInTheDocument();
    });

    // Mock French posts for language switch
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ posts: mockFrenchPosts, language: 'fr', count: 1 }),
    });

    // Click French language button
    const frenchButton = screen.getByTitle('Français');
    fireEvent.click(frenchButton);

    // Should navigate to French blog route
    expect(mockPush).toHaveBeenCalledWith('/fr/blog');

    // Wait for French posts to load
    await waitFor(() => {
      expect(screen.getByText('French Post 1')).toBeInTheDocument();
    });

    // Should not show English posts anymore
    expect(screen.queryByText('English Post 1')).not.toBeInTheDocument();
  });

  it('should handle language switching on blog index page', async () => {
    renderWithProviders(<LanguageSwitcher variant="buttons" />);

    // Click Czech language button
    const czechButton = screen.getByTitle('Čeština');
    fireEvent.click(czechButton);

    // Should navigate to Czech blog route
    expect(mockPush).toHaveBeenCalledWith('/cs/blog');
  });

  it('should handle language switching back to English', async () => {
    renderWithProviders(<LanguageSwitcher variant="buttons" />);

    // Click English language button
    const englishButton = screen.getByTitle('English');
    fireEvent.click(englishButton);

    // Should navigate to English blog route
    expect(mockPush).toHaveBeenCalledWith('/blog');
  });

  it('should maintain language state across components', async () => {
    // Mock posts for different languages
    (fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ posts: mockEnglishPosts, language: 'en', count: 1 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ posts: mockFrenchPosts, language: 'fr', count: 1 }),
      });

    renderWithProviders(
      <div>
        <LanguageSwitcher variant="buttons" />
        <LanguageAwareBlog />
      </div>
    );

    // Wait for initial posts
    await waitFor(() => {
      expect(screen.getByText('English Post 1')).toBeInTheDocument();
    });

    // Switch to French
    const frenchButton = screen.getByTitle('Français');
    fireEvent.click(frenchButton);

    // Wait for French posts
    await waitFor(() => {
      expect(screen.getByText('French Post 1')).toBeInTheDocument();
    });

    // Language switcher should show French as active
    expect(frenchButton).toHaveClass('stx-language-switcher__button--active');
  });

  it('should handle API errors during language switching', async () => {
    // Mock successful initial load
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ posts: mockEnglishPosts, language: 'en', count: 1 }),
    });

    renderWithProviders(
      <div>
        <LanguageSwitcher variant="buttons" />
        <LanguageAwareBlog />
      </div>
    );

    // Wait for initial posts
    await waitFor(() => {
      expect(screen.getByText('English Post 1')).toBeInTheDocument();
    });

    // Mock error for language switch
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    // Switch to German
    const germanButton = screen.getByTitle('Deutsch');
    fireEvent.click(germanButton);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Error loading blog posts: Network error')).toBeInTheDocument();
    });

    // Should still navigate to German route
    expect(mockPush).toHaveBeenCalledWith('/de/blog');
  });

  it('should handle empty posts for a language', async () => {
    // Mock empty posts for Czech
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ posts: [], language: 'cs', count: 0 }),
    });

    renderWithProviders(<LanguageAwareBlog />);

    // Should show no posts message
    await waitFor(() => {
      expect(screen.getByTestId('no-posts')).toBeInTheDocument();
    });
  });
}); 