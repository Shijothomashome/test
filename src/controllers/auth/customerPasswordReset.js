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

    let user;
    if (email) {
      user = await userModel.findOne({ email });
    } else {
      if (!phone?.code || !phone?.number) {
        return res.status(400).json({
          success: false,
          message: "Invalid phone format: expected { code, number }",
        });
      }

      user = await userModel.findOne({
        "phone.code": phone.code,
        "phone.number": phone.number,
      });
    }

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

    const otpQuery = {
      _id: verification_id,
      purpose: "reset-password",
      isUsed: false,
      isVerified: true,
      ...(email
        ? { contact: email }
        : { contact: phone.number, code: phone.code }),
    };

    const verifiedOtpRecord = await otpQueueModel.findOne(otpQuery);

    if (!verifiedOtpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or unverified OTP for password reset",
      });
    }

    // Compare new password with existing
    const isSamePassword = await bcrypt.compare(new_password, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the old password",
      });
    }

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;

    verifiedOtpRecord.isUsed = true;

    await verifiedOtpRecord.save({ session });
    await user.save({ session });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("CustomerPasswordReset error:", err);
    return res.status(500).json({
      success: false,
      message: "Password reset failed",
      error: err.message,
    });
  } finally {
    session.endSession(); // always close session
  }
};

export default customerPasswordReset;
