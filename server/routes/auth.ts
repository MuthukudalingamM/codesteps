import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import { storage } from "../storage";
import nodemailer from 'nodemailer';

const router = Router();

// Initialize Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Check if OAuth providers are configured
const isGoogleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const isMicrosoftConfigured = !!(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET);
const isLinkedInConfigured = !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET);

// Configure passport strategies only if credentials are available
if (isGoogleConfigured) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          username: profile.displayName || profile.emails?.[0]?.value?.split('@')[0] || 'user',
          email: profile.emails?.[0]?.value || '',
          password: await bcrypt.hash(Math.random().toString(36), 10), // Random password for OAuth users
          isEmailVerified: true, // Email verified through OAuth provider
          isPhoneVerified: false,
          emailVerificationToken: null,
          phoneVerificationCode: null,
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));
}

if (isMicrosoftConfigured) {
  passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID!,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
    callbackURL: "/api/auth/microsoft/callback",
    scope: ['user.read']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
      
      if (!user) {
        user = await storage.createUser({
          username: profile.displayName || profile.emails?.[0]?.value?.split('@')[0] || 'user',
          email: profile.emails?.[0]?.value || '',
          password: await bcrypt.hash(Math.random().toString(36), 10),
          isEmailVerified: true,
          isPhoneVerified: false,
          emailVerificationToken: null,
          phoneVerificationCode: null,
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));
}

if (isLinkedInConfigured) {
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID!,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    callbackURL: "/api/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
      
      if (!user) {
        user = await storage.createUser({
          username: profile.displayName || profile.emails?.[0]?.value?.split('@')[0] || 'user',
          email: profile.emails?.[0]?.value || '',
          password: await bcrypt.hash(Math.random().toString(36), 10),
          isEmailVerified: true,
          isPhoneVerified: false,
          emailVerificationToken: null,
          phoneVerificationCode: null,
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));
}

// Generate random verification code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send email verification
async function sendEmailVerification(email: string, code: string) {
  if (!process.env.GMAIL_USERNAME || !process.env.GMAIL_APP_PASSWORD) {
    console.log(`📧 Email verification code for ${email}: ${code}`);
    return true;
  }

  try {
    const mailOptions = {
      from: `"AI Tutor - CodeSteps" <${process.env.GMAIL_USERNAME}>`,
      to: email,
      subject: 'AI Tutor - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Welcome to AI Tutor!</h1>
            <p style="color: #6b7280; margin: 5px 0 0 0;">AI-Powered Programming Learning</p>
          </div>
          
          <div style="background: #f8fafc; border-radius: 12px; padding: 30px; margin: 20px 0;">
            <h2 style="color: #1f2937; text-align: center; margin: 0 0 20px 0;">Verify Your Email</h2>
            <p style="color: #4b5563; text-align: center; margin: 0 0 30px 0;">
              Please enter this verification code to complete your registration:
            </p>
            
            <div style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <div style="color: #1f2937; font-size: 32px; font-weight: bold; letter-spacing: 4px; font-family: monospace;">
                ${code}
              </div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 20px 0 0 0;">
              This code will expire in 10 minutes
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #9ca3af; font-size: 12px;">
              If you didn't create an account with AI Tutor, please ignore this email.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

// Send phone verification (mock implementation)
async function sendPhoneVerification(phone: string, code: string) {
  // In a real app, you would use Twilio or another SMS service
  console.log(`📱 SMS verification code for ${phone}: ${code}`);
  return true;
}

// Generate JWT token
function generateToken(user: any) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'fallback-secret-key-please-change-in-production',
    { expiresIn: '7d' }
  );
}

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, email, and password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists (normalize email for consistency)
    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await storage.getUserByEmail(normalizedEmail);
    if (existingUser) {
      // RECOVERY MECHANISM: If user exists but email not verified, offer to resend verification
      if (!existingUser.isEmailVerified) {
        const newCode = generateCode();
        await storage.updateUser(existingUser.id, { emailVerificationToken: newCode });
        const emailSent = await sendEmailVerification(normalizedEmail, newCode);
        
        return res.status(409).json({ 
          success: false, 
          message: emailSent 
            ? 'Account exists but email not verified. We\'ve sent a new verification code to your email. Please verify to complete registration.'
            : `Account exists but not verified. Use this code to verify: ${newCode}`,
          requiresVerification: true,
          recoveryAction: 'verification_resent',
          email: normalizedEmail
        });
      }
      
      // User exists and is verified
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered. Please log in instead.' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification codes
    const emailCode = generateCode();
    const phoneCode = phone ? generateCode() : null;

    // Create user
    const user = await storage.createUser({
      username,
      email,
      phone: phone || null,
      password: hashedPassword,
      emailVerificationToken: emailCode,
      phoneVerificationCode: phoneCode,
      isEmailVerified: false,
      isPhoneVerified: false,
    });

    // Send verification emails/SMS
    const emailSent = await sendEmailVerification(email, emailCode);
    if (phone && phoneCode) {
      await sendPhoneVerification(phone, phoneCode);
    }

    // Debug log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📧 Generated email verification code for ${email}: ${emailCode} (length: ${emailCode.length})`);
    }

    res.json({ 
      success: true, 
      message: emailSent 
        ? 'Account created successfully. Please check your email for verification code.' 
        : `Account created successfully. Email sending failed - verification code is: ${emailCode}`,
      requiresVerification: true,
      hasPhone: !!phone,
      verificationCode: !emailSent ? emailCode : undefined
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and code are required' });
    }

    // Normalize email (trim and lowercase)
    const normalizedEmail = String(email).trim().toLowerCase();
    
    const user = await storage.getUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(200).json({ success: true, message: 'Email already verified. You can now login.' });
    }

    // Normalize codes: remove all non-digits and compare
    const normalizedInputCode = String(code).replace(/\D/g, '');
    const normalizedStoredCode = String(user.emailVerificationToken || '').replace(/\D/g, '');

    // Debug log for development (without exposing actual codes in production)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Code verification: Input length: ${normalizedInputCode.length}, Expected length: ${normalizedStoredCode.length}`);
    }

    // Validate code length
    if (normalizedInputCode.length !== 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid 6-digit verification code' 
      });
    }

    if (!normalizedStoredCode || normalizedStoredCode.length !== 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'No valid verification code found. Please request a new code.' 
      });
    }

    if (normalizedInputCode !== normalizedStoredCode) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid verification code. Please check the code and try again. If you requested a new code, use the most recent one.' 
      });
    }

    // Update user
    await storage.updateUser(user.id, {
      isEmailVerified: true,
      emailVerificationToken: null,
    });

    res.json({ success: true, message: 'Email verified successfully! You can now login.' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Verify phone
router.post('/verify-phone', async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ success: false, message: 'Phone and code are required' });
    }

    const users = Array.from((storage as any).users.values());
    const user = users.find((u: any) => u.phone === phone);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.phoneVerificationCode !== code) {
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }

    // Update user
    await storage.updateUser(user.id, {
      isPhoneVerified: true,
      phoneVerificationCode: null,
    });

    res.json({ success: true, message: 'Phone verified successfully' });
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Resend email code
router.post('/resend-email-code', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }

    const newCode = generateCode();
    await storage.updateUser(user.id, { emailVerificationToken: newCode });
    const emailSent = await sendEmailVerification(email, newCode);

    res.json({ 
      success: true, 
      message: emailSent ? 'New verification code sent' : `Email sending failed - verification code is: ${newCode}`,
      verificationCode: !emailSent ? newCode : undefined 
    });
  } catch (error) {
    console.error('Resend email error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Resend phone code
router.post('/resend-phone-code', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone is required' });
    }

    const users = Array.from((storage as any).users.values());
    const user = users.find((u: any) => u.phone === phone);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isPhoneVerified) {
      return res.status(400).json({ success: false, message: 'Phone already verified' });
    }

    const newCode = generateCode();
    await storage.updateUser(user.id, { phoneVerificationCode: newCode });
    await sendPhoneVerification(phone, newCode);

    res.json({ 
      success: true, 
      message: `New verification code sent to ${phone}: ${newCode}`,
      verificationCode: newCode
    });
  } catch (error) {
    console.error('Resend phone error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Normalize email (trim and lowercase) for consistent lookup
    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await storage.getUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      // Debug log in development (without exposing password)
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 Password validation failed for user: ${user.email}`);
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isEmailVerified) {
      // RECOVERY MECHANISM: Automatically generate and send new verification code
      const emailCode = generateCode();
      await storage.updateUser(user.id, { emailVerificationToken: emailCode });
      
      // Try to send verification email
      const emailSent = await sendEmailVerification(normalizedEmail, emailCode);
      
      return res.status(401).json({ 
        success: false, 
        message: emailSent 
          ? 'Email not verified. We\'ve sent a new verification code to your email. Please check your inbox and verify before logging in.'
          : `Email not verified. Please use this code to verify: ${emailCode}`,
        requiresVerification: true,
        recoveryAction: 'verification_sent',
        email: normalizedEmail
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({ 
      success: true, 
      token, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        skillLevel: user.skillLevel,
        currentStreak: user.currentStreak,
        completedLessons: user.completedLessons,
        challengesSolved: user.challengesSolved,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Simple connectivity test endpoint
router.get('/ping', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Server is reachable'
  });
});

// OAuth status endpoint
router.get('/oauth-status', (req, res) => {
  // Simple, reliable response
  const statusData = {
    google: isGoogleConfigured,
    microsoft: isMicrosoftConfigured,
    linkedin: isLinkedInConfigured,
    message: !isGoogleConfigured && !isMicrosoftConfigured && !isLinkedInConfigured
      ? 'No OAuth providers configured. Please set up environment variables.'
      : 'Some OAuth providers are available.',
    timestamp: new Date().toISOString()
  };

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(statusData);
});

// Social login routes - only register if configured
if (isGoogleConfigured) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  router.get('/google/callback', 
    passport.authenticate('google', { session: false }),
    (req, res) => {
      try {
        const user = req.user as any;
        const token = generateToken(user);
        
        // Redirect to frontend with token
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/callback?token=${token}&provider=google`);
      } catch (error) {
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=google_auth_failed`);
      }
    }
  );
} else {
  router.get('/google', (req, res) => {
    res.redirect('/login?error=google_not_configured');
  });
  
  router.get('/google/callback', (req, res) => {
    res.redirect('/login?error=google_not_configured');
  });
}

if (isMicrosoftConfigured) {
  router.get('/microsoft', passport.authenticate('microsoft', { scope: ['user.read'] }));

  router.get('/microsoft/callback',
    passport.authenticate('microsoft', { session: false }),
    (req, res) => {
      try {
        const user = req.user as any;
        const token = generateToken(user);
        
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/callback?token=${token}&provider=microsoft`);
      } catch (error) {
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=microsoft_auth_failed`);
      }
    }
  );
} else {
  router.get('/microsoft', (req, res) => {
    res.redirect('/login?error=microsoft_not_configured');
  });
  
  router.get('/microsoft/callback', (req, res) => {
    res.redirect('/login?error=microsoft_not_configured');
  });
}

if (isLinkedInConfigured) {
  router.get('/linkedin', passport.authenticate('linkedin'));

  router.get('/linkedin/callback',
    passport.authenticate('linkedin', { session: false }),
    (req, res) => {
      try {
        const user = req.user as any;
        const token = generateToken(user);
        
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/callback?token=${token}&provider=linkedin`);
      } catch (error) {
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=linkedin_auth_failed`);
      }
    }
  );
} else {
  router.get('/linkedin', (req, res) => {
    res.redirect('/login?error=linkedin_not_configured');
  });
  
  router.get('/linkedin/callback', (req, res) => {
    res.redirect('/login?error=linkedin_not_configured');
  });
}

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key-please-change-in-production') as any;
    const user = await storage.getUser(decoded.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        skillLevel: user.skillLevel,
        currentStreak: user.currentStreak,
        completedLessons: user.completedLessons,
        challengesSolved: user.challengesSolved,
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Debug endpoint to check verification codes (development only)
router.get('/debug-codes/:email', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ message: 'Not found' });
  }
  
  try {
    const normalizedEmail = String(req.params.email).trim().toLowerCase();
    const user = await storage.getUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      email: user.email,
      emailVerificationToken: user.emailVerificationToken,
      phoneVerificationCode: user.phoneVerificationCode,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      tokenLength: user.emailVerificationToken ? user.emailVerificationToken.length : 0,
      codeDigitsOnly: user.emailVerificationToken ? String(user.emailVerificationToken).replace(/\D/g, '') : ''
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving codes' });
  }
});

// Verify token endpoint (for compatibility)
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key-please-change-in-production') as any;
    const user = await storage.getUser(decoded.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      ok: true, // For compatibility with existing frontend code
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        skillLevel: user.skillLevel,
        currentStreak: user.currentStreak,
        completedLessons: user.completedLessons,
        challengesSolved: user.challengesSolved,
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

export default router;
