import otpQueueModel from "../../models/otpQueueModel.js";
import userModel from "../../models/userModel.js";
import validateOtpInput from "../../utils/validateOtpInputUtils.js";

const verifyOTP = async (req, res) => {
    try {
        const { email, phone, otp, purpose } = req.body;

        // Validate inputs
        const validationError = validateOtpInput({ email, phone, purpose });
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        let user = null;

        if (email) {
            user = await userModel.findOne({ email });
        } else if (phone?.code && phone?.number) {

            user = await userModel.findOne({
                'phone.code': phone.code,
                'phone.number': phone.number,
            }); 
        } else {
            return res.status(400).json({ success: false, message: 'Invalid contact details' });
        }

        // Build OTP query object correctly
        const otpQuery = {
            contact: email || phone?.number,
            otp,
            purpose,
            isUsed: false,
            expiresAt: { $gt: new Date() },
            ...(phone?.number && phone?.code ? { code: phone.code } : {})
        };

        // if (user?._id) otpQuery.to = user._id;

        const otpRecord = await otpQueueModel.findOne(otpQuery);

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        if (user) {
            if (purpose === 'verify-email') {
                user.isEmailVerified = true;
                otpRecord.isUsed = true;
            } else if (purpose === 'verify-phone') {
                user.isPhoneVerified = true;
                otpRecord.isUsed = true;
            }

            await user.save();
        }

        // Mark OTP as verified
        otpRecord.isVerified = true;
        await otpRecord.save();

        const purposeMessages = {
            'reset-password': 'Password reset token generated successfully',
            'verify-email': 'Email verified successfully',
            'verify-phone': 'Phone verified successfully',
            'login-email': 'Logged in with email successfully',
            'login-phone': 'Logged in with phone successfully',
        };

        return res.status(200).json({
            success: true,
            message: purposeMessages[purpose] || 'Action completed successfully',
            verification_id: otpRecord._id,
            // reset_token: user?.tokens?.reset_token?.value || undefined,
        });

    } catch (error) {
        console.error("verifyOTP error:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

export default verifyOTP;
