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
    const tryFetch = async (url: string, options: RequestInit = {}) => {
      console.log(`📡 Attempting fetch to: ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 8000);
      
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    };

    const checkOAuthStatus = async () => {
      setIsLoading(true);
      setError(null);
      
      const attempts = [
        // Try 1: Absolute URL
        () => {
          const baseUrl = window.location.origin;
          return tryFetch(`${baseUrl}/api/auth/oauth-status`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache',
            },
          });
        },
        
        // Try 2: Relative URL
        () => {
          return tryFetch('/api/auth/oauth-status', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache',
            },
          });
        },
        
        // Try 3: Simple fetch without extra headers
        () => {
          return tryFetch('/api/auth/oauth-status', {
            method: 'GET',
          });
        }
      ];
      
      for (let i = 0; i < attempts.length; i++) {
        try {
          console.log(`🔍 OAuth status check attempt ${i + 1}/${attempts.length}`);
          
          const response = await attempts[i]();
          
          console.log('📡 Response received:', response.status, response.statusText);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('❌ Non-JSON response:', text.substring(0, 200));
            throw new Error(`Expected JSON, got: ${text.substring(0, 100)}`);
          }
          
          const status = await response.json();
          console.log('✅ OAuth status received:', status);
          
          setOauthStatus(status);
          setError(null);
          setIsLoading(false);
          return; // Success! Exit the retry loop
          
        } catch (error) {
          console.error(`❌ Attempt ${i + 1} failed:`, error);
          
          // If this was the last attempt, handle the error
          if (i === attempts.length - 1) {
            let errorMessage = 'Failed to check OAuth configuration';
            
            if (error instanceof Error) {
              if (error.name === 'AbortError') {
                errorMessage = 'Request timed out - server may be slow';
              } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                errorMessage = 'Network error - unable to connect to server';
              } else {
                errorMessage = error.message;
              }
            }
            
            console.error('🚨 All attempts failed. Final error:', errorMessage);
            setError(errorMessage);
            
            // Set fallback status - OAuth unavailable, but app still works
            setOauthStatus({
              google: false,
              microsoft: false,
              linkedin: false,
              message: 'OAuth configuration unavailable - email/phone login available'
            });
          }
          
          // Wait a bit before the next attempt
          if (i < attempts.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      setIsLoading(false);
    };

    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.log('🚫 Not in browser environment, skipping OAuth check');
      setIsLoading(false);
      return;
    }

    // Wait for the app to fully initialize
    const timer = setTimeout(() => {
      console.log('🚀 Starting OAuth status check...');
      console.log('🌐 Current location:', window.location.href);
      checkOAuthStatus();
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      console.log('🧹 OAuth status check cleanup');
    };
  }, []);

  return { oauthStatus, isLoading, error };
};
