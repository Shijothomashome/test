import { REGENERATE_ACCESS_TOKEN_PATH } from "../../config/index.js";
import userModel from "../../models/userModel.js";
import axios from "axios";

const logout = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // ✅ Revoke Google access token if it exists
        if (user.googleAccessToken) {
            console.log("Revoking Google access token:", user.googleAccessToken);
            try {
                await axios.get(`https://accounts.google.com/o/oauth2/revoke?token=${user.googleAccessToken}`);
            } catch (googleErr) {
                console.warn("Failed to revoke Google token:", googleErr.message);
            }

            user.googleAccessToken = undefined;
            await user.save();
        }

        // ✅ Clear cookies
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: REGENERATE_ACCESS_TOKEN_PATH,

        });

        // ✅ Respond
        res.json({
            success: true,
            message: "Logout successful"
        });
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ success: false, message: "Logout failed" });
    }
};

export default logout;
