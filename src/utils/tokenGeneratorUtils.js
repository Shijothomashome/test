import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../config/index.js";

// Generate Refresh Token (valid for 7 days)
const refreshTokenGenerator = (user_id, role) => {
    return jwt.sign(
        { id: user_id, role },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};

// Generate Access Token (valid for 10 minutes)
const accessTokenGenerator = (refreshToken) => {
    return jwt.sign(
        { token: refreshToken },
        JWT_ACCESS_SECRET,
        { expiresIn: '10m' }
    );
};

// Generate Both Tokens
const tokenGenerator = (user_id, role) => {
    const refreshToken = refreshTokenGenerator(user_id, role);
    const accessToken = accessTokenGenerator(refreshToken);
    return {
        refreshToken,
        accessToken
    };
};

// Export all token utilities
export default{
    tokenGenerator,
    refreshTokenGenerator,
    accessTokenGenerator
};
