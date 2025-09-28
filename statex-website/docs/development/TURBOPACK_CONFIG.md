# Turbopack Configuration for Statex Frontend

## Overview

This project is configured to use Turbopack for faster development builds and optimized production builds. Turbopack is the next-generation bundler from the Vercel team, designed to be up to 700x faster than Webpack.

## Configuration Files

### 1. `turbo.json`
- Defines the build pipeline and caching strategy
- Configures task dependencies and outputs
- Enables parallel execution of tasks

### 2. `next.config.js`
- Turbopack experimental features
- Package import optimizations
- Bundle splitting strategies
- Webpack fallbacks for Node.js modules
- **Environment detection**: Automatically detects development vs production environment

### 3. `turbopack.config.js`
- Advanced Turbopack-specific optimizations
- Custom loaders for different file types
- Module resolution and aliases
- Development server optimizations

### 4. Root `package.json`
- Centralized build scripts for the entire project
- Frontend and backend build coordination
- Environment-aware build commands
- Turbopack as default build system

## Available Scripts

### Development
```bash
# Start development server with Turbopack (default)
npm run dev

# Start development server with Webpack (fallback)
npm run dev:webpack
```

### Building
```bash
# Build with Turbopack (default)
npm run build

# Build with Webpack (fallback)
npm run build:webpack

# Build with bundle analysis
npm run build-stats
npm run build-stats:turbo
```

### Root Level Scripts (from project root)
```bash
# Build frontend with Turbopack
npm run build

# Build frontend only
npm run build:frontend

# Build backend only
npm run build:backend

# Build both frontend and backend
npm run build:all

# Development servers
npm run dev:frontend
npm run dev:backend
npm run dev:all
```

### Testing
```bash
# Run tests with Vitest
npm run test

# Run tests with Turbopack pipeline
npm run turbo:test
```

### Linting
```bash
# Run linting
npm run lint

# Run linting with Turbopack pipeline
npm run turbo:lint
```

## Turbopack Features Enabled

### 1. Experimental Features
- **Server Actions**: Enabled for better performance
- **Package Import Optimization**: Optimizes imports for better tree shaking
- **SWC Minification**: Faster minification with SWC
- **Bundle Analysis**: Integration with bundle analyzer

### 2. Package Optimizations
The following packages are optimized for better performance:
- `lucide-react` - Icon library
- `@heroicons/react` - Icon library
- `framer-motion` - Animation library
- `react-hook-form` - Form library
- `@hookform/resolvers` - Form validation
- `zod` - Schema validation
- `clsx` - Conditional classes
- `tailwind-merge` - Tailwind class merging
- `class-variance-authority` - Component variants

### 3. Bundle Splitting
- **React Core**: Separate chunk for React and React DOM
- **UI Libraries**: Separate chunk for UI components
- **Utility Libraries**: Separate chunk for utilities
- **Form Libraries**: Separate chunk for form handling

### 4. Loader Optimizations
- **CSS Modules**: Automatic CSS module detection
- **PostCSS**: Tailwind CSS and Autoprefixer support
- **SVG**: Optimized SVG loading with SVGO
- **Images**: Optimized image loading and processing

## Performance Benefits

### Development
- **700x faster** than Webpack for incremental builds
- **Instant hot reload** with Fast Refresh
- **Optimized dependency pre-bundling**
- **Memory efficient** development server

### Production
- **Faster build times** with parallel processing
- **Better tree shaking** for smaller bundles
- **Optimized code splitting** for faster loading
- **Improved caching** strategies

## Troubleshooting

### Common Issues

1. **Module Resolution Errors**
   - Ensure all path aliases in `tsconfig.json` match Turbopack configuration
   - Check that all dependencies are properly installed

2. **CSS Module Issues**
   - Verify PostCSS configuration is correct
   - Check that Tailwind CSS is properly configured

3. **Build Performance**
   - Clear Turbopack cache: `rm -rf .turbo`
   - Clear Next.js cache: `rm -rf .next`

### Fallback to Webpack
If you encounter issues with Turbopack, you can fallback to Webpack:
```bash
npm run dev:webpack
```

## Environment Variables

### Development
```bash
NEXT_TURBO=1
TURBO_FORCE=1
NEXT_DEV_TURBO=true
NEXT_FAST_REFRESH=true
```

### Production
```bash
NEXT_SWC_MINIFY=true
NEXT_COMPRESS=true
NEXT_OPTIMIZE_PACKAGES=true
```

## Monitoring and Analysis

### Bundle Analysis
```bash
# Analyze Webpack bundle
npm run build-stats

# Analyze Turbopack bundle
npm run build-stats:turbo
```

### Performance Monitoring
- Use browser DevTools to monitor bundle sizes
- Check Network tab for loading performance
- Monitor memory usage in development

## Best Practices

1. **Use Turbopack for Development**: Default dev server uses Turbopack
2. **Test Both Build Systems**: Verify builds work with both Webpack and Turbopack
3. **Monitor Bundle Sizes**: Regular analysis to ensure optimal performance
4. **Keep Dependencies Updated**: Turbopack works best with latest versions
5. **Use Optimized Imports**: Leverage package import optimizations

## Current Implementation Status

### ✅ **Turbopack as Default Build System**
- **Frontend builds**: Now use Turbopack by default (`--turbo` flag)
- **Development server**: Uses Turbopack (`--turbopack` flag)
- **Webpack fallback**: Available via `npm run build:webpack` and `npm run dev:webpack`
- **Root level builds**: All root build commands use Turbopack via frontend

### ✅ **Centralized Build System Integration**
- **Root directory**: `npm run build` automatically uses Turbopack
- **Environment awareness**: Builds respect the current environment (dev/prod)
- **Cross-directory builds**: Can build from root, frontend, or backend directories
- **Unified workflow**: Single command to build entire project

### ✅ **Performance Improvements**
- **Build speed**: Significantly faster builds with Turbopack
- **Development**: Instant hot reload and faster incremental builds
- **Production**: Optimized bundles with better tree shaking
- **Memory usage**: Reduced memory footprint during builds

## Migration Notes

### From Webpack to Turbopack
- Most configurations are automatically compatible
- Custom webpack loaders may need Turbopack equivalents
- Environment variables and path aliases work the same
- Testing and linting pipelines remain unchanged
- **Default behavior**: Turbopack is now the primary build system

### Compatibility
- **Next.js**: 15.4+ (fully supported)
- **React**: 18+ (optimized)
- **TypeScript**: Full support
- **Tailwind CSS**: Full support
- **PostCSS**: Full support 