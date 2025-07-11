/**
 * @swagger
 * tags:
 *   name:Admin Collections
 *   description: Product collection management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Collection:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         title:
 *           type: string
 *           example: Summer Collection
 *         handle:
 *           type: string
 *           example: summer-collection
 *         description:
 *           type: string
 *           example: Our best summer products
 *         collection_type:
 *           type: string
 *           enum: [custom, smart]
 *           example: custom
 *         image:
 *           type: string
 *           example: https://example.com/image.jpg
 *         rules:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               column:
 *                 type: string
 *                 example: tag
 *               relation:
 *                 type: string
 *                 example: equals
 *               condition:
 *                 type: string
 *                 example: summer
 *         disjunctive:
 *           type: boolean
 *           example: false
 *         status:
 *           type: string
 *           enum: [active, draft, archived]
 *           example: active
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         deletionReason:
 *           type: string
 *           nullable: true
 *         seo:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             description:
 *               type: string
 *             keywords:
 *               type: array
 *               items:
 *                 type: string
 *         products_count:
 *           type: number
 *           example: 42
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     CollectionProductUpdate:
 *       type: object
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             type: string
 *             example: 507f1f77bcf86cd799439012
 *         action:
 *           type: string
 *           enum: [replace, add, remove]
 *           default: replace
 * 
 *     CollectionDeleteRequest:
 *       type: object
 *       properties:
 *         deletionReason:
 *           type: string
 *           description: Reason for deleting the collection
 *           example: "Seasonal collection no longer needed"
 *       required:
 *         - deletionReason
 */


/**
 * @swagger
 * /admin/collections:
 *   post:
 *     summary: Create a new collection
 *     tags: [Admin Collections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Collection'
 *     responses:
 *       201:
 *         description: Collection created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/collections/{id}:
 *   get:
 *     summary: Get collection by ID
 *     tags: [Admin Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection ID
 *     responses:
 *       200:
 *         description: Collection details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 *       404:
 *         description: Collection not found
 *       401:
 *         description: Unauthorized
 * 
 *   put:
 *     summary: Update collection
 *     tags: [Admin Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Collection'
 *     responses:
 *       200:
 *         description: Collection updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Collection not found
 *       401:
 *         description: Unauthorized
 * 
 */


/**
 * @swagger
 * /admin/collections/{id}:
 *   delete:
 *     summary: Soft delete a collection
 *     description: Marks a collection as deleted while preserving it in the database
 *     tags: [Admin Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CollectionDeleteRequest'
 *     responses:
 *       200:
 *         description: Collection soft deleted successfully
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
 *                   example: Collection soft deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid input or missing deletion reason
 *       404:
 *         description: Collection not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/collections/{id}/products:
 *   put:
 *     summary: Update collection products
 *     tags: [Admin Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CollectionProductUpdate'
 *     responses:
 *       200:
 *         description: Products updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Collection not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/products/{productId}/collections:
 *   put:
 *     summary: Update product's collection
 *     tags: [Admin Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               collectionId:
 *                 type: string
 *               action:
 *                 type: string
 *                 enum: [set, remove]
 *                 default: set
 *     responses:
 *       200:
 *         description: Collection updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product or collection not found
 *       401:
 *         description: Unauthorized
 */




/**
 * @swagger
 * tags:
 *   name:User Collections
 *   description: Product collection management
 */

/**
 * @swagger
 * /collections:
 *   get:
 *     summary: List all collections
 *     tags: [User Collections]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [custom, smart]
 *         description: Filter by collection type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, draft, archived]
 *         description: Filter by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or handle
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: -createdAt
 *         description: Sort field and direction
 *     responses:
 *       200:
 *         description: List of collections
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Collection'
 */

/**
 * @swagger
 * /collections/{id}/products:
 *   get:
 *     summary: Get products in a collection
 *     tags: [User Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: -createdAt
 *         description: Sort field and direction
 *     responses:
 *       200:
 *         description: List of products in collection
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       404:
 *         description: Collection not found
 */