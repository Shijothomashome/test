import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/index.js';
import userModel from '../models/userModel.js';

export const authenticate = (roles = []) => async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user || user.isBlocked || user.isDeleted) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        if (roles.length && !roles.includes(user.role)) {
            return res.status(403).json({ success: false, message: 'Role not authorized' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};
