import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useOAuthStatus } from "@/hooks/use-oauth-status";
import { Eye, EyeOff, Code, ArrowLeft, Mail, Phone, AlertCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

const emailLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const phoneLoginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type EmailLoginForm = z.infer<typeof emailLoginSchema>;
type PhoneLoginForm = z.infer<typeof phoneLoginSchema>;
type OTPForm = z.infer<typeof otpSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPStep, setShowOTPStep] = useState(false);
  const [pendingVerification, setPendingVerification] = useState<string>("");
  const { toast } = useToast();
  const { login, loginWithPhone, verifyOTP } = useAuth();
  const { oauthStatus, isLoading: isOAuthLoading, error: oauthError } = useOAuthStatus();

  const emailForm = useForm<EmailLoginForm>({
    resolver: zodResolver(emailLoginSchema),
  });

  const phoneForm = useForm<PhoneLoginForm>({
    resolver: zodResolver(phoneLoginSchema),
  });

  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
  });


  // Check for errors in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error) {
      let errorMessage = 'Authentication failed';
      
      switch (error) {
        case 'google_auth_failed':
          errorMessage = 'Google authentication failed';
          break;
        case 'microsoft_auth_failed':
          errorMessage = 'Microsoft authentication failed';
          break;
        case 'linkedin_auth_failed':
          errorMessage = 'LinkedIn authentication failed';
          break;
        case 'google_not_configured':
          errorMessage = 'Google OAuth is not configured. Please contact the administrator.';
          break;
        case 'microsoft_not_configured':
          errorMessage = 'Microsoft OAuth is not configured. Please contact the administrator.';
          break;
        case 'linkedin_not_configured':
          errorMessage = 'LinkedIn OAuth is not configured. Please contact the administrator.';
          break;
        default:
          errorMessage = 'Authentication failed';
      }
      
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Clear error from URL
      window.history.replaceState({}, document.title, '/login');
    }
  }, [toast]);

  const onEmailSubmit = async (data: EmailLoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onPhoneSubmit = async (data: PhoneLoginForm) => {
    setIsLoading(true);
    try {
      const success = await loginWithPhone(data.phone, data.password);
      if (success) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        setLocation("/dashboard");
      } else {
        // OTP verification required
        setPendingVerification(data.phone);
        setShowOTPStep(true);
        toast({
          title: "OTP Required",
          description: "Please enter the OTP sent to your phone.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during phone login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (data: OTPForm) => {
    setIsLoading(true);
    try {
      await verifyOTP(pendingVerification, data.otp);
      toast({
        title: "Welcome back!",
        description: "Phone verification successful.",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid OTP code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'microsoft' | 'linkedin') => {
    if (!oauthStatus) return;
    
    if (!oauthStatus[provider]) {
      toast({
        title: "OAuth Not Configured",
        description: `${provider.charAt(0).toUpperCase() + provider.slice(1)} OAuth is not configured. Please contact the administrator.`,
        variant: "destructive",
      });
      return;
    }
    
    window.location.href = `/api/auth/${provider}`;
  };

  const hasAnyOAuthProvider = oauthStatus && (oauthStatus.google || oauthStatus.microsoft || oauthStatus.linkedin);

  if (showOTPStep) {
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

          {/* OTP Verification */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <Phone className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-xl text-center">Enter OTP</CardTitle>
              <p className="text-sm text-muted-foreground text-center">
                We've sent a verification code to {pendingVerification}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    {...otpForm.register("otp")}
                    data-testid="input-otp"
                  />
                  {otpForm.formState.errors.otp && (
                    <p className="text-sm text-destructive">
                      {otpForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  data-testid="button-verify-otp"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setShowOTPStep(false)}
                    className="text-sm"
                  >
                    Back to login
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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

        {/* Welcome Back */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
          <p className="text-muted-foreground">Sign in to continue your learning journey</p>
        </div>

        {/* OAuth Configuration Alert */}
        {oauthStatus && !hasAnyOAuthProvider && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Social login is not configured. You can still log in with email/phone.
            </AlertDescription>
          </Alert>
        )}

        {/* Social Login Buttons */}
        {hasAnyOAuthProvider && (
          <>
            <div className="space-y-3">
              {oauthStatus?.google && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin('google')}
                  data-testid="button-google-login"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              )}

              {oauthStatus?.microsoft && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin('microsoft')}
                  data-testid="button-microsoft-login"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#f25022" d="M0 0h11.2v11.2H0z"/>
                    <path fill="#00a4ef" d="M12.8 0H24v11.2H12.8z"/>
                    <path fill="#7fba00" d="M0 12.8h11.2V24H0z"/>
                    <path fill="#ffb900" d="M12.8 12.8H24V24H12.8z"/>
                  </svg>
                  Continue with Microsoft
                </Button>
              )}

              {oauthStatus?.linkedin && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin('linkedin')}
                  data-testid="button-linkedin-login"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#0a66c2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Continue with LinkedIn
                </Button>
              )}
            </div>

            <div className="flex items-center">
              <Separator className="flex-1" />
              <span className="bg-background px-2 text-muted-foreground text-sm">or</span>
              <Separator className="flex-1" />
            </div>
          </>
        )}

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...emailForm.register("email")}
                      data-testid="input-email"
                    />
                    {emailForm.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {emailForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="email-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...emailForm.register("password")}
                        data-testid="input-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {emailForm.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {emailForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    data-testid="button-email-login"
                  >
                    {isLoading ? "Signing in..." : "Sign in with Email"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone">
                <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1234567890"
                      {...phoneForm.register("phone")}
                      data-testid="input-phone"
                    />
                    {phoneForm.formState.errors.phone && (
                      <p className="text-sm text-destructive">
                        {phoneForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="phone-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...phoneForm.register("password")}
                        data-testid="input-phone-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {phoneForm.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {phoneForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    data-testid="button-phone-login"
                  >
                    {isLoading ? "Signing in..." : "Sign in with Phone"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center space-y-2">
              <Button variant="link" className="text-sm text-muted-foreground">
                Forgot your password?
              </Button>
              <div>
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-primary hover:underline font-medium"
                    data-testid="link-signup"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to public site */}
        <div className="text-center">
          <Link
            href="/public"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-back"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to public site
          </Link>
        </div>
      </div>
    </div>
  );
}
