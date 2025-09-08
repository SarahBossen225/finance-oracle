# Vercel Deployment Guide

## Manual Deployment to Vercel

### Prerequisites
1. Vercel account (free tier available)
2. GitHub repository with the code
3. Environment variables configured

### Step 1: Prepare Environment Variables

Create a `.env.local` file with the following variables:

```bash
# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here

# Optional: Custom RPC URLs
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your_key
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_key
```

### Step 2: Deploy via Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose `grace90g/finance-oracle` from your repositories
   - Click "Import"

3. **Configure Project Settings**
   - **Project Name**: `finance-oracle` (or your preferred name)
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Set Environment Variables**
   - In the "Environment Variables" section, add:
     - `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: Your WalletConnect project ID
     - Any other environment variables you need

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-5 minutes)

### Step 3: Deploy via Vercel CLI (Alternative)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Directory**
   ```bash
   cd finance-oracle
   vercel
   ```

4. **Follow the prompts**
   - Link to existing project or create new one
   - Set up environment variables
   - Deploy

### Step 4: Configure Custom Domain (Optional)

1. **Add Domain**
   - Go to your project dashboard
   - Click "Domains" tab
   - Add your custom domain

2. **Configure DNS**
   - Add CNAME record pointing to your Vercel deployment
   - Wait for DNS propagation

### Step 5: Environment Variables in Vercel

In your Vercel dashboard, go to:
- Project Settings → Environment Variables
- Add the following variables:

```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your_key
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_key
```

### Step 6: Redeploy After Environment Changes

After adding environment variables:
1. Go to "Deployments" tab
2. Click "Redeploy" on the latest deployment
3. Or trigger a new deployment by pushing to your main branch

### Troubleshooting

#### Common Issues:

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **Environment Variables Not Working**
   - Ensure variables start with `NEXT_PUBLIC_` for client-side access
   - Redeploy after adding new environment variables
   - Check variable names match exactly

3. **Wallet Connection Issues**
   - Verify WalletConnect Project ID is correct
   - Check RPC URLs are accessible
   - Ensure proper network configuration

4. **Smart Contract Issues**
   - Verify contract addresses are correct
   - Check network configuration in wagmi config
   - Ensure proper ABI files are included

### Performance Optimization

1. **Enable Vercel Analytics**
   - Go to project settings
   - Enable Vercel Analytics for performance monitoring

2. **Configure Edge Functions** (if needed)
   - Use Vercel Edge Runtime for better performance
   - Configure in `vercel.json`

3. **Image Optimization**
   - Use Next.js Image component
   - Configure in `next.config.js`

### Security Considerations

1. **Environment Variables**
   - Never commit sensitive keys to repository
   - Use Vercel's environment variable system
   - Rotate keys regularly

2. **API Routes**
   - Implement proper authentication
   - Use rate limiting
   - Validate all inputs

3. **Smart Contract Interactions**
   - Verify contract addresses
   - Implement proper error handling
   - Use proper network validation

### Monitoring and Maintenance

1. **Vercel Dashboard**
   - Monitor deployment status
   - Check function logs
   - Monitor performance metrics

2. **GitHub Integration**
   - Automatic deployments on push to main
   - Preview deployments for pull requests
   - Branch-based deployments

3. **Updates and Maintenance**
   - Regular dependency updates
   - Security patches
   - Performance optimizations

### Cost Considerations

- **Vercel Free Tier**: 100GB bandwidth, 100GB-hours function execution
- **Pro Tier**: $20/month for higher limits
- **Enterprise**: Custom pricing for large-scale deployments

### Support and Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
