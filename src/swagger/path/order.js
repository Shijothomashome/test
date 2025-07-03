/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Order management endpoints
 *   - name: Admin Orders
 *     description: Admin-only order management
 *   - name: Returns
 *     description: Order return processing
 */

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
 *             $ref: '#/components/schemas/OrderItem'
 *         shippingAddress:
 *           $ref: '#/components/schemas/Address'
 *         paymentDetails:
 *           $ref: '#/components/schemas/PaymentDetails'
 *         subTotal:
 *           type: number
 *         totalAmount:
 *           type: number
 *         orderStatus:
 *           type: string
 *           enum: [PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURN_REQUESTED, PARTIALLY_RETURNED, RETURN_COMPLETED]
 *         trackingNumber:
 *           type: string
 *         deliveryDate:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         returns:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ReturnRequest'
 * 
 *     OrderItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *         variantId:
 *           type: string
 *         quantity:
 *           type: number
 *         price:
 *           type: number
 *         mrp:
 *           type: number
 * 
 *     Address:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         phone:
 *           type: string
 *         addressLine1:
 *           type: string
 *         addressLine2:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         pincode:
 *           type: string
 *         country:
 *           type: string
 *           default: "India"
 * 
 *     PaymentDetails:
 *       type: object
 *       properties:
 *         paymentMethod:
 *           type: string
 *           enum: [COD, ONLINE]
 *         paymentStatus:
 *           type: string
 *           enum: [PENDING, COMPLETED, FAILED, REFUNDED]
 *         transactionId:
 *           type: string
 * 
 *     ReturnRequest:
 *       type: object
 *       properties:
 *         returnId:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ReturnItem'
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *         requestedAt:
 *           type: string
 *           format: date-time
 *         processedAt:
 *           type: string
 *           format: date-time
 *         reason:
 *           type: string
 *         paymentMethod:
 *           type: string
 *           enum: [COD, ONLINE]
 *         refundAmount:
 *           type: number
 *         refundId:
 *           type: string
 *         refundStatus:
 *           type: string
 *         comments:
 *           type: string
 * 
 *     ReturnItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *         variantId:
 *           type: string
 *         originalQuantity:
 *           type: number
 *         returnQuantity:
 *           type: number
 *         returnReason:
 *           type: string
 *         returnStatus:
 *           type: string
 *           enum: [REQUESTED, APPROVED, REJECTED]
 *         price:
 *           type: number
 * 
 *     OrderAnalytics:
 *       type: object
 *       properties:
 *         statusCounts:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               count:
 *                 type: number
 *         salesOverTime:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               totalSales:
 *                 type: number
 *               count:
 *                 type: number
 *         topProducts:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               totalQuantity:
 *                 type: number
 *               totalRevenue:
 *                 type: number
 * 
 *     PaginatedOrders:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Order'
 *         total:
 *           type: number
 *         pages:
 *           type: number
 *         currentPage:
 *           type: number
 */

/**
 * @swagger
 * /user/orders:
 *   get:
 *     summary: Get all orders for current user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by order status
 *     responses:
 *       200:
 *         description: List of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedOrders'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/orders/{orderId}:
 *   get:
 *     summary: Get order details
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/orders/{orderId}/cancel:
 *   put:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Order cannot be cancelled
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/orders/{orderId}/track:
 *   get:
 *     summary: Track order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order tracking information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 status:
 *                   type: string
 *                 trackingNumber:
 *                   type: string
 *                 estimatedDelivery:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/orders/{orderId}/return:
 *   post:
 *     summary: Request order return
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *               - items
 *             properties:
 *               reason:
 *                 type: string
 *                 description: General reason for return
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - variantId
 *                     - quantity
 *                     - reason
 *                   properties:
 *                     productId:
 *                       type: string
 *                     variantId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     reason:
 *                       type: string
 *     responses:
 *       200:
 *         description: Return request submitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 returnId:
 *                   type: string
 *                 nextSteps:
 *                   type: string
 *       400:
 *         description: Invalid return request
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Get all orders (Admin)
 *     tags: [Admin Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by order status
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedOrders'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /admin/orders/{orderId}/status:
 *   put:
 *     summary: Update order status (Admin)
 *     tags: [Admin Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PROCESSING, SHIPPED, DELIVERED, CANCELLED]
 *               trackingNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /admin/orders/analytics:
 *   get:
 *     summary: Get order analytics (Admin)
 *     tags: [Admin Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to analyze
 *     responses:
 *       200:
 *         description: Order analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 analytics:
 *                   $ref: '#/components/schemas/OrderAnalytics'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /admin/orders/{orderId}/returns/{returnId}:
 *   post:
 *     summary: Process return request (Admin)
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *       - in: path
 *         name: returnId
 *         required: true
 *         schema:
 *           type: string
 *         description: Return request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [APPROVE, REJECT]
 *               refundAmount:
 *                 type: number
 *                 description: Required for non-COD returns when approving
 *               comments:
 *                 type: string
 *               restockingFee:
 *                 type: number
 *                 description: Deduction from refund
 *     responses:
 *       200:
 *         description: Return request processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 returnRequest:
 *                   type: object
 *                   properties:
 *                     returnId:
 *                       type: string
 *                     status:
 *                       type: string
 *                     refundAmount:
 *                       type: number
 *                     processedAt:
 *                       type: string
 *                       format: date-time
 *                     comments:
 *                       type: string
 *       400:
 *         description: Invalid action or missing refund amount
 *       404:
 *         description: Order or return request not found
 *       500:
 *         description: Internal server error
 */