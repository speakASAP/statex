# 🔐 SSL Certificate Setup Guide

This guide explains how to set up SSL certificates for dynamic subdomains in the StateX platform, supporting both development and production environments.

## 🎯 Overview

The StateX platform uses wildcard SSL certificates to support unlimited dynamic subdomains like:

- `https://project-customer1.localhost:3000/`
- `https://project-customer2.localhost:3000/plan`
- `https://project-customer3.localhost:3000/offer`

## 🚀 Quick Start

### 1. Run the Setup Script

```bash
cd /Users/sergiystashok/Documents/GitHub/statex/statex-website
./scripts/setup-ssl-certificates.sh
```

This script will:

- Install mkcert CA (if not already installed)
- Generate wildcard SSL certificates
- Configure proper file permissions
- Check DNS configuration

### 2. Start HTTPS Development Server

```bash
# Option 1: Direct npm
cd frontend && npm run dev:https

# Option 2: Docker
docker-compose -f docker-compose.frontend-https.yml up
```

### 3. Test Dynamic Subdomains

```bash
# Test main domain
curl -k https://localhost:3000/

# Test dynamic subdomains
curl -k https://project-test.localhost:3000/
curl -k https://project-customer123.localhost:3000/plan
curl -k https://project-customer456.localhost:3000/offer
```

## 📁 File Structure

```text
statex-website/
├── certificates/                    # SSL certificates directory
│   ├── localhost-cert.pem         # Wildcard certificate
│   └── localhost-key.pem          # Private key
├── frontend/
│   ├── scripts/
│   │   └── dev-https.js           # HTTPS development server
│   ├── Dockerfile.https           # HTTPS-enabled Docker image
│   └── package.json               # Updated with HTTPS scripts
├── docker-compose.frontend-https.yml  # Docker Compose for HTTPS
└── scripts/
    └── setup-ssl-certificates.sh  # Certificate setup script
```

## 🔧 Configuration Details

### Development Certificates

- **Tool**: mkcert (for trusted local certificates)
- **Domain**: `*.localhost` (wildcard)
- **Location**: `statex-website/certificates/`
- **Expiry**: 3 years from generation date

### DNS Configuration

Add to `/etc/hosts`:

```text
127.0.0.1 *.localhost
```

### Port Configuration

- **HTTP**: Port 3000 (default Next.js)
- **HTTPS**: Port 3000 (with SSL termination)

## 🐳 Docker Support

### Development with Docker

```bash
# Start HTTPS frontend
docker-compose -f docker-compose.frontend-https.yml up

# Or build and run manually
docker build -f frontend/Dockerfile.https -t statex-frontend-https .
docker run -p 3000:3000 -v $(pwd)/certificates:/app/certificates statex-frontend-https
```

### Production Considerations

For production, replace mkcert certificates with:

- Let's Encrypt wildcard certificates
- Commercial wildcard certificates
- Certificate management tools (Certbot, etc.)

## 🛠️ Available Scripts

### npm Scripts

```bash
# Development
npm run dev              # HTTP development server
npm run dev:https        # HTTPS development server
npm run dev:https:docker # HTTPS for Docker environment

# Production
npm run build            # Build for production
npm run start            # Start production server
```

### Docker Scripts

```bash
# Development
docker-compose -f docker-compose.frontend-https.yml up

# Production
docker build -f frontend/Dockerfile.https -t statex-frontend-https .
```

## 🔍 Troubleshooting

### Common Issues

1. **Certificate not found**

   ```bash
   # Regenerate certificates
   ./scripts/setup-ssl-certificates.sh
   ```

2. **DNS not resolving**

   ```bash
   # Add wildcard DNS
   echo '127.0.0.1 *.localhost' | sudo tee -a /etc/hosts
   ```

3. **Port already in use**

   ```bash
   # Kill existing processes
   pkill -f "npm run dev"
   lsof -ti:3000 | xargs kill -9
   ```

4. **Docker volume issues**

   ```bash
   # Ensure certificates are mounted
   docker-compose -f docker-compose.frontend-https.yml down
   docker-compose -f docker-compose.frontend-https.yml up
   ```

### Debug Commands

```bash
# Test certificate validity
openssl x509 -in certificates/localhost-cert.pem -text -noout

# Test SSL connection
openssl s_client -connect localhost:3000 -servername localhost

# Check DNS resolution
nslookup project-test.localhost
```

## 🔒 Security Notes

### Development

- Certificates are self-signed but trusted by mkcert CA
- No browser warnings for localhost domains
- Perfect for development and testing

### Production

- Use trusted CA certificates (Let's Encrypt, commercial)
- Implement proper certificate rotation
- Monitor certificate expiration
- Use proper DNS configuration

## 📚 Additional Resources

- [mkcert Documentation](https://github.com/FiloSottile/mkcert)
- [Next.js HTTPS Configuration](https://nextjs.org/docs/advanced-features/custom-server)
- [Docker SSL Best Practices](https://docs.docker.com/engine/security/https/)
- [Let's Encrypt Wildcard Certificates](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge)

## ✅ Verification Checklist

- [ ] mkcert installed and CA installed
- [ ] Wildcard certificates generated
- [ ] DNS wildcard configured (`*.localhost`)
- [ ] HTTPS development server starts successfully
- [ ] Dynamic subdomains resolve correctly
- [ ] SSL certificates are trusted by browser
- [ ] Docker containers can access certificates
- [ ] All test URLs work with HTTPS

## 🎉 Result

After setup, you can create unlimited customer subdomains that work immediately with SSL:

- `https://project-{customerId}.localhost:3000/` - Main prototype page
- `https://project-{customerId}.localhost:3000/plan` - Development plan
- `https://project-{customerId}.localhost:3000/offer` - Service offer

All with automatic SSL certificates and no manual configuration required! 🚀
