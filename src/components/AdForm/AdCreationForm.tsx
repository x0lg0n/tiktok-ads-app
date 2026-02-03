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

  useEffect(() => {
    const pendingAdData = localStorage.getItem("pendingAdData");
    if (pendingAdData) {
      try {
        const data = JSON.parse(pendingAdData);
        setFormData(data);
        localStorage.removeItem("pendingAdData");
        
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

  // Inline styles to guarantee visibility
  const inputBaseStyle = {
    width: '100%',
    padding: '16px 20px',
    border: '2px solid #d1d5db',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none' as const,
    transition: 'all 0.3s',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
  };

  const inputErrorStyle = {
    ...inputBaseStyle,
    border: '2px solid #ef4444',
    backgroundColor: '#fef2f2',
  };

  const textareaStyle = {
    ...inputBaseStyle,
    minHeight: '150px',
    resize: 'vertical' as const,
    backgroundColor: '#f9fafb',
    color: '#111827',
    lineHeight: '1.5',
  };

  const textareaErrorStyle = {
    ...textareaStyle,
    border: '2px solid #ef4444',
    backgroundColor: '#fef2f2',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #fdf2f8, #ffffff, #faf5ff)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{ 
              background: 'linear-gradient(to right, #ec4899, #ef4444)', 
              padding: '20px', 
              borderRadius: '24px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style={{ width: '48px', height: '48px', color: 'white' }}>
                <path fill="currentColor" d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22c3.2 7.2 6.5 14.4 9.8 21.6 1.7 3.6 3.4 7.2 5 10.8v-.9z" />
              </svg>
            </div>
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#111827', marginBottom: '16px' }}>
            Create TikTok Ad Campaign
          </h1>
          <p style={{ fontSize: '20px', color: '#6b7280', maxWidth: '672px', margin: '0 auto' }}>
            Fill in all the details below and create your high-converting TikTok ad campaign
          </p>
        </div>

        {/* Back Button */}
        <div style={{ marginBottom: '32px' }}>
          <button 
            onClick={() => navigate("/")} 
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              color: '#374151',
              background: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            ← Back to Home
          </button>
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '40px' }}>
          {/* Form Column */}
          <div>
            <div style={{ 
              background: 'white', 
              borderRadius: '24px', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              border: '1px solid #f3f4f6',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '4px', background: 'linear-gradient(to right, #ec4899, #ef4444)' }}></div>

              <form onSubmit={handleSubmit} style={{ padding: '40px' }}>
                {/* Section 1: Campaign Information */}
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>
                    <span style={{ 
                      display: 'inline-block',
                      width: '32px', 
                      height: '32px', 
                      background: 'linear-gradient(to right, #ec4899, #ef4444)',
                      color: 'white',
                      borderRadius: '50%',
                      textAlign: 'center',
                      lineHeight: '32px',
                      marginRight: '12px',
                      fontSize: '14px'
                    }}>1</span>
                    Campaign Information
                  </h2>

                  {/* Campaign Name */}
                  <div style={{ marginBottom: '24px' }}>
                    <label htmlFor="campaignName" style={{ display: 'block', fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                      Campaign Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      id="campaignName" 
                      name="campaignName" 
                      value={formData.campaignName} 
                      onChange={handleChange} 
                      style={errors.campaignName ? inputErrorStyle : inputBaseStyle}
                      placeholder="e.g., Summer Sale 2024, New Product Launch" 
                    />
                    {errors.campaignName && (
                      <p style={{ marginTop: '8px', fontSize: '14px', color: '#ef4444' }}>
                        ⚠️ {errors.campaignName}
                      </p>
                    )}
                  </div>

                  {/* Objective */}
                  <div style={{ marginBottom: '24px' }}>
                    <label htmlFor="objective" style={{ display: 'block', fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                      Campaign Objective <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select 
                      id="objective" 
                      name="objective" 
                      value={formData.objective} 
                      onChange={handleChange} 
                      style={errors.objective ? inputErrorStyle : inputBaseStyle}
                    >
                      <option value="">Select what you want to achieve</option>
                      <option value="TRAFFIC">Drive Traffic to Website</option>
                      <option value="CONVERSIONS">Generate Conversions & Sales</option>
                    </select>
                    {errors.objective && (
                      <p style={{ marginTop: '8px', fontSize: '14px', color: '#ef4444' }}>
                        ⚠️ {errors.objective}
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <div style={{ marginBottom: '24px' }}>
                    <label htmlFor="cta" style={{ display: 'block', fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                      Call to Action <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      id="cta" 
                      name="cta" 
                      value={formData.cta} 
                      onChange={handleChange} 
                      style={errors.cta ? inputErrorStyle : inputBaseStyle}
                      placeholder="e.g., Shop Now, Learn More, Get Started" 
                    />
                    {errors.cta && (
                      <p style={{ marginTop: '8px', fontSize: '14px', color: '#ef4444' }}>
                        ⚠️ {errors.cta}
                      </p>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid #e5e7eb', margin: '32px 0' }}></div>

                {/* Section 2: Ad Content */}
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>
                    <span style={{ 
                      display: 'inline-block',
                      width: '32px', 
                      height: '32px', 
                      background: 'linear-gradient(to right, #a855f7, #ec4899)',
                      color: 'white',
                      borderRadius: '50%',
                      textAlign: 'center',
                      lineHeight: '32px',
                      marginRight: '12px',
                      fontSize: '14px'
                    }}>2</span>
                    Ad Content
                  </h2>

                  {/* Ad Text - THE CRITICAL FIELD */}
                  <div style={{ marginBottom: '24px' }}>
                    <label htmlFor="adText" style={{ display: 'block', fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                      Ad Text <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea 
                      id="adText" 
                      name="adText" 
                      value={formData.adText} 
                      onChange={handleChange} 
                      rows={6}
                      style={errors.adText ? textareaErrorStyle : textareaStyle}
                      placeholder="Grab attention with a compelling message that drives action. Keep it concise and engaging!" 
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {formData.adText.length}/100 characters
                      </div>
                      {errors.adText && (
                        <p style={{ fontSize: '14px', color: '#ef4444' }}>
                          ⚠️ {errors.adText}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid #e5e7eb', margin: '32px 0' }}></div>

                {/* Section 3: Music Selection */}
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>
                    <span style={{ 
                      display: 'inline-block',
                      width: '32px', 
                      height: '32px', 
                      background: 'linear-gradient(to right, #10b981, #14b8a6)',
                      color: 'white',
                      borderRadius: '50%',
                      textAlign: 'center',
                      lineHeight: '32px',
                      marginRight: '12px',
                      fontSize: '14px'
                    }}>3</span>
                    Music Selection
                  </h2>

                  {/* Music Options */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    <div 
                      onClick={() => setFormData((prev) => ({ ...prev, musicOption: "NONE" }))} 
                      style={{
                        padding: '24px',
                        borderRadius: '16px',
                        border: formData.musicOption === "NONE" ? '2px solid #ec4899' : '2px solid #e5e7eb',
                        backgroundColor: formData.musicOption === "NONE" ? '#fdf2f8' : 'white',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.3s'
                      }}
                    >
                      <div style={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>No Music</div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>Original sound</div>
                    </div>

                    <div 
                      onClick={() => setFormData((prev) => ({ ...prev, musicOption: "EXISTING" }))} 
                      style={{
                        padding: '24px',
                        borderRadius: '16px',
                        border: formData.musicOption === "EXISTING" ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                        backgroundColor: formData.musicOption === "EXISTING" ? '#eff6ff' : 'white',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.3s'
                      }}
                    >
                      <div style={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Existing Music</div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>From library</div>
                    </div>

                    <div 
                      onClick={() => setFormData((prev) => ({ ...prev, musicOption: "CUSTOM" }))} 
                      style={{
                        padding: '24px',
                        borderRadius: '16px',
                        border: formData.musicOption === "CUSTOM" ? '2px solid #10b981' : '2px solid #e5e7eb',
                        backgroundColor: formData.musicOption === "CUSTOM" ? '#f0fdf4' : 'white',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.3s'
                      }}
                    >
                      <div style={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Upload</div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>Custom audio</div>
                    </div>
                  </div>

                  {/* Music ID Input - Conditional */}
                  {formData.musicOption === "EXISTING" && (
                    <div>
                      <label htmlFor="musicId" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                        Music ID <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input 
                        type="text" 
                        id="musicId" 
                        name="musicId" 
                        value={formData.musicId || ""} 
                        onChange={handleChange} 
                        style={errors.musicId ? inputErrorStyle : inputBaseStyle}
                        placeholder="Enter music ID from TikTok library" 
                      />
                      {errors.musicId && (
                        <p style={{ marginTop: '8px', fontSize: '14px', color: '#ef4444' }}>
                          ⚠️ {errors.musicId}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(to right, #ec4899, #ef4444)',
                      color: 'white',
                      fontWeight: 'bold',
                      padding: '16px 24px',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      fontSize: '16px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      opacity: isSubmitting ? 0.5 : 1,
                      transition: 'all 0.3s'
                    }}
                  >
                    {isSubmitting ? "Creating Campaign..." : "Create Ad Campaign"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Column */}
          <div>
            <AdPreview adData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdCreationForm;
