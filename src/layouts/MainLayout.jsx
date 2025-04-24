import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon, 
  VideoCameraIcon, 
  ClipboardDocumentListIcon, 
  TruckIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  MicrophoneIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import VoiceAssistant from '../components/voice-ai/VoiceAssistant';

// Create notification context for sharing across components
export const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

// Helper function to safely check if we're in a browser environment
const isBrowser = () => typeof window !== 'undefined';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);
  const sidebarRef = useRef(null);
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isBrowser()) return;
    
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && sidebarOpen) {
        setSidebarOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef, sidebarOpen]);
  
  // Close sidebar on route change for mobile
  useEffect(() => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location]);

  // Get notifications from localStorage or use default mock data
  useEffect(() => {
    if (!isBrowser()) return;
    
    try {
      const storedNotifications = localStorage.getItem('medismart_notifications');
      
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      } else {
        // Default mock data
        const defaultNotifications = [
          {
            id: 1,
            title: 'Appointment Reminder',
            message: 'Your appointment with Dr. Sarah Johnson is tomorrow at 10:30 AM',
            time: '1 hour ago',
            read: false,
            type: 'appointment'
          },
          {
            id: 2,
            title: 'Medication Reminder',
            message: 'Time to take your medication - Amoxicillin 500mg',
            time: '3 hours ago',
            read: true,
            type: 'medication'
          },
          {
            id: 3,
            title: 'Lab Results Available',
            message: 'Your recent blood work results are now available',
            time: 'Yesterday',
            read: false,
            type: 'results'
          }
        ];
        
        setNotifications(defaultNotifications);
        localStorage.setItem('medismart_notifications', JSON.stringify(defaultNotifications));
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      // Fallback to default notifications without trying to save to localStorage
      setNotifications([
        {
          id: 1,
          title: 'Appointment Reminder',
          message: 'Your appointment with Dr. Sarah Johnson is tomorrow at 10:30 AM',
          time: '1 hour ago',
          read: false,
          type: 'appointment'
        }
      ]);
    }
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    if (!isBrowser()) return;
    
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);

  // Update page title based on route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard')) setPageTitle('Dashboard');
    else if (path.includes('/appointment')) setPageTitle('Appointments');
    else if (path.includes('/doctor')) setPageTitle('Doctors');
    else if (path.includes('/medication')) setPageTitle('Medications');
    else if (path.includes('/report')) setPageTitle('Reports');
    else if (path.includes('/profile')) setPageTitle('Profile');
    else if (path.includes('/diet-plan')) setPageTitle('Diet Plans');
    else if (path.includes('/ambulance')) setPageTitle('Ambulance Services');
    else setPageTitle('MediSmart');
  }, [location]);

  // Navigation links
  const navigationLinks = [
    { name: 'Dashboard', path: '/', icon: 'dashboard' },
    { name: 'Appointments', path: '/appointments', icon: 'calendar' },
    { name: 'Medical Records', path: '/records', icon: 'folder' },
    { name: 'Medications', path: '/medications', icon: 'pill' },
    { name: 'Chat', path: '/chat', icon: 'chat' },  
    { name: 'Profile', path: '/profile', icon: 'user' }
  ];

  const markAsRead = (id) => {
    if (!isBrowser()) return;
    
    try {
      const updatedNotifications = notifications.map(notification => 
        notification.id === id ? {...notification, read: true} : notification
      );
      
      setNotifications(updatedNotifications);
      localStorage.setItem('medismart_notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error("Error updating notifications:", error);
    }
  };
  
  // Add a new notification
  const addNotification = (notification) => {
    if (!isBrowser()) return;
    
    try {
      const newNotification = {
        id: Date.now(),
        time: 'Just now',
        read: false,
        ...notification
      };
      
      const updatedNotifications = [newNotification, ...notifications];
      setNotifications(updatedNotifications);
      localStorage.setItem('medismart_notifications', JSON.stringify(updatedNotifications));
      
      return newNotification.id;
    } catch (error) {
      console.error("Error adding notification:", error);
      return null;
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    if (!isBrowser()) return;
    
    try {
      const updatedNotifications = notifications.map(notification => ({
        ...notification, 
        read: true
      }));
      
      setNotifications(updatedNotifications);
      localStorage.setItem('medismart_notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };
  
  // Delete a notification
  const deleteNotification = (id) => {
    if (!isBrowser()) return;
    
    try {
      const updatedNotifications = notifications.filter(
        notification => notification.id !== id
      );
      
      setNotifications(updatedNotifications);
      localStorage.setItem('medismart_notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  // Notification context value
  const notificationContextValue = {
    notifications, 
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Call the global search function directly if on dashboard page
    if (isBrowser() && location.pathname === '/dashboard' && window.searchDashboard) {
      window.searchDashboard(value);
    }
  };

  return (
    <NotificationContext.Provider value={notificationContextValue}>
      <div className="h-screen flex overflow-hidden bg-white">
        {/* Sidebar for desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-200">
            <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 px-4 flex items-center">
                <img className="h-8 w-auto" src="/images/logo.svg" alt="MediSmart Logo" />
                <span className="ml-2 text-xl font-bold text-primary">MediSmart</span>
              </div>
              
              <nav className="mt-8 flex-1 px-4 space-y-1">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  end
                >
                  <HomeIcon className="mr-3 flex-shrink-0 h-5 w-5" />
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/appointments" 
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <CalendarIcon className="mr-3 flex-shrink-0 h-5 w-5" />
                  Appointments
                </NavLink>
                <NavLink 
                  to="/doctor" 
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <UserCircleIcon className="mr-3 flex-shrink-0 h-5 w-5" />
                  Doctors
                </NavLink>
                <NavLink 
                  to="/medication" 
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 flex-shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Medications
                </NavLink>
                <NavLink 
                  to="/report" 
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <ClipboardDocumentListIcon className="mr-3 flex-shrink-0 h-5 w-5" />
                  Reports
                </NavLink>
                <NavLink 
                  to="/chat" 
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <ChatBubbleLeftRightIcon className="mr-3 flex-shrink-0 h-5 w-5" />
                  Chat
                </NavLink>
                <NavLink 
                  to="/videocall" 
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <VideoCameraIcon className="mr-3 flex-shrink-0 h-5 w-5" />
                  Video Call
                </NavLink>
                <NavLink 
                  to="/diet-plan" 
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 flex-shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Diet Plans
                </NavLink>
                <NavLink 
                  to="/ambulance" 
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <TruckIcon className="mr-3 flex-shrink-0 h-5 w-5" />
                  Ambulance
                </NavLink>
              </nav>
            </div>

            {/* Logout button */}
            <div className="p-4 border-t border-gray-200">
              <button 
                onClick={logout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 hover-scale"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile sidebar */}
        <div 
          className={`fixed inset-0 flex z-50 md:hidden transition-opacity ease-linear duration-300 ${
            sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div 
            className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
              sidebarOpen ? 'opacity-100' : 'opacity-0'
            }`} 
            onClick={() => setSidebarOpen(false)}
          ></div>
          
          <div 
            ref={sidebarRef}
            className={`relative flex-1 flex flex-col max-w-xs w-[80%] bg-white transform transition-transform ease-in-out duration-300 shadow-xl ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 px-4 flex items-center">
                <img className="h-8 w-auto" src="/images/logo.svg" alt="MediSmart Logo" />
                <span className="ml-2 text-xl font-bold text-primary">MediSmart</span>
              </div>
              
              <nav className="mt-5 px-4 space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  end
                >
                  <HomeIcon className="mr-3 flex-shrink-0 h-5 w-5" />
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/appointments" 
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <CalendarIcon className="mr-3 flex-shrink-0 h-5 w-5" />
                  Appointments
                </NavLink>
                <NavLink 
                  to="/doctor" 
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <UserCircleIcon className="mr-3 flex-shrink-0 h-5 w-5" />
                  Doctors
                </NavLink>
                <NavLink 
                  to="/medication" 
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 flex-shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Medications
                </NavLink>
                <NavLink 
                  to="/report" 
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <ClipboardDocumentListIcon className="mr-3 flex-shrink-0 h-5 w-5" />
                  Reports
                </NavLink>
                <NavLink 
                  to="/chat" 
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <ChatBubbleLeftRightIcon className="mr-3 flex-shrink-0 h-5 w-5" />
                  Chat
                </NavLink>
                <NavLink 
                  to="/videocall" 
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <VideoCameraIcon className="mr-3 flex-shrink-0 h-5 w-5" />
                  Video Call
                </NavLink>
                <NavLink 
                  to="/diet-plan" 
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 flex-shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Diet Plans
                </NavLink>
                <NavLink 
                  to="/ambulance" 
                  className={({ isActive }) => 
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <TruckIcon className="mr-3 flex-shrink-0 h-5 w-5" />
                  Ambulance
                </NavLink>
              </nav>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <button 
                onClick={logout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top header */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 glass-effect">
            <div className="flex items-center justify-between h-16 px-4">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none hover-scale"
                >
                  <Bars3Icon className="w-6 h-6" />
                </button>
                
                <div className="ml-4 hidden md:block">
                  <div className="text-lg font-medium text-gray-800 gradient-text">
                    {pageTitle}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="input-field transition-all duration-300 w-36 focus:w-64 pl-10 pr-4 py-2 rounded-full"
                  />
                  <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
                
                <div className="relative" ref={notificationRef}>
                  <button 
                    className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-gray-100 icon-container"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                  >
                    <BellIcon className="w-6 h-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Notifications dropdown */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-[999] border border-gray-200 animate-fadeIn">
                      <div className="py-2">
                        <div className="px-4 py-3 text-sm font-medium text-gray-700 flex items-center justify-between bg-gray-50 border-b border-gray-200">
                          <span>Notifications</span>
                          {unreadCount > 0 && (
                            <button 
                              onClick={markAllAsRead}
                              className="text-xs text-primary hover:text-primary/80 hover-scale"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                        
                        <div className="max-h-60 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map(notification => (
                              <div 
                                key={notification.id} 
                                className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${notification.read ? 'opacity-70' : 'bg-blue-50'}`}
                                onClick={() => markAsRead(notification.id)}
                              >
                                <div className="flex items-start">
                                  <div className={`p-2 rounded-full mr-3 flex-shrink-0 ${
                                    notification.type === 'appointment' ? 'bg-blue-100 text-blue-600' : 
                                    notification.type === 'medication' ? 'bg-green-100 text-green-600' : 
                                    'bg-yellow-100 text-yellow-600'
                                  }`}>
                                    {notification.type === 'appointment' && (
                                      <CalendarIcon className="h-4 w-4" />
                                    )}
                                    {notification.type === 'medication' && (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                      </svg>
                                    )}
                                    {notification.type === 'results' && (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {notification.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {notification.time}
                                    </p>
                                  </div>
                                  {!notification.read && (
                                    <div className="ml-2 flex-shrink-0">
                                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-6 text-center text-gray-500">
                              No new notifications
                            </div>
                          )}
                        </div>
                        
                        <div className="px-4 py-2 text-xs text-center text-primary hover:text-primary/80 border-t border-gray-100">
                          <button onClick={() => navigate('/notifications')} className="hover-scale">
                            View all notifications
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div 
                  onClick={() => navigate('/profile')}
                  className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center cursor-pointer shadow-blue hover-scale relative group"
                  aria-label="User Profile"
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : <UserCircleIcon className="w-6 h-6" />}
                  <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 -bottom-8 whitespace-nowrap bg-gray-800 text-white text-xs rounded py-1 px-2">
                    Profile
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50 relative">
            <Outlet />
            
            {/* Floating AI Assistant Button */}
            <div className="fixed bottom-6 right-6 z-50">
              <VoiceAssistant />
            </div>
          </main>
        </div>
      </div>
    </NotificationContext.Provider>
  );
};

export default MainLayout; 