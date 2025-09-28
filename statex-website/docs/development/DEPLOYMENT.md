# StateX Deployment Guide

This guide provides instructions for deploying the StateX application to both development and production environments.

## ⚠️ Important: Environment Separation

**StateX now has separate deployment scripts for different environments:**

- **Development**: Use `./scripts/dev-deploy.sh` (for local development)
- **Production**: Use `./scripts/deploy.sh` (for production servers)

**Never use the production script in development environment!**

## Prerequisites

- Docker and Docker Compose installed on the server
- Domain name pointed to your server's IP address (for production)
- Ports 80 and 443 open in your firewall (for production)
- Git installed on the server

## Development Environment Setup

### Local Development
```bash
# Switch to development environment
./scripts/switch_env.sh development

# Start development services
./scripts/dev-deploy.sh --start

# Build and start services (recommended for first time)
./scripts/dev-deploy.sh --build

# Check service status
./scripts/dev-deploy.sh --status

# View logs
./scripts/dev-deploy.sh --logs

# Stop services
./scripts/dev-deploy.sh --stop

# Clean up environment
./scripts/dev-deploy.sh --clean
```

### Development URLs
- Frontend: http://localhost:3000
- API: http://localhost:4000
- MailHog: http://localhost:8025
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## Production Environment Setup

### Server Setup

1. **Update system packages**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Docker and Docker Compose**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Clone the repository**
   ```bash
   git clone https://github.com/speakASAP/statex.git
   cd statex
   ```

### Configuration

1. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env.production
   
   # Edit the .env.production file with your production values
   nano .env.production
   ```

   Important variables to configure:
   - `NODE_ENV=production`
   - `VIRTUAL_HOST=yourdomain.com`
   - `LETSENCRYPT_EMAIL=your-email@example.com`
   - Database credentials
   - JWT secret keys
   - Email SMTP settings

2. **Switch to production environment**
   ```bash
   ./scripts/switch_env.sh production
   ```

3. **Generate SSL certificates**
   ```bash
   ./scripts/generate_ssl.sh
   ```

## Production Deployment

### Initial Setup
```bash
# Run initial setup (creates .env files, generates SSL certs)
./scripts/deploy.sh --setup
```

### Deploy Application
```bash
# Deploy the application
./scripts/deploy.sh --deploy
```

### Verify Deployment
```bash
# Check service status
./scripts/deploy.sh --status

# View logs
./scripts/deploy.sh --logs
```

## Common Operations

### Restart Services
```bash
# Production
./scripts/deploy.sh --restart

# Development
./scripts/dev-deploy.sh --restart
```

### View Logs
```bash
# Production - View all logs
./scripts/deploy.sh --logs

# Production - View logs for a specific service
./scripts/deploy.sh --logs backend

# Development - View all logs
./scripts/dev-deploy.sh --logs

# Development - View logs for a specific service
./scripts/dev-deploy.sh --logs backend
```

### Update the Application
```bash
# Pull the latest changes
git pull

# Production - Rebuild and restart
./scripts/deploy.sh --deploy

# Development - Rebuild and restart
./scripts/dev-deploy.sh --build
```

### Backup Database
```bash
# Create a database backup
./scripts/backup_database.sh

# List available backups
ls -la database/backups/
```

## Environment Management

### Switch Between Environments
```bash
# Switch to development
./scripts/switch_env.sh development

# Switch to production
./scripts/switch_env.sh production

# Check current environment
./scripts/switch_env.sh status
```

### Dynamic USER_UID Configuration
The system automatically detects and configures USER_UID for different environments:

- **Development**: Uses current user UID (e.g., 501 on macOS, 1000 on Linux)
- **Production**: Uses `PRODUCTION_USER_UID` if set, otherwise defaults to 1002
- **No manual updates needed** when deploying to different servers

## Monitoring

### Set up monitoring with cAdvisor and Prometheus

1. **Install cAdvisor**
   ```bash
   docker run \
     --volume=/:/rootfs:ro \
     --volume=/var/run:/var/run:ro \
     --volume=/sys:/sys:ro \
     --volume=/var/lib/docker/:/var/lib/docker:ro \
     --volume=/dev/disk/:/dev/disk:ro \
     --publish=8080:8080 \
     --detach=true \
     --name=cadvisor \
     --privileged \
     --device=/dev/kmsg \
     gcr.io/cadvisor/cadvisor:v0.47.0
   ```

2. **Access cAdvisor UI**
   Open `http://your-server-ip:8080` in your browser

## Troubleshooting

### Common Issues

1. **Wrong deployment script**
   - **Error**: "This script is for PRODUCTION environment only!"
   - **Solution**: Use `./scripts/dev-deploy.sh` for development, `./scripts/deploy.sh` for production

2. **Port conflicts**
   - Ensure ports 80 and 443 are not in use by other services (production)
   - Check running containers: `docker ps`

3. **SSL certificate issues**
   - Verify domain DNS settings
   - Check certificate generation logs
   - Ensure Let's Encrypt can access `.well-known` directory

4. **Database connection issues**
   - Check database container status
   - Verify credentials in `.env` file
   - Check database logs: `docker logs statex_postgres`

### Viewing Logs
```bash
# Production logs
docker compose -f docker-compose.yml -f docker-compose.production.yml logs -f

# Development logs
docker compose -f docker-compose.development.yml logs -f

# Specific service logs
docker compose -f docker-compose.development.yml logs -f backend
```

## Security Considerations

1. **Firewall Configuration**
   - Only expose necessary ports (80, 443 for production)
   - Use a firewall like UFW or iptables

2. **Regular Updates**
   - Keep Docker and system packages updated
   - Regularly update application dependencies

3. **Backup Strategy**
   - Regular database backups
   - Off-site backup storage
   - Test restore procedures

## Maintenance

### Update Dependencies
```bash
# Update Node.js dependencies
cd backend && yarn upgrade
cd ../frontend && yarn upgrade

# Production - Rebuild and restart
cd ..
./scripts/deploy.sh --deploy

# Development - Rebuild and restart
./scripts/dev-deploy.sh --build
```

### Clean Up
```bash
# Remove unused Docker resources
docker system prune -a

# Remove unused volumes
docker volume prune

# Development - Clean environment
./scripts/dev-deploy.sh --clean
```

## Support

For support, please contact [Your Support Email]

---

**Note:** This document assumes you have basic knowledge of Docker, Linux server administration, and web application deployment. Adjust the instructions according to your specific environment and requirements.

**Remember**: Always use the correct deployment script for your environment!
