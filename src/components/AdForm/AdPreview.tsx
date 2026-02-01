import { useState } from "react";

interface AdData {
  campaignName: string;
  objective: string;
  adText: string;
  cta: string;
  musicOption: string;
  musicId?: string;
}

const AdPreview = ({ adData }: { adData: AdData }) => {
  const [isVisible] = useState(true);

  // Enhanced TikTok ad styles
  const tiktokStyles = {
    container:
      "bg-black rounded-2xl overflow-hidden shadow-2xl max-w-sm mx-auto transform transition-all duration-500 border border-gray-800",
    videoArea:
      "h-96 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center relative",
    content: "p-4 bg-black",
    text: "text-white text-sm mb-3 leading-relaxed",
    cta: "bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-2 px-4 rounded-full text-xs inline-block hover:from-pink-600 hover:to-red-600 transition-all shadow-lg transform hover:scale-105",
    music: "text-gray-400 text-xs mt-3 flex items-center",
    engagement:
      "flex justify-between text-gray-400 text-xs mt-3 border-t border-gray-800 pt-3",
  };

  return (
    <div
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}>
      <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 sticky top-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-pink-500"
              fill="currentColor"
              viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            Ad Preview
          </h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
        <p className="text-gray-600 text-xs mb-4">
          Real-time TikTok ad simulation
        </p>

        <div className={tiktokStyles.container}>
          {/* Video area with TikTok-like styling */}
          <div className={tiktokStyles.videoArea}>
            {/* Simulated video content */}
            <div className="absolute inset-0 bg-linear-to-br from-purple-900/30 via-pink-800/20 to-red-700/30"></div>
            <div className="relative z-10 text-center text-white w-full px-4">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-lg font-bold mb-1">Ad Campaign</p>
              <p className="text-xs opacity-80">
                @
                {adData.campaignName.replace(/\s+/g, "").toLowerCase() ||
                  "yourbrand"}
              </p>
            </div>

            {/* TikTok UI elements */}
            <div className="absolute top-4 right-4 flex flex-col space-y-3">
              <div className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-all cursor-pointer">
                <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-full"></div>
              </div>
              <div className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-all cursor-pointer">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-all cursor-pointer">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M12 6c1.11 0 2-.9 2-2 0-.38-.1-.73-.29-1.03L12 0l-1.71 2.97c-.19.3-.29.65-.29 1.03 0 1.1.9 2 2 2zm4.6 9.99l-1.07-1.07c.39-.63.67-1.35.67-2.16 0-1.66-1.34-3-3-3-.81 0-1.53.28-2.16.67l-1.07-1.07C9.62 8.72 10.78 8.2 12 8.2c2.21 0 4 1.79 4 4 0 1.22-.52 2.38-1.4 3.19zM12 4c-4.42 0-8 3.58-8 8 0 1.22.28 2.38.79 3.4l-1.5 1.5c-.63.63-.19 1.71.7 1.71h12.42c.89 0 1.33-1.08.7-1.71l-1.5-1.5c.51-1.02.79-2.18.79-3.4 0-4.42-3.58-8-8-8z" />
                </svg>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full"></div>
                <span className="text-white text-sm font-medium">
                  @
                  {adData.campaignName.replace(/\s+/g, "").toLowerCase() ||
                    "yourbrand"}
                </span>
              </div>
              <button className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold py-1 px-3 rounded-full hover:from-pink-600 hover:to-red-600 transition-all">
                Follow
              </button>
            </div>
          </div>

          {/* Content area - moved outside video area */}
          <div className={tiktokStyles.content}>
            <div className={tiktokStyles.text}>
              {adData.adText ||
                "Your compelling ad message will appear here..."}
            </div>

            <button className={tiktokStyles.cta}>
              {adData.cta || "Shop Now"}
            </button>

            <div className={tiktokStyles.music}>
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
              {adData.musicOption === "NONE"
                ? "Original Sound"
                : adData.musicOption === "EXISTING"
                ? `Music: ${adData.musicId || "12345"}`
                : "Custom Audio"}
            </div>

            <div className={tiktokStyles.engagement}>
              <div className="flex items-center space-x-1">
                <span>❤️</span>
                <span>1.2K</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>💬</span>
                <span>89</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>↗️</span>
                <span>2.3K</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🔖</span>
                <span>456</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 p-4 bg-linear-to-br from-gray-50 to-white rounded-xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            Campaign Summary
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-lg border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Objective</div>
              <div className="font-medium text-gray-900 text-sm truncate">
                {adData.objective || "Not set"}
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Music</div>
              <div className="font-medium text-gray-900 text-sm truncate">
                {adData.musicOption === "NONE"
                  ? "Original"
                  : adData.musicOption === "EXISTING"
                  ? "ID: " + (adData.musicId || "12345")
                  : "Custom"}
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Campaign</div>
              <div className="font-medium text-gray-900 text-sm truncate">
                {adData.campaignName || "Untitled"}
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">CTA</div>
              <div className="font-medium text-gray-900 text-sm truncate">
                {adData.cta || "Not set"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdPreview;
