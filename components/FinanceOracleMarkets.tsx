"use client";

import React, { useState, useEffect } from "react";
import { useFinanceOracle } from "../hooks/useFinanceOracle";

export default function FinanceOracleMarkets() {
  const [activeTab, setActiveTab] = useState("all");
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    statistics, 
    loading: contractLoading,
    error: contractError 
  } = useFinanceOracle();

  // Load markets from blockchain
  useEffect(() => {
    const loadMarkets = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // For demo purposes, we'll create some sample market data
        // In a real implementation, you would fetch from the contract
        const sampleMarkets = [
          {
            id: 1,
            name: "Crypto Market",
            type: "Cryptocurrency",
            status: "Open",
            totalVolume: 2400000000,
            totalValue: 1800000000000,
            activeAssets: 856,
            marketIndex: 4250,
            change24h: 2.3,
            lastUpdate: Date.now() - 30 * 60 * 1000,
            isActive: true
          },
          {
            id: 2,
            name: "Stock Market",
            type: "Equities",
            status: "Open",
            totalVolume: 45200000000,
            totalValue: 45000000000000,
            activeAssets: 391,
            marketIndex: 4567,
            change24h: -0.8,
            lastUpdate: Date.now() - 25 * 60 * 1000,
            isActive: true
          },
          {
            id: 3,
            name: "Forex Market",
            type: "Foreign Exchange",
            status: "Open",
            totalVolume: 6800000000000,
            totalValue: 2500000000000,
            activeAssets: 28,
            marketIndex: 98.5,
            change24h: 0.5,
            lastUpdate: Date.now() - 20 * 60 * 1000,
            isActive: true
          },
          {
            id: 4,
            name: "Commodities",
            type: "Commodities",
            status: "Open",
            totalVolume: 1200000000,
            totalValue: 850000000000,
            activeAssets: 45,
            marketIndex: 125.8,
            change24h: 1.2,
            lastUpdate: Date.now() - 15 * 60 * 1000,
            isActive: true
          },
          {
            id: 5,
            name: "Bond Market",
            type: "Fixed Income",
            status: "Open",
            totalVolume: 8500000000,
            totalValue: 12000000000000,
            activeAssets: 156,
            marketIndex: 102.3,
            change24h: -0.3,
            lastUpdate: Date.now() - 10 * 60 * 1000,
            isActive: true
          }
        ];
        
        setMarkets(sampleMarkets);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load markets');
      } finally {
        setLoading(false);
      }
    };

    loadMarkets();
  }, []);

  // Categorize markets by status
  const categorizedMarkets = {
    all: markets.filter(market => market.isActive),
    open: markets.filter(market => market.status === "Open" && market.isActive),
    closed: markets.filter(market => market.status === "Closed" && market.isActive)
  };

  // Format statistics for display
  const stats = {
    total: statistics?.totalMarkets || markets.length,
    open: categorizedMarkets.open.length,
    closed: categorizedMarkets.closed.length,
    totalVolume: markets.reduce((sum, market) => sum + market.totalVolume, 0),
    totalValue: markets.reduce((sum, market) => sum + market.totalValue, 0)
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num}`;
  };

  if (loading) {
    return (
      <div className="finance-oracle-markets">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
          <span className="ml-4 text-green-200">Loading markets...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="finance-oracle-markets">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
          <div className="text-red-400 text-lg mb-2">⚠️ Error Loading Markets</div>
          <p className="text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="finance-oracle-markets">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white finance-oracle-heartbeat">
          📈 Financial Markets
        </h2>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors finance-oracle-glow">
          Add Market
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="finance-oracle-card rounded-lg p-4 text-center finance-oracle-market">
          <div className="text-2xl font-bold text-green-400">{stats.total}</div>
          <div className="text-green-200 text-sm">Total Markets</div>
        </div>
        <div className="finance-oracle-card rounded-lg p-4 text-center finance-oracle-market">
          <div className="text-2xl font-bold text-green-400">{stats.open}</div>
          <div className="text-green-200 text-sm">Open</div>
        </div>
        <div className="finance-oracle-card rounded-lg p-4 text-center finance-oracle-market">
          <div className="text-2xl font-bold text-gray-400">{stats.closed}</div>
          <div className="text-green-200 text-sm">Closed</div>
        </div>
        <div className="finance-oracle-card rounded-lg p-4 text-center finance-oracle-market">
          <div className="text-2xl font-bold text-blue-400">{formatNumber(stats.totalVolume)}</div>
          <div className="text-green-200 text-sm">Total Volume</div>
        </div>
      </div>

      <div className="flex space-x-2 mb-6">
        {["all", "open", "closed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-green-600 text-white finance-oracle-glow"
                : "bg-green-900/30 text-green-200 hover:bg-green-800/50"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({categorizedMarkets[tab as keyof typeof categorizedMarkets].length})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {categorizedMarkets[activeTab as keyof typeof categorizedMarkets].map((market) => (
          <div key={market.id} className="finance-oracle-card rounded-lg p-6 finance-oracle-market">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{market.name}</h3>
                <p className="text-green-200 text-sm mb-2">Type: {market.type}</p>
                <div className="flex space-x-4 text-sm text-green-300">
                  <span>Assets: {market.activeAssets}</span>
                  <span>Index: {market.marketIndex}</span>
                  <span>Volume: {formatNumber(market.totalVolume)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    market.status === "Open" ? "bg-green-600" : "bg-red-600"
                  }`}>
                    {market.status}
                  </span>
                </div>
                <div className={`text-lg font-bold ${
                  market.change24h >= 0 ? "text-green-400" : "text-red-400"
                }`}>
                  {market.change24h >= 0 ? "+" : ""}{market.change24h}%
                </div>
                <p className="text-green-200 text-sm">24h Change</p>
              </div>
            </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-green-200 mb-2">
                  <span>Total Value: {formatNumber(market.totalValue)}</span>
                  <span>Last Update: {new Date(market.lastUpdate).toLocaleString()}</span>
                </div>
              <div className="w-full bg-green-900/30 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(market.totalVolume / 10000000000000) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                View Details
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                View Analytics
              </button>
              {market.status === "Open" ? (
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  Close Market
                </button>
              ) : (
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  Open Market
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {categorizedMarkets[activeTab as keyof typeof categorizedMarkets].length === 0 && (
        <div className="finance-oracle-card rounded-lg p-8 text-center finance-oracle-dots">
          <div className="text-4xl mb-4">📈</div>
          <h3 className="text-lg font-semibold text-white mb-2">No {activeTab} markets</h3>
          <p className="text-green-200">No markets found in this category</p>
        </div>
      )}

      {/* Market Creation Form */}
      <div className="mt-8">
        <div className="finance-oracle-card rounded-lg p-6 finance-oracle-connection">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Market</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-green-200 text-sm font-medium mb-2">Market Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-green-900/30 border border-green-700 rounded-lg text-white placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter market name"
              />
            </div>
            <div>
              <label className="block text-green-200 text-sm font-medium mb-2">Market Type</label>
              <select className="w-full px-3 py-2 bg-green-900/30 border border-green-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="Cryptocurrency">Cryptocurrency</option>
                <option value="Equities">Equities</option>
                <option value="Foreign Exchange">Foreign Exchange</option>
                <option value="Commodities">Commodities</option>
                <option value="Bonds">Bonds</option>
              </select>
            </div>
            <div>
              <label className="block text-green-200 text-sm font-medium mb-2">Initial Index Value</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 bg-green-900/30 border border-green-700 rounded-lg text-white placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter initial index value"
              />
            </div>
            <div className="flex items-end">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors finance-oracle-glow">
                Add Market
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
