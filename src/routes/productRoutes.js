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

const router = express.Router();

// Product CRUD routes
router
  .route("/")
  .post(validate(createProductSchema), createProduct)
  .get(validate(productListSchema, { query: true }), getProducts);

router
  .route("/search")
  .get(validate(productSearchSchema, { query: true }), searchProducts);

// Variant management routes
router
  .route("/:id/variants")
  .get(getProductVariants)
  .post(validate(variantSchema), addVariants)
  .put(validate(Joi.array().items(variantUpdateSchema)), updateVariants);

// router.route("/generate-variants").post, generateVariants;

router
  .route("/:productId/variants/:variantId")
  .put(validate(variantUpdateSchema), updateVariant);

router
  .route("/:productId/variant-groups/:groupValue")
  .put(validate(variantGroupUpdateSchema), updateVariantGroup);

// Product discovery routes
router.route("/category/:categoryId").get(getProductsByCategory);
router.route("/brand/:brandId").get(getProductsByBrand);
router.route("/:productId/recommended").get(getRecommendedProducts);
router.route("/:productId/similar").get(getSimilarProducts);
// router.route("/best-selling").get(getBestSellingProducts);
router.route("/featured").get(getFeaturedProducts);

router
  .route("/:id")
  .get(getProductById)
  .put(validate(updateProductSchema), updateProduct)
  .delete(deleteProduct);

export default router;
