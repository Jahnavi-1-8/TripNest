const rateLimit = require('express-rate-limit');

// 1. Global Rate Limiter: Protects the entire application from general abuse (e.g., scraping, DoS).
// Limit: 100 requests per 15 minutes per IP.
module.exports.globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
});

// 2. Auth Rate Limiter: Protects login/signup endpoints from brute-force attacks.
// Limit: 5 attempts per 15 minutes per IP.
module.exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes.'
});

// 3. Booking Rate Limiter: Prevents spamming booking requests.
// Limit: 20 requests per 15 minutes per IP.
module.exports.bookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many booking requests from this IP, please try again after 15 minutes.'
});
