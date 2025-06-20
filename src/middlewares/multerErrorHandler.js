import multer from 'multer';

//  Middleware to handle Multer file upload errors gracefully.
function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      // Identify which field triggered the error
      const field = err.field;

      if (field === "image") {
        return res.status(400).json({
          success: false,
          message: "Only one image allowed in 'image' field.",
        });
      }

      if (field === "images") {
        return res.status(400).json({
          success: false,
          message: "You can upload a maximum of 5 additional images in 'images' field.",
        });
      }

      return res.status(400).json({
        success: false,
        message: `Unexpected file upload in field: ${field}`,
      });
    }
  }
  next(err);
}

export default multerErrorHandler;
