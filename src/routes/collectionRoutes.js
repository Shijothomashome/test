import express from "express";
import {
  createCollection,
  deleteCollection,
  getCollectionById,
  getCollectionProducts,
  getCollections,
  updateCollection,
  updateCollectionProducts,
} from "../controllers/collection/index.js";
import { validate } from "../middlewares/validate.js";
import {
  createCollectionSchema,
  updateCollectionSchema,
  updateCollectionProductsSchema,
  collectionListSchema
} from "../validators/collectionValidation.js";

const router = express.Router();

// Public routes
router.route("/")
  .get(validate(collectionListSchema, { query: true }), getCollections);

router.route("/:id").get(getCollectionById);
router.route("/:id/products").get(getCollectionProducts);

// Protected admin routes
router.route("/")
  .post(validate(createCollectionSchema), createCollection);

router.route("/:id")
  .put(validate(updateCollectionSchema), updateCollection)
  .delete(deleteCollection);

router.route("/:id/products")
  .put(validate(updateCollectionProductsSchema), updateCollectionProducts);

export default router;