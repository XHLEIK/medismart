import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with hardcoded values for now (from .env)
const cloudName = 'dy1xpig87';
const apiKey = '218613399951928';
const apiSecret = 'dtRl3WmDxOEPeczn2xnnglTzgJU';

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

// Log Cloudinary configuration for debugging
console.log('Cloudinary Configuration:', {
  cloud_name: cloudName,
  api_key: '****', // Hide actual key
  api_secret: '****' // Hide actual secret
});

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    console.log('Uploading to Cloudinary:', {
      fileName: file.name,
      tempFilePath: file.tempFilePath,
      size: file.size,
      mimetype: file.mimetype
    });
    
    // Instead of using tempFilePath, create a base64 data URI from the file data
    // This is more reliable than using temp files
    const fileBuffer = file.data;
    
    if (!fileBuffer) {
      throw new Error('No file data available for upload');
    }
    
    // Create a base64 data URI
    const base64Data = `data:${file.mimetype};base64,${fileBuffer.toString('base64')}`;
    
    console.log('Uploading image as base64 data URI');
    
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: 'medismart_profile_images',
      use_filename: true,
      transformation: [{ width: 500, height: 500, crop: 'limit' }]
    });
    
    console.log('Cloudinary upload successful:', {
      url: result.secure_url,
      publicId: result.public_id
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
  }
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

export { cloudinary, uploadToCloudinary, deleteFromCloudinary };
