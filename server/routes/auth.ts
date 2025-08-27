import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { storage } from "../storage";
import { MailService } from '@sendgrid/mail';

const router = Router();

// Initialize SendGrid
const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

// Generate random verification code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send email verification
async function sendEmailVerification(email: string, code: string) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log(`Email verification code for ${email}: ${code}`);
    return true;
  }

  try {
    await mailService.send({
      to: email,
      from: 'noreply@codesteps.com', // You would use your verified sender
      subject: 'CodeSteps - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Welcome to CodeSteps!</h1>
          <p>Thank you for signing up. Please verify your email address with the code below:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h2 style="color: #1f2937; font-size: 32px; letter-spacing: 4px; margin: 0;">${code}</h2>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

// Send phone verification (mock implementation)
async function sendPhoneVerification(phone: string, code: string) {
  // In a real app, you would use Twilio or another SMS service
  console.log(`SMS verification code for ${phone}: ${code}`);
  return true;
}

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification codes
    const emailCode = generateCode();
    const phoneCode = generateCode();

    // Create user
    const user = await storage.createUser({
      username,
      email,
      phone,
      password: hashedPassword,
      emailVerificationToken: emailCode,
      phoneVerificationCode: phoneCode,
    });

    // Send verification emails/SMS
    await sendEmailVerification(email, emailCode);
    await sendPhoneVerification(phone, phoneCode);

    res.json({ 
      success: true, 
      message: 'Account created successfully. Please check your email and phone for verification codes.' 
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

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.emailVerificationToken !== code) {
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }

    // Update user
    await storage.updateUser(user.id, {
      isEmailVerified: true,
      emailVerificationToken: null,
    });

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Verify phone
router.post('/verify-phone', async (req, res) => {
  try {
    const { phone, code } = req.body;

    const users = storage.users.values();
    const user = Array.from(users).find(u => u.phone === phone);
    
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

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newCode = generateCode();
    await storage.updateUser(user.id, { emailVerificationToken: newCode });
    await sendEmailVerification(email, newCode);

    res.json({ success: true, message: 'New verification code sent' });
  } catch (error) {
    console.error('Resend email error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Resend phone code
router.post('/resend-phone-code', async (req, res) => {
  try {
    const { phone } = req.body;

    const users = storage.users.values();
    const user = Array.from(users).find(u => u.phone === phone);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newCode = generateCode();
    await storage.updateUser(user.id, { phoneVerificationCode: newCode });
    await sendPhoneVerification(phone, newCode);

    res.json({ success: true, message: 'New verification code sent' });
  } catch (error) {
    console.error('Resend phone error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isEmailVerified) {
      return res.status(401).json({ success: false, message: 'Please verify your email first' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({ 
      success: true, 
      token, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        skillLevel: user.skillLevel,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
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

export default router;