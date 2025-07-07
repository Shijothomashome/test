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
router
  .route("/products")
  .post(validate(createProductSchema), createProduct)
  .get(validate(productListSchema, { query: true }), getProducts);

router
  .route("/products/search")
  .get(validate(productSearchSchema, { query: true }), searchProducts);

// Variant management routes
router
  .route("/products/:id/variants")
  .get(getProductVariants)
  .post(validate(variantSchema), addVariants)
  .put(validate(Joi.array().items(variantUpdateSchema)), updateVariants);

// router.route("/generate-variants").post, generateVariants;

router
  .route("/products/:productId/variants/:variantId")
  .get(getProductVariant)
  .put(validate(variantUpdateSchema), updateVariant);

router
  .route("/products/:productId/variant-groups/:groupValue")
  .put(validate(variantGroupUpdateSchema), updateVariantGroup);

// Product discovery routes
router.route("/products/category/:categoryId").get(getProductsByCategory);
router.route("/products/brand/:brandId").get(getProductsByBrand);
router.route("/products/:productId/recommended").get(getRecommendedProducts);
router.route("/products/:productId/similar").get(getSimilarProducts);
// router.route("/products/best-selling").get(getBestSellingProducts);
router.route("/products/featured").get(getFeaturedProducts);


// router.route('/:id/products/cached')
//   .get(getCollectionProductsWithCache);

router.route('/products/:id/convert')
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

router.route('/products/:id/suggest-rules')
  .get(async (req, res) => {
    try {
      const rules = await suggestSmartCollectionRules(req.params.id);
      res.json({ success: true, data: rules });
    } catch (error) {
      handleError(res, error);
    }
  });

router
  .route("/products/:id")
  .get(getProductById)
  .put(validate(updateProductSchema), updateProduct)
  .delete(deleteProduct);

export default router;
