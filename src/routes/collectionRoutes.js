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
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// ADMIN routes - Require admin privileges
router.get("/admin/collections/:id", 
  // authenticate(['admin']),
  getCollectionById
);

router.post("/admin/collections", 
  // authenticate(['admin']),
  validate(createCollectionSchema),
  createCollection
);

router.put("/admin/collections/:id", 
  // authenticate(['admin']),
  validate(updateCollectionSchema), 
  updateCollection
);

router.put("/admin/collections/:id/products", 
  // authenticate(['admin']),
  validate(updateCollectionProductsSchema), 
  updateCollectionProducts
);

router.put("/admin/products/:productId/collections", 
  // authenticate(['admin']),
  updateProductCollections
);

router.delete("/admin/collections/:id", 
  // authenticate(['admin']),
  deleteCollection
);

// USER routes - Accessible to all authenticated users
router.get("/collections", 
  // authenticate(),
  validate(collectionListSchema, { query: true }), 
  getCollections
);

router.get("/collections/:id/products", 
  // authenticate(),
  getCollectionProducts
);

export default router;