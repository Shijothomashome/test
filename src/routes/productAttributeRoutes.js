import express from "express";
import attributeControllers from "../controllers/attributes/index.js";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import attributeValidation from "../validators/index.js";

const router = express.Router();

// ADMIN ROUTES
router.post("/admin/product/attributes",validatorMiddleware(attributeValidation.createAttributeSchema), attributeControllers.createAttribute);
router.get("/admin/product/attributes/:id",validatorMiddleware(attributeValidation.getAttributesSchema), attributeControllers.getAttributeById);
router.put("/admin/product/attributes/:id",validatorMiddleware(attributeValidation.updateAttributeSchema), attributeControllers.updateAttribute);
router.delete("/admin/product/attributes/:id",validatorMiddleware(attributeValidation.getAttributesSchema), attributeControllers.deleteAttribute);
// USER ROUTES
router.get("/product/attributes",validatorMiddleware(attributeValidation.getAttributesSchema), attributeControllers.getAllAttributes);

export default router;