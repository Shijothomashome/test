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
 * 
 *     ValidateCouponRequest:
 *       type: object
 *       required:
 *         - code
 *         - cartValue
 *       properties:
 *         code:
 *           type: string
 *           description: Coupon code to validate
 *         cartValue:
 *           type: number
 *           description: Current cart value
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
 * /admin/coupons:
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Coupon code already exists
 * 
 *   get:
 *     summary: Get all coupons (admin view)
 *     tags: [Admin Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Coupon'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/coupons/{id}:
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Coupon not found
 *       409:
 *         description: Coupon code already exists
 * 
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
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Coupon not found
 */

/**
 * @swagger
 * /admin/coupons/toggle/{id}:
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Coupon not found
 */

/**
 * @swagger
 * tags:
 *   name: User Coupons
 *   description: Coupon operations for users
 */

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: Get all available coupons for user
 *     tags: [User Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Coupon'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /coupons/validate:
 *   post:
 *     summary: Validate a coupon code
 *     tags: [User Coupons]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized
 */