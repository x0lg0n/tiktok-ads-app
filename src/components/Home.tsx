import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ConnectButton from "./OAuth/ConnectButton";
import { tiktokApiService } from "../services/tiktokApi";

const Home = () => {
  const [isConnected, setIsConnected] = useState(
    tiktokApiService.isAuthenticated()
  );

  const handleDisconnect = async () => {
    const success = await tiktokApiService.revokeAccess();
    if (success) {
      setIsConnected(false);
      alert("Successfully disconnected from TikTok Ads");
    } else {
      alert("Failed to disconnect. Please try again.");
    }
  };

  // Listen for OAuth completion
  useEffect(() => {
    const handleStorageChange = () => {
      setIsConnected(tiktokApiService.isAuthenticated());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-5 rounded-3xl shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-16 h-16 text-white">
                <path
                  fill="currentColor"
                  d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22c3.2 7.2 6.5 14.4 9.8 21.6 1.7 3.6 3.4 7.2 5 10.8v-.9z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            TikTok Ads{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500">
              Creator
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create stunning, high-converting TikTok ad campaigns with our
            powerful creator platform
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-5">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Secure Connection
                </h2>
              </div>
              <p className="text-gray-600 mb-6 text-lg">
                {isConnected
                  ? "Your TikTok Ads account is connected and ready for publishing"
                  : "Connect your TikTok Business account with enterprise-grade OAuth security"}
              </p>
              {isConnected ? (
                <div className="space-y-4">
                  <button
                    onClick={handleDisconnect}
                    className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-300">
                    Disconnect TikTok Account
                  </button>
                  <Link
                    to="/create-ad"
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl text-center block transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg">
                    Create & Publish Ad
                  </Link>
                </div>
              ) : (
                <ConnectButton className="w-full py-4 text-base font-semibold" />
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-5">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Quick Start
                </h2>
              </div>
              <p className="text-gray-600 mb-6 text-lg">
                Start creating ads immediately without connection. Connect later
                to publish.
              </p>
              <Link
                to="/create-ad"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl text-center block transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg">
                Create Ad Without Connection
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our Platform?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 hover:bg-gray-50 rounded-2xl transition-colors">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Lightning Fast
              </h4>
              <p className="text-gray-600">
                Create and deploy ads in minutes, not hours with our optimized
                workflow
              </p>
            </div>
            <div className="text-center p-6 hover:bg-gray-50 rounded-2xl transition-colors">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Enterprise Security
              </h4>
              <p className="text-gray-600">
                Bank-level encryption and secure OAuth 2.0 authentication flow
              </p>
            </div>
            <div className="text-center p-6 hover:bg-gray-50 rounded-2xl transition-colors">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Expert Support
              </h4>
              <p className="text-gray-600">
                Dedicated team ready to help optimize your ad campaigns 24/7
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
