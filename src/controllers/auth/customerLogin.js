import userModel from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import tokenGeneratorUtils from "../../utils/tokenGeneratorUtils.js";
import { REGENERATE_ACCESS_TOKEN_PATH } from "../../config/index.js";

const customerLogin = async (req, res) => {
  try {
    const { credential, password } = req.body;

    if (!credential || !password) {
      return res.status(400).json({
        success: false,
        message: "Credential and password are required",
      });
    }

    let user;
    const isEmail = credential.includes("@");

    if (isEmail) {
      // Case-insensitive email match
      user = await userModel.findOne({
        email: { $regex: new RegExp(`^${credential}$`, "i") },
      });
    } else {
      // Split phone using " " only
      const parts = credential.trim().split(" ");
      if (parts.length !== 2) {
        return res.status(400).json({
          success: false,
          message: "Invalid phone format. Use '+<code> <number>' (e.g. +91 9876543210)",
        });
      }

      const [code, number] = parts;

      // Basic validation
      if (!/^\+\d{1,4}$/.test(code) || !/^\d{6,15}$/.test(number)) {
        return res.status(400).json({
          success: false,
          message: "Invalid phone code or number format",
        });
      }

      user = await userModel.findOne({
        "phone.code": code,
        "phone.number": number,
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

    if (!isEmail && !user.isPhoneVerified) {
      return res.status(403).json({
        success: false,
        message: "Phone number is not verified",
      });
    }

    if (isEmail && !user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Email is not verified",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Token generation
    const { accessToken, refreshToken } = tokenGeneratorUtils.tokenGenerator(
      user._id,
      user.role
    );

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 10 * 60 * 1000, // 10 minutes
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: REGENERATE_ACCESS_TOKEN_PATH,
    });

    const { password: _, ...userData } = user.toObject();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: err.message,
    });
  }
};

export default customerLogin;
