import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-teal-600">404</h1>
        <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-emerald-500 mx-auto my-4 rounded-full"></div>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          We're sorry, the page you requested could not be found. Please check the URL or return to the dashboard.
        </p>
        <div className="space-y-3">
          <Link 
            to="/" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium rounded-md shadow-md hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 transform hover:-translate-y-1"
          >
            Return to Dashboard
          </Link>
          <div className="mt-4">
            <Link 
              to="/login" 
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    </div>
  );
};

export default NotFoundPage; 