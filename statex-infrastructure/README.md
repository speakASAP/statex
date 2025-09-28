# StateX Infrastructure

This repository contains the infrastructure configuration for the StateX platform, including Nginx reverse proxy and SSL certificate management.

## 🏗️ Architecture

- **Nginx**: Reverse proxy and load balancer
- **Let's Encrypt**: SSL certificate management for production
- **Self-signed certificates**: For development environment
- **Persistent storage**: Certificates stored locally to avoid rate limiting

## 🚀 Quick Start

### Development Environment

```bash
# Setup development environment
make setup-dev

# Start development services
make dev

# Access your application
open http://localhost
open https://localhost  # (with self-signed certificate warning)
```

### Production Environment

```bash
# Setup production environment (run on production server)
make setup-prod

# Start production services
make prod

# Access your application
open https://statex.cz
```

## 📁 Directory Structure

```
statex-infrastructure/
├── docker-compose.yml          # Default (development)
├── docker-compose.dev.yml      # Development with self-signed certs
├── docker-compose.prod.yml     # Production with Let's Encrypt
├── env.dev                     # Development environment variables
├── env.prod                    # Production environment variables
├── Makefile                    # Management commands
├── nginx/                      # Nginx configuration
├── scripts/                    # Utility scripts
│   ├── generate-self-signed.sh # Generate self-signed certificates
│   ├── manage-certificates.sh  # Let's Encrypt certificate management
│   └── setup-certificate-storage.sh # Setup persistent storage
├── ssl-dev/                    # Development SSL certificates
├── ssl/                        # Production SSL certificates
├── webroot/                    # Web root for ACME challenges
└── logs/                       # Application logs
```

## 🔐 Certificate Management

### Development (Self-signed)

- Uses self-signed certificates for `localhost`
- No external dependencies
- Browser will show security warning (normal for development)
- Certificates are generated automatically on startup

### Production (Let's Encrypt)

- Uses Let's Encrypt certificates for `statex.cz`
- Persistent storage at `/opt/statex/letsencrypt`
- Automatic renewal every 12 hours
- Rate limit protection (reuses existing certificates)
- Staging environment fallback

## 🛠️ Available Commands

```bash
make help          # Show all available commands
make dev           # Start development environment
make prod          # Start production environment
make stop          # Stop all services
make clean         # Clean up containers and volumes
make setup-dev     # Setup development environment
make setup-prod    # Setup production environment
make logs          # Show logs for all services
make status        # Show status of all services
```

## 🔧 Configuration

### Environment Variables

#### Development (`env.dev`)
```bash
VIRTUAL_HOST=localhost
DEFAULT_HOST=localhost
ALLOW_SELF_SIGNED=true
LETSENCRYPT_EMAIL=admin@localhost
```

#### Production (`env.prod`)
```bash
VIRTUAL_HOST=statex.cz
DEFAULT_HOST=statex.cz
ALLOW_SELF_SIGNED=false
LETSENCRYPT_EMAIL=admin@statex.cz
```

### Persistent Storage

Production certificates are stored in `/opt/statex/letsencrypt` to:
- Avoid rate limiting during development rebuilds
- Persist certificates across container restarts
- Enable certificate reuse and validation

## 🔄 Certificate Renewal

### Development
- Self-signed certificates are regenerated on each startup
- No external API calls required

### Production
- Automatic renewal every 12 hours
- Checks certificate validity before requesting new ones
- Falls back to staging environment if production fails
- Copies renewed certificates to nginx SSL directory

## 🐛 Troubleshooting

### Development Issues

1. **Self-signed certificate warning**: This is normal for development
2. **Port conflicts**: Stop other services using ports 80/443
3. **Permission issues**: Run `make setup-dev` to fix permissions

### Production Issues

1. **Certificate renewal failures**: Check Let's Encrypt rate limits
2. **Permission issues**: Run `make setup-prod` to fix permissions
3. **Domain validation**: Ensure DNS points to your server

### Common Commands

```bash
# Check container status
make status

# View logs
make logs

# Restart services
make stop && make dev  # or make prod

# Clean everything
make clean
```

## 🔒 Security Notes

- Development uses self-signed certificates (not secure for production)
- Production uses Let's Encrypt certificates (automatically renewed)
- Certificates are stored with proper permissions (600 for private keys)
- ACME challenges are served from `/var/www/html/.well-known/acme-challenge`

## 📝 License

This project is part of the StateX platform. See the main repository for license information.