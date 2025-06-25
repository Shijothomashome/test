import { OTP_PURPOSES } from "../config/index.js";

const validateOtpInput = ({ email, phone, purpose }) => {
    if (!OTP_PURPOSES.includes(purpose)) {
        return `Invalid purpose "${purpose}". Allowed values are: ${OTP_PURPOSES.join(', ')}`;
    }

    const isPhoneValid = phone && typeof phone === 'object' && phone.code && phone.number;

    if (['verify-email', 'login-email'].includes(purpose) && !email) {
        return `Email is required for purpose: "${purpose}"`;
    }

    if (['verify-phone', 'login-phone'].includes(purpose) && !isPhoneValid) {
        return `Phone (code and number) is required for purpose: "${purpose}"`;
    }

    if (purpose === 'reset-password' && !email && !isPhoneValid) {
        return `Email or phone (with code and number) is required for purpose: "${purpose}"`;
    }

    if (email && isPhoneValid) {
        return 'Provide either email or phone, not both';
    }

    return null;
};

export default validateOtpInput;
