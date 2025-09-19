#!/bin/bash

# Script to push all microservices with proper AI agents commit message
set -e

echo "🚀 Pushing AI Agents Implementation to Microservices"
echo "===================================================="

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
            echo "feat: integrate AI processing feedback and form enhancements

- Add ProcessingFeedback component for real-time updates
- Implement AI integration service for workflow coordination
- Add processing feedback service for user experience
- Create comprehensive contact form testing
- Integrate with AI orchestrator for seamless user experience

Frontend integration with the multi-agent AI system."
            ;;
        *)
            echo "feat: implement AI agents integration

Updates to support the multi-agent AI orchestration system."
            ;;
    esac
}

# Function to push repository with AI agents message
push_repo_with_ai_message() {
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
    
    # Commit changes with AI-specific message
    echo "Committing AI agents implementation..."
    git commit -m "$commit_message"
    
    # Get current branch
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    echo "Current branch: $CURRENT_BRANCH"
    
    # Push changes
    echo "Pushing to origin/$CURRENT_BRANCH..."
    if git push origin "$CURRENT_BRANCH"; then
        echo "✅ Successfully pushed $repo_name with AI agents implementation"
    else
        echo "❌ Failed to push $repo_name"
        echo "You may need to handle conflicts manually"
    fi
    
    cd - > /dev/null
}

# Process repositories that have AI-related changes
REPOS_TO_PUSH=(
    "statex-ai"
    "statex-infrastructure" 
    "statex-notification-service"
    "statex-website"
)

echo "Starting AI agents implementation push..."
echo "Timestamp: $(date)"

for repo in "${REPOS_TO_PUSH[@]}"; do
    if [ -d "$repo" ]; then
        push_repo_with_ai_message "$repo"
    else
        echo "⚠️  Directory $repo not found, skipping..."
    fi
done

echo ""
echo "🎉 AI Agents Implementation Push Completed!"
echo "=========================================="

echo ""
echo "📊 Summary:"
echo "- Main repository (statex): ✅ Pushed to git@github.com:speakASAP/statex.git"
echo "- AI Services (statex-ai): Processing..."
echo "- Infrastructure (statex-infrastructure): Processing..."
echo "- Notifications (statex-notification-service): Processing..."
echo "- Website (statex-website): Processing..."

echo ""
echo "🤖 AI Agents Implementation Features:"
echo "- Multi-agent orchestration system"
echo "- Business requirement analysis with NLP"
echo "- Voice processing with ASR"
echo "- Document analysis with AI"
echo "- Free AI services integration (Ollama, HuggingFace)"
echo "- Real-time processing feedback"
echo "- Automated business analysis and offer generation"
echo "- Comprehensive testing and optimization"