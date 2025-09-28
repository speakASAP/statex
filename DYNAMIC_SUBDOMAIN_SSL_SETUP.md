# Dynamic Subdomain SSL Setup Guide

## 🎯 Overview

This guide shows how to set up dynamic subdomains with SSL certificates for the StateX platform, allowing new customer subdomains to be created automatically without manual DNS configuration.

## 🚀 Quick Start (Development)

### 1. Install mkcert

```bash
# macOS
brew install mkcert

# Linux
sudo apt install libnss3-tools
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
chmod +x mkcert
sudo mv mkcert /usr/local/bin/

# Install the local CA
mkcert -install
```

### 2. Generate Wildcard Certificate

```bash
# Create certificates directory
mkdir -p /Users/sergiystashok/Documents/GitHub/statex/certificates

# Generate wildcard certificate
mkcert -key-file certificates/localhost-key.pem \
       -cert-file certificates/localhost-cert.pem \
       "*.localhost" "localhost"
```

### 3. Set up Wildcard DNS

Add to `/etc/hosts`:

```text
127.0.0.1 *.localhost
```

### 4. Start HTTPS Development Server

```bash
cd statex-website/frontend
npm run dev:https
```

### 5. Test Dynamic Subdomains

```bash
# These will all work automatically:
curl -k https://project-customer1.localhost:3000/
curl -k https://project-customer2.localhost:3000/plan
curl -k https://project-customer3.localhost:3000/offer
```

## 🏭 Production Setup

### 1. DNS Configuration

Set up wildcard DNS record:

```text
*.yourdomain.com → YOUR_SERVER_IP
```

### 2. SSL Certificate Setup

```bash
# Run the setup script
./scripts/setup-wildcard-ssl.sh
```

### 3. Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name *.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔧 Architecture

### How It Works

1. **Wildcard DNS**: `*.localhost` resolves to `127.0.0.1`
2. **Wildcard SSL**: Single certificate covers all subdomains
3. **Next.js Middleware**: Detects subdomain and routes accordingly
4. **Dynamic Content**: Each subdomain shows customer-specific content

### Subdomain Patterns

- `project-{customerId}.localhost:3000/` - Main prototype page
- `project-{customerId}.localhost:3000/plan` - Development plan
- `project-{customerId}.localhost:3000/offer` - Service offer

### Benefits

✅ **No Manual DNS Configuration** - New subdomains work immediately
✅ **Automatic SSL** - All subdomains are HTTPS by default
✅ **Scalable** - Supports unlimited subdomains
✅ **Development Friendly** - Works locally with mkcert
✅ **Production Ready** - Uses Let's Encrypt in production

## 🛠️ Troubleshooting

### Common Issues

1. **Certificate Warnings**: Install mkcert CA with `mkcert -install`
2. **DNS Not Resolving**: Check `/etc/hosts` has `*.localhost` entry
3. **Port Conflicts**: Ensure port 3000 is available
4. **HTTPS Not Working**: Verify certificate files exist and are readable

### Debug Commands

```bash
# Test DNS resolution
nslookup project-test.localhost

# Test SSL certificate
openssl s_client -connect project-test.localhost:3000 -servername project-test.localhost

# Check certificate details
openssl x509 -in certificates/localhost-cert.pem -text -noout
```

## 📚 Additional Resources

- [mkcert Documentation](https://github.com/FiloSottile/mkcert)
- [Let's Encrypt Wildcard Certificates](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Nginx SSL Configuration](https://nginx.org/en/docs/http/configuring_https_servers.html)

## 🎉 Result

After setup, you can create unlimited customer subdomains that work immediately:

- `https://project-customer123.localhost:3000/`
- `https://project-customer456.localhost:3000/plan`
- `https://project-customer789.localhost:3000/offer`

All with automatic SSL certificates and no manual configuration required!
