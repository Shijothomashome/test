import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import s3client from '../config/s3Client.js'

dotenv.config();

const bucketName = process.env.AWS_S3_BUCKET_NAME;
const region = process.env.AWS_S3_REGION;

// Upload a file to AWS S3
const uploadToS3 = async (file, section = '') => {
  const sectionFolder = section ? `${section}/` : '';
  const fileKey = `${sectionFolder}${Date.now()}-${file.originalname}`;

  const params = {
    Bucket: bucketName,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3client.send(command);

  return `https://${bucketName}.s3.${region}.amazonaws.com/${encodeURIComponent(fileKey)}`;
};

// Delete a file from AWS S3 using the full S3 URL
const deleteFromS3 = async (s3Url) => {
  const url = new URL(s3Url);
  const s3Key = decodeURIComponent(url.pathname.substring(1));

  const deleteParams = {
    Bucket: bucketName,
    Key: s3Key,
  };

  const command = new DeleteObjectCommand(deleteParams);
  await s3client.send(command);
};

export default {
  uploadToS3,
  deleteFromS3,
};