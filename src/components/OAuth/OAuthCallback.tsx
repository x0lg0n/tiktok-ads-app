import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { tiktokApiService } from '../../services/tiktokApi';

export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      // Handle OAuth errors from TikTok — human-readable only, never raw API JSON
      if (error) {
        let userMessage: string;
        switch (error) {
          case 'access_denied':
            userMessage = 'You denied access to the application. Connect again and approve the requested permissions.';
            break;
          case 'invalid_scope':
            userMessage = 'Missing Ads permission. Ensure your TikTok app has the ads.manage scope and try again.';
            break;
          case 'invalid_client':
            userMessage = 'Invalid app configuration. Please check your TikTok app client ID and settings.';
            break;
          case 'invalid_request':
            userMessage = 'Invalid sign-in request. Please try again from the app.';
            break;
          case 'invalid_grant':
            userMessage = 'Authorization expired or invalid. Please try connecting again.';
            break;
          default:
            userMessage = 'We couldn’t complete sign-in. Please try again or contact support.';
        }
        setStatus('error');
        setErrorMessage(userMessage);
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setErrorMessage('Invalid sign-in response. Please try connecting again.');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        // Exchange code for token via backend
        await tiktokApiService.handleOAuthCallback(code, state);
        
        setStatus('success');

        // If user came from ad form, return them to create-ad
        const pendingAd = localStorage.getItem('pendingAdData');
        if (pendingAd) {
          localStorage.removeItem('pendingAdData');
          setTimeout(() => navigate('/create-ad'), 1500);
        } else {
          setTimeout(() => navigate('/'), 1500);
        }
        
      } catch (err: unknown) {
        console.error('OAuth callback error:', err);
        const msg = err instanceof Error ? err.message : 'Failed to complete sign-in. Please try again.';
        setStatus('error');
        setErrorMessage(msg);
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center bg-gray-50">
      {status === 'loading' && (
        <div className="max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 border-4 border-gray-200 rounded-full border-t-pink-500 animate-spin"></div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Connecting to TikTok...</h2>
          <p className="text-gray-600">Please wait while we complete authentication</p>
        </div>
      )}

      {status === 'success' && (
        <div className="max-w-md">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-cyan-400">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-cyan-500">Connected Successfully!</h2>
          <p className="text-gray-600">Redirecting to app...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="max-w-md">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-pink-500">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-pink-500">Authentication Failed</h2>
          <p className="mb-4 text-gray-700">{errorMessage}</p>
          <p className="text-sm text-gray-500">Redirecting back to home...</p>
        </div>
      )}
    </div>
  );
}