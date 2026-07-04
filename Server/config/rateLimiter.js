import rateLimit from 'express-rate-limit';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const getClientIP = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        const ips = forwarded.split(',');
        return ips[0].trim();
    }
    return req.ip || req.connection?.remoteAddress || 'unknown';
};

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: 'Too many request from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        return req.user?.role == 'admin';
    }
});

export const strictLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: 'Too many requests, please try again after 5 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: {
        success: false,
        error: 'Too many login attempts. Please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const smsLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: 'Too many sms requests, please try again after 1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const payoutLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 30,
    message: {
        success: false,
        error: 'Too many payout requests, please try again after 1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false
});

export const exportLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: 'Too many export requests, please try again after 1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        error: 'Too many upload requests, please try again after 1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const userRateLimiter = new RateLimiterMemory({
    points: 20, duration: 60
});

export const userLimiter = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.ip;
        const key = `user_${userId}`;
        await userRateLimiter.consume(key);
        next();
    } catch (err) {
        res.status(429).json({
            success: false,
            error: "Too many requests. Please slow down."
        });
    }
};

export const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: {
        success: false,
        error: 'Too many admin requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        return false;
    }
});

export const farmerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
        success: false,
        error: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const buyerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
        success: false,
        error: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const ussdLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    message: {
        success: false,
        error: 'Too many pussd requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        return false;
    }
});

const getIp = (req) => {
    return req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.ip;
};

export const ipLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    keyGenerator: (req) => {
        return getIp(req);
    },
    message: {
        success: false,
        error: "Too many requests from this IP."
    }
});