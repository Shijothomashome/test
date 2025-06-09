import { randomUUID } from "crypto";
import { OTP_EXPIRY_MINUTES } from "../../config/index.js";
import otpQueueModel from "../../models/otpQueueModel.js";
import userModel from "../../models/userModel.js";
import { SEND_EMAIL_OTP } from "../../utils/MAIL.js";
import { SEND_SMS_OTP_MANUALLY } from "../../utils/SMS.js";
import { validateOtpInput } from "../../utils/validateOtpInput.js";

export const OTP_SEND = async (req, res) => {
    try {
        const { email, phone, user_id, purpose } = req.body;

        // Validate inputs
        const validationError = validateOtpInput({ email, phone, purpose, user_id });
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        let user = null;
        if (email || phone) {
            user = await userModel.findOne(email ? { email } : { phone });
        }

        if (user_id && user && user._id.toString() !== user_id) {
            return res.status(403).json({ success: false, message: 'Unauthorized user' });
        }

        // Check if OTP already exists and is valid
        const otpQuery = {
            contact: email || phone,
            purpose,
            isUsed: false,
            expiresAt: { $gt: new Date() },
        };
        if (user?._id) otpQuery.to = user._id;

        const existingOTP = await otpQueueModel.findOne(otpQuery);
        if (existingOTP) {
            return res.status(429).json({
                success: false,
                message: 'OTP already sent. Please wait before requesting a new one.',
            });
        }

        // Send OTP according to contact method
        let otp, result;
        if (email) {
            if (['reset-password', 'login-email'].includes(purpose) && !user) {
                return res.status(400).json({ success: false, message: `User not found for ${purpose.split("-").join(" ")}` });
            }
            if (['reset-password', 'login-email'].includes(purpose) && user && !user.isEmailVerified) {
                return res.status(400).json({ success: false, message: 'Email is not verified' });
            }
            if (user && user.isBlocked) {
                return res.status(403).json({ success: false, message: 'User is blocked' });
            }
            if (user && user.isDeleted) {
                return res.status(410).json({ success: false, message: 'User account has been deleted' });
            }

            result = await SEND_EMAIL_OTP(email);
            if (!result.success) {
                return res.status(500).json({ success: false, message: result.message });
            }
            otp = result.otp;
        } else {
            if (['reset-password', 'login-phone'].includes(purpose) && !user) {
                return res.status(400).json({ success: false, message: `User not found for  ${purpose.split("-").join(" ")}` });
            }
            if (['reset-password', 'login-phone'].includes(purpose) && user && !user.isPhoneVerified) {
                return res.status(400).json({ success: false, message: 'Phone is not verified' });
            }
            if (user && user.isBlocked) {
                return res.status(403).json({ success: false, message: 'User is blocked' });
            }
            if (user && user.isDeleted) {
                return res.status(410).json({ success: false, message: 'User account has been deleted' });
            }

            result = await SEND_SMS_OTP_MANUALLY(phone);
            if (!result.valid) {
                return res.status(500).json({ success: false, message: result.error });
            }
            otp = result.otp;
        }

        // Save OTP record
        await otpQueueModel.create({
            to: user?._id ?? undefined,
            contact: email || phone,
            otp,
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
        console.error("OTP_SEND error:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

export const OTP_VERIFY = async (req, res) => {
    try {
        const { email, phone, otp, user_id, purpose } = req.body;

        // Validate inputs
        const validationError = validateOtpInput({ email, phone, purpose });
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        let user = null;
        if (email || phone) {
            user = await userModel.findOne(email ? { email } : { phone });
        }

        if (user_id && user && user._id.toString() !== user_id) {
            return res.status(403).json({ success: false, message: 'Unauthorized user' });
        }

        // Find the OTP record
        const otpQuery = {
            contact: email || phone,
            otp,
            purpose,
            isUsed: false,
            expiresAt: { $gt: new Date() },
        };
        if (user?._id) otpQuery.to = user._id;

        const otpRecord = await otpQueueModel.findOne(otpQuery);

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // Mark OTP as used
        otpRecord.isVerified = true;
        await otpRecord.save();

        // // Update user verification or create reset token
        // if (user) {
        //     if (purpose === 'verify-email') {
        //         user.isEmailVerified = true;
        //     } else if (purpose === 'verify-phone') {
        //         user.isPhoneVerified = true;
        //     } else if (purpose === 'reset-password') {
        //         user.tokens = {
        //             ...user.toObject().tokens,
        //             reset_token: {
        //                 value: randomUUID(),
        //                 expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
        //             }
        //         };
        //     }
        //     await user.save();
        // }

        return res.status(200).json({
            success: true,
            message: purpose === 'reset-password'
                ? 'Password reset token generated successfully'
                : `${purpose === 'verify-email' ? 'Email' : 'Phone'} verified successfully`,
            verification_id: otpRecord._id,
            // reset_token: user?.tokens?.reset_token?.value || undefined,
        });


    } catch (error) {
        console.error("OTP_VERIFY error:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};
