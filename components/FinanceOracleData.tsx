"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { useFinanceOracle } from "../hooks/useFinanceOracle";

export default function FinanceOracleData() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  
  const [financialData, setFinancialData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newData, setNewData] = useState({
    asset: "",
    price: "",
    volume: "",
    marketCap: "",
  });

  const { 
    getFinancialData, 
    getAssetDataIds,
    submitFinancialData,
    loading: contractLoading,
    error: contractError 
  } = useFinanceOracle();

  // Load financial data from blockchain
  useEffect(() => {
    const loadFinancialData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get data IDs for common assets
        const commonAssets = ["BTC", "ETH", "AAPL", "GOOGL", "MSFT"];
        const allData: any[] = [];
        
        for (const asset of commonAssets) {
          try {
            const dataIds = await getAssetDataIds(asset);
            for (const dataId of dataIds) {
              const data = await getFinancialData(dataId);
              if (data) {
                allData.push({
                  ...data,
                  provider: "0x" + Math.random().toString(16).substr(2, 8) + "...",
                  isValid: data.isActive
                });
              }
            }
          } catch (err) {
            console.warn(`Failed to load data for ${asset}:`, err);
          }
        }
        
        setFinancialData(allData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load financial data');
      } finally {
        setLoading(false);
      }
    };

    loadFinancialData();
  }, [getFinancialData, getAssetDataIds]);

  const handleSubmitData = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    if (!newData.asset.trim() || !newData.price || !newData.volume || !newData.marketCap) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const price = parseFloat(newData.price);
      const volume = parseFloat(newData.volume);
      const marketCap = parseFloat(newData.marketCap);

      // Calculate additional fields
      const high24h = price * 1.05; // 5% higher
      const low24h = price * 0.95; // 5% lower
      const change24h = (Math.random() - 0.5) * 10; // Random change between -5% and +5%
      const volatility = Math.random() * 20; // Random volatility between 0-20%

      await submitFinancialData({
        asset: newData.asset,
        price,
        volume,
        marketCap,
        high24h,
        low24h,
        change24h,
        volatility
      });

      alert("Financial data submitted successfully!");
      setNewData({
        asset: "",
        price: "",
        volume: "",
        marketCap: "",
      });
      
      // Reload data
      window.location.reload();
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit financial data: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewData({
      ...newData,
      [e.target.name]: e.target.value,
    });
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (60 * 1000));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const getAssetIcon = (asset: string) => {
    switch (asset) {
      case "BTC":
        return "₿";
      case "ETH":
        return "Ξ";
      case "AAPL":
        return "🍎";
      case "GOOGL":
        return "🔍";
      case "TSLA":
        return "🚗";
      default:
        return "💰";
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(1)}K`;
    }
    return `$${price}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `${(volume / 1000000000).toFixed(1)}B`;
    }
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000000) {
      return `$${(marketCap / 1000000000000).toFixed(1)}T`;
    }
    if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(1)}B`;
    }
    if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(1)}M`;
    }
    return `$${marketCap}`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="finance-oracle-card rounded-2xl p-12">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-6"></div>
            <p className="text-amber-300 text-lg">Loading financial data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Submit New Data */}
      <div className="finance-oracle-card rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          💰 Submit Financial Data
        </h2>
        
        <form onSubmit={handleSubmitData} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-amber-300 mb-3">
              Asset Symbol *
            </label>
            <input
              type="text"
              name="asset"
              value={newData.asset}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-black/20 border border-amber-500/30 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-amber-400"
              placeholder="e.g., BTC, ETH, AAPL"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-amber-300 mb-3">
                Price (USD) *
              </label>
              <input
                type="number"
                name="price"
                value={newData.price}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-black/20 border border-amber-500/30 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-amber-400"
                placeholder="45000"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-amber-300 mb-3">
                Volume *
              </label>
              <input
                type="number"
                name="volume"
                value={newData.volume}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-black/20 border border-amber-500/30 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-amber-400"
                placeholder="1000000"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-amber-300 mb-3">
                Market Cap *
              </label>
              <input
                type="number"
                name="marketCap"
                value={newData.marketCap}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-black/20 border border-amber-500/30 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-amber-400"
                placeholder="850000000000"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 finance-oracle-glow"
          >
            💰 Submit Financial Data
          </button>
        </form>
      </div>

      {/* Financial Data List */}
      <div className="finance-oracle-card rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          💰 Financial Data
        </h3>
        
        <div className="space-y-6">
          {financialData.map((data) => (
            <div key={data.id} className="finance-oracle-card rounded-xl p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <span className="text-3xl mr-4">{getAssetIcon(data.asset)}</span>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-1">
                      {data.asset}
                    </h4>
                    <p className="text-amber-300">
                      Data Point #{data.id} • {formatTime(data.timestamp)}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  data.isValid 
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }`}>
                  {data.isValid ? "Valid" : "Invalid"}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400 mb-1">
                    {formatPrice(data.price)}
                  </div>
                  <p className="text-sm text-amber-300">Price</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {formatVolume(data.volume)}
                  </div>
                  <p className="text-sm text-amber-300">Volume</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {formatMarketCap(data.marketCap)}
                  </div>
                  <p className="text-sm text-amber-300">Market Cap</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {formatTime(data.timestamp)}
                  </div>
                  <p className="text-sm text-amber-300">Updated</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-amber-400">Provider</p>
                  <p className="text-sm font-medium text-white">
                    {data.provider}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200">
                    View Details
                  </button>
                  <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200">
                    Request Data
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {financialData.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">💰</div>
            <h3 className="text-2xl font-semibold text-white mb-4">No Financial Data</h3>
            <p className="text-amber-300">Financial data will appear here once it is submitted.</p>
          </div>
        )}
      </div>

      {/* Data Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="finance-oracle-card rounded-2xl p-8">
          <h4 className="text-xl font-semibold text-white mb-6">📊 Data Statistics</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-amber-300">Total Data Points</span>
              <span className="text-white font-semibold">
                {financialData.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-amber-300">Valid Data Points</span>
              <span className="text-white font-semibold">
                {financialData.filter(d => d.isValid).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-amber-300">Average Price</span>
              <span className="text-white font-semibold">
                {financialData.length > 0 ? formatPrice(Math.round(financialData.reduce((sum, d) => sum + d.price, 0) / financialData.length)) : "$0"}
              </span>
            </div>
          </div>
        </div>

        <div className="finance-oracle-card rounded-2xl p-8">
          <h4 className="text-xl font-semibold text-white mb-6">💰 Asset Distribution</h4>
          <div className="space-y-4">
            {financialData.map((data) => (
              <div key={data.id} className="flex justify-between items-center">
                <span className="text-amber-300 text-sm">{data.asset}</span>
                <span className="text-white font-semibold">
                  {formatPrice(data.price)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
