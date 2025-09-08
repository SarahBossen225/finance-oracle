"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract } from "wagmi";

export default function FinanceOracleRequests() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRequest, setNewRequest] = useState({
    asset: "",
    requestType: "0",
    timeRange: "",
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockRequests = [
      {
        id: 1,
        asset: "BTC",
        requestType: 0,
        timeRange: 0,
        requester: "0x1234...5678",
        isFulfilled: false,
        timestamp: Date.now() - 30 * 60 * 1000,
      },
      {
        id: 2,
        asset: "ETH",
        requestType: 1,
        timeRange: 24,
        requester: "0x9876...5432",
        isFulfilled: true,
        timestamp: Date.now() - 45 * 60 * 1000,
      },
      {
        id: 3,
        asset: "AAPL",
        requestType: 2,
        timeRange: 168,
        requester: "0xabcd...efgh",
        isFulfilled: false,
        timestamp: Date.now() - 60 * 60 * 1000,
      },
    ];
    
    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    if (!newRequest.asset.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // In a real implementation, you would encrypt these values using FHE
      const assetHash = "0x" + newRequest.asset; // Simplified hash
      const requestType = parseInt(newRequest.requestType);
      const timeRange = parseInt(newRequest.timeRange);

      await writeContract({
        address: "0x...", // Contract address
        abi: [], // Contract ABI
        functionName: "createPriceRequest",
        args: [assetHash, requestType, timeRange],
      });

      alert("Price request created successfully!");
      setNewRequest({
        asset: "",
        requestType: "0",
        timeRange: "",
      });
    } catch (error) {
      console.error("Error creating request:", error);
      alert("Failed to create price request");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewRequest({
      ...newRequest,
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

  const getRequestTypeText = (type: number) => {
    switch (type) {
      case 0:
        return "Current Price";
      case 1:
        return "Historical Data";
      case 2:
        return "Price Forecast";
      default:
        return "Unknown";
    }
  };

  const getRequestTypeIcon = (type: number) => {
    switch (type) {
      case 0:
        return "💰";
      case 1:
        return "📊";
      case 2:
        return "🔮";
      default:
        return "❓";
    }
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="finance-oracle-card rounded-2xl p-12">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-6"></div>
            <p className="text-amber-300 text-lg">Loading price requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Create New Request */}
      <div className="finance-oracle-card rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          📋 Create Price Request
        </h2>
        
        <form onSubmit={handleCreateRequest} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-amber-300 mb-3">
              Asset Symbol *
            </label>
            <input
              type="text"
              name="asset"
              value={newRequest.asset}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-black/20 border border-amber-500/30 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-amber-400"
              placeholder="e.g., BTC, ETH, AAPL"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-amber-300 mb-3">
                Request Type *
              </label>
              <select
                name="requestType"
                value={newRequest.requestType}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-black/20 border border-amber-500/30 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white"
                required
              >
                <option value="0">Current Price</option>
                <option value="1">Historical Data</option>
                <option value="2">Price Forecast</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-amber-300 mb-3">
                Time Range (hours)
              </label>
              <input
                type="number"
                name="timeRange"
                value={newRequest.timeRange}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-black/20 border border-amber-500/30 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-amber-400"
                placeholder="24"
                min="0"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 finance-oracle-glow"
          >
            📋 Create Price Request
          </button>
        </form>
      </div>

      {/* Requests List */}
      <div className="finance-oracle-card rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          📋 Price Requests
        </h3>
        
        <div className="space-y-6">
          {requests.map((request) => (
            <div key={request.id} className="finance-oracle-card rounded-xl p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <span className="text-3xl mr-4">{getAssetIcon(request.asset)}</span>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-1">
                      {request.asset}
                    </h4>
                    <p className="text-amber-300">
                      Request #{request.id} • {getRequestTypeText(request.requestType)}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  request.isFulfilled 
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                }`}>
                  {request.isFulfilled ? "Fulfilled" : "Pending"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400 mb-1">
                    {getRequestTypeText(request.requestType)}
                  </div>
                  <p className="text-sm text-amber-300">Request Type</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {request.timeRange}h
                  </div>
                  <p className="text-sm text-amber-300">Time Range</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {formatTime(request.timestamp)}
                  </div>
                  <p className="text-sm text-amber-300">Created</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-amber-400">Requester</p>
                  <p className="text-sm font-medium text-white">
                    {request.requester}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200">
                    View Details
                  </button>
                  {!request.isFulfilled && (
                    <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200">
                      Fulfill Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {requests.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📋</div>
            <h3 className="text-2xl font-semibold text-white mb-4">No Price Requests</h3>
            <p className="text-amber-300">Price requests will appear here once they are created.</p>
          </div>
        )}
      </div>

      {/* Request Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="finance-oracle-card rounded-2xl p-8">
          <h4 className="text-xl font-semibold text-white mb-6">📊 Request Statistics</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-amber-300">Total Requests</span>
              <span className="text-white font-semibold">
                {requests.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-amber-300">Fulfilled Requests</span>
              <span className="text-white font-semibold">
                {requests.filter(r => r.isFulfilled).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-amber-300">Pending Requests</span>
              <span className="text-white font-semibold">
                {requests.filter(r => !r.isFulfilled).length}
              </span>
            </div>
          </div>
        </div>

        <div className="finance-oracle-card rounded-2xl p-8">
          <h4 className="text-xl font-semibold text-white mb-6">📋 Request Types</h4>
          <div className="space-y-4">
            {Array.from(new Set(requests.map(r => r.requestType))).map((type) => {
              const count = requests.filter(r => r.requestType === type).length;
              const percentage = (count / requests.length) * 100;
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getRequestTypeIcon(type)}</span>
                    <span className="text-amber-300">{getRequestTypeText(type)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-semibold">{count}</span>
                    <span className="text-amber-400 text-sm ml-2">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Request Instructions */}
      <div className="finance-oracle-card rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          📋 Request Instructions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">1️⃣</span>
              <div>
                <h4 className="font-semibold text-white mb-2">Select Asset</h4>
                <p className="text-amber-300 text-sm">Enter the asset symbol for which you want financial data.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <h4 className="font-semibold text-white mb-2">Choose Request Type</h4>
                <p className="text-amber-300 text-sm">Select current price, historical data, or price forecast.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <h4 className="font-semibold text-white mb-2">Set Time Range</h4>
                <p className="text-amber-300 text-sm">Specify the time range for historical data or forecasts.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <h4 className="font-semibold text-amber-400 mb-2">🔒 Privacy Notice</h4>
              <p className="text-amber-300 text-sm">
                All price requests are encrypted using Fully Homomorphic Encryption (FHE) technology. 
                Your request details remain private while enabling secure financial data operations.
              </p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <h4 className="font-semibold text-green-400 mb-2">✅ Request Fulfillment</h4>
              <p className="text-green-300 text-sm">
                Financial providers can fulfill your requests with encrypted financial data. 
                You can track the status of your requests in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
