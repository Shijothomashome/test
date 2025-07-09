import express from "express";
import {
    getOrderByUser,
    getUserOrdersByUser,
    cancelOrderByUser,
    trackOrderByUser,
    getAllOrdersByAdmin,
    updateOrderStatusByAdmin,
    getOrderAnalyticsByAdmin,
    returnOrderByUser,
    getUserOrdersByUserIdForAdmin
} from "../controllers/orders/index.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// User routes - require authentication
router.get("/user/orders", 
    // authenticate(),
    getUserOrdersByUser
);

router.get("/user/orders/:orderId", 
    // authenticate(),
    getOrderByUser
);

router.put("/user/orders/:orderId/cancel", 
    // authenticate(),
    cancelOrderByUser
);

router.get("/user/orders/:orderId/track", 
    // authenticate(),
    trackOrderByUser
);

router.post("/user/orders/:orderId/return", 
    // authenticate(),
    returnOrderByUser
);

// Admin routes - require admin privileges
router.get("/admin/orders", 
    // authenticate(['admin']),
    getAllOrdersByAdmin
);
router.get("/admin/orders/user/:userId", 
    // authenticate(['admin']),
    getUserOrdersByUserIdForAdmin
);

router.put("/admin/orders/:orderId/status", 
    // authenticate(['admin']),
    updateOrderStatusByAdmin
);

router.get("/admin/orders/analytics", 
    // authenticate(['admin']),
    getOrderAnalyticsByAdmin
);

export default router;