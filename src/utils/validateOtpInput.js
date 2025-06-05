import { OTP_PURPOSES } from "../config/index.js";

export const validateOtpInput = ({ email, phone, purpose, user_id }) => {
    if (!OTP_PURPOSES.includes(purpose)) {
        return 'Invalid purpose. Allowed values are: ' + OTP_PURPOSES.join(', ');
    }
    if (purpose === 'verify-email' && !email) {
        return 'Email is required for email verification';
    }
    if (purpose === 'verify-phone' && !phone) {
        return 'Phone is required for phone verification';
    }
    if (purpose === 'reset-password' && !email && !phone) {
        return 'Email or phone is required for password reset';
    }

    if (email && phone) {
        return 'Provide either email or phone, not both';
    }
    return null;
};
