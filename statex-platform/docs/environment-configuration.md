# StateX Environment Configuration Guide

## Overview

This project uses a **centralized environment configuration system** where all environment variables are managed from a single source of truth at the root level. This eliminates confusion and ensures consistency across frontend, backend, and other services.

## Architecture

```
statex/
├── .env -> .env.development          # Root environment symlink
├── .env.development                  # Development environment variables
├── .env.production                   # Production environment variables
├── frontend/
│   ├── .env -> ../.env              # Frontend symlink to root .env
│   └── next.config.js               # Configured to use global .env
└── backend/
    ├── .env -> ../.env              # Backend symlink to root .env
    └── src/server.ts                # Configured to use global .env
```

## Key Principles

1. **Single Source of Truth**: All environment variables are defined in root `.env.development` or `.env.production`
2. **No Duplication**: No separate environment files in subdirectories
3. **Automatic Synchronization**: Environment switching automatically updates all subdirectories
4. **Consistent Behavior**: Frontend, backend, and other services always use the same environment

## Environment Files

### Root Level
- **`.env.development`**: Development environment variables
- **`.env.production`**: Production environment variables  
- **`.env`**: Symlink pointing to current environment (managed by switch script)

### Subdirectories
- **`frontend/.env`**: Symlink to root `.env`
- **`backend/.env`**: Symlink to root `.env`
- **Other services**: Symlink to root `.env`

## Environment Switching

### Using the Switch Script

```bash
# Switch to development environment
./scripts/switch_env.sh development

# Switch to production environment  
./scripts/switch_env.sh production

# Check current environment status
./scripts/switch_env.sh status
```

### What Happens During Switch

1. **Root Level**: Updates `.env` symlink to point to `.env.development` or `.env.production`
2. **Frontend**: Automatically removes old files and creates symlink to root `.env`
3. **Backend**: Automatically removes old files and creates symlink to root `.env`
4. **Environment Variables**: Loads new environment variables into current session
5. **Docker Containers**: Stops existing containers and prepares for new environment

## Service Configuration

### Next.js (Frontend)
The frontend `next.config.js` is configured to load environment variables from the global `.env` file:

```javascript
// Load environment variables from parent directory (global .env files)
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
```

### Fastify (Backend)
The backend `src/server.ts` is configured to load environment variables from the global `.env` file:

```typescript
// Load environment variables from parent directory (global .env files)
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
```

This ensures both services always use the centralized environment configuration.

## Environment Variables

### Development Environment (`.env.development`)
```bash
NODE_ENV=development
DEBUG=true
BASE_URL=http://localhost:3000
# ... other development-specific variables
```

### Production Environment (`.env.production`)
```bash
NODE_ENV=production
DEBUG=false
BASE_URL=https://statex.cz
# ... other production-specific variables
```

## Benefits

1. **Consistency**: All services use identical environment variables
2. **Maintainability**: Single place to update environment configuration
3. **Reliability**: No risk of environment mismatches between services
4. **Automation**: Environment switching handles all subdirectories automatically
5. **Clarity**: Clear understanding of which environment is active

## Troubleshooting

### Environment Not Loading
- Verify root `.env` symlink exists and points to correct environment
- Check that subdirectory `.env` symlinks point to root `.env`
- Ensure `dotenv` package is installed in both frontend and backend

### Build Using Wrong Environment
- Run `./scripts/switch_env.sh status` to check current environment
- Verify frontend and backend `.env` symlinks point to root `.env`
- Check service configurations load from correct path

### Environment Variables Missing
- Verify environment file exists (`.env.development` or `.env.production`)
- Check symlinks are correctly configured
- Ensure environment variables are properly formatted (KEY=value)

## Best Practices

1. **Always use the switch script** instead of manually editing symlinks
2. **Keep environment files in version control** (except sensitive data)
3. **Use descriptive variable names** that clearly indicate their purpose
4. **Document required environment variables** for new team members
5. **Test environment switching** after making configuration changes

## Migration from Old System

If migrating from separate environment files in subdirectories:

1. Remove all `.env*` files from subdirectories (frontend, backend, etc.)
2. Ensure root environment files are properly configured
3. Run `./scripts/switch_env.sh development` to set up new system
4. Verify all services are using the centralized configuration

## Support

For issues with environment configuration:
1. Check this documentation
2. Run `./scripts/switch_env.sh status` for diagnostics
3. Verify symlink configuration in all directories
4. Check service configurations and dotenv setup
