import express from "express";
const router = express.Router();
import adminProfileController from "../controllers/adminProfile/index.js";
import userController from "../controllers/users/index.js";
import middlewares from "../middlewares/index.js";
import updateUserProfileSchema from "../validators/userProfileValidation.js";
import upload from "../config/multerConfig.js";
// admin profile
router.get('/me',adminProfileController.getAdminProfile)
router.delete('/me',adminProfileController.deleteAdminProfile)

//user profiles
router.get("/user", userController.getAllUsers); // Fetch paginated and filtered list of all users (used in Admin Dashboard)
router.delete("/user/:userId", userController.toggleUserDeletion); // Fetch paginated and filtered list of all users (used in Admin Dashboard)
router.patch("/user/block/:userId", userController.toggleUserBlocked); // Fetch paginated and filtered list of all users (used in Admin Dashboard)
router.get("/user/:id", userController.getUser); // Retrieve detailed profile of a single user (used in Admin  Dashboard)
router.put("/user/:id",upload.single("image"),middlewares.validatorMiddleware(updateUserProfileSchema),userController.updateUser)

export default router;