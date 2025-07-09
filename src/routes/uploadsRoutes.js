// routes/uploadsRoutes.js
import express from 'express';
import { uploadImage, deleteImage } from '../controllers/imageUpload/uploadsController.js';
import upload from "../config/multerConfig.js";

const router = express.Router();

router.post('/upload', upload.single('image'), uploadImage);
router.delete('/delete', deleteImage);

export default router;

// 