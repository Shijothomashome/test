import { OTP_EXPIRY_MINUTES } from "../../config/index.js";
import otpQueueModel from "../../models/otpQueueModel.js";
import userModel from "../../models/userModel.js";
import emailUtils from "../../utils/mailUtils.js";
import smsUtils from "../../utils/smsUtils.js";
import validateOtpInput from "../../utils/validateOtpInputUtils.js";

const sendOTP = async (req, res) => {
    try {
        const { email, phone, purpose } = req.body;

        const validationError = validateOtpInput({ email, phone, purpose });
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        let user = null;

        if (email) {
            user = await userModel.findOne({ email });
        } else if (phone?.code && phone?.number) {
            user = await userModel.findOne({ phone: { code: phone.code, number: phone.number } });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid contact details' });
        }

        const otpQuery = {
            purpose,
            isUsed: false,
            expiresAt: { $gt: new Date() },
            ...(email ? { contact: email } : { contact: phone.number, code: phone.code }),
        };

        const existingOTP = await otpQueueModel.findOne(otpQuery);
        if (existingOTP) {
            return res.status(429).json({
                success: false,
                message: 'OTP already sent. Please wait before requesting a new one.',
            });
        }

        let otp, result;

        if (email) {
            if (['reset-password', 'login-email'].includes(purpose) && !user) {
                return res.status(400).json({ success: false, message: `User not found for ${purpose.replace("-", " ")}` });
            }
            if (['reset-password', 'login-email'].includes(purpose) && user && (!user.isEmailVerified && !user.isVerified)) {
                return res.status(400).json({ success: false, message: 'Email is not verified' });
            }
            if (user?.isBlocked) {
                return res.status(403).json({ success: false, message: 'User is blocked' });
            }
            if (user?.isDeleted) {
                return res.status(410).json({ success: false, message: 'User account has been deleted' });
            }

            result = await emailUtils.sendEmailOtp(email);
            if (!result.success) {
                return res.status(500).json({ success: false, message: result.message });
            }
            otp = result.otp;
        } else {
            if (['reset-password', 'login-phone'].includes(purpose) && !user) {
                return res.status(400).json({ success: false, message: `User not found for ${purpose.replace("-", " ")}` });
            }
            if (['reset-password', 'login-phone'].includes(purpose) && user && !user.isPhoneVerified) {
                return res.status(400).json({ success: false, message: 'Phone is not verified' });
            }
            if (user?.isBlocked) {
                return res.status(403).json({ success: false, message: 'User is blocked' });
            }
            if (user?.isDeleted) {
                return res.status(410).json({ success: false, message: 'User account has been deleted' });
            }

            result = await smsUtils.sendSmsOtpManually(phone);
            if (!result.valid) {
                return res.status(500).json({ success: false, message: result.error });
            }
            otp = result.otp;
        }

        await otpQueueModel.create({
            to: user?._id ?? undefined,
            otp,
            contact: email || phone.number,
            code: phone?.code,
            purpose,
            isUsed: false,
            isVerified: false,
            expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log(`[OTP DEBUG] Sent OTP: ${otp}`);
        }

        return res.status(200).json({
            success: true,
            message: `OTP sent to your ${email ? 'email' : 'phone'} successfully`,
        });

    } catch (error) {
        console.error("sendOTP error:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

export default sendOTP;
