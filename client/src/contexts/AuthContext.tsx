import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  skillLevel: string;
  currentStreak: number;
  totalLessons: number;
  completedLessons: number;
  challengesSolved: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithPhone: (phone: string, password: string) => Promise<boolean>;
  verifyOTP: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  signup: (userData: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to make API requests with proper error handling
const makeApiRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token && !url.includes('/login') && !url.includes('/signup')) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Verify token and get user data
          const { response, data } = await makeApiRequest('/api/auth/verify', {
            method: 'GET'
          });
          
          if (response.ok && data.success) {
            setUser(data.user);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Handle social auth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const provider = urlParams.get('provider');
    const error = urlParams.get('error');

    if (token && provider) {
      localStorage.setItem('authToken', token);
      // Fetch user data
      makeApiRequest('/api/auth/me', {
        method: 'GET'
      })
      .then(({ response, data }) => {
        if (response.ok && data.success) {
          setUser(data.user);
          // Clear URL parameters and redirect to dashboard
          window.history.replaceState({}, document.title, '/dashboard');
        }
      })
      .catch(err => console.error('Failed to fetch user after social login:', err));
    }

    if (error) {
      console.error('Social auth error:', error);
      // Show error message to user
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { response, data } = await makeApiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (response.ok && data.success) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        return true;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPhone = async (phone: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { response, data } = await makeApiRequest('/api/auth/phone-login', {
        method: 'POST',
        body: JSON.stringify({ phone, password })
      });

      if (response.ok && data.success) {
        if (data.requiresOTP) {
          // OTP verification needed
          return false; // Indicates OTP step required
        } else {
          localStorage.setItem('authToken', data.token);
          setUser(data.user);
          return true;
        }
      } else {
        throw new Error(data.message || 'Phone login failed');
      }
    } catch (error) {
      console.error('Phone login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (phone: string, otp: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { response, data } = await makeApiRequest('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp })
      });

      if (response.ok && data.success) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        return true;
      } else {
        throw new Error(data.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { response, data } = await makeApiRequest('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      if (response.ok && data.success) {
        return true;
      } else {
        throw new Error(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    // Redirect to login page
    window.location.href = '/login';
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithPhone,
    verifyOTP,
    logout,
    signup
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
