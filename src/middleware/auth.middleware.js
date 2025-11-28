const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Access Token Required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access_secret');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or Expired Token' });
    }
};

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.roles) {
            return res.status(403).json({ message: 'Access Denied' });
        }

        const hasRole = req.user.roles.some(role => roles.includes(role));
        if (!hasRole) {
            return res.status(403).json({ message: 'Insufficient Permissions' });
        }
        next();
    };
};
