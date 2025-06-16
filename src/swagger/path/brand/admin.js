
/**
 * @swagger
 * tags:
 *   - name: Brands (Admin)
 *     description: Admin endpoints for managing brands
 */

/**
 * @swagger
 * /brands/admin/create:
 *   post:
 *     summary: Create a new brand
 *     tags:
 *       - Brands (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the brand
 *                 example: "Acme Co"
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Brand logo image file
 *               isActive:
 *                 type: boolean
 *                 description: Initial status of the brand (active/inactive)
 *                 example: true
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Brand created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Brand created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60f8a2c4b1e3a42f88e1d2a7"
 *                     name:
 *                       type: string
 *                       example: "Acme Co"
 *                     logoUrl:
 *                       type: string
 *                       example: "https://cdn.example.com/logos/acme.png"
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-16T07:45:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-16T07:50:00.000Z"
 *       400:
 *         description: Validation error or bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation error: name is required"
 *       401:
 *         description: Unauthorized (e.g., missing/invalid JWT)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /brands/admin/brands:
 *   get:
 *     summary: Get all brands (with optional pagination & search)
 *     tags:
 *       - Brands (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search brands by name
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by status (true=active, false=inactive)
 *     responses:
 *       200:
 *         description: List of brands
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60f8a2c4b1e3a42f88e1d2a7"
 *                       name:
 *                         type: string
 *                         example: "Acme Co"
 *                       logoUrl:
 *                         type: string
 *                         example: "https://cdn.example.com/logos/acme.png"
 *                       status:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-16T07:45:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-16T07:50:00.000Z"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 42
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Bad request (e.g., invalid query parameters)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid query parameter"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /brands/admin/brands/{id}:
 *   put:
 *     summary: Update a brand by ID
 *     tags:
 *       - Brands (Admin)
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the brand to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 example: "New Brand Name"
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (JPEG, PNG, etc.)
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 description: true for active, false for inactive
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Brand updated successfully
 *                 brand:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 684fdd33ba7425beab881259
 *                     name:
 *                       type: string
 *                       example: Acme Co
 *                     logo:
 *                       type: string
 *                       example: https://your-bucket.s3.region.amazonaws.com/brand/filename.jpg
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid input or brand ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid brand ID.
 *       404:
 *         description: Brand not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Brand not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /brands/admin/brands/{id}/toggle-status:
 *   patch:
 *     summary: Toggle or set the active status of a brand
 *     tags:
 *       - Brands (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID whose status to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 description: New active status for the brand
 *                 example: false
 *     responses:
 *       200:
 *         description: Brand status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Brand status updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60f8a2c4b1e3a42f88e1d2a7"
 *                     name:
 *                       type: string
 *                       example: "Acme Co"
 *                     logo:
 *                       type: string
 *                       example: "https://cdn.example.com/logos/acme.png"
 *                     isActive:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /brands/admin/brands/{id}:
 *   delete:
 *     summary: Soft delete a brand by ID
 *     tags:
 *       - Brands (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the brand to delete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isDeleted
 *             properties:
 *               isDeleted:
 *                 type: boolean
 *                 example: true
 *               deletionReason:
 *                 type: string
 *                 example: "Duplicate brand entry"
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request (validation or missing fields)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Internal server error
 */
