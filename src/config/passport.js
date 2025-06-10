// src/config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { GOOGLE_CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from './index.js';
import userModel from '../models/userModel.js';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google accessToken:', accessToken);
        console.log('Google refreshToken:', refreshToken);
        console.log('Google profile:', profile);
        let user = await userModel.findOne({ email: profile.emails?.[0]?.value});

        if (!user) {
          user = await userModel.create({
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            googleId: profile.id,
            profilePic: profile.photos?.[0]?.value,
            loginMethod: 'google',
            isVerified: true,
            role: 'customer',
            googleAccessToken: accessToken, // Store access token for future use
          });
        }else{
          // Update user if they already exist
          user.name = profile.displayName;
          user.googleId = profile.id;
          user.profilePic = profile.photos?.[0]?.value || user.profilePic; // Keep existing pic if not available
          user.loginMethod = 'google';
          user.isVerified = true; // Ensure the user is marked as verified
          user.googleAccessToken = accessToken; // Update access token
          await user.save();  
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
