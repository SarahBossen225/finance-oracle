# Finance Oracle - Usage Guide

## Overview

Finance Oracle is a privacy-preserving financial data platform built with FHE (Fully Homomorphic Encryption) technology. This guide explains how to use the platform for secure financial data collection, processing, and distribution.

## Prerequisites

- Node.js 18+
- Hardhat
- FHEVM
- Wallet connection (MetaMask, WalletConnect, etc.)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp env.example .env.local
```

Update the following variables in `.env.local`:

```env
# Network Configuration
SEPOLIA_URL=your_sepolia_rpc_url
PRIVATE_KEY=your_private_key

# Wallet Connect
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Contract Addresses
NEXT_PUBLIC_FINANCE_ORACLE_ADDRESS=0x...

# FHE Configuration
NEXT_PUBLIC_FHE_NETWORK=hardhat
```

### 3. Compile and Deploy Contracts

```bash
# Compile contracts
npm run compile

# Deploy to local network
npm run deploy:local

# Deploy to Sepolia testnet
npm run deploy:sepolia
```

### 4. Run Integration Tests

```bash
npm run test:integration
```

### 5. Start Development Server

```bash
npm run dev
```

## Platform Features

### 1. Dashboard

The dashboard provides an overview of:
- Total assets and data points
- Active markets and feeds
- Alert statistics
- Real-time metrics

### 2. Financial Data Management

#### Submit Financial Data
1. Navigate to the "Financial Data" section
2. Fill in the required fields:
   - Asset Symbol (e.g., BTC, ETH, AAPL)
   - Price (USD)
   - Volume
   - Market Cap
3. Click "Submit Financial Data"
4. Confirm the transaction in your wallet

#### View Financial Data
- Browse submitted financial data
- Filter by asset type
- View data validation status
- Access historical records

### 3. Price Feed Management

#### View Price Feeds
- Real-time price data from multiple sources
- Confidence levels and latency metrics
- Source verification and validation
- Historical price trends

#### Add Price Feed (Oracle Only)
1. Click "Add Feed" button
2. Enter asset details:
   - Asset Symbol
   - Data Source
   - Update Frequency
3. Submit the feed configuration

### 4. Market Data

#### Market Overview
- View all active markets
- Market status and performance
- Volume and value metrics
- Market indices and trends

#### Market Management
- Add new markets
- Update market status
- Monitor market performance
- Access market analytics

### 5. Financial Alerts

#### Create Alerts
1. Navigate to "Alerts" section
2. Click "Create Alert"
3. Configure alert parameters:
   - Asset Symbol
   - Alert Type (Price, Volume, Volatility)
   - Alert Level (Low, Medium, High, Critical)
   - Threshold Value
   - Alert Message
4. Submit the alert

#### Manage Alerts
- View active alerts
- Monitor alert status
- Edit alert parameters
- Pause or delete alerts

## Data Privacy and Security

### FHE Encryption

All sensitive financial data is encrypted using Fully Homomorphic Encryption:
- Data remains encrypted during processing
- Computations performed on encrypted data
- Privacy-preserving analytics and reporting
- Secure data verification and audit trails

### Access Control

The platform implements role-based permissions:
- **Oracle**: Can update price feeds, market data, and issue alerts
- **Data Provider**: Can submit financial data
- **Subscriber**: Can view data and create subscriptions

### Data Validation

- Multi-source data verification
- Confidence level tracking
- Data integrity hashes
- Quality assurance processes

## API Integration

### Contract Interaction

The platform provides hooks for contract interaction:

```typescript
import { useFinanceOracle } from '../hooks/useFinanceOracle';

const {
  statistics,
  getFinancialData,
  getPriceFeed,
  getFinancialAlert,
  submitFinancialData,
  updatePriceFeed,
  issueFinancialAlert
} = useFinanceOracle();
```

### Data Types

#### FinancialData
```typescript
interface FinancialData {
  id: number;
  asset: string;
  price: number;
  volume: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  change24h: number;
  volatility: number;
  isActive: boolean;
  creationTime: number;
  lastUpdated: number;
}
```

#### PriceFeed
```typescript
interface PriceFeed {
  id: number;
  asset: string;
  source: string;
  price: number;
  confidence: number;
  latency: number;
  isActive: boolean;
  creationTime: number;
  lastUpdated: number;
}
```

#### FinancialAlert
```typescript
interface FinancialAlert {
  id: number;
  asset: string;
  type: string;
  level: string;
  message: string;
  threshold: number;
  currentValue: number;
  status: number;
  isActive: boolean;
  creationTime: number;
  lastUpdated: number;
}
```

## Troubleshooting

### Common Issues

1. **Wallet Connection Failed**
   - Ensure MetaMask is installed and unlocked
   - Check network configuration
   - Verify WalletConnect project ID

2. **Contract Interaction Failed**
   - Check contract address configuration
   - Verify network connection
   - Ensure sufficient gas fees

3. **Data Loading Issues**
   - Check network connectivity
   - Verify contract deployment
   - Review console for error messages

### Error Messages

- "Only oracle can perform this action": User lacks oracle permissions
- "Please connect your wallet first": Wallet not connected
- "Invalid asset symbol": Asset symbol format incorrect
- "Data not found": Requested data doesn't exist on blockchain

## Best Practices

### Data Submission
- Use standardized asset symbols (BTC, ETH, AAPL)
- Validate data before submission
- Include confidence levels and source information
- Regular data updates for accuracy

### Alert Management
- Set appropriate threshold values
- Use clear and descriptive alert messages
- Monitor alert performance and adjust as needed
- Regular alert maintenance and cleanup

### Security
- Keep private keys secure
- Use hardware wallets for production
- Regular security audits
- Monitor for suspicious activity

## Support

For technical support and questions:
- Check the documentation
- Review error logs
- Contact the development team
- Join community discussions

## License

MIT License - see LICENSE file for details.
