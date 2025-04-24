import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if we have a success message from registration or password reset
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the location state to prevent showing the message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Submitting login form with email:', email);
      const result = await login(email, password);
      
      if (result.success) {
        console.log('Login successful, redirecting to dashboard');
        // Add a small delay to ensure the auth state is properly updated
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      } else {
        console.error('Login failed:', result.error);
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Attempting to login with Google');
      const result = await loginWithGoogle();
      
      if (result.success) {
        console.log('Google login successful, redirecting to dashboard');
        // Add a small delay to ensure the auth state is properly updated
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      } else {
        console.error('Google login failed:', result.error);
        setError(result.error || 'Failed to login with Google');
      }
    } catch (err) {
      console.error('Unexpected Google login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Attempting to login with Facebook');
      const result = await loginWithFacebook();
      
      if (result.success) {
        console.log('Facebook login successful, redirecting to dashboard');
        // Add a small delay to ensure the auth state is properly updated
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      } else {
        console.error('Facebook login failed:', result.error);
        setError(result.error || 'Failed to login with Facebook');
      }
    } catch (err) {
      console.error('Unexpected Facebook login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-4 py-8 bg-gradient-to-b from-blue-50 to-teal-50 animate-fadeIn">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center">
            <img
              className="h-14 w-auto animate-pulse-slow"
              src="/images/logo.svg"
              alt="MediSmart Logo"
            />
            <h2 className="mt-4 text-center text-2xl font-bold text-teal-800">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-6 w-full">
            {error && (
              <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded animate-slideIn">
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="mb-3 p-2 bg-green-100 border border-green-400 text-green-700 text-sm rounded animate-slideIn">
                {successMessage}
              </div>
            )}
            
            <form className="space-y-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-5" onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-3 mb-2">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                  Sign in with Google
                </button>
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-[#1877F2] hover:bg-[#1877F2]/90 transition-all duration-300"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                  </svg>
                  Sign in with Facebook
                </button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/70 text-gray-500">Or sign in with email</span>
                </div>
              </div>
              <div className="animate-slideIn" style={{ animationDelay: '100ms' }}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field-animated focus:border-teal-500 focus:ring-teal-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="animate-slideIn" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                    Password
                  </label>
                  <div className="text-xs">
                    <Link to="/forgot-password" className="font-semibold text-teal-600 hover:text-teal-700 hover-scale">
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field-animated focus:border-teal-500 focus:ring-teal-500"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex items-center animate-slideIn" style={{ animationDelay: '300ms' }}>
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="animate-slideIn" style={{ animationDelay: '400ms' }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 justify-center rounded-md text-sm font-semibold shadow-sm bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white transition-all duration-300 transform hover:-translate-y-1"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <p className="mt-4 text-center text-xs text-gray-600 animate-slideIn" style={{ animationDelay: '500ms' }}>
              Not a member?{' '}
              <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-700 hover-scale">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - Image/Design */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-teal-500 to-emerald-600 relative">
        <div className="absolute inset-0 bg-grid bg-opacity-20"></div>
        <div className="absolute inset-0 bg-black/5"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center text-white px-8 py-6 h-full">
          {/* Medical illustration */}
          <div className="w-full h-48 mb-4 flex justify-center items-center">
            <svg className="w-44 h-44 text-white" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              {/* Stethoscope */}
              <path fill="currentColor" 
                d="M140,40 C150,40 160,50 160,60 C160,70 150,80 140,80 C130,80 120,70 120,60 C120,50 130,40 140,40 Z" 
                className="animate-float" style={{animationDelay: '0.5s'}} />
              <path fill="none" stroke="currentColor" strokeWidth="4" 
                d="M140,80 L140,120 L80,120 L80,160" 
                className="animate-float" style={{animationDelay: '0.3s'}} />
              <circle fill="currentColor" cx="80" cy="170" r="10" 
                className="animate-pulse-slow" />
              
              {/* Medical cross */}
              <rect x="25" y="40" width="40" height="120" rx="5" fill="white" fillOpacity="0.3" 
                className="animate-pulse-slow" />
              <rect x="-15" y="80" width="120" height="40" rx="5" fill="white" fillOpacity="0.3" 
                className="animate-pulse-slow" />
              
              {/* Pills */}
              <ellipse cx="180" cy="110" rx="15" ry="8" fill="white" fillOpacity="0.5" 
                className="animate-float" style={{animationDelay: '0.8s'}} />
              <ellipse cx="160" cy="130" rx="15" ry="8" fill="white" fillOpacity="0.5" 
                className="animate-float" style={{animationDelay: '1.2s'}} />
              <ellipse cx="170" cy="150" rx="15" ry="8" fill="white" fillOpacity="0.5" 
                className="animate-float" style={{animationDelay: '0.6s'}} />
            </svg>
          </div>
          
          <div className="w-full max-w-md text-center">
            <h1 className="text-3xl font-bold mb-3 text-shadow animate-slideInRight" style={{ animationDelay: '100ms' }}>
              Your Health, Our Priority
            </h1>
            <p className="text-lg mb-4 text-shadow-sm animate-slideInRight" style={{ animationDelay: '200ms' }}>
              Access world-class healthcare services from the comfort of your home
            </p>
            
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="glass-card p-3 rounded-lg animate-slideInRight hover-lift bg-teal-700/30 backdrop-blur-sm border border-white/10" style={{ animationDelay: '300ms' }}>
                <h3 className="font-semibold text-base mb-1">Online Appointments</h3>
                <p className="text-xs text-white/90">Schedule and manage your doctor appointments with ease</p>
              </div>
              <div className="glass-card p-3 rounded-lg animate-slideInRight hover-lift bg-teal-700/30 backdrop-blur-sm border border-white/10" style={{ animationDelay: '400ms' }}>
                <h3 className="font-semibold text-base mb-1">Video Consultations</h3>
                <p className="text-xs text-white/90">Talk face-to-face with experienced healthcare professionals</p>
              </div>
              <div className="glass-card p-3 rounded-lg animate-slideInRight hover-lift bg-teal-700/30 backdrop-blur-sm border border-white/10" style={{ animationDelay: '500ms' }}>
                <h3 className="font-semibold text-base mb-1">Medical Records</h3>
                <p className="text-xs text-white/90">Securely store and access your health information anytime</p>
              </div>
              <div className="glass-card p-3 rounded-lg animate-slideInRight hover-lift bg-teal-700/30 backdrop-blur-sm border border-white/10" style={{ animationDelay: '600ms' }}>
                <h3 className="font-semibold text-base mb-1">24/7 Support</h3>
                <p className="text-xs text-white/90">Get assistance whenever you need it with our support team</p>
              </div>
            </div>
            
            <div className="mt-6 animate-slideInRight" style={{ animationDelay: '700ms' }}>
              <div className="p-3 glass-card rounded-lg inline-block bg-teal-700/30 backdrop-blur-sm border border-white/10">
                <p className="text-base font-medium">
                  "MediSmart revolutionized how I manage my healthcare."
                </p>
                <p className="mt-1 text-xs text-white/90">- Sarah Thompson, Patient</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-2 left-0 right-0 text-center text-white/70 text-xs animate-fadeIn" style={{ animationDelay: '800ms' }}>
          © 2025 MediSmart. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 