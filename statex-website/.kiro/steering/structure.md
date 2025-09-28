# StateX Project Structure

## Root Level Organization

```
statex-website/
├── frontend/           # Next.js application (port 3000)
├── backend/           # Optional Fastify API (port 4000)
├── services/          # Python microservices
├── docs/             # Documentation and content
├── scripts/          # Deployment and utility scripts
├── config/           # Configuration files
└── shared/           # Shared utilities
```

## Frontend Structure (`frontend/`)

```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── [lang]/       # Internationalized routes
│   │   ├── api/          # API routes
│   │   ├── blog/         # Blog pages
│   │   ├── services/     # Service pages
│   │   └── ...           # Other page routes
│   ├── components/       # React components
│   │   ├── ui/           # Base UI components
│   │   ├── forms/        # Form components
│   │   ├── layout/       # Layout components
│   │   └── features/     # Feature-specific components
│   ├── lib/              # Utility functions and services
│   │   ├── content/      # Content management utilities
│   │   ├── services/     # API service clients
│   │   ├── utils/        # General utilities
│   │   └── validation/   # Zod schemas
│   ├── styles/           # CSS and styling
│   ├── types/            # TypeScript type definitions
│   ├── hooks/            # Custom React hooks
│   ├── contexts/         # React contexts
│   └── config/           # Configuration files
├── public/               # Static assets
├── docs/                 # Frontend-specific documentation
└── scripts/              # Build and utility scripts
```

## Backend Structure (`backend/`)

```
backend/
├── src/
│   ├── routes/           # API route handlers
│   ├── services/         # Business logic services
│   ├── middleware/       # Custom middleware
│   ├── types/            # TypeScript types
│   └── server.ts         # Main server file
├── prisma/               # Database schema and migrations
└── test/                 # Backend tests
```

## Microservices Structure (`services/`)

```
services/
├── submission-service/   # Form handling (port 8002)
│   ├── app/
│   │   └── main.py      # FastAPI application
│   ├── Dockerfile
│   └── requirements.txt
├── content-service/      # Content management (port 8009)
└── user-portal/         # User management (port 8006)
```

## Documentation Structure (`docs/`)

```
docs/
├── content/              # Website content
│   ├── blog/            # Blog posts and templates
│   ├── pages/           # Static page content
│   └── services/        # Service descriptions
├── design/              # Design system documentation
│   ├── mockups/         # HTML mockups
│   └── components/      # Component specifications
├── development/         # Technical documentation
└── business/            # Business documentation
```

## Key Conventions

### File Naming
- **Components**: PascalCase (`UserProfile.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Pages**: kebab-case for routes (`free-prototype/`)
- **API routes**: kebab-case (`api/user-submissions/`)

### Import Aliases
```typescript
// Configured in tsconfig.json and next.config.js
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { UserService } from '@/lib/services'
```

### Component Organization
- **UI Components**: Reusable, unstyled base components
- **Feature Components**: Business logic components
- **Layout Components**: Page structure and navigation
- **Form Components**: Form-specific implementations

### API Structure
- **Frontend API Routes**: `/api/*` (Next.js API routes)
- **Submission Service**: `/api/submissions/*`, `/api/forms/*`
- **User Portal**: `/api/users/*`, `/api/sessions/*`
- **Content Service**: `/api/content/*`, `/api/blog/*`

### Environment Files
- `.env.development` - Development configuration
- `.env.production` - Production configuration  
- `.env` - Symlink to active environment
- `.env.example` - Template file

### Testing Structure
```
src/
├── components/
│   └── __tests__/       # Component tests
├── lib/
│   └── __tests__/       # Utility tests
└── test/
    ├── setup.ts         # Test configuration
    ├── fixtures/        # Test data
    └── e2e/            # End-to-end tests
```

### Docker Organization
- `Dockerfile.dev` - Development builds
- `Dockerfile.prod` - Production builds
- `Dockerfile.fast` - Optimized builds
- `docker-compose.yml` - Production compose
- `docker-compose.development.yml` - Development compose

### Content Management
- Markdown-first approach for blog and static content
- File-based content in `docs/content/`
- Multilingual support with language-specific folders
- SEO optimization with frontmatter metadata