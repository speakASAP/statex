/**
 * Turbopack Configuration for Statex Frontend
 * Advanced optimizations and custom loaders for better performance
 */

/** @type {import('@turbo/pack').Config} */
const config = {
  // Global configuration
  global: {
    // Enable source maps for development
    sourceMap: process.env.NODE_ENV === 'development',
    
    // Optimize for the project's specific needs
    minify: process.env.NODE_ENV === 'production',
    
    // Enable tree shaking
    treeShaking: true,
    
    // Optimize for React
    jsx: {
      runtime: 'automatic',
      importSource: 'react'
    }
  },

  // Module resolution
  resolve: {
    // Optimize package imports
    alias: {
      // React optimizations
      'react': 'react',
      'react-dom': 'react-dom',
      
      // Icon libraries
      'lucide-react': 'lucide-react',
      '@heroicons/react': '@heroicons/react',
      
      // Utility libraries
      'clsx': 'clsx',
      'tailwind-merge': 'tailwind-merge',
      'class-variance-authority': 'class-variance-authority',
      
      // Form libraries
      'react-hook-form': 'react-hook-form',
      '@hookform/resolvers': '@hookform/resolvers',
      'zod': 'zod',
      
      // Animation libraries
      'framer-motion': 'framer-motion',
      
      // Path aliases (matching tsconfig.json)
      '@': './src',
      '@/components': './src/components',
      '@/lib': './src/lib',
      '@/hooks': './src/hooks',
      '@/types': './src/types',
      '@/styles': './src/styles',
      '@/utils': './src/lib/utils',
      '@/config': './src/config'
    }
  },

  // Loader configuration
  loaders: {
    // CSS loaders
    '.css': {
      loader: 'css',
      options: {
        modules: {
          auto: true,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    
    // PostCSS loader for Tailwind
    '.pcss': {
      loader: 'postcss',
      options: {
        postcssOptions: {
          plugins: [
            'tailwindcss',
            'autoprefixer'
          ]
        }
      }
    },
    
    // SVG loader
    '.svg': {
      loader: 'svg',
      options: {
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false
                }
              }
            }
          ]
        }
      }
    },
    
    // Image optimization
    '.png': { loader: 'image' },
    '.jpg': { loader: 'image' },
    '.jpeg': { loader: 'image' },
    '.gif': { loader: 'image' },
    '.webp': { loader: 'image' },
    '.avif': { loader: 'image' }
  },

  // Optimization settings
  optimization: {
    // Bundle splitting
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // React core
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 10
        },
        
        // UI libraries
        ui: {
          test: /[\\/]node_modules[\\/](@headlessui|@heroicons|lucide-react|framer-motion)[\\/]/,
          name: 'ui',
          chunks: 'all',
          priority: 5
        },
        
        // Utility libraries
        utils: {
          test: /[\\/]node_modules[\\/](clsx|tailwind-merge|class-variance-authority|zod)[\\/]/,
          name: 'utils',
          chunks: 'all',
          priority: 5
        },
        
        // Form libraries
        forms: {
          test: /[\\/]node_modules[\\/](react-hook-form|@hookform|zod)[\\/]/,
          name: 'forms',
          chunks: 'all',
          priority: 5
        }
      }
    },
    
    // Minification
    minify: process.env.NODE_ENV === 'production',
    
    // Tree shaking
    treeShaking: true
  },

  // Development server settings
  devServer: {
    // Hot module replacement
    hmr: true,
    
    // Fast refresh for React
    fastRefresh: true,
    
    // Source maps
    sourceMap: true,
    
    // Optimize for development
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'lucide-react',
        '@heroicons/react',
        'framer-motion',
        'clsx',
        'tailwind-merge',
        'class-variance-authority'
      ]
    }
  }
};

module.exports = config; 