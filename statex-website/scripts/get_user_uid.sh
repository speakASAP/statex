#!/bin/bash

# Dynamic USER_UID resolver for StateX
# This script automatically determines the correct USER_UID for the current environment

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to get current user UID
get_current_uid() {
    if command -v id >/dev/null 2>&1; then
        id -u
    else
        # Fallback for systems without 'id' command
        echo "1000"
    fi
}

# Function to get environment-specific UID
get_env_uid() {
    local env_type=$1
    
    case "$env_type" in
        "production")
            # For production, try to get UID from environment or use default
            if [ -n "$PRODUCTION_USER_UID" ]; then
                echo "$PRODUCTION_USER_UID"
            elif [ -n "$USER_UID" ]; then
                echo "$USER_UID"
            else
                # Default production UID
                echo "1002"
            fi
            ;;
        "development"|*)
            # For development, always use current user's UID
            get_current_uid
            ;;
    esac
}

# Function to detect current environment
detect_environment() {
    if [ -L ".env" ]; then
        local target=$(readlink -f .env)
        if [[ "$target" == *".env.production" ]]; then
            echo "production"
        else
            echo "development"
        fi
    elif [ -f ".env.production" ] && [ ! -f ".env.development" ]; then
        echo "production"
    else
        echo "development"
    fi
}

# Main execution
main() {
    local env_type=${1:-$(detect_environment)}
    local uid=$(get_env_uid "$env_type")
    
    echo -e "${GREEN}Environment: $env_type${NC}"
    echo -e "${GREEN}USER_UID: $uid${NC}"
    
    # Export for use in other scripts
    export USER_UID="$uid"
    export CURRENT_ENV="$env_type"
    
    # Output the UID for use in scripts
    echo "$uid"
}

# If script is sourced, export the function
if [[ "${BASH_SOURCE[0]}" != "${0}" ]]; then
    export -f get_env_uid
    export -f detect_environment
    export -f get_current_uid
else
    # If script is executed directly
    main "$@"
fi
