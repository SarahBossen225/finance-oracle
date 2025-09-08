"use client";

import React, { useState } from "react";

export default function DataPrivacyDashboard() {
  const [privacyMode, setPrivacyMode] = useState<"public" | "private" | "mixed">("mixed");
  const [userPreferences, setUserPreferences] = useState({
    encryptPortfolio: true,
    encryptTradingHistory: false,
    encryptRiskMetrics: true,
    encryptPersonalInfo: true,
    sharePublicData: true
  });

  const publicDataExamples = [
    { type: "Market Prices", description: "BTC, ETH, AAPL current prices", encrypted: false },
    { type: "Trading Volumes", description: "24h volume data from exchanges", encrypted: false },
    { type: "Market Indices", description: "S&P 500, NASDAQ indices", encrypted: false },
    { type: "Exchange Rates", description: "USD/JPY, EUR/USD rates", encrypted: false }
  ];

  const privateDataExamples = [
    { type: "Portfolio Value", description: "Your total investment value", encrypted: true },
    { type: "Risk Tolerance", description: "Your personal risk assessment", encrypted: true },
    { type: "Investment Goals", description: "Your financial objectives", encrypted: true },
    { type: "Trading Strategies", description: "Your proprietary algorithms", encrypted: true }
  ];

  const handlePrivacyToggle = (key: keyof typeof userPreferences) => {
    setUserPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="finance-oracle-privacy-dashboard">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          🔒 Data Privacy & Security
        </h2>
        <p className="text-green-200 text-lg">
          Choose your privacy level: Public data remains unencrypted for transparency, 
          while private data is protected with FHE encryption.
        </p>
      </div>

      {/* Privacy Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div 
          className={`finance-oracle-card rounded-xl p-6 cursor-pointer transition-all ${
            privacyMode === "public" ? "ring-2 ring-green-400 bg-green-900/30" : ""
          }`}
          onClick={() => setPrivacyMode("public")}
        >
          <div className="text-center">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-xl font-semibold text-white mb-2">Public Mode</h3>
            <p className="text-green-200 text-sm">
              All data is public and unencrypted. Best for transparency and open data access.
            </p>
          </div>
        </div>

        <div 
          className={`finance-oracle-card rounded-xl p-6 cursor-pointer transition-all ${
            privacyMode === "private" ? "ring-2 ring-green-400 bg-green-900/30" : ""
          }`}
          onClick={() => setPrivacyMode("private")}
        >
          <div className="text-center">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold text-white mb-2">Private Mode</h3>
            <p className="text-green-200 text-sm">
              All data is encrypted with FHE. Maximum privacy protection for sensitive information.
            </p>
          </div>
        </div>

        <div 
          className={`finance-oracle-card rounded-xl p-6 cursor-pointer transition-all ${
            privacyMode === "mixed" ? "ring-2 ring-green-400 bg-green-900/30" : ""
          }`}
          onClick={() => setPrivacyMode("mixed")}
        >
          <div className="text-center">
            <div className="text-4xl mb-4">⚖️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Mixed Mode</h3>
            <p className="text-green-200 text-sm">
              Smart privacy: Public data unencrypted, private data encrypted. Recommended approach.
            </p>
          </div>
        </div>
      </div>

      {/* Data Type Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Public Data */}
        <div className="finance-oracle-card rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-3">🌐</span>
            Public Data (Unencrypted)
          </h3>
          <p className="text-green-200 text-sm mb-4">
            These data types are publicly available and don't require encryption:
          </p>
          <div className="space-y-3">
            {publicDataExamples.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg">
                <div>
                  <div className="text-white font-medium">{item.type}</div>
                  <div className="text-green-200 text-sm">{item.description}</div>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 text-sm mr-2">Public</span>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Private Data */}
        <div className="finance-oracle-card rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-2xl mr-3">🔐</span>
            Private Data (FHE Encrypted)
          </h3>
          <p className="text-green-200 text-sm mb-4">
            These data types contain sensitive information and are encrypted:
          </p>
          <div className="space-y-3">
            {privateDataExamples.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg">
                <div>
                  <div className="text-white font-medium">{item.type}</div>
                  <div className="text-green-200 text-sm">{item.description}</div>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-400 text-sm mr-2">Encrypted</span>
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Privacy Preferences */}
      <div className="finance-oracle-card rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-3">⚙️</span>
          Your Privacy Preferences
        </h3>
        <p className="text-green-200 text-sm mb-6">
          Customize which data should be encrypted based on your privacy needs:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(userPreferences).map(([key, value]) => {
            const typedKey = key as keyof typeof userPreferences;
            return (
            <div key={key} className="flex items-center justify-between p-4 bg-green-900/20 rounded-lg">
              <div>
                <div className="text-white font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
                <div className="text-green-200 text-sm">
                  {key === 'encryptPortfolio' && 'Encrypt your portfolio value and holdings'}
                  {key === 'encryptTradingHistory' && 'Encrypt your trading history and patterns'}
                  {key === 'encryptRiskMetrics' && 'Encrypt your risk assessment and metrics'}
                  {key === 'encryptPersonalInfo' && 'Encrypt your personal financial information'}
                  {key === 'sharePublicData' && 'Allow sharing of public market data'}
                </div>
              </div>
              <button
                onClick={() => handlePrivacyToggle(typedKey)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            );
          })}
        </div>
      </div>

      {/* Privacy Benefits */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="finance-oracle-card rounded-xl p-6 text-center">
          <div className="text-3xl mb-3">🛡️</div>
          <h4 className="text-lg font-semibold text-white mb-2">Enhanced Security</h4>
          <p className="text-green-200 text-sm">
            FHE encryption protects your sensitive data while allowing computations
          </p>
        </div>
        
        <div className="finance-oracle-card rounded-xl p-6 text-center">
          <div className="text-3xl mb-3">⚡</div>
          <h4 className="text-lg font-semibold text-white mb-2">Optimal Performance</h4>
          <p className="text-green-200 text-sm">
            Public data remains fast and accessible, private data is secure
          </p>
        </div>
        
        <div className="finance-oracle-card rounded-xl p-6 text-center">
          <div className="text-3xl mb-3">🎯</div>
          <h4 className="text-lg font-semibold text-white mb-2">Smart Privacy</h4>
          <p className="text-green-200 text-sm">
            Choose what to encrypt based on your specific privacy requirements
          </p>
        </div>
      </div>
    </div>
  );
}
