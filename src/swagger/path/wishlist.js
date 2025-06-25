/**
 * @swagger
 * /wishlist:
 *   post:
 *     summary: Create or update the user's wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []  # JWT Bearer Token required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - variantId
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "665c4d982bcba53928a8e553"
 *                 description: MongoDB ObjectId of the product
 *               variantId:
 *                 type: string
 *                 example: "665c4fba2bcba53928a8e554"
 *                 description: MongoDB ObjectId of the product variant
 *     responses:
 *       200:
 *         description: Wishlist updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wishlist updated successfully
 *                 data:
 *                   type: object
 *                   description: The updated wishlist object
 *       400:
 *         description: Invalid productId or variantId
 *       404:
 *         description: User or Product not found
 *       500:
 *         description: Server error
 */
