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
        const response = await fetch('/api/auth/oauth-status', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON, got: ${text.substring(0, 100)}`);
        }

        const status = await response.json();
        setOauthStatus(status);
        setError(null);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
        // Set fallback status
        setOauthStatus({
          google: false,
          microsoft: false,
          linkedin: false,
          message: 'OAuth configuration check failed - email/phone login available'
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure server is ready
    const timer = setTimeout(checkOAuthStatus, 100);
    return () => clearTimeout(timer);
  }, []);

  return { oauthStatus, isLoading, error };
};
