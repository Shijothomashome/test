import express from "express";
import {
    getOrderByUser,
    getUserOrdersByUser,
    cancelOrderByUser,
    trackOrderByUser,
    getAllOrdersByAdmin,
    updateOrderStatusByAdmin,
    getOrderAnalyticsByAdmin,
    returnOrderByUser
} from "../controllers/orders/index.js";

const router = express.Router();

// User routes
router.get("/user/orders", getUserOrdersByUser);
router.get("/user/orders/:orderId", getOrderByUser);
router.put("/user/orders/:orderId/cancel", cancelOrderByUser);
router.get("/user/orders/:orderId/track", trackOrderByUser);
router.post("/user/orders/:orderId/return", returnOrderByUser);

// Admin routes
router.get("/admin/orders", getAllOrdersByAdmin);
router.put("/admin/orders/:orderId/status", updateOrderStatusByAdmin);
router.get("/admin/orders/analytics", getOrderAnalyticsByAdmin);

export default router;