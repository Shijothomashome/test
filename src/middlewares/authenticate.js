import userModel from '../models/userModel.js';
import tokenVerificationUtils from '../utils/tokenVerificationUtils.js';

const authenticate = (roles = ['customer']) => async (req, res, next) => {
    
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkNJNklqWTRPR1kwWXpNNE1ETXlZekV3Tm1ZMFpqZGtPV0U0T0NJc0luSnZiR1VpT2lKamRYTjBiMjFsY2lJc0ltbGhkQ0k2TVRjMU5EWTJPRGsyTlN3aVpYaHdJam94TnpVMU1qY3pOelkxZlEuSVVfN2REa3ZqNXIydVhsenhWR1Z3YW1sZVJfTm1YbWhKcTBsRU0wZkZsayIsImlhdCI6MTc1NDY2ODk2NSwiZXhwIjoxNzU0NjY5NTY1fQ.FglAFiOX6nHPhR_LyWAnZtp2M0J1bZaJCAY9XReKoEc"
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No access token' });
    }

    const verificationResult = tokenVerificationUtils.tokenVerification(token);

    if (!verificationResult.valid) {
        return res.status(401).json({ success: false, message: verificationResult.error || 'Invalid token' });
    }

    try {
        const user = await userModel.findById(verificationResult.decoded.id).select("-password -googleAccessToken -googleId");

        if (!user || user.isBlocked || user.isDeleted) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        if (roles.length && !roles.includes(user.role)) {
            return res.status(403).json({ success: false, message: 'Role not authorized' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Authentication error', error: err.message });
    }
};

export default authenticate;