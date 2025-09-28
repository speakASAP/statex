# Environment Quick Reference

## 🚀 Essential Commands

### Environment Switching
```bash
# Switch to development (DEBUG=true, localhost)
./scripts/switch_env.sh development

# Switch to production (DEBUG=false, production URLs)
./scripts/switch_env.sh production

# Check current environment
ls -la .env
source .env && echo "DEBUG: $DEBUG, BASE_URL: $BASE_URL"
```

### Environment Setup
```bash
# Initial setup (creates all environment files)
./scripts/setup_env.sh

# Production setup
./scripts/setup_production.sh
```

## 📊 Environment Status

| Environment | DEBUG | BASE_URL | SSL Mode | Self-Signed SSL |
|-------------|-------|----------|----------|-----------------|
| **Development** | `true` | `http://localhost:3000` | `development` | `true` |
| **Production** | `false` | `https://statex.cz` | `production` | `false` |

## 🔧 File Structure

```
statex/
├── .env → .env.development (symlink)
├── .env.development (DEBUG=true)
├── .env.production (DEBUG=false)
├── docker-compose.production.yml (Production Docker orchestration)
├── frontend/
│   ├── .env.development (DEBUG=true)
│   ├── .env.production (DEBUG=false)
│   └── Dockerfile.prod (Production container)
├── backend/
│   ├── .env.development (DEBUG=true)
│   ├── .env.production (DEBUG=false)
│   └── Dockerfile.prod (Production container)
└── nginx/
    ├── nginx.conf (Main Nginx configuration)
    └── conf.d/ (Server configurations)
```

## 🎨 Frontend Usage

### Import Environment
```typescript
import { env, getFullUrl, getEmailLink } from '@/config/env';
```

### Use Environment Variables
```typescript
// Check debug mode
const isDebug = env.DEBUG;

// Get full URL
const apiUrl = getFullUrl('/api/data');

// Create email link
const emailLink = getEmailLink('contact@statex.cz', 'Support Request');
```

## ⚙️ Backend Usage

### Environment Variables
```typescript
// CORS configuration
const corsOrigin = process.env.NODE_ENV === 'production' 
  ? [process.env.BASE_URL || 'https://statex.cz'] 
  : ['http://localhost:3000'];

// Debug mode
const isDebug = process.env.DEBUG === 'true';
```

## 🐳 Docker Integration

### Production Docker Deployment
```bash
# Deploy all containers
docker compose -f docker-compose.production.yml up -d --build

# Check container health
docker compose -f docker-compose.production.yml ps

# View logs
docker compose -f docker-compose.production.yml logs -f

# Stop all containers
docker compose -f docker-compose.production.yml down
```

### Container Architecture
- **Frontend**: Next.js application container
- **Backend**: Node.js API container
- **Database**: PostgreSQL container
- **Cache**: Redis container
- **Reverse Proxy**: Nginx container
- **SSL**: Certbot container for Let's Encrypt

## 🧪 Testing

### Environment Tests
```bash
cd frontend && npx vitest run src/config/env.test.ts
```

### Test Coverage
- ✅ Environment variable access
- ✅ URL generation functions
- ✅ Email link generation
- ✅ DEBUG configuration

## 🔍 Troubleshooting

### Common Issues

#### Environment Not Switching
```bash
# Check symlink
ls -la .env

# Force recreate
rm .env && ln -sf .env.development .env
```

#### DEBUG Not Working
```bash
# Check environment
source .env && echo $DEBUG

# Verify frontend
cat frontend/.env.development
```

#### Docker Issues
```bash
# Check Docker files
ls -la docker-compose*.yml

# Manual start
docker compose up -d
```

## 📚 Best Practices

### ✅ Do
- Use `./scripts/switch_env.sh` to change environments
- Test environment switching before deployment
- Use environment-specific files (`.env.development`, `.env.production`)
- Enable DEBUG in development, disable in production

### ❌ Don't
- Edit `.env` directly (it's a symlink)
- Commit `.env` files to version control
- Use production secrets in development
- Enable DEBUG in production

## 🔗 Related Documentation

- [Full Environment Setup Guide](environment-setup.md) - Comprehensive documentation
- [Architecture Guide](architecture.md) - System architecture
- [Frontend Guide](frontend.md) - Frontend development
- [Backend Guide](backend.md) - Backend API
- [Testing Guide](testing-guidelines.md) - Testing strategies

---

**Last Updated**: July 31, 2024  
**Status**: ✅ Production Ready 