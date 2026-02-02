import axios from "axios";
import { getAuthUrlWithPkce } from "../utils/tiktokConfig";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const TIKTOK_CLIENT_KEY = import.meta.env.VITE_TIKTOK_CLIENT_KEY;
const TIKTOK_REDIRECT_URI = import.meta.env.VITE_TIKTOK_REDIRECT_URI;

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  open_id?: string;
  token_type?: string;
}

interface AdCreationData {
  campaignName: string;
  objective: string;
  adText: string;
  cta: string;
  musicOption: string;
  musicId?: string;
}

interface AdCreationResponse {
  success: boolean;
  ad_id: string;
  status: string;
  message: string;
  campaign_name: string;
  objective: string;
  created_at: string;
}

interface MusicValidationResponse {
  valid: boolean;
  error?: string;
  music_id?: string;
  title?: string;
}

class TikTokApiService {
  private accessToken: string | null = null;

  constructor() {
    // Load token from sessionStorage (more secure than localStorage)
    this.accessToken = sessionStorage.getItem("tiktok_access_token");
  }

  async initiateOAuth(): Promise<void> {
    if (!TIKTOK_CLIENT_KEY || !TIKTOK_REDIRECT_URI) {
      throw new Error(
        "TikTok OAuth is not configured. Check environment variables."
      );
    }
    const state = this.generateRandomState();
    sessionStorage.setItem("oauth_state", state);

    try {
      const { url, codeVerifier } = await getAuthUrlWithPkce(state);
      sessionStorage.setItem("oauth_code_verifier", codeVerifier);

      console.log("🔐 Redirecting to TikTok OAuth with PKCE...");
      window.location.href = url;
    } catch (error) {
      console.error("❌ OAuth initiation failed:", error);
      throw new Error("Failed to initiate OAuth. Please try again.");
    }
  }
  async handleOAuthCallback(
    code: string,
    state: string
  ): Promise<TokenResponse> {
    // Validate CSRF token
    const savedState = sessionStorage.getItem("oauth_state");
    if (state !== savedState) {
      throw new Error(
        "Invalid state parameter. Possible CSRF attack detected."
      );
    }
    const codeVerifier = sessionStorage.getItem("oauth_code_verifier");
    if (!codeVerifier) {
      throw new Error("Missing code verifier. Possible session corruption.");
    }

    console.log("🔑 Exchanging code for token via backend...");

    try {
      const response = await axios.post<TokenResponse>(
        `${API_BASE_URL}/api/tiktok/token`,
        { code, code_verifier: codeVerifier },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const tokenData = response.data;

      this.setAccessToken(tokenData.access_token);

      if (tokenData.refresh_token) {
        sessionStorage.setItem("tiktok_refresh_token", tokenData.refresh_token);
      }

      if (tokenData.expires_in) {
        const expiryTime = Date.now() + tokenData.expires_in * 1000;
        sessionStorage.setItem("tiktok_token_expiry", expiryTime.toString());
      }

      sessionStorage.removeItem("oauth_state");

      console.log("✅ Authentication successful");
      return tokenData;
    } catch (error: unknown) {
      console.error("❌ Token exchange failed:", error);
      const errorMessage = this.parseErrorMessage(error);
      throw new Error(errorMessage);
    }
  }

  async refreshToken(): Promise<TokenResponse | null> {
    const refreshToken = sessionStorage.getItem("tiktok_refresh_token");
    if (!refreshToken) {
      return null;
    }

    console.log("🔄 Refreshing token...");

    try {
      const response = await axios.post<TokenResponse>(
        `${API_BASE_URL}/api/tiktok/refresh`,
        { refresh_token: refreshToken }
      );

      const tokenData = response.data;

      this.setAccessToken(tokenData.access_token);

      if (tokenData.refresh_token) {
        sessionStorage.setItem("tiktok_refresh_token", tokenData.refresh_token);
      }

      if (tokenData.expires_in) {
        const expiryTime = Date.now() + tokenData.expires_in * 1000;
        sessionStorage.setItem("tiktok_token_expiry", expiryTime.toString());
      }

      console.log("✅ Token refreshed");
      return tokenData;
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      return null;
    }
  }

  /**
   * Revoke access token (logout)
   */
  async revokeAccess(): Promise<boolean> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return false;
    }

    console.log("🚫 Revoking access via backend...");

    try {
      await axios.post(`${API_BASE_URL}/api/tiktok/revoke`, {
        access_token: accessToken,
      });

      this.logout();
      console.log("✅ Access revoked");
      return true;
    } catch (error) {
      console.error("❌ Revoke failed:", error);
      return false;
    }
  }

  /**
   * Validate music ID via backend
   */
  async validateMusicId(musicId: string): Promise<MusicValidationResponse> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error(
        "Authentication required. Please connect your TikTok account."
      );
    }

    console.log("🎵 Validating music ID via backend...");

    try {
      const response = await axios.post<MusicValidationResponse>(
        `${API_BASE_URL}/api/tiktok/music/validate`,
        { music_id: musicId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      const errorMessage = this.parseErrorMessage(error);
      return {
        valid: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Create ad via backend
   */
  async createAd(adData: AdCreationData): Promise<AdCreationResponse> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error(
        "Authentication required. Please connect your TikTok Ads account."
      );
    }

    // Auto-refresh if needed
    if (this.isTokenExpired()) {
      const refreshed = await this.refreshToken();
      if (!refreshed) {
        throw new Error(
          "Your session has expired. Please reconnect your account."
        );
      }
    }

    console.log("📢 Creating ad via backend...");

    try {
      const response = await axios.post<AdCreationResponse>(
        `${API_BASE_URL}/api/tiktok/ads/create`,
        adData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Ad created successfully");
      return response.data;
    } catch (error: unknown) {
      console.error("❌ Ad creation failed:", error);
      const errorMessage = this.parseErrorMessage(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const expiryTime = sessionStorage.getItem("tiktok_token_expiry");
    if (!expiryTime) return true;
    return Date.now() > parseInt(expiryTime);
  }

  /**
   * Auto-refresh if needed
   */
  async ensureValidToken(): Promise<boolean> {
    if (!this.getAccessToken() || this.isTokenExpired()) {
      const refreshed = await this.refreshToken();
      return !!refreshed;
    }
    return true;
  }

  /**
   * Logout - clear all tokens
   */
  logout(): void {
    console.log("👋 Logging out...");
    this.accessToken = null;
    sessionStorage.removeItem("tiktok_access_token");
    sessionStorage.removeItem("tiktok_refresh_token");
    sessionStorage.removeItem("tiktok_token_expiry");
    sessionStorage.removeItem("oauth_state");
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = sessionStorage.getItem("tiktok_access_token");
    }
    return this.accessToken;
  }

  /**
   * Set access token
   */
  private setAccessToken(token: string): void {
    this.accessToken = token;
    sessionStorage.setItem("tiktok_access_token", token);
  }

  /**
   * Generate random state for CSRF protection
   */
  private generateRandomState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  }

  /**
   * Parse error messages into user-friendly format
   */
  private parseErrorMessage(error: unknown): string {
    if (error && typeof error === "object" && "response" in error) {
      const errorObj = error as {
        response?: { data?: { error?: string }; status?: number };
      };

      if (errorObj.response?.data?.error) {
        return errorObj.response.data.error;
      }

      if (errorObj.response?.status === 401) {
        return "Authentication failed. Please reconnect your TikTok account.";
      }

      if (errorObj.response?.status === 403) {
        return "Permission denied. This feature may be geo-restricted or require additional permissions.";
      }

      if (errorObj.response?.status === 429) {
        return "Too many requests. Please wait a moment and try again.";
      }

      if (errorObj.response?.status && errorObj.response.status >= 500) {
        return "TikTok service is temporarily unavailable. Please try again later.";
      }
    }

    if (error && typeof error === "object" && "message" in error) {
      const errorObj = error as { message?: string };
      if (errorObj.message) {
        return errorObj.message;
      }
    }

    return "An unexpected error occurred. Please try again.";
  }
}

// Export singleton instance
export const tiktokApiService = new TikTokApiService();
