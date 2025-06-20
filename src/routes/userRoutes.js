import express from "express";
import userProfileController from '../controllers/userProfile/index.js';
import middlewares from "../middlewares/index.js";
import updateUserProfileSchema from "../validators/userProfileValidation.js";
import upload from "../config/multerConfig.js";
const router = express.Router();

//user
router.get('/me',userProfileController.getUserProfile)
router.delete('/me',userProfileController.deleteUserProfile)
router.put('/me',upload.single("image"),middlewares.validatorMiddleware(updateUserProfileSchema),userProfileController.updateUserProfile)
export default router;
