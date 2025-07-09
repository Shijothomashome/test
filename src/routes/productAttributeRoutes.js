import express from "express";
import attributeControllers from "../controllers/attributes/index.js";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import attributeValidation from "../validators/index.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// ADMIN ROUTES - Require admin privileges
router.post("/admin/product/attributes",
//   authenticate(['admin']),
  validatorMiddleware(attributeValidation.createAttributeSchema),
  attributeControllers.createAttribute
);

router.get("/admin/product/attributes/:id",
//   authenticate(['admin']),
  validatorMiddleware(attributeValidation.getAttributesSchema),
  attributeControllers.getAttributeById
);

router.put("/admin/product/attributes/:id",
//   authenticate(['admin']),
  validatorMiddleware(attributeValidation.updateAttributeSchema),
  attributeControllers.updateAttribute
);

router.delete("/admin/product/attributes/:id",
//   authenticate(['admin']),
  validatorMiddleware(attributeValidation.getAttributesSchema),
  attributeControllers.deleteAttribute
);

// USER ROUTES - Accessible to all authenticated users
router.get("/product/attributes",
//   authenticate(),
  validatorMiddleware(attributeValidation.getAttributesSchema),
  attributeControllers.getAllAttributes
);

export default router;