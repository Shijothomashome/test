import express from "express";
import {
  createAttribute,
  deleteAttribute,
  getAllAttributes,
  getAttributeById,
  updateAttribute,
} from "../controllers/attributes/index.js";
import { validate } from "../middlewares/validate.js";
import { 
  createAttributeSchema,
  updateAttributeSchema,
  getAttributesSchema
} from "../validators/attributeValidation.js";

const router = express.Router();

router.route("/")
  .get(validate(getAttributesSchema), getAllAttributes)
  .post(validate(createAttributeSchema), createAttribute);

router.route("/:id")
  .get(getAttributeById)
  .put(validate(updateAttributeSchema), updateAttribute)
  .delete(deleteAttribute);

export default router;