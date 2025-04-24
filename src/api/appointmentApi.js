import axios from 'axios';

// Backend API URL (server runs on port 5000 by default)
const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL
});

// Appointment API service
const appointmentApi = {
  // Get all appointments for a user
  getUserAppointments: async (userId) => {
    try {
      if (!userId) {
        console.error('No user ID provided to getUserAppointments');
        return [];
      }
      
      // Normalize the userId to ensure consistent format
      // Supabase UUIDs are typically lowercase
      const normalizedUserId = userId.toLowerCase();
      console.log('Fetching appointments for user:', normalizedUserId);
      
      const response = await api.get(`/appointments/user/${normalizedUserId}`);
      console.log('API response for appointments:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      throw error;
    }
  },

  // Create a new appointment
  createAppointment: async (appointmentData) => {
    try {
      if (!appointmentData.userId) {
        console.error('No user ID provided in appointment data');
        throw new Error('User ID is required for creating an appointment');
      }
      
      // Normalize the userId to ensure consistent format
      const normalizedData = {
        ...appointmentData,
        userId: appointmentData.userId.toLowerCase()
      };
      
      console.log('Creating new appointment with normalized data:', normalizedData);
      const response = await api.post('/appointments', normalizedData);
      console.log('Appointment creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Update appointment status (cancel)
  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      console.log(`Updating appointment ${appointmentId} status to ${status}`);
      const response = await api.patch(`/appointments/${appointmentId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },

  // Reschedule an appointment
  rescheduleAppointment: async (appointmentId, appointmentDate, appointmentTime) => {
    try {
      console.log(`Rescheduling appointment ${appointmentId}`);
      const response = await api.patch(`/appointments/${appointmentId}/reschedule`, {
        appointmentDate,
        appointmentTime
      });
      return response.data;
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      throw error;
    }
  },

  // Delete an appointment
  deleteAppointment: async (appointmentId) => {
    try {
      console.log(`Deleting appointment ${appointmentId}`);
      const response = await api.delete(`/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }
};

export default appointmentApi;
