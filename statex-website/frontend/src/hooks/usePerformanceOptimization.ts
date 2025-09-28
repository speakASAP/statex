/**
 * React Hook for Performance Optimization Integration
 * Provides easy integration of performance optimization features
 * into React components for the multilingual content system
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { ContentType } from '@/lib/content/types';
import {
  performanceManager,
  preloadingService,
  bundleOptimizationService,
  type PerformanceReport,
  type PreloadStats
} from '@/lib/performance';

export interface UsePerformanceOptimizationOptions {
  enablePreloading?: boolean;
  enableLanguageSwitchOptimization?: boolean;
  enableNavigationOptimization?: boolean;
  enableBundleOptimization?: boolean;
  preloadOnHover?: boolean;
  preloadDelay?: number; // ms
}

export interface PerformanceHookReturn {
  // Optimization functions
  optimizeForLanguageSwitch: (targetLanguage: string) => Promise<void>;
  preloadContent: (slug: string, language: string, contentType: ContentType) => Promise<void>;
  preloadForNavigation: (href: string) => Promise<void>;
  
  // Event handlers
  handleLinkHover: (href: string) => void;
  handleLanguageHover: (language: string) => void;
  
  // Performance data
  performanceReport: PerformanceReport | null;
  preloadStats: PreloadStats | null;
  isOptimizing: boolean;
  
  // Control functions
  refreshPerformanceData: () => Promise<void>;
  clearPreloadQueue: () => void;
}

export function usePerformanceOptimization(
  currentSlug: string,
  currentLanguage: string,
  contentType: ContentType,
  options: UsePerformanceOptimizationOptions = {}
): PerformanceHookReturn {
  const router = useRouter();
  const {
    enablePreloading = true,
    enableLanguageSwitchOptimization = true,
    enableNavigationOptimization = true,
    enableBundleOptimization = true,
    preloadOnHover = true,
    preloadDelay = 300
  } = options;

  // State
  const [performanceReport, setPerformanceReport] = useState<PerformanceReport | null>(null);
  const [preloadStats, setPreloadStats] = useState<PreloadStats | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Refs for managing timeouts and preventing duplicate operations
  const hoverTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const preloadedLinks = useRef<Set<string>>(new Set());
  const lastOptimization = useRef<number>(0);

  /**
   * Optimize for language switch
   */
  const optimizeForLanguageSwitch = useCallback(async (targetLanguage: string) => {
    if (!enableLanguageSwitchOptimization || targetLanguage === currentLanguage) return;

    setIsOptimizing(true);
    try {
      await performanceManager.handleLanguageSwitch(
        currentSlug,
        currentLanguage,
        targetLanguage,
        contentType
      );
    } catch (error) {
      console.warn('Language switch optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  }, [currentSlug, currentLanguage, contentType, enableLanguageSwitchOptimization]);

  /**
   * Preload specific content
   */
  const preloadContent = useCallback(async (
    slug: string,
    language: string,
    targetContentType: ContentType
  ) => {
    if (!enablePreloading) return;

    try {
      await preloadingService.preloadForNavigation(slug, language, targetContentType);
    } catch (error) {
      console.warn(`Failed to preload ${targetContentType}/${slug}/${language}:`, error);
    }
  }, [enablePreloading]);

  /**
   * Preload content for navigation
   */
  const preloadForNavigation = useCallback(async (href: string) => {
    if (!enableNavigationOptimization) return;

    try {
      // Parse the href to extract slug, language, and content type
      const { slug, language, contentType: targetContentType } = parseHref(href);
      
      if (slug && language && targetContentType) {
        await performanceManager.handlePageNavigation(
          slug,
          language,
          targetContentType,
          {
            visitedPages: [currentSlug],
            timeOnPage: Date.now() - lastOptimization.current,
            scrollDepth: getScrollDepth()
          }
        );
      }
    } catch (error) {
      console.warn(`Failed to preload for navigation to ${href}:`, error);
    }
  }, [currentSlug, enableNavigationOptimization]);

  /**
   * Handle link hover with debouncing
   */
  const handleLinkHover = useCallback((href: string) => {
    if (!preloadOnHover || preloadedLinks.current.has(href)) return;

    // Clear existing timeout for this href
    const existingTimeout = hoverTimeouts.current.get(href);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      preloadForNavigation(href);
      preloadedLinks.current.add(href);
      hoverTimeouts.current.delete(href);
    }, preloadDelay);

    hoverTimeouts.current.set(href, timeout);
  }, [preloadForNavigation, preloadOnHover, preloadDelay]);

  /**
   * Handle language switcher hover
   */
  const handleLanguageHover = useCallback((language: string) => {
    if (!preloadOnHover || language === currentLanguage) return;

    const hoverKey = `lang_${language}`;
    
    if (preloadedLinks.current.has(hoverKey)) return;

    const timeout = setTimeout(() => {
      optimizeForLanguageSwitch(language);
      preloadedLinks.current.add(hoverKey);
    }, preloadDelay);

    hoverTimeouts.current.set(hoverKey, timeout);
  }, [optimizeForLanguageSwitch, currentLanguage, preloadOnHover, preloadDelay]);

  /**
   * Refresh performance data
   */
  const refreshPerformanceData = useCallback(async () => {
    try {
      const [report, stats] = await Promise.all([
        performanceManager.generatePerformanceReport(),
        Promise.resolve(preloadingService.getPreloadStats())
      ]);

      setPerformanceReport(report);
      setPreloadStats(stats);
    } catch (error) {
      console.warn('Failed to refresh performance data:', error);
    }
  }, []);

  /**
   * Clear preload queue
   */
  const clearPreloadQueue = useCallback(() => {
    preloadingService.cancelPendingPreloads();
    preloadedLinks.current.clear();
    
    // Clear all hover timeouts
    hoverTimeouts.current.forEach(timeout => clearTimeout(timeout));
    hoverTimeouts.current.clear();
  }, []);

  // Initialize performance optimization on mount
  useEffect(() => {
    const initializeOptimization = async () => {
      try {
        // Initialize performance manager if not already done
        await performanceManager.initialize();
        
        // Preload critical content for current language
        if (enablePreloading) {
          await preloadingService.preloadCriticalContent(currentLanguage);
        }

        // Optimize bundle for current language
        if (enableBundleOptimization) {
          await bundleOptimizationService.optimizeBundleForLanguage(currentLanguage);
        }

        // Load initial performance data
        await refreshPerformanceData();
        
        lastOptimization.current = Date.now();
      } catch (error) {
        console.warn('Failed to initialize performance optimization:', error);
      }
    };

    initializeOptimization();
  }, [currentLanguage, enablePreloading, enableBundleOptimization, refreshPerformanceData]);

  // Handle route changes
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // Clear preloaded links when navigating
      preloadedLinks.current.clear();
      
      // Update last optimization time
      lastOptimization.current = Date.now();
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all timeouts
      hoverTimeouts.current.forEach(timeout => clearTimeout(timeout));
      hoverTimeouts.current.clear();
    };
  }, []);

  // Refresh performance data periodically
  useEffect(() => {
    const interval = setInterval(refreshPerformanceData, 60000); // Every minute
    return () => clearInterval(interval);
  }, [refreshPerformanceData]);

  return {
    optimizeForLanguageSwitch,
    preloadContent,
    preloadForNavigation,
    handleLinkHover,
    handleLanguageHover,
    performanceReport,
    preloadStats,
    isOptimizing,
    refreshPerformanceData,
    clearPreloadQueue
  };
}

/**
 * Parse href to extract routing information
 */
function parseHref(href: string): {
  slug: string | null;
  language: string;
  contentType: ContentType | null;
} {
  try {
    const url = new URL(href, window.location.origin);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    
    let language = 'en';
    let slug: string | null = null;
    let contentType: ContentType | null = null;

    // Check if first segment is a language code
    if (pathSegments.length > 0 && ['cs', 'de', 'fr'].includes(pathSegments[0])) {
      language = pathSegments[0];
      pathSegments.shift();
    }

    // Determine content type and slug based on path structure
    if (pathSegments.length === 0) {
      contentType = 'pages';
      slug = 'home';
    } else if (pathSegments[0] === 'blog' && pathSegments.length > 1) {
      contentType = 'blog';
      slug = pathSegments[1];
    } else if (pathSegments[0] === 'services' && pathSegments.length > 1) {
      contentType = 'services';
      slug = pathSegments[1];
    } else if (pathSegments[0] === 'solutions' && pathSegments.length > 1) {
      contentType = 'solutions';
      slug = pathSegments[1];
    } else if (pathSegments[0] === 'legal' && pathSegments.length > 1) {
      contentType = 'legal';
      slug = pathSegments[1];
    } else if (pathSegments.length === 1) {
      contentType = 'pages';
      slug = pathSegments[0];
    }

    return { slug, language, contentType };
  } catch (error) {
    console.warn('Failed to parse href:', href, error);
    return { slug: null, language: 'en', contentType: null };
  }
}

/**
 * Get current scroll depth percentage
 */
function getScrollDepth(): number {
  if (typeof window === 'undefined') return 0;
  
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  
  return documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;
}