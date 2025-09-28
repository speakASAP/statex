# PWA (Progressive Web App) Requirements Documentation

## 🎯 Overview

The Statex platform implements comprehensive Progressive Web App capabilities using **Next.js 14 App Router** and **Fastify** backend to deliver native-like experiences across all devices while maintaining high performance (LCP <2.5s, FID <100ms, CLS <0.1), SEO benefits and EU/UAE market compliance.

## 🔗 Related Documentation

- [Technology Stack](technology.md) - Next.js 14 and Fastify technology decisions
- [Frontend Documentation](frontend.md) - Next.js 14 App Router implementation details
- [Backend Documentation](backend.md) - Fastify backend with PWA API support
- [Architecture](architecture.md) - System architecture with PWA integration
- [Testing Strategy](testing.md) - Vitest PWA testing framework
- [Monitoring System](monitoring-system.md) - PWA performance monitoring with Sentry
- [Email System](email-system.md) - PWA notification integration
- [SEO Documentation](seo.md) - PWA SEO optimization
- [Implementation Plan](../IMPLEMENTATION_PLAN.md) - PWA milestone tracking

## 🌟 PWA Core Features Implementation

### **1. Service Worker Implementation (Next.js 14)**

#### **Service Worker Configuration**
```typescript
// next.config.js - PWA Configuration
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  sw: 'sw.js',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.statex\.cz\/.*$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|png|gif|webp|svg|ico)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 14 App Router configuration
  experimental: {
    appDir: true,
  },
  // PWA optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Performance optimizations
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

module.exports = withPWA(nextConfig);
```

#### **Custom Service Worker Implementation**
```typescript
// public/sw.js - Enhanced Service Worker
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSync } from 'workbox-background-sync';

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Fastify API caching strategy
registerRoute(
  ({ url }) => url.origin === 'https://api.statex.cz',
  new NetworkFirst({
    cacheName: 'fastify-api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes for API responses
      }),
    ],
  })
);

// AI Chat offline support
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/ai/chat'),
  new StaleWhileRevalidate({
    cacheName: 'ai-chat-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 10 * 60, // 10 minutes for AI responses
      }),
    ],
  })
);

// Background sync for prototype requests
const bgSync = new BackgroundSync('prototype-queue', {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});

registerRoute(
  ({ url }) => url.pathname === '/api/prototypes',
  async ({ event }) => {
    try {
      return await fetch(event.request);
    } catch (error) {
      await bgSync.queueRequest({ request: event.request });
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Request queued for background sync',
          offline: true,
        }),
        {
          status: 202,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  },
  'POST'
);

// Push notification handling
self.addEventListener('push', (event) => {
  if (!self.registration.showNotification) {
    return;
  }

  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Statex Notification';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: data.tag || 'default',
    data: data.url || '/',
    actions: [
      {
        action: 'open',
        title: 'Open',
        icon: '/icons/action-open.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/action-close.png',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      self.clients.openWindow(event.notification.data || '/')
    );
  }
});
```

### **2. Web App Manifest (Next.js 14 Implementation)**

#### **Dynamic Manifest Generation**
```typescript
// app/manifest.ts - Next.js 14 App Router Manifest
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Statex - AI-Powered Business Automation',
    short_name: 'Statex',
    description: 'AI-powered rapid prototype generation and business automation platform for EU and UAE markets',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    categories: ['business', 'productivity', 'developer'],
    
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any',
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any',
      },
    ],
    
    shortcuts: [
      {
        name: 'Get Prototype',
        short_name: 'Prototype',
        description: 'Request a free prototype',
        url: '/get-prototype',
        icons: [
          {
            src: '/icons/shortcut-prototype.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'AI Chat',
        short_name: 'Chat',
        description: 'Start AI conversation',
        url: '/chat',
        icons: [
          {
            src: '/icons/shortcut-chat.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'Services',
        short_name: 'Services',
        description: 'View our services',
        url: '/services',
        icons: [
          {
            src: '/icons/shortcut-services.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
    ],
    
    screenshots: [
      {
        src: '/screenshots/desktop-home.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
      {
        src: '/screenshots/mobile-home.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
      },
      {
        src: '/screenshots/desktop-prototype.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
      {
        src: '/screenshots/mobile-prototype.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
      },
    ],
    
    related_applications: [
      {
        platform: 'webapp',
        url: 'https://statex.cz/',
      },
    ],
    
    prefer_related_applications: false,
    
    // Additional PWA features
    edge_side_panel: {
      preferred_width: 400,
    },
    
    // EU/UAE market localization
    iarc_rating_id: 'e2a0d1e0-8d9e-4c7d-8c90-1a2b3c4d5e6f',
  };
}
```

### **3. Offline Support Implementation**

#### **Offline Page Component (Next.js 14)**
```tsx
// app/offline/page.tsx - Offline Fallback Page
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offline - Statex',
  description: 'You are currently offline. Please check your internet connection.',
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You're Offline
          </h1>
          <p className="text-gray-600">
            Please check your internet connection and try again.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          
          <div className="text-sm text-gray-500">
            <p>While offline, you can still:</p>
            <ul className="mt-2 space-y-1">
              <li>• Browse cached pages</li>
              <li>• View previously loaded content</li>
              <li>• Queue prototype requests</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Statex PWA - AI-Powered Business Automation
          </p>
        </div>
      </div>
    </div>
  );
}
```

#### **Offline Detection Hook**
```tsx
// hooks/useOnline.ts - Network Status Detection
'use client';

import { useState, useEffect } from 'react';

export function useOnline() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Initialize with current online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        // Show reconnection notification
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification('Back Online', {
              body: 'Your connection has been restored.',
              icon: '/icons/icon-192x192.png',
              tag: 'connectivity',
            });
          });
        }
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return { isOnline, wasOffline };
}
```

### **4. Push Notifications Implementation**

#### **Push Notification Service (Fastify Backend)**
```typescript
// src/services/pushNotificationService.ts - Fastify Push Service
import webpush from 'web-push';
import { prisma } from '../lib/prisma';

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface NotificationPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  icon?: string;
}

export class PushNotificationService {
  constructor() {
    webpush.setVapidDetails(
      'mailto:contact@statex.cz',
      process.env.VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    );
  }

  async sendNotification(
    subscription: PushSubscription,
    payload: NotificationPayload
  ): Promise<void> {
    try {
      await webpush.sendNotification(
        subscription,
        JSON.stringify(payload),
        {
          TTL: 24 * 60 * 60, // 24 hours
          urgency: 'normal',
        }
      );
    } catch (error) {
      console.error('Push notification failed:', error);
      throw error;
    }
  }

  async sendToUser(userId: string, payload: NotificationPayload): Promise<void> {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId, active: true },
    });

    const promises = subscriptions.map(async (sub) => {
      try {
        await this.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dhKey,
              auth: sub.authKey,
            },
          },
          payload
        );
      } catch (error) {
        // Handle failed subscription (likely expired)
        await prisma.pushSubscription.update({
          where: { id: sub.id },
          data: { active: false },
        });
      }
    });

    await Promise.allSettled(promises);
  }

  async subscribeUser(userId: string, subscription: PushSubscription): Promise<void> {
    await prisma.pushSubscription.upsert({
      where: {
        userId_endpoint: {
          userId,
          endpoint: subscription.endpoint,
        },
      },
      create: {
        userId,
        endpoint: subscription.endpoint,
        p256dhKey: subscription.keys.p256dh,
        authKey: subscription.keys.auth,
        active: true,
      },
      update: {
        p256dhKey: subscription.keys.p256dh,
        authKey: subscription.keys.auth,
        active: true,
      },
    });
  }

  async unsubscribeUser(userId: string, endpoint: string): Promise<void> {
    await prisma.pushSubscription.updateMany({
      where: { userId, endpoint },
      data: { active: false },
    });
  }
}
```

#### **Frontend Push Notification Hook**
```tsx
// hooks/usePushNotifications.ts - PWA Push Notifications
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function usePushNotifications() {
  const { data: session } = useSession();
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
      setIsSubscribed(!!sub);
    } catch (error) {
      console.error('Error checking push subscription:', error);
    }
  };

  const subscribe = async () => {
    if (!isSupported || !session?.user?.id) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      // Send subscription to backend
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: sub.toJSON(),
          userId: session.user.id,
        }),
      });

      setSubscription(sub);
      setIsSubscribed(true);
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    }
  };

  const unsubscribe = async () => {
    if (!subscription || !session?.user?.id) return;

    try {
      await subscription.unsubscribe();
      
      // Notify backend
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          userId: session.user.id,
        }),
      });

      setSubscription(null);
      setIsSubscribed(false);
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
    }
  };

  return {
    isSupported,
    isSubscribed,
    subscribe,
    unsubscribe,
  };
}
```

### **5. Performance Optimization**

#### **Core Web Vitals Optimization**
```typescript
// lib/performance.ts - PWA Performance Monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export function reportWebVitals(metric: WebVitalsMetric) {
  // Send to analytics service
  if (typeof window !== 'undefined') {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }

    // Send to Sentry for performance monitoring
    if (window.Sentry) {
      window.Sentry.addBreadcrumb({
        message: `Core Web Vital: ${metric.name}`,
        level: metric.rating === 'good' ? 'info' : 'warning',
        data: {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
        },
      });
    }

    // Send to custom analytics endpoint
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        url: window.location.pathname,
        timestamp: Date.now(),
      }),
    }).catch(console.error);
  }
}

// Initialize Web Vitals tracking
export function initializeWebVitals() {
  getCLS(reportWebVitals);
  getFID(reportWebVitals);
  getFCP(reportWebVitals);
  getLCP(reportWebVitals);
  getTTFB(reportWebVitals);
}

// Performance targets for PWA
export const PERFORMANCE_TARGETS = {
  LCP: 2500, // Largest Contentful Paint < 2.5s
  FID: 100,  // First Input Delay < 100ms
  CLS: 0.1,  // Cumulative Layout Shift < 0.1
  FCP: 1800, // First Contentful Paint < 1.8s
  TTFB: 600, // Time to First Byte < 600ms
};
```

### **6. PWA Installation Prompt**

#### **Install Prompt Component**
```tsx
// components/InstallPrompt.tsx - PWA Installation Banner
'use client';

import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed (standalone mode)
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSInstalled = 'standalone' in window.navigator && window.navigator.standalone;
      setIsStandalone(isStandaloneMode || isIOSInstalled);
    };

    checkStandalone();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      
      // Show install prompt after user has spent some time on site
      setTimeout(() => {
        if (!isStandalone) {
          setIsVisible(true);
        }
      }, 30000); // Show after 30 seconds
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isStandalone]);

  const handleInstall = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsVisible(false);
        // Track installation success
        if (window.gtag) {
          window.gtag('event', 'pwa_install', {
            event_category: 'PWA',
            event_label: 'accepted',
          });
        }
      }
    } catch (error) {
      console.error('Installation failed:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Track dismissal
    if (window.gtag) {
      window.gtag('event', 'pwa_install', {
        event_category: 'PWA',
        event_label: 'dismissed',
      });
    }
  };

  if (!isVisible || isStandalone) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white shadow-xl rounded-lg border border-gray-200 p-4 z-50 animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900">Install Statex App</h3>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Get faster access and offline support by installing our app on your device.
      </p>
      
      <div className="flex space-x-2">
        <button
          onClick={handleInstall}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Install</span>
        </button>
        <button
          onClick={handleDismiss}
          className="px-4 py-2 text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors"
        >
          Later
        </button>
      </div>
    </div>
  );
}
```

## 🧪 PWA Testing with Vitest

### **Service Worker Testing**
```typescript
// __tests__/pwa/serviceWorker.test.ts - Vitest PWA Testing
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Mock service worker for testing
const server = setupServer(
  rest.get('/api/prototypes', (req, res, ctx) => {
    return res(ctx.json({ success: true, data: [] }));
  }),
  rest.post('/api/prototypes', (req, res, ctx) => {
    return res(ctx.json({ success: true, id: '123' }));
  })
);

beforeEach(() => {
  server.listen();
});

describe('PWA Service Worker Functionality', () => {
  it('should cache API responses', async () => {
    // Mock cache API
    const mockCache = {
      match: vi.fn(),
      put: vi.fn(),
      keys: vi.fn(),
      delete: vi.fn(),
    };

    global.caches = {
      open: vi.fn().mockResolvedValue(mockCache),
      has: vi.fn(),
      delete: vi.fn(),
      keys: vi.fn(),
      match: vi.fn(),
    } as any;

    const response = await fetch('/api/prototypes');
    expect(response.ok).toBe(true);
    
    // Verify caching behavior
    expect(global.caches.open).toHaveBeenCalledWith('fastify-api-cache');
  });

  it('should handle offline prototype requests', async () => {
    // Simulate offline mode
    server.use(
      rest.post('/api/prototypes', (req, res, ctx) => {
        return res.networkError('Network error');
      })
    );

    const response = await fetch('/api/prototypes', {
      method: 'POST',
      body: JSON.stringify({ description: 'Test prototype' }),
    });

    // Should return queued response
    expect(response.status).toBe(202);
    const data = await response.json();
    expect(data.offline).toBe(true);
  });

  it('should validate manifest configuration', () => {
    const manifest = {
      name: 'Statex - AI-Powered Business Automation',
      short_name: 'Statex',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#2563eb',
      icons: [
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
      ],
    };

    expect(manifest.name).toBeDefined();
    expect(manifest.short_name).toBeDefined();
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons.length).toBeGreaterThan(0);
  });
});
```

### **Push Notification Testing**
```typescript
// __tests__/pwa/pushNotifications.test.ts - Push Notification Tests
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PushNotificationService } from '../../src/services/pushNotificationService';

describe('Push Notification Service', () => {
  let pushService: PushNotificationService;

  beforeEach(() => {
    pushService = new PushNotificationService();
  });

  it('should send push notification successfully', async () => {
    const mockSubscription = {
      endpoint: 'https://fcm.googleapis.com/fcm/send/test',
      keys: {
        p256dh: 'test-p256dh-key',
        auth: 'test-auth-key',
      },
    };

    const payload = {
      title: 'Prototype Ready',
      body: 'Your prototype has been generated successfully',
      url: '/prototypes/123',
    };

    // Mock webpush
    vi.doMock('web-push', () => ({
      sendNotification: vi.fn().mockResolvedValue({}),
      setVapidDetails: vi.fn(),
    }));

    await expect(
      pushService.sendNotification(mockSubscription, payload)
    ).resolves.not.toThrow();
  });

  it('should handle notification failure gracefully', async () => {
    const mockSubscription = {
      endpoint: 'https://invalid-endpoint.com',
      keys: {
        p256dh: 'invalid-key',
        auth: 'invalid-auth',
      },
    };

    const payload = {
      title: 'Test Notification',
      body: 'This should fail',
    };

    vi.doMock('web-push', () => ({
      sendNotification: vi.fn().mockRejectedValue(new Error('Invalid subscription')),
      setVapidDetails: vi.fn(),
    }));

    await expect(
      pushService.sendNotification(mockSubscription, payload)
    ).rejects.toThrow('Invalid subscription');
  });
});
```

## 📱 Cross-Platform Support

### **iOS Safari PWA Support**
```typescript
// utils/iosPwaSupport.ts - iOS PWA Detection and Features
export function isIOSDevice(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isIOSStandalone(): boolean {
  return 'standalone' in window.navigator && window.navigator.standalone === true;
}

export function canInstallOnIOS(): boolean {
  return isIOSDevice() && !isIOSStandalone();
}

export function getIOSInstallInstructions(): string[] {
  return [
    'Tap the share button in Safari',
    'Scroll down and tap "Add to Home Screen"',
    'Tap "Add" to install the app',
  ];
}

// iOS-specific PWA enhancements
export function enhanceIOSExperience(): void {
  if (isIOSDevice()) {
    // Prevent iOS bounce scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    // Add iOS-specific meta tags
    const metaTags = [
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: 'Statex' },
    ];

    metaTags.forEach(({ name, content }) => {
      if (!document.querySelector(`meta[name="${name}"]`)) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });
  }
}
```

### **Android PWA Enhancement**
```typescript
// utils/androidPwaSupport.ts - Android PWA Features
export function isAndroidDevice(): boolean {
  return /Android/.test(navigator.userAgent);
}

export function supportsWebShare(): boolean {
  return 'share' in navigator;
}

export function supportsWebShareTarget(): boolean {
  return 'serviceWorker' in navigator && 'share_target' in window;
}

// Android-specific PWA features
export async function shareContent(shareData: {
  title?: string;
  text?: string;
  url?: string;
}): Promise<void> {
  if (supportsWebShare()) {
    try {
      await navigator.share(shareData);
    } catch (error) {
      console.error('Sharing failed:', error);
      // Fallback to clipboard
      if (shareData.url && navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
      }
    }
  }
}

// Android notification channels
export function createNotificationChannel(): void {
  if ('serviceWorker' in navigator && isAndroidDevice()) {
    navigator.serviceWorker.ready.then((registration) => {
      if ('sync' in window.ServiceWorkerRegistration.prototype) {
        // Register background sync
        registration.sync.register('background-sync');
      }
    });
  }
}
```

## 🔒 PWA Security & Privacy

### **Secure Context Requirements**
```typescript
// utils/secureContext.ts - PWA Security Validation
export function isSecureContext(): boolean {
  return window.isSecureContext;
}

export function canEnablePWAFeatures(): boolean {
  const requirements = {
    https: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
    serviceWorker: 'serviceWorker' in navigator,
    secureContext: isSecureContext(),
    pushManager: 'PushManager' in window,
    notifications: 'Notification' in window,
  };

  return Object.values(requirements).every(Boolean);
}

export function validatePWAEnvironment(): {
  isValid: boolean;
  missingFeatures: string[];
} {
  const features = {
    'HTTPS/Secure Context': isSecureContext(),
    'Service Worker': 'serviceWorker' in navigator,
    'Push Manager': 'PushManager' in window,
    'Notifications API': 'Notification' in window,
    'Cache Storage': 'caches' in window,
    'IndexedDB': 'indexedDB' in window,
  };

  const missingFeatures = Object.entries(features)
    .filter(([, supported]) => !supported)
    .map(([feature]) => feature);

  return {
    isValid: missingFeatures.length === 0,
    missingFeatures,
  };
}
```

## 📊 PWA Analytics & Monitoring

### **PWA Performance Tracking**
```typescript
// lib/pwaAnalytics.ts - PWA Performance Monitoring
interface PWAMetrics {
  installPromptShown: number;
  installAccepted: number;
  installDismissed: number;
  offlineUsage: number;
  pushNotificationsSent: number;
  pushNotificationsClicked: number;
  serviceWorkerUpdates: number;
}

export class PWAAnalytics {
  private metrics: Partial<PWAMetrics> = {};

  trackInstallPrompt(action: 'shown' | 'accepted' | 'dismissed'): void {
    const key = `install${action.charAt(0).toUpperCase() + action.slice(1)}` as keyof PWAMetrics;
    this.metrics[key] = (this.metrics[key] || 0) + 1;
    
    // Send to analytics
    this.sendEvent('pwa_install', {
      action,
      timestamp: Date.now(),
    });
  }

  trackOfflineUsage(): void {
    this.metrics.offlineUsage = (this.metrics.offlineUsage || 0) + 1;
    
    this.sendEvent('pwa_offline', {
      timestamp: Date.now(),
      url: window.location.pathname,
    });
  }

  trackPushNotification(action: 'sent' | 'clicked'): void {
    const key = `pushNotifications${action.charAt(0).toUpperCase() + action.slice(1)}` as keyof PWAMetrics;
    this.metrics[key] = (this.metrics[key] || 0) + 1;
    
    this.sendEvent('pwa_push', {
      action,
      timestamp: Date.now(),
    });
  }

  trackServiceWorkerUpdate(): void {
    this.metrics.serviceWorkerUpdates = (this.metrics.serviceWorkerUpdates || 0) + 1;
    
    this.sendEvent('pwa_sw_update', {
      timestamp: Date.now(),
    });
  }

  private sendEvent(eventName: string, data: Record<string, any>): void {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'PWA',
        custom_parameters: data,
      });
    }

    // Send to Fastify analytics endpoint
    fetch('/api/analytics/pwa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: eventName,
        data,
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    }).catch(console.error);
  }

  getMetrics(): PWAMetrics {
    return this.metrics as PWAMetrics;
  }
}
```

## 🎯 Implementation Checklist

### **Core PWA Features**
- [ ] **Service Worker**: Background sync, caching strategies, offline support
- [ ] **Web App Manifest**: Complete manifest with icons, screenshots, shortcuts
- [ ] **Offline Experience**: Offline page, cached content, background sync
- [ ] **Push Notifications**: VAPID keys, subscription management, notification handling
- [ ] **Install Prompt**: Custom install banner with user experience optimization

### **Performance Optimization**
- [ ] **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1 targets
- [ ] **Caching Strategy**: Strategic caching for Fastify API responses
- [ ] **Resource Optimization**: Image optimization, lazy loading, compression
- [ ] **Bundle Optimization**: Code splitting, tree shaking, minimal dependencies

### **Testing & Quality Assurance**
- [ ] **Vitest PWA Testing**: Service worker testing, manifest validation
- [ ] **Cross-Platform Testing**: iOS Safari, Android Chrome, desktop browsers
- [ ] **Performance Testing**: Lighthouse audits, Core Web Vitals monitoring
- [ ] **Offline Testing**: Network throttling, offline functionality validation

### **Security & Compliance**
- [ ] **HTTPS Enforcement**: Secure context requirements for PWA features
- [ ] **Content Security Policy**: CSP headers for service worker security
- [ ] **GDPR Compliance**: Privacy controls for push notifications and data storage
- [ ] **Data Protection**: Encrypted storage, secure communication channels

---

**This PWA implementation leverages Next.js 14 App Router and Fastify backend to deliver a high-performance, secure, and feature-rich Progressive Web App experience optimized for the European and UAE markets.** 