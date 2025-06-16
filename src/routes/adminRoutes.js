import express from "express";
const router = express.Router();
import adminProfileController from "../controllers/adminProfile/index.js";

router.get('/me',adminProfileController.getAdminProfile)
router.delete('/me',adminProfileController.deleteAdminProfile)
export default router;