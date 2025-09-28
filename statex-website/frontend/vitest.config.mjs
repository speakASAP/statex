/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'node', // Use node environment for server-side testing
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
    reporters: ['verbose'],
    testTimeout: 30000, // 30 seconds
    hookTimeout: 30000, // 30 seconds
    teardownTimeout: 10000, // 10 seconds
    
    // Parallel execution configuration
    pool: 'forks', // Use forks for better isolation
    poolOptions: {
      forks: {
        singleFork: false, // Allow multiple forks for parallel execution
        maxForks: 4, // Use up to 4 forks (half of available cores)
        minForks: 2, // Minimum 2 forks for parallel execution
      },
    },
    isolate: true, // Isolate each test file
    maxConcurrency: 4, // Run up to 4 test files in parallel
    
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.config.*',
        '**/*.d.ts',
        '**/*.stories.*',
        '**/coverage/**',
        '**/.next/**',
        '**/dist/**',
        '**/build/**',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}', 'src/**/__tests__/**/*.{js,jsx,ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**', '.next/**', 'coverage/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/test': path.resolve(__dirname, './src/test'),
    },
  },
  define: {
    'process.env.NODE_ENV': '"test"',
  },
});
