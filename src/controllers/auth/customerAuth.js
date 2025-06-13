// src/controllers/customerAuth.js
import mongoose from "mongoose";
import otpQueueModel from "../../models/otpQueueModel.js";
import userModel from "../../models/userModel.js";
import bcrypt from 'bcryptjs';
import tokenGenerator from "../../utils/tokenGeneratorUtils.js";
import { REGENERATE_ACCESS_TOKEN_PATH } from "../../config/index.js";

export const customerRegister = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { name, email, password, phone, addressList, verification_ids = {} } = req.body;

    if (!name || (!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, password, and either email or phone are required',
      });
    }

    const existingUser = await userModel.findOne({
      $or: [
        email ? { email } : null,
        phone ? { phone } : null,
      ].filter(Boolean),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email or phone number already exists',
      });
    }

    const emailVerified = email && verification_ids.email
      ? await otpQueueModel.findOne({
        _id: verification_ids.email,
        contact: email,
        purpose: 'verify-email',
        isUsed: false,
        isVerified: true,
      })
      : null;

    const phoneVerified = phone && verification_ids.phone
      ? await otpQueueModel.findOne({
        _id: verification_ids.phone,
        contact: phone,
        purpose: 'verify-phone',
        isUsed: false,
        isVerified: true,
      })
      : null;

    if (phoneVerified) {
      phoneVerified.isUsed = true;
      await phoneVerified.save({ session });
    }

    if (emailVerified) {
      emailVerified.isUsed = true;
      await emailVerified.save({ session });
    }

    if (verification_ids.email && !emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or unverified email OTP',
      });
    }

    if (verification_ids.phone && !phoneVerified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or unverified phone OTP',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create([{
      name,
      email,
      phone,
      password: hashedPassword,
      addressList,
      role: 'customer',
      isEmailVerified: !!emailVerified,
      isPhoneVerified: !!phoneVerified,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId: user[0]._id,
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession(); // always end session
    console.error('Transaction aborted:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: err.message,
    });
  }
};

export const customerLogin = async (req, res) => {
  try {
    const { credential, password } = req.body;

    if (!credential || !password) {
      return res.status(400).json({
        success: false,
        message: 'Credential and password are required',
      });
    }

    // Find user by email or phone
    const user = await userModel.findOne({
      $or: [
        { email: credential },
        { phone: credential }
      ]
    });

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

    if (user.phone === credential && !user.isPhoneVerified) {
      return res.status(403).json({
        success: false,
        message: 'Phone number is not verified',
      });
    }

    if (user.email === credential && !user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Email is not verified',
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password',
      });
    }

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
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: REGENERATE_ACCESS_TOKEN_PATH
    });


    // Remove sensitive info before sending user object
    const { password: pw, ...userData } = user.toObject();

    res.json({
      success: true,
      message: 'Login successful',
      user: userData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: err.message,
    });
  }
};

export const customerPasswordReset = async (req, res) => {
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

export const OTPLogin = async (req, res) => {
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