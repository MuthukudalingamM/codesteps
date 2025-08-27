import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Code, ArrowLeft, Mail, Phone } from "lucide-react";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/api";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

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
      const response = await apiRequest("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      });

      if (response.success) {
        setUserEmail(data.email);
        setUserPhone(data.phone);
        setStep('verify-email');
        toast({
          title: "Account created!",
          description: "Please check your email for verification code.",
        });
      } else {
        toast({
          title: "Signup failed",
          description: response.message || "An error occurred during signup",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during signup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("/api/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({
          email: userEmail,
          code: verificationCode,
        }),
      });

      if (response.success) {
        setStep('verify-phone');
        setVerificationCode('');
        toast({
          title: "Email verified!",
          description: "Now please verify your phone number.",
        });
      } else {
        toast({
          title: "Verification failed",
          description: response.message || "Invalid verification code",
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

  const verifyPhone = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("/api/auth/verify-phone", {
        method: "POST",
        body: JSON.stringify({
          phone: userPhone,
          code: verificationCode,
        }),
      });

      if (response.success) {
        toast({
          title: "Phone verified!",
          description: "Registration complete! You can now sign in.",
        });
        setLocation("/login");
      } else {
        toast({
          title: "Verification failed",
          description: response.message || "Invalid verification code",
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

  const resendCode = async (type: 'email' | 'phone') => {
    try {
      const response = await apiRequest(`/api/auth/resend-${type}-code`, {
        method: "POST",
        body: JSON.stringify({
          [type]: type === 'email' ? userEmail : userPhone,
        }),
      });

      if (response.success) {
        toast({
          title: "Code sent!",
          description: `New verification code sent to your ${type}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend code. Please try again.",
        variant: "destructive",
      });
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

        {/* Sign Up Form */}
        {step === 'signup' && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-center">Create Account</CardTitle>
              <p className="text-sm text-muted-foreground text-center">
                Start your programming journey today
              </p>
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
                  <Label htmlFor="phone">Phone Number</Label>
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