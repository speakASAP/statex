# Reverse Proxy Setup for statex.cz

This guide explains how to set up a reverse proxy to route traffic from the main ports (80/443) to the statex services running on ports 8080/8443, avoiding conflicts with the existing sad-tresinky-cetechovice.cz setup.

## 🚨 Problem

The existing sad-tresinky-cetechovice.cz service is already using ports 80 and 443, causing conflicts when trying to start the statex nginx-proxy service.

## 🔧 Solution

We've modified the docker compose to use ports 8080/8443 and created a reverse proxy configuration that routes traffic from the main ports to these internal ports.

## 📁 Configuration Files

### 1. Modified docker-compose.production.yml
- nginx-proxy now uses ports 8080:80 and 8443:443
- This avoids conflicts with existing services

### 2. New nginx/statex-reverse-proxy.conf
- Routes traffic from ports 80/443 to 8080/8443
- Handles SSL termination at the main nginx level
- Proxies ACME challenges for Let's Encrypt

## 🚀 Deployment Steps

### Step 1: Deploy Statex Services
```bash
# This will now work without port conflicts
./scripts/deploy-ssl.sh
```

### Step 2: Configure Main Nginx (if needed)
If you have a main nginx service running on the host, include the reverse proxy configuration:

```bash
# Copy the reverse proxy config to your main nginx
sudo cp nginx/statex-reverse-proxy.conf /etc/nginx/sites-available/statex
sudo ln -s /etc/nginx/sites-available/statex /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 3: Alternative - Use Docker Host Network
If you prefer to use the host network directly, modify docker-compose.production.yml:

```yaml
nginx-proxy:
  network_mode: "host"
  ports: []  # Remove port mappings when using host network
```

## 🔍 How It Works

1. **External traffic** hits ports 80/443 (main nginx or reverse proxy)
2. **Reverse proxy** routes traffic to statex services on ports 8080/8443
3. **Statex nginx-proxy** handles SSL termination and routing
4. **Let's Encrypt** generates certificates through the proxy chain

## 📊 Port Mapping

| Service | External Port | Internal Port | Purpose |
|---------|---------------|---------------|---------|
| Main Nginx | 80, 443 | - | Reverse proxy, SSL termination |
| Statex nginx-proxy | 8080, 8443 | 80, 443 | Internal routing, ACME challenges |
| Frontend | - | 3000 | Web application |
| Backend | - | 4000 | API services |

## ✅ Benefits

- ✅ **No port conflicts** with existing services
- ✅ **SSL certificates** generated correctly
- ✅ **Clean separation** between services
- ✅ **Easy maintenance** and debugging
- ✅ **Scalable architecture** for future services

## 🔧 Testing

After deployment, test the setup:

```bash
# Test HTTP redirect
curl -I http://statex.cz

# Test HTTPS (after certificates are generated)
curl -I https://statex.cz

# Test internal ports
curl -I http://localhost:8080
curl -I http://localhost:8443
```

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Check what's using the ports
sudo ss -tlnp | grep :80
sudo ss -tlnp | grep :443
sudo ss -tlnp | grep :8080
sudo ss -tlnp | grep :8443
```

### Reverse Proxy Not Working
```bash
# Check main nginx configuration
sudo nginx -t

# Check statex services
docker compose -f docker-compose.production.yml ps

# Check logs
docker logs statex_nginx_proxy
```

### SSL Certificate Issues
```bash
# Check Let's Encrypt logs
docker logs statex_nginx_letsencrypt

# Verify certificate files
docker exec statex_nginx_letsencrypt ls -la /etc/nginx/certs/
```

## 📝 Notes

- The reverse proxy approach maintains separation between services
- SSL certificates are generated through the proxy chain
- Both sad-tresinky-cetechovice.cz and statex.cz can coexist
- The setup is production-ready and scalable
