import { OTP_PURPOSES } from "../config/index.js";

const validateOtpInput = ({ email, phone, purpose, user_id }) => {
    if (!OTP_PURPOSES.includes(purpose)) {
        return `Invalid purpose "${purpose}". Allowed values are: ${OTP_PURPOSES.join(', ')}`;
    }

    if (['verify-email', 'login-email'].includes(purpose) && !email) {
        return `Email is required for purpose: "${purpose}"`;
    }

    if (['verify-phone', 'login-phone'].includes(purpose) && !phone) {
        return `Phone is required for purpose: "${purpose}"`;
    }

    if (purpose === 'reset-password' && !email && !phone) {
        return `Email or phone is required for purpose: "${purpose}"`;
    }

    if (email && phone) {
        return 'Provide either email or phone, not both';
    }

    return null;
};

export default validateOtpInput;