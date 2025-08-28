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
        console.log('🔍 Starting OAuth status check...');
        console.log('🌐 Current URL:', window.location.href);
        console.log('🔗 Base URL:', window.location.origin);
        
        // Use absolute URL to avoid any relative path issues
        const baseUrl = window.location.origin;
        const endpoint = `${baseUrl}/api/auth/oauth-status`;
        
        console.log('📡 Fetching from:', endpoint);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
          console.error('⏱️ Request timed out after 10 seconds');
        }, 10000);
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        console.log('📡 Response received:', response.status, response.statusText);
        console.log('📄 Response headers:', Object.fromEntries(response.headers.entries()));
        
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
        
      } catch (error) {
        console.error('❌ OAuth status check failed:', error);
        
        let errorMessage = 'Unknown error occurred';
        
        if (error instanceof Error) {
          errorMessage = error.message;
          
          // Handle specific error types
          if (error.name === 'AbortError') {
            errorMessage = 'Request timed out - server may be slow to respond';
          } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Network error - unable to connect to server';
          } else if (error.message.includes('NetworkError')) {
            errorMessage = 'Network connection failed';
          }
        }
        
        console.error('🚨 Final error message:', errorMessage);
        setError(errorMessage);
        
        // Set fallback status
        setOauthStatus({
          google: false,
          microsoft: false,
          linkedin: false,
          message: 'OAuth configuration unavailable - email/phone login available'
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Wait a bit longer for the app to fully initialize
    const timer = setTimeout(() => {
      console.log('🚀 Initializing OAuth status check...');
      checkOAuthStatus();
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      console.log('🧹 OAuth status check cleanup');
    };
  }, []);

  return { oauthStatus, isLoading, error };
};
