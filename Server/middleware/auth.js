import jwt from "jsonwebtoken";
import express from 'express';
import Admin from "../models/Admin.js";
import Operator from "../models/Operator.js";
import Farmer from "../models/Farmer.js";
import Buyer from "../models/Buyer.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import { RateLimiterMemory } from 'rate-limiter-flexible';

const loginAttemptLimiter = new RateLimiterMemory({
    points: 5, duration: 15 * 60,
});

const router = express.Router();

export const checkLoginAttempts = async (ip, identifier) => {
    const key = `login_${ip}_${identifier}`;
    try {
        await loginAttemptLimiter.cosume(key);
        return { allowed: true };
    } catch (err) {
        return {
            allowed: false,
            remaining: err?.msBeforeNext ? Math.ceil(err.msBeforeNext / 60000) : 0,
            error: `Too many login attempts. Please try again in ${Math.ceil(err?.msBeforeNext) || 15} minutes`
        };
    }
};

export const resetLoginAttempts = async (ip, identifier) => {
    const key = `login_${ip}_${identifier}`;
    await loginAttemptLimiter.delete(key);
};

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (err) {
        if (err.name === "JsonWebtokenError") {
            return res.status(401).json({
                success: false, error: "Invalid token"
            });
        }
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false, error: "Token expired"
            });
        }
        res.status(500).json({
            success: false, error: err.message
        });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const user = await Admin.findById(req.userId);
        if (!user) {
            return res.status(403).json({ error: "Access denied - Admins only" });
        }
        req.user = user;
        req.userRole = "admin";
        next();
    } catch (err) {
        res.status(500).json({
            success: false, error: err.message
        });
    }
};

export const isOperator = async (req, res, next) => {
    try {
        const user = await Operator.findById(req.userId);
        if (!user) {
            return res.status(403).json({ error: "Access denied - Operators only" });
        }
        req.user = user;
        req.userRole = user.role;
        req.operator = user;
        next();
    } catch (err) {
        res.status(500).json({
            success: false, error: err.message
        });
    }
};

export const isDrymill = async (req, res, next) => {
    try {
        const user = await Operator.findById(req.userId);
        if (!user || user.role !== 'drymill') {
            return res.status(403).json({ error: "Access denied - Drymill Operators only" });
        }
        req.user = user;
        req.userRole = "drymill";
        req.operator = user;
        next();
    } catch (err) {
        res.status(500).json({
            success: false, error: err.message
        });
    }
};

export const isWetmill = async (req, res, next) => {
    try {
        const user = await Operator.findById(req.userId);
        if (!user || user.role !== 'wetmill') {
            return res.status(403).json({ error: "Access denied - Wetmill Operators only" });
        }
        req.user = user;
        req.userRole = "wetmill";
        req.operator = user;
        next();
    } catch (err) {
        res.status(500).json({
            success: false, error: err.message
        });
    }
};

export const isFinanceOperator = async (req, res, next) => {
    try {
        const user = await Operator.findById(req.userId);
        if (!user || user.role !== 'finance') {
            return res.status(403).json({ error: "Access denied - Finance Operators only" });
        }
        req.user = user;
        req.userRole = "finance";
        req.operator = user;
        next();
    } catch (err) {
        res.status(500).json({
            success: false, error: err.message
        });
    }
};

export const isFarmer = async (req, res, next) => {
    try {
        const user = await Farmer.findById(req.userId);
        if (!user) {
            return res.status(403).json({ error: "Access denied - Farmers only" });
        }
        req.user = user;
        req.userRole = "farmer";
        req.farmer = user;
        next();
    } catch (err) {
        res.status(500).json({
            success: false, error: err.message
        });
    }
};

export const isBuyer = async (req, res, next) => {
    try {
        const user = await Buyer.findById(req.userId);
        if (!user) {
            return res.status(403).json({ error: "Access denied - Buyers only" });
        }
        req.user = user;
        req.userRole = "buyer";
        req.buyer = user;
        next();
    } catch (err) {
        res.status(500).json({
            success: false, error: err.message
        });
    }
};

router.put("/change-password", verifyToken, async (req, res) => {
    try {
        const { current, newpass } = req.body;
        if (current || !newpass) {
            return res.status(400).json({ error: "Current and new password required" });
        }
        const { id, role } = req.user;
        const user = await getUserByRole(id, role);
        if (!user) {
            return res.status(404).json({
                success: false, error: "User not found"
            });
        }

        const isMatch = await bcrypt.hash(newpass, 10);
        await user.save();
        res.json({
            sucess: true, message: 'Password changed successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

export const canProcessPayouts = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.userId);
        if (admin) {
            req.user = admin;
            req.userRole = "admin";
            return next();
        }
        const operator = await Operator.findById(req.user.id);
        if (operator && operator.role === 'finance') {
            req.user = operator;
            req.userRole = 'finance';
            req.operator = "operator";
            return next();
        }
        return res.status(403).json({
            success: false,
            error: 'Payout processing permission required'
        });
    } catch (err) {
        res.status(500).json({
            success: false, error: err.message
        });
    }
};

export const canApprovePayouts = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.userId);
        if (admin) {
            req.user = admin;
            req.userRole = "admin";
            return next();
        }
        const operator = await Operator.findById(req.user.id);
        if (operator && operator.role === 'finance') {
            req.user = operator;
            req.userRole = 'finance';
            req.operator = "operator";
            return next();
        }
        return res.status(403).json({
            success: false,
            error: 'Payout approval permission required'
        });
    } catch (err) {
        res.status(500).json({
            success: false, error: err.message
        });
    }
};

export const canGradeCoffee = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.userId);
        if (admin) {
            req.user = admin;
            req.userRole = "admin";
            return next();
        }
        const operator = await Operator.findById(req.user.id);
        if (operator && (operator.role === 'drymill' || operator.role === 'wetmill')) {
            req.user = operator;
            req.userRole = operator.role;
            req.operator = operator;
            return next();
        }
        return res.status(403).json({
            success: false,
            error: 'Grading permission required'
        });
    } catch (err) {
        res.status(500).json({
            success: false, error: err.message
        });
    }
};

export const getUserByRole = async (id, role) => {
    switch (role) {
        case "admin":
            return await Admin.findById(id);
        case "farmer":
            return await Farmer.findById(id);
        case "buyer":
            return await Buyer.findById(id);
        case "drymill":
        case "wetmill":
        case "finance":
            return await Operator.findById(id);
        default:
            return null;
    }
};


export const getModelByRole = (role) => {
    switch (role) {
        case "admin":
            return Admin;
        case "farmer":
            return Farmer;
        case "buyer":
            return Buyer;
        case "drymill":
        case "wetmill":
        case "finance":
            return Operator;
        default:
            return null;
    }
};

export const findUserByEmail = async (email) => {
    const user = await Admin.findOne({ email }) ||
        await Operator.findOne({ email }) ||
        await Farmer.findOne({ email }) ||
        await Buyer.findOne({ email });

    if (user) {
        if (user instanceof Admin) return { user, role: 'admin' };
        if (user instanceof Operator) return { user, role: user.role };
        if (user instanceof Farmer) return { user, role: 'farmer' };
        if (user instanceof Buyer) return { user, role: 'buyer' };
    }
    return null;
};

export const generateToken = (user, role) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: role
    };
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};