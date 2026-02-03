import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tiktokApiService } from "../../services/tiktokApi";
import AdPreview from "./AdPreview";

interface FormData {
  campaignName: string;
  objective: string;
  adText: string;
  cta: string;
  musicOption: string;
  musicId?: string;
}

const AdCreationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    campaignName: "",
    objective: "",
    adText: "",
    cta: "",
    musicOption: "NONE",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle pending ad data after OAuth
  useEffect(() => {
    const pendingAdData = localStorage.getItem("pendingAdData");
    if (pendingAdData) {
      try {
        const data = JSON.parse(pendingAdData);
        setFormData(data);
        localStorage.removeItem("pendingAdData");
        
        // Auto-submit if we just came back from OAuth
        const autoSubmit = async () => {
          setIsSubmitting(true);
          try {
            await tiktokApiService.createAd(data);
            navigate("/success");
          } catch (error) {
            console.error("Error auto-submitting ad:", error);
            alert("Failed to create ad campaign after connection. Please try again.");
          } finally {
            setIsSubmitting(false);
          }
        };
        autoSubmit();
      } catch (e) {
        console.error("Error parsing pending ad data:", e);
      }
    }
  }, [navigate]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.campaignName.trim()) {
      newErrors.campaignName = "Campaign name is required";
    } else if (formData.campaignName.length < 3) {
      newErrors.campaignName = "Campaign name must be at least 3 characters";
    }

    if (!formData.objective) {
      newErrors.objective = "Objective is required";
    }

    if (!formData.cta.trim()) {
      newErrors.cta = "Call to action is required";
    }

    if (!formData.adText.trim()) {
      newErrors.adText = "Ad text is required";
    } else if (formData.adText.length > 100) {
      newErrors.adText = "Ad text must be 100 characters or less";
    }

    if (formData.musicOption === "EXISTING" && !formData.musicId?.trim()) {
      newErrors.musicId = "Music ID is required when using existing music";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      const isAuthenticated = await tiktokApiService.isAuthenticated();

      if (!isAuthenticated) {
        localStorage.setItem("pendingAdData", JSON.stringify(formData));
        navigate("/oauth/login");
        return;
      }

      const response = await tiktokApiService.createAd(formData);
      console.log("Ad campaign created:", response);

      navigate("/success");
    } catch (error) {
      console.error("Error creating ad campaign:", error);
      alert("Failed to create ad campaign. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-5 rounded-3xl shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-12 h-12 text-white">
                <path fill="currentColor" d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22c3.2 7.2 6.5 14.4 9.8 21.6 1.7 3.6 3.4 7.2 5 10.8v-.9z" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Create TikTok Ad Campaign</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Fill in all the details below and create your high-converting TikTok ad campaign</p>
        </div>

        {/* Back Button */}
        <div className="mb-8">
          <button onClick={() => navigate("/")} className="inline-flex items-center text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group border border-gray-200">
            <svg className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Back to Home</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Form Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-pink-500 to-red-500"></div>

              <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                {/* Section 1: Campaign Information */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
                    Campaign Information
                  </h2>

                  {/* Campaign Name */}
                  <div>
                    <label htmlFor="campaignName" className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
                      Campaign Name
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input 
                      type="text" 
                      id="campaignName" 
                      name="campaignName" 
                      value={formData.campaignName} 
                      onChange={handleChange} 
                      className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${errors.campaignName ? "border-red-500 bg-red-50 focus:ring-red-500/20" : "border-gray-200 focus:border-pink-500 focus:ring-pink-500/20"}`} 
                      placeholder="e.g., Summer Sale 2024, New Product Launch" 
                    />
                    {errors.campaignName && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 112 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.campaignName}
                      </p>
                    )}
                  </div>

                  {/* Objective */}
                  <div>
                    <label htmlFor="objective" className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
                      Campaign Objective
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select 
                      id="objective" 
                      name="objective" 
                      value={formData.objective} 
                      onChange={handleChange} 
                      className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${errors.objective ? "border-red-500 bg-red-50 focus:ring-red-500/20" : "border-gray-200 focus:border-pink-500 focus:ring-pink-500/20"}`}
                    >
                      <option value="">Select what you want to achieve</option>
                      <option value="TRAFFIC">Drive Traffic to Website</option>
                      <option value="CONVERSIONS">Generate Conversions & Sales</option>
                    </select>
                    {errors.objective && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 112 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.objective}
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <div>
                    <label htmlFor="cta" className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
                      Call to Action
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input 
                      type="text" 
                      id="cta" 
                      name="cta" 
                      value={formData.cta} 
                      onChange={handleChange} 
                      className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${errors.cta ? "border-red-500 bg-red-50 focus:ring-red-500/20" : "border-gray-200 focus:border-pink-500 focus:ring-pink-500/20"}`} 
                      placeholder="e.g., Shop Now, Learn More, Get Started" 
                    />
                    {errors.cta && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 112 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.cta}
                      </p>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Section 2: Ad Content */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
                    Ad Content
                  </h2>

                  {/* Ad Text */}
                  <div>
                    <label htmlFor="adText" className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
                      Ad Text
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea 
                      id="adText" 
                      name="adText" 
                      value={formData.adText} 
                      onChange={handleChange} 
                      rows={4} 
                      className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all resize-none bg-white min-h-[120px] ${errors.adText ? "border-red-500 bg-red-50 focus:ring-red-500/20" : "border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"}`} 
                      placeholder="Grab attention with a compelling message that drives action. Keep it concise and engaging!" 
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-sm text-gray-500">{formData.adText.length}/100 characters</div>
                      {errors.adText && (
                        <p className="text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 112 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.adText}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Section 3: Music Selection */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full flex items-center justify-center text-sm mr-3">3</span>
                    Music Selection
                  </h2>

                  {/* Music Options */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div 
                      onClick={() => setFormData((prev) => ({ ...prev, musicOption: "NONE" }))} 
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.musicOption === "NONE" ? "border-pink-500 bg-pink-50 shadow-lg scale-105" : "border-gray-200 hover:border-pink-300 hover:bg-pink-50 hover:scale-102"}`}
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">No Music</h3>
                        <p className="text-sm text-gray-600">Original sound</p>
                      </div>
                    </div>

                    <div 
                      onClick={() => setFormData((prev) => ({ ...prev, musicOption: "EXISTING" }))} 
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.musicOption === "EXISTING" ? "border-blue-500 bg-blue-50 shadow-lg scale-105" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:scale-102"}`}
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Existing Music</h3>
                        <p className="text-sm text-gray-600">From library</p>
                      </div>
                    </div>

                    <div 
                      onClick={() => setFormData((prev) => ({ ...prev, musicOption: "CUSTOM" }))} 
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.musicOption === "CUSTOM" ? "border-green-500 bg-green-50 shadow-lg scale-105" : "border-gray-200 hover:border-green-300 hover:bg-green-50 hover:scale-102"}`}
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Upload</h3>
                        <p className="text-sm text-gray-600">Custom audio</p>
                      </div>
                    </div>
                  </div>

                  {/* Music ID Input - Conditional */}
                  {formData.musicOption === "EXISTING" && (
                    <div>
                      <label htmlFor="musicId" className="block text-sm font-semibold text-gray-700 mb-2">
                        Music ID
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input 
                        type="text" 
                        id="musicId" 
                        name="musicId" 
                        value={formData.musicId || ""} 
                        onChange={handleChange} 
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${errors.musicId ? "border-red-500 bg-red-50 focus:ring-red-500/20" : "border-gray-200 focus:border-green-500 focus:ring-green-500/20"}`} 
                        placeholder="Enter music ID from TikTok library" 
                      />
                      {errors.musicId && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 112 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.musicId}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Campaign...
                      </>
                    ) : (
                      "Create Ad Campaign"
                    )}
                  </button>
                </div>

                {/* Support Text */}
                <div className="text-center text-gray-600 text-sm pt-4">
                  <p>
                    Need help? Check our{" "}
                    <a href="#" className="text-pink-600 hover:underline font-medium">
                      documentation
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-1">
            <AdPreview adData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdCreationForm;
