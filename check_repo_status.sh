#!/bin/bash

# Script to check status of all repositories before pushing
echo "🔍 Checking status of all StateX repositories"
echo "============================================="

REPOS=(
    "."
    "statex-ai"
    "statex-infrastructure" 
    "statex-monitoring"
    "statex-notification-service"
    "statex-platform"
    "statex-website"
)

for repo in "${REPOS[@]}"; do
    if [ -d "$repo" ] && [ -d "$repo/.git" ]; then
        echo ""
        echo "📦 Repository: $(basename "$repo")"
        echo "----------------------------"
        
        cd "$repo"
        
        # Check if there are changes
        if git diff --quiet && git diff --staged --quiet; then
            echo "✅ Clean - no changes"
        else
            echo "📝 Has changes:"
            git status --porcelain | head -10
            if [ $(git status --porcelain | wc -l) -gt 10 ]; then
                echo "... and $(( $(git status --porcelain | wc -l) - 10 )) more files"
            fi
        fi
        
        # Check current branch (compatible with older git versions)
        echo "🌿 Branch: $(git rev-parse --abbrev-ref HEAD)"
        
        # Check remote status
        if git remote -v | grep -q origin; then
            echo "🔗 Remote: $(git remote get-url origin)"
        else
            echo "⚠️  No remote configured"
        fi
        
        cd - > /dev/null
    else
        echo "⚠️  $repo: Not a git repository or doesn't exist"
    fi
done

echo ""
echo "🎯 Ready to push? Run: ./push_all_repos.sh"