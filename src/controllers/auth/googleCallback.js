import { APP_FRONTEND_GOOGLE_LOGIN_SUCCESS_CALL_BACK, REGENERATE_ACCESS_TOKEN_PATH } from "../../config/index.js";
import tokenUtils from "../../utils/tokenGeneratorUtils.js";

const googleCallback = (req, res) => {
    // Generate refresh + access tokens
    const { accessToken, refreshToken } = tokenUtils.tokenGenerator(req.user._id, req.user.role);

    const isSecureRequest = req.secure || req.headers["x-forwarded-proto"] === "https";

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: isSecureRequest,
        sameSite: isSecureRequest ? "none" : "lax",
        maxAge: 10 * 60 * 1000, // 10 mins
    });

    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isSecureRequest,
        sameSite: isSecureRequest ? "none" : "lax",
        // path: REGENERATE_ACCESS_TOKEN_PATH,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("user", req.user, {
        httpOnly: false,
        secure: isSecureRequest,

        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect if frontend callback is defined
    if (APP_FRONTEND_GOOGLE_LOGIN_SUCCESS_CALL_BACK) {
        return res.redirect(APP_FRONTEND_GOOGLE_LOGIN_SUCCESS_CALL_BACK);
    }

    res.json({ message: "Google login successful", user: req.user });
};

export default googleCallback;
