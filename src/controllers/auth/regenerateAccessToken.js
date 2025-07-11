import tokenGeneratorUtils from "../../utils/tokenGeneratorUtils.js"
import tokenVerificationUtils from "../../utils/tokenVerificationUtils.js"
import userModel from "../../models/userModel.js";

const regenerateAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refresh_token;

        if (!refreshToken) {
            return res.status(401).json({ success: false, message: "No refresh token provided" });
        }

        // ✅ Step 1: Verify refresh token
        const verificationResult = tokenVerificationUtils.refreshTokenVerification(refreshToken);

        if (!verificationResult.valid) {
            return res.status(403).json({ success: false, message: "Invalid refresh token" });
        }

        const userId = verificationResult.decoded.id;

        // ✅ Step 2: Find user
        const user = await userModel.findById(userId);
        if (!user || user.isBlocked || user.isDeleted) {
            return res.status(403).json({ success: false, message: "User access denied" });
        }

        // ✅ Step 3: Generate new access token based refreshToken
        const newAccessToken = tokenGeneratorUtils.accessTokenGenerator(refreshToken);

        const isSecureRequest = req.secure || req.headers['x-forwarded-proto'] === 'https';

        // ✅ Step 4: Set cookie
        res.cookie("access_token", newAccessToken, {
            httpOnly: true,
            secure: isSecureRequest,
            sameSite: isSecureRequest ? "none" : "lax",
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        return res.status(200).json({ success: true, message: "Access token regenerated successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export default regenerateAccessToken;
