import express from "express";
import { initiateCheckout, verifyPayment } from "../controllers/checkout/checkoutController.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// Route 1: Initiate Checkout (COD or Online Payment) - Requires authentication
router.post("/checkout",
  authenticate(),  // Only authenticated users can initiate checkout
  initiateCheckout
);

// Route 2: Verify Razorpay Payment (Webhook or Frontend Callback)
// Note: Payment verification typically doesn't require user authentication since:
// 1. Webhooks are called by Razorpay servers
// 2. Frontend callbacks need to work even if user session changes
router.post("/checkout/verify-payment", 
  verifyPayment
);

export default router;