import express from "express";
import authenticate from "../middlewares/authenticate.js";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import reviewValidatorSchemas from "../validators/reviewValidatorSchemas.js";
import { getAllReviews } from "../controllers/review/getAllReviews.js";
import { updateReviewStatus } from "../controllers/review/updateReviewStatus.js";
import { deleteReview } from "../controllers/review/deleteReview.js";
import { createReview } from "../controllers/review/createReview.js";
import { getProductReviews } from "../controllers/review/getProductReviews.js";
import { getReview } from "../controllers/review/getReview.js";
import { updateReview } from "../controllers/review/updateReview.js";
import { toggleHelpful } from "../controllers/review/toggleHelpful.js";

const router = express.Router();

// ADMIN ROUTES - Only accessible by users with 'admin' role
router.get(
  "/admin/reviews",
  authenticate(["admin"]),
  validatorMiddleware(reviewValidatorSchemas.getAllReviewsForAdminQuerySchema),
  getAllReviews
);

router.put(
  "/admin/reviews/:id/status",
  authenticate(["admin"]),
  validatorMiddleware(reviewValidatorSchemas.updateReviewStatusSchema),
  updateReviewStatus
);

router.delete(
  "/admin/reviews/:id",
  authenticate(["admin"]),
  validatorMiddleware(reviewValidatorSchemas.deleteReviewByAdminSchema),
  deleteReview
);

// CUSTOMER ROUTES - Accessible by all authenticated users
router.post(
  "/reviews",
  authenticate(["customer", "admin"]),
  validatorMiddleware(reviewValidatorSchemas.createReviewSchema),
  createReview
);

router.get(
  "/products/:id/reviews",
  authenticate(),
  validatorMiddleware(reviewValidatorSchemas.getProductReviewsQuerySchema),
  getProductReviews
);

router.get(
  "/reviews/:id",
  authenticate(),
  validatorMiddleware(reviewValidatorSchemas.getReviewByIdSchema),
  getReview
);

router.put(
  "/reviews/:id",
  authenticate(["customer", "admin"]),
  validatorMiddleware(reviewValidatorSchemas.updateReviewSchema),
  updateReview
);

router.post(
  "/reviews/:id/helpful",
  authenticate(["customer", "admin"]),
  validatorMiddleware(reviewValidatorSchemas.toggleHelpfulSchema),
  toggleHelpful
);

export default router;