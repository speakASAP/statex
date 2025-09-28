import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { LanguageAwareBlog } from './LanguageAwareBlog';
import { LanguageProvider } from '@/components/providers/LanguageProvider';

// Mock the fetch function
global.fetch = vi.fn();

// Mock BlogPageClient component
vi.mock('./BlogPageClient', () => ({
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

const mockPosts = [
  {
    markdown: {
      frontmatter: {
        title: 'Test Post 1',
        description: 'Test description 1',
        category: 'Technology',
        publishDate: '2024-01-01',
        tags: ['test', 'blog'],
        seo: {
          metaDescription: 'Test meta description 1',
        },
      },
      metadata: {
        slug: 'test-post-1',
        readTime: '5 min read',
      },
    },
    blogImage: {
      id: 'test-image-1',
      alt: 'Test image 1',
    },
  },
  {
    markdown: {
      frontmatter: {
        title: 'Test Post 2',
        description: 'Test description 2',
        category: 'Business',
        publishDate: '2024-01-02',
        tags: ['business', 'strategy'],
        seo: {
          metaDescription: 'Test meta description 2',
        },
      },
      metadata: {
        slug: 'test-post-2',
        readTime: '3 min read',
      },
    },
    blogImage: null,
  },
];

const renderWithProviders = (component: React.ReactElement) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe('LanguageAwareBlog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load posts for the current language', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ posts: mockPosts, language: 'en', count: 2 }),
    });

    renderWithProviders(<LanguageAwareBlog />);

    // Should show loading initially
    expect(screen.getByText('Loading blog posts...')).toBeInTheDocument();

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByTestId('blog-page-client')).toBeInTheDocument();
    });

    // Should display the posts
    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<LanguageAwareBlog />);

    await waitFor(() => {
      expect(screen.getByText('Error loading blog posts: Network error')).toBeInTheDocument();
    });

    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should handle empty posts response', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ posts: [], language: 'en', count: 0 }),
    });

    renderWithProviders(<LanguageAwareBlog />);

    await waitFor(() => {
      expect(screen.getByTestId('no-posts')).toBeInTheDocument();
    });
  });

  it('should handle API response with error status', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });

    renderWithProviders(<LanguageAwareBlog />);

    await waitFor(() => {
      expect(screen.getByText('Error loading blog posts: Failed to load posts: Not Found')).toBeInTheDocument();
    });
  });

  it('should reload posts when retry button is clicked', async () => {
    (fetch as any)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ posts: mockPosts, language: 'en', count: 2 }),
      });

    renderWithProviders(<LanguageAwareBlog />);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('Error loading blog posts: Network error')).toBeInTheDocument();
    });

    // Click retry button
    screen.getByText('Try Again').click();

    // Should show loading again
    expect(screen.getByText('Loading blog posts...')).toBeInTheDocument();

    // Should load posts successfully
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });
  });
}); 