/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         variantId:
 *           type: string
 *           example: 507f1f77bcf86cd799439012
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *         price:
 *           type: number
 *           example: 24.99
 *         mrp:
 *           type: number
 *           example: 29.99
 *         subTotal:
 *           type: number
 *           example: 49.98
 *         product:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             thumbnail:
 *               type: string
 *             selectedVariant:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 attributes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       attribute:
 *                         type: string
 *                       value:
 *                         type: string
 *                 price:
 *                   type: object
 *                   properties:
 *                     mrp:
 *                       type: number
 *                     sellingPrice:
 *                       type: number
 * 
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439013
 *         userId:
 *           type: string
 *           example: 507f1f77bcf86cd799439014
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         totalPrice:
 *           type: number
 *           example: 99.96
 *         totalMRP:
 *           type: number
 *           example: 119.96
 *         savedAmount:
 *           type: number
 *           example: 20.00
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     CartUpdateRequest:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               variantId:
 *                 type: string
 *               quantity:
 *                 type: integer
 * 
 *     CartDeleteRequest:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               variantId:
 *                 type: string
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Create or update a cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartUpdateRequest'
 *     responses:
 *       201:
 *         description: Cart created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       200:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 * 
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /cart/items:
 *   put:
 *     summary: Update item quantities in cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartUpdateRequest'
 *     responses:
 *       200:
 *         description: Cart quantities updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 * 
 *   delete:
 *     summary: Remove items from cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartDeleteRequest'
 *     responses:
 *       200:
 *         description: Items removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear entire cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart fully deleted
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */