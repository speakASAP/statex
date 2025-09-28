#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo -e "${YELLOW}Warning: .env file not found. Using default values.${NC}"
fi

# Set default values if not set in .env
BACKUP_DIR=${BACKUP_DIR:-"./database/backups"}
DB_USER=${DB_USER:-"statex"}
DB_NAME=${DB_NAME:-"statex_production"}
DB_CONTAINER=${DB_CONTAINER:-"statex_postgres"}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/backup_${DB_NAME}_${TIMESTAMP}.sql"

# Get the database password from environment or prompt for it
if [ -z "$DB_PASSWORD" ]; then
    read -s -p "Enter database password: " DB_PASSWORD
    echo ""
fi

echo -e "${YELLOW}Creating database backup...${NC}"
echo -e "Database: ${DB_NAME}"
echo -e "Backup file: ${BACKUP_FILE}"

# Create the backup
if docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_FILE"; then
    # Compress the backup
    gzip -f "$BACKUP_FILE"
    BACKUP_FILE="${BACKUP_FILE}.gz"
    
    # Set permissions
    chmod 600 "$BACKUP_FILE"
    
    echo -e "${GREEN}✅ Backup created successfully: ${BACKUP_FILE}${NC}"
    
    # List all backups
    echo -e "\n${YELLOW}Available backups:${NC}"
    ls -lh "$BACKUP_DIR" | grep -E 'backup_.*\.sql\.gz$'
    
    # Clean up old backups (keep last 7 days)
    echo -e "\n${YELLOW}Cleaning up old backups...${NC}"
    find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f -mtime +7 -delete -print
    
    echo -e "${GREEN}✅ Cleanup complete!${NC}"
else
    echo -e "${RED}❌ Backup failed!${NC}"
    rm -f "$BACKUP_FILE"  # Remove empty backup file if creation failed
    exit 1
fi
