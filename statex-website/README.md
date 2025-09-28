# StateX Website

This repository contains the frontend website and backend API for StateX, built with Next.js and Node.js/Fastify.

## Architecture

This repository serves the main StateX website at `https://statex.cz` and manages core business services including form submission, user management, and content management. It integrates with the StateX Platform microservices at `https://api.statex.cz` for AI services and notifications.

## Components

- **Frontend** (3000): Next.js application with TypeScript
- **Backend** (4000): Node.js/Fastify API (optional - can use platform services)
- **Submission Service** (8002): Form submission and file handling - **PRIMARY MANAGER**
- **User Portal** (8006): User management and authentication - **PRIMARY MANAGER**
- **Content Service** (8009): Content management and blog - **PRIMARY MANAGER**
- **Content**: Blog posts, pages, and static content
- **Design System**: Component library and design tokens
- **Documentation**: Content management and development docs

## Quick Start

### ⚡ Optimized Development (2-3 minutes)

StateX Website now uses **volume mounts for instant startup and hot reload**:

```bash
# Quick start with optimized development environment
cd statex-platform
./dev-manage.sh start

# Or start only website services
./dev-manage.sh dev frontend
./dev-manage.sh dev submission-service
./dev-manage.sh dev user-portal
./dev-manage.sh dev content-service

# Access your services:
# - Website: http://localhost:3000
# - Submission Service: http://localhost:8002
# - User Portal: http://localhost:8006
# - Content Service: http://localhost:8009
```

### Local Development Setup

```bash
# For individual service development
cd frontend
../../setup-dev.sh  # Sets up Node.js environment
npm run dev

# For Python services
cd services/submission-service
../../setup-dev.sh  # Sets up Python environment
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8002
```

### Legacy Development (Docker)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or use Docker
docker compose -f docker-compose.development.yml up
```

### Production

```bash
# Build and start
docker compose up -d
```

## Environment Variables

- `NEXT_PUBLIC_API_URL`: API endpoint (default: <https://api.statex.cz>)
- `NEXT_PUBLIC_BASE_URL`: Website URL (default: <https://statex.cz>)
- `NODE_ENV`: Environment (development/production)

## Project Structure

```text
frontend/
├── src/
│   ├── app/          # Next.js app router pages
│   ├── components/   # React components
│   ├── lib/          # Utility functions
│   └── styles/       # CSS and styling
├── public/           # Static assets
├── docs/             # Documentation
└── scripts/          # Build and utility scripts

backend/              # Optional backend API
├── src/
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   └── server.ts     # Main server file
└── prisma/           # Database schema

services/             # Website microservices
├── submission-service/ # Form submission and file handling (port 8002)
├── user-portal/      # User management and authentication (port 8006)
└── content-service/  # Content management and blog (port 8009)

docs/                 # Content and documentation
├── content/          # Blog posts and pages
├── design/           # Design system docs
└── development/      # Development docs
```

## Deployment

The website can be deployed in two ways:

### Option 1: Integrated with StateX Platform

- Deploy as part of the full StateX Platform stack
- Uses platform's microservices for backend
- Managed by `statex-platform` repository

### Option 2: Standalone Deployment

- Deploy independently with its own backend
- Uses `docker-compose.production.yml`
- Requires external database and Redis

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Docker Commands

```bash
# Development
docker compose -f docker-compose.development.yml up

# Production
docker compose up -d

# View logs
docker compose logs -f frontend
```

## Integration

This website integrates with:

- **StateX Platform API**: Backend services and microservices
- **StateX Infrastructure**: Nginx reverse proxy and SSL

## Content Management

Content is managed in the `docs/content/` directory:

- Blog posts
- Service pages
- Static pages
- SEO content

## Design System

The design system is documented in `docs/design/` and implemented in `frontend/src/components/`.

## Support

For issues and questions, please refer to the main StateX Platform documentation or create an issue in the appropriate repository.
