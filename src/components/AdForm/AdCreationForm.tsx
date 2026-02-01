import { useState } from "react";
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
  const [currentStep, setCurrentStep] = useState(1);

  const validateCurrentStep = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (currentStep === 1) {
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
    } else if (currentStep === 2) {
      if (!formData.adText.trim()) {
        newErrors.adText = "Ad text is required";
      } else if (formData.adText.length > 100) {
        newErrors.adText = "Ad text must be 100 characters or less";
      }
    } else if (currentStep === 3) {
      if (formData.musicOption === "EXISTING" && !formData.musicId?.trim()) {
        newErrors.musicId = "Music ID is required when using existing music";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Check if user is authenticated
      const isAuthenticated = await tiktokApiService.isAuthenticated();

      if (!isAuthenticated) {
        // Save form data to localStorage and redirect to OAuth
        localStorage.setItem("pendingAdData", JSON.stringify(formData));
        navigate("/oauth/connect");
        return;
      }

      // User is authenticated, proceed with ad creation
      const response = await tiktokApiService.createAd(formData);
      console.log("Ad campaign created:", response);

      // Show success message and redirect
      alert("Ad campaign created successfully!");
      navigate("/");
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

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Centered Header */}
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
            Create TikTok Ad Campaign
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fill in the details below to create your high-converting TikTok ad
            campaign
          </p>
        </div>

        {/* Prominent Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group border border-gray-200">
            <svg
              className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform text-pink-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span className="font-semibold">Back to Home</span>
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Form content */}
              <div className="p-1 bg-gradient-to-r from-pink-500 to-red-500"></div>

              <div className="p-8 md:p-10">
                {/* Form Steps Progress Bar - Interactive */}
                <div className="mb-10 bg-gradient-to-r from-pink-50 to-red-50 rounded-2xl p-6 border border-pink-100">
                  <div className="flex justify-between items-center max-w-2xl mx-auto">
                    <div
                      className="flex flex-col items-center cursor-pointer group"
                      onClick={() => setCurrentStep(1)}>
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg mb-2 transition-all duration-300 ${
                          currentStep >= 1
                            ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg scale-110"
                            : "bg-gray-200 text-gray-400 group-hover:bg-pink-200 group-hover:text-pink-700"
                        }`}>
                        <span className="font-bold text-xl">1</span>
                      </div>
                      <span
                        className={`text-sm font-semibold transition-colors ${
                          currentStep >= 1 ? "text-gray-900" : "text-gray-500"
                        }`}>
                        Campaign
                      </span>
                    </div>

                    <div className="flex-1 mx-4 relative">
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 rounded-full">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            currentStep >= 2
                              ? "w-full bg-gradient-to-r from-pink-500 to-red-500"
                              : currentStep >= 1
                              ? "w-1/2 bg-gradient-to-r from-pink-500 to-red-500"
                              : "w-0 bg-gradient-to-r from-pink-500 to-red-500"
                          }`}></div>
                      </div>
                    </div>

                    <div
                      className="flex flex-col items-center cursor-pointer group"
                      onClick={() => currentStep >= 1 && setCurrentStep(2)}>
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg mb-2 transition-all duration-300 ${
                          currentStep >= 2
                            ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg scale-110"
                            : currentStep >= 1
                            ? "bg-gradient-to-r from-pink-300 to-red-300 text-white group-hover:scale-105"
                            : "bg-gray-200 text-gray-400"
                        }`}>
                        <span className="font-bold text-xl">2</span>
                      </div>
                      <span
                        className={`text-sm font-semibold transition-colors ${
                          currentStep >= 2
                            ? "text-gray-900"
                            : currentStep >= 1
                            ? "text-gray-600"
                            : "text-gray-400"
                        }`}>
                        Creative
                      </span>
                    </div>

                    <div className="flex-1 mx-4 relative">
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 rounded-full">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            currentStep >= 3
                              ? "w-full bg-gradient-to-r from-pink-500 to-red-500"
                              : currentStep >= 2
                              ? "w-1/3 bg-gradient-to-r from-pink-500 to-red-500"
                              : "w-0 bg-gradient-to-r from-pink-500 to-red-500"
                          }`}></div>
                      </div>
                    </div>

                    <div
                      className="flex flex-col items-center cursor-pointer group"
                      onClick={() => currentStep >= 2 && setCurrentStep(3)}>
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg mb-2 transition-all duration-300 ${
                          currentStep >= 3
                            ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg scale-110"
                            : currentStep >= 2
                            ? "bg-gradient-to-r from-pink-300 to-red-300 text-white group-hover:scale-105"
                            : "bg-gray-200 text-gray-400"
                        }`}>
                        <span className="font-bold text-xl">3</span>
                      </div>
                      <span
                        className={`text-sm font-semibold transition-colors ${
                          currentStep >= 3
                            ? "text-gray-900"
                            : currentStep >= 2
                            ? "text-gray-600"
                            : "text-gray-400"
                        }`}>
                        Music
                      </span>
                    </div>
                  </div>
                </div>

                <form
                  id="adCreationForm"
                  onSubmit={handleSubmit}
                  className="space-y-10">
                  {/* Step 1: Campaign */}
                  {currentStep === 1 && (
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Campaign Name */}
                      <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl p-6 border-2 border-pink-100 bg-pink-50/30 hover:border-pink-200 transition-all duration-300 shadow-sm">
                          <label
                            htmlFor="campaignName"
                            className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
                            <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3 animate-pulse">
                              1
                            </span>
                            Campaign Name
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <p className="text-sm text-gray-600 mb-4">
                            Create a memorable name that identifies your ad
                            campaign
                          </p>
                          <input
                            type="text"
                            id="campaignName"
                            name="campaignName"
                            value={formData.campaignName}
                            onChange={handleChange}
                            className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-500/20 transition-all ${
                              errors.campaignName
                                ? "border-red-500 bg-red-50 focus:ring-red-500/20"
                                : "border-gray-200 focus:border-pink-500"
                            }`}
                            placeholder="e.g., Summer Sale 2024, New Product Launch"
                          />
                          {errors.campaignName && (
                            <p className="mt-3 text-sm text-red-600 flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 112 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"></path>
                              </svg>
                              {errors.campaignName}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Objective */}
                      <div>
                        <div className="bg-white rounded-2xl p-6 border-2 border-pink-100 bg-pink-50/30 hover:border-pink-200 transition-all duration-300 shadow-sm h-full">
                          <label
                            htmlFor="objective"
                            className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
                            <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3 animate-pulse">
                              2
                            </span>
                            Objective
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <p className="text-sm text-gray-600 mb-4">
                            Choose what you want to achieve with this ad
                          </p>
                          <select
                            id="objective"
                            name="objective"
                            value={formData.objective}
                            onChange={handleChange}
                            className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-500/20 transition-all ${
                              errors.objective
                                ? "border-red-500 bg-red-50 focus:ring-red-500/20"
                                : "border-gray-200 focus:border-pink-500"
                            }`}>
                            <option value="">Select objective</option>
                            <option value="TRAFFIC">Drive Traffic</option>
                            <option value="CONVERSIONS">
                              Generate Conversions
                            </option>
                          </select>
                          {errors.objective && (
                            <p className="mt-3 text-sm text-red-600 flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 112 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"></path>
                              </svg>
                              {errors.objective}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* CTA */}
                      <div>
                        <div className="bg-white rounded-2xl p-6 border-2 border-pink-100 bg-pink-50/30 hover:border-pink-200 transition-all duration-300 shadow-sm h-full">
                          <label
                            htmlFor="cta"
                            className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
                            <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3 animate-pulse">
                              3
                            </span>
                            Call to Action
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <p className="text-sm text-gray-600 mb-4">
                            What action do you want viewers to take?
                          </p>
                          <input
                            type="text"
                            id="cta"
                            name="cta"
                            value={formData.cta}
                            onChange={handleChange}
                            className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-500/20 transition-all ${
                              errors.cta
                                ? "border-red-500 bg-red-50 focus:ring-red-500/20"
                                : "border-gray-200 focus:border-pink-500"
                            }`}
                            placeholder="e.g., Shop Now, Learn More, Get Started"
                          />
                          {errors.cta && (
                            <p className="mt-3 text-sm text-red-600 flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 112 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"></path>
                              </svg>
                              {errors.cta}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Creative */}
                  {currentStep === 2 && (
                    <div>
                      {/* Ad Text */}
                      <div>
                        <div className="bg-white rounded-2xl p-6 border-2 border-purple-100 bg-purple-50/30 hover:border-purple-200 transition-all duration-300 shadow-sm">
                          <label
                            htmlFor="adText"
                            className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3 animate-pulse">
                              4
                            </span>
                            Ad Text
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <p className="text-sm text-gray-600 mb-4">
                            Your main message - make it catchy and actionable!
                          </p>
                          <textarea
                            id="adText"
                            name="adText"
                            value={formData.adText}
                            onChange={handleChange}
                            rows={4}
                            className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all ${
                              errors.adText
                                ? "border-red-500 bg-red-50 focus:ring-red-500/20"
                                : "border-gray-200 focus:border-purple-500"
                            }`}
                            placeholder="Grab attention with a compelling message that drives action. Keep it concise and engaging!"
                          />
                          <div className="flex justify-between items-center mt-3">
                            <div className="text-sm text-gray-500">
                              {formData.adText.length}/100 characters
                            </div>
                            {errors.adText && (
                              <p className="text-sm text-red-600 flex items-center">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 112 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"></path>
                                </svg>
                                {errors.adText}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Music */}
                  {currentStep === 3 && (
                    <div>
                      {/* Music Selection */}
                      <div>
                        <div className="bg-white rounded-2xl p-6 border-2 border-green-100 bg-green-50/30 hover:border-green-200 transition-all duration-300 shadow-sm">
                          <label className="block text-lg font-bold text-gray-900 mb-5 flex items-center">
                            <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3 animate-pulse">
                              5
                            </span>
                            Music Selection
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <p className="text-sm text-gray-600 mb-6">
                            Choose audio that matches your brand and message
                          </p>

                          <div className="grid md:grid-cols-3 gap-4">
                            <div
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  musicOption: "NONE",
                                }))
                              }
                              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                                formData.musicOption === "NONE"
                                  ? "border-pink-500 bg-pink-50 shadow-lg scale-105"
                                  : "border-gray-200 hover:border-pink-300 hover:bg-pink-50 hover:scale-102"
                              }`}>
                              <div className="text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                                  </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">
                                  No Music
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Use original sound
                                </p>
                              </div>
                            </div>

                            <div
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  musicOption: "EXISTING",
                                }))
                              }
                              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                                formData.musicOption === "EXISTING"
                                  ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:scale-102"
                              }`}>
                              <div className="text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                                  </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">
                                  Existing Music
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Use music ID
                                </p>
                              </div>
                            </div>

                            <div
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  musicOption: "CUSTOM",
                                }))
                              }
                              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                                formData.musicOption === "CUSTOM"
                                  ? "border-green-500 bg-green-50 shadow-lg scale-105"
                                  : "border-gray-200 hover:border-green-300 hover:bg-green-50 hover:scale-102"
                              }`}>
                              <div className="text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                  </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">
                                  Upload
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Custom audio
                                </p>
                              </div>
                            </div>
                          </div>

                          {formData.musicOption === "EXISTING" && (
                            <div className="mt-6">
                              <label
                                htmlFor="musicId"
                                className="block text-sm font-semibold text-gray-700 mb-2">
                                Music ID
                              </label>
                              <input
                                type="text"
                                id="musicId"
                                name="musicId"
                                value={formData.musicId || ""}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all ${
                                  errors.musicId
                                    ? "border-red-500 bg-red-50 focus:ring-red-500/20"
                                    : "border-gray-200 focus:border-green-500"
                                }`}
                                placeholder="Enter music ID"
                              />
                              {errors.musicId && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 112 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                      clipRule="evenodd"></path>
                                  </svg>
                                  {errors.musicId}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Navigation Buttons */}
              <div className="px-8 md:px-10 pb-6 pt-2">
                <div className="flex gap-4">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentStep((prev) => Math.max(1, prev - 1))
                      }
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all duration-300">
                      ← Previous
                    </button>
                  )}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => {
                        // Validate current step before proceeding
                        const isValid = validateCurrentStep();
                        if (isValid) {
                          setCurrentStep((prev) => Math.min(3, prev + 1));
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg">
                      Next Step →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      form="adCreationForm"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
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
                          Creating Campaign...
                        </div>
                      ) : (
                        "Create Ad Campaign"
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="px-8 md:px-10 pb-8 pt-4 text-center text-gray-600 text-sm">
                <p>
                  Need help? Contact our support team or check our{" "}
                  <a
                    href="#"
                    className="text-pink-600 hover:underline font-medium">
                    documentation
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Ad Preview Column */}
          <div className="lg:col-span-1">
            <AdPreview adData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdCreationForm;
