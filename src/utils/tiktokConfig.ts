// TikTok OAuth Configuration (Authorization Code flow with PKCE)
// Client key is public; client_secret must only be used on the backend.
// Supports both VITE_TIKTOK_CLIENT_KEY and VITE_TIKTOK_CLIENT_ID (TikTok calls it "client key" in the API).
const TIKTOK_CONFIG = {
  clientKey: (import.meta.env.VITE_TIKTOK_CLIENT_KEY || import.meta.env.VITE_TIKTOK_CLIENT_ID || '').trim(),
  redirectUri: (import.meta.env.VITE_TIKTOK_REDIRECT_URI || import.meta.env.VITE_REDIRECT_URI || 'http://localhost:5173/callback').trim(),
  scopes: ['user.info.basic', 'ads.manage'], // Ads permission scope required per assignment
};

const PKCE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';

/**
 * Generate a cryptographically random code_verifier (43–128 chars; TikTok accepts S256).
 */
function generateCodeVerifier(): string {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => PKCE_CHARS[b % PKCE_CHARS.length]).join('');
}

/**
 * Compute S256 code_challenge: base64url(SHA256(code_verifier)), no padding.
 */
async function computeCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Start PKCE flow: generate verifier + challenge, return auth URL.
 * Caller must store code_verifier in sessionStorage under 'oauth_code_verifier' for the callback.
 */
async function getAuthUrlWithPkce(state: string): Promise<{ url: string; codeVerifier: string }> {
  if (!TIKTOK_CONFIG.clientKey) {
    throw new Error(
      'TikTok Client Key is missing. Add VITE_TIKTOK_CLIENT_KEY or VITE_TIKTOK_CLIENT_ID to your .env file in tiktok-ads-app, then restart the dev server (e.g. bun run dev).'
    );
  }
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await computeCodeChallenge(codeVerifier);
  const params = new URLSearchParams({
    client_key: TIKTOK_CONFIG.clientKey,
    response_type: 'code',
    scope: TIKTOK_CONFIG.scopes.join(','),
    redirect_uri: TIKTOK_CONFIG.redirectUri,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
  const url = `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
  return { url, codeVerifier };
}

export { TIKTOK_CONFIG, getAuthUrlWithPkce };