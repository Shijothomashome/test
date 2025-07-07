/**
 * @swagger
 * tags:
 *   name: Admin Coupons
 *   description: Coupon management by admin
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Coupon:
 *       type: object
 *       required:
 *         - code
 *         - discountType
 *         - discountValue
 *         - minCartValue
 *         - validFrom
 *         - validTill
 *       properties:
 *         code:
 *           type: string
 *           description: Unique coupon code
 *         description:
 *           type: string
 *           description: Coupon description
 *         discountType:
 *           type: string
 *           enum: [percentage, fixed]
 *           description: Type of discount
 *         discountValue:
 *           type: number
 *           description: Discount value
 *         maxDiscountAmount:
 *           type: number
 *           description: Maximum discount amount (for percentage)
 *         minCartValue:
 *           type: number
 *           description: Minimum cart value to apply coupon
 *         usageLimit:
 *           type: number
 *           description: Maximum usage limit per user
 *         firstOrderOnly:
 *           type: boolean
 *           default: false
 *           description: If coupon is only for first order
 *         validFrom:
 *           type: string
 *           format: date-time
 *           description: Coupon validity start date
 *         validTill:
 *           type: string
 *           format: date-time
 *           description: Coupon validity end date
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Coupon active status
 */

/**
 * @swagger
 * /coupon/admin/create-coupon:
 *   post:
 *     summary: Create a new coupon
 *     tags: [Admin Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coupon'
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Coupon code already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /coupon/admin/getallcoupons:
 *   get:
 *     summary: Get all coupons (admin view)
 *     tags: [Admin Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by coupon code
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 coupons:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Coupon'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /coupon/admin/update/{id}:
 *   put:
 *     summary: Update a coupon
 *     tags: [Admin Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coupon'
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Coupon not found
 *       409:
 *         description: Coupon code already exists
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /coupon/admin/toggle/{id}:
 *   patch:
 *     summary: Toggle coupon active status
 *     tags: [Admin Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 description: New active status
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /coupon/admin/delete/{id}:
 *   delete:
 *     summary: Delete a coupon
 *     tags: [Admin Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
 *       400:
 *         description: Invalid coupon ID
 *       404:
 *         description: Coupon not found or already deleted
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * tags:
 *   name: User Coupons
 *   description: Coupon operations for users
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ValidateCouponRequest:
 *       type: object
 *       required:
 *         - code
 *         - cartValue
 *         - userId
 *       properties:
 *         code:
 *           type: string
 *           description: Coupon code to validate
 *         cartValue:
 *           type: number
 *           description: Current cart value
 *         userId:
 *           type: string
 *           description: User ID
 *         isFirstOrder:
 *           type: boolean
 *           default: false
 *           description: Is this user's first order
 * 
 *     ValidateCouponResponse:
 *       type: object
 *       properties:
 *         discountAmount:
 *           type: number
 *           description: Calculated discount amount
 *         finalPrice:
 *           type: number
 *           description: Final price after discount
 */

/**
 * @swagger
 * /coupon/getallcoupons:
 *   get:
 *     summary: Get all available coupons for user
 *     tags: [User Coupons]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of available coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 coupons:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Coupon'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /coupon/validate:
 *   post:
 *     summary: Validate a coupon code
 *     tags: [User Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ValidateCouponRequest'
 *     responses:
 *       200:
 *         description: Coupon is valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidateCouponResponse'
 *       400:
 *         description: Invalid coupon or validation error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /coupon/apply:
 *   post:
 *     summary: Apply coupon to order (Deprecated - use validate instead)
 *     tags: [User Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               cartValue:
 *                 type: number
 *               userId:
 *                 type: string
 *               orderId:
 *                 type: string
 *               isFirstOrder:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Coupon applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidateCouponResponse'
 *       400:
 *         description: Invalid coupon or validation error
 *       500:
 *         description: Server error
 */