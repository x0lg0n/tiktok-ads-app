import { tiktokApiService } from "../../services/tiktokApi";

interface ConnectButtonProps {
  children?: React.ReactNode;
  className?: string;
}

const ConnectButton = ({
  children = "Connect TikTok Ads Account",
  className = "",
}: ConnectButtonProps) => {
  const handleConnect = async () => {
    try {
      // Save that user came from connect button
      localStorage.setItem("oauthSource", "connectButton");
      await tiktokApiService.initiateOAuth();
    } catch (error) {
      console.error("OAuth initiation failed:", error);
      alert("Failed to connect to TikTok. Please check your configuration.");
    }
  };

  return (
    <button
      onClick={() => {
        handleConnect();
      }}
      className={`w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        className="w-5 h-5 mr-2">
        {/* TikTok logo */}
        <path
          fill="currentColor"
          d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22c3.2 7.2 6.5 14.4 9.8 21.6 1.7 3.6 3.4 7.2 5 10.8v-.9z"
        />
      </svg>
      {children}
    </button>
  );
};

export default ConnectButton;
