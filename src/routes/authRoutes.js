import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/index.js';
import { authenticate } from '../middleware/authenticate.js';
import { OTP_SEND, OTP_VERIFY } from '../controller/auth/OTPVerification.js';
import { CustomerRegister, CustomerLogin, CustomerPasswordReset } from '../controller/auth/CustomerAuth.js';
import validate from '../middleware/validate.js';
import { userSchema, loginSchema, passwordResetSchema } from '../schema/userSchema.js';

const router = express.Router();

// 🌐 GOOGLE AUTH
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 🔁 GOOGLE CALLBACK
router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: 'api/v1/auth/google',
    }),
    (req, res) => {
        console.log('Google login successful:', req.user, req.session);
        const token = jwt.sign(
            { id: req.user._id, role: req.user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // use true in production with HTTPS
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ message: 'Google login successful', user: req.user });
    }
);
router.get('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false, // set to true in production with HTTPS
        sameSite: 'lax',
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

// 🔐 TEST Protected Route
router.get('/protected', authenticate(['customer', 'admin']), (req, res) => {
    res.json({ message: 'You are authenticated', user: req.user });
});

router.post('/otp/send', OTP_SEND);
router.post('/otp/verify', OTP_VERIFY);
router.post('/customer/register', validate(userSchema), CustomerRegister);
router.post('/customer/login', validate(loginSchema), CustomerLogin);
router.post('/customer/password-reset', validate(passwordResetSchema), CustomerPasswordReset);

export default router;
