import express from "express";
import userController from "../controllers/users/index.js";
import userProfileController from '../controllers/userProfile/index.js'
const router = express.Router();
//admin
router.get("/", userController.getAllUsers); // Fetch paginated and filtered list of all users (used in Admin Dashboard)
router.get("/:id", userController.getUser); // Retrieve detailed profile of a single user (used in Admin  Dashboard)

//user
router.get('/me/profile',userProfileController.getUserProfile)
router.delete('/me',userProfileController.deleteUserProfile)
export default router;
