import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { ContentLoader } from '@/lib/content/contentLoader';
import cacheService from '@/lib/caching/CachingService';

// Mock dependencies
vi.mock('@/lib/content/contentLoader');
vi.mock('@/lib/caching/CachingService');

const mockContentLoader = vi.mocked(ContentLoader);
const mockCacheService = vi.mocked(cacheService);

describe('/api/blog/posts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return posts for English language', async () => {
    const mockPosts = [
      {
        markdown: {
          frontmatter: {
            title: 'English Post',
            description: 'English description',
            category: 'Technology',
            publishDate: '2024-01-01',
            tags: ['tech'],
            seo: {
              metaDescription: 'English meta description',
            },
          },
          metadata: {
            slug: 'english-post',
            readTime: '5 min read',
          },
        },
      },
    ];

    mockCacheService.getOrSet.mockResolvedValue(mockPosts);

    const request = new Request(`http://localhost:${process.env.FRONTEND_PORT || '3000'}/api/blog/posts?language=en`);
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts).toHaveLength(1);
    expect(data.language).toBe('en');
    expect(data.count).toBe(1);
    expect(data.posts[0].blogImage).toBeDefined();
  });

  it('should return posts for Czech language', async () => {
    const mockPosts = [
      {
        markdown: {
          frontmatter: {
            title: 'Czech Post',
            description: 'Czech description',
            category: 'Business',
            publishDate: '2024-01-01',
            tags: ['business'],
            seo: {
              metaDescription: 'Czech meta description',
            },
          },
          metadata: {
            slug: 'czech-post',
            readTime: '3 min read',
          },
        },
      },
    ];

    mockCacheService.getOrSet.mockResolvedValue(mockPosts);

    const request = new Request(`http://localhost:${process.env.FRONTEND_PORT || '3000'}/api/blog/posts?language=cs`);
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts).toHaveLength(1);
    expect(data.language).toBe('cs');
    expect(data.count).toBe(1);
  });

  it('should default to English when no language is specified', async () => {
    const mockPosts = [];
    mockCacheService.getOrSet.mockResolvedValue(mockPosts);

    const request = new Request(`http://localhost:${process.env.FRONTEND_PORT || '3000'}/api/blog/posts`);
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.language).toBe('en');
    expect(data.count).toBe(0);
  });

  it('should return error for unsupported language', async () => {
    const request = new Request(`http://localhost:${process.env.FRONTEND_PORT || '3000'}/api/blog/posts?language=invalid`);
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Unsupported language: invalid');
  });

  it('should handle ContentLoader errors gracefully', async () => {
    mockCacheService.getOrSet.mockRejectedValue(new Error('Content loading failed'));

    const request = new Request(`http://localhost:${process.env.FRONTEND_PORT || '3000'}/api/blog/posts?language=en`);
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to load blog posts');
  });

  it('should add image data to posts', async () => {
    const mockPosts = [
      {
        markdown: {
          frontmatter: {
            title: 'Test Post',
            description: 'Test description',
            category: 'Technology',
            publishDate: '2024-01-01',
            tags: ['test'],
            seo: {
              metaDescription: 'Test meta description',
            },
          },
          metadata: {
            slug: '01-european-digital-transformation-2024',
            readTime: '5 min read',
          },
        },
      },
    ];

    mockCacheService.getOrSet.mockResolvedValue(mockPosts);

    const request = new Request(`http://localhost:${process.env.FRONTEND_PORT || '3000'}/api/blog/posts?language=en`);
    const response = await GET(request);
    const data = await response.json();

    expect(data.posts[0].blogImage).toEqual({
      id: 'generated-image1',
      alt: 'Blog post image for Test Post',
    });
  });

  it('should handle posts without matching images', async () => {
    const mockPosts = [
      {
        markdown: {
          frontmatter: {
            title: 'Unknown Post',
            description: 'Unknown description',
            category: 'Technology',
            publishDate: '2024-01-01',
            tags: ['unknown'],
            seo: {
              metaDescription: 'Unknown meta description',
            },
          },
          metadata: {
            slug: 'unknown-post',
            readTime: '5 min read',
          },
        },
      },
    ];

    mockCacheService.getOrSet.mockResolvedValue(mockPosts);

    const request = new Request(`http://localhost:${process.env.FRONTEND_PORT || '3000'}/api/blog/posts?language=en`);
    const response = await GET(request);
    const data = await response.json();

    expect(data.posts[0].blogImage).toBeNull();
  });

  it('should use caching for performance', async () => {
    const mockPosts = [];
    mockCacheService.getOrSet.mockResolvedValue(mockPosts);

    const request = new Request(`http://localhost:${process.env.FRONTEND_PORT || '3000'}/api/blog/posts?language=de`);
    await GET(request);

    expect(mockCacheService.getOrSet).toHaveBeenCalledWith(
      'api_blog_posts_de',
      expect.any(Function)
    );
  });
}); 