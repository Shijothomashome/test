import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3client from "../config/s3Client.js";

export const deleteImageFromS3 = async (imageUrl) => {
    if (!imageUrl) {
        throw new Error("Image URL is required");
    }

    if (!process.env.AWS_S3_BUCKET_NAME) {
        throw new Error("S3 bucket name not configured");
    }

    
    const url = new URL(imageUrl);
    const key = url.pathname.slice(1); 

    const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
    };

    try {
        await s3client.send(new DeleteObjectCommand(deleteParams));
        console.log("Image successfully deleted");
        return true;
    } catch (error) {
        console.error(`Failed to delete image: ${imageUrl}`, error);
        throw new Error(`Image deletion failed: ${error.message}`);
    }
};
