import express from 'express';
import passport from 'passport';

import googleCallback from '../controller/auth/googleCallback.js';


const router = express.Router();

// 🌐 GOOGLE AUTH
router.get('/', passport.authenticate('google', {
    scope: [
        'profile',
        'email',
    ]
}));
// 🔁 GOOGLE CALLBACK
router.get('/callback', passport.authenticate('google', { session: false, failureRedirect: 'api/v1/auth/google', }), googleCallback);



export default router;
