"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import FinanceOracleDashboard from "../components/FinanceOracleDashboard";
import FinanceOracleMarkets from "../components/FinanceOracleMarkets";
import FinanceOraclePrices from "../components/FinanceOraclePrices";
import FinanceOracleAlerts from "../components/FinanceOracleAlerts";
import DataPrivacyDashboard from "../components/DataPrivacyDashboard";

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Fixed Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md shadow-lg border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">📊</span>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Finance Oracle
                </h1>
                <p className="text-sm text-blue-200">FHE-Powered Financial Data Platform</p>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Secure Financial Intelligence
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Privacy-preserving financial data analytics powered by Fully Homomorphic Encryption
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-blue-500/20">
            <div className="flex space-x-2">
              {[
                { id: "overview", label: "📊 Overview", icon: "📊" },
                { id: "markets", label: "📈 Markets", icon: "📈" },
                { id: "prices", label: "💰 Prices", icon: "💰" },
                { id: "privacy", label: "🔒 Privacy", icon: "🔒" },
                { id: "alerts", label: "🚨 Alerts", icon: "🚨" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105"
                      : "text-blue-200 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-blue-500/20">
              <FinanceOracleDashboard />
            </div>
          )}
          
          {activeTab === "markets" && (
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-blue-500/20">
              <FinanceOracleMarkets />
            </div>
          )}
          
          {activeTab === "prices" && (
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-blue-500/20">
              <FinanceOraclePrices />
            </div>
          )}
          
          {activeTab === "privacy" && (
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-blue-500/20">
              <DataPrivacyDashboard />
            </div>
          )}
          
          {activeTab === "alerts" && (
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-blue-500/20">
              <FinanceOracleAlerts />
            </div>
          )}
        </div>

        {/* Key Features - Only on Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl p-8 text-center border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-white mb-3">FHE Encryption</h3>
              <p className="text-blue-200">Privacy-preserving computation on encrypted financial data</p>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-8 text-center border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-white mb-3">Real-time Analytics</h3>
              <p className="text-blue-200">Live market data processing and insights</p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 text-center border border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-300">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-3">Smart Privacy</h3>
              <p className="text-blue-200">Hybrid approach: public data + encrypted private data</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
            <h3 className="text-2xl font-semibold text-white mb-3">🔒 Secure & Private by Design</h3>
            <p className="text-blue-200 text-lg">
              Powered by Fully Homomorphic Encryption for privacy-preserving financial data analytics
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}