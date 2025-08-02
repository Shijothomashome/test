import Joi from "joi";
import express from "express";
import {
    bulkDeleteProducts,
    createProduct,
    deleteProduct,
    getBestSellingProducts,
    getFeaturedProducts,
    getProductById,
    getProducts,
    getProductsByBrand,
    getProductsByCategory,
    getRecommendedProducts,
    getSimilarProducts,
    searchProducts,
    updateProduct,
} from "../controllers/products/index.js";
import {
    getProductVariants,
    updateVariant,
    updateVariantGroup,
    updateVariants,
    addVariants,
    generateVariants,
} from "../controllers/variants/index.js";
import { validate } from "../middlewares/validate.js";
import {
    createProductSchema,
    updateProductSchema,
    variantUpdateSchema,
    variantGroupUpdateSchema,
    productSearchSchema,
    productListSchema,
    toggleDealOfTheDaySchema,
    getDealsOfTheDaySchema,
    toggleFeaturedSchema,
} from "../validators/productValidation.js";
import variantSchema from "../models/productVariantModel.js";
import { getProductVariant } from "../controllers/variants/getProductVariant.js";
import authenticate from "../middlewares/authenticate.js";
import { toggleDealOfTheDay } from "../controllers/products/toggleDealOfTheDay.js";
import { getDealsOfTheDay } from "../controllers/products/getDealsOfTheDay.js";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import { toggleFeatured } from "../controllers/products/toggleFeatured.js";
import { getAllProducts } from "../controllers/products/getAllProducts.js";
import { setIsFeaturedProduct } from "../controllers/products/setIsFeaturedProduct.js";
import { setIsDealOfTheDay } from "../controllers/products/setDealOfTheDayProduct.js";
import { getProductImages } from "../controllers/products/getAllImages.js";
import { toggleProductStatus } from "../controllers/products/toggleIsActive.js";

const router = express.Router();

// Admin Product Routes - Require admin privileges
router.post(
    "/admin/products",
    // authenticate(['admin']),
    // validate(createProductSchema),
    createProduct
);

router.put(
    "/admin/products/:id/variants",
    // authenticate(['admin']),
    validate(variantSchema),
    addVariants
);

router.put(
    "/admin/products/:id/variants",
    // authenticate(['admin']),
    validate(Joi.array().items(variantUpdateSchema)),
    updateVariants
);

router.put(
    "/admin/products/:productId/variants/:variantId",
    // authenticate(['admin']),
    validate(variantUpdateSchema),
    updateVariant
);

router.put(
    "/admin/products/:productId/variant-groups/:groupValue",
    // authenticate(['admin']),
    validate(variantGroupUpdateSchema),
    updateVariantGroup
);

router.put(
    "/admin/products/:id",
    // authenticate(['admin']),
    validate(updateProductSchema),
    updateProduct
);

router.delete(
    "/admin/products/bulk-delete",
    // authenticate(["admin"]),
    bulkDeleteProducts
);

router.delete(
    "/admin/products/:id",
    // authenticate(['admin']),
    deleteProduct
);

router.patch(
    "/admin/products/deal-of-the-day",
    // authenticate(["admin"]),
    validatorMiddleware(toggleDealOfTheDaySchema),
    toggleDealOfTheDay
);

router.patch(
    "/admin/products/featured",
    // authenticate(["admin"]),
    validatorMiddleware(toggleFeaturedSchema),
    toggleFeatured
);

// User Product Routes - Public access (some may require authentication if needed)
router.get("/products", validate(productListSchema, { query: true }), getProducts);

router.get("/products/search", validate(productSearchSchema, { query: true }), searchProducts);

router.get("/products/:id/variants", getProductVariants);

router.get("/products/:productId/variants/:variantId", getProductVariant);

router.get("/products/category/:categoryId", getProductsByCategory);

router.get("/products/brand/:brandId", getProductsByBrand);

router.get("/products/:productId/recommended", getRecommendedProducts);

router.get("/products/:productId/similar", getSimilarProducts);

router.get("/admin/products", getAllProducts);

router.get("/products/best-seller", getBestSellingProducts);

router.get("/products/featured", getFeaturedProducts);
router.get("/products/deal-of-the-day", validatorMiddleware(getDealsOfTheDaySchema), getDealsOfTheDay);

router.get("/products/:id", (req, res, next) => getProductById(req, res, next));

// Admin Product Collection Routes
router.post(
    "/admin/products/:id/convert",
    // authenticate(['admin']),
    async (req, res) => {
        try {
            const collection = await convertCollectionType(req.params.id, req.body.newType, req.body.rules);
            res.json({ success: true, data: collection });
        } catch (error) {
            handleError(res, error);
        }
    }
);

router.get(
    "/admin/products/:id/suggest-rules",
    // authenticate(['admin']),
    async (req, res) => {
        try {
            const rules = await suggestSmartCollectionRules(req.params.id);
            res.json({ success: true, data: rules });
        } catch (error) {
            handleError(res, error);
        }
    }
);

router.patch("/admin/product/featured/:id", setIsFeaturedProduct);
router.patch("/admin/product/status/:id", toggleProductStatus);
router.patch("/admin/product/deal-of-the-day/:id", setIsDealOfTheDay);
router.patch("/admin/product/images/:id", getProductImages);

export default router;
