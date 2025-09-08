"use client";

import React, { useState, useEffect } from "react";
import { useFinanceOracle } from "../hooks/useFinanceOracle";

export default function FinanceOracleAlerts() {
  const [activeTab, setActiveTab] = useState("active");
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    statistics, 
    getFinancialAlert, 
    getAssetAlertIds,
    issueFinancialAlert,
    loading: contractLoading,
    error: contractError 
  } = useFinanceOracle();

  // Load alerts from blockchain
  useEffect(() => {
    const loadAlerts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get alert IDs for common assets
        const commonAssets = ["BTC", "ETH", "AAPL", "TSLA", "EUR/USD"];
        const allAlerts: any[] = [];
        
        for (const asset of commonAssets) {
          try {
            const alertIds = await getAssetAlertIds(asset);
            for (const alertId of alertIds) {
              const alert = await getFinancialAlert(alertId);
              if (alert) {
                allAlerts.push(alert);
              }
            }
          } catch (err) {
            console.warn(`Failed to load alerts for ${asset}:`, err);
          }
        }
        
        setAlerts(allAlerts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load alerts');
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, [getFinancialAlert, getAssetAlertIds]);

  // Categorize alerts by status
  const categorizedAlerts = {
    active: alerts.filter(alert => alert.status === 1 && alert.isActive),
    triggered: alerts.filter(alert => alert.status === 2 && alert.isActive),
    all: alerts.filter(alert => alert.isActive)
  };

  // Format statistics for display
  const stats = {
    total: statistics?.activeAlerts || 0,
    active: categorizedAlerts.active.length,
    triggered: categorizedAlerts.triggered.length,
    high: alerts.filter(alert => alert.level === "High").length,
    medium: alerts.filter(alert => alert.level === "Medium").length,
    low: alerts.filter(alert => alert.level === "Low").length
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num}`;
  };

  if (loading) {
    return (
      <div className="finance-oracle-alerts">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400"></div>
          <span className="ml-4 text-green-200">Loading alerts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="finance-oracle-alerts">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
          <div className="text-red-400 text-lg mb-2">⚠️ Error Loading Alerts</div>
          <p className="text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="finance-oracle-alerts">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white finance-oracle-heartbeat">
          🚨 Financial Alerts
        </h2>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors finance-oracle-glow">
          Create Alert
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="finance-oracle-card rounded-lg p-4 text-center finance-oracle-alert">
          <div className="text-2xl font-bold text-red-400">{stats.total}</div>
          <div className="text-green-200 text-sm">Total Alerts</div>
        </div>
        <div className="finance-oracle-card rounded-lg p-4 text-center finance-oracle-alert">
          <div className="text-2xl font-bold text-orange-400">{stats.active}</div>
          <div className="text-green-200 text-sm">Active</div>
        </div>
        <div className="finance-oracle-card rounded-lg p-4 text-center finance-oracle-alert">
          <div className="text-2xl font-bold text-gray-400">{stats.triggered}</div>
          <div className="text-green-200 text-sm">Triggered</div>
        </div>
        <div className="finance-oracle-card rounded-lg p-4 text-center finance-oracle-alert">
          <div className="text-2xl font-bold text-red-600">{stats.high}</div>
          <div className="text-green-200 text-sm">High Priority</div>
        </div>
      </div>

      <div className="flex space-x-2 mb-6">
        {["active", "triggered", "all"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-green-600 text-white finance-oracle-glow"
                : "bg-green-900/30 text-green-200 hover:bg-green-800/50"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({categorizedAlerts[tab as keyof typeof categorizedAlerts].length})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {categorizedAlerts[activeTab as keyof typeof categorizedAlerts].map((alert) => (
          <div key={alert.id} className="finance-oracle-card rounded-lg p-6 finance-oracle-alert">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{alert.asset} - {alert.type}</h3>
                <p className="text-green-200 text-sm mb-2">{alert.message}</p>
                <div className="flex space-x-4 text-sm text-green-300">
                  <span>Threshold: {formatNumber(alert.threshold)}</span>
                  <span>Current: {formatNumber(alert.currentValue)}</span>
                  <span>Created: {new Date(alert.creationTime * 1000).toLocaleString()}</span>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  alert.level === "High" ? "bg-red-600" :
                  alert.level === "Medium" ? "bg-yellow-600" : "bg-green-600"
                }`}>
                  {alert.level}
                </span>
                <p className={`text-sm mt-2 ${
                  alert.status === 1 ? "text-green-400" : "text-red-400"
                }`}>
                  {alert.status === 1 ? "Active" : alert.status === 2 ? "Triggered" : "Inactive"}
                </p>
                <p className="text-green-200 text-sm">ID: {alert.id}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-green-200 mb-2">
                <span>Progress to Threshold</span>
                <span>{((alert.currentValue / alert.threshold) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-green-900/30 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    alert.status === 2 ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min((alert.currentValue / alert.threshold) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                View Details
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Edit Alert
              </button>
              {alert.status === 1 && (
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  Pause Alert
                </button>
              )}
              {alert.status === 1 && (
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  Delete Alert
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {categorizedAlerts[activeTab as keyof typeof categorizedAlerts].length === 0 && (
        <div className="finance-oracle-card rounded-lg p-8 text-center finance-oracle-dots">
          <div className="text-4xl mb-4">🚨</div>
          <h3 className="text-lg font-semibold text-white mb-2">No {activeTab} alerts</h3>
          <p className="text-green-200">No alerts found in this category</p>
        </div>
      )}

      {/* Alert Creation Form */}
      <div className="mt-8">
        <div className="finance-oracle-card rounded-lg p-6 finance-oracle-connection">
          <h3 className="text-lg font-semibold text-white mb-4">Create New Alert</h3>
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
              <label className="block text-green-200 text-sm font-medium mb-2">Alert Type</label>
              <select className="w-full px-3 py-2 bg-green-900/30 border border-green-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="Price Alert">Price Alert</option>
                <option value="Volume Alert">Volume Alert</option>
                <option value="Volatility Alert">Volatility Alert</option>
                <option value="Market Cap Alert">Market Cap Alert</option>
                <option value="Change Alert">Change Alert</option>
              </select>
            </div>
            <div>
              <label className="block text-green-200 text-sm font-medium mb-2">Alert Level</label>
              <select className="w-full px-3 py-2 bg-green-900/30 border border-green-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-green-200 text-sm font-medium mb-2">Threshold Value</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 bg-green-900/30 border border-green-700 rounded-lg text-white placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter threshold value"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-green-200 text-sm font-medium mb-2">Alert Message</label>
              <textarea 
                className="w-full px-3 py-2 bg-green-900/30 border border-green-700 rounded-lg text-white placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                placeholder="Enter alert message"
              />
            </div>
            <div className="md:col-span-2 flex items-end">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors finance-oracle-glow">
                Create Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}