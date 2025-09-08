# Finance Oracle - Secure Financial Data Platform

Finance Oracle is a privacy-preserving financial data and market analytics platform built with FHE (Fully Homomorphic Encryption) technology. It enables secure financial data collection, processing, and distribution while maintaining data privacy and market integrity.

## Features

### 💰 Financial Data Collection
- FHE-encrypted financial data from multiple sources
- Real-time price, volume, market cap, and volatility monitoring
- Encrypted data storage and processing
- Multi-source data verification and validation

### 📈 Market Data Management
- Secure market data aggregation and management
- Encrypted market metadata (name, type, status, indices)
- Market status monitoring and operational tracking
- Data collection from crypto, stock, forex, and commodity markets

### 💰 Price Feed Management
- Privacy-preserving price feed aggregation
- Encrypted price data with confidence levels
- Multi-source price validation and latency tracking
- Real-time price updates and historical data

### 📊 Trading Pair Management
- Encrypted trading pair creation and management
- Bid-ask spread monitoring and liquidity tracking
- Base and quote asset price management
- Trading pair status and performance analytics

### 📈 Financial Index Management
- Encrypted financial index calculations and tracking
- Market index performance monitoring
- Index weight and change calculations
- Historical index data and trend analysis

### 🚨 Financial Alert System
- Encrypted financial alert issuance and management
- Multi-level alert system (Low, Medium, High, Critical)
- Asset-based alert distribution
- Alert status tracking and threshold monitoring

### 📊 Risk Metrics
- Encrypted risk assessment and metrics calculation
- Value at Risk (VaR), Beta, Sharpe ratio calculations
- Maximum drawdown and volatility analysis
- Risk-adjusted performance metrics

### 🔒 Privacy & Security
- Fully homomorphic encryption for all sensitive data
- Financial data privacy protection
- Encrypted asset and market information
- Secure data verification and audit trails

## Architecture

### Smart Contract Components

#### FinancialData
- Encrypted financial parameters (price, volume, market cap, volatility)
- Encrypted asset and timestamp information
- Encrypted market data and integrity hashes
- Data lifecycle management

#### MarketData
- Encrypted market metadata (name, type, status, indices)
- Encrypted market volume and value information
- Market operational status and tracking
- Market performance analytics

#### PriceFeed
- Encrypted price data with confidence levels
- Encrypted data source and latency information
- Price feed integrity and validation
- Real-time price monitoring

#### TradingPair
- Encrypted trading pair information
- Encrypted base and quote asset prices
- Bid-ask spread and liquidity tracking
- Trading pair performance metrics

#### FinancialIndex
- Encrypted index calculations and values
- Encrypted index performance and changes
- Index weight and composition tracking
- Historical index data and trends

#### RiskMetrics
- Encrypted risk assessment calculations
- Encrypted VaR, Beta, Sharpe ratio metrics
- Risk-adjusted performance analysis
- Volatility and drawdown tracking

#### FinancialAlert
- Encrypted alert types, levels, and messages
- Encrypted alert thresholds and current values
- Alert status management and distribution
- Alert performance and effectiveness tracking

#### FinancialSubscription
- Encrypted subscription preferences and assets
- Encrypted update frequencies and data types
- Subscription management and status tracking
- Personalized financial data delivery

#### FinancialAnalytics
- Encrypted statistical calculations and insights
- Encrypted historical data analysis
- Performance metrics and accuracy reporting
- Trend analysis and pattern recognition

### Key Functions

#### Data Management
- `submitFinancialData()` - Submit encrypted financial data
- `deactivateFinancialData()` - Deactivate financial data
- Data integrity verification and validation

#### Market Management
- `updateMarketData()` - Update market information
- `deactivateMarketData()` - Deactivate market data
- Market status monitoring and management

#### Price Feed Management
- `updatePriceFeed()` - Update price feed data
- `deactivatePriceFeed()` - Deactivate price feeds
- Price feed accuracy and latency tracking

#### Trading Pair Management
- `createTradingPair()` - Create trading pairs
- `deactivateTradingPair()` - Deactivate trading pairs
- Trading pair performance and liquidity tracking

#### Index Management
- `calculateFinancialIndex()` - Calculate financial indices
- `deactivateFinancialIndex()` - Deactivate indices
- Index performance and composition tracking

#### Risk Management
- `calculateRiskMetrics()` - Calculate risk metrics
- `deactivateRiskMetrics()` - Deactivate risk metrics
- Risk assessment and performance analysis

#### Alert Management
- `issueFinancialAlert()` - Issue financial alerts
- `updateFinancialAlertStatus()` - Update alert status
- `deactivateFinancialAlert()` - Deactivate alerts

#### Subscription Management
- `createFinancialSubscription()` - Create subscriptions
- `updateFinancialSubscriptionStatus()` - Update subscription status
- `deactivateFinancialSubscription()` - Deactivate subscriptions

#### Analytics
- `calculateFinancialAnalytics()` - Calculate analytics
- `deactivateFinancialAnalytics()` - Deactivate analytics
- Statistical analysis and reporting

## Installation

### Prerequisites
- Node.js 18+
- Hardhat
- FHEVM

### Setup
```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to local network
npm run deploy:local

# Deploy to Sepolia
npm run deploy:sepolia
```

### Frontend Development
```bash
# Install frontend dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

### Financial Data Submission
1. Connect your wallet
2. Navigate to "Price Feeds"
3. Click "Add Feed"
4. Fill in asset details (symbol, name, source)
5. Set update frequency and confidence levels
6. Submit encrypted financial data

### Market Data Management
1. Navigate to "Markets" section
2. View market overview and statistics
3. Monitor market status and performance
4. Access market analytics and trends
5. Manage market operations

### Price Feed Monitoring
1. Navigate to "Price Feeds" section
2. View real-time price data
3. Monitor price confidence and latency
4. Set up price alerts and notifications
5. Access historical price data

### Financial Alert Management
1. Navigate to "Alerts" section
2. Create custom financial alerts
3. Set alert thresholds and conditions
4. Monitor alert status and triggers
5. Manage alert subscriptions

## Financial Parameters

### Price Data
- Encrypted asset prices in USD
- Real-time price monitoring
- Price trend analysis
- Historical price data

### Volume Data
- Encrypted trading volume measurements
- Volume trend monitoring
- Volume spike detection
- Market activity analysis

### Market Cap
- Encrypted market capitalization
- Market cap tracking
- Market dominance analysis
- Market size comparisons

### Volatility
- Encrypted volatility calculations
- Volatility trend monitoring
- Risk assessment metrics
- Volatility-based alerts

### Bid-Ask Spread
- Encrypted spread monitoring
- Spread trend analysis
- Liquidity assessment
- Trading cost analysis

### Market Indices
- Encrypted index calculations
- Index performance tracking
- Market trend analysis
- Benchmark comparisons

### Risk Metrics
- Encrypted VaR calculations
- Beta coefficient analysis
- Sharpe ratio monitoring
- Maximum drawdown tracking

## Security Features

### FHE Encryption
- All sensitive financial data encrypted with FHE
- Computations on encrypted data
- Privacy-preserving analytics and reporting

### Data Verification
- Encrypted data integrity verification
- Multi-source data validation
- Accuracy and confidence tracking
- Quality assurance processes

### Access Control
- Role-based permissions (Oracle, Data Provider, Subscriber)
- Encrypted data access controls
- Secure API endpoints
- Audit trail logging

### Privacy Protection
- Asset data encryption
- Market information protection
- User subscription privacy
- Anonymous data analytics

## UI Design

### Finance Oracle Theme
- **Color Scheme**: Green-based financial theme
- **Animations**: Finance-specific animations (price, trading, market, alert)
- **Visual Elements**: Financial charts, market indicators, price feeds, trading symbols
- **Layout**: Clean, professional financial monitoring interface

### Key UI Components
- Dashboard with financial statistics
- Market overview and management
- Price feed display and monitoring
- Alert management and notifications
- Analytics and reporting tools

## Testing

### Contract Tests
```bash
npm run test
```

### Test Coverage
- Financial data submission and management
- Market data updates and management
- Price feed creation and monitoring
- Trading pair management
- Financial index calculations
- Risk metrics assessment
- Alert issuance and management
- Subscription management
- Analytics calculation
- Access control and security

## Deployment

### Local Development
```bash
npm run deploy:local
```

### Sepolia Testnet
```bash
npm run deploy:sepolia
```

### Environment Variables
```env
SEPOLIA_URL=your_sepolia_rpc_url
PRIVATE_KEY=your_private_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue on GitHub
- Join our community discussions
- Check the documentation

## Roadmap

### Phase 1: Core Financial Data
- ✅ Basic financial data collection
- ✅ FHE encryption integration
- ✅ Market data management
- ✅ Price feed aggregation

### Phase 2: Advanced Features
- 🔄 Advanced risk metrics
- 🔄 Machine learning integration
- 🔄 Real-time data streaming
- 🔄 Multi-source data fusion

### Phase 3: Enterprise Features
- 🔄 Enterprise dashboard
- 🔄 API integration
- 🔄 Custom analytics
- 🔄 Business intelligence tools

---

**Finance Oracle** - Secure, Private, Accurate Financial Data for the Decentralized Future