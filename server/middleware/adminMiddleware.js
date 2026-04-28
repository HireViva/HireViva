import userModel from '../models/userModel.js';

/**
 * Admin Authorization Middleware
 * Must be used AFTER userAuth middleware (requires req.userId)
 * Checks if the authenticated user has admin role
 */
const adminAuth = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authorization check failed'
        });
    }
};

export default adminAuth;
