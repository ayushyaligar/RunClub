// Day 1 — requireAuth (verify JWT, attach req.user), requireAdmin (check role)
// src/middleware/auth.js
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization; // "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach { userId, role } to the request for later handlers
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

const optionalAuth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return next();

    try {
        const token = header.split(' ')[1];
        req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        // invalid token — continue as anonymous
    }
    next();
};
module.exports = { requireAuth, requireAdmin, optionalAuth };