/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for better Vercel performance
  output: 'standalone',
  
  // Optimize for Vercel deployment
  experimental: {
    esmExternals: 'loose',
  },
  
  // Image optimization
  images: {
    domains: ['localhost'],
    unoptimized: true, // For static export compatibility
  },
  
  // Headers for CORS and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none', // Allow wallet connections
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  
  // Webpack configuration for blockchain libraries
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    
    // Add polyfills for FHEVM SDK and blockchain libraries
    config.plugins.push(
      new webpack.DefinePlugin({
        global: 'globalThis',
        self: 'globalThis',
        'process.env': JSON.stringify(process.env),
      })
    );
    
    // Handle node modules that need special treatment
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      });
    }
    
    return config;
  },
  
  // Environment variables - avoid exposing sensitive data
  env: {
    // Only expose safe environment variables
  },
  
  // Redirects for better UX
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
