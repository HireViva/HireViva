import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    let token = req.cookies?.token;

    // Also check Authorization header (e.g. Bearer <token>)
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        } else {
            token = authHeader;
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, please login again' });
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode.id) {
            req.userId = tokenDecode.id;
        } else {
            return res.status(401).json({ success: false, message: 'Not authorized, invalid session' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Session expired or invalid, please login again' });
    }
};

export default userAuth;
