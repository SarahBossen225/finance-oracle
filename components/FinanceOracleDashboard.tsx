"use client";

import React, { useEffect } from "react";
import { useFinanceOracle } from "../hooks/useFinanceOracle";

export default function FinanceOracleDashboard() {
  const { statistics, loading, error, refetchStatistics } = useFinanceOracle();

  // Format statistics for display
  const stats = {
    totalAssets: statistics?.totalDataPoints || 0,
    activeMarkets: statistics?.activeMarkets || 0,
    totalDataPoints: statistics?.totalDataPoints || 0,
    totalFeeds: statistics?.totalFeeds || 0,
    activeAlerts: statistics?.activeAlerts || 0,
    totalSubscriptions: statistics?.activeSubscriptions || 0
  };

  // Refresh data on component mount
  useEffect(() => {
    refetchStatistics();
  }, [refetchStatistics]);

  if (loading) {
    return (
      <div className="finance-oracle-dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          <span className="ml-4 text-blue-200">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="finance-oracle-dashboard">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
          <div className="text-red-400 text-lg mb-2">⚠️ Error Loading Data</div>
          <p className="text-red-200">{error}</p>
          <button 
            onClick={() => refetchStatistics()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="finance-oracle-dashboard">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">📊 Financial Overview</h2>
        <p className="text-blue-200 text-lg">Real-time financial data and market insights</p>
      </div>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Total Assets</h3>
              <p className="text-3xl font-bold text-blue-400 mt-2">{stats.totalAssets}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
          <div className="mt-4 text-sm text-blue-200">
            <span>Crypto: 856</span>
            <span className="mx-2">•</span>
            <span>Stocks: 391</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Active Markets</h3>
              <p className="text-3xl font-bold text-green-400 mt-2">{stats.activeMarkets}</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
          <div className="mt-4 text-sm text-green-200">
            <span>Open: 15</span>
            <span className="mx-2">•</span>
            <span>Closed: 3</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Data Points</h3>
              <p className="text-3xl font-bold text-purple-400 mt-2">{stats.totalDataPoints}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
          <div className="mt-4 text-sm text-purple-200">
            <span>Today: 2,345</span>
            <span className="mx-2">•</span>
            <span>This Week: 15,678</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Active Alerts</h3>
              <p className="text-3xl font-bold text-orange-400 mt-2">{stats.activeAlerts}</p>
            </div>
            <div className="text-4xl">🚨</div>
          </div>
          <div className="mt-4 text-sm text-orange-200">
            <span>High: 3</span>
            <span className="mx-2">•</span>
            <span>Medium: 7</span>
          </div>
        </div>
      </div>

      {/* Quick Market Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-6 border border-slate-500/30">
          <h3 className="text-xl font-semibold text-white mb-4">📈 Top Performing Assets</h3>
          <div className="space-y-3">
            {[
              { asset: "BTC", price: "$67,500", change: "+2.3%", volume: "2.4B" },
              { asset: "ETH", price: "$3,850", change: "+1.8%", volume: "1.8B" },
              { asset: "AAPL", price: "$195.50", change: "+0.8%", volume: "45.2M" }
            ].map((asset, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-slate-600/20 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{asset.asset}</h4>
                  <p className="text-slate-300 text-sm">Volume: {asset.volume}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{asset.price}</p>
                  <p className="text-green-400 text-sm font-semibold">{asset.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-6 border border-slate-500/30">
          <h3 className="text-xl font-semibold text-white mb-4">🔒 Privacy Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">FHE Encryption</span>
              <span className="text-green-400 font-semibold">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Private Data</span>
              <span className="text-blue-400 font-semibold">Encrypted</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Public Data</span>
              <span className="text-cyan-400 font-semibold">Unencrypted</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Data Integrity</span>
              <span className="text-green-400 font-semibold">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}