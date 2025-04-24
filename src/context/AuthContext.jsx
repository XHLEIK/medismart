import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  supabase, 
  signIn, 
  signUp, 
  signInWithGoogle, 
  signInWithFacebook, 
  signOut, 
  resetPassword,
  getCurrentUser,
  getSession,
  onAuthStateChange
} from '../utils/supabase';

// Helper function to safely check if we're in a browser environment
const isBrowser = () => typeof window !== 'undefined';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        // Get the current session
        const { data: sessionData } = await getSession();
        setSession(sessionData.session);
        
        if (sessionData.session) {
          const { data: userData } = await getCurrentUser();
          const userWithRole = {
            ...userData.user,
            role: userData.user.user_metadata?.role || 'patient',
          };
          setUser(userWithRole);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: authListener } = onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (event === 'SIGNED_IN' && session) {
        const { data } = await getCurrentUser();
        const userWithRole = {
          ...data.user,
          role: data.user.user_metadata?.role || 'patient',
        };
        setUser(userWithRole);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
      }
    });

    // Cleanup function
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting to login with email:', email);
      const { data, error } = await signIn({ email, password });
      
      if (error) throw error;
      
      // Immediately update the session and user state
      if (data.session) {
        setSession(data.session);
        
        // Set the user data
        const userWithRole = {
          ...data.user,
          role: data.user.user_metadata?.role || 'patient',
        };
        setUser(userWithRole);
        
        console.log('Login successful, user state updated:', userWithRole.id);
      } else {
        console.warn('Login successful but no session returned');
      }
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error.message);
      return { 
        success: false, 
        error: error.message || 'Failed to login' 
      };
    }
  };

  const loginWithGoogleAuth = async () => {
    try {
      const { data, error } = await signInWithGoogle();
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to login with Google' 
      };
    }
  };

  const loginWithFacebookAuth = async () => {
    try {
      const { data, error } = await signInWithFacebook();
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to login with Facebook' 
      };
    }
  };

  const logout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      navigate('/login');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to logout'
      };
    }
  };

  const register = async (userData) => {
    try {
      const { data, error } = await signUp({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: 'patient', // Default role for new users
      });
      
      if (error) throw error;
      
      return { success: true, user: data.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to register' 
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const { error } = await resetPassword(email);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to send password reset email'
      };
    }
  };

  const value = {
    user,
    session,
    isLoading,
    login,
    loginWithGoogle: loginWithGoogleAuth,
    loginWithFacebook: loginWithFacebookAuth,
    logout,
    register,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};