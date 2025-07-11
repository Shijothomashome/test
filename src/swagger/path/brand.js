/**
 * @swagger
 * tags:
 *   - name: Admin - Brand
 *     description: Admin-only brand management APIs
 *   - name: User - Brand
 *     description: Public-facing brand listing APIs
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     apiKey:
 *       type: apiKey
 *       in: header
 *       name: api-key
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Brand:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         logo:
 *           type: string
 *         isActive:
 *           type: boolean
 *         isDeleted:
 *           type: boolean
 *         deletedAt:
 *           type: string
 *           format: date-time
 *         deletionReason:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */

//
// ─── ADMIN CREATE BRAND ─────────────────────────────────────
//
/**
 * @swagger
 * /admin/brands:
 *   post:
 *     summary: Create a new brand
 *     tags: [Admin - Brand]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
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
 *                 description: Required. Brand name
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional. Logo image file
 *               isActive:
 *                 type: boolean
 *                 description: Optional. true or false
 *     responses:
 *       201:
 *         description: Brand created successfully
 *       400:
 *         description: Validation or Multer error
 *       409:
 *         description: Brand name already exists
 *       500:
 *         description: Internal server error
 */

//
// ─── ADMIN GET BRANDS ─────────────────────────────────────
//
/**
 * @swagger
 * /admin/brands:
 *   get:
 *     summary: Get list of brands (Admin)
 *     tags: [Admin - Brand]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Optional. Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Optional. Records per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Optional. Search by name
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Optional. true or false
 *     responses:
 *       200:
 *         description: Paginated list of brands
 *       500:
 *         description: Internal server error
 */

//
// ─── ADMIN - GET BRAND BY ID ─────────────────────────────────────
//
/**
 * @swagger
 * /admin/brands/{id}:
 *   get:
 *     summary: Get a single brand by ID (Admin)
 *     tags: [Admin - Brand]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Brand'
 *       400:
 *         description: Invalid brand ID
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Internal server error
 */


//
// ─── ADMIN UPDATE BRAND ─────────────────────────────────────
//
/**
 * @swagger
 * /admin/brands/{id}:
 *   put:
 *     summary: Update a brand
 *     tags: [Admin - Brand]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Optional brand name
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional. New logo image
 *               isActive:
 *                 type: boolean
 *                 description: Optional. true or false
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Brand not found
 *       409:
 *         description: Brand name already exists
 */

//
// ─── ADMIN DELETE BRAND (SOFT DELETE) ─────────────────────────────
//
/**
 * @swagger
 * /admin/brands/{id}:
 *   delete:
 *     summary: Soft delete a brand
 *     tags: [Admin - Brand]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
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
 *             required:
 *               - deletionReason
 *             properties:
 *               deletionReason:
 *                 type: string
 *                 description: Required reason for deletion
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *       400:
 *         description: Invalid brand ID
 *       404:
 *         description: Brand not found or already deleted
 */

//
// ─── ADMIN TOGGLE STATUS ─────────────────────────────────────
//
/**
 * @swagger
 * /admin/brands/{id}/status:
 *   patch:
 *     summary: Toggle brand active status
 *     tags: [Admin - Brand]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
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
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 description: Required. true or false
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Brand not found
 */

//
// ─── CUSTOMER - GET ACTIVE BRANDS ─────────────────────────────
//
/**
 * @swagger
 * /brands:
 *   get:
 *     summary: Get list of active brands (Customer)
 *     tags: [User - Brand]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Optional. Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Optional. Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Optional. Search by brand name
 *     responses:
 *       200:
 *         description: List of public brands
 *       500:
 *         description: Internal server error
 */
