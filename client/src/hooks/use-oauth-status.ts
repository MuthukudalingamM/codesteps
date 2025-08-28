import { useState, useEffect } from 'react';

export interface OAuthStatus {
  google: boolean;
  microsoft: boolean;
  linkedin: boolean;
  message: string;
  timestamp?: string;
}

export const useOAuthStatus = () => {
  const [oauthStatus, setOauthStatus] = useState<OAuthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkOAuthStatus = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Checking OAuth status...');
        
        // Simple fetch with cache busting
        const cacheBuster = Date.now();
        const response = await fetch(`/api/auth/oauth-status?t=${cacheBuster}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
          // Disable caching completely
          cache: 'no-store',
        });
        
        console.log('📡 Response:', response.status, response.statusText);
        console.log('📄 Content-Type:', response.headers.get('content-type'));
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        // Check if response is actually JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          // Try to get the response text to see what we're getting
          const text = await response.text();
          console.error('❌ Non-JSON response received:', text.substring(0, 200));
          throw new Error('Server returned HTML instead of JSON - possible routing issue');
        }
        
        const data = await response.json();
        console.log('✅ OAuth status data:', data);
        
        setOauthStatus(data);
        setError(null);
        
      } catch (err) {
        console.error('❌ OAuth status check failed:', err);
        
        let errorMessage = 'Unknown error';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        
        // Set fallback status so app still works
        setOauthStatus({
          google: false,
          microsoft: false,
          linkedin: false,
          message: 'OAuth status unavailable - email/phone login available'
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Only run the check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Add a delay to ensure everything is initialized
      const timer = setTimeout(checkOAuthStatus, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, []);

  return { oauthStatus, isLoading, error };
};
