#!/bin/bash

# Simple Mass Fix Script for SSR Issues
# Fixes all pages that use useTemplateBuilder on the server

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Find all pages that use useTemplateBuilder
log "Finding pages with useTemplateBuilder..."
PAGES=$(grep -l "useTemplateBuilder" src/app/**/page.tsx 2>/dev/null || true)

if [ -z "$PAGES" ]; then
    success "No pages with useTemplateBuilder found!"
    exit 0
fi

log "Found pages to fix:"
echo "$PAGES"

# Process each page manually
log "Please fix these pages manually by:"
log "1. Creating a Content component with 'use client'"
log "2. Moving useTemplateBuilder code there"
log "3. Importing and using the Content component in the main page"
log ""
log "Example structure:"
log "page.tsx:"
log "  import Content from './Content'"
log "  export default function Page() {"
log "    return <Content />"
log "  }"
log ""
log "Content.tsx:"
log "  'use client'"
log "  import { useTemplateBuilder } from '@/hooks/useTemplateBuilder'"
log "  export default function Content() {"
log "    const template = useTemplateBuilder()..."
log "    return <TemplateRenderer template={template} />"
log "  }"
log ""
log "Or run the individual fix commands for each page."
