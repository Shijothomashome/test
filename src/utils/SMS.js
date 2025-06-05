// Import Twilio credentials
import {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_SERVICE_SID,
    TWILIO_PHONE_NUMBER
} from '../config/index.js';

// Import and initialize Twilio client
import twilio from 'twilio';
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// ✅ Send OTP using Twilio Verify Service
const SEND_SMS_OTP = async (phoneNumber) => {
    try {
        if (!phoneNumber) {
            return { valid: false, error: 'Phone number is required to send an OTP.' };
        }

        const verification = await client.verify.v2
            .services(TWILIO_SERVICE_SID)
            .verifications.create({
                to: `+91${phoneNumber}`,
                channel: 'sms',
            });

        return {
            valid: true,
            sid: verification.sid,
            message: 'OTP has been sent to your mobile number.'
        };
    } catch (error) {
        console.error('Error sending OTP:', error);
        return {
            valid: false,
            error: 'Failed to send OTP. Please try again later.'
        };
    }
};

// ✅ Verify OTP using Twilio Verify Service
const VERIFY_SEND_SMS_OTP = async (phoneNumber, otp) => {
    try {
        if (!otp || otp.trim().length !== 6) {
            return { valid: false, error: 'Please enter a valid 6-digit OTP.' };
        }
        if (!phoneNumber) {
            return { valid: false, error: 'Phone number is required to verify the OTP.' };
        }

        const verificationCheck = await client.verify.v2
            .services(TWILIO_SERVICE_SID)
            .verificationChecks.create({
                to: `+91${phoneNumber}`,
                code: otp.trim(),
            });

        if (verificationCheck.status === "approved") {
            return { valid: true, message: 'OTP verification successful.' };
        } else {
            return { valid: false, message: 'The OTP is incorrect or has expired.' };
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return {
            valid: false,
            error: 'Failed to verify OTP. Please try again later.'
        };
    }
};

// ✅ Send SMS manually (non-OTP)
const SEND_SMS = async (phoneNumber, content, value) => {
    try {
        if (!phoneNumber) {
            return { valid: false, error: 'Phone number is required to send a message.' };
        }

        const message = await client.messages.create({
            body: content,
            from: TWILIO_PHONE_NUMBER, 
            to: `+91${phoneNumber}`,
        });

        console.log('Message sent! SID:', message.sid);
        return {
            valid: true,
            sid: message.sid,
            message: 'Message sent successfully.',
            body: message.body,
            value,
        };
    } catch (error) {
        console.error('Error sending SMS:', error);
        return {
            valid: false,
            error: 'Failed to send message. Please try again later.'
        };
    }
};

// ✅ Generate random OTP
const RANDOM_OTP = (digit = 6) => {
    const min = Math.pow(10, digit - 1);
    const max = Math.pow(10, digit) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ✅ OTP message template
const otpContext = (otp) => {
    return `Your verification code is ${otp}. Please do not share it with anyone.`;
};

// ✅ Send OTP manually via SMS
const SEND_SMS_OTP_MANUALLY = async (phoneNumber) => {
    const otp = RANDOM_OTP(6);
    const result = await SEND_SMS(phoneNumber, otpContext(otp));
    return { ...result, otp }; // Expose OTP for backend/db use
};


// ✅ Export all functions
export {
    SEND_SMS_OTP,
    VERIFY_SEND_SMS_OTP,
    SEND_SMS,
    SEND_SMS_OTP_MANUALLY,
    RANDOM_OTP,
};
