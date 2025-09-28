# Deployment Scripts Quick Reference

## 🚀 Quick Commands

### Development Environment
```bash
# Switch to development
./scripts/switch_env.sh development

# Start services
./scripts/dev-deploy.sh --build

# Check status
./scripts/dev-deploy.sh --status

# View logs
./scripts/dev-deploy.sh --logs

# Stop services
./scripts/dev-deploy.sh --stop
```

### Production Environment
```bash
# Switch to production
./scripts/switch_env.sh production

# Deploy
./scripts/deploy.sh --deploy

# Check status
./scripts/deploy.sh --status

# View logs
./scripts/deploy.sh --logs
```

## ⚠️ Critical Rules

1. **NEVER use `./scripts/deploy.sh` in development environment**
2. **NEVER use `./scripts/dev-deploy.sh` in production environment**
3. **Always check environment first**: `./scripts/switch_env.sh status`

## 🔧 Script Commands

| Script | Command | Purpose |
|--------|---------|---------|
| `dev-deploy.sh` | `--start` | Start development services |
| `dev-deploy.sh` | `--build` | Build and start (recommended) |
| `dev-deploy.sh` | `--stop` | Stop development services |
| `dev-deploy.sh` | `--restart` | Restart development services |
| `dev-deploy.sh` | `--status` | Show service status |
| `dev-deploy.sh` | `--logs` | Show service logs |
| `dev-deploy.sh` | `--clean` | Clean up environment |
| `deploy.sh` | `--setup` | Initial production setup |
| `deploy.sh` | `--deploy` | Deploy to production |
| `deploy.sh` | `--restart` | Restart production services |
| `deploy.sh` | `--status` | Show production status |
| `deploy.sh` | `--logs` | Show production logs |

## 🌐 URLs

### Development
- Frontend: http://localhost:3000
- API: http://localhost:4000
- MailHog: http://localhost:8025
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Production
- Frontend: https://yourdomain.com
- API: https://api.yourdomain.com

## 🚨 Error Messages

| Error | Solution |
|-------|----------|
| "This script is for PRODUCTION environment only!" | Use `./scripts/dev-deploy.sh` |
| "This script is for DEVELOPMENT environment only!" | Use `./scripts/deploy.sh` |
| "No environment configured!" | Run `./scripts/switch_env.sh [dev/prod]` |

## 📚 Full Documentation

- [Deployment Scripts](deployment-scripts.md) - Complete documentation
- [DEPLOYMENT.md](../../DEPLOYMENT.md) - Full deployment guide
- [Environment Setup](environment-setup.md) - Environment configuration
