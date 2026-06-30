import express from "express";
import mongoose from "mongoose";
import Operator from "../models/Operator.js";
import Farmer from "../models/Farmer.js";
import Delivery from "../models/Delivery.js";
import Grading from "../models/Grading.js";
import Payouts from "../models/Payouts.js";
import {
    verifyToken,
    isOperator,
    isDrymill,
    isWetmill,
    canProcessPayouts,
    canGradeCoffee
} from "../middleware/auth.js";
import { sendSMS } from "../config/africastalking.js";
import { calculateGrades } from "../config/Grade.js";
import Processing from "../models/Processing.js";
import Fermentation from "../models/Fermentation.js";
import Report from "../models/Report.js";

const router = express.Router();

const checkOperatorAccess = [verifyToken, isOperator];
const checkDrymillAccess = [verifyToken, isDrymill];
const checkWetmillAccess = [verifyToken, isWetmill];

router.get("/my", checkOperatorAccess, async (req, res) => {
    try {
        const operator = await Operator.findById(req.user.id).select("-password");
        if (!operator) {
            return res.status(404).json({ error: 'Operator not found' });
        }
        res.json({
            success: true,
            data: {
                id: operator._id,
                name: operator.name,
                email: operator.email,
                phone: operator.phone,
                role: operator.role,
                station: operator.station,
                status: operator.status
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/profile", checkOperatorAccess, async (req, res) => {
    try {
        const { name, phone, email, station } = req.body;
        const operator = await Operator.findById(req.user.id);
        if (!operator) {
            return res.status(404).json({ error: "Operator not found" });
        }
        if (name) operator.name = name;
        if (phone) {
            const existing = await Operator.findOne({ phone, _id: { $ne: operator._id } });
            if (existing) {
                return res.status(400).json({ error: "Phone already in use" });
            }
            operator.phone = phone;
        }
        if (email) {
            const existing = await Operator.findOne({ email, _id: { $ne: operator._id } });
            if (existing) {
                return res.status(400).json({ error: "Email already in use" });
            }
            operator.email = email;
        }
        if (station) operator.station = station;
        await operator.save();
        res.json({
            success: true,
            message: "Profile updated successfully.",
            data: operator
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/farmers/:id/profile", checkOperatorAccess, async (req, res) => {
    try {
        const operatorId = req.user.id;
        const farmerId = req.params.id;

        const farmer = await Farmer.findOne({ _id: farmerId, operatorId });
        if (!farmer) {
            return res.status(404).json({ error: "Farmer not found" });
        }

        const [deliveries, gradings, payouts, wetMilk, dryMilk, processing] = await Promise.all([
            Delivery.find({ farmerId: farmer._id, operatorId }).sort({ date: -1 }),
            Grading.find({ farmerId: farmer._id, operatorId }).sort({ date: -1 }),
            Payouts.find({ farmerId: farmer._id, operatorId }).sort({ createdAt: -1 }),
            WetMilk.find({ farmerId: farmer._id, operatorId }).sort({ createdAt: -1 }),
            DryMilk.find({ farmerId: farmer._id, operatorId }).sort({ createdAt: -1 }),
            Processing.find({ farmerId: farmer._id, operatorId }).sort({ createdAt: -1 })
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

        const recentActivity = [
            ...deliveries.slice(0, 5).map(d => ({
                type: 'delivery',
                date: d.date || d.createdAt,
                details: `${d.weight}kg delivered`,
                id: d._id
            })),
            ...gradings.slice(0, 5).map(g => ({
                type: 'grading',
                date: g.date || g.createdAt,
                details: `Graded: ${g.grade} (${g.cuppingScore})`,
                id: g._id
            })),
            ...payouts.slice(0, 5).map(p => ({
                type: 'payout',
                date: p.createdAt,
                details: `$${p.amount.toFixed(2)} paid`,
                id: p._id
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({
            success: true,
            data: {
                profile: {
                    id: farmer._id,
                    name: farmer.name,
                    phone: farmer.phone,
                    station: farmer.station,
                    farmerId: farmer.id || farmer._id,
                    status: farmer.status || 'active',
                    verified: farmer.verified || false,
                    subscribed: farmer.subscribed || false,
                    registeredAt: farmer.createdAt
                },
                statistics: {
                    totalDeliveries,
                    totalWeight: parseFloat(totalWeight.toFixed(2)),
                    totalGradings,
                    averageGrade: parseFloat(averageGrade.toFixed(2)),
                    totalPayouts: parseFloat(totalPayouts.toFixed(2)),
                    pendingPayouts: payoutStatus.pending,
                    specialtyRate: gradings.length > 0
                        ? parseFloat(((gradings.filter(g => g.grade?.toLowerCase() === 'specialty').length / gradings.length) * 100).toFixed(2))
                        : 0
                },
                gradeDistribution,
                payoutStatus,
                monthlyTrend: Object.entries(monthlyTrend).map(([month, data]) => ({
                    month,
                    weight: parseFloat(data.weight.toFixed(2)),
                    deliveries: data.count
                })),
                recent: {
                    deliveries: deliveries.slice(0, 10),
                    gradings: gradings.slice(0, 10),
                    payouts: payouts.slice(0, 10),
                    processing: processing.slice(0, 10)
                },
                recentActivity: recentActivity.slice(0, 10),
                wetMilk: {
                    total: wetMilk.length,
                    totalQuantity: wetMilk.reduce((sum, w) => sum + (w.quantity || 0), 0),
                    averageMoisture: wetMilk.length > 0
                        ? wetMilk.reduce((sum, w) => sum + (w.moistureLevel || 0), 0) / wetMilk.length
                        : 0
                },
                dryMilk: {
                    total: dryMilk.length,
                    totalQuantity: dryMilk.reduce((sum, d) => sum + (d.quantity || 0), 0)
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/deliveries", checkOperatorAccess, async (req, res) => {
    try {
        const operatorId = req.user.id;
        const { farmerId, startDate, endDate, page = 1, limit = 20 } = req.query;
        let query = { operatorId };
        if (farmerId) query.farmerId = farmerId;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [deliveries, total] = await Promise.all([
            Delivery.find(query)
                .populate("farmerId", "name phone station")
                .sort({ date: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Delivery.countDocuments(query)
        ]);
        const totalWeight = deliveries.reduce((sum, d) => sum + (d.weight || 0), 0);
        res.json({
            success: true,
            data: {
                deliveries,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                },
                summary: {
                    totalWeight: parseFloat(totalWeight.toFixed(2)),
                    averageWeight: deliveries.length > 0 ? parseFloat((totalWeight / deliveries.length).toFixed(2)) : 0
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/deliveries", checkOperatorAccess, async (req, res) => {
    try {
        const { farmerId, weight, moistureContent, notes } = req.body;
        const operatorId = req.user.id;

        if (!farmerId || !weight) {
            return res.status(400).json({ error: 'FarmerId and weight required' });
        }

        const farmer = await Farmer.findOne({ _id: farmerId, operatorId });
        if (!farmer) {
            return res.status(404).json({ error: "Farmer not found" });
        }

        const delivery = new Delivery({
            farmerId,
            operatorId,
            weight,
            moistureContent,
            notes,
            date: new Date(),
            createdBy: req.user.id
        });
        await delivery.save();

        try {
            const message = `Delivery recorded: ${weight}kg for ${farmer.name}. Thank you`;
            await sendSMS(farmer.phone, message);
        } catch (smsError) {
            console.error("SMS failed:", smsError.message);
        }

        res.status(201).json({
            success: true,
            message: "Delivery recorded successfully.",
            data: delivery
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/gradings", checkOperatorAccess, async (req, res) => {
    try {
        const operatorId = req.user.id;
        const { farmerId, status, grade, page = 1, limit = 20 } = req.query;
        let query = { operatorId };
        if (farmerId) query.farmerId = farmerId;
        if (status) query.status = status;
        if (grade) query.grade = grade;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [gradings, total] = await Promise.all([
            Grading.find(query)
                .populate("farmerId", "name phone")
                .sort({ date: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Grading.countDocuments(query)
        ]);

        const avgScore = gradings.length > 0
            ? gradings.reduce((sum, g) => sum + (g.cuppingScore || 0), 0) / gradings.length
            : 0;

        res.json({
            success: true,
            data: {
                gradings,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                },
                summary: {
                    averageScore: parseFloat(avgScore.toFixed(2)),
                    totalGradings: gradings.length,
                    gradedCount: gradings.filter(g => g.grade && g.grade !== 'pending').length,
                    pendingCount: gradings.filter(g => !g.grade || g.grade === 'pending').length,
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/gradings", canGradeCoffee, async (req, res) => {
    try {
        const { farmerId, weight, moistureContent, notes, grade, defects, cuppingScore } = req.body;
        const operatorId = req.user.id;

        if (!farmerId || !weight || !cuppingScore) {
            return res.status(400).json({ error: 'FarmerId, cuppingScore and weight required' });
        }

        const farmer = await Farmer.findOne({ _id: farmerId, operatorId });
        if (!farmer) {
            return res.status(404).json({ error: "Farmer not found" });
        }

        let finalGrade = grade;
        if (!finalGrade) {
            finalGrade = calculateGrades(cuppingScore);
        }

        const grading = new Grading({
            farmerId,
            operatorId,
            grade: finalGrade,
            cuppingScore,
            defects: defects || {},
            weight: weight,
            moistureContent,
            notes,
            date: new Date(),
            createdBy: req.user.id,
            payoutStatus: "Pending"
        });
        await grading.save();

        try {
            const message = `Coffee graded: ${finalGrade} with score ${cuppingScore}. Weight: ${weight}kg for ${farmer.name}.`;
            await sendSMS(farmer.phone, message);
        } catch (smsError) {
            console.error("SMS failed:", smsError.message);
        }

        res.status(201).json({
            success: true,
            message: "Graded successfully. Payout will be processed by finance.",
            data: grading
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/payouts", checkOperatorAccess, async (req, res) => {
    try {
        const operatorId = req.user.id;
        const { farmerId, status, page = 1, limit = 20 } = req.query;
        let query = { operatorId };
        if (farmerId) query.farmerId = farmerId;
        if (status) query.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [payouts, total] = await Promise.all([
            Payouts.find(query)
                .populate("farmerId", "name phone station")
                .populate("gradingId", "grade cuppingScore weight")
                .populate("approvedBy", "name email")
                .populate("processedBy", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Payouts.countDocuments(query)
        ]);

        const sanitizedPayouts = payouts.map(p => {
            const payout = p.toObject();
            if (req.user.role !== 'finance' && req.user.role !== 'admin') {
                delete payout.transactionId;
                delete payout.processingNotes;
                delete payout.rejectionReason;
            }
            return payout;
        });

        res.json({
            success: true,
            data: {
                payouts: sanitizedPayouts,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                },
                summary: {
                    totalAmount: payouts.reduce((sum, p) => sum + (p.amount || 0), 0),
                    pending: payouts.filter(p => p.status === 'pending').length,
                    approved: payouts.filter(p => p.status === 'approved').length,
                    completed: payouts.filter(p => p.status === 'completed').length
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/payouts/:id", checkOperatorAccess, async (req, res) => {
    try {
        const payout = await Payouts.findOne({
            _id: req.params.id,
            operatorId: req.user.id
        })
            .populate("farmerId", "name phone station")
            .populate("gradingId", "grade cuppingScore weight")
            .populate("approvedBy", "name email")
            .populate("processedBy", "name email");

        if (!payout) {
            return res.status(404).json({ error: "Payout not found" });
        }

        const sanitizedPayout = payout.toObject();
        if (req.user.role !== 'finance' && req.user.role !== 'admin') {
            delete sanitizedPayout.transactionId;
            delete sanitizedPayout.processingNotes;
            delete sanitizedPayout.rejectionReason;
        }

        res.json({
            success: true,
            data: sanitizedPayout
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/drymill/dashboard", checkDrymillAccess, async (req, res) => {
    try {
        const operatorId = req.user.id;
        const [totalDeliveries, totalGradings, pendingGrading, totalPayout, totalFarmers, totalWeight] = await Promise.all([
            Delivery.countDocuments({ operatorId }),
            Grading.countDocuments({ operatorId }),
            Grading.countDocuments({ operatorId, grade: null }),
            Payouts.aggregate([
                { $match: { operatorId: new mongoose.Types.ObjectId(operatorId) } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Farmer.countDocuments({ operatorId }),
            Delivery.aggregate([
                { $match: { operatorId: new mongoose.Types.ObjectId(operatorId) } },
                { $group: { _id: null, total: { $sum: "$weight" } } }
            ])
        ]);

        const intakeTrend = await Delivery.aggregate([
            { $match: { operatorId: new mongoose.Types.ObjectId(operatorId) } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 },
                    totalWeight: { $sum: "$weight" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const gradeDistribution = await Grading.aggregate([
            { $match: { operatorId: new mongoose.Types.ObjectId(operatorId) } },
            { $group: { _id: "$grade", count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            data: {
                dashboard: {
                    totalDeliveries: totalDeliveries || 0,
                    totalGradings: totalGradings || 0,
                    pendingGrading: pendingGrading || 0,
                    totalPayout: totalPayout[0]?.total || 0,
                    totalFarmers: totalFarmers || 0,
                    totalWeight: totalWeight[0]?.total || 0,
                    gradingRate: totalDeliveries > 0
                        ? ((totalGradings / totalDeliveries) * 100).toFixed(2)
                        : 0
                },
                trends: {
                    intakeTrend,
                    gradeDistribution: gradeDistribution.map(d => ({
                        grade: d._id || 'pending',
                        count: d.count
                    }))
                },
                recentDeliveries: await Delivery.find({ operatorId })
                    .sort({ date: -1 })
                    .limit(10)
                    .populate("farmerId", "name phone")
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/wetmill/dashboard", checkWetmillAccess, async (req, res) => {
    try {
        const operatorId = req.user.id;
        const [totalDeliveries, totalGradings, totalPayout, totalFarmers, totalWeight] = await Promise.all([
            Delivery.countDocuments({ operatorId }),
            Grading.countDocuments({ operatorId }),
            Payouts.aggregate([
                { $match: { operatorId: new mongoose.Types.ObjectId(operatorId) } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Farmer.countDocuments({ operatorId }),
            Delivery.aggregate([
                { $match: { operatorId: new mongoose.Types.ObjectId(operatorId) } },
                { $group: { _id: null, total: { $sum: "$weight" } } }
            ])
        ]);

        const intakeTrend = await Delivery.aggregate([
            { $match: { operatorId: new mongoose.Types.ObjectId(operatorId) } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 },
                    totalWeight: { $sum: "$weight" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                dashboard: {
                    totalDeliveries: totalDeliveries || 0,
                    totalGradings: totalGradings || 0,
                    totalPayout: totalPayout[0]?.total || 0,
                    totalFarmers: totalFarmers || 0,
                    totalWeight: totalWeight[0]?.total || 0,
                },
                trends: { intakeTrend },
                recentDeliveries: await Delivery.find({ operatorId })
                    .sort({ date: -1 })
                    .limit(10)
                    .populate("farmerId", "name phone")
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/settings', checkOperatorAccess, async (req, res) => {
    try {
        const operator = await Operator.findById(req.user.id).select('-password');
        if (!operator) {
            return res.status(404).json({ error: "Operator not found" });
        }

        let roleDetails = {};
        if (operator.role === 'drymill') {
            roleDetails = {
                capacity: operator.drymillDetails?.capacity || 0,
                equipment: operator.drymillDetails?.equipment || [],
                processingTypes: operator.drymillDetails?.processingTypes || []
            };
        }
        else if (operator.role === 'wetmill') {
            roleDetails = {
                capacity: operator.wetmillDetails?.capacity || 0,
                fermentationTanks: operator.wetmillDetails?.fermentationTanks || 0,
                dryingBeds: operator.wetmillDetails?.dryingBeds || 0
            };
        }
        else if (operator.role === 'finance') {
            roleDetails = {
                maxPayoutLimit: operator.financeDetails?.maxPayoutLimit || 10000,
                requiresApproval: operator.financeDetails?.requiresApproval !== false
            };
        }
        res.json({
            success: true,
            data: {
                profile: {
                    id: operator._id,
                    name: operator.name,
                    email: operator.email,
                    phone: operator.phone,
                    role: operator.role,
                    station: operator.station,
                    status: operator.status
                },
                roleDetails,
                preferences: {
                    notifications: operator.notifications || {
                        email: true,
                        sms: true,
                        push: true
                    },
                    language: operator.language || 'en',
                    theme: operator.theme || 'light',
                    timezone: operator.timezone || 'UTC'
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/settings', checkOperatorAccess, async (req, res) => {
    try {
        const { profile, preferences, roleDetails } = req.body;
        const operator = await Operator.findById(req.user.id);
        if (!operator) {
            return res.status(404).json({ error: "Operator not found" });
        }

        if (profile) {
            if (profile.name) operator.name = profile.name;
            if (profile.phone) {
                const existing = await Operator.findOne({ phone: profile.phone, _id: { $ne: operator._id } });
                if (existing) {
                    return res.status(400).json({ error: "Phone number already in use" });
                }
                operator.phone = profile.phone;
            }
            if (profile.phone) {
                const existing = await Operator.findOne({ email: profile.email, _id: { $ne: operator._id } });
                if (existing) {
                    return res.status(400).json({ error: "Email already in use" });
                }
                operator.email = profile.email;
            }
            if (profile.station) operator.station = profile.station;
        }
        if (preferences) {
            if (preferences.notifications) {
                operator.notifications = {
                    email: preferences.notifications.email !== undefined ? preferences.notifications.email : operator.notifications?.email || true,
                    sms: preferences.notifications.sms !== undefined ? preferences.notifications.sms : operator.notifications?.sms || true,
                    push: preferences.notifications.push !== undefined ? preferences.notifications.push : operator.notifications?.push || true
                };
            }
            if (preferences.language) operator.language = preferences.language;
            if (preferences.theme) operator.theme = preferences.theme;
            if (preferences.timezone) operator.timezone = preferences.timezone;
        }
        if (roleDetails) {
            if (operator.role === 'drymill') {
                operator.drymillDetails = {
                    ...operator.drymillDetails,
                    capacity: roleDetails.capacity || operator.drymillDetails?.capacity,
                    equipment: roleDetails.equipment || operator.drymillDetails?.equipment,
                    processingTypes: roleDetails.processingTypes || operator.drymillDetails?.processingTypes
                };
            }
            else if (operator.role === 'wetmill') {
                operator.wetmillDetails = {
                    ...operator.wetmillDetails,
                    capacity: roleDetails.capacity || operator.wetmillDetails?.capacity,
                    fermentationTanks: roleDetails.fermentationTanks || operator.wetmillDetails?.fermentationTanks,
                    dryingBeds: roleDetails.dryingBeds || operator.wetmillDetails?.dryingBeds
                };
            }
            else if (operator.role === 'finance') {
                operator.financeDetails = {
                    ...operator.financeDetails,
                    maxPayoutLimit: roleDetails.maxPayoutLimit || operator.financeDetails?.maxPayoutLimit,
                    requiresApproval: roleDetails.requiresApproval !== undefined ? roleDetails.requiresApproval : operator.financeDetails?.requiresApproval
                };
            }
        }
        res.json({
            success: true,
            data: {
                profile: {
                    name: operator.name,
                    email: operator.email,
                    phone: operator.phone,
                    station: operator.station
                },
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/drymill/farmers", checkDrymillAccess, async (req, res) => {
    try {
        const operatorId = req.user.id;
        const { search, page = 1, limit = 20 } = req.query;
        let query = { operatorId };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (parseInt(page - 1)) * parseInt(limit);
        const [farmers, total] = await Promise.all([
            Farmer.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
            Farmer.countDocuments(query)
        ]);

        const farmersWithStats = await Promise.all(farmers.map(async (farmer) => {
            const [deliveries, gradings, payouts] = await Promise.all([
                Delivery.find({ farmerId: farmer._id, operatorId }),
                Grading.find({ farmerId: farmer._id, operatorId }),
                Payouts.find({ farmerId: farmer._id, operatorId }),
            ]);
            const totalWeight = deliveries.reduce((sum, d) => sum + (d.weight || 0), 0);
            const avgScore = gradings.length > 0 ? gradings.reduce((sum, g) => sum + (g.cuppingScore || 0), 0) / gradings.length : 0;
            const specialtyCount = gradings.filter(g =>
                g.grade?.toLowerCase() === 'speciality'
            ).length;
            return {
                _id: farmer._id,
                name: farmer.name,
                phone: farmer.phone,
                station: farmer.station,
                status: farmer.status || 'active',
                totalDeliveries: deliveries.length,
                totalWeight: parseFloat(totalWeight.toFixed(2)),
                totalGradings: gradings.length,
                averageGrade: parseFloat(avgScore.toFixed(2)),
                specialtyRate: gradings.length > 0
                    ? parseFloat(((specialtyCount / gradings.length) * 100).toFixed(2))
                    : 0,
                totalPayouts: payouts.reduce((sum, p) => sum + (p.amount || 0), 0),
                lastDelivery: deliveries.length > 0 ? deliveries[0].date : null,
                recentGradings: gradings.slice(0, 5)
            };
        }))
        const summary = {
            total: farmersWithStats.length,
            totalWeight: farmersWithStats.reduce((sum, g) => sum + g.totalWeight, 0),
            totalPayouts: farmersWithStats.length > 0,
            averageGrade: farmersWithStats.length > 0 ? farmersWithStats.reduce((sum, f) => sum + f.averageGrade, 0) / farmersWithStats.length : 0,
            activeFarmers: farmersWithStats.filter(f => f.status == 'active').length
        };
        res.json({
            success: true,
            data: {
                farmers: farmersWithStats,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                },
                summary
            }
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/wetmill/farmers", checkWetmillAccess, async (req, res) => {
    try {
        const operatorId = req.user.id;
        const { search, page = 1, limit = 20 } = req.query;
        let query = { operatorId };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (parseInt(page - 1)) * parseInt(limit);
        const [farmers, total] = await Promise.all([
            Farmer.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
            Farmer.countDocuments(query)
        ]);

        const farmersWithStats = await Promise.all(farmers.map(async (farmer) => {
            const [deliveries, payouts] = await Promise.all([
                Delivery.find({ farmerId: farmer._id, operatorId }),
                Payouts.find({ farmerId: farmer._id, operatorId }),
            ]);
            const totalWeight = deliveries.reduce((sum, d) => sum + (d.weight || 0), 0);
            return {
                _id: farmer._id,
                name: farmer.name,
                phone: farmer.phone,
                station: farmer.station,
                status: farmer.status || 'active',
                totalDeliveries: deliveries.length,
                totalWeight: parseFloat(totalWeight.toFixed(2)),
                totalPayouts: payouts.reduce((sum, p) => sum + (p.amount || 0), 0),
                lastDelivery: deliveries.length > 0 ? deliveries[0].date : null,
                recentDeliveries: deliveries.slice(0, 5)
            };
        }))
        const summary = {
            total: farmersWithStats.length,
            totalWeight: farmersWithStats.reduce((sum, g) => sum + g.totalWeight, 0),
            totalPayouts: farmersWithStats.length > 0,
            activeFarmers: farmersWithStats.filter(f => f.status == 'active').length
        };
        res.json({
            success: true,
            data: {
                farmers: farmersWithStats,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                },
                summary
            }
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/drymill/processing", checkDrymillAccess, async (req, res) => {
    try {
        const operatorId = req.user.id;
        const { status, startDate, endDate, page = 1, limit = 20 } = req.query;
        let query = operatorId;
        if (status) query.status = status;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.gradingRate.$lte = new Date(endDate);
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [processing, total] = await Promise.all([
            Processing.find(query)
                .populate("farmerId", "name phone station")
                .populate("lotId", "weight grade")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Processing.countDocuments(query)
        ]);
        const summary = {
            total: processing.length,
            pending: processing.filter(p => p.status === 'pending').length,
            inProgress: processing.filter(p => p.status === 'inProgress').length,
            completed: processing.filter(p => p.status === 'completed').length,
            totlaQuantitiy: processing.filter((sum, p) => sum + (p.quanity || 0), 0)
        };
        res.json({
            success: true,
            data: {
                processing,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                },
                summary
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/drymill/processing", checkDrymillAccess, async (req, res) => {
    try {
        const { lotId, farmerId, quantity, type, equipment, startDate, expectedEndDate, notes } = req.body;
        const operatorId = req.user.id;

        if (!farmerId || !quanity) {
            return res.status(400).json({
                error: "Farmer Id and quantity required"
            });
        }

        const farmer = await Farmer.findOne({ _id: farmerId, operatorId });
        if (!farmer) {
            return res.status(404).json({
                error: "Farmer not found"
            });
        }

        const processing = new Processing({
            operatorId, farmerId, lotId: lotId || new mongoose.Types.ObjectId(),
            quantity, type: type || 'dry', equipment: equipment || [],
            startDate: startDate || new Date(), expectedEndDate: expectedEndDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'pending', progress: 0, notes, createdBy: req.user.id
        });
        await processing.save();
        try {
            const message = `Processing started for ${quantity}kg. Expected completion: ${new Date(expectedEndDate).toLocaleDateString()}`;
            await sendSMS(farmer.phone, message);
        } catch (smserr) {
            console.log("SMS failed:", smserr.message);
        }
        res.status(201).json({
            success: true, message: "Processing batch created successfully.", data: processing
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/drymill/processing/:id", checkDrymillAccess, async (req, res) => {
    try {
        const { status, progress, equipment, completedAt, notes } = req.body;
        const operatorId = req.user.id;
        const processing = await Processing.findOne({
            _id: req.params.id,
            operatorId
        });

        if (!processing) {
            return res.status(404).json({
                error: "Processing batch not found"
            });
        }
        if (status) {
            processing.status = status;
            if (status === 'completed') {
                processing.completedAt = completedAt || new Date();
                processing.progress = 100;
            }
        }
        if (progress !== undefined) processing.progress = progress;
        if (equipment) processing.equipment = equipment;
        if (notes) processing.notes = notes;

        if (status === 'completed') {
            try {
                const farmer = await Farmer.findById(processing.farmerId);
                const message = `Processing completed for your batch. Quantity:${processing.quantity}kg.`;
                await sendSMS(farmer.phone, message);
            } catch (smserr) {
                console.log("SMS failed:", smserr.message);
            }
        }
        res.status(201).json({
            success: true, message: "Processing batch created successfully.", data: processing
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/drymill/processing/:id", checkDrymillAccess, async (req, res) => {
    try {
        const operatorId = req.user.id;
        const processing = await Processing.findByIdAndDelete({
            _id: req.params.id,
            operatorId
        });
        if (!processing) {
            return res.status(404).json({ error: "Processing batch not found" });
        }
        res.json({
            success: true,
            message: "Processing batch deleted successfully."
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/wetmill/fermentation", checkWetmillAccess, async (req, res) => {
    try {
        const operatorId = req.user.id;
        const { status, startDate, endDate, page = 1, limit = 20 } = req.query;

        let query = { operatorId };
        if (status) query.status = status;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [fermentations, total] = await Promise.all([
            Fermentation.find(query)
                .populate("farmerId", "name phone station")
                .populate("lotId", "weight")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Fermentation.countDocuments(query)
        ]);

        const summary = {
            total: fermentations.length,
            completed: fermentations.filter(f => f.status === 'completed').length,
            inProgress: fermentations.filter(f => f.status === 'inProgress').length,
            pending: fermentations.filter(f => f.status === 'pending').length,
            completionRate: fermentations.length > 0
                ? ((fermentations.filter(f => f.status === 'completed').length / fermentations.length) * 100).toFixed(2)
                : 0
        };

        res.json({
            success: true,
            data: {
                fermentations,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                },
                summary
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/wetmill/fermentation", checkWetmillAccess, async (req, res) => {
    try {
        const {
            lotId,
            farmerId,
            quantity,
            tankNumber,
            temperature,
            phLevel,
            startDate,
            expectedEndDate,
            notes
        } = req.body;
        const operatorId = req.user.id;

        if (!farmerId || !quantity || !tankNumber) {
            return res.status(400).json({
                error: "Farmer ID, quantity and tank number are required"
            });
        }

        const farmer = await Farmer.findOne({ _id: farmerId, operatorId });
        if (!farmer) {
            return res.status(404).json({ error: "Farmer not found" });
        }

        const fermentation = new Fermentation({
            operatorId,
            farmerId,
            lotId: lotId || new mongoose.Types.ObjectId(),
            quantity,
            tankNumber,
            temperature: temperature || 20,
            phLevel: phLevel || 4.5,
            startDate: startDate || new Date(),
            expectedEndDate: expectedEndDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            status: 'pending',
            progress: 0,
            notes,
            createdBy: req.user.id
        });

        await fermentation.save();

        try {
            const message = `Fermentation started for ${quantity}kg in tank ${tankNumber}. Expected completion: ${new Date(expectedEndDate).toLocaleDateString()}`;
            await sendSMS(farmer.phone, message);
        } catch (smsError) {
            console.error("SMS failed:", smsError.message);
        }

        res.status(201).json({
            success: true,
            message: "Fermentation batch created successfully",
            data: fermentation
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/wetmill/fermentation/:id", checkWetmillAccess, async (req, res) => {
    try {
        const { status, temperature, phLevel, progress, notes, completedAt } = req.body;
        const operatorId = req.user.id;

        const fermentation = await Fermentation.findOne({
            _id: req.params.id,
            operatorId
        });

        if (!fermentation) {
            return res.status(404).json({ error: "Fermentation batch not found" });
        }

        if (status) {
            fermentation.status = status;
            if (status === 'completed') {
                fermentation.completedAt = completedAt || new Date();
                fermentation.progress = 100;
            }
            if (status === 'inProgress') {
                fermentation.progress = progress || 50;
            }
        }
        if (temperature !== undefined) fermentation.temperature = temperature;
        if (phLevel !== undefined) fermentation.phLevel = phLevel;
        if (progress !== undefined) fermentation.progress = progress;
        if (notes) fermentation.notes = notes;

        await fermentation.save();

        if (status === 'completed') {
            try {
                const farmer = await Farmer.findById(fermentation.farmerId);
                if (farmer) {
                    const message = `Fermentation completed for ${fermentation.quantity}kg in tank ${fermentation.tankNumber}`;
                    await sendSMS(farmer.phone, message);
                }
            } catch (smsError) {
                console.error("SMS failed:", smsError.message);
            }
        }

        res.json({
            success: true,
            message: "Fermentation batch updated successfully",
            data: fermentation
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/wetmill/fermentation/:id", checkWetmillAccess, async (req, res) => {
    try {
        const operatorId = req.user.id;
        const fermentation = await Fermentation.findOneAndDelete({
            _id: req.params.id,
            operatorId
        });

        if (!fermentation) {
            return res.status(404).json({ error: "Fermentation batch not found" });
        }

        res.json({
            success: true,
            message: "Fermentation batch deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/drymill/reports", checkDrymillAccess, async (req, res) => {
    try {
        const operatorId = req.user.id;
        const { type = 'daily', startDate, endDate } = req.query;

        let dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        const [deliveries, gradings, processing, payouts] = await Promise.all([
            Delivery.find({ operatorId, ...dateFilter }),
            Grading.find({ operatorId, ...dateFilter }),
            Processing.find({ operatorId, ...dateFilter }),
            Payouts.find({ operatorId, ...dateFilter })
        ]);
        let reportData = {
            type,
            generatedAt: new Date(),
            summary: {
                totalDeliveries: deliveries.length,
                totalWeight: deliveries.reduce((sum, d) => sum + (d.weight || 0), 0),
                totalGradings: gradings.length,
                averageGrade: gradings.length > 0 ? gradings.reduce((sum, g) => sum + (g.cuppingScore || 0), 0) / gradings.length : 0,
                totalProcessing: processing.length,
                processingStatus: {
                    pending: processing.filter(p => p.status === 'pending').length,
                    inProgress: processing.filter(p => p.status === 'inProgress').length,
                    completed: processing.filter(p => p.status === 'completed').length
                },
                totalPayouts: payouts.reduce((sum, d) => sum + (d.amount || 0), 0)
            },
            gradeDistribution: await calculateGradeDistribution(gradings),
            recentActivity: await getRecentActivity(deliveries, gradings, payouts, 10)
        };

        const report = new Report({
            type,
            data: reportData,
            generatedBy: req.user.id,
            operatorId,
            dateRange: {
                start: startDate ? new Date(startDate) : null,
                end: endDate ? new Date(endDate) : null
            },
            generatedAt: new Date()
        });
        await report.save();
        res.json({
            success: true,
            data: reportData,
            meta: {
                reportId: report._id,
                type,
                generatedAt: report.generatedAt
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/wetmill/reports", checkWetmillAccess, async (req, res) => {
    try {
        const operatorId = req.user.id;
        const { type = 'daily', startDate, endDate } = req.query;

        let dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        const [deliveries, fermentation, payouts] = await Promise.all([
            Delivery.find({ operatorId, ...dateFilter }),
            Fermentation.find({ operatorId, ...dateFilter }),
            Payouts.find({ operatorId, ...dateFilter })
        ]);
        let reportData = {
            type,
            generatedAt: new Date(),
            summary: {
                totalDeliveries: deliveries.length,
                totalWeight: deliveries.reduce((sum, d) => sum + (d.weight || 0), 0),
                totalFerments: fermentation.length,
                averageDelivery: deliveries.length > 0 ? deliveries.reduce((sum, g) => sum + (g.weight || 0), 0) / deliveries.length : 0,
                completionRate: fermentations.length > 0
                    ? ((fermentations.filter(f => f.status === 'completed').length / fermentations.length) * 100).toFixed(2)
                    : 0,
                totalFerments: fermentation.length,
                fermentationStatus: {
                    pending: processing.filter(p => p.status === 'pending').length,
                    inProgress: processing.filter(p => p.status === 'inProgress').length,
                    completed: processing.filter(p => p.status === 'completed').length,
                    cancelled: fermentation.filter(p => p.status === 'cancelled').length
                },
                totalPayouts: payouts.reduce((sum, d) => sum + (d.amount || 0), 0)
            },
            moistureDistribution: await calculateMoistureDistribution(fermentation),
            recentActivity: await getRecentActivity(deliveries, fermentation, payouts, 10)
        };

        const report = new Report({
            type,
            data: reportData,
            generatedBy: req.user.id,
            operatorId,
            dateRange: {
                start: startDate ? new Date(startDate) : null,
                end: endDate ? new Date(endDate) : null
            },
            generatedAt: new Date()
        });
        await report.save();
        res.json({
            success: true,
            data: reportData,
            meta: {
                reportId: report._id,
                type,
                generatedAt: report.generatedAt
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/drymill/reports/:id/download", checkDrymillAccess, async (req, res) => {
    try {
        const report = await Report.findOne({
            _id: req.params.id, operatorId: req.user.id
        });
        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }
        res.json({
            success: true,
            data: report.data,
            format: 'json',
            generatedAt: report.generatedAt
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

async function calculateGradeDistribution(gradings) {
    const distribution = {};
    const total = gradings.length || 1;
    gradings.forEach(grading => {
        const grade = grading.grade || 'pending';
        distribution[grade] = (distribution[grade] || 0) + 1;
    });

    const result = {};
    Object.entries(distribution).forEach(([grade, count]) => {
        result[grade] = {
            count,
            percentage: parseFloat(((count / total) * 100).toFixed(2))
        };
    });
    return result;
}

async function getRecentActivity(deliveries, gradings, payouts, limit = 10) {
    const activities = [
        ...deliveries.map(d => ({
            type: "delivery",
            date: d.createdAt || d.date,
            farmer: d.farmerId?.name || "Unknown",
            details: `${d.weight || 0}kg delivered`,
            id: d._id
        })),
        ...gradings.map(g => ({
            type: "grading",
            date: g.date || g.createdAt,
            farmer: g.farmerId?.name || "Unknown",
            details: `Graded: ${g.grade || 'pending'} (${g.cuppingScore || 0})`,
            id: g._id
        })),
        ...payouts.map(p => ({
            type: "payout",
            date: p.createdAt,
            farmer: p.farmerId?.name || "Unknown",
            details: `$${(p.amount || 0).toFixed(2)} paid`,
            id: p._id
        }))
    ];

    return activities
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
}

async function calculateMoistureDistribution(ferments) {
    const distribution = {};
    const total = ferments.length || 1;
    ferments.forEach(ferment => {
        const ferver = ferment.ferver || 'pending';
        distribution[ferver] = (distribution[ferver] || 0) + 1;
    });
    const result = {};
    Object.entries(distribution).forEach(([ferver, count]) => {
        result[ferver] = {
            count,
            percentage: parseFloat((count / total) * 100).toFixed(2)
        };
    });
    return result;
}

export default router;