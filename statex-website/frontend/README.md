# StateX Frontend Development

## Quick Start

The frontend is designed to run locally for faster development instead of in Docker.

### Prerequisites

- Node.js 23.11.0 or higher
- npm 11.5.2 or higher

### Starting the Frontend

1. **Using the dev-manage script (recommended):**
   ```bash
   cd /path/to/statex-platform
   ./dev-manage.sh frontend
   ```

2. **Manual start:**
   ```bash
   cd /path/to/statex-website/frontend
   npm install  # Only needed on first run
   npm run dev
   ```

### Access

- **Local:** http://localhost:3000
- **Network:** http://[your-ip]:3000

### Development Features

- Hot reload enabled
- TypeScript support
- Tailwind CSS
- Next.js 15.5.3 with Turbopack

### Environment

The frontend automatically loads environment variables from:
- `.env.local` (highest priority)
- `.env` (symlinked from parent directory)

### Stopping

Press `Ctrl+C` to stop the development server.

### Troubleshooting

- If port 3000 is in use, Next.js will automatically use the next available port
- Make sure all backend services are running before starting the frontend
- Check that the `.env` file exists and is properly configured

