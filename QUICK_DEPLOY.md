# 🚀 Quick Vercel Deployment Guide

## Method 1: Vercel Dashboard (Recommended for beginners)

### Step 1: Get WalletConnect Project ID
1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy your Project ID

### Step 2: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import `grace90g/finance-oracle` repository
4. Configure project:
   - **Framework**: Next.js (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add environment variable:
   - **Name**: `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
   - **Value**: Your WalletConnect Project ID
6. Click "Deploy"

### Step 3: Wait and Test
- Wait 2-5 minutes for deployment
- Test the deployed application
- Check wallet connections work properly

---

## Method 2: Vercel CLI (For developers)

### Prerequisites
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login
```

### Deploy
```bash
# From project directory
cd finance-oracle

# Set environment variable
export NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Deploy
vercel --prod
```

---

## Method 3: Automated Script

```bash
# Make script executable
chmod +x scripts/deploy-vercel.sh

# Run deployment script
./scripts/deploy-vercel.sh
```

---

## 🔧 Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | WalletConnect Project ID | ✅ Yes |
| `NEXT_PUBLIC_ETHEREUM_RPC_URL` | Ethereum RPC URL | ❌ Optional |
| `NEXT_PUBLIC_SEPOLIA_RPC_URL` | Sepolia Testnet RPC URL | ❌ Optional |

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (18.x recommended)

### Wallet Connection Issues
- Verify WalletConnect Project ID is correct
- Check RPC URLs are accessible
- Ensure proper network configuration

### Environment Variables Not Working
- Variables must start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new environment variables
- Check variable names match exactly

---

## 📱 Testing Your Deployment

1. **Basic Functionality**
   - Page loads without errors
   - Navigation works properly
   - All tabs display correctly

2. **Wallet Integration**
   - Connect button appears
   - Wallet selection modal opens
   - Connection establishes successfully

3. **Data Display**
   - Mock data loads correctly
   - Charts and statistics display
   - No console errors

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **WalletConnect Console**: https://cloud.walletconnect.com/
- **Project Repository**: https://github.com/grace90g/finance-oracle
- **Vercel Documentation**: https://vercel.com/docs

---

## 💡 Pro Tips

1. **Performance**: Enable Vercel Analytics for monitoring
2. **Custom Domain**: Add your domain in Vercel dashboard
3. **Preview Deployments**: Every PR gets a preview URL
4. **Environment Management**: Use different env vars for staging/production
5. **Monitoring**: Set up alerts for deployment failures

---

## 🆘 Need Help?

1. Check the full [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
2. Review Vercel build logs for specific errors
3. Test locally first: `npm run build && npm start`
4. Check GitHub repository for latest updates
