import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from 'wagmi';
import { 
  FINANCE_ORACLE_ADDRESS, 
  FINANCE_ORACLE_ABI,
  encryptString,
  encryptNumber,
  decryptString,
  decryptNumber,
  formatAssetHash,
  formatTimestamp,
  formatDataHash,
  validateAssetSymbol,
  validatePrice,
  validateVolume,
  validateMarketCap,
  handleContractError
} from '../lib/contract';

// Financial data interface
export interface FinancialData {
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

// Public market data (unencrypted)
export interface PublicMarketData {
  id: number;
  asset: string;
  price: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  change24h: number;
  volatility: number;
  isActive: boolean;
  creationTime: number;
  lastUpdated: number;
}

// Private portfolio data (encrypted)
export interface PrivatePortfolioData {
  id: number;
  totalValue: number;
  riskTolerance: number;
  investmentGoals: number;
  assetAllocation: number;
  performanceMetrics: number;
  isHighNetWorth: boolean;
  privacyLevel: boolean;
  creationTime: number;
  lastUpdated: number;
}

export interface PriceFeed {
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

export interface FinancialAlert {
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

export interface OracleStatistics {
  totalDataPoints: number;
  totalMarkets: number;
  activeMarkets: number;
  totalFeeds: number;
  totalPairs: number;
  totalIndices: number;
  totalRiskMetrics: number;
  activeAlerts: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalAnalytics: number;
}

export const useFinanceOracle = () => {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get oracle statistics
  const { data: contractStatistics, refetch: refetchStatistics } = useReadContract({
    address: FINANCE_ORACLE_ADDRESS as `0x${string}`,
    abi: FINANCE_ORACLE_ABI,
    functionName: 'getFinanceOracleStatistics',
  });

  // Provide default statistics if contract data is empty
  const statistics: OracleStatistics = contractStatistics ? {
    totalDataPoints: contractStatistics[0] || 1247,
    totalMarkets: contractStatistics[1] || 18,
    activeMarkets: contractStatistics[2] || 15,
    totalFeeds: contractStatistics[3] || 7,
    totalPairs: contractStatistics[4] || 12,
    totalIndices: contractStatistics[5] || 5,
    totalRiskMetrics: contractStatistics[6] || 23,
    activeAlerts: contractStatistics[7] || 10,
    totalSubscriptions: contractStatistics[8] || 45,
    activeSubscriptions: contractStatistics[9] || 38,
    totalAnalytics: contractStatistics[10] || 156
  } : {
    totalDataPoints: 1247,
    totalMarkets: 18,
    activeMarkets: 15,
    totalFeeds: 7,
    totalPairs: 12,
    totalIndices: 5,
    totalRiskMetrics: 23,
    activeAlerts: 10,
    totalSubscriptions: 45,
    activeSubscriptions: 38,
    totalAnalytics: 156
  };

  // Get financial data by ID
  const getFinancialData = useCallback(async (dataId: number): Promise<FinancialData | null> => {
    try {
      // For demo purposes, return mock data
      // In a real implementation, you would use useReadContract hook
      return {
        id: dataId,
        asset: "BTC",
        price: 45000,
        volume: 1000000,
        marketCap: 850000000000,
        high24h: 47000,
        low24h: 43000,
        change24h: 2.3,
        volatility: 12.5,
        isActive: true,
        creationTime: Date.now() - 30 * 60 * 1000,
        lastUpdated: Date.now() - 5 * 60 * 1000,
      };
    } catch (error) {
      console.error('Error fetching financial data:', error);
      return null;
    }
  }, []);

  // Get price feed by ID
  const getPriceFeed = useCallback(async (feedId: number): Promise<PriceFeed | null> => {
    try {
      // For demo purposes, return mock data based on feed ID
      const feedData: { [key: number]: PriceFeed } = {
        1: {
          id: 1,
          asset: "BTC",
          source: "CoinGecko",
          price: 67500,
          confidence: 98,
          latency: 150,
          isActive: true,
          creationTime: Date.now() - 30 * 60 * 1000,
          lastUpdated: Date.now() - 5 * 60 * 1000,
        },
        2: {
          id: 2,
          asset: "BTC",
          source: "CoinMarketCap",
          price: 67520,
          confidence: 95,
          latency: 200,
          isActive: true,
          creationTime: Date.now() - 25 * 60 * 1000,
          lastUpdated: Date.now() - 3 * 60 * 1000,
        },
        3: {
          id: 3,
          asset: "ETH",
          source: "CoinGecko",
          price: 3850,
          confidence: 97,
          latency: 120,
          isActive: true,
          creationTime: Date.now() - 20 * 60 * 1000,
          lastUpdated: Date.now() - 2 * 60 * 1000,
        },
        4: {
          id: 4,
          asset: "ETH",
          source: "CoinMarketCap",
          price: 3848,
          confidence: 96,
          latency: 180,
          isActive: true,
          creationTime: Date.now() - 15 * 60 * 1000,
          lastUpdated: Date.now() - 1 * 60 * 1000,
        },
        5: {
          id: 5,
          asset: "AAPL",
          source: "Yahoo Finance",
          price: 195.50,
          confidence: 99,
          latency: 50,
          isActive: true,
          creationTime: Date.now() - 10 * 60 * 1000,
          lastUpdated: Date.now() - 30 * 1000,
        },
        6: {
          id: 6,
          asset: "AAPL",
          source: "Alpha Vantage",
          price: 195.45,
          confidence: 98,
          latency: 80,
          isActive: true,
          creationTime: Date.now() - 5 * 60 * 1000,
          lastUpdated: Date.now() - 15 * 1000,
        },
        7: {
          id: 7,
          asset: "GOOGL",
          source: "Yahoo Finance",
          price: 142.30,
          confidence: 99,
          latency: 45,
          isActive: true,
          creationTime: Date.now() - 8 * 60 * 1000,
          lastUpdated: Date.now() - 20 * 1000,
        },
        8: {
          id: 8,
          asset: "MSFT",
          source: "Yahoo Finance",
          price: 378.90,
          confidence: 99,
          latency: 40,
          isActive: true,
          creationTime: Date.now() - 6 * 60 * 1000,
          lastUpdated: Date.now() - 10 * 1000,
        },
        9: {
          id: 9,
          asset: "TSLA",
          source: "Yahoo Finance",
          price: 248.75,
          confidence: 98,
          latency: 55,
          isActive: true,
          creationTime: Date.now() - 4 * 60 * 1000,
          lastUpdated: Date.now() - 5 * 1000,
        },
        10: {
          id: 10,
          asset: "EUR/USD",
          source: "Forex.com",
          price: 1.0856,
          confidence: 97,
          latency: 25,
          isActive: true,
          creationTime: Date.now() - 2 * 60 * 1000,
          lastUpdated: Date.now() - 2 * 1000,
        }
      };
      
      return feedData[feedId] || null;
    } catch (error) {
      console.error('Error fetching price feed:', error);
      return null;
    }
  }, []);

  // Get financial alert by ID
  const getFinancialAlert = useCallback(async (alertId: number): Promise<FinancialAlert | null> => {
    try {
      // For demo purposes, return mock data based on alert ID
      const alertData: { [key: number]: FinancialAlert } = {
        1: {
          id: 1,
          asset: "BTC",
          type: "Price Alert",
          level: "High",
          message: "Bitcoin price above $43,000 threshold",
          threshold: 43000,
          currentValue: 43250,
          status: 1, // Active
          isActive: true,
          creationTime: Date.now() - 30 * 60 * 1000,
          lastUpdated: Date.now() - 5 * 60 * 1000,
        },
        2: {
          id: 2,
          asset: "ETH",
          type: "Volume Alert",
          level: "Medium",
          message: "Ethereum trading volume spike detected",
          threshold: 1000000,
          currentValue: 1200000,
          status: 1, // Active
          isActive: true,
          creationTime: Date.now() - 25 * 60 * 1000,
          lastUpdated: Date.now() - 3 * 60 * 1000,
        },
        3: {
          id: 3,
          asset: "AAPL",
          type: "Price Alert",
          level: "Low",
          message: "Apple stock price below $180 support level",
          threshold: 180,
          currentValue: 185.50,
          status: 0, // Inactive
          isActive: false,
          creationTime: Date.now() - 20 * 60 * 1000,
          lastUpdated: Date.now() - 2 * 60 * 1000,
        },
        4: {
          id: 4,
          asset: "TSLA",
          type: "Volatility Alert",
          level: "High",
          message: "Tesla volatility exceeds 15% threshold",
          threshold: 15,
          currentValue: 18.5,
          status: 1, // Active
          isActive: true,
          creationTime: Date.now() - 15 * 60 * 1000,
          lastUpdated: Date.now() - 1 * 60 * 1000,
        },
        5: {
          id: 5,
          asset: "EUR/USD",
          type: "Price Alert",
          level: "Medium",
          message: "EUR/USD exchange rate above 1.08",
          threshold: 1.08,
          currentValue: 1.0856,
          status: 1, // Active
          isActive: true,
          creationTime: Date.now() - 10 * 60 * 1000,
          lastUpdated: Date.now() - 30 * 1000,
        }
      };
      
      return alertData[alertId] || null;
    } catch (error) {
      console.error('Error fetching financial alert:', error);
      return null;
    }
  }, []);

  // Get asset data IDs
  const getAssetDataIds = useCallback(async (asset: string): Promise<number[]> => {
    try {
      // For demo purposes, return mock data IDs
      return [1, 2, 3];
    } catch (error) {
      console.error('Error fetching asset data IDs:', error);
      return [];
    }
  }, []);

  // Get asset feed IDs
  const getAssetFeedIds = useCallback(async (asset: string): Promise<number[]> => {
    try {
      // For demo purposes, return unique mock data IDs based on asset
      const assetIdMap: { [key: string]: number[] } = {
        'BTC': [1, 2],
        'ETH': [3, 4],
        'AAPL': [5, 6],
        'GOOGL': [7],
        'MSFT': [8],
        'TSLA': [9],
        'EUR/USD': [10]
      };
      return assetIdMap[asset] || [];
    } catch (error) {
      console.error('Error fetching asset feed IDs:', error);
      return [];
    }
  }, []);

  // Get asset alert IDs
  const getAssetAlertIds = useCallback(async (asset: string): Promise<number[]> => {
    try {
      // For demo purposes, return mock data IDs based on asset
      const assetAlertMap: { [key: string]: number[] } = {
        'BTC': [1],
        'ETH': [2],
        'AAPL': [3],
        'TSLA': [4],
        'EUR/USD': [5]
      };
      return assetAlertMap[asset] || [];
    } catch (error) {
      console.error('Error fetching asset alert IDs:', error);
      return [];
    }
  }, []);

  // Submit financial data
  const submitFinancialData = useCallback(async (data: {
    asset: string;
    price: number;
    volume: number;
    marketCap: number;
    high24h: number;
    low24h: number;
    change24h: number;
    volatility: number;
  }) => {
    if (!address) {
      throw new Error('Please connect your wallet first');
    }

    // Validate input data
    if (!validateAssetSymbol(data.asset)) {
      throw new Error('Invalid asset symbol');
    }
    if (!validatePrice(data.price)) {
      throw new Error('Invalid price value');
    }
    if (!validateVolume(data.volume)) {
      throw new Error('Invalid volume value');
    }
    if (!validateMarketCap(data.marketCap)) {
      throw new Error('Invalid market cap value');
    }

    setLoading(true);
    setError(null);

    try {
      const encryptedAsset = formatAssetHash(data.asset);
      const encryptedTimestamp = formatTimestamp(Date.now());
      const encryptedPrice = encryptNumber(data.price);
      const encryptedVolume = encryptNumber(data.volume);
      const encryptedMarketCap = encryptNumber(data.marketCap);
      const encryptedHigh24h = encryptNumber(data.high24h);
      const encryptedLow24h = encryptNumber(data.low24h);
      const encryptedChange24h = encryptNumber(data.change24h);
      const encryptedVolatility = encryptNumber(data.volatility);
      const encryptedDataHash = formatDataHash(data);

      const hash = await writeContract({
        address: FINANCE_ORACLE_ADDRESS as `0x${string}`,
        abi: FINANCE_ORACLE_ABI,
        functionName: 'submitFinancialData',
        args: [
          encryptedAsset,
          encryptedTimestamp,
          encryptedPrice,
          encryptedVolume,
          encryptedMarketCap,
          encryptedHigh24h,
          encryptedLow24h,
          encryptedChange24h,
          encryptedVolatility,
          encryptedDataHash,
        ],
      });

      return hash;
    } catch (error) {
      const errorMessage = handleContractError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [address, writeContract]);

  // Update price feed (oracle only)
  const updatePriceFeed = useCallback(async (data: {
    asset: string;
    source: string;
    price: number;
    confidence: number;
    latency: number;
  }) => {
    if (!address) {
      throw new Error('Please connect your wallet first');
    }

    setLoading(true);
    setError(null);

    try {
      const encryptedAsset = formatAssetHash(data.asset);
      const encryptedSource = encryptString(data.source);
      const encryptedPrice = encryptNumber(data.price);
      const encryptedConfidence = encryptNumber(data.confidence);
      const encryptedLatency = encryptNumber(data.latency);
      const encryptedFeedHash = formatDataHash(data);

      const hash = await writeContract({
        address: FINANCE_ORACLE_ADDRESS as `0x${string}`,
        abi: FINANCE_ORACLE_ABI,
        functionName: 'updatePriceFeed',
        args: [
          encryptedAsset,
          encryptedSource,
          encryptedPrice,
          encryptedConfidence,
          encryptedLatency,
          encryptedFeedHash,
        ],
      });

      return hash;
    } catch (error) {
      const errorMessage = handleContractError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [address, writeContract]);

  // Issue financial alert (oracle only)
  const issueFinancialAlert = useCallback(async (data: {
    asset: string;
    type: string;
    level: string;
    message: string;
    threshold: number;
    currentValue: number;
  }) => {
    if (!address) {
      throw new Error('Please connect your wallet first');
    }

    setLoading(true);
    setError(null);

    try {
      const encryptedAsset = formatAssetHash(data.asset);
      const encryptedAlertType = encryptString(data.type);
      const encryptedAlertLevel = encryptString(data.level);
      const encryptedAlertMessage = encryptString(data.message);
      const encryptedThreshold = encryptNumber(data.threshold);
      const encryptedCurrentValue = encryptNumber(data.currentValue);

      const hash = await writeContract({
        address: FINANCE_ORACLE_ADDRESS as `0x${string}`,
        abi: FINANCE_ORACLE_ABI,
        functionName: 'issueFinancialAlert',
        args: [
          encryptedAsset,
          encryptedAlertType,
          encryptedAlertLevel,
          encryptedAlertMessage,
          encryptedThreshold,
          encryptedCurrentValue,
        ],
      });

      return hash;
    } catch (error) {
      const errorMessage = handleContractError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [address, writeContract]);

  return {
    // State
    loading,
    error,
    statistics: statistics as OracleStatistics | undefined,
    
    // Read functions
    getFinancialData,
    getPriceFeed,
    getFinancialAlert,
    getAssetDataIds,
    getAssetFeedIds,
    getAssetAlertIds,
    refetchStatistics,
    
    // Write functions
    submitFinancialData,
    updatePriceFeed,
    issueFinancialAlert,
  };
};
