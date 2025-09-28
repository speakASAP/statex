#!/bin/bash

# Mass Fix Script for SSR Issues
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

log "Found $(echo "$PAGES" | wc -l) pages to fix:"
echo "$PAGES"

# Process each page
for page in $PAGES; do
    log "Processing: $page"
    
    # Extract page name and path
    PAGE_DIR=$(dirname "$page")
    PAGE_NAME=$(basename "$page" .tsx)
    
    # Create content component path
    CONTENT_COMPONENT="$PAGE_DIR/${PAGE_NAME}Content.tsx"
    
    # Check if content component already exists
    if [ -f "$CONTENT_COMPONENT" ]; then
        warning "Content component already exists: $CONTENT_COMPONENT"
        continue
    fi
    
    # Extract template code from page
    TEMPLATE_CODE=$(sed -n '/const template = useTemplateBuilder/,/\.build();/p' "$page" | head -n -1)
    
    if [ -z "$TEMPLATE_CODE" ]; then
        warning "No template code found in $page"
        continue
    fi
    
    # Create content component
    log "Creating content component: $CONTENT_COMPONENT"
    
    cat > "$CONTENT_COMPONENT" << EOF
'use client';

import { useTemplateBuilder } from '@/hooks/useTemplateBuilder';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';

export default function ${PAGE_NAME}Content() {
  const template = useTemplateBuilder()
$TEMPLATE_CODE
    .build();

  return <TemplateRenderer template={template} />;
}
EOF
    
    # Update main page
    log "Updating main page: $page"
    
    # Remove useTemplateBuilder import
    sed -i '/import.*useTemplateBuilder/d' "$page"
    sed -i '/import.*TemplateRenderer/d' "$page"
    
    # Add content component import
    sed -i "/import.*HeroSpacer/a import ${PAGE_NAME}Content from './${PAGE_NAME}Content';" "$page"
    
    # Replace template code with content component
    sed -i "/const template = useTemplateBuilder/,/\.build();/c\  return (\n    <>\n      <HeroSpacer />\n      <${PAGE_NAME}Content />\n    <>\n  );" "$page"
    
    # Remove return statement if it exists
    sed -i '/return (/,/);/d' "$page"
    
    # Add proper return statement
    sed -i "/export default function/a \  return (\n    <>\n      <HeroSpacer />\n      <${PAGE_NAME}Content />\n    <>\n  );" "$page"
    
    success "Fixed: $page"
done

success "All pages have been processed!"
log "You can now run: npm run build"
