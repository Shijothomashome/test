/**
 * @swagger
 * tags:
 *   - name: Admin - Categories
 *     description: Admin Category Management
 *   - name: User - Categories
 *     description: User-facing Category Endpoints
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
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         isActive:
 *           type: boolean
 *         isDeleted:
 *           type: boolean
 *         parentCategoryId:
 *           type: string
 *           format: objectId
 *         image:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */

//
// ─── CREATE CATEGORY ─────────────────────────────────────────────────────────────
//
/**
 * @swagger
 * /admin/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Admin - Categories]
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
 *                 description: Required. Category name
 *               parentCategoryId:
 *                 type: string
 *                 format: objectId
 *                 description: Optional. Parent category ID (ObjectId)
 *               isActive:
 *                 type: boolean
 *                 description: Optional. Accepts true or false
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image (max 2MB)
 *     responses:
 *       201:
 *         description: New category created successfully
 *       409:
 *         description: Category name already exists
 *       500:
 *         description: Internal server error
 */

//
// ─── GET ALL CATEGORIES (ADMIN) ─────────────────────────────────────────────
//
/**
 * @swagger
 * /admin/categories:
 *   get:
 *     summary: Get all categories (admin)
 *     tags: [Admin - Categories]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Optional. Search by category name
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Optional. true or false
 *       - in: query
 *         name: parentCategoryId
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Optional. Filter by parent category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Optional. Default is 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Optional. Default is 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt, updatedAt]
 *         description: Optional. Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Optional. Sort order
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *       500:
 *         description: Internal server error
 */

//
// ─── UPDATE CATEGORY ─────────────────────────────────────────────────────────────
//
/**
 * @swagger
 * /admin/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Admin - Categories]
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
 *                 description: Optional new category name
 *               parentCategoryId:
 *                 type: string
 *                 format: objectId
 *                 description: Optional new parent category
 *               isActive:
 *                 type: boolean
 *                 description: Optional. Accepts true or false
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional new image
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid input or ID
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category name already exists
 *       500:
 *         description: Internal server error
 */

//
// ─── TOGGLE CATEGORY STATUS ─────────────────────────────────────────────
//
/**
 * @swagger
 * /admin/categories/{id}/status:
 *   patch:
 *     summary: Toggle isActive status
 *     tags: [Admin - Categories]
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
 *         description: Category status updated successfully
 *       400:
 *         description: Invalid ID or missing isActive
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

//
// ─── DELETE CATEGORY ─────────────────────────────────────────────────────────────
//
/**
 * @swagger
 * /admin/categories/{id}:
 *   delete:
 *     summary: Soft delete a category
 *     tags: [Admin - Categories]
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
 *                 description: Required. Reason for deletion
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

//
// ─── USER - GET CATEGORIES ─────────────────────────────────────────────────────────────
//
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get categories for users
 *     tags: [User - Categories]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [parent, sub]
 *         description: Optional. Type of category to fetch
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Optional. Search by category name
 *       - in: query
 *         name: parentCategoryId
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Optional. Filter by parent category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Optional. Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 15
 *         description: Optional. Number of records per page
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *       500:
 *         description: Internal server error
 */
