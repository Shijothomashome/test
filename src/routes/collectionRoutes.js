import express from "express";
// import {
//   createCollection,
//   deleteCollection,
//   getCollectionById,
//   getCollectionProducts,
//   getCollections,
//   updateCollection,
//   updateCollectionProducts,
//   updateProductCollections
// } from "../controllers/collectionController.js";
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

// Public routes
router.get("/collections", validate(collectionListSchema, { query: true }), getCollections);
router.get("/collections/:id", getCollectionById);
router.get("/collections/:id/products", getCollectionProducts);

// Protected admin routes
router.post("/collections", 
  // authenticate, 
  // authorize('admin'), 
  validate(createCollectionSchema), 
  createCollection
);

router.put("/admin/collections/:id", 
  // authenticate, 
  // authorize('admin'), 
  validate(updateCollectionSchema), 
  updateCollection
);

router.delete("/admin/collections/:id", 
  // authenticate, 
  // authorize('admin'), 
  deleteCollection
);

router.put("/admin/collections/:id/products", 
  // authenticate, 
  // authorize('admin'), 
  validate(updateCollectionProductsSchema), 
  updateCollectionProducts
);

router.put("/admin/products/:productId/collections", 
  // authenticate, 
  // authorize('admin'), 
  updateProductCollections
);

export default router;