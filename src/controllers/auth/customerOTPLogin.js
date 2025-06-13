import otpQueueModel from "../../models/otpQueueModel.js";
import userModel from "../../models/userModel.js";
import tokenGenerator from "../../utils/tokenGeneratorUtils.js";
import { REGENERATE_ACCESS_TOKEN_PATH } from "../../config/index.js";

const customerOTPLogin = async (req, res) => {
  const { verification_id, purpose } = req.body;
  try {
    if (!verification_id) {
      return res.status(400).json({
        success: false,
        message: 'Verification ID is required',
      });
    }
    if (!purpose || !['login-email', 'login-phone'].includes(purpose)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing purpose',
      });
    }

    const otpRecord = await otpQueueModel.findOne({
      _id: verification_id,
      purpose,
      isUsed: false,
      isVerified: true,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or unverified OTP',
      });
    }

    const user = await userModel.findById(otpRecord.to)
      .select('-password -tokens') // Exclude sensitive fields;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'User is blocked',
      });
    }

    if (user.isDeleted) {
      return res.status(410).json({
        success: false,
        message: 'User account has been deleted',
      });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Generate refresh + access tokens
    const { accessToken, refreshToken } = tokenGenerator(user._id, user.role);

    // Set cookies
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false, // change to true in production
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000 // 10 mins
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false, // change to true in production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,// 7 days
      path: REGENERATE_ACCESS_TOKEN_PATH

    });



    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user,
    });
  } catch (err) {
    console.error("OtpLogin error:", err);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: err.message,
    });
  }

}

export default customerOTPLogin;