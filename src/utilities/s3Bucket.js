import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import s3client from './s3client.js'; 

dotenv.config();

const bucketName = process.env.AWS_S3_BUCKET_NAME;
const region = process.env.AWS_S3_REGION;

// Function to upload files to AWS S3
export async function uploadToS3(file, section = '') {
  const sectionFolderName = section ? `${section}/` : '';
  const fileKey = `${sectionFolderName}${Date.now()}-${file.originalname}`;

  const params = {
    Bucket: bucketName,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  const command = new PutObjectCommand(params);
  await s3client.send(command);

  return `https://${bucketName}.s3.${region}.amazonaws.com/${encodeURIComponent(params.Key)}`;
}

// Function to delete a file from AWS S3
export async function deleteFromS3(s3Url) {
  const url = new URL(s3Url);
  const s3Key = decodeURIComponent(url.pathname.substring(1));

  const deleteParams = {
    Bucket: bucketName,
    Key: s3Key,
  };

  const command = new DeleteObjectCommand(deleteParams);
  await s3client.send(command);
}
