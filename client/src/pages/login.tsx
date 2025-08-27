import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Code, ArrowLeft, Mail, Phone, Shield } from "lucide-react";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/api";

const emailLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const phoneLoginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[\d\s\+\-\(\)]+$/, "Invalid phone number format"),
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
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [pendingVerification, setPendingVerification] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailLoginForm>({
    resolver: zodResolver(emailLoginSchema),
  });

  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors },
  } = useForm<PhoneLoginForm>({
    resolver: zodResolver(phoneLoginSchema),
  });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
  });

  const onEmailSubmit = async (data: EmailLoginForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ ...data, method: 'email' }),
      });

      if (response.success) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        localStorage.setItem("authToken", response.token);
        setLocation("/");
      } else {
        toast({
          title: "Login failed",
          description: response.message || "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onPhoneSubmit = async (data: PhoneLoginForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("/api/auth/phone-login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.success) {
        if (response.requiresOTP) {
          setShowOtpVerification(true);
          setPendingVerification(data.phone);
          toast({
            title: "OTP Sent",
            description: "Please check your phone for the verification code.",
          });
        } else {
          localStorage.setItem("authToken", response.token);
          setLocation("/");
        }
      } else {
        toast({
          title: "Login failed",
          description: response.message || "Invalid phone number or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (data: OTPForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          phone: pendingVerification,
          otp: data.otp
        }),
      });

      if (response.success) {
        toast({
          title: "Welcome back!",
          description: "Phone verification successful.",
        });
        localStorage.setItem("authToken", response.token);
        setLocation("/");
      } else {
        toast({
          title: "Verification failed",
          description: response.message || "Invalid OTP code",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center">Welcome Back</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Sign in to continue your learning journey
            </p>
          </CardHeader>
          <CardContent>
            {showOtpVerification ? (
              /* OTP Verification Form */
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <Shield className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-lg font-semibold">Verify Your Phone</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to {pendingVerification}
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="text-center text-lg tracking-wider"
                      {...registerOtp("otp")}
                      data-testid="input-otp"
                    />
                    {otpErrors.otp && (
                      <p className="text-sm text-destructive">{otpErrors.otp.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    data-testid="button-verify-otp"
                  >
                    {isLoading ? "Verifying..." : "Verify & Sign In"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setShowOtpVerification(false);
                      setPendingVerification(null);
                    }}
                  >
                    Back to Login
                  </Button>
                </form>
              </div>
            ) : (
              /* Login Methods */
              <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'email' | 'phone')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Phone</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="space-y-4 mt-6">
                  <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        {...registerEmail("email")}
                        data-testid="input-email"
                      />
                      {emailErrors.email && (
                        <p className="text-sm text-destructive">{emailErrors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="email-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...registerEmail("password")}
                          data-testid="input-email-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          data-testid="toggle-password"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {emailErrors.password && (
                        <p className="text-sm text-destructive">{emailErrors.password.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                      data-testid="button-email-login"
                    >
                      {isLoading ? "Signing in..." : "Sign In with Email"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="phone" className="space-y-4 mt-6">
                  <form onSubmit={handlePhoneSubmit(onPhoneSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        {...registerPhone("phone")}
                        data-testid="input-phone"
                      />
                      {phoneErrors.phone && (
                        <p className="text-sm text-destructive">{phoneErrors.phone.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="phone-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...registerPhone("password")}
                          data-testid="input-phone-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          data-testid="toggle-password-phone"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {phoneErrors.password && (
                        <p className="text-sm text-destructive">{phoneErrors.password.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                      data-testid="button-phone-login"
                    >
                      {isLoading ? "Signing in..." : "Sign In with Phone"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}

            {!showOtpVerification && (
              <div className="mt-6 text-center space-y-2">
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
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                  data-testid="link-forgot-password"
                >
                  Forgot your password?
                </Link>
              </div>
            )}
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
