import express from 'express';
const router = express.Router();
import Appointment from '../models/Appointment.js';

// Get all appointments for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Fetching appointments for user:', userId);
    console.log('Request params:', req.params);
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Debug: Check what's in the database
    const allAppointments = await Appointment.find({});
    console.log('All appointments in database:', allAppointments.length);
    if (allAppointments.length > 0) {
      console.log('Sample appointment:', JSON.stringify(allAppointments[0]));
      console.log('Sample appointment userId:', allAppointments[0].userId);
      console.log('Requested userId:', userId);
      console.log('Do they match?', allAppointments[0].userId === userId);
    }
    
    // Find appointments for this specific user with exact string matching
    const appointments = await Appointment.find({ 
      userId: { $eq: userId } 
    }).sort({ appointmentDate: 1 });
    
    console.log(`Found ${appointments.length} appointments for user ${userId}`);
    if (appointments.length === 0) {
      console.log('No appointments found for this user ID');
      
      // If no appointments found with exact match, try a case-insensitive search
      // This helps if there's any case sensitivity issues with the UUID
      const caseInsensitiveAppointments = await Appointment.find({
        userId: { $regex: new RegExp('^' + userId + '$', 'i') }
      }).sort({ appointmentDate: 1 });
      
      if (caseInsensitiveAppointments.length > 0) {
        console.log(`Found ${caseInsensitiveAppointments.length} appointments with case-insensitive search`);
        return res.status(200).json(caseInsensitiveAppointments);
      }
    } else {
      console.log('First appointment:', appointments[0]);
    }
    
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new appointment
router.post('/', async (req, res) => {
  try {
    console.log('Received appointment creation request with body:', req.body);
    
    const { 
      userId, 
      doctorId, 
      doctorName, 
      doctorSpecialty, 
      doctorImage,
      appointmentDate, 
      appointmentTime, 
      notes 
    } = req.body;
    
    console.log('Creating new appointment for user:', userId);
    
    if (!userId || !doctorId || !appointmentDate || !appointmentTime) {
      console.error('Missing required fields:', { 
        hasUserId: !!userId, 
        hasDoctorId: !!doctorId, 
        hasAppointmentDate: !!appointmentDate, 
        hasAppointmentTime: !!appointmentTime 
      });
      
      return res.status(400).json({ 
        message: 'User ID, doctor ID, appointment date and time are required' 
      });
    }
    
    // Normalize the userId to ensure consistent format
    // Supabase UUIDs are typically lowercase, so we'll standardize on that
    const normalizedUserId = userId.toLowerCase();
    console.log('Normalized userId:', normalizedUserId);
    
    // Create new appointment
    const appointmentData = {
      userId: normalizedUserId, // Use normalized ID
      doctorId,
      doctorName,
      doctorSpecialty,
      doctorImage,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      notes: notes || '',
      status: 'scheduled'
    };
    
    console.log('Creating appointment with data:', appointmentData);
    
    const appointment = new Appointment(appointmentData);
    
    await appointment.save();
    console.log('Appointment created successfully with ID:', appointment._id);
    console.log('Saved appointment details:', appointment);
    
    // Verify the appointment was saved
    const savedAppointment = await Appointment.findById(appointment._id);
    console.log('Verified saved appointment:', savedAppointment);
    
    // Return the newly created appointment
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update appointment status (cancel or reschedule)
router.patch('/:appointmentId/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['scheduled', 'completed', 'cancelled', 'rescheduled'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }
    
    console.log(`Updating appointment ${req.params.appointmentId} status to ${status}`);
    
    const appointment = await Appointment.findById(req.params.appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    appointment.status = status;
    appointment.updatedAt = Date.now();
    
    await appointment.save();
    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reschedule an appointment
router.patch('/:appointmentId/reschedule', async (req, res) => {
  try {
    const { appointmentDate, appointmentTime } = req.body;
    
    if (!appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: 'Appointment date and time are required' });
    }
    
    console.log(`Rescheduling appointment ${req.params.appointmentId}`);
    
    const appointment = await Appointment.findById(req.params.appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    appointment.appointmentDate = new Date(appointmentDate);
    appointment.appointmentTime = appointmentTime;
    appointment.status = 'rescheduled';
    appointment.updatedAt = Date.now();
    
    await appointment.save();
    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete an appointment
router.delete('/:appointmentId', async (req, res) => {
  try {
    console.log(`Deleting appointment ${req.params.appointmentId}`);
    
    const appointment = await Appointment.findByIdAndDelete(req.params.appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
