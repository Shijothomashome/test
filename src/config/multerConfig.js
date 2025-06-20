import multer from 'multer';

// Use memory storage to keep file in memory buffer
const storage = multer.memoryStorage();

// Default upload middleware using memory storage
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});


export default upload;
