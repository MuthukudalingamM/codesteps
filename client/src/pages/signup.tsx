import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useOAuthStatus } from "@/hooks/use-oauth-status";
import { Eye, EyeOff, Code, ArrowLeft, Mail, Phone, AlertCircle } from "lucide-react";
import { Link, useLocation } from "wouter";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

// Helper function to make API requests with proper error handling
const makeApiRequest = async (url: string, options: RequestInit = {}) => {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  // Clone the response to avoid "body stream already read" errors
  const responseClone = response.clone();

  let data;
  try {
    data = await response.json();
  } catch (error) {
    // If JSON parsing fails, try with the cloned response
    try {
      data = await responseClone.json();
    } catch (secondError) {
      throw new Error('Failed to parse response as JSON');
    }
  }

  return { response, data };
};

export default function Signup() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'signup' | 'verify-email' | 'verify-phone'>('signup');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const { toast } = useToast();
  const { oauthStatus, isLoading: isOAuthLoading, error: oauthError } = useOAuthStatus();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });


  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      const { response, data: responseData } = await makeApiRequest("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          phone: data.phone || null,
          password: data.password,
        }),
      });

      if (response.ok && responseData.success) {
        setUserEmail(data.email);
        setUserPhone(data.phone || '');
        setStep('verify-email');
        toast({
          title: "Account created!",
          description: responseData.message || "Please check your email for verification code.",
        });
      } else {
        toast({
          title: "Signup failed",
          description: responseData.message || "An error occurred during signup",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during signup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async () => {
    setIsLoading(true);
    try {
      const { response, data: responseData } = await makeApiRequest("/api/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({
          email: userEmail,
          code: verificationCode,
        }),
      });

      if (response.ok && responseData.success) {
        if (userPhone) {
          setStep('verify-phone');
          setVerificationCode('');
          toast({
            title: "Email verified!",
            description: "Now please verify your phone number.",
          });
        } else {
          toast({
            title: "Email verified!",
            description: "Registration complete! You can now sign in.",
          });
          setLocation("/login");
        }
      } else {
        toast({
          title: "Verification failed",
          description: responseData.message || "Invalid verification code",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPhone = async () => {
    setIsLoading(true);
    try {
      const { response, data: responseData } = await makeApiRequest("/api/auth/verify-phone", {
        method: "POST",
        body: JSON.stringify({
          phone: userPhone,
          code: verificationCode,
        }),
      });

      if (response.ok && responseData.success) {
        toast({
          title: "Phone verified!",
          description: "Registration complete! You can now sign in.",
        });
        setLocation("/login");
      } else {
        toast({
          title: "Verification failed",
          description: responseData.message || "Invalid verification code",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async (type: 'email' | 'phone') => {
    try {
      const { response, data: responseData } = await makeApiRequest(`/api/auth/resend-${type}-code`, {
        method: "POST",
        body: JSON.stringify({
          [type]: type === 'email' ? userEmail : userPhone,
        }),
      });

      if (response.ok && responseData.success) {
        toast({
          title: "Code sent!",
          description: `New verification code sent to your ${type}.`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSocialSignup = (provider: 'google' | 'microsoft' | 'linkedin') => {
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

        {/* Sign Up Form */}
        {step === 'signup' && (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
              <p className="text-muted-foreground">Start your programming journey today</p>
            </div>

            {/* OAuth Configuration Alert */}
            {oauthError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to check OAuth configuration: {oauthError}. Email signup is still available.
                </AlertDescription>
              </Alert>
            )}

            {oauthStatus && !hasAnyOAuthProvider && !oauthError && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Social signup is not configured. You can still create an account with email.
                </AlertDescription>
              </Alert>
            )}

            {/* Social Signup Buttons */}
            {hasAnyOAuthProvider && (
              <>
                <div className="space-y-3">
                  {oauthStatus?.google && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleSocialSignup('google')}
                      data-testid="button-google-signup"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Sign up with Google
                    </Button>
                  )}

                  {oauthStatus?.microsoft && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleSocialSignup('microsoft')}
                      data-testid="button-microsoft-signup"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#f25022" d="M0 0h11.2v11.2H0z"/>
                        <path fill="#00a4ef" d="M12.8 0H24v11.2H12.8z"/>
                        <path fill="#7fba00" d="M0 12.8h11.2V24H0z"/>
                        <path fill="#ffb900" d="M12.8 12.8H24V24H12.8z"/>
                      </svg>
                      Sign up with Microsoft
                    </Button>
                  )}

                  {oauthStatus?.linkedin && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleSocialSignup('linkedin')}
                      data-testid="button-linkedin-signup"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#0a66c2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      Sign up with LinkedIn
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

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-center">Create Account with Email</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Enter username"
                      {...register("username")}
                      data-testid="input-username"
                    />
                    {errors.username && (
                      <p className="text-sm text-destructive">{errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...register("email")}
                      data-testid="input-email"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1234567890"
                      {...register("phone")}
                      data-testid="input-phone"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        {...register("password")}
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
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        {...register("confirmPassword")}
                        data-testid="input-confirm-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    data-testid="button-signup"
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-primary hover:underline font-medium"
                      data-testid="link-login"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Email Verification */}
        {step === 'verify-email' && (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <Mail className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-xl text-center">Verify Your Email</CardTitle>
              <p className="text-sm text-muted-foreground text-center">
                We've sent a verification code to {userEmail}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailCode">Verification Code</Label>
                  <Input
                    id="emailCode"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    data-testid="input-email-code"
                  />
                </div>

                <Button
                  onClick={verifyEmail}
                  className="w-full"
                  disabled={isLoading || verificationCode.length !== 6}
                  data-testid="button-verify-email"
                >
                  {isLoading ? "Verifying..." : "Verify Email"}
                </Button>

                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => resendCode('email')}
                    className="text-sm"
                    data-testid="button-resend-email"
                  >
                    Didn't receive code? Resend
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Phone Verification */}
        {step === 'verify-phone' && (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <Phone className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-xl text-center">Verify Your Phone</CardTitle>
              <p className="text-sm text-muted-foreground text-center">
                We've sent a verification code to {userPhone}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneCode">Verification Code</Label>
                  <Input
                    id="phoneCode"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    data-testid="input-phone-code"
                  />
                </div>

                <Button
                  onClick={verifyPhone}
                  className="w-full"
                  disabled={isLoading || verificationCode.length !== 6}
                  data-testid="button-verify-phone"
                >
                  {isLoading ? "Verifying..." : "Verify Phone"}
                </Button>

                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => resendCode('phone')}
                    className="text-sm"
                    data-testid="button-resend-phone"
                  >
                    Didn't receive code? Resend
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
