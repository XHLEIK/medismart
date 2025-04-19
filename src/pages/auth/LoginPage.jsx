import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
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
            
            <form className="space-y-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-5" onSubmit={handleSubmit}>
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