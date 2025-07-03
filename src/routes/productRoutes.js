import Joi from "joi";

import express from "express";
import {
  createProduct,
  deleteProduct,
  // getBestSellingProducts,
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
} from "../validators/productValidation.js";
import variantSchema from "../models/productVariantModel.js";
import { getProductVariant } from "../controllers/variants/getProductVariant.js";
// import { getCollectionProductsWithCache } from "../controllers/collection/smartCollections.js";

const router = express.Router();

// Product CRUD routes


// router.get("/user/orders", getUserOrdersByUser);

// Admin Routes
router.post("/admin/products", validate(createProductSchema), createProduct);
router.put("/admin/products/:id/variants", validate(variantSchema), addVariants);
router.put("/admin/products/:id/variants", validate(Joi.array().items(variantUpdateSchema)), updateVariants);
router.put("/admin/products/:productId/variants/:variantId", validate(variantUpdateSchema), updateVariant);
router.put("/admin/products/:productId/variant-groups/:groupValue", validate(variantGroupUpdateSchema), updateVariantGroup);
router.put("/admin/products/:id", validate(updateProductSchema), updateProduct);
router.delete("/admin/products/:id", deleteProduct);


// User Routes
router.get("/products", validate(productListSchema, { query: true }), getProducts);
router.get("/products/search", validate(productSearchSchema, { query: true }), searchProducts);
router.get("/products/:id/variants", getProductVariants);
router.get("/products/:productId/variants/:variantId", getProductVariant);
router.get("/products/category/:categoryId", getProductsByCategory);
router.get("/products/brand/:brandId", getProductsByBrand);
router.get("/products/:productId/recommended", getRecommendedProducts);
router.get("/products/:productId/similar", getProductVariant);
// router.get("/products/best-selling", getBestSellingProducts);
router.get("/products/featured", getFeaturedProducts);
router.get("/products/:id", getProductById);

// router.route('/:id/products/cached')
//   .get(getCollectionProductsWithCache);

//Admin Product Collection Routes
router.route('/admin/products/:id/convert')
  .post(async (req, res) => {
    try {
      const collection = await convertCollectionType(
        req.params.id,
        req.body.newType,
        req.body.rules
      );
      res.json({ success: true, data: collection });
    } catch (error) {
      handleError(res, error);
    }
  });

router.route('/admin/products/:id/suggest-rules')
  .get(async (req, res) => {
    try {
      const rules = await suggestSmartCollectionRules(req.params.id);
      res.json({ success: true, data: rules });
    } catch (error) {
      handleError(res, error);
    }
  });


export default router;
