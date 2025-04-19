import { useState, useEffect, useMemo } from 'react';
import { StarIcon, MagnifyingGlassIcon, FunnelIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { MapPinIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

// Generate 100+ demo doctors
const generateDoctors = () => {
  const specialties = [
    'Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician',
    'Orthopedic Surgeon', 'Psychiatrist', 'Gynecologist', 'Ophthalmologist',
    'Endocrinologist', 'Gastroenterologist', 'Oncologist', 'Urologist',
    'Pulmonologist', 'Rheumatologist', 'Nephrologist', 'Allergist'
  ];
  
  const firstNames = [
    'John', 'Sarah', 'Michael', 'Emma', 'James', 'Olivia', 'William', 'Ava',
    'David', 'Sophia', 'Robert', 'Isabella', 'Joseph', 'Mia', 'Thomas', 'Charlotte',
    'Daniel', 'Amelia', 'Paul', 'Emily', 'Mark', 'Abigail', 'Donald', 'Elizabeth',
    'George', 'Sofia', 'Kenneth', 'Avery', 'Steven', 'Ella', 'Edward', 'Scarlett',
    'Jason', 'Grace', 'Jeffrey', 'Chloe', 'Ryan', 'Victoria', 'Jacob', 'Madison',
    'Gary', 'Lily', 'Nicholas', 'Zoe', 'Eric', 'Hannah', 'Jonathan', 'Layla',
    'Stephen', 'Brooklyn', 'Larry', 'Leah', 'Justin', 'Aubrey', 'Scott', 'Natalie'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson',
    'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
    'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee',
    'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez',
    'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter',
    'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans',
    'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook'
  ];
  
  const locations = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
    'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
    'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL',
    'Fort Worth, TX', 'Columbus, OH', 'San Francisco, CA', 'Charlotte, NC',
    'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Boston, MA'
  ];
  
  const generateAvailability = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const availableDays = [];
    
    // Randomly select 3-5 days
    const numDays = Math.floor(Math.random() * 3) + 3;
    const shuffledDays = [...days].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < numDays; i++) {
      const startHour = Math.floor(Math.random() * 4) + 8; // 8 AM to 11 AM
      const endHour = Math.floor(Math.random() * 8) + 13; // 1 PM to 8 PM
      
      availableDays.push({
        day: shuffledDays[i],
        slots: `${startHour}:00 AM - ${endHour - 12}:00 PM`
      });
    }
    
    return availableDays;
  };
  
  const doctors = [];
  
  for (let i = 1; i <= 120; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const specialty = specialties[Math.floor(Math.random() * specialties.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const experience = Math.floor(Math.random() * 30) + 1; // 1-30 years
    const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0-5.0 rating
    const reviews = Math.floor(Math.random() * 500) + 10; // 10-510 reviews
    const fee = Math.floor(Math.random() * 150) + 50; // $50-$200
    const availability = generateAvailability();
    const isAvailableToday = Math.random() > 0.3; // 70% chance of being available today
    
    doctors.push({
      id: i,
      name: `Dr. ${firstName} ${lastName}`,
      specialty,
      location,
      experience,
      rating: parseFloat(rating),
      reviews,
      fee,
      availability,
      isAvailableToday,
      image: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${(i % 70) + 1}.jpg`,
      education: 'MD - General Medicine, MBBS',
      languages: ['English', Math.random() > 0.5 ? 'Spanish' : 'French'],
      acceptingNewPatients: Math.random() > 0.2 // 80% chance of accepting new patients
    });
  }
  
  return doctors;
};

const DoctorPage = () => {
  const allDoctors = useMemo(() => generateDoctors(), []);
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialty: '',
    availableToday: false,
    rating: 0,
    acceptingNew: false
  });
  const [sortBy, setSortBy] = useState('rating'); // rating, experience, fee
  const [isLoading, setIsLoading] = useState(true);
  
  const doctorsPerPage = 12;
  const specialties = [...new Set(allDoctors.map(doctor => doctor.specialty))].sort();
  
  // Apply filters and sorting
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      let filteredDoctors = [...allDoctors];
      
      // Apply search
      if (searchTerm) {
        const lowercasedSearch = searchTerm.toLowerCase();
        filteredDoctors = filteredDoctors.filter(doctor => 
          doctor.name.toLowerCase().includes(lowercasedSearch) || 
          doctor.specialty.toLowerCase().includes(lowercasedSearch) ||
          doctor.location.toLowerCase().includes(lowercasedSearch)
        );
      }
      
      // Apply filters
      if (filters.specialty) {
        filteredDoctors = filteredDoctors.filter(doctor => 
          doctor.specialty === filters.specialty
        );
      }
      
      if (filters.availableToday) {
        filteredDoctors = filteredDoctors.filter(doctor => 
          doctor.isAvailableToday
        );
      }
      
      if (filters.rating > 0) {
        filteredDoctors = filteredDoctors.filter(doctor => 
          doctor.rating >= filters.rating
        );
      }
      
      if (filters.acceptingNew) {
        filteredDoctors = filteredDoctors.filter(doctor => 
          doctor.acceptingNewPatients
        );
      }
      
      // Apply sorting
      switch(sortBy) {
        case 'rating':
          filteredDoctors.sort((a, b) => b.rating - a.rating);
          break;
        case 'experience':
          filteredDoctors.sort((a, b) => b.experience - a.experience);
          break;
        case 'fee':
          filteredDoctors.sort((a, b) => a.fee - b.fee);
          break;
        default:
          break;
      }
      
      setDoctors(filteredDoctors);
      setCurrentPage(1);
      setIsLoading(false);
    }, 300); // Small delay for loading state
  }, [allDoctors, searchTerm, filters, sortBy]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  const resetFilters = () => {
    setFilters({
      specialty: '',
      availableToday: false,
      rating: 0,
      acceptingNew: false
    });
    setSearchTerm('');
  };
  
  // Get current doctors for pagination
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);
  
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div className="min-h-full bg-gray-50 py-4 px-2 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Doctors</h1>
          <p className="text-gray-600">Connect with experienced specialists near you</p>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600"
                placeholder="Search by name, specialty, or location"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            {/* Specialty Filter */}
            <div>
              <select 
                className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600"
                value={filters.specialty}
                onChange={(e) => handleFilterChange('specialty', e.target.value)}
              >
                <option value="">All Specialties</option>
                {specialties.map((specialty, index) => (
                  <option key={index} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
            
            {/* Sort */}
            <div>
              <select
                className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="rating">Sort by: Highest Rated</option>
                <option value="experience">Sort by: Most Experienced</option>
                <option value="fee">Sort by: Lowest Fee</option>
              </select>
            </div>
          </div>
          
          {/* Extra Filters */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <input
                id="availableToday"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                checked={filters.availableToday}
                onChange={(e) => handleFilterChange('availableToday', e.target.checked)}
              />
              <label htmlFor="availableToday" className="text-sm text-gray-700">
                Available Today
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="acceptingNew"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                checked={filters.acceptingNew}
                onChange={(e) => handleFilterChange('acceptingNew', e.target.checked)}
              />
              <label htmlFor="acceptingNew" className="text-sm text-gray-700">
                Accepting New Patients
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 min-w-[70px]">Min Rating:</span>
              <select
                className="block w-32 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600"
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
              >
                <option value="0">Any</option>
                <option value="4.5">4.5+</option>
                <option value="4">4.0+</option>
                <option value="3.5">3.5+</option>
                <option value="3">3.0+</option>
              </select>
              
              <button
                onClick={resetFilters}
                className="ml-auto text-sm text-teal-600 hover:text-teal-800"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center items-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing {doctors.length ? indexOfFirstDoctor + 1 : 0}-{Math.min(indexOfLastDoctor, doctors.length)} of {doctors.length} doctors
              </p>
            </div>
            
            {/* Doctor Cards */}
            {doctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentDoctors.map(doctor => (
                  <div key={doctor.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="flex flex-col h-full">
                      {/* Doctor Info */}
                      <div className="p-5">
                        <div className="flex items-start">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="h-16 w-16 rounded-full object-cover mr-4 border-2 border-teal-100"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                            <p className="text-gray-600 text-sm">{doctor.specialty}</p>
                            <div className="flex items-center mt-1">
                              <div className="flex items-center">
                                <StarIcon className="h-4 w-4 text-yellow-400" />
                                <span className="ml-1 text-sm font-medium text-gray-900">{doctor.rating}</span>
                              </div>
                              <span className="mx-1 text-gray-500 text-xs">•</span>
                              <span className="text-gray-500 text-xs">{doctor.reviews} reviews</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPinIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                            <span>{doctor.location}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <CalendarIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                            <span>{doctor.experience} years experience</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <ClockIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                            <span className={doctor.isAvailableToday ? 'text-green-600 font-medium' : 'text-gray-500'}>
                              {doctor.isAvailableToday ? 'Available Today' : 'Next Available: Tomorrow'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          {doctor.availability.slice(0, 3).map((slot, idx) => (
                            <span key={idx} className="inline-flex items-center rounded-full bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700">
                              {slot.day}
                            </span>
                          ))}
                          {doctor.availability.length > 3 && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                              +{doctor.availability.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Doctor Actions */}
                      <div className="mt-auto border-t border-gray-100 p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-gray-500">Consultation Fee</span>
                            <p className="text-lg font-semibold text-gray-900">${doctor.fee}</p>
                          </div>
                          <button className="inline-flex justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow p-8 text-center my-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
                  <FunnelIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">No doctors found</h3>
                <p className="mt-2 text-gray-500">
                  We couldn't find any doctors matching your criteria. Try adjusting your filters.
                </p>
                <div className="mt-4">
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-teal-600 shadow-sm border border-teal-600 hover:bg-teal-50"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
            
            {/* Pagination */}
            {doctors.length > 0 && (
              <div className="flex items-center justify-between mt-8 mb-4">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeftIcon className="h-5 w-5 mr-1" />
                  Previous
                </button>
                
                <div className="hidden md:flex">
                  {[...Array(totalPages).keys()].map(number => {
                    // Show 5 pages at most
                    if (
                      number + 1 === 1 ||
                      number + 1 === totalPages ||
                      (number + 1 >= currentPage - 1 && number + 1 <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={number}
                          onClick={() => paginate(number + 1)}
                          className={`mx-1 inline-flex items-center justify-center rounded-md w-8 h-8 text-sm font-medium ${
                            currentPage === number + 1
                              ? 'bg-teal-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {number + 1}
                        </button>
                      );
                    } else if (
                      (number + 1 === currentPage - 2 && currentPage > 3) ||
                      (number + 1 === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span key={number} className="mx-1 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                
                <div className="md:hidden">
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Next
                  <ChevronRightIcon className="h-5 w-5 ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorPage; 