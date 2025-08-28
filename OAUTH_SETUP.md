# OAuth Setup Guide for Social Authentication

The 403 error you encountered occurs because OAuth providers (Google, Microsoft, LinkedIn) are not properly configured. Here's how to set them up:

## 🚫 Current Issue
- Using demo credentials instead of real OAuth credentials
- Results in 403 "access denied" errors when clicking social login buttons

## ✅ Solution: Configure Real OAuth Credentials

### 1. Google OAuth Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
   - For production: `https://yourdomain.com/api/auth/google/callback`

4. **Copy Credentials**
   - Copy the Client ID and Client Secret

### 2. Microsoft OAuth Setup

1. **Go to Azure Portal**
   - Visit: https://portal.azure.com/
   - Go to "Azure Active Directory" → "App registrations"

2. **Create New Registration**
   - Click "New registration"
   - Name: "CodeSteps App"
   - Redirect URI: `http://localhost:5000/api/auth/microsoft/callback`
   - For production: `https://yourdomain.com/api/auth/microsoft/callback`

3. **Copy Credentials**
   - Copy the Application (client) ID
   - Go to "Certificates & secrets" → Create new client secret
   - Copy the secret value

### 3. LinkedIn OAuth Setup

1. **Go to LinkedIn Developer Portal**
   - Visit: https://www.linkedin.com/developers/
   - Create a new app

2. **Configure App**
   - Redirect URLs: `http://localhost:5000/api/auth/linkedin/callback`
   - For production: `https://yourdomain.com/api/auth/linkedin/callback`
   - Request "r_liteprofile" and "r_emailaddress" permissions

3. **Copy Credentials**
   - Copy the Client ID and Client Secret

## 🔧 Environment Variables Setup

Create a `.env` file in your project root with these variables:

```env
# JWT Secret (change this to a secure random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Email Service (Optional - for email verification)
SENDGRID_API_KEY=your-sendgrid-api-key

# Client URL (for redirects)
CLIENT_URL=http://localhost:3000
```

## 🔄 Alternative: Use DevServerControl Tool

Instead of creating a `.env` file, you can use the DevServerControl tool to set environment variables:

1. Set Google credentials:
   ```
   Use DevServerControl tool with set_env_variable: ['GOOGLE_CLIENT_ID', 'your-client-id']
   Use DevServerControl tool with set_env_variable: ['GOOGLE_CLIENT_SECRET', 'your-client-secret']
   ```

2. Set Microsoft credentials:
   ```
   Use DevServerControl tool with set_env_variable: ['MICROSOFT_CLIENT_ID', 'your-client-id']
   Use DevServerControl tool with set_env_variable: ['MICROSOFT_CLIENT_SECRET', 'your-client-secret']
   ```

3. Set LinkedIn credentials:
   ```
   Use DevServerControl tool with set_env_variable: ['LINKEDIN_CLIENT_ID', 'your-client-id']
   Use DevServerControl tool with set_env_variable: ['LINKEDIN_CLIENT_SECRET', 'your-client-secret']
   ```

## 🎯 Current Status

**Without OAuth Configuration:**
- ✅ Email/password login works
- ✅ Phone login works  
- ✅ Email verification works
- ❌ Social login buttons show "not configured" message
- ❌ Clicking social login redirects with error

**With OAuth Configuration:**
- ✅ All login methods work
- ✅ Social login buttons are functional
- ✅ Users can sign up/login with Google, Microsoft, LinkedIn
- ✅ Automatic account creation for new social users

## 🔍 Testing After Setup

1. **Restart your dev server** after adding environment variables
2. **Visit the login page** - social buttons should be enabled
3. **Click "Continue with Google"** - should redirect to Google OAuth
4. **Complete OAuth flow** - should redirect back and log you in
5. **Check console logs** for any remaining errors

## 📝 Notes

- OAuth setup is optional - email/phone login works without it
- You can configure just one provider (e.g., only Google) if preferred
- The app gracefully handles missing OAuth configurations
- Users see clear messages when OAuth providers aren't available

Need help with a specific OAuth provider setup? Let me know which one you'd like to configure first!
