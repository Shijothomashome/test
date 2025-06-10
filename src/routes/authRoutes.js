import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { OTP_SEND, OTP_VERIFY } from '../controller/auth/OTPVerification.js';
import { CustomerRegister, CustomerLogin, CustomerPasswordReset, OtpLogin } from '../controller/auth/CustomerAuth.js';
import validate from '../middleware/validate.js';
import { userSchema, loginSchema, passwordResetSchema } from '../schema/userSchema.js';
import googleAuthRoutes from './googleAuthRoutes.js';
import { regenerateAccessToken } from '../controller/auth/regenerateAccessToken.js';
import logout from '../controller/auth/logout.js';
const router = express.Router();

router.use('/google', googleAuthRoutes);

// 🔐 TEST Protected Route
router.get('/protected', authenticate(['customer', 'admin']), (req, res) => {
    res.json({ message: 'You are authenticated', user: req.user });
});

router.post('/otp/send', OTP_SEND);
router.post('/otp/verify', OTP_VERIFY);
router.post('/customer/register', validate(userSchema), CustomerRegister);
router.post('/customer/login', validate(loginSchema), CustomerLogin);
router.post('/customer/password-reset', validate(passwordResetSchema), CustomerPasswordReset);
router.post('/customer/otp-login', OtpLogin);

router.get("/regenerate-accessToken", regenerateAccessToken)

// 🚪 LOGOUT
router.get("/logout", authenticate(['customer', 'admin']), logout)

export default router;
