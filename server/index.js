import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import userRoutes from './routes/userRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

// Load environment variables from server/.env file
dotenv.config({ path: './.env' });

// Log environment variables for debugging
console.log('MONGO_URI:', process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://subhooo224:Subham123@cluster0.le7sc.mongodb.net/?retryWrites=true';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Test file upload route
app.post('/api/test-upload', (req, res) => {
  console.log('Test upload request received');
  console.log('Request files:', req.files ? Object.keys(req.files) : 'No files');
  
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: 'No files were uploaded.' });
  }
  
  // Log the file information
  const fileKeys = Object.keys(req.files);
  const fileInfo = {};
  
  fileKeys.forEach(key => {
    const file = req.files[key];
    fileInfo[key] = {
      name: file.name,
      size: file.size,
      mimetype: file.mimetype,
      tempFilePath: file.tempFilePath ? 'Available' : 'Not available'
    };
  });
  
  console.log('Files received:', fileInfo);
  
  res.status(200).json({ message: 'Files received', files: fileInfo });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
