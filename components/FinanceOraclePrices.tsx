"use client";

import React, { useState, useEffect } from "react";
import { useFinanceOracle } from "../hooks/useFinanceOracle";

export default function FinanceOraclePrices() {
  const [activeTab, setActiveTab] = useState("crypto");
  const [priceFeeds, setPriceFeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    statistics, 
    getPriceFeed, 
    getAssetFeedIds,
    updatePriceFeed,
    loading: contractLoading,
    error: contractError 
  } = useFinanceOracle();

  // Load price feeds from blockchain
  useEffect(() => {
    const loadPriceFeeds = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get feed IDs for common assets
        const commonAssets = ["BTC", "ETH", "AAPL", "GOOGL", "MSFT", "TSLA", "EUR/USD"];
        const allFeeds: any[] = [];
        
        for (const asset of commonAssets) {
          try {
            const feedIds = await getAssetFeedIds(asset);
            for (const feedId of feedIds) {
              const feed = await getPriceFeed(feedId);
              if (feed) {
                allFeeds.push(feed);
              }
            }
          } catch (err) {
            console.warn(`Failed to load feeds for ${asset}:`, err);
          }
        }
        
        setPriceFeeds(allFeeds);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load price feeds');
      } finally {
        setLoading(false);
      }
    };

    loadPriceFeeds();
  }, [getPriceFeed, getAssetFeedIds]);

  // Format statistics for display
  const stats = {
    totalFeeds: statistics?.totalFeeds || 0,
    activeFeeds: priceFeeds.filter(feed => feed.isActive).length,
    averageConfidence: priceFeeds.length > 0 
      ? Math.round(priceFeeds.reduce((sum, feed) => sum + feed.confidence, 0) / priceFeeds.length)
      : 0,
    totalVolume: priceFeeds.reduce((sum, feed) => sum + (feed.volume || 0), 0)
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num}`;
  };

  // Categorize feeds by type
  const categorizedFeeds = {
    crypto: priceFeeds.filter(feed => ['BTC', 'ETH'].includes(feed.asset)),
    stocks: priceFeeds.filter(feed => ['AAPL', 'GOOGL', 'MSFT', 'TSLA'].includes(feed.asset)),
    forex: priceFeeds.filter(feed => feed.asset.includes('/'))
  };

  if (loading) {
    return (
      <div className="finance-oracle-prices">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
          <span className="ml-4 text-green-200">Loading price feeds...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="finance-oracle-prices">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
          <div className="text-red-400 text-lg mb-2">⚠️ Error Loading Price Feeds</div>
          <p className="text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="finance-oracle-prices">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          💰 Price Feeds
        </h2>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
          Add Feed
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="finance-oracle-card rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.totalFeeds}</div>
          <div className="text-green-200 text-sm">Total Feeds</div>
        </div>
        <div className="finance-oracle-card rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.activeFeeds}</div>
          <div className="text-green-200 text-sm">Active</div>
        </div>
        <div className="finance-oracle-card rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.averageConfidence}%</div>
          <div className="text-green-200 text-sm">Avg Confidence</div>
        </div>
        <div className="finance-oracle-card rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{formatNumber(stats.totalVolume)}</div>
          <div className="text-green-200 text-sm">Total Volume</div>
        </div>
      </div>

      <div className="flex space-x-2 mb-6">
        {["crypto", "stocks", "forex"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-green-600 text-white"
                : "bg-green-900/30 text-green-200 hover:bg-green-800/50"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({categorizedFeeds[tab as keyof typeof categorizedFeeds].length})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {categorizedFeeds[activeTab as keyof typeof categorizedFeeds].map((feed) => (
          <div key={feed.id} className="finance-oracle-card rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{feed.asset}</h3>
                <p className="text-green-200 text-sm mb-2">Source: {feed.source}</p>
                <p className="text-green-200 text-sm mb-2">Last Update: {new Date(feed.lastUpdated * 1000).toLocaleString()}</p>
                <div className="flex space-x-4 text-sm text-green-300">
                  <span>Latency: {feed.latency}ms</span>
                  <span>Confidence: {feed.confidence}%</span>
                  <span>Status: {feed.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-400">{formatNumber(feed.price)}</div>
                <p className="text-green-200 text-sm">Feed ID: {feed.id}</p>
                <p className="text-green-200 text-sm">Confidence: {feed.confidence}%</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-green-900/20 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-white">{formatNumber(feed.price)}</div>
                <div className="text-green-200 text-sm">Current Price</div>
              </div>
              <div className="bg-green-900/20 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-white">{feed.confidence}%</div>
                <div className="text-green-200 text-sm">Confidence</div>
              </div>
              <div className="bg-green-900/20 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-white">{feed.latency}ms</div>
                <div className="text-green-200 text-sm">Latency</div>
              </div>
              <div className="bg-green-900/20 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-white">{feed.isActive ? 'Active' : 'Inactive'}</div>
                <div className="text-green-200 text-sm">Status</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-green-200 mb-2">
                <span>Feed Quality</span>
                <span>{feed.confidence}%</span>
              </div>
              <div className="w-full bg-green-900/30 rounded-full h-3">
                <div 
                  className="h-3 rounded-full transition-all duration-300 bg-green-500"
                  style={{ width: `${feed.confidence}%` }}
                ></div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                View Details
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Subscribe
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Set Alert
              </button>
            </div>
          </div>
        ))}
      </div>

      {categorizedFeeds[activeTab as keyof typeof categorizedFeeds].length === 0 && (
        <div className="finance-oracle-card rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-lg font-semibold text-white mb-2">No {activeTab} prices</h3>
          <p className="text-green-200">No price feeds found in this category</p>
        </div>
      )}

      {/* Price Feed Creation Form */}
      <div className="mt-8">
        <div className="finance-oracle-card rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Price Feed</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-green-200 text-sm font-medium mb-2">Asset Symbol</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-green-900/30 border border-green-700 rounded-lg text-white placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter asset symbol (e.g., BTC, AAPL)"
              />
            </div>
            <div>
              <label className="block text-green-200 text-sm font-medium mb-2">Asset Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-green-900/30 border border-green-700 rounded-lg text-white placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter asset name"
              />
            </div>
            <div>
              <label className="block text-green-200 text-sm font-medium mb-2">Data Source</label>
              <select className="w-full px-3 py-2 bg-green-900/30 border border-green-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="CoinGecko">CoinGecko</option>
                <option value="CoinMarketCap">CoinMarketCap</option>
                <option value="Yahoo Finance">Yahoo Finance</option>
                <option value="Alpha Vantage">Alpha Vantage</option>
                <option value="IEX Cloud">IEX Cloud</option>
              </select>
            </div>
            <div>
              <label className="block text-green-200 text-sm font-medium mb-2">Update Frequency (seconds)</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 bg-green-900/30 border border-green-700 rounded-lg text-white placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter update frequency"
              />
            </div>
            <div className="md:col-span-2 flex items-end">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                Add Price Feed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
