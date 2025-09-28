import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BlogLazyImage, BlogHeroImage, BlogThumbnailImage } from './BlogLazyImage';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
global.IntersectionObserver = mockIntersectionObserver;

// Mock ImageManager
vi.mock('@/lib/image/ImageManager', () => ({
  ImageManager: vi.fn().mockImplementation(() => ({
    generateImageUrl: vi.fn((imageId: string, size: string, format: string) => 
      `/blog/optimized/${imageId}-${size}.${format}`
    ),
    generateSrcset: vi.fn((imageId: string) => 
      `/blog/optimized/${imageId}-400w.webp 400w, /blog/optimized/${imageId}-800w.webp 800w, /blog/optimized/${imageId}-1200w.webp 1200w, /blog/optimized/${imageId}-1600w.webp 1600w`
    ),
    getPlaceholderUrl: vi.fn((imageId: string) => 
      `/blog/placeholders/${imageId}-placeholder.webp`
    )
  }))
}));

describe('BlogLazyImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct props', () => {
    render(
      <BlogLazyImage
        imageId="test-image"
        alt="Test image"
        caption="Test caption"
        className="test-class"
      />
    );

    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByText('Test caption')).toBeInTheDocument();
  });

  it('renders picture element with WebP source', () => {
    render(
      <BlogLazyImage
        imageId="test-image"
        alt="Test image"
      />
    );

    const picture = document.querySelector('picture');
    expect(picture).toBeInTheDocument();

    const source = document.querySelector('source');
    expect(source).toHaveAttribute('type', 'image/webp');
  });

  it('renders img with correct attributes', () => {
    render(
      <BlogLazyImage
        imageId="test-image"
        alt="Test image"
        priority={true}
      />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Test image');
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('decoding', 'async');
  });

  it('renders placeholder when not in view', () => {
    render(
      <BlogLazyImage
        imageId="test-image"
        alt="Test image"
        priority={false}
      />
    );

    const placeholder = document.querySelector('.stx-blog-image__placeholder');
    expect(placeholder).toBeInTheDocument();
  });

  it('calls onLoad when image loads', async () => {
    const onLoad = vi.fn();
    render(
      <BlogLazyImage
        imageId="test-image"
        alt="Test image"
        priority={true}
        onLoad={onLoad}
      />
    );

    const img = screen.getByRole('img');
    img.dispatchEvent(new Event('load'));

    await waitFor(() => {
      expect(onLoad).toHaveBeenCalled();
    });
  });

  it('calls onError when image fails to load', async () => {
    const onError = vi.fn();
    render(
      <BlogLazyImage
        imageId="test-image"
        alt="Test image"
        priority={true}
        onError={onError}
      />
    );

    const img = screen.getByRole('img');
    img.dispatchEvent(new Event('error'));

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });

  it('renders error state when image fails to load', async () => {
    render(
      <BlogLazyImage
        imageId="test-image"
        alt="Test image"
        priority={true}
      />
    );

    const img = screen.getByRole('img');
    img.dispatchEvent(new Event('error'));

    await waitFor(() => {
      expect(screen.getByText('Failed to load image')).toBeInTheDocument();
    });
  });

  it('applies correct CSS classes', () => {
    render(
      <BlogLazyImage
        imageId="test-image"
        alt="Test image"
        className="custom-class"
      />
    );

    const figure = document.querySelector('figure');
    expect(figure).toHaveClass('stx-blog-image', 'custom-class');
  });
});

describe('BlogHeroImage', () => {
  it('renders with hero-specific props', () => {
    render(
      <BlogHeroImage
        imageId="hero-image"
        alt="Hero image"
      />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'eager');
  });

  it('applies hero-specific CSS classes', () => {
    render(
      <BlogHeroImage
        imageId="hero-image"
        alt="Hero image"
        className="hero-custom-class"
      />
    );

    const figure = document.querySelector('figure');
    expect(figure).toHaveClass('stx-blog-hero-image', 'hero-custom-class');
  });
});

describe('BlogThumbnailImage', () => {
  it('renders with thumbnail-specific props', () => {
    render(
      <BlogThumbnailImage
        imageId="thumbnail-image"
        alt="Thumbnail image"
      />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('applies thumbnail-specific CSS classes', () => {
    render(
      <BlogThumbnailImage
        imageId="thumbnail-image"
        alt="Thumbnail image"
        className="thumbnail-custom-class"
      />
    );

    const figure = document.querySelector('figure');
    expect(figure).toHaveClass('stx-blog-thumbnail', 'thumbnail-custom-class');
  });
});

describe('Intersection Observer', () => {
  it('observes image when not priority', () => {
    render(
      <BlogLazyImage
        imageId="test-image"
        alt="Test image"
        priority={false}
      />
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );
  });

  it('does not observe image when priority', () => {
    render(
      <BlogLazyImage
        imageId="test-image"
        alt="Test image"
        priority={true}
      />
    );

    // Should not call IntersectionObserver for priority images
    expect(mockIntersectionObserver).not.toHaveBeenCalled();
  });
});

describe('Responsive Images', () => {
  it('renders with correct srcset', () => {
    render(
      <BlogLazyImage
        imageId="test-image"
        alt="Test image"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    );

    const source = document.querySelector('source');
    expect(source).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw');
  });

  it('uses default sizes when not provided', () => {
    render(
      <BlogLazyImage
        imageId="test-image"
        alt="Test image"
      />
    );

    const source = document.querySelector('source');
    expect(source).toHaveAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');
  });
}); 