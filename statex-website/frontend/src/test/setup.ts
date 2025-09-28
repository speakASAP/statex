import { beforeAll, afterAll, afterEach, vi, expect } from 'vitest';
import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

// Only import cleanup if we're in a browser environment
let cleanup: (() => void) | undefined;
if (typeof window !== 'undefined') {
  const { cleanup: reactCleanup } = await import('@testing-library/react');
  cleanup = reactCleanup;
}
// CSS imports are mocked below

const logWithTimestamp = (message: string) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

logWithTimestamp('🔄 Test setup file loaded - Starting initialization...');

// Set aggressive timeouts
logWithTimestamp('⏰ Setting aggressive timeouts...');
vi.setConfig({
  testTimeout: 30000, // 30 seconds per test
  hookTimeout: 30000, // 30 seconds per hook
});

// Polyfill for TextEncoder/TextDecoder
logWithTimestamp('📦 Setting up TextEncoder/TextDecoder polyfills...');
if (typeof global.TextEncoder === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock CSS imports to prevent parsing errors
logWithTimestamp('🎨 Setting up CSS mocks...');
vi.mock('*.css', () => ({}));
vi.mock('*.scss', () => ({}));
vi.mock('*.sass', () => ({}));

// Mock CSS modules
vi.mock('*.module.css', () => ({
  default: {
    // Mock common class names
    'stx-input': 'stx-input',
    'stx-input--error': 'stx-input--error',
    'stx-input--success': 'stx-input--success',
    'stx-button': 'stx-button',
    'stx-button--primary': 'stx-button--primary',
    'stx-button--secondary': 'stx-button--secondary',
  }
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock console methods to reduce noise in tests
const originalConsole = { ...console };
beforeAll(() => {
  console.log = vi.fn();
  console.warn = vi.fn();
  console.error = vi.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
});

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Mock browser APIs only if window exists (for jsdom environment)
if (typeof window !== 'undefined') {
  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock window.scrollTo
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: vi.fn(),
  });
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
global.localStorage = localStorageMock as Storage;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
global.sessionStorage = sessionStorageMock as Storage;

logWithTimestamp('📜 Setting up browser mocks...');

// Enhanced cleanup function
logWithTimestamp('🧹 Setting up enhanced cleanup...');
const enhancedCleanup = () => {
  // Only run DOM cleanup if we're in a browser environment
  if (typeof document !== 'undefined' && cleanup) {
    cleanup();

    // Clear any remaining elements
    const tooltips = document.querySelectorAll('.stx-tooltip-content');
    tooltips.forEach(tooltip => tooltip.remove());

    // Clear any remaining modals
    const modals = document.querySelectorAll('[role="dialog"]');
    modals.forEach(modal => modal.remove());

    // Clear any remaining portals
    const portals = document.querySelectorAll('[data-testid*="portal"]');
    portals.forEach(portal => portal.remove());

    // Reset body classes
    document.body.className = '';

    // Clear any remaining event listeners
    document.removeEventListener('click', () => {});
    document.removeEventListener('keydown', () => {});
  }

  // Reset localStorage and sessionStorage
  if (typeof window !== 'undefined') {
    localStorage.clear();
    sessionStorage.clear();
  }

  // Reset any remaining timers
  vi.clearAllTimers();

  // Reset any remaining mocks
  vi.clearAllMocks();
};

// Use vitest's afterEach
afterEach(() => {
  enhancedCleanup();
});

logWithTimestamp('✅ Test setup completed successfully!');

// Export for manual use
export { enhancedCleanup };
