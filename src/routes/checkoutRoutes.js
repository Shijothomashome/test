import express from "express";
import { initiateCheckout, verifyPayment } from "../controllers/checkout/checkoutController.js";

const router = express.Router();

// Route 1: Initiate Checkout (COD or Online Payment)
router.post("/checkout",initiateCheckout);

// Route 2: Verify Razorpay Payment (Webhook or Frontend Callback)
router.post( "/checkout/verify-payment", verifyPayment);

export default router;
