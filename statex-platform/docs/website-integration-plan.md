# StateX Website Integration Plan

## Current Setup Analysis

Your existing website has:
- **Frontend**: Next.js (port 3000)
- **Backend**: Fastify API (port 4000) 
- **Nginx**: Reverse proxy with SSL
- **Let's Encrypt**: SSL certificates
- **Database**: PostgreSQL + Redis

## Integration Strategy

### Phase 1: Separate Infrastructure
Create `statex-infrastructure` repository with:
- Nginx configurations
- Let's Encrypt setup
- SSL certificates
- Docker Compose files

### Phase 2: Separate Website
Create `statex-website` repository with:
- Frontend application
- Updated API endpoints
- Website-specific configurations

### Phase 3: Integrate with StateX Platform
- Add website service to StateX Platform
- Update nginx to proxy correctly
- Create deployment scripts

## Recommended Architecture

```
statex-infrastructure/     # Nginx, SSL, Let's Encrypt
statex-platform/          # Microservices platform  
statex-website/           # Website application
```

## Next Steps

1. Create infrastructure repository
2. Move nginx/letsencrypt configurations
3. Create website repository
4. Update StateX Platform
5. Test integration
6. Deploy to production

Would you like me to start implementing this plan?
