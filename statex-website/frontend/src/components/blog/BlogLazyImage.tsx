'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ClientImageManager } from '@/lib/image/ClientImageManager';

interface BlogLazyImageProps {
  imageId: string;
  alt: string;
  caption?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onLoad?: (() => void) | undefined;
  onError?: (() => void) | undefined;
}

function BlogLazyImage({
  imageId,
  alt,
  caption,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  onLoad,
  onError
}: BlogLazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [placeholder, setPlaceholder] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || priority) return;

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.unobserve(img);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observerRef.current.observe(img);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority]);

  useEffect(() => {
    // Generate placeholder
    const generatePlaceholder = async () => {
      try {
        const imageManager = new ClientImageManager();
        const placeholderUrl = imageManager.getPlaceholderUrl(imageId);
        
        // Check if placeholder exists
        const exists = await imageManager.checkImageExists(placeholderUrl);
        if (exists) {
          setPlaceholder(placeholderUrl);
        } else {
          // Fallback to a simple gradient placeholder
          setPlaceholder('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmMGY0ZjY7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlMmU4ZjA7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+');
        }
      } catch (error) {
        console.warn('Failed to generate placeholder:', error);
        // Fallback to a simple gradient placeholder
        setPlaceholder('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmMGY0ZjY7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlMmU4ZjA7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+');
      }
    };

    if (isInView) {
      generatePlaceholder();
    }
  }, [isInView, imageId]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const imageManager = new ClientImageManager();
  const pngSrc = imageManager.generateImageUrl(imageId, '800w', 'png');
  const srcset = imageManager.generateSrcset(imageId, 'webp');

  if (hasError) {
    return (
      <div className={`stx-blog-image stx-blog-image--error ${className}`}>
        <div className="stx-blog-image__error">
          <span>Failed to load image</span>
        </div>
        {caption && (
          <figcaption className="stx-blog-image__caption">{caption}</figcaption>
        )}
      </div>
    );
  }

  return (
    <figure className={`stx-blog-image ${className}`}>
      <div className="stx-blog-image__container">
        {isInView ? (
          <picture>
            <source
              srcSet={srcset}
              sizes={sizes}
              type="image/webp"
            />
            <img
              ref={imgRef}
              src={pngSrc}
              alt={alt}
              className={`stx-blog-image__img ${
                isLoaded ? 'stx-blog-image__img--loaded' : 'stx-blog-image__img--loading'
              }`}
              onLoad={handleLoad}
              onError={handleError}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              style={{
                transition: 'opacity 0.3s ease-in-out',
                opacity: isLoaded ? 1 : 0.7
              }}
            />
          </picture>
        ) : (
          <div 
            ref={imgRef}
            className="stx-blog-image__placeholder"
            style={{
              backgroundImage: placeholder ? `url(${placeholder})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '200px'
            }}
          >
            <div className="stx-blog-image__loading">
              <div className="stx-loading-spinner"></div>
            </div>
          </div>
        )}
      </div>
      
      {caption && (
        <figcaption className="stx-blog-image__caption">{caption}</figcaption>
      )}
    </figure>
  );
}

export { BlogLazyImage };

// Hero image variant for blog posts
export function BlogHeroImage({
  imageId,
  alt,
  className = '',
  onLoad,
  onError
}: Omit<BlogLazyImageProps, 'caption' | 'priority'>) {
  return (
    <BlogLazyImage
      imageId={imageId}
      alt={alt}
      className={`stx-blog-hero-image ${className}`}
      priority={true}
      sizes="100vw"
      onLoad={onLoad}
      onError={onError}
    />
  );
}

// Thumbnail variant for related posts
export function BlogThumbnailImage({
  imageId,
  alt,
  className = '',
  onLoad,
  onError
}: Omit<BlogLazyImageProps, 'caption' | 'priority'>) {
  return (
    <BlogLazyImage
      imageId={imageId}
      alt={alt}
      className={`stx-blog-thumbnail ${className}`}
      priority={false}
      sizes="(max-width: 768px) 100vw, 300px"
      onLoad={onLoad}
      onError={onError}
    />
  );
} 