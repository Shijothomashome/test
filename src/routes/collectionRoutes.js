import express from "express";
import { validate } from "../middlewares/validate.js";
import {
  createCollectionSchema,
  updateCollectionSchema,
  updateCollectionProductsSchema,
  collectionListSchema
} from "../validators/collectionValidation.js";
import { getCollections } from "../controllers/collection/getCollections.js";
import { getCollectionById } from "../controllers/collection/getCollectionById.js";
import { getCollectionProducts } from "../controllers/collection/getCollectionProducts.js";
import { createCollection } from "../controllers/collection/createCollection.js";
import { updateCollection } from "../controllers/collection/updateCollection.js";
import { updateCollectionProducts } from "../controllers/collection/updateCollectionProducts.js";
import { updateProductCollections } from "../controllers/collection/updateProductCollections.js";
import { deleteCollection } from "../controllers/collection/deleteCollection.js";
// import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ADMIN routes
router.get("/admin/collections/:id", getCollectionById);
router.post("/admin/collections",  validate(createCollectionSchema),createCollection);
router.put("/admin/collections/:id", validate(updateCollectionSchema), updateCollection);
router.put("/admin/collections/:id/products", validate(updateCollectionProductsSchema), updateCollectionProducts);
router.put("/admin/products/:productId/collections", updateProductCollections);
router.delete("/admin/collections/:id", deleteCollection);

// USER routes
router.get("/collections", validate(collectionListSchema, { query: true }), getCollections);
router.get("/collections/:id/products", getCollectionProducts);

export default router;