import { APP_FRONTEND_GOOGLE_LOGIN_FAIL_CALL_BACK } from "../../config/index.js";

const googleFailureLogin = (req, res) => {

    if (APP_FRONTEND_GOOGLE_LOGIN_FAIL_CALL_BACK) {
        return res.redirect(`${APP_FRONTEND_GOOGLE_LOGIN_FAIL_CALL_BACK}?error=Google+authentication+failed`);
    }
    res.status(401).json({
        success: false,
        message: 'Google authentication failed',
    });
};

export default googleFailureLogin;
