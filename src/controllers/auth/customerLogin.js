import userModel from "../../models/userModel.js";
import bcrypt from 'bcryptjs';
import tokenGenerator from "../../utils/tokenGeneratorUtils.js";
import { REGENERATE_ACCESS_TOKEN_PATH } from "../../config/index.js";

const customerLogin = async (req, res) => {
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

export default customerLogin;