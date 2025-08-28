import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serverReachable, setServerReachable] = useState<boolean | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const checkServerConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('/api/auth/ping', {
          method: 'GET',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        setServerReachable(response.ok);

        if (response.ok) {
          const data = await response.json();
          console.log('🏓 Server ping successful:', data);
        }
      } catch (error) {
        console.error('🏓 Server ping failed:', error);
        setServerReachable(false);
      }
    };

    if (isOnline) {
      checkServerConnection();
    } else {
      setServerReachable(false);
    }
  }, [isOnline]);

  if (!isOnline) {
    return (
      <Alert variant="destructive" className="mb-4">
        <WifiOff className="h-4 w-4" />
        <AlertDescription>
          No internet connection. Please check your network settings.
        </AlertDescription>
      </Alert>
    );
  }

  if (serverReachable === false) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Cannot connect to server. The application may be starting up or experiencing issues.
        </AlertDescription>
      </Alert>
    );
  }

  if (serverReachable === true) {
    return (
      <Alert className="mb-4">
        <Wifi className="h-4 w-4" />
        <AlertDescription>
          Connected to server successfully.
        </AlertDescription>
      </Alert>
    );
  }

  return null; // Still checking
};
