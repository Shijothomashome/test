import express from 'express';
const router = express.Router();
import passport from 'passport';
import authenticate from '../middlewares/authenticate.js';
import { sendOTP, verifyOTP } from '../controllers/auth/OTPVerification.js';
import { customerRegister, customerLogin, customerPasswordReset, OTPLogin } from '../controllers/auth/customerAuth.js';
import { userSchema, loginSchema, passwordResetSchema } from '../validators/userValidatorSchemas.js'
import { regenerateAccessToken } from '../controllers/auth/regenerateAccessToken.js';
import logout from '../controllers/auth/logout.js';
import validatorMiddleware from '../middlewares/validatorMiddleware.js';
import googleCallback from '../controllers/auth/googleCallback.js'

// TEST Protected Route
router.get('/protected', authenticate(['customer', 'admin']), (req, res) => {
    res.json({ message: 'You are authenticated', user: req.user });
});

// GOOGLE AUTH
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email',] }));
// GOOGLE CALLBACK
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: 'api/v1/auth/google', }), googleCallback);

router.post('/otp/send', sendOTP);
router.post('/otp/verify', verifyOTP);
router.post('/customer/register', validatorMiddleware(userSchema), customerRegister);
router.post('/customer/login', validatorMiddleware(loginSchema), customerLogin);
router.post('/customer/password-reset', validatorMiddleware(passwordResetSchema), customerPasswordReset);
router.post('/customer/otp-login', OTPLogin);

router.get("/regenerate-accessToken", regenerateAccessToken)

// LOGOUT
router.get("/logout", authenticate(['customer', 'admin']), logout)

export default router;
