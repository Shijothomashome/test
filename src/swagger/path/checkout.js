/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
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
 *                 type: number
 *               price:
 *                 type: number
 *               mrp:
 *                 type: number
 *         shippingAddress:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             phone:
 *               type: string
 *             addressLine1:
 *               type: string
 *             addressLine2:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             pincode:
 *               type: string
 *             country:
 *               type: string
 *         paymentDetails:
 *           type: object
 *           properties:
 *             paymentMethod:
 *               type: string
 *               enum: [COD, ONLINE]
 *             paymentStatus:
 *               type: string
 *               enum: [PENDING, COMPLETED, FAILED]
 *         subTotal:
 *           type: number
 *         totalAmount:
 *           type: number
 *         orderStatus:
 *           type: string
 *           enum: [PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   - name: Checkout
 *     description: Order checkout and payment processing
 */

/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Initiate checkout process
 *     description: Creates a new order and processes payment based on the selected method (COD or ONLINE)
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shippingAddress
 *               - paymentMethod
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 required:
 *                   - name
 *                   - phone
 *                   - addressLine1
 *                   - pincode
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   phone:
 *                     type: string
 *                     example: "9876543210"
 *                   addressLine1:
 *                     type: string
 *                     example: "123 Main Street"
 *                   addressLine2:
 *                     type: string
 *                     example: "Apartment 4B"
 *                   city:
 *                     type: string
 *                     example: "Mumbai"
 *                   state:
 *                     type: string
 *                     example: "Maharashtra"
 *                   pincode:
 *                     type: string
 *                     example: "400001"
 *                   country:
 *                     type: string
 *                     default: "India"
 *                     example: "India"
 *               paymentMethod:
 *                 type: string
 *                 enum: [COD, ONLINE]
 *                 example: "ONLINE"
 *                 description: "Payment method (Cash on Delivery or Online Payment)"
 *               couponCode:
 *                 type: string
 *                 example: "SUMMER20"
 *                 description: "Optional discount coupon code"
 *     responses:
 *       200:
 *         description: Order created successfully
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
 *                   example: "Order created successfully"
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *                 payment:
 *                   type: object
 *                   description: Payment details (for online payments)
 *                   properties:
 *                     razorpayOrderId:
 *                       type: string
 *                       example: "order_Lkfj34kj5k34j"
 *                     amount:
 *                       type: number
 *                       example: 1999
 *                     currency:
 *                       type: string
 *                       example: "INR"
 *       400:
 *         description: Bad request (missing fields, empty cart, etc.)
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
 *                   example: "Cart is empty"
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
 *                   example: "Checkout failed"
 *                 error:
 *                   type: string
 *                   example: "Database connection error"
 */

/**
 * @swagger
 * /checkout/verify-payment:
 *   post:
 *     summary: Verify Razorpay payment
 *     description: Verifies the signature and updates payment and order status after successful payment
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - paymentId
 *               - signature
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "order_Lkfj34kj5k34j"
 *                 description: "Razorpay order ID"
 *               paymentId:
 *                 type: string
 *                 example: "pay_Lkfj34kj5k34j"
 *                 description: "Razorpay payment ID"
 *               signature:
 *                 type: string
 *                 example: "a1b2c3d4e5f6g7h8i9j0..."
 *                 description: "Razorpay signature for verification"
 *     responses:
 *       200:
 *         description: Payment verified successfully
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
 *                   example: "Payment verified successfully"
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid payment signature or payment not found
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
 *                   example: "Invalid payment signature"
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
 *                   example: "Payment verification failed"
 *                 error:
 *                   type: string
 *                   example: "Database connection error"
 */