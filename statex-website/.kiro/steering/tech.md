# StateX Technology Stack

## Frontend Stack
- **Framework**: Next.js 15.5 with App Router
- **Language**: TypeScript 5.9.2
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Headless UI, Heroicons, Lucide React
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **Animation**: Framer Motion
- **Build Tool**: Turbopack (preferred) with Webpack fallback

## Backend Stack
- **Runtime**: Node.js 23.11.0+
- **Framework**: Fastify 5.6.0
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Queue**: BullMQ with Redis
- **File Storage**: MinIO/S3 compatible

## Microservices (Python)
- **Framework**: FastAPI
- **Language**: Python 3.x
- **Services**:
  - Submission Service (port 8002): Form handling and file uploads
  - User Portal (port 8006): User management and authentication
  - Content Service (port 8009): Content management and blog

## Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt with Certbot
- **Monitoring**: Health checks and logging

## Development Tools
- **Testing**: Vitest for unit/integration tests, Playwright for E2E
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier with Tailwind plugin
- **Package Management**: npm with workspaces

## Common Commands

### Development
```bash
# Start optimized development (recommended)
./dev-manage.sh start

# Start individual services
npm run dev:frontend
npm run dev:backend

# Frontend only
cd frontend && npm run dev

# Python services
cd services/submission-service
uvicorn main:app --reload --host 0.0.0.0 --port 8002
```

### Building
```bash
# Build all services
npm run build

# Frontend with Turbopack (preferred)
cd frontend && npm run build

# Frontend with Webpack (fallback)
cd frontend && npm run build:webpack
```

### Testing
```bash
# Run all tests
npm test

# Frontend tests
cd frontend && npm run test

# Watch mode
cd frontend && npm run test:watch

# Coverage
cd frontend && npm run test:coverage
```

### Docker
```bash
# Development environment
docker compose -f docker-compose.development.yml up

# Production environment
docker compose up -d

# View logs
docker compose logs -f frontend
```

## Environment Configuration
- Uses symlinked .env files (.env.development, .env.production)
- Environment detection via file content and symlink resolution
- Separate configs for different deployment scenarios

## Key Dependencies
- **React**: 19.1.1
- **Next.js**: 15.5 with Turbopack
- **Tailwind**: 3.4.17 with custom design tokens
- **Fastify**: 5.6.0 with CORS and rate limiting
- **Prisma**: 6.15.0 for database management
- **FastAPI**: Latest for Python microservices