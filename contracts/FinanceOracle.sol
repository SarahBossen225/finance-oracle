// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract FinanceOracle is SepoliaConfig {
    using FHE for *;
    
    // Public market data (unencrypted - publicly available)
    struct PublicMarketData {
        uint256 dataId;
        string asset; // Asset symbol (e.g., "BTC", "ETH", "AAPL")
        uint256 price; // Current price (public)
        uint256 volume24h; // 24h trading volume (public)
        uint256 marketCap; // Market capitalization (public)
        uint256 high24h; // 24h high price (public)
        uint256 low24h; // 24h low price (public)
        int256 change24h; // 24h price change percentage (public)
        uint256 volatility; // Volatility measure (public)
        bool isActive;
        uint256 creationTime;
        uint256 lastUpdated;
    }
    
    // Private portfolio data (encrypted - user's personal data)
    struct PrivatePortfolioData {
        euint32 portfolioId;
        euint32 totalValue; // User's total portfolio value
        euint32 riskTolerance; // User's risk tolerance level
        euint32 investmentGoals; // User's investment goals
        euint32 assetAllocation; // Asset allocation percentage
        euint32 performanceMetrics; // Portfolio performance metrics
        ebool isHighNetWorth; // Whether user is high net worth
        ebool privacyLevel; // User's privacy preference
        uint256 creationTime;
        uint256 lastUpdated;
    }
    
    // Institutional data (encrypted - sensitive business data)
    struct InstitutionalData {
        euint32 institutionId;
        euint32 internalRatings; // Internal credit ratings
        euint32 riskMetrics; // Internal risk calculations
        euint32 performanceData; // Internal performance metrics
        euint32 proprietaryModels; // Proprietary model outputs
        ebool isConfidential; // Confidentiality level
        uint256 creationTime;
        uint256 lastUpdated;
    }
    
    // Public market overview (unencrypted - publicly available)
    struct PublicMarketOverview {
        uint256 marketId;
        string marketName; // Market name (e.g., "Crypto", "Stocks", "Forex")
        string marketType; // Market type
        uint256 totalVolume; // Total trading volume (public)
        uint256 totalValue; // Total market value (public)
        uint256 activeAssets; // Number of active assets (public)
        uint256 marketIndex; // Market index value (public)
        bool isActive;
        uint256 creationTime;
        uint256 lastUpdated;
    }
    
    // Public price feed data (unencrypted - publicly available)
    struct PublicPriceFeed {
        uint256 feedId;
        string asset; // Asset symbol
        string source; // Data source (e.g., "CoinGecko", "Binance")
        uint256 price; // Current price (public)
        uint256 confidence; // Confidence level (0-100) (public)
        uint256 latency; // Data latency in milliseconds (public)
        bool isActive;
        uint256 creationTime;
        uint256 lastUpdated;
    }
    
    struct TradingPair {
        euint32 pairId;
        string baseAsset; // Base asset symbol
        string quoteAsset; // Quote asset symbol
        euint32 encryptedBasePrice; // Encrypted base asset price
        euint32 encryptedQuotePrice; // Encrypted quote asset price
        euint32 encryptedSpread; // Encrypted bid-ask spread
        euint32 encryptedLiquidity; // Encrypted trading liquidity
        ebool isActive; // Whether the pair is active
        uint256 creationTime; // Timestamp when pair was created
        uint256 lastUpdated; // Timestamp when pair was last updated
    }
    
    struct FinancialIndex {
        euint32 indexId;
        string indexName; // Index name (e.g., "S&P 500", "NASDAQ")
        euint32 encryptedIndexValue; // Encrypted current index value
        euint32 encryptedIndexChange; // Encrypted index change percentage
        euint32 encryptedIndexWeight; // Encrypted index weight
        ebool isActive; // Whether the index is active
        uint256 creationTime; // Timestamp when index was created
        uint256 lastUpdated; // Timestamp when index was last updated
    }
    
    struct RiskMetrics {
        euint32 riskId;
        string asset; // Asset symbol
        euint32 encryptedVaR; // Encrypted Value at Risk
        euint32 encryptedBeta; // Encrypted Beta coefficient
        euint32 encryptedSharpeRatio; // Encrypted Sharpe ratio
        euint32 encryptedMaxDrawdown; // Encrypted Maximum drawdown
        euint32 encryptedVolatility; // Encrypted volatility measure
        ebool isActive; // Whether the risk metrics are active
        uint256 creationTime; // Timestamp when risk metrics were created
        uint256 lastUpdated; // Timestamp when risk metrics were last updated
    }
    
    struct FinancialAlert {
        euint32 alertId;
        string asset; // Asset symbol
        string alertType; // Alert type (e.g., "Price", "Volume", "Volatility")
        string alertLevel; // Alert level (e.g., "Low", "Medium", "High", "Critical")
        string alertMessage; // Alert message
        euint32 encryptedThreshold; // Encrypted alert threshold value
        euint32 encryptedCurrentValue; // Encrypted current value
        euint32 encryptedAlertStatus; // Encrypted alert status (0: Inactive, 1: Active, 2: Triggered)
        ebool isActive; // Whether the alert is active
        uint256 creationTime; // Timestamp when alert was created
        uint256 lastUpdated; // Timestamp when alert was last updated
    }
    
    struct FinancialSubscription {
        euint32 subscriptionId;
        address subscriber; // Subscriber address
        string asset; // Asset symbol
        euint32 encryptedUpdateFrequency; // Encrypted update frequency in seconds
        euint32 encryptedDataTypes; // Encrypted bitmask of data types to subscribe to
        euint32 encryptedSubscriptionStatus; // Encrypted subscription status (0: Inactive, 1: Active, 2: Paused)
        uint256 nextUpdate; // Timestamp of next update
        ebool isActive; // Whether the subscription is active
        uint256 creationTime; // Timestamp when subscription was created
        uint256 lastUpdated; // Timestamp when subscription was last updated
    }
    
    struct FinancialAnalytics {
        euint32 analyticsId;
        string asset; // Asset symbol
        euint32 encryptedAveragePrice; // Encrypted average price over period
        euint32 encryptedMaxPrice; // Encrypted maximum price over period
        euint32 encryptedMinPrice; // Encrypted minimum price over period
        euint32 encryptedTotalVolume; // Encrypted total volume over period
        euint32 encryptedPriceVolatility; // Encrypted price volatility measure
        euint32 encryptedDataPoints; // Encrypted number of data points
        ebool isActive; // Whether the analytics are active
        uint256 creationTime; // Timestamp when analytics were created
        uint256 lastUpdated; // Timestamp when analytics were last updated
    }
    
    // Storage mappings
    // Public data mappings (unencrypted)
    mapping(uint256 => PublicMarketData) public publicMarketData;
    mapping(uint256 => PublicMarketOverview) public publicMarketOverview;
    mapping(uint256 => PublicPriceFeed) public publicPriceFeeds;
    
    // Private data mappings (encrypted)
    mapping(uint256 => PrivatePortfolioData) public privatePortfolioData;
    mapping(uint256 => InstitutionalData) public institutionalData;
    mapping(uint256 => TradingPair) public tradingPairs;
    mapping(uint256 => FinancialIndex) public financialIndices;
    mapping(uint256 => RiskMetrics) public riskMetrics;
    mapping(uint256 => FinancialAlert) public financialAlerts;
    mapping(uint256 => FinancialSubscription) public financialSubscriptions;
    mapping(uint256 => FinancialAnalytics) public financialAnalytics;
    
    // Asset mappings for quick lookup
    mapping(string => uint256[]) public assetDataIds;
    mapping(string => uint256[]) public assetFeedIds;
    mapping(string => uint256[]) public assetAlertIds;
    
    // Counters
    uint256 public dataCounter;
    uint256 public marketCounter;
    uint256 public feedCounter;
    uint256 public pairCounter;
    uint256 public indexCounter;
    uint256 public riskCounter;
    uint256 public alertCounter;
    uint256 public subscriptionCounter;
    uint256 public analyticsCounter;
    
    // Access control
    address public owner;
    mapping(address => bool) public oracles;
    
    // Events
    event FinancialDataSubmitted(uint256 indexed dataId, string asset, uint256 price);
    event MarketDataUpdated(uint256 indexed marketId, string marketName, uint256 totalVolume);
    event PriceFeedUpdated(uint256 indexed feedId, string asset, uint256 price);
    event AlertTriggered(uint256 indexed alertId, string asset, string alertType);
    event SubscriptionCreated(uint256 indexed subscriptionId, address subscriber, string asset);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier onlyOracle() {
        require(oracles[msg.sender] || msg.sender == owner, "Only oracle can perform this action");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        oracles[msg.sender] = true;
    }
    
    // Oracle management
    function addOracle(address _oracle) external onlyOwner {
        oracles[_oracle] = true;
    }
    
    function removeOracle(address _oracle) external onlyOwner {
        oracles[_oracle] = false;
    }
    
    // Financial data management
    // Submit public market data (unencrypted)
    function submitPublicMarketData(
        string memory _asset,
        uint256 _price,
        uint256 _volume24h,
        uint256 _marketCap,
        uint256 _high24h,
        uint256 _low24h,
        int256 _change24h,
        uint256 _volatility
    ) external onlyOracle returns (uint256) {
        dataCounter++;
        uint256 dataId = dataCounter;
        
        publicMarketData[dataId] = PublicMarketData({
            dataId: dataId,
            asset: _asset,
            price: _price,
            volume24h: _volume24h,
            marketCap: _marketCap,
            high24h: _high24h,
            low24h: _low24h,
            change24h: _change24h,
            volatility: _volatility,
            isActive: true,
            creationTime: block.timestamp,
            lastUpdated: block.timestamp
        });
        
        emit PublicMarketDataSubmitted(dataId, _asset, _price);
        return dataId;
    }
    
    // Submit private portfolio data (encrypted)
    function submitPrivatePortfolioData(
        externalEuint32 _encryptedTotalValue,
        externalEuint32 _encryptedRiskTolerance,
        externalEuint32 _encryptedInvestmentGoals,
        externalEuint32 _encryptedAssetAllocation,
        externalEuint32 _encryptedPerformanceMetrics,
        externalEbool _encryptedIsHighNetWorth,
        externalEbool _encryptedPrivacyLevel,
        bytes calldata inputProof
    ) external returns (uint256) {
        portfolioCounter++;
        uint256 portfolioId = portfolioCounter;
        
        // Convert external encrypted values to internal
        euint32 internalTotalValue = FHE.fromExternal(_encryptedTotalValue, inputProof);
        euint32 internalRiskTolerance = FHE.fromExternal(_encryptedRiskTolerance, inputProof);
        euint32 internalInvestmentGoals = FHE.fromExternal(_encryptedInvestmentGoals, inputProof);
        euint32 internalAssetAllocation = FHE.fromExternal(_encryptedAssetAllocation, inputProof);
        euint32 internalPerformanceMetrics = FHE.fromExternal(_encryptedPerformanceMetrics, inputProof);
        ebool internalIsHighNetWorth = FHE.fromExternal(_encryptedIsHighNetWorth, inputProof);
        ebool internalPrivacyLevel = FHE.fromExternal(_encryptedPrivacyLevel, inputProof);
        
        privatePortfolioData[portfolioId] = PrivatePortfolioData({
            portfolioId: FHE.asEuint32(uint32(portfolioId)),
            totalValue: internalTotalValue,
            riskTolerance: internalRiskTolerance,
            investmentGoals: internalInvestmentGoals,
            assetAllocation: internalAssetAllocation,
            performanceMetrics: internalPerformanceMetrics,
            isHighNetWorth: internalIsHighNetWorth,
            privacyLevel: internalPrivacyLevel,
            creationTime: block.timestamp,
            lastUpdated: block.timestamp
        });
        
        emit PrivatePortfolioDataSubmitted(portfolioId, msg.sender);
        return portfolioId;
    }
    
    function updateMarketData(
        uint256 _marketId,
        euint32 _encryptedTotalVolume,
        euint32 _encryptedTotalValue,
        euint32 _encryptedActiveAssets,
        euint32 _encryptedMarketIndex
    ) external onlyOracle {
        require(FHE.decrypt(marketData[_marketId].isActive), "Market not active");
        
        marketData[_marketId].encryptedTotalVolume = _encryptedTotalVolume;
        marketData[_marketId].encryptedTotalValue = _encryptedTotalValue;
        marketData[_marketId].encryptedActiveAssets = _encryptedActiveAssets;
        marketData[_marketId].encryptedMarketIndex = _encryptedMarketIndex;
        marketData[_marketId].lastUpdated = block.timestamp;
        
        emit MarketDataUpdated(_marketId, marketData[_marketId].marketName, 0); // Placeholder
    }
    
    function updatePriceFeed(
        uint256 _feedId,
        euint32 _encryptedPrice,
        euint32 _encryptedConfidence,
        euint32 _encryptedLatency
    ) external onlyOracle {
        require(FHE.decrypt(priceFeeds[_feedId].isActive), "Feed not active");
        
        priceFeeds[_feedId].encryptedPrice = _encryptedPrice;
        priceFeeds[_feedId].encryptedConfidence = _encryptedConfidence;
        priceFeeds[_feedId].encryptedLatency = _encryptedLatency;
        priceFeeds[_feedId].lastUpdated = block.timestamp;
        
        emit PriceFeedUpdated(_feedId, priceFeeds[_feedId].asset, 0); // Placeholder
    }
    
    function issueFinancialAlert(
        string memory _asset,
        string memory _alertType,
        string memory _alertLevel,
        string memory _alertMessage,
        euint32 _encryptedThreshold,
        euint32 _encryptedCurrentValue
    ) external onlyOracle returns (uint256) {
        alertCounter++;
        uint256 alertId = alertCounter;
        
        financialAlerts[alertId] = FinancialAlert({
            alertId: FHE.asEuint32(uint32(alertId)),
            asset: _asset,
            alertType: _alertType,
            alertLevel: _alertLevel,
            alertMessage: _alertMessage,
            encryptedThreshold: _encryptedThreshold,
            encryptedCurrentValue: _encryptedCurrentValue,
            encryptedAlertStatus: FHE.asEuint32(1), // Default to Active
            isActive: FHE.asEbool(true),
            creationTime: block.timestamp,
            lastUpdated: block.timestamp
        });
        
        assetAlertIds[_asset].push(alertId);
        
        emit AlertTriggered(alertId, _asset, _alertType);
        return alertId;
    }
    
    // View functions with FHE decryption
    function getFinanceOracleStatistics() external view returns (
        uint256 totalDataPoints,
        uint256 totalMarkets,
        uint256 activeMarkets,
        uint256 totalFeeds,
        uint256 totalPairs,
        uint256 totalIndices,
        uint256 totalRiskMetrics,
        uint256 activeAlerts,
        uint256 totalSubscriptions,
        uint256 activeSubscriptions,
        uint256 totalAnalytics
    ) {
        totalDataPoints = dataCounter;
        totalMarkets = marketCounter;
        activeMarkets = 0; // Would need to count active markets
        totalFeeds = feedCounter;
        totalPairs = pairCounter;
        totalIndices = indexCounter;
        totalRiskMetrics = riskCounter;
        activeAlerts = 0; // Would need to count active alerts
        totalSubscriptions = subscriptionCounter;
        activeSubscriptions = 0; // Would need to count active subscriptions
        totalAnalytics = analyticsCounter;
    }
    
    function getFinancialData(uint256 _dataId) external view returns (
        bytes32 encryptedAsset,
        euint32 encryptedPrice,
        euint32 encryptedVolume,
        euint32 encryptedMarketCap,
        euint32 encryptedHigh24h,
        euint32 encryptedLow24h,
        euint32 encryptedChange24h,
        euint32 encryptedVolatility,
        ebool isActive
    ) {
        FinancialData memory data = financialData[_dataId];
        return (
            data.encryptedAsset,
            data.encryptedPrice,
            data.encryptedVolume,
            data.encryptedMarketCap,
            data.encryptedHigh24h,
            data.encryptedLow24h,
            data.encryptedChange24h,
            data.encryptedVolatility,
            data.isActive
        );
    }
    
    function getPriceFeed(uint256 _feedId) external view returns (
        string memory asset,
        string memory source,
        euint32 encryptedPrice,
        euint32 encryptedConfidence,
        euint32 encryptedLatency,
        ebool isActive
    ) {
        PriceFeed memory feed = priceFeeds[_feedId];
        return (
            feed.asset,
            feed.source,
            feed.encryptedPrice,
            feed.encryptedConfidence,
            feed.encryptedLatency,
            feed.isActive
        );
    }
    
    function getFinancialAlert(uint256 _alertId) external view returns (
        string memory asset,
        string memory alertType,
        string memory alertLevel,
        string memory alertMessage,
        euint32 encryptedThreshold,
        euint32 encryptedCurrentValue,
        euint32 encryptedAlertStatus,
        ebool isActive
    ) {
        FinancialAlert memory alert = financialAlerts[_alertId];
        return (
            alert.asset,
            alert.alertType,
            alert.alertLevel,
            alert.alertMessage,
            alert.encryptedThreshold,
            alert.encryptedCurrentValue,
            alert.encryptedAlertStatus,
            alert.isActive
        );
    }
    
    function getAssetDataIds(string memory _asset) external view returns (uint256[] memory) {
        return assetDataIds[_asset];
    }
    
    function getAssetFeedIds(string memory _asset) external view returns (uint256[] memory) {
        return assetFeedIds[_asset];
    }
    
    function getAssetAlertIds(string memory _asset) external view returns (uint256[] memory) {
        return assetAlertIds[_asset];
    }
    
    // Deactivation functions
    function deactivateFinancialData(uint256 _dataId) external onlyOracle {
        require(FHE.decrypt(financialData[_dataId].isActive), "Financial data not active");
        financialData[_dataId].isActive = FHE.asEbool(false);
    }
    
    function deactivateMarketData(uint256 _marketId) external onlyOracle {
        require(FHE.decrypt(marketData[_marketId].isActive), "Market not active");
        marketData[_marketId].isActive = FHE.asEbool(false);
    }
    
    function deactivatePriceFeed(uint256 _feedId) external onlyOracle {
        require(FHE.decrypt(priceFeeds[_feedId].isActive), "Feed not active");
        priceFeeds[_feedId].isActive = FHE.asEbool(false);
    }
    
    function deactivateTradingPair(uint256 _pairId) external onlyOracle {
        require(FHE.decrypt(tradingPairs[_pairId].isActive), "Pair not active");
        tradingPairs[_pairId].isActive = FHE.asEbool(false);
    }
    
    function deactivateFinancialIndex(uint256 _indexId) external onlyOracle {
        require(FHE.decrypt(financialIndices[_indexId].isActive), "Index not active");
        financialIndices[_indexId].isActive = FHE.asEbool(false);
    }
    
    function deactivateRiskMetrics(uint256 _riskId) external onlyOracle {
        require(FHE.decrypt(riskMetrics[_riskId].isActive), "Risk metrics not active");
        riskMetrics[_riskId].isActive = FHE.asEbool(false);
    }
    
    function deactivateFinancialAlert(uint256 _alertId) external onlyOracle {
        require(FHE.decrypt(financialAlerts[_alertId].isActive), "Alert not active");
        financialAlerts[_alertId].isActive = FHE.asEbool(false);
    }
    
    function deactivateFinancialSubscription(uint256 _subscriptionId) external onlyOracle {
        require(FHE.decrypt(financialSubscriptions[_subscriptionId].isActive), "Subscription not active");
        financialSubscriptions[_subscriptionId].isActive = FHE.asEbool(false);
    }
    
    function deactivateFinancialAnalytics(uint256 _analyticsId) external onlyOracle {
        require(FHE.decrypt(financialAnalytics[_analyticsId].isActive), "Analytics not active");
        financialAnalytics[_analyticsId].isActive = FHE.asEbool(false);
    }
}