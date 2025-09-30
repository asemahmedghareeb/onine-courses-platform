const rateLimit = require('express-rate-limit');

// Apply rate limiting to all requests
const globalLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 1000, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 5 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// More aggressive rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50, 
    message: 'Too many login attempts, please try again after 5 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    globalLimiter,
    authLimiter
};
