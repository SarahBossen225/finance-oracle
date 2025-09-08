#!/bin/bash

# Finance Oracle - Vercel Deployment Script
# This script helps prepare and deploy the project to Vercel

echo "🚀 Finance Oracle - Vercel Deployment Script"
echo "=============================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Vercel CLI. Please install manually:"
        echo "   npm install -g vercel"
        exit 1
    fi
    echo "✅ Vercel CLI installed successfully"
else
    echo "✅ Vercel CLI is already installed"
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel:"
    vercel login
    if [ $? -ne 0 ]; then
        echo "❌ Failed to log in to Vercel"
        exit 1
    fi
else
    echo "✅ Already logged in to Vercel"
fi

# Check for environment variables
echo "🔍 Checking environment variables..."

if [ -z "$NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID" ]; then
    echo "⚠️  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set"
    echo "   Please set this environment variable or add it to Vercel dashboard"
    echo "   Get your project ID from: https://cloud.walletconnect.com/"
fi

# Build the project locally to check for errors
echo "🔨 Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors before deploying"
    exit 1
fi

echo "✅ Build successful"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo "📱 Your app is now live on Vercel"
    echo "🔗 Check your Vercel dashboard for the deployment URL"
else
    echo "❌ Deployment failed"
    exit 1
fi

echo "=============================================="
echo "✅ Deployment process completed!"
echo ""
echo "📋 Next steps:"
echo "1. Check your Vercel dashboard for the deployment"
echo "2. Configure environment variables in Vercel dashboard"
echo "3. Test the deployed application"
echo "4. Set up custom domain if needed"
echo ""
echo "🔗 Useful links:"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- WalletConnect Console: https://cloud.walletconnect.com/"
echo "- Project Repository: https://github.com/grace90g/finance-oracle"
