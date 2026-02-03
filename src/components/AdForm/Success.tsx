import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all hover:scale-[1.01]">
          <div className="p-1 bg-gradient-to-r from-green-500 to-teal-500"></div>
          
          <div className="p-10 md:p-16 text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-full shadow-xl animate-bounce">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
              Ad Created{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
                Successfully!
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Your TikTok ad campaign has been created and is now being processed. 
              You can track its performance in your TikTok Ads Manager dashboard.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                to="/"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-2xl transition-all duration-300 text-center"
              >
                Back to Dashboard
              </Link>
              <Link
                to="/create-ad"
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg text-center"
              >
                Create Another Ad
              </Link>
            </div>
          </div>

          <div className="bg-gray-50 p-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              An email confirmation has been sent to your registered account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
