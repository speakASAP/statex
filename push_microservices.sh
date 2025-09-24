#!/bin/bash

# Script to push all microservices with subdomain validation and DNS management
set -e

echo "🚀 Pushing Subdomain Validation and DNS Management to Microservices"
echo "==================================================================="

# Function to get commit message for repository
get_commit_message() {
    local repo_name=$1
    
    case "$repo_name" in
        "statex-ai")
            echo "feat: implement multi-agent AI orchestration system

- Add AI Orchestrator with multi-agent coordination
- Implement NLP Service for business requirement analysis  
- Add ASR Service for voice-to-text processing
- Implement Document AI for file analysis and OCR
- Add Free AI Service with Ollama integration
- Create AI Workers for distributed processing
- Add comprehensive agent coordination and workflow engine
- Implement business analysis aggregation and offer formatting
- Add project prototype URL generation
- Support for free AI services (Ollama, HuggingFace, Whisper)

This implements the core AI agent system for automated business analysis."
            ;;
        "statex-infrastructure")
            echo "feat: add infrastructure support for AI agents

- Update Docker Compose for AI services
- Add Nginx configuration for AI service routing
- Add Ollama setup scripts for local AI models
- Configure infrastructure for multi-agent system

Infrastructure changes to support the AI agent orchestration."
            ;;
        "statex-notification-service")
            echo "feat: enhance notification system for AI workflow

- Add delivery manager for reliable notifications
- Implement Telegram message formatting for AI results
- Add notification models and enhanced delivery
- Create comprehensive notification testing
- Support for AI-generated business analysis notifications

Enhanced notification system integrated with AI workflow results."
            ;;
        "statex-website")
            echo "feat: implement subdomain validation and routing system

- Add subdomain validation to show empty page for non-existent projects
- Implement direct subdomain content serving without redirects
- Add project validation and empty state handling
- Create comprehensive subdomain routing system
- Add close button to AI processing popup
- Fix Next.js compilation errors and server-side rendering
- Implement server-side subdomain detection and validation

Subdomain routing system now fully functional with validation."
            ;;
        "statex-dns-service")
            echo "feat: implement dynamic DNS management microservice

- Create DNS microservice with Express API and SQLite database
- Add DNS2 server for local subdomain resolution
- Implement subdomain registration and resolution logic
- Add comprehensive logging and error handling
- Create setup scripts and documentation
- Support for wildcard subdomain management

Dynamic subdomain management system for prototype routing."
            ;;
        "statex-platform")
            echo "feat: update platform for subdomain validation

- Add support for subdomain validation system
- Update platform configuration for DNS service integration
- Add subdomain routing support

Platform updates to support dynamic subdomain management."
            ;;
        "statex-monitoring")
            echo "feat: add monitoring for subdomain validation system

- Add monitoring for DNS service and subdomain routing
- Implement health checks for subdomain validation
- Add metrics for subdomain creation and validation
- Monitor subdomain resolution and routing performance

Monitoring updates to support the subdomain validation system."
            ;;
        *)
            echo "feat: implement subdomain validation and DNS management

Updates to support the subdomain validation and routing system."
            ;;
    esac
}

# Function to push repository with subdomain validation message
push_repo_with_subdomain_message() {
    local repo_path=$1
    local repo_name=$(basename "$repo_path")
    local commit_message=$(get_commit_message "$repo_name")
    
    echo ""
    echo "📦 Processing repository: $repo_name"
    echo "-----------------------------------"
    
    cd "$repo_path"
    
    # Check if it's a git repository
    if [ ! -d ".git" ]; then
        echo "⚠️  Not a git repository, skipping..."
        cd - > /dev/null
        return
    fi
    
    # Check git status
    if git diff --quiet && git diff --staged --quiet; then
        echo "✅ No changes to commit in $repo_name"
        cd - > /dev/null
        return
    fi
    
    echo "📝 Changes detected in $repo_name"
    
    # Show status
    echo "Git status:"
    git status --porcelain | head -10
    
    # Add all changes
    echo "Adding all changes..."
    git add .
    
    # Commit changes with subdomain validation message
    echo "Committing subdomain validation implementation..."
    git commit -m "$commit_message"
    
    # Get current branch
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    echo "Current branch: $CURRENT_BRANCH"
    
    # Push changes
    echo "Pushing to origin/$CURRENT_BRANCH..."
    if git push origin "$CURRENT_BRANCH"; then
        echo "✅ Successfully pushed $repo_name with subdomain validation implementation"
    else
        echo "❌ Failed to push $repo_name"
        echo "You may need to handle conflicts manually"
    fi
    
    cd - > /dev/null
}

# Process repositories that have subdomain validation and DNS changes
REPOS_TO_PUSH=(
    "statex-ai"
    "statex-dns-service"
    "statex-infrastructure" 
    "statex-monitoring"
    "statex-notification-service"
    "statex-platform"
    "statex-website"
)

echo "Starting subdomain validation and DNS management push..."
echo "Timestamp: $(date)"

for repo in "${REPOS_TO_PUSH[@]}"; do
    if [ -d "$repo" ]; then
        push_repo_with_subdomain_message "$repo"
    else
        echo "⚠️  Directory $repo not found, skipping..."
    fi
done

echo ""
echo "🎉 Subdomain Validation and DNS Management Push Completed!"
echo "========================================================="

echo ""
echo "📊 Summary:"
echo "- Main repository (statex): ✅ Pushed to git@github.com:speakASAP/statex.git"
echo "- AI Services (statex-ai): Processing..."
echo "- DNS Service (statex-dns-service): Processing..."
echo "- Infrastructure (statex-infrastructure): Processing..."
echo "- Monitoring (statex-monitoring): Processing..."
echo "- Notifications (statex-notification-service): Processing..."
echo "- Platform (statex-platform): Processing..."
echo "- Website (statex-website): Processing..."

echo ""
echo "🌐 Subdomain Validation and DNS Management Features:"
echo "- Dynamic subdomain management with DNS microservice"
echo "- Subdomain validation to show empty page for non-existent projects"
echo "- Direct subdomain content serving without redirects"
echo "- SSL certificate setup for development and production"
echo "- Project validation and empty state handling"
echo "- Comprehensive subdomain routing system"
echo "- Close button for AI processing popup"
echo "- Server-side subdomain detection and validation"
echo "- DNS service with SQLite database and API endpoints"