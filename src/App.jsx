import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Suspense, lazy } from 'react';

// Layouts
import MainLayout from './layouts/MainLayout';
// Components
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load page components
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const AppointmentPage = lazy(() => import('./pages/appointment/AppointmentPage'));
const DoctorPage = lazy(() => import('./pages/doctor/DoctorPage'));
const MedicationPage = lazy(() => import('./pages/medication/MedicationPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));
const ReportPage = lazy(() => import('./pages/report/ReportPage'));
const VideoCallPage = lazy(() => import('./pages/videocall/VideocallPage'));
const ChatPage = lazy(() => import('./pages/chat/ChatbotPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const DietPlanPage = lazy(() => import('./pages/diet/DietPlanPage'));
const AmbulancePage = lazy(() => import('./pages/ambulance/AmbulancePage'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};


// App Component with Routes
function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="appointments/*" element={<AppointmentPage />} />
          <Route path="doctor/*" element={<DoctorPage />} />
          <Route path="medication/*" element={<MedicationPage />} />
          <Route path="profile/*" element={<ProfilePage />} />
          <Route path="report/*" element={<ReportPage />} />
          <Route path="videocall/*" element={<VideoCallPage />} />
          <Route path="chat/*" element={<ChatPage />} />
          <Route path="diet-plan/*" element={<DietPlanPage />} />
          <Route path="ambulance/*" element={<AmbulancePage />} />
        </Route>
        
        {/* Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
