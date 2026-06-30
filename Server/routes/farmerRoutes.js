import express from "express";
import Farmer from "../models/Farmer.js";
import Delivery from "../models/Delivery.js";
import bcrypt from "bcrypt";
import { verifyToken, isFarmer } from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import Grading from "../models/Grading.js";
import Payouts from "../models/Payouts.js";

const router = express.Router();

router.get("/dashboard", verifyToken, isFarmer, async (req, res) => {
    try {
        const farmerId = req.user.id;

        const farmer = await Farmer.findById(farmerId).select("-password");
        if (!farmer) {
            return res.status(404).json({ error: "Farmer not found" });
        }

        const [deliveries, gradings, payouts] = await Promise.all([
            Delivery.find({ farmerId }).sort({ date: -1 }),
            Grading.find({ farmerId }).sort({ date: -1 }),
            Payouts.find({ farmerId }).sort({ createdAt: -1 })
        ]);

        const totalDeliveries = deliveries.length;
        const totalWeight = deliveries.reduce((sum, d) => sum + (d.weight || 0), 0);
        const totalGradings = gradings.length;
        const totalPayouts = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);

        const gradedScores = gradings.filter(g => g.cuppingScore);
        const averageGrade = gradedScores.length > 0
            ? gradedScores.reduce((sum, g) => sum + (g.cuppingScore || 0), 0) / gradedScores.length
            : 0;

        const gradeDistribution = {};
        gradings.forEach(g => {
            const grade = g.grade || 'pending';
            gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
        });

        const recentDeliveries = deliveries.slice(0, 10);

        const recentGradings = gradings.slice(0, 10);

        const recentPayouts = payouts.slice(0, 10);

        const payoutStatus = {
            pending: payouts.filter(p => p.status === 'pending').length,
            approved: payouts.filter(p => p.status === 'approved').length,
            completed: payouts.filter(p => p.status === 'completed').length,
            rejected: payouts.filter(p => p.status === 'rejected').length
        };

        const monthlyTrend = {};
        deliveries.forEach(d => {
            const month = new Date(d.date || d.createdAt).toISOString().slice(0, 7);
            if (!monthlyTrend[month]) {
                monthlyTrend[month] = { weight: 0, count: 0 };
            }
            monthlyTrend[month].weight += d.weight || 0;
            monthlyTrend[month].count += 1;
        });

        const performanceRating = calculateFarmerRating(averageGrade, totalWeight, totalDeliveries);

        res.json({
            success: true,
            data: {
                profile: {
                    id: farmer._id,
                    name: farmer.name,
                    phone: farmer.phone,
                    station: farmer.station,
                    farmerId: farmer.id || farmer._id,
                    verified: farmer.verified || false,
                    subscribed: farmer.subscribed || false
                },
                summary: {
                    totalDeliveries,
                    totalWeight: parseFloat(totalWeight.toFixed(2)),
                    totalGradings,
                    totalPayouts: parseFloat(totalPayouts.toFixed(2)),
                    averageGrade: parseFloat(averageGrade.toFixed(2)),
                    pendingPayouts: payoutStatus.pending
                },
                performance: {
                    rating: performanceRating.rating,
                    level: performanceRating.level,
                    badge: performanceRating.badge,
                    nextLevel: performanceRating.nextLevel
                },
                gradeDistribution,
                payoutStatus,
                monthlyTrend: Object.entries(monthlyTrend).map(([month, data]) => ({
                    month,
                    weight: parseFloat(data.weight.toFixed(2)),
                    deliveries: data.count
                })),
                recent: {
                    deliveries: recentDeliveries,
                    gradings: recentGradings,
                    payouts: recentPayouts
                },
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/me/deliveries", verifyToken, isFarmer, async (req, res) => {
    try {
        const deliveries = await Delivery.find({ farmerId: req.user.id }).sort({ date: -1 });

        const totalWeight = deliveries.reduce((sum, d) => sum + (d.weight || 0), 0);

        res.json({
            success: true,
            data: {
                deliveries,
                summary: {
                    total: deliveries.length,
                    totalWeight: parseFloat(totalWeight.toFixed(2)),
                    averageWeight: deliveries.length > 0 ? parseFloat((totalWeight / deliveries.length).toFixed(2)) : 0
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/me/gradings", verifyToken, isFarmer, async (req, res) => {
    try {
        const gradings = await Grading.find({ farmerId: req.user.id })
            .populate("operatorId", "name station")
            .sort({ date: -1 });

        const avgScore = gradings.length > 0
            ? gradings.reduce((sum, g) => sum + (g.cuppingScore || 0), 0) / gradings.length
            : 0;

        res.json({
            success: true,
            data: {
                gradings,
                summary: {
                    total: gradings.length,
                    averageScore: parseFloat(avgScore.toFixed(2)),
                    graded: gradings.filter(g => g.grade && g.grade !== 'pending').length,
                    pending: gradings.filter(g => !g.grade || g.grade === 'pending').length
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/me/payouts", verifyToken, isFarmer, async (req, res) => {
    try {
        const payouts = await Payouts.find({ farmerId: req.user.id })
            .populate("gradingId", "grade cuppingScore")
            .sort({ createdAt: -1 });

        const totalAmount = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);

        res.json({
            success: true,
            data: {
                payouts,
                summary: {
                    total: payouts.length,
                    totalAmount: parseFloat(totalAmount.toFixed(2)),
                    pending: payouts.filter(p => p.status === 'pending').length,
                    completed: payouts.filter(p => p.status === 'completed').length
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/my", verifyToken, isFarmer, async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.user.id).select("-password");
        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }

        const deliveries = await Delivery.find({ farmerId: farmer._id });
        const gradings = await Grading.find({ farmerId: farmer._id });
        const payouts = await Payouts.find({ farmerId: farmer._id });

        res.json({
            success: true,
            data: {
                id: farmer._id,
                name: farmer.name,
                email: farmer.email,
                phone: farmer.phone,
                station: farmer.station,
                verified: farmer.verified || false,
                stats: {
                    deliveries: deliveries.length,
                    weight: deliveries.reduce((sum, d) => sum + (d.weight || 0), 0),
                    gradings: gradings.length,
                    payouts: payouts.reduce((sum, p) => sum + (p.amount || 0), 0)
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/my/update", verifyToken, isFarmer, async (req, res) => {
    try {
        const farmerId = req.user.id;
        const { name, phone, station, password } = req.body;
        const farmer = await Farmer.findById(farmerId);

        if (!farmer) {
            return res.status(404).json({ error: "Farmer not found!" });
        }

        if (name) farmer.name = name;
        if (phone) {
            const existing = await Farmer.findOne({ phone, _id: { $ne: farmer._id } });
            if (existing) {
                return res.status(400).json({ error: "Phone already in use" });
            }
            farmer.phone = phone;
        }
        if (station) farmer.station = station;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            farmer.password = hashedPassword;
        }
        await farmer.save();

        res.json({
            success: true,
            message: "✅ Profile updated successfully",
            farmer: {
                id: farmer._id,
                name: farmer.name,
                phone: farmer.phone,
                station: farmer.station,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/settings", verifyToken, isFarmer, async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.user.id).select("-password");
        if (!farmer) {
            return res.status(404).json({ error: "Farmer not found" });
        }

        const deliveries = await Delivery.find({ farmerId: farmer._id });
        const gradings = await Grading.find({ farmerId: farmer._id });
        const payouts = await Payouts.find({ farmerId: farmer._id });

        res.json({
            success: true,
            data: {
                profile: {
                    id: farmer._id,
                    name: farmer.name,
                    phone: farmer.phone,
                    station: farmer.station,
                    farmerId: farmer.id,
                    verified: farmer.verified || false,
                    subscribed: farmer.subscribed || false
                },
                stats: {
                    totalDeliveries: deliveries.length,
                    totalWeight: deliveries.reduce((sum, d) => sum + (d.weight || 0), 0),
                    totalGradings: gradings.length,
                    averageGrade: gradings.length > 0
                        ? gradings.reduce((sum, g) => sum + (g.cuppingScore || 0), 0) / gradings.length
                        : 0,
                    totalPayouts: payouts.reduce((sum, p) => sum + (p.amount || 0), 0)
                },
                preferences: {
                    notifications: farmer.notifications || {
                        sms: true,
                        email: false
                    },
                    language: farmer.language || 'en'
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/settings", verifyToken, isFarmer, async (req, res) => {
    try {
        const { profile, preferences } = req.body;
        const farmer = await Farmer.findById(req.user.id);

        if (!farmer) {
            return res.status(404).json({ error: "Farmer not found" });
        }

        if (profile) {
            if (profile.name) farmer.name = profile.name;
            if (profile.phone) {
                const existing = await Farmer.findOne({ phone: profile.phone, _id: { $ne: farmer._id } });
                if (existing) {
                    return res.status(400).json({ error: "Phone already in use" });
                }
                farmer.phone = profile.phone;
            }
            if (profile.station) farmer.station = profile.station;
            if (profile.subscribed !== undefined) farmer.subscribed = profile.subscribed;
        }

        if (preferences) {
            if (preferences.notifications) {
                farmer.notifications = {
                    sms: preferences.notifications.sms !== undefined ? preferences.notifications.sms : farmer.notifications?.sms || true,
                    email: preferences.notifications.email !== undefined ? preferences.notifications.email : farmer.notifications?.email || false
                };
            }
            if (preferences.language) farmer.language = preferences.language;
        }

        await farmer.save();

        res.json({
            success: true,
            message: "Settings updated successfully",
            data: {
                name: farmer.name,
                phone: farmer.phone,
                station: farmer.station,
                subscribed: farmer.subscribed
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

function calculateFarmerRating(avgGrade, totalWeight, totalDeliveries) {
    let score = 0;

    if (avgGrade >= 80) score += 40;
    else if (avgGrade >= 75) score += 30;
    else if (avgGrade >= 60) score += 20;
    else if (avgGrade >= 50) score += 10;

    if (totalWeight >= 5000) score += 30;
    else if (totalWeight >= 3000) score += 25;
    else if (totalWeight >= 1000) score += 20;
    else if (totalWeight >= 500) score += 10;
    else score += 5;

    if (totalDeliveries >= 20) score += 20;
    else if (totalDeliveries >= 10) score += 15;
    else if (totalDeliveries >= 5) score += 10;
    else score += 5;

    let rating, level, badge, nextLevel;

    if (score >= 85) {
        rating = "Excellent";
        level = 5;
        badge = "🌟 Gold Farmer";
        nextLevel = "Max Level";
    } else if (score >= 70) {
        rating = "Very Good";
        level = 4;
        badge = "🥇 Silver Farmer";
        nextLevel = "5 points to Gold";
    } else if (score >= 55) {
        rating = "Good";
        level = 3;
        badge = "🥈 Bronze Farmer";
        nextLevel = "15 points to Silver";
    } else if (score >= 40) {
        rating = "Average";
        level = 2;
        badge = "🥉 Rising Farmer";
        nextLevel = "15 points to Bronze";
    } else {
        rating = "New Farmer";
        level = 1;
        badge = "🌱 New Farmer";
        nextLevel = "20 points to Rising";
    }

    return {
        rating,
        level,
        badge,
        nextLevel,
        score: Math.round(score)
    };
}

export default router;