import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// Mock Google Maps component since we can't actually load the API
const GoogleMap = ({ location, ambulanceLocation }) => {
  return (
    <div className="relative w-full h-64 md:h-96 bg-blue-50 rounded-lg overflow-hidden border border-gray-200 animate-fadeIn">
      <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-gray-600 mb-2">Google Maps would display here</p>
          <p className="text-sm font-medium text-gray-700">Your location: {location || "Not detected"}</p>
          {ambulanceLocation && (
            <p className="text-sm font-medium text-gray-700 mt-2">Ambulance location: {ambulanceLocation}</p>
          )}
          <div className="mt-4 relative w-full max-w-md h-48 bg-white rounded shadow-inner overflow-hidden mx-auto">
            <div className="absolute top-0 left-0 w-full h-full bg-gray-100 opacity-50">
              <div className="w-full h-full" style={{ background: 'url(https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=13&size=600x300&maptype=roadmap)' }}></div>
            </div>
            
            {/* User pin */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping absolute"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full relative"></div>
            </div>
            
            {/* Ambulance pin */}
            {ambulanceLocation && (
              <div className="absolute left-1/4 top-1/3">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                <div className="text-xs text-red-700 font-bold mt-1">Ambulance</div>
              </div>
            )}
            
            {/* Route path */}
            {ambulanceLocation && (
              <div className="absolute left-1/4 top-1/3 w-32 h-1 bg-red-400 transform rotate-45 origin-left"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AmbulancePage = () => {
  const { user } = useAuth();
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [ambulanceLocation, setAmbulanceLocation] = useState(null);
  const [trackingStarted, setTrackingStarted] = useState(false);
  const [estimatedArrival, setEstimatedArrival] = useState(null);
  const [formData, setFormData] = useState({
    patientName: user?.name || '',
    contactNumber: '',
    alternateContactNumber: '',
    address: '',
    landmark: '',
    emergencyType: '',
    additionalInfo: '',
  });
  const [errors, setErrors] = useState({});

  const emergencyTypes = [
    { value: 'medical', label: 'Medical Emergency' },
    { value: 'accident', label: 'Accident/Trauma' },
    { value: 'cardiac', label: 'Cardiac Emergency' },
    { value: 'respiratory', label: 'Respiratory Distress' },
    { value: 'obstetric', label: 'Obstetric Emergency' },
    { value: 'burn', label: 'Burn Injury' },
    { value: 'other', label: 'Other' },
  ];

  // Simulate ambulance movement when tracking is active
  useEffect(() => {
    let interval;
    
    if (trackingStarted && requestData) {
      // Initial ambulance location (simulated)
      setAmbulanceLocation("23.725, 90.426"); // Some distance from user
      
      // Update ETA
      setEstimatedArrival(requestData.estimatedArrival);
      
      // Simulate ambulance movement
      let movementSteps = 0;
      interval = setInterval(() => {
        movementSteps++;
        
        // Get closer to destination with each step
        if (movementSteps <= 5) {
          // Update ambulance location
          setAmbulanceLocation(`23.${725 + movementSteps * 2}, 90.${426 - movementSteps}`);
          
          // Update ETA
          const minutesLeft = 10 - movementSteps * 2;
          setEstimatedArrival(`${minutesLeft} minutes`);
        } else {
          // Ambulance has arrived
          setEstimatedArrival("Arrived");
          clearInterval(interval);
        }
      }, 20000); // Update every 20 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [trackingStarted, requestData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleGetLocation = () => {
    setUseCurrentLocation(true);
    
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
          
          // In a real app, we'd use a geocoding service like Google Maps API
          // For now we'll simulate the reverse geocoding with a slight delay
          setIsLoading(false);
          
          // Call a reverse geocoding API (simulated)
          fetchAddressFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
          setUseCurrentLocation(false);
          alert('Unable to retrieve your location. Please enter your address manually.');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      alert('Geolocation is not supported by your browser. Please enter your address manually.');
      setUseCurrentLocation(false);
    }
  };

  // Simulate reverse geocoding
  const fetchAddressFromCoordinates = (latitude, longitude) => {
    // In a real app, this would call a geocoding API like Google Maps
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock response from geocoding API
      const mockAddress = {
        street: "123 Medical Plaza",
        city: "Cityville",
        state: "State",
        zipCode: "12345",
        landmark: "Near City Hospital"
      };
      
      setFormData(prev => ({
        ...prev,
        address: `${mockAddress.street}, ${mockAddress.city}, ${mockAddress.state} ${mockAddress.zipCode}`,
        landmark: mockAddress.landmark
      }));
      
      setIsLoading(false);
    }, 1000);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    }
    
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber.replace(/[^0-9]/g, ''))) {
      newErrors.contactNumber = 'Please enter a valid 10-digit contact number';
    }
    
    if (!useCurrentLocation && !formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.emergencyType) {
      newErrors.emergencyType = 'Please select emergency type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call to request ambulance
    setTimeout(() => {
      const mockResponse = {
        requestId: `AMB-${Math.floor(Math.random() * 1000000)}`,
        status: 'Dispatched',
        estimatedArrival: '8-10 minutes',
        ambulanceType: 'Advanced Life Support (ALS)',
        dispatchTime: new Date().toLocaleTimeString(),
        driver: {
          name: 'John Davis',
          contactNumber: '555-1234',
        },
      };
      
      setRequestData(mockResponse);
      setIsRequestSent(true);
      setTrackingStarted(true);
      setIsLoading(false);
    }, 2000);
  };
  
  const handleEmergencyCall = () => {
    // Use tel: protocol to initiate a phone call
    const emergencyNumber = "8420891899";
    
    // Show confirmation dialog
    if (confirm("Do you want to call emergency services at " + emergencyNumber + "?")) {
      // Create an anchor element with tel: protocol
      const link = document.createElement('a');
      link.href = `tel:${emergencyNumber}`;
      link.click();
    }
  };

  const handleNewRequest = () => {
    setIsRequestSent(false);
    setRequestData(null);
    setLocation('');
    setUseCurrentLocation(false);
    setTrackingStarted(false);
    setAmbulanceLocation(null);
    setEstimatedArrival(null);
    setFormData({
      patientName: user?.name || '',
      contactNumber: '',
      alternateContactNumber: '',
      address: '',
      landmark: '',
      emergencyType: '',
      additionalInfo: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">One-Click Ambulance</h1>
          <p className="text-gray-600">Request emergency medical transportation</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button 
            onClick={handleEmergencyCall}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all hover:scale-105 animate-pulse"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Emergency Call
          </button>
        </div>
      </div>
      
      {isRequestSent ? (
        <div className="card p-6 animate-fadeIn">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ambulance Request Confirmed!</h2>
            <p className="text-gray-600 mb-2">Your ambulance is on the way. Please stay at your location.</p>
            <p className="text-gray-600 mb-4">Request ID: <span className="font-medium">{requestData.requestId}</span></p>
          </div>
          
          {/* Map container */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Track Your Ambulance</h3>
            <GoogleMap location={location} ambulanceLocation={ambulanceLocation} />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 animate-slideIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="font-medium text-gray-900">{requestData.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Estimated Arrival</p>
                <p className="font-medium text-gray-900">{estimatedArrival || requestData.estimatedArrival}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ambulance Type</p>
                <p className="font-medium text-gray-900">{requestData.ambulanceType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Dispatch Time</p>
                <p className="font-medium text-gray-900">{requestData.dispatchTime}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Driver Name</p>
                <p className="font-medium text-gray-900">{requestData.driver.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Driver Contact</p>
                <p className="font-medium text-gray-900 flex items-center">
                  {requestData.driver.contactNumber}
                  <button 
                    className="ml-2 p-1 bg-primary rounded-full text-white hover:bg-primary/90 transition-colors"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = `tel:${requestData.driver.contactNumber}`;
                      link.click();
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <button 
              onClick={handleNewRequest}
              className="btn-primary transition-transform hover:scale-105"
            >
              New Request
            </button>
          </div>
        </div>
      ) : (
        <div className="card p-4 animate-fadeIn">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 animate-slideIn">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Important:</strong> In a life-threatening emergency, please call <strong>911</strong> or your local emergency number immediately.
                  </p>
                </div>
              </div>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-900">Patient Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
                  Patient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  className={`mt-1 input-field ${errors.patientName ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.patientName}
                  onChange={handleInputChange}
                />
                {errors.patientName && (
                  <p className="mt-1 text-sm text-red-600">{errors.patientName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  className={`mt-1 input-field ${errors.contactNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="10-digit number"
                />
                {errors.contactNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="alternateContactNumber" className="block text-sm font-medium text-gray-700">
                  Alternate Contact Number
                </label>
                <input
                  type="tel"
                  id="alternateContactNumber"
                  name="alternateContactNumber"
                  className="mt-1 input-field"
                  value={formData.alternateContactNumber}
                  onChange={handleInputChange}
                  placeholder="Optional"
                />
              </div>
              
              <div>
                <label htmlFor="emergencyType" className="block text-sm font-medium text-gray-700">
                  Emergency Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="emergencyType"
                  name="emergencyType"
                  className={`mt-1 input-field ${errors.emergencyType ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.emergencyType}
                  onChange={handleInputChange}
                >
                  <option value="">Select emergency type</option>
                  {emergencyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.emergencyType && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyType}</p>
                )}
              </div>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-900">Location Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <div className="flex items-center mb-2">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="inline-flex items-center px-3 py-2 border border-primary rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:bg-primary hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Use My Current Location
                  </button>
                  
                  {isLoading && (
                    <div className="ml-3 text-sm text-gray-500 flex items-center">
                      <svg className="animate-spin h-4 w-4 mr-2 text-primary" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Getting your location...
                    </div>
                  )}
                </div>
                
                {location && (
                  <div className="bg-blue-50 p-2 rounded-md text-blue-800 text-sm mb-2 animate-fadeIn">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Coordinates: {location}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={2}
                  className={`mt-1 input-field ${errors.address ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Full address including street, city, state and zip"
                ></textarea>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">
                  Landmark
                </label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  className="mt-1 input-field"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  placeholder="Nearby landmarks to help locate the address"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
                Additional Information
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                rows={3}
                className="mt-1 input-field"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Any additional details that may help emergency responders"
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center transition-transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Request Ambulance
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AmbulancePage; 