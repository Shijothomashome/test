import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../config/index.js";

// ✅ Verify Access Token
const accessTokenVerification = (accessToken) => {
  try {
    const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET);
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, error: err.message };
  }
};

// ✅ Verify Refresh Token
const refreshTokenVerification = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, error: err.message };
  }
};

// ✅ Verify Both Tokens Together
const tokenVerification = (accessToken) => {
  const accessResult = accessTokenVerification(accessToken);
  if (!accessResult.valid) {
    return { valid: false, error: "Invalid access token" };
  }

  const refreshToken = accessResult.decoded.token;
  if (!refreshToken) {
    return { valid: false, error: "Missing refresh token in access token payload" };
  }

  const refreshResult = refreshTokenVerification(refreshToken);
  if (!refreshResult.valid) {
    return { valid: false, error: "Invalid refresh token" };
  }

  return {
    valid: true,
    decoded: refreshResult.decoded 
  };
};

export default{
  accessTokenVerification,
  refreshTokenVerification,
  tokenVerification
};
