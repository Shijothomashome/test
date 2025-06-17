/**
 * @swagger
 * tags:
 *   - name: Brands
 *     description: Brand related endpoints
 *     x-displayName: Brands
 *     tags:
 *       - name: Admin - Brand
 *         description: Admin-only brand management APIs
 *       - name: Customer - Brand
 *         description: Public-facing brand listing APIs
 */

/**
 * @swagger
 * /admin/brands:
 *   post:
 *     summary: Create a new brand
 *     tags: [Admin - Brand]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Brand name
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional logo image
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Brand created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Brand created successfully
 *               brand:
 *                 _id: "685182afc1df5e6c8f32220c"
 *                 name: "dummy brand"
 *                 logo: "https://s3.amazonaws.com/brand/logo.jpg"
 *                 isActive: true
 *                 isDeleted: false
 *                 createdAt: "2025-06-17T14:58:55.168Z"
 *                 updatedAt: "2025-06-17T14:58:55.168Z"
 *                 __v: 0
 *       400:
 *         description: Validation error or bad request
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Only one image allowed in 'image' field.
 *       409:
 *         description: Brand name already exists
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Brand name already exists.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Internal server error
 */

/**
 * @swagger
 * /admin/brands:
 *   get:
 *     summary: Get list of brands (Admin)
 *     tags: [Admin - Brand]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (optional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit per page (optional)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name (optional)
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status (optional)
 *     responses:
 *       200:
 *         description: Brands list with pagination
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Brands fetched successfully
 *               data:
 *                 - _id: "685182afc1df5e6c8f32220c"
 *                   name: "dummy brand"
 *                   logo: "https://s3.amazonaws.com/brand/logo.jpg"
 *                   isActive: true
 *                   isDeleted: false
 *                   createdAt: "2025-06-17T14:58:55.168Z"
 *                   updatedAt: "2025-06-17T14:58:55.168Z"
 *                   __v: 0
 *               pagination:
 *                 totalCount: 1
 *                 totalPages: 1
 *                 currentPage: 1
 *                 pageSize: 10
 */

/**
 * @swagger
 * /admin/brands/{id}:
 *   put:
 *     summary: Update a brand
 *     tags: [Admin - Brand]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Brand updated successfully
 *               brand:
 *                 _id: "685182afc1df5e6c8f32220c"
 *                 name: "updated brand"
 *                 logo: "https://s3.amazonaws.com/brand/logo-updated.jpg"
 *                 isActive: false
 *                 updatedAt: "2025-06-17T15:05:22.168Z"
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Brand not found
 *       409:
 *         description: Brand name already exists
 */

/**
 * @swagger
 * /admin/brands/{id}:
 *   delete:
 *     summary: Soft delete a brand
 *     tags: [Admin - Brand]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deletionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Brand deleted successfully.
 *               data:
 *                 id: "685182afc1df5e6c8f32220c"
 *                 deletedAt: "2025-06-17T15:10:00.000Z"
 *       400:
 *         description: Invalid brand ID
 *       404:
 *         description: Brand not found or already deleted
 */

/**
 * @swagger
 * /admin/brands/{id}/status:
 *   patch:
 *     summary: Toggle brand active status
 *     tags: [Admin - Brand]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Status toggled
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Brand has been deactivated.
 *               data:
 *                 id: "685182afc1df5e6c8f32220c"
 *                 isActive: false
 *       404:
 *         description: Brand not found
 */

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: Get list of active brands (Customer)
 *     tags: [Customer - Brand]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public brand list
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Brands fetched successfully
 *               data:
 *                 - _id: "685182afc1df5e6c8f32220c"
 *                   name: "dummy brand"
 *                   logo: "https://s3.amazonaws.com/brand/logo.jpg"
 *                   isActive: true
 *               pagination:
 *                 totalCount: 1
 *                 totalPages: 1
 *                 currentPage: 1
 *                 pageSize: 10
 */
