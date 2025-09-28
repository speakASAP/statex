# StateX Build System Guide

## Overview

This project now features a **centralized build system** that allows you to build the frontend and backend from any directory, including the root project directory. This eliminates the need to navigate to specific subdirectories and ensures consistent build behavior across the entire project.

## Build Commands

### From Root Directory (Recommended)

All build commands can now be run from the root directory:

```bash
# Build frontend only (default)
npm run build

# Build frontend explicitly
npm run build:frontend

# Build backend only
npm run build:backend

# Build both frontend and backend
npm run build:all
```

### From Subdirectories (Legacy Support)

You can still run builds from individual directories if needed:

```bash
# From frontend directory
cd frontend
npm run build

# From backend directory
cd backend
npm run build
```

## Available Scripts

### Build Scripts
- **`build`** - Builds frontend (default behavior)
- **`build:frontend`** - Builds frontend explicitly
- **`build:backend`** - Builds backend only
- **`build:all`** - Builds both frontend and backend sequentially

### Development Scripts
- **`dev:frontend`** - Starts frontend development server
- **`dev:backend`** - Starts backend development server
- **`dev:all`** - Starts both frontend and backend development servers

### Start Scripts
- **`start`** - Starts frontend production server (default behavior)
- **`start:frontend`** - Starts frontend production server
- **`start:backend`** - Starts backend production server
- **`start:all`** - Starts both frontend and backend production servers

### Utility Scripts
- **`clean`** - Cleans build artifacts from both frontend and backend
- **`clean:frontend`** - Cleans frontend build artifacts
- **`clean:backend`** - Cleans backend build artifacts

## How It Works

### Root Package.json Configuration

The root `package.json` contains workspace configuration and build scripts:

```json
{
  "name": "statex-workspace",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ],
  "scripts": {
    "build": "npm run build:frontend",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "build:all": "npm run build:backend && npm run build:frontend",
    // ... other scripts
  }
}
```

### Environment Integration

The build system automatically uses the centralized environment configuration:

1. **Root Environment**: `.env` symlink points to current environment (`.env.development` or `.env.production`)
2. **Frontend Environment**: `frontend/.env` symlink points to root `.env`
3. **Backend Environment**: `backend/.env` symlink points to root `.env`

### Build Process Flow

When you run `npm run build` from the root:

1. **Environment Check**: System verifies current environment configuration
2. **Frontend Build**: Changes to frontend directory and runs `npm run build`
3. **Environment Loading**: Next.js loads environment variables from global `.env`
4. **Build Execution**: Next.js builds the project with correct environment settings
5. **Output**: Build artifacts are created in `frontend/.next`

## Best Practices

### Recommended Workflow

1. **Always build from root directory** for consistency
2. **Use environment switching script** to change between dev/prod
3. **Clean builds when switching environments** to avoid conflicts

### Environment Management

```bash
# Check current environment
./scripts/switch_env.sh status

# Switch to development
./scripts/switch_env.sh development

# Switch to production
./scripts/switch_env.sh production

# Clean and rebuild after environment switch
npm run clean && npm run build
```

### Troubleshooting

#### Build Fails from Root
- Ensure you're in the root directory
- Check that environment symlinks are correct
- Verify frontend and backend dependencies are installed

#### Environment Issues
- Run `./scripts/switch_env.sh status` to check configuration
- Ensure `.env` symlinks exist in both frontend and backend directories
- Verify environment files contain required variables

#### Clean Builds
```bash
# Clean everything and rebuild
npm run clean
npm install
npm run build
```

## Migration from Old System

### Before (Old Way)
```bash
# Had to navigate to frontend directory
cd frontend
npm run build

# Had to navigate to backend directory
cd backend
npm run build
```

### After (New Way)
```bash
# Build from anywhere in the project
npm run build              # Frontend only
npm run build:backend      # Backend only
npm run build:all          # Both
```

## Benefits

1. **Consistency**: Same build behavior regardless of current directory
2. **Efficiency**: No need to navigate between directories
3. **Integration**: Builds automatically use centralized environment configuration
4. **Maintenance**: Single source of truth for build scripts
5. **Team Collaboration**: Standardized build process for all team members

## Future Enhancements

- **Parallel Builds**: Build frontend and backend simultaneously
- **Build Caching**: Implement build caching for faster rebuilds
- **Docker Integration**: Docker-based build system
- **CI/CD Integration**: Automated build and deployment pipelines
