import sendOTP from "./sendOTP.js";
import verifyOTP from "./verifyOTP.js";
import customerRegister from "./customerRegister.js";
import customerLogin from "./customerLogin.js";
import customerPasswordReset from "./customerPasswordReset.js";
import customerOTPLogin from "./customerOTPLogin.js";
import regenerateAccessToken from "./regenerateAccessToken.js";
import logout from "./logout.js";
import googleCallback from "./googleCallback.js";
import googleFailureLogin from "./googleFailureLogin.js";
import me from "./me.js";

export default {
    sendOTP,
    verifyOTP,
    customerLogin,
    customerRegister,
    customerPasswordReset,
    customerOTPLogin,
    regenerateAccessToken,
    logout,
    googleCallback,
    googleFailureLogin,
    me
}