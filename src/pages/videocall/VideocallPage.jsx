import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserIcon, VideoCameraIcon, MicrophoneIcon, PhoneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const VideocallPage = () => {
  const { user } = useAuth();
  const [isCallActive, setIsCallActive] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimer, setCallTimer] = useState(null);
  
  // Fetch available doctors (mock data)
  useEffect(() => {
    // In a real app, this would be an API call
    setAvailableDoctors([
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        image: 'https://randomuser.me/api/portraits/women/76.jpg',
        isAvailable: true,
        waitTime: '5 minutes',
      },
      {
        id: 2,
        name: 'Dr. Michael Chen',
        specialty: 'Dermatology',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        isAvailable: true,
        waitTime: '10 minutes',
      },
      {
        id: 3,
        name: 'Dr. Emily Rodriguez',
        specialty: 'Pediatrics',
        image: 'https://randomuser.me/api/portraits/women/43.jpg',
        isAvailable: false,
        waitTime: 'Offline',
      },
      {
        id: 4,
        name: 'Dr. James Wilson',
        specialty: 'Orthopedics',
        image: 'https://randomuser.me/api/portraits/men/45.jpg',
        isAvailable: true,
        waitTime: '15 minutes',
      },
    ]);

    // Fetch upcoming video appointments
    setUpcomingAppointments([
      {
        id: 101,
        doctorName: 'Dr. Sarah Johnson',
        doctorSpecialty: 'Cardiology',
        doctorImage: 'https://randomuser.me/api/portraits/women/76.jpg',
        date: '2024-05-15',
        time: '10:30 AM',
      },
    ]);
  }, []);

  const handleStartCall = (doctor) => {
    setIsLoading(true);
    setSelectedDoctor(doctor);
    
    // Simulate connection delay
    setTimeout(() => {
      setIsLoading(false);
      setIsCallActive(true);
      
      // Start call timer
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      setCallTimer(timer);
    }, 2000);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setSelectedDoctor(null);
    
    // Clear timer
    if (callTimer) {
      clearInterval(callTimer);
      setCallTimer(null);
    }
    
    setCallDuration(0);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (callTimer) {
        clearInterval(callTimer);
      }
    };
  }, [callTimer]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Consultation</h1>
          <p className="text-gray-600">Connect with healthcare professionals via video call</p>
        </div>
      </div>
      
      {isLoading && (
        <div className="card p-10 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-gray-900">Connecting to {selectedDoctor.name}...</p>
          <p className="text-gray-600">Please wait while we establish a secure connection</p>
        </div>
      )}
      
      {isCallActive && !isLoading && (
        <div className="card p-4 lg:p-0 bg-gray-900 overflow-hidden">
          <div className="relative h-[500px] flex flex-col">
            {/* Main video (doctor) */}
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <img 
                src={selectedDoctor.image} 
                alt={selectedDoctor.name} 
                className="w-full h-full object-cover opacity-20 scale-150 blur-sm"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src={selectedDoctor.image} 
                  alt={selectedDoctor.name} 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover"
                />
              </div>
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 py-1 px-3 rounded-full flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                <span className="text-white text-sm">Live</span>
              </div>
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 py-1 px-3 rounded-full">
                <span className="text-white text-sm">{formatDuration(callDuration)}</span>
              </div>
            </div>
            
            {/* Self video (user) */}
            <div className="absolute bottom-4 right-4 w-[120px] h-[90px] md:w-[160px] md:h-[120px] bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
              {isVideoOn ? (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-gray-400" />
                </div>
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <VideoCameraIcon className="h-8 w-8 text-red-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-0.5 h-12 bg-red-500 transform rotate-45"></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Call controls */}
            <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black to-transparent flex items-center justify-center">
              <div className="flex space-x-4">
                <button 
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-3 rounded-full ${isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
                >
                  <VideoCameraIcon className="h-6 w-6 text-white" />
                </button>
                <button 
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-3 rounded-full ${isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
                >
                  <MicrophoneIcon className="h-6 w-6 text-white" />
                </button>
                <button 
                  onClick={handleEndCall}
                  className="p-3 rounded-full bg-red-600 hover:bg-red-700"
                >
                  <PhoneIcon className="h-6 w-6 text-white" />
                </button>
                <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>
            
            {/* Doctor info */}
            <div className="absolute top-16 left-4 bg-black bg-opacity-50 p-3 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img 
                    src={selectedDoctor.image} 
                    alt={selectedDoctor.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">{selectedDoctor.name}</p>
                  <p className="text-gray-300 text-sm">{selectedDoctor.specialty}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!isCallActive && !isLoading && (
        <>
          {/* Available doctors for immediate consultation */}
          <div className="card p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available for Consultation Now</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableDoctors.filter(doctor => doctor.isAvailable).map((doctor) => (
                <div key={doctor.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={doctor.image} 
                        alt={doctor.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">Wait time: {doctor.waitTime}</span>
                    <button
                      onClick={() => handleStartCall(doctor)}
                      className="flex items-center text-sm bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary/90"
                    >
                      <VideoCameraIcon className="h-4 w-4 mr-1" />
                      Start Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {availableDoctors.filter(doctor => doctor.isAvailable).length === 0 && (
              <div className="p-6 text-center text-gray-500 border border-gray-200 rounded-lg">
                No doctors are available for immediate consultation at this time.
              </div>
            )}
          </div>
          
          {/* Scheduled video appointments */}
          <div className="card p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Video Appointments</h2>
            
            {upcomingAppointments.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-start">
                      <img 
                        src={appointment.doctorImage} 
                        alt={appointment.doctorName} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">{appointment.doctorName}</p>
                        <p className="text-sm text-gray-600">{appointment.doctorSpecialty}</p>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <span>
                            {new Date(appointment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="mx-1">•</span>
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex">
                      <button className="flex items-center text-sm bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary/90">
                        <VideoCameraIcon className="h-4 w-4 mr-1" />
                        Join Call
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 border border-gray-200 rounded-lg">
                You don't have any upcoming video appointments.
              </div>
            )}
          </div>
          
          {/* How it works */}
          <div className="card p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">How Video Consultation Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Select a Doctor</h3>
                <p className="text-sm text-gray-600">Choose from our available healthcare professionals for immediate consultation or schedule for later.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Prepare for Call</h3>
                <p className="text-sm text-gray-600">Make sure you have a stable internet connection, and your camera and microphone are working properly.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Consult with Doctor</h3>
                <p className="text-sm text-gray-600">Discuss your health concerns, get advice, prescriptions, and follow-up plans as needed.</p>
              </div>
            </div>
          </div>
          
          {/* System requirements */}
          <div className="card p-4">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">System Requirements</h2>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <ul className="text-sm text-gray-800 space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>A computer or mobile device with a camera and microphone</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Stable internet connection (minimum 1 Mbps upload/download)</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Updated browser (Chrome, Firefox, Safari, or Edge)</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>A quiet, well-lit private space for your consultation</span>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideocallPage; 