'use client';

import React, { Suspense, ComponentType, ReactNode } from 'react';

interface LazyComponentProps {
  component: ComponentType<any>;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
  [key: string]: any; // Allow passing any props to the component
}

interface LazyComponentState {
  isInView: boolean;
  hasError: boolean;
}

export class LazyComponent extends React.Component<LazyComponentProps, LazyComponentState> {
  private observer: IntersectionObserver | null = null;
  private containerRef = React.createRef<HTMLDivElement>();

  constructor(props: LazyComponentProps) {
    super(props);
    this.state = {
      isInView: false,
      hasError: false
    };
  }

  override componentDidMount() {
    this.setupIntersectionObserver();
  }

  override componentWillUnmount() {
    this.cleanupIntersectionObserver();
  }

  private setupIntersectionObserver() {
    const { threshold = 0.1, rootMargin = '50px' } = this.props;
    
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.setState({ isInView: true });
              this.props.onLoad?.();
              this.cleanupIntersectionObserver();
            }
          });
        },
        {
          threshold,
          rootMargin
        }
      );

      if (this.containerRef.current) {
        this.observer.observe(this.containerRef.current);
      }
    } else {
      // Fallback for browsers without IntersectionObserver
      this.setState({ isInView: true });
    }
  }

  private cleanupIntersectionObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  override render() {
    const { 
      component: Component, 
      fallback = <div className="stx-lazy-component__fallback">Loading...</div>,
      ...rest
    } = this.props;
    const { isInView, hasError } = this.state;

    if (hasError) {
      return <div className="stx-lazy-component__error">Failed to load component.</div>;
    }

    if (!isInView) {
      return fallback;
    }

    return <Component {...rest} />;
  }
}

// Utility function to create lazy components with error boundaries
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ReactNode
): ComponentType<any> {
  const LazyComponent = React.lazy(importFn);
  
  return (props: any) => (
    <Suspense fallback={fallback || <div className="stx-lazy-component__fallback">Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Preload strategies
export const preloadStrategies = {
  // Preload on hover
  onHover: (importFn: () => Promise<any>) => {
    let preloaded = false;
    return () => {
      if (!preloaded) {
        preloaded = true;
        importFn();
      }
    };
  },

  // Preload on viewport entry
  onViewport: (importFn: () => Promise<any>) => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            importFn();
            observer.disconnect();
          }
        });
      });
      return observer;
    }
    return null;
  },

  // Preload after main content loads
  afterLoad: (importFn: () => Promise<any>, delay: number = 2000) => {
    setTimeout(importFn, delay);
  }
}; 