import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Helper function to safely check if we're in a browser environment
const isBrowser = () => typeof window !== 'undefined';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isBrowser()) {
      setIsLoading(false);
      return;
    }

    try {
      // Check if user is already logged in (e.g., from localStorage)
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      // This would typically be an API call to your backend
      // Mock implementation for now
      const mockUser = {
        id: '123',
        name: 'Test User',
        email: credentials.email,
        role: 'patient',
      };
      
      setUser(mockUser);
      if (isBrowser()) {
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to login' 
      };
    }
  };

  const loginWithGoogle = async () => {
    try {
      // In a real implementation, we would use the Google OAuth flow here
      // For now, we'll simulate a more realistic flow with validation
      
      // Simulate a loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data that would come from Google OAuth
      const mockUser = {
        id: '123g',
        name: 'Google User',
        email: 'google@example.com',
        role: 'patient',
        profilePic: 'https://randomuser.me/api/portraits/men/32.jpg'
      };
      
      setUser(mockUser);
      if (isBrowser()) {
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to login with Google' 
      };
    }
  };

  const loginWithFacebook = async () => {
    try {
      // In a real implementation, we would use the Facebook SDK here
      // For now, we'll simulate a more realistic flow with validation
      
      // Simulate a loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data that would come from Facebook login
      const mockUser = {
        id: '123f',
        name: 'Facebook User',
        email: 'facebook@example.com',
        role: 'patient',
        profilePic: 'https://randomuser.me/api/portraits/women/44.jpg'
      };
      
      setUser(mockUser);
      if (isBrowser()) {
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to login with Facebook' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    if (isBrowser()) {
      localStorage.removeItem('user');
    }
    navigate('/login');
  };

  const register = async (userData) => {
    try {
      // Mock implementation - would make API call in production
      const mockUser = {
        id: '124',
        name: userData.name,
        email: userData.email,
        role: 'patient',
      };
      
      setUser(mockUser);
      if (isBrowser()) {
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to register' 
      };
    }
  };

  const value = {
    user,
    isLoading,
    login,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 