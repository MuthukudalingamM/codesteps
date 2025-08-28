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
    const checkOAuthStatus = async (retries = 3) => {
      setIsLoading(true);
      setError(null);
      
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          console.log(`🔍 Checking OAuth status (attempt ${attempt}/${retries})...`);
          
          // Add a small delay for subsequent attempts
          if (attempt > 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
          
          const response = await fetch('/api/auth/oauth-status', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          console.log('📡 OAuth status response:', response.status, response.statusText);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const contentType = response.headers.get('content-type');
          console.log('📄 Response content-type:', contentType);
          
          if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('❌ Non-JSON response received:', text.substring(0, 200));
            throw new Error('Server returned non-JSON response');
          }
          
          const status = await response.json();
          console.log('✅ OAuth status data:', status);
          
          setOauthStatus(status);
          setIsLoading(false);
          setError(null);
          return; // Success, exit the retry loop
          
        } catch (error) {
          console.error(`❌ OAuth status check attempt ${attempt} failed:`, error);
          
          if (attempt === retries) {
            // Last attempt failed, set default status
            console.error('🚨 All OAuth status check attempts failed');
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setError(errorMessage);
            setOauthStatus({
              google: false,
              microsoft: false,
              linkedin: false,
              message: 'Failed to check OAuth configuration - email/phone login still available'
            });
            setIsLoading(false);
          }
        }
      }
    };

    // Add a small initial delay to ensure server is ready
    const timer = setTimeout(() => {
      checkOAuthStatus();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { oauthStatus, isLoading, error };
};
