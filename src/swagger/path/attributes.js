/**
 * @swagger
 * tags:
 *   - name: Admin - Product Attributes
 *     description: Admin-only attribute management APIs
 *   - name: User - Product Attributes
 *     description: Public-facing product attribute APIs
 * 
 * components:
 *   schemas:
 *     Attribute:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         isGlobal:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *         isDeleted:
 *           type: boolean
 *         isVariantAttribute:
 *           type: boolean
 *         categories:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *         values:
 *           type: array
 *           items:
 *             type: string
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


/**
 * @swagger
 * /admin/product/attributes:
 *   post:
 *     summary: Create a new product attribute
 *     tags: [Admin - Product Attributes]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - isGlobal
 *               - values
 *             properties:
 *               name:
 *                 type: string
 *               isGlobal:
 *                 type: boolean
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               values:
 *                 type: array
 *                 items:
 *                   type: string
 *               isVariantAttribute:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Attribute created successfully
 *       400:
 *         description: Validation or duplicate error
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /product/attributes:
 *   get:
 *     summary: Get all attributes (User or Admin)
 *     tags: [User - Product Attributes]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search attributes by name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: isGlobal
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: isVariantAttribute
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: isDeleted
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of attributes
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /admin/product/attributes/{id}:
 *   get:
 *     summary: Get a single attribute by ID (Admin)
 *     tags: [Admin - Product Attributes]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attribute details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attribute'
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Attribute not found
 *       410:
 *         description: Attribute has been deleted
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /admin/product/attributes/{id}:
 *   put:
 *     summary: Update an attribute by ID (Admin)
 *     tags: [Admin - Product Attributes]
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
 *             properties:
 *               name:
 *                 type: string
 *               isGlobal:
 *                 type: boolean
 *               isVariantAttribute:
 *                 type: boolean
 *               isActive:
 *                 type: boolean
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               values:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Attribute updated successfully
 *       400:
 *         description: Validation or format error
 *       404:
 *         description: Attribute not found
 *       410:
 *         description: Attribute has been deleted
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /admin/product/attributes/{id}:
 *   delete:
 *     summary: Soft delete an attribute
 *     tags: [Admin - Product Attributes]
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
 *     responses:
 *       200:
 *         description: Attribute deleted successfully
 *       400:
 *         description: Invalid ID or already deleted
 *       404:
 *         description: Attribute not found
 *       500:
 *         description: Server error
 */


