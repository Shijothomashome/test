import express from "express";
const router = express.Router();
import passport from "passport";
import middlewares from "../middlewares/index.js";
import userValidatorSchemas from "../validators/index.js";
import authControllers from "../controllers/auth/index.js";
import testResponse from "../utils/testResponseUtils.js";

// TEST Protected Route
router.get("/protected", middlewares.authenticate(["customer", "admin"]), testResponse);

// GOOGLE AUTH
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "api/v1/auth/google/failure" }),
    authControllers.googleCallback
);
router.get("/google/failure", authControllers.googleFailureLogin);

// REGISTER AND LOGIN
router.post("/customer/register", middlewares.validatorMiddleware(userValidatorSchemas.userSchema), authControllers.customerRegister);
router.post("/customer/login", middlewares.validatorMiddleware(userValidatorSchemas.loginSchema), authControllers.customerLogin);
router.post("/customer/otp-login", authControllers.customerOTPLogin);
router.post("/otp/send", authControllers.sendOTP);
router.post("/otp/verify", authControllers.verifyOTP);
router.post(
    "/customer/password-reset",
    middlewares.validatorMiddleware(userValidatorSchemas.passwordResetSchema),
    authControllers.customerPasswordReset
);
router.get("/regenerate-accessToken", authControllers.regenerateAccessToken);
router.get("/logout", middlewares.authenticate(["customer", "admin"]), authControllers.logout);
router.get("/me", middlewares.authenticate(["customer", "admin"]), authControllers.me);

export default router;
