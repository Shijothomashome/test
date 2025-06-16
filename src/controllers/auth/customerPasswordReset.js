import mongoose from "mongoose";
import otpQueueModel from "../../models/otpQueueModel.js";
import userModel from "../../models/userModel.js";
import bcrypt from 'bcryptjs';

const customerPasswordReset = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { email, phone, verification_id, new_password } = req.body;

    if ((!email && !phone) || !verification_id || !new_password) {
      return res.status(400).json({
        success: false,
        message: "Email or phone, verification_id, and new_password are required",
      });
    }
    if (email && phone) {
      return res.status(400).json({
        success: false,
        message: "Provide either email or phone, not both",
      });
    }
    const contact = email || phone;

    // Find user by email or phone
    const user = await userModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "User is blocked",
      });
    }

    if (user.isDeleted) {
      return res.status(410).json({
        success: false,
        message: "User account has been deleted",
      });
    }

    // // Check if reset token matches and is not expired
    // const tokenObj = user.tokens?.reset_token;
    // if (
    //   !tokenObj ||
    //   tokenObj.value !== reset_token ||
    //   tokenObj.expiresAt < new Date()
    // ) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid or expired reset token",
    //   });
    // }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    const verifiedOtpRecord = await otpQueueModel.findOne({
      _id: verification_id,
      contact,
      purpose: 'reset-password',
      isUsed: false,
      isVerified: true,
    });

    if (!verifiedOtpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or unverified OTP for password reset",
      });
    }
    verifiedOtpRecord.isUsed = true;
    await verifiedOtpRecord.save({ session });
    if (hashedPassword === user.password) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the old password",
      });
    }

    // Update user password and clear reset token
    user.password = hashedPassword;

    // user.tokens.reset_token = undefined;

    await user.save({ session });
    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession(); // always end session
    console.error("CustomerPasswordReset error:", err);
    return res.status(500).json({
      success: false,
      message: "Password reset failed",
      error: err.message,
    });
  }
};

export default customerPasswordReset;