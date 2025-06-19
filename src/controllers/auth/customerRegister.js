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

export default customerRegister;