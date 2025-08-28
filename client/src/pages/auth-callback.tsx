import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Code } from "lucide-react";

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const provider = urlParams.get('provider');
    const error = urlParams.get('error');

    if (token && provider) {
      // Store the token
      localStorage.setItem('authToken', token);
      
      // Redirect to dashboard
      setTimeout(() => {
        setLocation('/dashboard');
      }, 1000);
    } else if (error) {
      // Redirect to login with error
      setTimeout(() => {
        setLocation(`/login?error=${error}`);
      }, 1000);
    } else {
      // No valid parameters, redirect to login
      setTimeout(() => {
        setLocation('/login');
      }, 1000);
    }
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Code className="text-primary-foreground h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">CodeSteps</h1>
          </div>
          <p className="text-muted-foreground">AI-Powered Programming Learning</p>
        </div>

        {/* Loading Card */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <h2 className="text-xl font-semibold">Completing Sign In...</h2>
              <p className="text-muted-foreground">
                Please wait while we redirect you to your dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
