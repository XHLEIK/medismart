import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { CalendarIcon, ClockIcon, UserIcon, ArrowRightIcon, BellIcon, HeartIcon, BeakerIcon, ArrowTrendingUpIcon, CheckCircleIcon, XCircleIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../layouts/MainLayout';
import appointmentApi from '../../api/appointmentApi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, addNotification, markAsRead } = useNotifications();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [stats, setStats] = useState({
    appointments: 0,
    medications: 0,
    reports: 0,
    notifications: 0,
    hospitalBeds: 85, // percentage occupied
    doctorsAvailable: 12,
    emergencyWaitTime: 15, // minutes
  });
  
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [medications, setMedications] = useState([]);
  const [vitalSigns, setVitalSigns] = useState({
    bloodPressure: '120/80',
    heartRate: 72,
    temperature: 98.6,
    bloodSugar: 95,
    oxygenLevel: 98
  });
  
  const navigate = useNavigate();
  
  // Fetch real appointments from MongoDB
  const fetchRealAppointments = async () => {
    if (!user || !user.id) return;
    
    try {
      console.log('Fetching real appointments for dashboard');
      const appointments = await appointmentApi.getUserAppointments(user.id);
      console.log('Fetched appointments:', appointments);
      
      if (appointments && appointments.length > 0) {
        // Transform the appointments data to match the expected format
        const formattedAppointments = appointments.map(appointment => {
          // Default status to 'scheduled' if not provided
          let status = appointment.status || 'scheduled';
          
          // Normalize status values for consistency
          if (status === 'scheduled' || status === 'confirmed' || status === 'pending') {
            // These are considered active appointments
            status = 'confirmed'; // Normalize to 'confirmed' for the dashboard
          }
          
          return {
            id: appointment._id,
            doctorName: appointment.doctorName,
            specialty: appointment.doctorSpecialty,
            date: new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            time: appointment.appointmentTime,
            status: status,
            image: appointment.doctorImage || 'https://randomuser.me/api/portraits/men/55.jpg'
          };
        });
        
        console.log('Formatted appointments with normalized statuses:', 
          formattedAppointments.map(app => ({ id: app.id, status: app.status })));
        
        // Sort appointments by date (closest first)
        const sortedAppointments = formattedAppointments.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });
        
        setUpcomingAppointments(sortedAppointments);
      } else {
        // If no appointments found, set empty array
        setUpcomingAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments for dashboard:', error);
      // Fallback to empty array if there's an error
      setUpcomingAppointments([]);
    }
  };
  
  // Add a refresh interval to keep appointments up to date
  useEffect(() => {
    // Fetch real appointments if user is logged in
    if (user && user.id) {
      console.log('User is logged in, fetching real appointments');
      fetchRealAppointments();
      
      // Set up a refresh interval to keep appointments updated
      const refreshInterval = setInterval(() => {
        console.log('Refreshing appointments data');
        fetchRealAppointments();
      }, 30000); // Refresh every 30 seconds
      
      // Clean up the interval when the component unmounts
      return () => clearInterval(refreshInterval);
    } else {
      // Fallback to mock data if user is not logged in
      console.log('User not logged in, using mock data');
      setUpcomingAppointments([
        {
          id: 1,
          doctorName: 'Dr. Sarah Johnson',
          specialty: 'Cardiologist',
          date: 'May 15, 2024',
          time: '10:30 AM',
          status: 'confirmed',
          image: 'https://randomuser.me/api/portraits/women/76.jpg'
        },
        {
          id: 2,
          doctorName: 'Dr. Michael Chen',
          specialty: 'Dermatologist',
          date: 'May 20, 2024',
          time: '2:00 PM',
          status: 'pending',
          image: 'https://randomuser.me/api/portraits/men/34.jpg'
        },
      ]);
    }
  }, [user]);
  
  useEffect(() => {
    // Medications data
    setMedications([
      { id: 1, name: 'Amoxicillin', dosage: '500mg', frequency: '3 times daily', timeLeft: 4 },
      { id: 2, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', timeLeft: 15 },
      { id: 3, name: 'Metformin', dosage: '850mg', frequency: 'Twice daily', timeLeft: 7 },
      { id: 4, name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime', timeLeft: 12 },
    ]);
    
    // Recent activities for activity feed and report generation
    setRecentActivities([
      {
        id: 1,
        type: 'appointment',
        title: 'Appointment Booked',
        description: 'You booked an appointment with Dr. Sarah Johnson',
        date: '2 days ago',
        hasReport: true,
        action: () => navigate('/appointments')
      },
      {
        id: 2,
        type: 'report',
        title: 'Lab Results Uploaded',
        description: 'Your blood work results have been uploaded',
        date: '4 days ago',
        hasReport: true,
        action: () => alert('Viewing lab results')
      },
      {
        id: 3,
        type: 'medication',
        title: 'Medication Reminder',
        description: 'Reminder to take Amoxicillin - 3 times daily',
        date: '5 days ago',
        hasReport: false,
        action: () => alert('Medication details')
      },
      {
        id: 4,
        type: 'hospital',
        title: 'Hospital Visit Scheduled',
        description: 'Pre-surgical assessment with Dr. James Rodriguez',
        date: '1 week ago',
        hasReport: true,
        action: () => navigate('/appointments')
      },
      {
        id: 5,
        type: 'telemedicine',
        title: 'Telemedicine Call Completed',
        description: 'Follow-up video consultation with Dr. Emily Wilson',
        date: '1 week ago',
        hasReport: false,
        action: () => navigate('/videocall')
      },
    ]);
    
    // Calculate real stats based on the data
    updateStats();
  }, [navigate, user]);
  
  // Update stats based on actual data
  const updateStats = () => {
    // Count all non-cancelled appointments
    const appointmentCount = upcomingAppointments.filter(
      app => app.status !== 'cancelled'
    ).length;
    
    console.log('Updating appointment count:', appointmentCount, 'from', upcomingAppointments.length, 'total appointments');
    console.log('Appointment statuses:', upcomingAppointments.map(app => app.status));
    
    // Count active medications
    const medicationCount = medications.length;
    
    // Count reports from activities
    const reportCount = recentActivities.filter(activity => activity.hasReport).length;
    
    setStats({
      appointments: appointmentCount,
      medications: medicationCount,
      reports: reportCount,
      notifications: unreadCount,
      hospitalBeds: 85, // percentage occupied
      doctorsAvailable: 12,
      emergencyWaitTime: 15, // minutes
    });
  };
  
  // Update stats whenever related data changes
  useEffect(() => {
    updateStats();
  }, [upcomingAppointments, medications, recentActivities, unreadCount]);
  
  // Define handleSearch function to be accessible globally
  const handleSearch = (searchQuery) => {
    try {
      const query = searchQuery.toLowerCase().trim();
      
      // If search is empty, reset search state
      if (!query) {
        setIsSearching(false);
        setSearchResults([]);
        return;
      }
      
      // Filter appointments
      const filteredAppointments = upcomingAppointments.filter(app => 
        app.doctorName.toLowerCase().includes(query) || 
        app.specialty.toLowerCase().includes(query) ||
        app.date.includes(query) ||
        app.time.toLowerCase().includes(query) ||
        app.status.toLowerCase().includes(query)
      );
      
      // Filter medications
      const filteredMedications = medications.filter(med => 
        med.name.toLowerCase().includes(query) || 
        med.dosage.toLowerCase().includes(query) ||
        med.frequency.toLowerCase().includes(query)
      );
      
      // Filter activities
      const filteredActivities = recentActivities.filter(act => 
        act.title.toLowerCase().includes(query) || 
        act.description.toLowerCase().includes(query)
      );
      
      // Format each search result as a flat array of objects with appropriate properties
      const formattedResults = [
        ...filteredAppointments.map(app => ({
          id: `app-${app.id}`,
          type: 'appointment',
          title: `Appointment: ${app.doctorName}`,
          description: `${app.specialty} on ${app.date} at ${app.time}`,
          action: () => navigate('/appointments')
        })),
        ...filteredMedications.map(med => ({
          id: `med-${med.id}`,
          type: 'medication',
          title: `Medication: ${med.name}`,
          description: `${med.dosage} - ${med.frequency}`,
          action: () => alert(`Medication details for ${med.name}`)
        })),
        ...filteredActivities.map(act => ({
          id: `act-${act.id}`,
          type: act.type,
          title: act.title,
          description: act.description,
          action: act.action
        }))
      ];
      
      // Update search results as a flat array
      setSearchResults(formattedResults);
      setSearchTerm(query);
      setIsSearching(true);
    } catch (error) {
      console.error("Search error:", error);
      setIsSearching(false);
    }
  };
  
  // Expose the search function to window object
  useEffect(() => {
    window.searchDashboard = handleSearch;
    
    // Cleanup
    return () => {
      delete window.searchDashboard;
    };
  }, [upcomingAppointments, medications, recentActivities]); // Dependencies for search function
  
  // Function to mark medication as taken
  const takeMedication = (id) => {
    // In a real app, this would call an API
    setMedications(prev => 
      prev.map(med => 
        med.id === id 
          ? { ...med, timeLeft: Math.max(0, med.timeLeft - 1) }
          : med
      )
    );
    
    // Add a new activity
    const medication = medications.find(med => med.id === id);
    if (medication) {
      // Create a new activity
      const newActivity = {
        id: Date.now(),
        type: 'medication',
        title: 'Medication Taken',
        description: `You took ${medication.name} ${medication.dosage}`,
        date: 'Just now',
        hasReport: false,
        action: () => alert('Medication details')
      };
      
      setRecentActivities(prev => [newActivity, ...prev.slice(0, 9)]);
      
      // Create a notification too
      addNotification({
        title: 'Medication Taken',
        message: `You took ${medication.name} ${medication.dosage}`,
        type: 'medication',
      });
    }
  };
  
  const healthDataOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10,
          font: {
            size: 10
          }
        }
      },
      title: {
        display: true,
        text: 'Health Metrics',
        font: {
          size: 14
        }
      },
    },
    scales: {
      y: {
        ticks: {
          font: {
            size: 9
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 9
          }
        }
      }
    }
  };
  
  const healthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Blood Pressure',
        data: [120, 125, 122, 118, 119, 121],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 2,
        tension: 0.3
      },
      {
        label: 'Heart Rate',
        data: [72, 74, 70, 75, 73, 71],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderWidth: 2,
        tension: 0.3
      },
    ],
  };
  
  const medicationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10,
          font: {
            size: 10
          }
        }
      },
      title: {
        display: true,
        text: 'Medication Adherence',
        font: {
          size: 14
        }
      },
    },
    scales: {
      y: {
        ticks: {
          font: {
            size: 9
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 9
          }
        }
      }
    }
  };
  
  const medicationData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Adherence %',
        data: [85, 90, 95, 100],
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
      },
    ],
  };
  
  const hospitalStatsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 10,
          font: {
            size: 10
          }
        }
      },
      title: {
        display: true,
        text: 'Hospital Resources',
        font: {
          size: 14
        }
      },
    }
  };

  const hospitalStatsData = {
    labels: ['Occupied', 'Available'],
    datasets: [
      {
        data: [stats.hospitalBeds, 100 - stats.hospitalBeds],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(59, 130, 246, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const renderAppointmentStatus = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Confirmed</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Cancelled</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search Results */}
      {isSearching && (
        <div className="card p-4 shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition-all bg-white animate-slideIn">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Results for "{searchTerm}"
          </h2>
          
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((result, index) => (
                <div 
                  key={result.id}
                  className="flex items-start p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer hover-lift animate-slideIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={result.action}
                >
                  <div className={`p-2 rounded-full mr-3 flex-shrink-0 
                    ${result.type === 'appointment' ? 'bg-blue-100 text-blue-600' : 
                    result.type === 'medication' ? 'bg-green-100 text-green-600' : 
                    result.type === 'hospital' ? 'bg-purple-100 text-purple-600' :
                    result.type === 'telemedicine' ? 'bg-amber-100 text-amber-600' :
                    'bg-indigo-100 text-indigo-600'}`}
                  >
                    {result.type === 'appointment' && (
                      <CalendarIcon className="h-5 w-5" />
                    )}
                    {result.type === 'medication' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )}
                    {result.type === 'report' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {result.type === 'hospital' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    )}
                    {result.type === 'telemedicine' && (
                      <VideoCameraIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-gray-900 text-sm">{result.title}</p>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{result.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-500">No results found for "{searchTerm}"</p>
              <button 
                className="mt-3 text-sm text-primary hover:text-primary/80 btn-outline-sm"
                onClick={() => {setIsSearching(false); setSearchTerm('');}}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Welcome Banner with Gradient Background */}
      <div className="bg-gradient-to-r from-primary to-[#06b6d4] rounded-2xl p-6 shadow-xl text-white mb-8 transform hover:scale-[1.01] transition-transform">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-shadow">
              Welcome back, {
                // Try to get the first name from user metadata
                user?.user_metadata?.full_name ? 
                  user.user_metadata.full_name.split(' ')[0] : // Get first name from full name
                  user?.user_metadata?.name || // Fallback to name if available
                  user?.email?.split('@')[0] || // Fallback to email username
                  'Guest' // Final fallback
              }
            </h1>
            <p className="mt-2 text-blue-50">Your health dashboard overview</p>
          </div>
          <div className="mt-4 md:mt-0 animate-pulse">
            <Link to="/appointments" className="bg-white text-primary hover:bg-blue-50 transition-all py-2 px-4 rounded-lg font-medium shadow-md flex items-center hover:shadow-lg">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Schedule Appointment
            </Link>
          </div>
        </div>
        
        {/* Health Stats Quick View Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="glass-card p-4 rounded-xl cursor-pointer hover:bg-white/30 transition-all bg-gradient-to-br from-blue-600/20 to-cyan-600/20" onClick={() => navigate('/appointments')}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/30 text-white">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-50">Appointments</p>
                <p className="text-2xl font-semibold">
                  {stats.appointments > 0 ? stats.appointments : 'No'}
                  <span className="text-lg ml-1">{stats.appointments === 1 ? 'Upcoming' : (stats.appointments > 1 ? 'Upcoming' : 'Appointments')}</span>
                </p>
              </div>
            </div>
            {stats.appointments > 0 && (
              <div className="mt-2 text-xs text-blue-50">
                Next: {upcomingAppointments[0]?.date} at {upcomingAppointments[0]?.time}
              </div>
            )}
          </div>
          
          <div className="glass-card p-4 rounded-xl cursor-pointer hover:bg-white/30 transition-all bg-gradient-to-br from-purple-600/20 to-indigo-600/20" onClick={() => medications.length > 0 && takeMedication(medications[0].id)}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/30 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-50">Medications</p>
                <p className="text-2xl font-semibold">
                  {stats.medications > 0 ? stats.medications : 'No'}
                  <span className="text-lg ml-1">{stats.medications === 1 ? 'Active' : (stats.medications > 1 ? 'Active' : 'Medications')}</span>
                </p>
              </div>
            </div>
            {medications.length > 0 && (
              <div className="mt-2 text-xs text-blue-50">
                Next: {medications[0]?.name} {medications[0]?.dosage} ({medications[0]?.frequency})
              </div>
            )}
          </div>
          
          <div className="glass-card p-4 rounded-xl cursor-pointer hover:bg-white/30 transition-all bg-gradient-to-br from-emerald-600/20 to-teal-600/20" onClick={() => alert('View all your health reports')}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/30 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-50">Reports</p>
                <p className="text-2xl font-semibold">
                  {stats.reports > 0 ? stats.reports : 'No'}
                  <span className="text-lg ml-1">{stats.reports === 1 ? 'Report' : (stats.reports > 1 ? 'Reports' : 'Reports')}</span>
                </p>
              </div>
            </div>
            {recentActivities.find(a => a.hasReport) && (
              <div className="mt-2 text-xs text-blue-50">
                Latest: {recentActivities.find(a => a.hasReport)?.title}
              </div>
            )}
          </div>
          
          <div className="glass-card p-4 rounded-xl cursor-pointer hover:bg-white/30 transition-all bg-gradient-to-br from-amber-600/20 to-orange-600/20" onClick={() => navigate('/notifications')}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/30 text-white relative">
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs bg-red-500 text-white rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-50">Notifications</p>
                <p className="text-2xl font-semibold">
                  {unreadCount > 0 ? unreadCount : 'No'}
                  <span className="text-lg ml-1">{unreadCount === 1 ? 'Unread' : (unreadCount > 1 ? 'Unread' : 'Notifications')}</span>
                </p>
              </div>
            </div>
            {notifications.filter(n => !n.read).length > 0 && (
              <div className="mt-2 text-xs text-blue-50">
                Latest: {notifications.find(n => !n.read)?.title}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Hospital Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card p-4 shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="text-md font-bold text-gray-900 mb-2 flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
            Hospital Status
          </h3>
          <div className="flex justify-around items-center py-2">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.doctorsAvailable}</div>
              <div className="text-xs text-gray-600">Doctors Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.hospitalBeds}%</div>
              <div className="text-xs text-gray-600">Beds Occupied</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{stats.emergencyWaitTime}m</div>
              <div className="text-xs text-gray-600">ER Wait Time</div>
            </div>
          </div>
        </div>
        
        <div className="card p-4 shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition-all bg-gradient-to-br from-rose-50 to-pink-50">
          <h3 className="text-md font-bold text-gray-900 mb-2 flex items-center">
            <HeartIcon className="h-5 w-5 mr-2 text-red-600" />
            Vital Signs
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 py-2">
            <div className="text-center p-1 bg-white/70 rounded-lg shadow-sm">
              <div className="text-lg font-semibold text-gray-800">{vitalSigns.bloodPressure}</div>
              <div className="text-xs text-gray-600">Blood Pressure</div>
            </div>
            <div className="text-center p-1 bg-white/70 rounded-lg shadow-sm">
              <div className="text-lg font-semibold text-gray-800">{vitalSigns.heartRate}</div>
              <div className="text-xs text-gray-600">Heart Rate</div>
            </div>
            <div className="text-center p-1 bg-white/70 rounded-lg shadow-sm">
              <div className="text-lg font-semibold text-gray-800">{vitalSigns.temperature}°F</div>
              <div className="text-xs text-gray-600">Temperature</div>
            </div>
            <div className="text-center p-1 bg-white/70 rounded-lg shadow-sm">
              <div className="text-lg font-semibold text-gray-800">{vitalSigns.bloodSugar}</div>
              <div className="text-xs text-gray-600">Blood Sugar</div>
            </div>
            <div className="text-center p-1 bg-white/70 rounded-lg shadow-sm">
              <div className="text-lg font-semibold text-gray-800">{vitalSigns.oxygenLevel}%</div>
              <div className="text-xs text-gray-600">Oxygen Level</div>
            </div>
          </div>
        </div>
        
        <div className="card p-4 shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition-all bg-gradient-to-br from-emerald-50 to-teal-50">
          <h3 className="text-md font-bold text-gray-900 mb-2 flex items-center">
            <BeakerIcon className="h-5 w-5 mr-2 text-emerald-600" />
            Recent Tests
          </h3>
          <div className="space-y-2 py-2">
            <div className="flex justify-between items-center p-2 bg-white/70 rounded-lg shadow-sm">
              <div>
                <div className="text-sm font-medium text-gray-800">Complete Blood Count</div>
                <div className="text-xs text-gray-600">May 05, 2024</div>
              </div>
              <div className="flex items-center text-xs text-emerald-600">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Normal
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-white/70 rounded-lg shadow-sm">
              <div>
                <div className="text-sm font-medium text-gray-800">Lipid Panel</div>
                <div className="text-xs text-gray-600">Apr 15, 2024</div>
              </div>
              <div className="flex items-center text-xs text-amber-600">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                Elevated
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-white/70 rounded-lg shadow-sm">
              <div>
                <div className="text-sm font-medium text-gray-800">Kidney Function</div>
                <div className="text-xs text-gray-600">Apr 01, 2024</div>
              </div>
              <div className="flex items-center text-xs text-emerald-600">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Normal
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Upcoming Appointments Section - Takes up 3/7 */}
        <div className="card p-4 shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition-all lg:col-span-3 bg-white animate-slideIn">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
              Upcoming Appointments
            </h2>
            <Link to="/appointments" className="text-primary hover:text-primary/80 text-sm flex items-center transition-colors hover-scale">
              View All <ArrowRightIcon className="h-4 w-4 ml-1 animate-pulse" />
            </Link>
          </div>
          
          <div className="divide-y divide-gray-100">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment, index) => (
                <div 
                  key={appointment.id} 
                  className="py-3 transition-all duration-300 hover:bg-gray-50 rounded-lg p-2 animate-slideIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary shadow-sm">
                      <img 
                        src={appointment.image} 
                        alt={appointment.doctorName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{appointment.doctorName}</p>
                          <p className="text-xs text-gray-500">{appointment.specialty}</p>
                        </div>
                        {renderAppointmentStatus(appointment.status)}
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <div className="flex items-center mr-3">
                          <CalendarIcon className="h-3 w-3 text-primary mr-1" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-3 w-3 text-primary mr-1" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-2">
                    <button 
                      className="px-2 py-1 text-xs text-white bg-primary rounded-md hover:bg-primary/90 transition-colors hover-lift"
                      onClick={() => navigate('/appointments')}
                    >
                      Reschedule
                    </button>
                    <button 
                      className="px-2 py-1 text-xs text-primary bg-blue-50 rounded-md hover:bg-blue-100 transition-colors hover-lift"
                      onClick={() => alert(`Appointment details for ${appointment.doctorName}`)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-primary mb-3">
                  <CalendarIcon className="h-8 w-8" />
                </div>
                <p className="text-gray-500">No upcoming appointments</p>
                <button 
                  className="mt-2 text-sm text-primary hover:text-primary/80 btn-outline-sm"
                  onClick={() => navigate('/appointments')}
                >
                  Schedule one now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Health Charts - Takes up 4/7 */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-4 shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition-all bg-white animate-slideIn" style={{ animationDelay: "100ms" }}>
            <h2 className="text-md font-bold text-gray-900 mb-2 flex items-center">
              <HeartIcon className="h-5 w-5 mr-2 text-primary" />
              Health Metrics
            </h2>
            <div className="h-48 mt-4">
              <Line options={healthDataOptions} data={healthData} />
            </div>
          </div>
          
          <div className="card p-4 shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition-all bg-white animate-slideIn" style={{ animationDelay: "200ms" }}>
            <h2 className="text-md font-bold text-gray-900 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Medication Adherence
            </h2>
            <div className="h-48 mt-4">
              <Bar options={medicationOptions} data={medicationData} />
            </div>
          </div>
          
          <div className="card p-4 shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition-all bg-white animate-slideIn" style={{ animationDelay: "300ms" }}>
            <h2 className="text-md font-bold text-gray-900 mb-2 flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-primary" />
              Hospital Resources
            </h2>
            <div className="h-48 mt-4 flex justify-center">
              <div className="w-48">
                <Doughnut options={hospitalStatsOptions} data={hospitalStatsData} />
              </div>
            </div>
          </div>
          
          <div className="card p-4 shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition-all bg-white animate-slideIn" style={{ animationDelay: "400ms" }}>
            <h2 className="text-md font-bold text-gray-900 mb-2 flex items-center">
              <ClockIcon className="h-5 w-5 mr-2 text-primary" />
              Medication Schedule
            </h2>
            <div className="space-y-3 mt-3">
              {medications.map((med, index) => (
                <div key={med.id} className="flex justify-between items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                  <div>
                    <span className="font-medium text-sm">{med.name}</span>
                    <div className="text-xs text-gray-500 mt-0.5">{med.dosage} - {med.frequency}</div>
                  </div>
                  <button 
                    className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors hover-lift"
                    onClick={() => takeMedication(med.id)}
                  >
                    Take Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activities */}
      <div className="card p-4 shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition-all bg-white animate-slideIn" style={{ animationDelay: "500ms" }}>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Activities
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentActivities.map((activity, index) => (
            <div 
              key={activity.id}
              className="flex items-start p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer hover-lift animate-slideIn"
              style={{ animationDelay: `${index * 100 + 100}ms` }}
              onClick={activity.action}
            >
              <div className={`p-2 rounded-full mr-3 flex-shrink-0 
                ${activity.type === 'appointment' ? 'bg-blue-100 text-blue-600' : 
                activity.type === 'medication' ? 'bg-green-100 text-green-600' : 
                activity.type === 'hospital' ? 'bg-purple-100 text-purple-600' :
                activity.type === 'telemedicine' ? 'bg-amber-100 text-amber-600' :
                'bg-indigo-100 text-indigo-600'}`}
              >
                {activity.type === 'appointment' && (
                  <CalendarIcon className="h-5 w-5" />
                )}
                {activity.type === 'medication' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )}
                {activity.type === 'report' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                {activity.type === 'hospital' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
                {activity.type === 'telemedicine' && (
                  <VideoCameraIcon className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                  <span className="text-xs text-gray-500 ml-2">{activity.date}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Health Tips Card */}
      <div className="card p-4 shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition-all bg-gradient-to-r from-indigo-50 to-purple-50 animate-slideIn" style={{ animationDelay: "600ms" }}>
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
          <HeartIconSolid className="h-5 w-5 mr-2 text-red-500" />
          Health Tips & Reminders
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 p-3 rounded-lg shadow-sm hover-lift">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Stay Hydrated</h3>
            <p className="text-xs text-gray-600">Remember to drink at least 8 glasses of water daily for optimal health.</p>
          </div>
          
          <div className="bg-white/80 p-3 rounded-lg shadow-sm hover-lift">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Regular Exercise</h3>
            <p className="text-xs text-gray-600">Aim for at least 30 minutes of moderate exercise 5 days a week.</p>
          </div>
          
          <div className="bg-white/80 p-3 rounded-lg shadow-sm hover-lift">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Upcoming Checkup</h3>
            <p className="text-xs text-gray-600">Your annual physical exam is due in 2 weeks. Schedule it soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 