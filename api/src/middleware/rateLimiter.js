// api/src/middleware/rateLimiter.js
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

const redeemLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
    limit: 5,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: (req) => {
        // requireAuth runs before this, so req.user is normally populated.
        // The IP fallback only fires if the limiter is ever mounted on an
        // unauthenticated route.
        if (req.user?.userId) return `user:${req.user.userId}`;
        return ipKeyGenerator(req.ip);
    },
    message: { message: 'Too many attempts. Try again in 15 minutes.' },
});

module.exports = { redeemLimiter };