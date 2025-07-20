import mongoose from "mongoose";
import otpQueueModel from "../../models/otpQueueModel.js";
import userModel from "../../models/userModel.js";
import bcrypt from 'bcryptjs';

const customerRegister = async (req, res) => {
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

    if (phone && (!phone.code || !phone.number)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone format: expected { code, number }',
      });
    }

    const existingUser = await userModel.findOne({
      $or: [
        email ? { email } : null,
        phone ? { "phone.code": phone.code, "phone.number": phone.number } : null,
      ].filter(Boolean),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email or phone number already exists',
      });
    }

    // OTP validations
    let emailVerified = null;
    let phoneVerified = null;

    if (email && verification_ids.email) {
      emailVerified = await otpQueueModel.findOne({
        _id: verification_ids.email,
        contact: email,
        purpose: 'verify-email',
        isUsed: false,
        isVerified: true,
      });

      if (!emailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or unverified email OTP',
        });
      }
    }

    if (phone && verification_ids.phone) {
      phoneVerified = await otpQueueModel.findOne({
        _id: verification_ids.phone,
        contact: phone.number,
        code: phone.code,
        purpose: 'verify-phone',
        isUsed: false,
        isVerified: true,
      });

      if (!phoneVerified) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or unverified phone OTP',
        });
      }
    }

    // Mark OTPs as used
    if (emailVerified) {
      emailVerified.isUsed = true;
      await emailVerified.save({ session });
    }

    if (phoneVerified) {
      phoneVerified.isUsed = true;
      await phoneVerified.save({ session });
    }

    // Create hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      phone,
      password: hashedPassword,
      addressList,
      role: 'customer',
      isEmailVerified: !!emailVerified,
      isPhoneVerified: !!phoneVerified,
    };

    const created = await userModel.create([newUser], { session });

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId: created[0]._id,
    });

  } catch (err) {
    await session.abortTransaction();
    console.error('Registration failed:', err);
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: err.message,
    });
  } finally {
    session.endSession();
  }
};

export default customerRegister;
