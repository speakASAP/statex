#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f config/defaults.env ]; then
    set -a
    source config/defaults.env
    set +a
fi

# Set default VIRTUAL_HOST if not provided
VIRTUAL_HOST=${VIRTUAL_HOST:-statex.cz}
SSL_VOLUME_NAME="${VIRTUAL_HOST}_ssl_data"

echo -e "${BLUE}🔐 StateX SSL Certificate Management${NC}"
echo -e "${BLUE}===================================${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

# Function to show SSL status
show_status() {
    echo -e "${YELLOW}📊 SSL Certificate Status:${NC}"
    
    if docker volume inspect $SSL_VOLUME_NAME >/dev/null 2>&1; then
        echo -e "${GREEN}✅ SSL volume exists${NC}"
        
        # Check what's in the volume
        echo -e "${YELLOW}📁 Contents of SSL volume:${NC}"
        docker run --rm -v $SSL_VOLUME_NAME:/ssl alpine ls -la /ssl 2>/dev/null || echo -e "${RED}❌ Cannot access SSL volume${NC}"
        
        # Check certificate validity
        echo -e "${YELLOW}🔍 Certificate validity:${NC}"
        docker run --rm -v $SSL_VOLUME_NAME:/ssl alpine sh -c "
            if [ -f /ssl/cert.pem ]; then
                openssl x509 -in /ssl/cert.pem -text -noout | grep -E '(Subject:|Not Before:|Not After:)'
            else
                echo 'No certificate found'
            fi
        " 2>/dev/null || echo -e "${RED}❌ Cannot read certificate${NC}"
    else
        echo -e "${RED}❌ SSL volume does not exist${NC}"
    fi
    
    # Check Let's Encrypt container status
    echo -e "${YELLOW}🔐 Let's Encrypt Container Status:${NC}"
    if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "statex_letsencrypt"; then
        echo -e "${GREEN}✅ Let's Encrypt container is running${NC}"
        docker ps --format "table {{.Names}}\t{{.Status}}" | grep "statex_letsencrypt"
    else
        echo -e "${RED}❌ Let's Encrypt container is not running${NC}"
    fi
    
    # Check local SSL directory
    echo -e "${YELLOW}📁 Local SSL Directory:${NC}"
    if [ -d "./ssl" ]; then
        echo -e "${GREEN}✅ Local SSL directory exists${NC}"
        ls -la ./ssl/ 2>/dev/null || echo -e "${RED}❌ Cannot list SSL directory${NC}"
    else
        echo -e "${YELLOW}⚠️  Local SSL directory does not exist${NC}"
    fi
    
    # Check Let's Encrypt directory
    echo -e "${YELLOW}📁 Let's Encrypt Directory:${NC}"
    if [ -d "./letsencrypt" ]; then
        echo -e "${GREEN}✅ Let's Encrypt directory exists${NC}"
        ls -la ./letsencrypt/ 2>/dev/null || echo -e "${RED}❌ Cannot list Let's Encrypt directory${NC}"
    else
        echo -e "${YELLOW}⚠️  Let's Encrypt directory does not exist${NC}"
    fi
}

# Function to backup SSL certificates
backup_ssl() {
    local backup_dir=${1:-"./ssl-backup"}
    
    echo -e "${YELLOW}💾 Backing up SSL certificates to $backup_dir...${NC}"
    
    mkdir -p "$backup_dir"
    
    # Backup from Docker volume
    if docker volume inspect $SSL_VOLUME_NAME >/dev/null 2>&1; then
        echo -e "${YELLOW}📦 Backing up from Docker volume...${NC}"
        docker run --rm -v $SSL_VOLUME_NAME:/ssl -v "$(pwd)/$backup_dir:/backup" alpine sh -c "
            if [ -f /ssl/cert.pem ] && [ -f /ssl/key.pem ]; then
                cp /ssl/cert.pem /backup/cert.pem &&
                cp /ssl/key.pem /backup/key.pem &&
                chmod 644 /backup/cert.pem &&
                chmod 600 /backup/key.pem &&
                echo 'SSL certificates backed up successfully'
            else
                echo 'No SSL certificates found in volume'
                exit 1
            fi
        "
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ SSL certificates backed up from Docker volume to $backup_dir${NC}"
        else
            echo -e "${RED}❌ Failed to backup from Docker volume${NC}"
        fi
    fi
    
    # Backup from local SSL directory
    if [ -d "./ssl" ]; then
        echo -e "${YELLOW}📁 Backing up from local SSL directory...${NC}"
        if [ -f "./ssl/cert.pem" ] && [ -f "./ssl/key.pem" ]; then
            cp "./ssl/cert.pem" "$backup_dir/cert-local.pem"
            cp "./ssl/key.pem" "$backup_dir/key-local.pem"
            chmod 644 "$backup_dir/cert-local.pem"
            chmod 600 "$backup_dir/key-local.pem"
            echo -e "${GREEN}✅ Local SSL certificates backed up to $backup_dir${NC}"
        else
            echo -e "${YELLOW}⚠️  No local SSL certificates found${NC}"
        fi
    fi
}

# Function to restore SSL certificates
restore_ssl() {
    local backup_dir=${1:-"./ssl-backup"}
    
    echo -e "${YELLOW}📥 Restoring SSL certificates from $backup_dir...${NC}"
    
    if [ ! -d "$backup_dir" ]; then
        echo -e "${RED}❌ Backup directory $backup_dir does not exist${NC}"
        exit 1
    fi
    
    # Create volume if it doesn't exist
    docker volume create $SSL_VOLUME_NAME 2>/dev/null || echo -e "${GREEN}✅ SSL volume already exists${NC}"
    
    # Restore to Docker volume
    if [ -f "$backup_dir/cert.pem" ] && [ -f "$backup_dir/key.pem" ]; then
        echo -e "${YELLOW}📦 Restoring to Docker volume...${NC}"
        docker run --rm -v $SSL_VOLUME_NAME:/ssl -v "$(pwd)/$backup_dir:/backup" alpine sh -c "
            cp /backup/cert.pem /ssl/cert.pem &&
            cp /backup/key.pem /ssl/key.pem &&
            chmod 644 /ssl/cert.pem &&
            chmod 600 /ssl/key.pem &&
            echo 'SSL certificates restored to volume successfully'
        "
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ SSL certificates restored to Docker volume${NC}"
        else
            echo -e "${RED}❌ Failed to restore to Docker volume${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Backup files not found in $backup_dir${NC}"
        exit 1
    fi
    
    # Restore to local SSL directory
    echo -e "${YELLOW}📁 Restoring to local SSL directory...${NC}"
    mkdir -p "./ssl"
    cp "$backup_dir/cert.pem" "./ssl/cert.pem"
    cp "$backup_dir/key.pem" "./ssl/key.pem"
    chmod 644 "./ssl/cert.pem"
    chmod 600 "./ssl/key.pem"
    echo -e "${GREEN}✅ SSL certificates restored to local directory${NC}"
}

# Function to initialize SSL volume
init_ssl_volume() {
    echo -e "${YELLOW}🔐 Initializing SSL volume...${NC}"
    
    # Create volume if it doesn't exist
    docker volume create $SSL_VOLUME_NAME 2>/dev/null || echo -e "${GREEN}✅ SSL volume already exists${NC}"
    
    # Check if we have local SSL certificates (support both naming conventions)
    if [ -f "ssl/fullchain.pem" ] && [ -f "ssl/privkey.pem" ]; then
        echo -e "${GREEN}✅ Local SSL certificates found (Let's Encrypt format)${NC}"
        
        # Create a temporary container to copy files to the volume
        docker run --rm -v $SSL_VOLUME_NAME:/ssl -v "$(pwd)/ssl:/local-ssl" alpine sh -c "
            cp /local-ssl/fullchain.pem /ssl/fullchain.pem &&
            cp /local-ssl/privkey.pem /ssl/privkey.pem &&
            chmod 644 /ssl/fullchain.pem &&
            chmod 600 /ssl/privkey.pem &&
            echo 'SSL certificates copied to volume successfully'
        "
    elif [ -f "ssl/cert.pem" ] && [ -f "ssl/key.pem" ]; then
        echo -e "${GREEN}✅ Local SSL certificates found (legacy format)${NC}"
        
        # Create a temporary container to copy files to the volume
        docker run --rm -v $SSL_VOLUME_NAME:/ssl -v "$(pwd)/ssl:/local-ssl" alpine sh -c "
            cp /local-ssl/cert.pem /ssl/cert.pem &&
            cp /local-ssl/key.pem /ssl/key.pem &&
            chmod 644 /ssl/cert.pem &&
            chmod 600 /ssl/key.pem &&
            echo 'SSL certificates copied to volume successfully'
        "
        
        echo -e "${GREEN}✅ SSL certificates copied to volume${NC}"
    else
        echo -e "${YELLOW}⚠️  No local SSL certificates found${NC}"
        echo -e "${YELLOW}Generating new SSL certificates in volume...${NC}"
        
        # Generate certificates directly in the volume
        docker run --rm -v $SSL_VOLUME_NAME:/ssl alpine sh -c "
            apk add --no-cache openssl &&
            openssl genrsa -out /ssl/key.pem 2048 &&
            openssl req -new -key /ssl/key.pem -out /ssl/cert.csr -subj '/C=CZ/ST=Prague/L=Prague/O=StateX/CN=statex.cz/CN=*.statex.cz' &&
            openssl x509 -req -in /ssl/cert.csr -signkey /ssl/key.pem -out /ssl/cert.pem -days 365 &&
            chmod 600 /ssl/key.pem &&
            chmod 644 /ssl/cert.pem &&
            rm /ssl/cert.csr &&
            echo 'SSL certificates generated in volume successfully'
        "
        
        echo -e "${GREEN}✅ SSL certificates generated in volume${NC}"
    fi
    
    echo -e "\n${GREEN}🎉 SSL volume initialization completed!${NC}"
    echo -e "${YELLOW}📁 SSL certificates are now stored in Docker volume: ${GREEN}$SSL_VOLUME_NAME${NC}"
    echo -e "${YELLOW}🔄 You can rebuild containers without losing SSL certificates${NC}"
}

# Function to regenerate SSL certificates
regenerate_ssl() {
    echo -e "${YELLOW}🔄 Regenerating SSL certificates...${NC}"
    
    # Create volume if it doesn't exist
    docker volume create $SSL_VOLUME_NAME 2>/dev/null || echo -e "${GREEN}✅ SSL volume already exists${NC}"
    
    docker run --rm -v $SSL_VOLUME_NAME:/ssl alpine sh -c "
        apk add --no-cache openssl &&
        openssl genrsa -out /ssl/key.pem 2048 &&
        openssl req -new -key /ssl/key.pem -out /ssl/cert.csr -subj '/C=CZ/ST=Prague/L=Prague/O=StateX/CN=statex.cz/CN=*.statex.cz' &&
        openssl x509 -req -in /ssl/cert.csr -signkey /ssl/key.pem -out /ssl/cert.pem -days 365 &&
        chmod 600 /ssl/key.pem &&
        chmod 644 /ssl/cert.pem &&
        rm /ssl/cert.csr &&
        echo 'SSL certificates regenerated successfully'
    "
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ SSL certificates regenerated${NC}"
    else
        echo -e "${RED}❌ Failed to regenerate SSL certificates${NC}"
        exit 1
    fi
}

# Function to restart Let's Encrypt service
restart_letsencrypt() {
    echo -e "${YELLOW}🔄 Restarting Let's Encrypt service...${NC}"
    
    if docker ps --format "{{.Names}}" | grep -q "statex_letsencrypt"; then
        docker restart statex_letsencrypt
        echo -e "${GREEN}✅ Let's Encrypt service restarted${NC}"
    else
        echo -e "${YELLOW}⚠️  Let's Encrypt container not found. Starting services...${NC}"
        docker compose -f docker-compose.production.yml up -d letsencrypt
        echo -e "${GREEN}✅ Let's Encrypt service started${NC}"
    fi
}

# Function to show help
show_help() {
    echo -e "${YELLOW}Usage: $0 [options]${NC}"
    echo -e "\nOptions:"
    echo -e "  --status                    Show SSL certificate status"
    echo -e "  --init                      Initialize SSL volume with certificates"
    echo -e "  --backup [directory]        Backup SSL certificates (default: ./ssl-backup)"
    echo -e "  --restore [directory]       Restore SSL certificates (default: ./ssl-backup)"
    echo -e "  --regenerate                Regenerate SSL certificates"
    echo -e "  --restart-letsencrypt       Restart Let's Encrypt service"
    echo -e "  --help                      Show this help message"
    echo -e "\nExamples:"
    echo -e "  $0 --status                 # Show certificate status"
    echo -e "  $0 --init                   # Initialize SSL volume"
    echo -e "  $0 --backup                 # Backup to ./ssl-backup"
    echo -e "  $0 --backup ./my-ssl        # Backup to ./my-ssl"
    echo -e "  $0 --restore                # Restore from ./ssl-backup"
    echo -e "  $0 --restore ./my-ssl       # Restore from ./my-ssl"
    echo -e "  $0 --regenerate             # Generate new certificates"
    echo -e "  $0 --restart-letsencrypt    # Restart Let's Encrypt service"
}

# Main script execution
case "$1" in
    --status)
        show_status
        ;;
    --init)
        init_ssl_volume
        ;;
    --backup)
        backup_ssl "$2"
        ;;
    --restore)
        restore_ssl "$2"
        ;;
    --regenerate)
        regenerate_ssl
        ;;
    --restart-letsencrypt)
        restart_letsencrypt
        ;;
    --help|*)
        show_help
        ;;
esac

exit 0
