import { REGENERATE_ACCESS_TOKEN_PATH } from "../../config/index.js";
import tokenUtils from "../../utils/tokenGeneratorUtils.js"

const googleCallback = (req, res) => {
    console.log('Google login successful:', req.user, req.session)
    // Generate refresh + access tokens
    const { accessToken, refreshToken } = tokenUtils.tokenGenerator(req.user._id, req.user.role);

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
        path: REGENERATE_ACCESS_TOKEN_PATH,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ message: 'Google login successful', user: req.user });
};

export default googleCallback;
