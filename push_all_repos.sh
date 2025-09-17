#!/bin/bash

# Script to push all changes to multiple repositories
# This script will commit and push changes to all StateX repositories

set -e

echo "🚀 Pushing changes to all StateX repositories"
echo "=============================================="

# Define repositories
REPOS=(
    ".:statex-main"
    "statex-ai"
    "statex-infrastructure" 
    "statex-monitoring"
    "statex-notification-service"
    "statex-platform"
    "statex-website"
)

# Function to push repository
push_repo() {
    local repo_info=$1
    local repo_path=$(echo "$repo_info" | cut -d: -f1)
    local repo_name=$(echo "$repo_info" | cut -d: -f2)
    
    # If no custom name provided, use directory name
    if [ "$repo_name" = "$repo_path" ]; then
        repo_name=$(basename "$repo_path")
    fi
    
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
    git status --porcelain
    
    # Add all changes
    echo "Adding all changes..."
    git add .
    
    # Create commit message based on recent changes
    COMMIT_MSG="feat: implement final integration testing and optimization

- Add comprehensive system testing with real user scenarios
- Implement performance optimization and tuning procedures  
- Create complete deployment documentation and runbooks
- Add troubleshooting guides and API documentation
- Implement monitoring and maintenance procedures

Task 10 completion: Final integration testing and optimization
Requirements covered: 8.1-8.7, 9.1-9.7, 10.6-10.7, 1.7"
    
    # Commit changes
    echo "Committing changes..."
    git commit -m "$COMMIT_MSG"
    
    # Get current branch (compatible with older git versions)
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    echo "Current branch: $CURRENT_BRANCH"
    
    # Push changes
    echo "Pushing to origin/$CURRENT_BRANCH..."
    if git push origin "$CURRENT_BRANCH"; then
        echo "✅ Successfully pushed $repo_name"
    else
        echo "❌ Failed to push $repo_name"
        echo "You may need to set up the remote or handle conflicts manually"
    fi
    
    cd - > /dev/null
}

# Main execution
echo "Starting repository push process..."
echo "Timestamp: $(date)"

# Process each repository
for repo_info in "${REPOS[@]}"; do
    repo_path=$(echo "$repo_info" | cut -d: -f1)
    if [ -d "$repo_path" ] || [ "$repo_path" = "." ]; then
        push_repo "$repo_info"
    else
        echo "⚠️  Directory $repo_path not found, skipping..."
    fi
done

echo ""
echo "🎉 Repository push process completed!"
echo "====================================="

# Summary
echo ""
echo "📊 Summary:"
echo "- Processed ${#REPOS[@]} repositories"
echo "- Check output above for individual results"
echo "- If any pushes failed, you may need to:"
echo "  1. Set up remote repositories"
echo "  2. Handle merge conflicts"
echo "  3. Configure authentication"

echo ""
echo "Next steps:"
echo "1. Verify all repositories are updated on remote"
echo "2. Check CI/CD pipelines if configured"
echo "3. Update any deployment environments"