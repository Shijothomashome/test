


import multer from "multer";
import multerS3 from "multer-s3";
import s3Client from "../config/s3Client.js";
import dotenv from "dotenv";
dotenv.config();

const uploadToS3 = multer({
  storage: multerS3({
    s3: s3Client, // ✅ this key must be exactly "s3"
    bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = `images/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

export default uploadToS3;
