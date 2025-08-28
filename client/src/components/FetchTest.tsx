import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const FetchTest = () => {
  const [testResults, setTestResults] = useState<{[key: string]: 'pending' | 'success' | 'error' | string}>({});
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (name: string, testFn: () => Promise<any>) => {
    setTestResults(prev => ({ ...prev, [name]: 'pending' }));
    
    try {
      const result = await testFn();
      setTestResults(prev => ({ ...prev, [name]: 'success' }));
      console.log(`✅ ${name} test passed:`, result);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setTestResults(prev => ({ ...prev, [name]: errorMsg }));
      console.error(`❌ ${name} test failed:`, error);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults({});

    // Test 1: Basic fetch capability
    await runTest('Basic Fetch', async () => {
      const response = await fetch('data:application/json,{"test":true}');
      return await response.json();
    });

    // Test 2: Server ping
    await runTest('Server Ping', async () => {
      const response = await fetch('/api/auth/ping');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    });

    // Test 3: OAuth status
    await runTest('OAuth Status', async () => {
      const response = await fetch('/api/auth/oauth-status');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    });

    // Test 4: OAuth status with full URL
    await runTest('OAuth Status (Full URL)', async () => {
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/auth/oauth-status`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    });

    setIsRunning(false);
  };

  const getIcon = (status: string) => {
    if (status === 'pending') return <Loader2 className="h-4 w-4 animate-spin" />;
    if (status === 'success') return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getVariant = (status: string): "default" | "destructive" => {
    if (status === 'success') return 'default';
    if (status === 'pending') return 'default';
    return 'destructive';
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Network Connectivity Tests</h3>
        <Button onClick={runAllTests} disabled={isRunning} size="sm">
          {isRunning ? 'Running...' : 'Run Tests'}
        </Button>
      </div>
      
      <div className="space-y-2">
        {Object.entries(testResults).map(([name, status]) => (
          <Alert key={name} variant={getVariant(status)} className="py-2">
            {getIcon(status)}
            <AlertDescription className="ml-2">
              <span className="font-medium">{name}:</span>{' '}
              {status === 'success' ? 'Passed' : status === 'pending' ? 'Running...' : status}
            </AlertDescription>
          </Alert>
        ))}
      </div>
      
      {Object.keys(testResults).length === 0 && (
        <Alert>
          <AlertDescription>
            Click "Run Tests" to check network connectivity and server availability.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
