import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CalendarIcon } from '@heroicons/react/24/outline';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate API call to fetch notifications
    setIsLoading(true);
    setTimeout(() => {
      const mockNotifications = [
        {
          id: 1,
          title: 'Appointment Reminder',
          message: 'Your appointment with Dr. Sarah Johnson is tomorrow at 10:30 AM',
          time: '1 hour ago',
          date: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          read: false,
          type: 'appointment'
        },
        {
          id: 2,
          title: 'Medication Reminder',
          message: 'Time to take your medication - Amoxicillin 500mg',
          time: '3 hours ago',
          date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          read: true,
          type: 'medication'
        },
        {
          id: 3,
          title: 'Lab Results Available',
          message: 'Your recent blood work results are now available',
          time: 'Yesterday',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: false,
          type: 'results'
        },
        {
          id: 4,
          title: 'Appointment Booked',
          message: 'You have successfully booked an appointment with Dr. Michael Chen for May 20, 2024',
          time: '2 days ago',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          type: 'appointment'
        },
        {
          id: 5,
          title: 'Diet Plan Updated',
          message: 'Your nutritionist has updated your diet plan. Check it out now!',
          time: '3 days ago',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          type: 'diet'
        }
      ];
      
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleMarkAsRead = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
      ? notifications.filter(notification => !notification.read)
      : notifications.filter(notification => notification.type === filter);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'appointment':
        return (
          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
            <CalendarIcon className="h-5 w-5" />
          </div>
        );
      case 'medication':
        return (
          <div className="p-2 rounded-full bg-green-100 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        );
      case 'results':
        return (
          <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      case 'diet':
        return (
          <div className="p-2 rounded-full bg-purple-100 text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-full bg-gray-100 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with your healthcare activities</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button 
            onClick={handleMarkAllAsRead}
            className="btn-primary"
            disabled={!notifications.some(notification => !notification.read)}
          >
            Mark All as Read
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                filter === 'all'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                filter === 'unread'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                filter === 'appointment'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setFilter('appointment')}
            >
              Appointments
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                filter === 'medication'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setFilter('medication')}
            >
              Medications
            </button>
          </nav>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-gray-50 transition-colors ${notification.read ? 'opacity-70' : 'bg-blue-50'}`}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start">
                  {getTypeIcon(notification.type)}
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className={`text-sm font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                    
                    {!notification.read && (
                      <button 
                        className="mt-2 text-xs text-primary hover:text-primary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p>No notifications found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage; 