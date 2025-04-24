import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.error || 'Failed to send reset link. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:px-8 bg-gradient-to-b from-blue-50 to-teal-50 animate-fadeIn">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-16 w-auto animate-pulse-slow"
            src="/images/logo.svg"
            alt="MediSmart Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-bold leading-9 tracking-tight text-teal-800">
            Reset your password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded animate-slideIn">
              {error}
            </div>
          )}
          
          {isSubmitted ? (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center animate-fadeIn">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reset link sent!</h3>
              <p className="text-gray-600 mb-4">
                We've sent password reset instructions to <span className="font-medium">{email}</span>. 
                Please check your email.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full py-2 justify-center rounded-md text-sm font-semibold text-teal-600 border border-teal-600 hover:bg-teal-50 transition-colors"
                >
                  Try again
                </button>
                <Link
                  to="/login"
                  className="w-full py-2 justify-center rounded-md text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-center transition-colors"
                >
                  Back to login
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6" onSubmit={handleSubmit}>
              <div className="animate-slideIn" style={{ animationDelay: '100ms' }}>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
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
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 justify-center rounded-md text-sm font-semibold shadow-sm bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white transition-all duration-300 transform hover:-translate-y-1"
                >
                  {isLoading ? 'Sending...' : 'Send reset link'}
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <Link to="/login" className="text-sm text-teal-600 hover:text-teal-700 hover-scale">
                  Back to login
                </Link>
              </div>
            </form>
          )}

          <p className="mt-10 text-center text-sm text-gray-600 animate-slideIn" style={{ animationDelay: '300ms' }}>
            Remember your password?{' '}
            <Link to="/login" className="font-semibold leading-6 text-teal-600 hover:text-teal-700 hover-scale">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right side - Image/Design */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-teal-500 to-emerald-600 relative">
        <div className="absolute inset-0 bg-grid bg-opacity-20"></div>
        <div className="absolute inset-0 bg-black/5"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center">
            <div className="mb-8">
              <svg className="h-24 w-24 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold mb-6 text-shadow animate-slideInRight" style={{ animationDelay: '100ms' }}>
              Password Recovery
            </h1>
            <p className="text-xl mb-8 text-shadow-sm animate-slideInRight" style={{ animationDelay: '200ms' }}>
              We're here to help you regain access to your healthcare account
            </p>
            
            <div className="space-y-4 mt-8">
              <div className="glass-card p-5 rounded-lg animate-slideInRight bg-teal-700/30 backdrop-blur-sm border border-white/10" style={{ animationDelay: '300ms' }}>
                <h3 className="font-semibold text-lg mb-2">Secure Reset Process</h3>
                <p className="text-sm text-white/90">Our password reset process is secure and encrypted to protect your information</p>
              </div>
              
              <div className="glass-card p-5 rounded-lg animate-slideInRight bg-teal-700/30 backdrop-blur-sm border border-white/10" style={{ animationDelay: '400ms' }}>
                <h3 className="font-semibold text-lg mb-2">Quick & Easy</h3>
                <p className="text-sm text-white/90">Reset your password in minutes and regain access to your healthcare services</p>
              </div>
              
              <div className="glass-card p-5 rounded-lg animate-slideInRight bg-teal-700/30 backdrop-blur-sm border border-white/10" style={{ animationDelay: '500ms' }}>
                <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
                <p className="text-sm text-white/90">Our support team is available 24/7 to assist you with any issues</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-sm animate-fadeIn" style={{ animationDelay: '800ms' }}>
          © 2025 MediSmart. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 