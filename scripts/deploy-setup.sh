#!/bin/bash

# EthioInvest Network - Deployment Setup Script
# This script helps prepare your application for deployment

set -e

echo "🚀 EthioInvest Network - Deployment Setup"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📋 Checking prerequisites..."

# Check Node.js version
NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check npm version
NPM_VERSION=$(npm --version)
echo "✅ npm version: $NPM_VERSION"

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your actual values before deployment!"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Test build
echo "🔨 Testing build process..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build output created in ./dist/"
else
    echo "❌ Build failed! Please fix any errors before deploying."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "⚠️  Git repository not initialized. Initialize with:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-repo-url>"
    echo "   git push -u origin main"
else
    echo "✅ Git repository detected"
    
    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        echo "⚠️  You have uncommitted changes. Commit them before deploying:"
        echo "   git add ."
        echo "   git commit -m 'Prepare for deployment'"
        echo "   git push origin main"
    else
        echo "✅ No uncommitted changes"
    fi
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Update .env.local with your actual values"
echo "2. Deploy backend to Railway/Render/Heroku (see NETLIFY_DEPLOYMENT_GUIDE.md)"
echo "3. Deploy frontend to Netlify"
echo "4. Update environment variables in both services"
echo "5. Test your deployed application"
echo ""
echo "📖 For detailed instructions, see: NETLIFY_DEPLOYMENT_GUIDE.md"
echo ""
echo "✨ Setup complete! Happy deploying! 🚀"