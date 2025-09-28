# SSL Certificate Setup for statex.cz

This document describes the SSL certificate generation setup for statex.cz and www.statex.cz domains using nginx-proxy and Let's Encrypt.

## Overview

The SSL setup consists of two main services:
- **nginx-proxy**: Handles SSL termination and routes requests to the appropriate backend services
- **nginx-letsencrypt**: Automatically generates and renews Let's Encrypt SSL certificates

## Architecture

```
Internet → nginx-proxy (SSL termination) → Frontend/Backend services
                ↓
        nginx-letsencrypt (certificate management)
```

## Services Configuration

### nginx-proxy
- **Image**: `nginxproxy/nginx-proxy:alpine`
- **Ports**: 80 (HTTP), 443 (HTTPS)
- **Volumes**: 
  - SSL certificates (`ssl_certs`)
  - Virtual host configurations (`ssl_vhost`)
  - ACME challenge files (`ssl_html`)
- **Environment**: 
  - `DEFAULT_HOST=statex.cz`
  - `ALLOW_SELF_SIGNED=false`

### nginx-letsencrypt
- **Image**: `nginxproxy/acme-companion`
- **Environment**:
  - `NGINX_PROXY_CONTAINER=statex_nginx_proxy`
  - `DEFAULT_EMAIL=admin@statex.cz`
  - `SSL_MODE=production`
- **Volumes**: Same as nginx-proxy with read-write access

## Domain Configuration

### Frontend Service
- **VIRTUAL_HOST**: `statex.cz,www.statex.cz`
- **LETSENCRYPT_HOST**: `statex.cz,www.statex.cz`
- **LETSENCRYPT_EMAIL**: `admin@statex.cz`

### Backend Service
- **VIRTUAL_HOST**: `api.statex.cz`
- **LETSENCRYPT_HOST**: `api.statex.cz`
- **LETSENCRYPT_EMAIL**: `admin@statex.cz`

## Deployment

### 1. Start Services
```bash
# Deploy with SSL certificate generation
./scripts/deploy-ssl.sh
```

### 2. Monitor Certificate Generation
The script will automatically monitor the certificate generation process and wait for completion.

### 3. Test SSL Certificates
```bash
# Test HTTPS connectivity and certificates
./scripts/test-ssl.sh
```

## SSL Data Volumes

- **ssl_certs**: Stores SSL certificates and private keys
- **ssl_vhost**: Stores nginx virtual host configurations
- **ssl_html**: Stores ACME challenge files for Let's Encrypt verification
- **ssl_acme**: Stores Let's Encrypt ACME data

## Certificate Renewal

Let's Encrypt certificates are automatically renewed by the nginx-letsencrypt service. The service:
- Monitors certificate expiration dates
- Automatically requests renewals before expiration
- Reloads nginx configuration after successful renewal

## Troubleshooting

### Check Service Logs
```bash
# nginx-proxy logs
docker logs statex_nginx_proxy

# nginx-letsencrypt logs
docker logs statex_nginx_letsencrypt
```

### Check Certificate Status
```bash
# List certificates in container
docker exec statex_nginx_letsencrypt ls -la /etc/nginx/certs/

# Test nginx configuration
docker exec statex_nginx_proxy nginx -t
```

### Common Issues

1. **Port Conflicts**: Ensure ports 80 and 443 are not used by other services
2. **Network Issues**: Verify the `app-network` exists and is properly configured
3. **DNS Issues**: Ensure domain names resolve to the correct server IP
4. **Rate Limiting**: Let's Encrypt has rate limits; avoid frequent certificate requests

## Security Considerations

- SSL certificates are automatically generated and renewed
- HTTP traffic is automatically redirected to HTTPS
- Modern TLS protocols (TLS 1.2, TLS 1.3) are enforced
- Strong cipher suites are configured
- HSTS headers can be enabled after testing

## Testing

After deployment, test the following:
- [ ] HTTP to HTTPS redirects work
- [ ] HTTPS connections are successful
- [ ] SSL certificates are valid and trusted
- [ ] Both statex.cz and www.statex.cz work
- [ ] API endpoint (api.statex.cz) is accessible

## Notes

- This setup is independent of the existing sad-tresinky-cetechovice.cz configuration
- Certificates are generated specifically for statex.cz domains
- The setup uses production Let's Encrypt servers (not staging)
- Automatic renewal ensures continuous SSL coverage
