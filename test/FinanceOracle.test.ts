import { expect } from "chai";
import { ethers } from "hardhat";
import { FhevmInstance } from "fhevmjs";

describe("FinanceOracle", function () {
  let financeOracle: any;
  let owner: any;
  let oracle: any;
  let dataProvider: any;
  let subscriber: any;
  let fhevm: FhevmInstance;

  beforeEach(async function () {
    [owner, oracle, dataProvider, subscriber] = await ethers.getSigners();
    
    const FinanceOracle = await ethers.getContractFactory("FinanceOracle");
    financeOracle = await FinanceOracle.deploy(oracle.address);
    await financeOracle.waitForDeployment();

    // Initialize FHEVM instance
    fhevm = new FhevmInstance();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await financeOracle.owner()).to.equal(owner.address);
    });

    it("Should set the right oracle", async function () {
      expect(await financeOracle.oracle()).to.equal(oracle.address);
    });

    it("Should initialize counters to zero", async function () {
      expect(await financeOracle.dataCounter()).to.equal(0);
      expect(await financeOracle.marketCounter()).to.equal(0);
      expect(await financeOracle.feedCounter()).to.equal(0);
      expect(await financeOracle.alertCounter()).to.equal(0);
    });
  });

  describe("Financial Data Management", function () {
    it("Should submit financial data", async function () {
      const encryptedAsset = ethers.keccak256(ethers.toUtf8Bytes("BTC"));
      const encryptedTimestamp = ethers.keccak256(ethers.toUtf8Bytes("2024-01-15"));
      const encryptedPrice = fhevm.encrypt32(42350);
      const encryptedVolume = fhevm.encrypt32(24500000000);
      const encryptedMarketCap = fhevm.encrypt32(830000000000);
      const encryptedHigh24h = fhevm.encrypt32(43500);
      const encryptedLow24h = fhevm.encrypt32(41800);
      const encryptedChange24h = fhevm.encrypt32(230); // 2.3% scaled by 100
      const encryptedVolatility = fhevm.encrypt32(1250); // 12.5% scaled by 100
      const encryptedDataHash = ethers.keccak256(ethers.toUtf8Bytes("data-hash"));

      const tx = await financeOracle.submitFinancialData(
        encryptedAsset,
        encryptedTimestamp,
        encryptedPrice,
        encryptedVolume,
        encryptedMarketCap,
        encryptedHigh24h,
        encryptedLow24h,
        encryptedChange24h,
        encryptedVolatility,
        encryptedDataHash
      );

      await expect(tx)
        .to.emit(financeOracle, "FinancialDataSubmitted")
        .withArgs(0, dataProvider.address, encryptedAsset);

      const data = await financeOracle.getFinancialData(0);
      expect(data.price).to.equal(42350);
      expect(data.volume).to.equal(24500000000);
      expect(data.marketCap).to.equal(830000000000);
    });

    it("Should deactivate financial data", async function () {
      // First submit financial data
      const encryptedAsset = ethers.keccak256(ethers.toUtf8Bytes("BTC"));
      const encryptedTimestamp = ethers.keccak256(ethers.toUtf8Bytes("2024-01-15"));
      const encryptedPrice = fhevm.encrypt32(42350);
      const encryptedVolume = fhevm.encrypt32(24500000000);
      const encryptedMarketCap = fhevm.encrypt32(830000000000);
      const encryptedHigh24h = fhevm.encrypt32(43500);
      const encryptedLow24h = fhevm.encrypt32(41800);
      const encryptedChange24h = fhevm.encrypt32(230);
      const encryptedVolatility = fhevm.encrypt32(1250);
      const encryptedDataHash = ethers.keccak256(ethers.toUtf8Bytes("data-hash"));

      await financeOracle.submitFinancialData(
        encryptedAsset,
        encryptedTimestamp,
        encryptedPrice,
        encryptedVolume,
        encryptedMarketCap,
        encryptedHigh24h,
        encryptedLow24h,
        encryptedChange24h,
        encryptedVolatility,
        encryptedDataHash
      );

      // Deactivate the data
      await financeOracle.deactivateFinancialData(0);

      const data = await financeOracle.getFinancialData(0);
      expect(data.isActive).to.be.false;
    });
  });

  describe("Market Data Management", function () {
    it("Should update market data", async function () {
      const encryptedMarketName = ethers.keccak256(ethers.toUtf8Bytes("Crypto Market"));
      const encryptedMarketType = ethers.keccak256(ethers.toUtf8Bytes("Cryptocurrency"));
      const encryptedMarketStatus = ethers.keccak256(ethers.toUtf8Bytes("Open"));
      const encryptedTotalVolume = fhevm.encrypt32(2400000000);
      const encryptedTotalValue = fhevm.encrypt32(1800000000000);
      const encryptedActiveAssets = fhevm.encrypt32(856);
      const encryptedMarketIndex = fhevm.encrypt32(4250);

      const tx = await financeOracle.connect(oracle).updateMarketData(
        encryptedMarketName,
        encryptedMarketType,
        encryptedMarketStatus,
        encryptedTotalVolume,
        encryptedTotalValue,
        encryptedActiveAssets,
        encryptedMarketIndex
      );

      await expect(tx)
        .to.emit(financeOracle, "MarketDataUpdated")
        .withArgs(0, encryptedMarketName);

      const market = await financeOracle.getMarketData(0);
      expect(market.totalVolume).to.equal(2400000000);
      expect(market.totalValue).to.equal(1800000000000);
      expect(market.activeAssets).to.equal(856);
    });

    it("Should not allow non-oracle to update market data", async function () {
      const encryptedMarketName = ethers.keccak256(ethers.toUtf8Bytes("Crypto Market"));
      const encryptedMarketType = ethers.keccak256(ethers.toUtf8Bytes("Cryptocurrency"));
      const encryptedMarketStatus = ethers.keccak256(ethers.toUtf8Bytes("Open"));
      const encryptedTotalVolume = fhevm.encrypt32(2400000000);
      const encryptedTotalValue = fhevm.encrypt32(1800000000000);
      const encryptedActiveAssets = fhevm.encrypt32(856);
      const encryptedMarketIndex = fhevm.encrypt32(4250);

      await expect(
        financeOracle.connect(dataProvider).updateMarketData(
          encryptedMarketName,
          encryptedMarketType,
          encryptedMarketStatus,
          encryptedTotalVolume,
          encryptedTotalValue,
          encryptedActiveAssets,
          encryptedMarketIndex
        )
      ).to.be.revertedWith("Only oracle can update market data");
    });
  });

  describe("Price Feed Management", function () {
    it("Should update price feed", async function () {
      const encryptedAsset = ethers.keccak256(ethers.toUtf8Bytes("BTC"));
      const encryptedSource = ethers.keccak256(ethers.toUtf8Bytes("CoinGecko"));
      const encryptedPrice = fhevm.encrypt32(42350);
      const encryptedConfidence = fhevm.encrypt32(98);
      const encryptedLatency = fhevm.encrypt32(150);
      const encryptedFeedHash = ethers.keccak256(ethers.toUtf8Bytes("feed-hash"));

      const tx = await financeOracle.connect(oracle).updatePriceFeed(
        encryptedAsset,
        encryptedSource,
        encryptedPrice,
        encryptedConfidence,
        encryptedLatency,
        encryptedFeedHash
      );

      await expect(tx)
        .to.emit(financeOracle, "PriceFeedUpdated")
        .withArgs(0, encryptedAsset);

      const feed = await financeOracle.getPriceFeed(0);
      expect(feed.price).to.equal(42350);
      expect(feed.confidence).to.equal(98);
      expect(feed.latency).to.equal(150);
    });

    it("Should not allow non-oracle to update price feeds", async function () {
      const encryptedAsset = ethers.keccak256(ethers.toUtf8Bytes("BTC"));
      const encryptedSource = ethers.keccak256(ethers.toUtf8Bytes("CoinGecko"));
      const encryptedPrice = fhevm.encrypt32(42350);
      const encryptedConfidence = fhevm.encrypt32(98);
      const encryptedLatency = fhevm.encrypt32(150);
      const encryptedFeedHash = ethers.keccak256(ethers.toUtf8Bytes("feed-hash"));

      await expect(
        financeOracle.connect(dataProvider).updatePriceFeed(
          encryptedAsset,
          encryptedSource,
          encryptedPrice,
          encryptedConfidence,
          encryptedLatency,
          encryptedFeedHash
        )
      ).to.be.revertedWith("Only oracle can update price feeds");
    });
  });

  describe("Trading Pair Management", function () {
    it("Should create trading pair", async function () {
      const encryptedBaseAsset = ethers.keccak256(ethers.toUtf8Bytes("BTC"));
      const encryptedQuoteAsset = ethers.keccak256(ethers.toUtf8Bytes("USD"));
      const encryptedPairSymbol = ethers.keccak256(ethers.toUtf8Bytes("BTC/USD"));
      const encryptedBasePrice = fhevm.encrypt32(42350);
      const encryptedQuotePrice = fhevm.encrypt32(1);
      const encryptedSpread = fhevm.encrypt32(50);
      const encryptedLiquidity = fhevm.encrypt32(1000000);

      const tx = await financeOracle.connect(oracle).createTradingPair(
        encryptedBaseAsset,
        encryptedQuoteAsset,
        encryptedPairSymbol,
        encryptedBasePrice,
        encryptedQuotePrice,
        encryptedSpread,
        encryptedLiquidity
      );

      await expect(tx)
        .to.emit(financeOracle, "TradingPairCreated")
        .withArgs(0, encryptedBaseAsset, encryptedQuoteAsset);

      const pair = await financeOracle.getTradingPair(0);
      expect(pair.basePrice).to.equal(42350);
      expect(pair.quotePrice).to.equal(1);
      expect(pair.spread).to.equal(50);
      expect(pair.liquidity).to.equal(1000000);
    });
  });

  describe("Financial Index Management", function () {
    it("Should calculate financial index", async function () {
      const encryptedIndexName = ethers.keccak256(ethers.toUtf8Bytes("S&P 500"));
      const encryptedIndexType = ethers.keccak256(ethers.toUtf8Bytes("Price Index"));
      const encryptedIndexValue = fhevm.encrypt32(4567);
      const encryptedIndexChange = fhevm.encrypt32(80); // 0.8% scaled by 100
      const encryptedIndexWeight = fhevm.encrypt32(100);
      const encryptedIndexHash = ethers.keccak256(ethers.toUtf8Bytes("index-hash"));

      const tx = await financeOracle.connect(oracle).calculateFinancialIndex(
        encryptedIndexName,
        encryptedIndexType,
        encryptedIndexValue,
        encryptedIndexChange,
        encryptedIndexWeight,
        encryptedIndexHash
      );

      await expect(tx)
        .to.emit(financeOracle, "FinancialIndexCalculated")
        .withArgs(0, encryptedIndexName);

      const index = await financeOracle.getFinancialIndex(0);
      expect(index.indexValue).to.equal(4567);
      expect(index.indexChange).to.equal(80);
      expect(index.indexWeight).to.equal(100);
    });
  });

  describe("Risk Metrics Management", function () {
    it("Should calculate risk metrics", async function () {
      const encryptedAsset = ethers.keccak256(ethers.toUtf8Bytes("BTC"));
      const encryptedVaR = fhevm.encrypt32(5000); // 5% VaR
      const encryptedBeta = fhevm.encrypt32(120); // 1.2 beta
      const encryptedSharpeRatio = fhevm.encrypt32(180); // 1.8 Sharpe ratio
      const encryptedMaxDrawdown = fhevm.encrypt32(2500); // 25% max drawdown
      const encryptedVolatility = fhevm.encrypt32(1250); // 12.5% volatility
      const encryptedRiskHash = ethers.keccak256(ethers.toUtf8Bytes("risk-hash"));

      const tx = await financeOracle.connect(oracle).calculateRiskMetrics(
        encryptedAsset,
        encryptedVaR,
        encryptedBeta,
        encryptedSharpeRatio,
        encryptedMaxDrawdown,
        encryptedVolatility,
        encryptedRiskHash
      );

      await expect(tx)
        .to.emit(financeOracle, "RiskMetricsCalculated")
        .withArgs(0, encryptedAsset);

      const risk = await financeOracle.getRiskMetrics(0);
      expect(risk.var).to.equal(5000);
      expect(risk.beta).to.equal(120);
      expect(risk.sharpeRatio).to.equal(180);
      expect(risk.maxDrawdown).to.equal(2500);
      expect(risk.volatility).to.equal(1250);
    });
  });

  describe("Financial Alert Management", function () {
    it("Should issue financial alert", async function () {
      const encryptedAsset = ethers.keccak256(ethers.toUtf8Bytes("BTC"));
      const encryptedAlertType = ethers.keccak256(ethers.toUtf8Bytes("Price Alert"));
      const encryptedAlertLevel = ethers.keccak256(ethers.toUtf8Bytes("High"));
      const encryptedAlertMessage = ethers.keccak256(ethers.toUtf8Bytes("Bitcoin price above $45,000"));
      const encryptedThreshold = fhevm.encrypt32(45000);
      const encryptedCurrentValue = fhevm.encrypt32(42350);

      const tx = await financeOracle.connect(oracle).issueFinancialAlert(
        encryptedAsset,
        encryptedAlertType,
        encryptedAlertLevel,
        encryptedAlertMessage,
        encryptedThreshold,
        encryptedCurrentValue
      );

      await expect(tx)
        .to.emit(financeOracle, "FinancialAlertIssued")
        .withArgs(0, encryptedAsset);

      const alert = await financeOracle.getFinancialAlert(0);
      expect(alert.threshold).to.equal(45000);
      expect(alert.currentValue).to.equal(42350);
      expect(alert.alertStatus).to.equal(1); // Active
    });

    it("Should update alert status", async function () {
      // First issue an alert
      const encryptedAsset = ethers.keccak256(ethers.toUtf8Bytes("BTC"));
      const encryptedAlertType = ethers.keccak256(ethers.toUtf8Bytes("Price Alert"));
      const encryptedAlertLevel = ethers.keccak256(ethers.toUtf8Bytes("High"));
      const encryptedAlertMessage = ethers.keccak256(ethers.toUtf8Bytes("Bitcoin price above $45,000"));
      const encryptedThreshold = fhevm.encrypt32(45000);
      const encryptedCurrentValue = fhevm.encrypt32(42350);

      await financeOracle.connect(oracle).issueFinancialAlert(
        encryptedAsset,
        encryptedAlertType,
        encryptedAlertLevel,
        encryptedAlertMessage,
        encryptedThreshold,
        encryptedCurrentValue
      );

      // Update status to triggered
      const encryptedNewStatus = fhevm.encrypt32(2); // Triggered
      await financeOracle.connect(oracle).updateFinancialAlertStatus(0, encryptedNewStatus);

      const alert = await financeOracle.getFinancialAlert(0);
      expect(alert.alertStatus).to.equal(2);
    });
  });

  describe("Financial Subscription Management", function () {
    it("Should create financial subscription", async function () {
      const encryptedAsset = ethers.keccak256(ethers.toUtf8Bytes("BTC"));
      const encryptedUpdateFrequency = fhevm.encrypt32(60); // 60 seconds
      const encryptedDataTypes = fhevm.encrypt32(7); // All data types

      const tx = await financeOracle.connect(subscriber).createFinancialSubscription(
        encryptedAsset,
        encryptedUpdateFrequency,
        encryptedDataTypes
      );

      await expect(tx)
        .to.emit(financeOracle, "FinancialSubscriptionCreated")
        .withArgs(0, subscriber.address);

      const subscription = await financeOracle.getFinancialSubscription(0);
      expect(subscription.subscriber).to.equal(subscriber.address);
      expect(subscription.updateFrequency).to.equal(60);
      expect(subscription.dataTypes).to.equal(7);
    });

    it("Should not allow duplicate subscription to same asset", async function () {
      const encryptedAsset = ethers.keccak256(ethers.toUtf8Bytes("BTC"));
      const encryptedUpdateFrequency = fhevm.encrypt32(60);
      const encryptedDataTypes = fhevm.encrypt32(7);

      await financeOracle.connect(subscriber).createFinancialSubscription(
        encryptedAsset,
        encryptedUpdateFrequency,
        encryptedDataTypes
      );

      await expect(
        financeOracle.connect(subscriber).createFinancialSubscription(
          encryptedAsset,
          encryptedUpdateFrequency,
          encryptedDataTypes
        )
      ).to.be.revertedWith("Already subscribed to this asset");
    });

    it("Should update subscription status", async function () {
      // First create a subscription
      const encryptedAsset = ethers.keccak256(ethers.toUtf8Bytes("BTC"));
      const encryptedUpdateFrequency = fhevm.encrypt32(60);
      const encryptedDataTypes = fhevm.encrypt32(7);

      await financeOracle.connect(subscriber).createFinancialSubscription(
        encryptedAsset,
        encryptedUpdateFrequency,
        encryptedDataTypes
      );

      // Update status to paused
      const encryptedNewStatus = fhevm.encrypt32(2); // Paused
      await financeOracle.connect(subscriber).updateFinancialSubscriptionStatus(0, encryptedNewStatus);

      const subscription = await financeOracle.getFinancialSubscription(0);
      expect(subscription.subscriptionStatus).to.equal(2);
    });
  });

  describe("Financial Analytics", function () {
    it("Should calculate financial analytics", async function () {
      const encryptedAsset = ethers.keccak256(ethers.toUtf8Bytes("BTC"));
      const encryptedTimePeriod = ethers.keccak256(ethers.toUtf8Bytes("2024-01-01 to 2024-01-31"));
      const encryptedAveragePrice = fhevm.encrypt32(42000);
      const encryptedMaxPrice = fhevm.encrypt32(45000);
      const encryptedMinPrice = fhevm.encrypt32(38000);
      const encryptedTotalVolume = fhevm.encrypt32(500000000000);
      const encryptedPriceVolatility = fhevm.encrypt32(1250); // 12.5%
      const encryptedDataPoints = fhevm.encrypt32(744);
      const encryptedAnalyticsHash = ethers.keccak256(ethers.toUtf8Bytes("analytics-hash"));

      const tx = await financeOracle.connect(oracle).calculateFinancialAnalytics(
        encryptedAsset,
        encryptedTimePeriod,
        encryptedAveragePrice,
        encryptedMaxPrice,
        encryptedMinPrice,
        encryptedTotalVolume,
        encryptedPriceVolatility,
        encryptedDataPoints,
        encryptedAnalyticsHash
      );

      await expect(tx)
        .to.emit(financeOracle, "FinancialAnalyticsCalculated")
        .withArgs(0, encryptedAsset);

      const analytics = await financeOracle.getFinancialAnalytics(0);
      expect(analytics.averagePrice).to.equal(42000);
      expect(analytics.maxPrice).to.equal(45000);
      expect(analytics.minPrice).to.equal(38000);
      expect(analytics.totalVolume).to.equal(500000000000);
      expect(analytics.dataPoints).to.equal(744);
    });
  });

  describe("Statistics", function () {
    it("Should return correct statistics", async function () {
      const stats = await financeOracle.getFinanceOracleStatistics();
      expect(stats.totalDataPoints).to.equal(0);
      expect(stats.totalMarkets).to.equal(0);
      expect(stats.activeMarkets).to.equal(0);
      expect(stats.totalFeeds).to.equal(0);
      expect(stats.totalPairs).to.equal(0);
      expect(stats.totalIndices).to.equal(0);
      expect(stats.totalRiskMetrics).to.equal(0);
      expect(stats.activeAlerts).to.equal(0);
      expect(stats.totalSubscriptions).to.equal(0);
      expect(stats.activeSubscriptions).to.equal(0);
      expect(stats.totalAnalytics).to.equal(0);
    });
  });

  describe("Access Control", function () {
    it("Should only allow oracle to update market data", async function () {
      const encryptedMarketName = ethers.keccak256(ethers.toUtf8Bytes("Crypto Market"));
      const encryptedMarketType = ethers.keccak256(ethers.toUtf8Bytes("Cryptocurrency"));
      const encryptedMarketStatus = ethers.keccak256(ethers.toUtf8Bytes("Open"));
      const encryptedTotalVolume = fhevm.encrypt32(2400000000);
      const encryptedTotalValue = fhevm.encrypt32(1800000000000);
      const encryptedActiveAssets = fhevm.encrypt32(856);
      const encryptedMarketIndex = fhevm.encrypt32(4250);

      await expect(
        financeOracle.connect(dataProvider).updateMarketData(
          encryptedMarketName,
          encryptedMarketType,
          encryptedMarketStatus,
          encryptedTotalVolume,
          encryptedTotalValue,
          encryptedActiveAssets,
          encryptedMarketIndex
        )
      ).to.be.revertedWith("Only oracle can update market data");
    });

    it("Should only allow oracle to issue alerts", async function () {
      const encryptedAsset = ethers.keccak256(ethers.toUtf8Bytes("BTC"));
      const encryptedAlertType = ethers.keccak256(ethers.toUtf8Bytes("Price Alert"));
      const encryptedAlertLevel = ethers.keccak256(ethers.toUtf8Bytes("High"));
      const encryptedAlertMessage = ethers.keccak256(ethers.toUtf8Bytes("Bitcoin price above $45,000"));
      const encryptedThreshold = fhevm.encrypt32(45000);
      const encryptedCurrentValue = fhevm.encrypt32(42350);

      await expect(
        financeOracle.connect(dataProvider).issueFinancialAlert(
          encryptedAsset,
          encryptedAlertType,
          encryptedAlertLevel,
          encryptedAlertMessage,
          encryptedThreshold,
          encryptedCurrentValue
        )
      ).to.be.revertedWith("Only oracle can issue alerts");
    });
  });
});