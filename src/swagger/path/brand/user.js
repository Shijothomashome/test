/**
 * @swagger
 * /brands/customer/brands:
 *   get:
 *     summary: Get a paginated list of active and non-deleted brands (Customer)
 *     tags:
 *       - Brands (Customer)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of brands per page (default is 10)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query to filter brands by name
 *     responses:
 *       200:
 *         description: List of brands fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalCount:
 *                       type: integer
 *                       example: 30
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60f8a2c4b1e3a42f88e1d2a7"
 *                       name:
 *                         type: string
 *                         example: "Nike"
 *                       logo:
 *                         type: string
 *                         example: "https://cdn.example.com/logos/nike.png"
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal server error
 */
