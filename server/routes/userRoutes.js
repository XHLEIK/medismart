import express from 'express';
const router = express.Router();
import User from '../models/User.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// Get user by supabaseId
router.get('/:supabaseId', async (req, res) => {
  try {
    const user = await User.findOne({ supabaseId: req.params.supabaseId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create or update user
router.post('/', async (req, res) => {
  try {
    const { supabaseId, email, personalInfo, medicalInfo } = req.body;
    
    if (!supabaseId || !email) {
      return res.status(400).json({ message: 'Supabase ID and email are required' });
    }
    
    // Check if user exists
    let user = await User.findOne({ supabaseId });
    
    if (user) {
      // Update existing user
      user.email = email;
      if (personalInfo) user.personalInfo = personalInfo;
      if (medicalInfo) user.medicalInfo = medicalInfo;
      user.updatedAt = Date.now();
      
      await user.save();
      return res.status(200).json(user);
    }
    
    // Create new user
    user = new User({
      supabaseId,
      email,
      personalInfo: personalInfo || {},
      medicalInfo: medicalInfo || {}
    });
    
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user personal info
router.patch('/:supabaseId/personal-info', async (req, res) => {
  try {
    const { personalInfo } = req.body;
    
    if (!personalInfo) {
      return res.status(400).json({ message: 'Personal info is required' });
    }
    
    const user = await User.findOne({ supabaseId: req.params.supabaseId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.personalInfo = { ...user.personalInfo, ...personalInfo };
    user.updatedAt = Date.now();
    
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating personal info:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user medical info
router.patch('/:supabaseId/medical-info', async (req, res) => {
  try {
    const { medicalInfo } = req.body;
    
    if (!medicalInfo) {
      return res.status(400).json({ message: 'Medical info is required' });
    }
    
    const user = await User.findOne({ supabaseId: req.params.supabaseId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.medicalInfo = { ...user.medicalInfo, ...medicalInfo };
    user.updatedAt = Date.now();
    
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating medical info:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload profile image
router.post('/:supabaseId/profile-image', async (req, res) => {
  try {
    console.log('Profile image upload request received for user:', req.params.supabaseId);
    console.log('Request files:', req.files ? Object.keys(req.files) : 'No files');
    
    if (!req.files || !req.files.image) {
      console.log('No image file provided in the request');
      return res.status(400).json({ message: 'No image file provided' });
    }

    const imageFile = req.files.image;
    console.log('Image file received:', {
      name: imageFile.name,
      size: imageFile.size,
      mimetype: imageFile.mimetype,
      hasData: imageFile.data ? 'Yes' : 'No'
    });
    
    // Validate file type
    if (!imageFile.mimetype.startsWith('image/')) {
      console.log('Invalid file type:', imageFile.mimetype);
      return res.status(400).json({ message: 'File must be an image' });
    }

    // Validate file size (max 5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
      console.log('File too large:', imageFile.size);
      return res.status(400).json({ message: 'Image size should be less than 5MB' });
    }

    const user = await User.findOne({ supabaseId: req.params.supabaseId });
    
    if (!user) {
      console.log('User not found with supabaseId:', req.params.supabaseId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User found:', user.email);
    
    // If user already has a profile image, delete the old one from Cloudinary
    if (user.profileImage && user.profileImage.publicId) {
      console.log('Deleting old profile image:', user.profileImage.publicId);
      await deleteFromCloudinary(user.profileImage.publicId);
    }
    
    // Upload new image to Cloudinary
    console.log('Uploading new image to Cloudinary...');
    
    try {
      const cloudinaryResult = await uploadToCloudinary(imageFile);
      console.log('Cloudinary upload result:', cloudinaryResult);
      
      // Update user with new profile image info
      user.profileImage = {
        url: cloudinaryResult.url,
        publicId: cloudinaryResult.publicId
      };
      user.updatedAt = Date.now();
      
      console.log('Saving updated user profile with new image');
      await user.save();
      
      console.log('Profile image updated successfully');
      res.status(200).json(user);
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed:', cloudinaryError);
      res.status(500).json({ message: 'Failed to upload image to cloud storage', error: cloudinaryError.message });
    }
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
