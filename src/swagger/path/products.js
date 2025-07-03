/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         name:
 *           type: string
 *           example: Premium T-Shirt
 *         slug:
 *           type: string
 *           example: premium-t-shirt
 *         description:
 *           type: string
 *           example: High quality cotton t-shirt
 *         category:
 *           type: string
 *           example: 507f1f77bcf86cd799439012
 *         brand:
 *           type: string
 *           example: 507f1f77bcf86cd799439013
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["men", "cotton", "summer"]
 *         thumbnail:
 *           type: string
 *           example: https://example.com/images/tshirt.jpg
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://example.com/images/tshirt1.jpg", "https://example.com/images/tshirt2.jpg"]
 *         collection_ids:
 *           type: array
 *           items:
 *             type: string
 *           example: ["507f1f77bcf86cd799439014"]
 *         variantAttributes:
 *           type: array
 *           items:
 *             type: string
 *           example: ["507f1f77bcf86cd799439015"]
 *         hasVariants:
 *           type: boolean
 *           example: true
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductVariant'
 *         basePrice:
 *           type: object
 *           properties:
 *             mrp:
 *               type: number
 *               example: 29.99
 *             sellingPrice:
 *               type: number
 *               example: 24.99
 *             costPrice:
 *               type: number
 *               example: 15.00
 *         minPrice:
 *           type: number
 *           example: 24.99
 *         maxPrice:
 *           type: number
 *           example: 34.99
 *         baseInventory:
 *           type: object
 *           properties:
 *             stock:
 *               type: number
 *               example: 100
 *             lowStockThreshold:
 *               type: number
 *               example: 10
 *             backorder:
 *               type: boolean
 *               example: false
 *             trackInventory:
 *               type: boolean
 *               example: true
 *         isFreeShipping:
 *           type: boolean
 *           example: false
 *         shippingClass:
 *           type: string
 *           enum: ["Standard", "Fragile", "Oversized", "Heavy", "Express", "Cold Storage", "Digital", "Custom"]
 *           example: "Standard"
 *         taxable:
 *           type: boolean
 *           example: true
 *         taxCode:
 *           type: string
 *           example: "CLOTHING"
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
 *         isActive:
 *           type: boolean
 *           example: true
 *         isFeatured:
 *           type: boolean
 *           example: false
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     ProductVariant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439016
 *         attributes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               attribute:
 *                 type: string
 *                 example: "color"
 *               value:
 *                 type: string
 *                 example: "red"
 *         sku:
 *           type: string
 *           example: "TSHIRT-RED-M"
 *         price:
 *           type: object
 *           properties:
 *             mrp:
 *               type: number
 *               example: 29.99
 *             sellingPrice:
 *               type: number
 *               example: 24.99
 *             costPrice:
 *               type: number
 *               example: 15.00
 *         inventory:
 *           type: object
 *           properties:
 *             stock:
 *               type: number
 *               example: 50
 *             lowStockThreshold:
 *               type: number
 *               example: 5
 *             backorder:
 *               type: boolean
 *               example: false
 *             trackInventory:
 *               type: boolean
 *               example: true
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://example.com/images/tshirt-red.jpg"]
 *         isActive:
 *           type: boolean
 *           example: true
 * 
 *     ProductListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             products:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *             pagination:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   example: 100
 *                 limit:
 *                   type: number
 *                   example: 10
 *                 page:
 *                   type: number
 *                   example: 1
 *                 pages:
 *                   type: number
 *                   example: 10
 *                 hasNextPage:
 *                   type: boolean
 *                   example: true
 *                 hasPrevPage:
 *                   type: boolean
 *                   example: false
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 * 
 *   get:
 *     summary: List all products
 *     tags: [Products]
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
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: -createdAt
 *         description: Sort field and direction (- for descending)
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 */

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: List of matching products
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
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID or slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID or slug
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 * 
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 * 
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /products/category/{categoryId}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
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
 *         description: List of products in category
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
 */

/**
 * @swagger
 * /products/brand/{brandId}:
 *   get:
 *     summary: Get products by brand
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: brandId
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
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
 *         description: List of products by brand
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
 */

/**
 * @swagger
 * /products/{productId}/recommended:
 *   get:
 *     summary: Get recommended products
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to get recommendations for
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of recommendations to return
 *     responses:
 *       200:
 *         description: List of recommended products
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
 */

/**
 * @swagger
 * /products/{productId}/similar:
 *   get:
 *     summary: Get similar products
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to find similar products for
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of similar products to return
 *     responses:
 *       200:
 *         description: List of similar products
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
 */

/**
 * @swagger
 * /products/featured:
 *   get:
 *     summary: Get featured products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of featured products to return
 *     responses:
 *       200:
 *         description: List of featured products
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
 */

/**
 * @swagger
 * /products/{id}/variants:
 *   get:
 *     summary: Get product variants
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of product variants
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
 *                     $ref: '#/components/schemas/ProductVariant'
 * 
 *   post:
 *     summary: Add variants to product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductVariant'
 *     responses:
 *       200:
 *         description: Variants added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 * 
 *   put:
 *     summary: Update multiple variants
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/ProductVariant'
 *     responses:
 *       200:
 *         description: Variants updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /products/{productId}/variants/{variantId}:
 *   get:
 *     summary: Get product variant
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Variant details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 *       404:
 *         description: Variant not found
 * 
 *   put:
 *     summary: Update product variant
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductVariant'
 *     responses:
 *       200:
 *         description: Variant updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /products/{productId}/variant-groups/{groupValue}:
 *   put:
 *     summary: Update variant group
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: path
 *         name: groupValue
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant group value to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: object
 *                 properties:
 *                   mrp:
 *                     type: number
 *                   sellingPrice:
 *                     type: number
 *                   costPrice:
 *                     type: number
 *               inventory:
 *                 type: object
 *                 properties:
 *                   stock:
 *                     type: number
 *                   lowStockThreshold:
 *                     type: number
 *                   backorder:
 *                     type: boolean
 *                   trackInventory:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Variant group updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */