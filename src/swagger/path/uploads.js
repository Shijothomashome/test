/**
 * @swagger
 * tags:
 *   name: Image Uploads
 *   description: Image upload and management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ImageUploadResponse:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           description: Public URL of the uploaded image
 *           example: "https://your-bucket.s3.region.amazonaws.com/products/uuid-filename.jpg"
 * 
 *     ImageDeleteRequest:
 *       type: object
 *       required:
 *         - url
 *       properties:
 *         url:
 *           type: string
 *           description: URL of the image to delete
 *           example: "https://your-bucket.s3.region.amazonaws.com/products/uuid-filename.jpg"
 * 
 *     ImageDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         message:
 *           type: string
 *         details:
 *           type: object
 */

/**
 * @swagger
 * /images/upload:
 *   post:
 *     summary: Upload an image
 *     tags: [Image Uploads]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: The image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImageUploadResponse'
 *       400:
 *         description: Bad request (no file uploaded)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error during upload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /images/delete:
 *   delete:
 *     summary: Delete an image
 *     tags: [Image Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ImageDeleteRequest'
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImageDeleteResponse'
 *       400:
 *         description: Bad request (missing URL)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error during deletion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */