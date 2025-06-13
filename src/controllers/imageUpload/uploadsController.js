// controllers/uploadsController.js
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3client from '../../utilities/s3client.js';
import { v4 as uuidv4 } from 'uuid';

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Validate environment variables
    if (!process.env.AWS_S3_BUCKET_NAME) {
      throw new Error("S3 bucket name not configured");
    }

    const key = `products/${uuidv4()}-${file.originalname}`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    const uploadParams = {
      Bucket: bucketName, // Make sure this is defined
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read'
    };

    // Debug log
    console.log('Uploading to bucket:', bucketName);

    await s3client.send(new PutObjectCommand(uploadParams));
    
    const url = `https://${bucketName}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
    
    res.status(200).json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: "Upload failed",
      message: error.message,
      details: {
        bucket: process.env.AWS_S3_BUCKET_NAME,
        region: process.env.AWS_S3_REGION
      }
    });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
      throw new Error("S3 bucket name not configured");
    }

    // Extract key from URL
    const urlObj = new URL(url);
    let key = urlObj.pathname.substring(1); // Remove leading slash

    const deleteParams = {
      Bucket: bucketName,
      Key: key
    };

    await s3client.send(new DeleteObjectCommand(deleteParams));
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Deletion error:', error);
    res.status(500).json({ 
      error: "Deletion failed",
      message: error.message
    });
  }
};