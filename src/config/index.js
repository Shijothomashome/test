import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
export const TWILIO_SERVICE_SID = process.env.TWILIO_SERVICE_SID;
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;

// Export app config
export const APP_NAME = process.env.APP_NAME;
export const APP_DESCRIPTION = process.env.APP_DESCRIPTION;
export const APP_LOGO = process.env.APP_LOGO;


export const OTP_PURPOSES = ['verify-email', 'verify-phone', 'reset-password'];
export const OTP_EXPIRY_MINUTES = 7;
