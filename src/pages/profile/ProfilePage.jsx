import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import userApi from '../../api/userApi';
import { 
  UserIcon, 
  KeyIcon, 
  BellIcon, 
  HeartIcon, 
  ShieldCheckIcon, 
  ClockIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  CameraIcon
} from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profilePic || null);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const fileInputRef = useRef(null);
  
  // Form state with default values
  const [formData, setFormData] = useState({
    name: user?.name || 'Guest User',
    email: user?.email || 'guest@example.com',
    phone: '',
    dob: '',
    gender: 'Male',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    bloodType: 'O+',
    allergies: '',
    chronicConditions: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phoneNumber: ''
    },
    preferredLanguage: 'English',
    insuranceProvider: '',
    insuranceNumber: ''
  });
  
  // Fetch user data from MongoDB when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.id) return;
      
      setIsLoading(true);
      try {
        const userData = await userApi.getUserById(user.id);
        
        if (userData) {
          // Set profile image if available from Cloudinary
          if (userData.profileImage && userData.profileImage.url) {
            setProfileImage(userData.profileImage.url);
          }
          
          // Update form data with fetched user data
          setFormData({
            name: userData.personalInfo?.firstName && userData.personalInfo?.lastName
              ? `${userData.personalInfo.firstName} ${userData.personalInfo.lastName}`
              : user?.name || 'Guest User',
            email: userData.email || user?.email || 'guest@example.com',
            phone: userData.personalInfo?.phoneNumber || '',
            dob: userData.personalInfo?.dateOfBirth ? new Date(userData.personalInfo.dateOfBirth).toISOString().split('T')[0] : '',
            gender: userData.personalInfo?.gender || 'Male',
            address: userData.personalInfo?.address || {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: ''
            },
            bloodType: userData.medicalInfo?.bloodType || 'O+',
            allergies: userData.medicalInfo?.allergies ? userData.medicalInfo.allergies.join(', ') : '',
            chronicConditions: userData.medicalInfo?.chronicConditions ? userData.medicalInfo.chronicConditions.join(', ') : '',
            emergencyContact: userData.personalInfo?.emergencyContact || {
              name: '',
              relationship: '',
              phoneNumber: ''
            },
            preferredLanguage: userData.personalInfo?.preferredLanguage || 'English',
            insuranceProvider: userData.medicalInfo?.insuranceProvider || '',
            insuranceNumber: userData.medicalInfo?.insuranceNumber || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      console.log('No file selected');
      return;
    }
    
    console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size);
    
    // Validate file type
    if (!file.type.match('image.*')) {
      console.log('Invalid file type:', file.type);
      setImageError('Please select an image file (PNG, JPG, JPEG)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('File too large:', file.size);
      setImageError('Image size should be less than 5MB');
      return;
    }
    
    setImageError('');
    setImageFile(file);
    setSaveSuccess('');
    setSaveError('');
    
    // Create a preview immediately for better UX
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Automatically upload the image to Cloudinary
    if (user && user.id) {
      try {
        // Show loading state
        setIsLoading(true);
        console.log('Starting image upload for user:', user.id);
        
        // Upload the image to Cloudinary via our API
        const updatedUser = await userApi.uploadProfileImage(user.id, file);
        
        // Update profile image with the Cloudinary URL
        if (updatedUser && updatedUser.profileImage && updatedUser.profileImage.url) {
          console.log('Image uploaded successfully:', updatedUser.profileImage.url);
          
          // Update the profile image with the Cloudinary URL
          setProfileImage(updatedUser.profileImage.url);
          
          // Show success message
          setSaveSuccess('Profile image updated successfully!');
          
          // Auto-hide success message after 3 seconds
          setTimeout(() => {
            setSaveSuccess('');
          }, 3000);
        } else {
          console.error('Upload response missing image URL:', updatedUser);
          setImageError('Server response incomplete. Please try again.');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setImageError('Failed to upload image. Please try again.');
        
        // Revert to previous image if upload fails
        if (user.profileImage) {
          setProfileImage(user.profileImage);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error('User not authenticated');
      setImageError('You must be logged in to upload an image.');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess('');
    
    if (!user || !user.id) {
      setSaveError('User not authenticated. Please log in again.');
      return;
    }
    
    try {
      // Parse name into first and last name
      const nameParts = formData.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Parse allergies and chronic conditions into arrays
      const allergiesArray = formData.allergies
        ? formData.allergies.split(',').map(item => item.trim())
        : [];
      
      const chronicConditionsArray = formData.chronicConditions
        ? formData.chronicConditions.split(',').map(item => item.trim())
        : [];
      
      // Prepare user data for MongoDB
      const userData = {
        supabaseId: user.id,
        email: user.email,
        personalInfo: {
          firstName,
          lastName,
          phoneNumber: formData.phone,
          dateOfBirth: formData.dob ? new Date(formData.dob) : null,
          gender: formData.gender,
          address: formData.address,
          emergencyContact: formData.emergencyContact,
          preferredLanguage: formData.preferredLanguage
        },
        medicalInfo: {
          bloodType: formData.bloodType,
          allergies: allergiesArray,
          chronicConditions: chronicConditionsArray,
          insuranceProvider: formData.insuranceProvider,
          insuranceNumber: formData.insuranceNumber
        }
      };
      
      // Save user data to MongoDB
      await userApi.createOrUpdateUser(userData);
      
      // Profile image is now uploaded automatically when selected
      // No need to handle it here anymore
      
      setSaveSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveError('Failed to update profile. Please try again.');
    }
  };
  
  const cancelEdit = async () => {
    setSaveError('');
    setSaveSuccess('');
    
    // Fetch the latest user data from the server
    if (user && user.id) {
      try {
        const userData = await userApi.getUserById(user.id);
        
        if (userData) {
          // Reset form data to server values
          setFormData({
            name: userData.personalInfo?.firstName && userData.personalInfo?.lastName
              ? `${userData.personalInfo.firstName} ${userData.personalInfo.lastName}`
              : user?.name || 'Guest User',
            email: userData.email || user?.email || 'guest@example.com',
            phone: userData.personalInfo?.phoneNumber || '',
            dob: userData.personalInfo?.dateOfBirth ? new Date(userData.personalInfo.dateOfBirth).toISOString().split('T')[0] : '',
            gender: userData.personalInfo?.gender || 'Male',
            address: userData.personalInfo?.address || {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: ''
            },
            bloodType: userData.medicalInfo?.bloodType || 'O+',
            allergies: userData.medicalInfo?.allergies ? userData.medicalInfo.allergies.join(', ') : '',
            chronicConditions: userData.medicalInfo?.chronicConditions ? userData.medicalInfo.chronicConditions.join(', ') : '',
            emergencyContact: userData.personalInfo?.emergencyContact || {
              name: '',
              relationship: '',
              phoneNumber: ''
            },
            preferredLanguage: userData.personalInfo?.preferredLanguage || 'English',
            insuranceProvider: userData.medicalInfo?.insuranceProvider || '',
            insuranceNumber: userData.medicalInfo?.insuranceNumber || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    
    // Reset image if it was changed and not saved
    setProfileImage(user?.profilePic || null);
    setImageFile(null);
    setImageError('');
    setIsEditing(false);
  };
  
  const renderTabContent = () => {
    switch(activeTab) {
      case 'personal':
        return (
          <div className="animate-fadeIn">
            <div className="card p-6 bg-white rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleSubmit}
                      className="flex items-center text-sm text-green-600 hover:text-green-700 transition-colors"
                    >
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Save
                    </button>
                    <button 
                      onClick={cancelEdit}
                      className="flex items-center text-sm text-red-600 hover:text-red-700 transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              
              {saveError && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
                  {saveError}
                </div>
              )}
              
              {saveSuccess && (
                <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 text-sm rounded">
                  {saveSuccess}
                </div>
              )}
              
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : null}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field w-full"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    {isEditing ? (
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field w-full"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    {isEditing ? (
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field w-full"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    {isEditing ? (
                      <input 
                        type="date" 
                        name="dob" 
                        value={formData.dob}
                        onChange={handleChange}
                        className="input-field w-full"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.dob}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    {isEditing ? (
                      <select 
                        name="gender" 
                        value={formData.gender}
                        onChange={handleChange}
                        className="input-field w-full"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    ) : (
                      <p className="text-gray-800">{formData.gender}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                    {isEditing ? (
                      <select 
                        name="preferredLanguage" 
                        value={formData.preferredLanguage}
                        onChange={handleChange}
                        className="input-field w-full"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Mandarin">Mandarin</option>
                        <option value="Hindi">Hindi</option>
                      </select>
                    ) : (
                      <p className="text-gray-800">{formData.preferredLanguage}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="address.street" 
                        value={formData.address.street}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              street: e.target.value
                            }
                          });
                        }}
                        className="input-field w-full"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.address.street}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="address.city" 
                        value={formData.address.city}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              city: e.target.value
                            }
                          });
                        }}
                        className="input-field w-full"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.address.city}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="address.state" 
                        value={formData.address.state}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              state: e.target.value
                            }
                          });
                        }}
                        className="input-field w-full"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.address.state}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip/Postal Code</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="address.zipCode" 
                        value={formData.address.zipCode}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              zipCode: e.target.value
                            }
                          });
                        }}
                        className="input-field w-full"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.address.zipCode}</p>
                    )}
                  </div>
                </div>
              </form>
            </div>
            
            <div className="card p-6 bg-white rounded-xl shadow-md mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Medical Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                  {isEditing ? (
                    <select 
                      name="bloodType" 
                      value={formData.bloodType}
                      onChange={handleChange}
                      className="input-field w-full"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <p className="text-gray-800">{formData.bloodType}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="emergencyContact.name" 
                      value={formData.emergencyContact.name}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          emergencyContact: {
                            ...formData.emergencyContact,
                            name: e.target.value
                          }
                        });
                      }}
                      className="input-field w-full"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.emergencyContact.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Relationship</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="emergencyContact.relationship" 
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          emergencyContact: {
                            ...formData.emergencyContact,
                            relationship: e.target.value
                          }
                        });
                      }}
                      className="input-field w-full"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.emergencyContact.relationship}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="emergencyContact.phoneNumber" 
                      value={formData.emergencyContact.phoneNumber}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          emergencyContact: {
                            ...formData.emergencyContact,
                            phoneNumber: e.target.value
                          }
                        });
                      }}
                      className="input-field w-full"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.emergencyContact.phoneNumber}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="insuranceProvider" 
                      value={formData.insuranceProvider}
                      onChange={handleChange}
                      className="input-field w-full"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.insuranceProvider}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Number</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="insuranceNumber" 
                      value={formData.insuranceNumber}
                      onChange={handleChange}
                      className="input-field w-full"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.insuranceNumber}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                  {isEditing ? (
                    <textarea 
                      name="allergies" 
                      value={formData.allergies}
                      onChange={handleChange}
                      className="input-field w-full h-20"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.allergies}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chronic Conditions</label>
                  {isEditing ? (
                    <textarea 
                      name="chronicConditions" 
                      value={formData.chronicConditions}
                      onChange={handleChange}
                      className="input-field w-full h-20"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.chronicConditions}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'security':
        return (
          <div className="card p-6 bg-white rounded-xl shadow-md animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Security Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800">Change Password</h3>
                <p className="text-sm text-gray-600 mb-4">Update your password regularly to keep your account secure</p>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input type="password" className="input-field w-full md:w-1/2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input type="password" className="input-field w-full md:w-1/2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input type="password" className="input-field w-full md:w-1/2" />
                  </div>
                  <div>
                    <button className="btn-primary px-4 py-2 rounded-md">Update Password</button>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-800">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Status: <span className="text-red-600">Not Enabled</span></p>
                    <p className="text-sm text-gray-600">Enable two-factor authentication for better account security</p>
                  </div>
                  <button className="btn-outline px-4 py-2 rounded-md">Enable 2FA</button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-800">Login Sessions</h3>
                <p className="text-sm text-gray-600 mb-4">Manage your active sessions across devices</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Current Device - Windows</p>
                      <p className="text-xs text-gray-600">IP: 192.168.1.1 • Last accessed: Just now</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">iPhone 15</p>
                      <p className="text-xs text-gray-600">IP: 192.168.1.2 • Last accessed: 3 days ago</p>
                    </div>
                    <button className="text-red-600 text-sm hover:text-red-700">Logout</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div className="card p-6 bg-white rounded-xl shadow-md animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Email Notifications</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-800">Appointment Reminders</p>
                      <p className="text-sm text-gray-600">Receive email reminders before your appointments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-800">Medication Reminders</p>
                      <p className="text-sm text-gray-600">Get emails to remind you to take your medications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-800">Lab Results</p>
                      <p className="text-sm text-gray-600">Receive email notifications when new lab results are available</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-800">Marketing & Newsletters</p>
                      <p className="text-sm text-gray-600">Receive occasional updates and health tips</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">App Notifications</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-800">Push Notifications</p>
                      <p className="text-sm text-gray-600">Enable or disable all mobile push notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-800">Appointment Alerts</p>
                      <p className="text-sm text-gray-600">Receive alerts 24 hours and 1 hour before appointments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-800">Sound Alerts</p>
                      <p className="text-sm text-gray-600">Play sound when receiving notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'activity':
        return (
          <div className="card p-6 bg-white rounded-xl shadow-md animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Activity</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Recent Activity</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <ClockIcon className="h-5 w-5 text-gray-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">Profile Updated</p>
                      <p className="text-sm text-gray-600">You updated your profile information</p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <BellIcon className="h-5 w-5 text-gray-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">Notification Settings Changed</p>
                      <p className="text-sm text-gray-600">You updated your notification preferences</p>
                      <p className="text-xs text-gray-500 mt-1">Yesterday at 3:45 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <KeyIcon className="h-5 w-5 text-gray-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">Password Changed</p>
                      <p className="text-sm text-gray-600">You changed your password</p>
                      <p className="text-xs text-gray-500 mt-1">May 22, 2024 at 10:30 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <UserIcon className="h-5 w-5 text-gray-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">Account Created</p>
                      <p className="text-sm text-gray-600">You created your MediSmart account</p>
                      <p className="text-xs text-gray-500 mt-1">May 15, 2024 at 9:15 AM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Data & Privacy</h3>
                
                <div className="space-y-4">
                  <button className="btn-outline w-full sm:w-auto px-4 py-2 rounded-md flex items-center justify-center">
                    <InformationCircleIcon className="h-5 w-5 mr-2" />
                    Request My Data
                  </button>
                  
                  <p className="text-sm text-gray-600">
                    You can request a copy of all your data that we store. This process may take up to 48 hours.
                    Once processed, we will send you an email with instructions on how to download your data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary to-cyan-600 rounded-xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row items-center">
          <div className="relative">
            <div 
              className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/50 flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={handleImageClick}
            >
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt={formData.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserIcon className="h-12 w-12 text-white" />
              )}
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <CameraIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            
            {/* Hidden file input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
            
            {imageError && (
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs rounded px-2 py-1 w-48 text-center">
                {imageError}
              </div>
            )}
          </div>
          
          <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
            <h1 className="text-2xl font-bold">{formData.name}</h1>
            <p className="text-blue-100">{formData.email}</p>
            <p className="text-blue-100 text-sm mt-1">Member since May 2024</p>
            
            {/* Photo upload instructions */}
            <p className="text-xs text-blue-100 mt-2 md:mt-4 opacity-70">
              Click on the profile photo to update
            </p>
          </div>
          
          <div className="ml-auto mt-4 md:mt-0">
            <button 
              onClick={logout}
              className="flex items-center bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Profile Tabs */}
      <div className="flex overflow-x-auto space-x-2 py-2">
        <button 
          onClick={() => setActiveTab('personal')} 
          className={`px-4 py-2 rounded-lg flex items-center whitespace-nowrap transition-colors ${
            activeTab === 'personal' 
              ? 'bg-primary text-white shadow-md' 
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <UserIcon className="h-5 w-5 mr-2" />
          Personal Info
        </button>
        
        <button 
          onClick={() => setActiveTab('security')} 
          className={`px-4 py-2 rounded-lg flex items-center whitespace-nowrap transition-colors ${
            activeTab === 'security' 
              ? 'bg-primary text-white shadow-md' 
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ShieldCheckIcon className="h-5 w-5 mr-2" />
          Security
        </button>
        
        <button 
          onClick={() => setActiveTab('notifications')} 
          className={`px-4 py-2 rounded-lg flex items-center whitespace-nowrap transition-colors ${
            activeTab === 'notifications' 
              ? 'bg-primary text-white shadow-md' 
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BellIcon className="h-5 w-5 mr-2" />
          Notifications
        </button>
        
        <button 
          onClick={() => setActiveTab('activity')} 
          className={`px-4 py-2 rounded-lg flex items-center whitespace-nowrap transition-colors ${
            activeTab === 'activity' 
              ? 'bg-primary text-white shadow-md' 
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ClockIcon className="h-5 w-5 mr-2" />
          Activity
        </button>
      </div>
      
      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default ProfilePage; 