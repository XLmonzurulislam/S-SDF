import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { apiRequest } from './queryClient';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  username: string;
  name: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/current-user', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiRequest('POST', '/api/auth/login', { username, password });
      const userData = await response.json();
      
      setUser(userData);
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });
      setLocation('/');
    } catch (error) {
      setError('Invalid username or password');
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid username or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiRequest('POST', '/api/auth/register', { 
        username, 
        password, 
        name,
        bio: "",
        profilePicture: `https://api.dicebear.com/6.x/initials/svg?seed=${name}&backgroundColor=1877F2`
      });
      
      const userData = await response.json();
      
      setUser(userData);
      toast({
        title: "Registration successful",
        description: `Welcome to SocialConnect, ${userData.name}!`,
      });
      setLocation('/');
    } catch (error) {
      setError('Registration failed. Username may already be taken.');
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Username may already be taken.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      setLocation('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const contextValue = {
    user,
    isLoading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}