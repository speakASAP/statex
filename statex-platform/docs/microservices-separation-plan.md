# StateX Microservices Separation Plan

## Current State
- `statex-website` - Frontend + Backend + Nginx + Let's Encrypt
- `statex-platform` - Microservices platform
- `statex-infrastructure` - Empty

## Target Architecture

### 1. statex-website (Frontend Only)
```
statex-website/
├── frontend/           # Next.js application
├── docker-compose.yml  # Website-specific services
├── .env.example
└── README.md
```

### 2. statex-platform (Microservices + API Gateway)
```
statex-platform/
├── services/           # All microservices
├── web/nginx/          # API Gateway nginx
├── infrastructure/     # Kubernetes configs
├── docker-compose.yml  # Platform services
└── scripts/           # Deployment scripts
```

### 3. statex-infrastructure (Nginx + SSL)
```
statex-infrastructure/
├── nginx/              # Main nginx configs
├── letsencrypt/        # SSL certificates
├── ssl/               # SSL scripts
├── docker-compose.yml  # Infrastructure services
└── scripts/           # Infrastructure scripts
```

## Migration Steps

### Step 1: Move Infrastructure Components
Move from `statex-website` to `statex-infrastructure`:
- `nginx/` directory
- `letsencrypt/` directory  
- `ssl/` directory
- `webroot/` directory
- `logs/` directory
- Infrastructure scripts

### Step 2: Clean Up statex-website
Remove from `statex-website`:
- `nginx/` directory
- `letsencrypt/` directory
- `ssl/` directory
- `webroot/` directory
- `logs/` directory
- Infrastructure scripts
- `backend/` directory (integrate into platform)

### Step 3: Update statex-platform
- Add website frontend service
- Update API Gateway configuration
- Add website deployment scripts

### Step 4: Update statex-infrastructure
- Create nginx configuration for all services
- Set up Let's Encrypt integration
- Create deployment scripts

## Service Routing

### Nginx Routing (statex-infrastructure)
```
statex.cz → statex-website frontend
api.statex.cz → statex-platform API Gateway
www.statex.cz → redirect to statex.cz
```

### API Gateway Routing (statex-platform)
```
/api/* → Microservices
/health → Health checks
/metrics → Prometheus
```

## Next Steps
1. Move infrastructure components
2. Clean up website repository
3. Update platform configuration
4. Test integration
5. Deploy to production
