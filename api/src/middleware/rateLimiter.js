// Day 3 — authLimiter, rsvpLimiter, redeemLimiter (express-rate-limit)
const rateLimit = require('express-rate-limit');

const redeemLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    keyGenerator: (req) => req.user?.userId ?? req.ip,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: { message: 'Too many attempts. Try again later.' },
});

module.exports = { redeemLimiter };