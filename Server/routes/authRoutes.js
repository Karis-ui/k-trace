import express, { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Buyer from '../models/Buyer.js';
import Admin from '../models/Admin.js';
import Operator from '../models/Operator.js';
import Farmer from '../models/Farmer.js';
import { verifyToken, getUserByRole } from '../middleware/auth.js';
import { sendSMS } from '../config/africastalking.js';
import { loginLimiter, smsLimiter } from '../config/rateLimiter.js';

const router = Router();

const findUserByEmail = async (email) => {
    const admin = await Admin.findOne({ email });
    if (admin) return { user: admin, role: 'admin' };

    const operator = await Operator.findOne({ email });
    if (operator) return { user: operator, role: operator.role };

    const farmer = await Farmer.findOne({ email });
    if (farmer) return { user: farmer, role: 'farmer' };

    const buyer = await Buyer.findOne({ email });
    if (buyer) return { user: buyer, role: 'buyer' };

    return null;
};

const generateFarmerId = async () => {
    const count = await Farmer.countDocuments();
    const number = String(count + 1).padStart(5, '0');
    return `F${number}`;
};

router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, password, role, station, company, id } = req.body;
        
        if (!name || !email || !phone || !password || !role) {
            return res.status(400).json({
                success: false,
                error: "Name, email, phone, password and role are required"
            });
        }

        // Validate role
        const validRoles = ['admin', 'farmer', 'buyer', 'drymill', 'wetmill', 'finance'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                error: `Invalid role. Allowed: ${validRoles.join(', ')}`
            });
        }

        // Station is required for farmers and operators
        if ((role === 'farmer' || role === 'drymill' || role === 'wetmill' || role === 'finance') && !station) {
            return res.status(400).json({
                success: false,
                error: "Station is required for farmers and operators"
            });
        }

        // Company is required for buyers
        if (role === 'buyer' && !company) {
            return res.status(400).json({
                success: false,
                error: "Company name is required for buyers"
            });
        }

        const existing = await findUserByEmail(email);
        if (existing) {
            return res.status(400).json({
                success: false,
                error: "Email already registered. Please proceed to login."
            });
        }

        const phoneExists = await Farmer.findOne({ phone }) ||
            await Buyer.findOne({ phone }) ||
            await Operator.findOne({ phone }) ||
            await Admin.findOne({ phone });
        if (phoneExists) {
            return res.status(400).json({
                success: false,
                error: "Phone number already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let user;
        let userRole = role;

        switch (role) {
            case 'admin':
                user = new Admin({
                    name, 
                    email, 
                    phone, 
                    password: hashedPassword, 
                    role: 'admin'
                });
                break;
                
            case 'farmer':
                const farmerId = id || await generateFarmerId();
                user = new Farmer({
                    id: farmerId, 
                    name, 
                    email, 
                    phone, 
                    password: hashedPassword, 
                    station: station, 
                    subscribed: false, 
                    verified: false
                });
                break;
                
            case 'buyer':
                user = new Buyer({
                    name, 
                    email, 
                    phone, 
                    password: hashedPassword, 
                    company: company || ''
                });
                break;
                
            case 'drymill':
            case 'wetmill':
            case 'finance':
                user = new Operator({
                    name, 
                    email, 
                    phone, 
                    password: hashedPassword, 
                    role: role, 
                    station: station, 
                    status: 'active'
                });
                break;
                
            default:
                return res.status(400).json({
                    success: false, 
                    error: "Invalid role"
                });
        }
        
        await user.save();
        
        // Send SMS (only for farmers)
        try {
            if (role === 'farmer') {
                const message = `Welcome ${name} to K-Trace Coffee grading system! Your Farmer ID: ${user.id}`;
                await sendSMS(phone, message);
            } else {
                const message = `Welcome ${name} to K-Trace Coffee grading system!`;
                await sendSMS(phone, message);
            }
        } catch (smsError) {
            console.error("SMS failed:", smsError.message);
        }

        const userData = user.toObject();
        delete userData.password;
        
        res.status(201).json({
            success: true, 
            message: "Registration successful",
            data: {
                user: userData,
                role: userRole
            }
        });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({
            success: false, 
            error: err.message
        });
    }
});

router.post("/login", loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false, 
                error: "Email and password required"
            });
        }

        const userResult = await findUserByEmail(email);
        if (!userResult) {
            return res.status(404).json({
                success: false, 
                error: "User not found. Proceed to registration"
            });
        }
        
        const { user, role } = userResult;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false, 
                error: "Invalid credentials. Please try again."
            });
        }

        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email, 
                role: role, 
                name: user.name 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        const userData = user.toObject();
        delete userData.password;

        res.json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: userData,
                role: role
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.get("/me", verifyToken, async (req, res) => {
    try {
        const { id, role } = req.user;
        const user = await getUserByRole(id, role);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                error: "User not found" 
            });
        }

        const userData = user.toObject();
        delete userData.password;
        
        res.json({
            success: true,
            data: {
                user: userData,
                role: role
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.put("/change-password", verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false,
                error: "Current and new passwords required" 
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ 
                success: false,
                error: "New password must have at least 8 characters" 
            });
        }

        const { id, role } = req.user;
        const user = await getUserByRole(id, role);

        if (!user) {
            return res.status(404).json({
                success: false, 
                error: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false, 
                error: "Current password is incorrect"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.post("/forgot-password", smsLimiter, async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ 
                success: false,
                error: "Email is required" 
            });
        }

        const userResult = await findUserByEmail(email);
        if (!userResult) {
            return res.status(404).json({
                success: false, 
                error: "User not found with this email"
            });
        }
        
        const { user, role } = userResult;

        const resetToken = jwt.sign(
            { id: user._id, email: user.email, role: role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        if (user.phone) {
            const message = `Password reset requested for K-Trace. Visit the site to reset your password.`;
            await sendSMS(user.phone, message);
        }
        
        res.json({
            success: true,
            message: "Password reset instruction sent to your phone",
            ...(process.env.NODE_ENV === 'development' && { resetToken })
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.post("/reset-password", async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ 
                success: false,
                error: "Token and new password required" 
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ 
                success: false,
                error: "Password must have at least 8 characters" 
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({
                success: false, 
                error: "Invalid or expired token"
            });
        }

        const user = await getUserByRole(decoded.id, decoded.role);
        if (!user) {
            return res.status(404).json({
                success: false, 
                error: "User not found"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        
        res.json({
            success: true,
            message: "Password has been reset successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

export default router;