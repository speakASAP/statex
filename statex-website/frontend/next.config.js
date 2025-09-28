const path = require('path');

// Load environment files in order of precedence
const envFiles = [
  path.resolve(__dirname, '../.env.development'),
  path.resolve(__dirname, '../.env'),
];

envFiles.forEach(envFile => {
  try {
    require('dotenv').config({ path: envFile });
  } catch (error) {
    // Silently continue if file doesn't exist
  }
});

// Use NODE_ENV from environment or default to development
const actualEnv = process.env.NODE_ENV || 'development';

console.log(`🚀 STATEX BUILD SYSTEM - ENVIRONMENT: ${actualEnv.toUpperCase()}`);
console.log(`📁 Environment file: ${envFiles.find(f => require('fs').existsSync(f)) || 'Not found'}`);
console.log(`🔍 NODE_ENV: ${actualEnv}`);
console.log(`📋 File exists: ${require('fs').existsSync(envFiles[0]) ? 'YES' : 'NO'}`);

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: [`localhost:${process.env.FRONTEND_PORT || '3000'}`, 'statex.cz'],
    },
  },
  
  // Turbopack configuration (replaces experimental.turbo)
  turbopack: {
    // Enable Turbopack optimizations with proper alias resolution
    resolveAlias: {
      '@': './src',
      '@/lib': './src/lib',
      '@/lib/classComposition': './src/lib/classComposition.ts',
      '@/lib/services': './src/lib/services',
      '@/lib/utils': './src/lib/utils',
      '@/lib/componentClasses': './src/lib/componentClasses.ts',
      '@/lib/image': './src/lib/image',
      '@/lib/performance': './src/lib/performance',
      '@/components': './src/components',
      '@/hooks': './src/hooks',
      '@/types': './src/types',
      '@/styles': './src/styles',
      '@/themes': './src/themes',
      '@/constants': './src/constants',
      '@/contexts': './src/contexts',
      '@/config': './src/config',
      '@/content': './src/lib/content',
      '@/test': './src/test',
      '@/services': './src/services',
    },
  },
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Static file handling
  trailingSlash: false,
  generateEtags: true,
  
  // Bundle optimization (swcMinify is deprecated in Next.js 15)
  
  // Compiler optimizations
  compiler: {
    removeConsole: actualEnv === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  // Custom headers for static files
  async headers() {
    return [
      {
        source: '/android-chrome-192x192.png',
        headers: [
          {
            key: 'Content-Type',
            value: 'image/png',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/themes/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
        ],
      },
    ];
  },
  // Webpack configuration (only used when not using Turbopack)
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Only apply webpack config when not using Turbopack
    if (process.env.TURBOPACK) {
      console.log('🚀 Using Turbopack - skipping webpack configuration');
      return config;
    }
    
    console.log('⚙️ Using Webpack - applying custom configuration');
    
    // Add comprehensive path aliases for webpack
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/lib/classComposition': path.resolve(__dirname, 'src/lib/classComposition.ts'),
      '@/lib/services': path.resolve(__dirname, 'src/lib/services'),
      '@/lib/utils': path.resolve(__dirname, 'src/lib/utils'),
      '@/lib/componentClasses': path.resolve(__dirname, 'src/lib/componentClasses.ts'),
      '@/lib/image': path.resolve(__dirname, 'src/lib/image'),
      '@/lib/performance': path.resolve(__dirname, 'src/lib/performance'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/styles': path.resolve(__dirname, 'src/styles'),
      '@/themes': path.resolve(__dirname, 'src/themes'),
      '@/constants': path.resolve(__dirname, 'src/constants'),
      '@/contexts': path.resolve(__dirname, 'src/contexts'),
      '@/config': path.resolve(__dirname, 'src/config'),
      '@/content': path.resolve(__dirname, 'src/lib/content'),
      '@/test': path.resolve(__dirname, 'src/test'),
    };
    
    // Add environment variables
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_PUBLIC_ENV': JSON.stringify(actualEnv),
      })
    );
    
    // Ensure all modules are resolved
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Add module resolution fallbacks
    config.resolve.modules = [
      ...config.resolve.modules,
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'src/lib'),
    ];
    
    return config;
  },

  // Custom build output to show environment
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  
  
  // Add environment info to build output
  env: {
    CUSTOM_ENV: actualEnv,
    CUSTOM_ENV_DISPLAY: actualEnv.toUpperCase(),
    NEXT_PUBLIC_BUILD_ENV: actualEnv.toUpperCase(),
    NEXT_PUBLIC_ENV_FILE: actualEnv === 'development' ? '.env.development' : '.env.production',
  },
};

module.exports = nextConfig;
