import axios from 'axios';

// Backend API URL (server runs on port 5000 by default)
const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// User API service
const userApi = {
  // Get user by Supabase ID
  getUserById: async (supabaseId) => {
    try {
      const response = await api.get(`/users/${supabaseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create or update user
  createOrUpdateUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  },

  // Update user personal info
  updatePersonalInfo: async (supabaseId, personalInfo) => {
    try {
      const response = await api.patch(`/users/${supabaseId}/personal-info`, { personalInfo });
      return response.data;
    } catch (error) {
      console.error('Error updating personal info:', error);
      throw error;
    }
  },

  // Update user medical info
  updateMedicalInfo: async (supabaseId, medicalInfo) => {
    try {
      const response = await api.patch(`/users/${supabaseId}/medical-info`, { medicalInfo });
      return response.data;
    } catch (error) {
      console.error('Error updating medical info:', error);
      throw error;
    }
  },

  // Upload profile image
  uploadProfileImage: async (supabaseId, imageFile) => {
    try {
      console.log('Uploading image for user:', supabaseId);
      
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Log the FormData contents for debugging
      console.log('FormData created with image:', imageFile.name);
      
      const response = await axios.post(`${API_URL}/users/${supabaseId}/profile-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Upload successful, response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error uploading profile image:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
};

export default userApi;
