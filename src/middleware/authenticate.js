import userModel from '../models/userModel.js';
import { tokenVerification } from './tokenVerification.js';

export const authenticate = (roles = []) => async (req, res, next) => {
    const token = req.cookies?.access_token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No access token' });
    }

    const verificationResult = tokenVerification(token);

    if (!verificationResult.valid) {
        return res.status(401).json({ success: false, message: verificationResult.error || 'Invalid token' });
    }

    try {
        const user = await userModel.findById(verificationResult.decoded.id);

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
