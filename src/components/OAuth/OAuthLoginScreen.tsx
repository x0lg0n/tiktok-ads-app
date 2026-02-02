import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tiktokApiService } from "../../services/tiktokApi";

interface FormData {
  campaignName: string;
  objective: string;
  adText: string;
  cta: string;
  musicOption: string;
  musicId?: string;
}

interface OAuthLoginScreenProps {
  formData?: FormData;
}

const OAuthLoginScreen = ({ formData }: OAuthLoginScreenProps) => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Auto-redirect countdown
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Save form data if provided
      if (formData) {
        localStorage.setItem("pendingAdData", JSON.stringify(formData));
      }
      await tiktokApiService.initiateOAuth();
    } catch (error) {
      console.error("OAuth initiation failed:", error);
      alert("Failed to connect to TikTok. Please try again.");
      setIsConnecting(false);
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-5 rounded-3xl shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-12 h-12 text-white">
                <path
                  fill="currentColor"
                  d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22c3.2 7.2 6.5 14.4 9.8 21.6 1.7 3.6 3.4 7.2 5 10.8v-.9z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Connect Your TikTok Account
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            To create your ad campaign, we need to connect to your TikTok
            Business account
          </p>
        </div>

        {/* Campaign Preview Card */}
        {formData && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-pink-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Your Campaign Preview
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">
                  Campaign Name:
                </span>
                <p className="text-gray-900">
                  {formData.campaignName || "Not specified"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Objective:</span>
                <p className="text-gray-900">
                  {formData.objective || "Not specified"}
                </p>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">Ad Text:</span>
                <p className="text-gray-900">
                  {formData.adText || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-1 bg-gradient-to-r from-pink-500 to-red-500"></div>
          <div className="p-8 md:p-10">
            {/* Benefits Section */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Why Connect Your TikTok Account?
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-pink-50 rounded-2xl">
                  <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Launch Ads</h4>
                  <p className="text-gray-600 text-sm">
                    Create and manage TikTok ad campaigns directly from our
                    platform
                  </p>
                </div>

                <div className="text-center p-6 bg-purple-50 rounded-2xl">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    Track Performance
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Monitor your ad performance and analytics in real-time
                  </p>
                </div>

                <div className="text-center p-6 bg-blue-50 rounded-2xl">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    Secure & Trusted
                  </h4>
                  <p className="text-gray-600 text-sm">
                    OAuth authentication ensures your account remains secure
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                {isConnecting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Redirecting to TikTok...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="w-5 h-5 mr-3">
                      <path
                        fill="currentColor"
                        d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22c3.2 7.2 6.5 14.4 9.8 21.6 1.7 3.6 3.4 7.2 5 10.8v-.9z"
                      />
                    </svg>
                    Connect TikTok Account
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={handleSkip}
                  className="text-gray-600 hover:text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors">
                  Skip for now and create campaign later
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Secure connection:</span> We use
                  TikTok's official OAuth 2.0 protocol. Your credentials are
                  never stored on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Having trouble? Contact our support team for assistance</p>
        </div>
      </div>
    </div>
  );
};

export default OAuthLoginScreen;
