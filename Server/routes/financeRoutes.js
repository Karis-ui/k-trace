import express from "express";
import mongoose from "mongoose";
import Payouts from "../models/Payouts.js";
import Farmer from "../models/Farmer.js";
import Grading from "../models/Grading.js";
import Operator from "../models/Operator.js";
import Delivery from "../models/Delivery.js";
import { 
    verifyToken, 
    isFinanceOperator,
    canProcessPayouts,
    canApprovePayouts 
} from "../middleware/auth.js";
import { sendSMS } from "../config/africastalking.js";

const router = express.Router();


router.get("/dashboard", verifyToken, isFinanceOperator, async (req, res) => {
    try {
        const operatorId = req.user.id;

        const [
            totalPayouts,
            pendingPayouts,
            approvedPayouts,
            completedPayouts,
            rejectedPayouts,
            totalAmount,
            monthlyPayouts,
            farmersWithPending,
            recentPayouts
        ] = await Promise.all([
            Payouts.countDocuments({ operatorId }),
            Payouts.countDocuments({ operatorId, status: 'pending' }),
            Payouts.countDocuments({ operatorId, status: 'approved' }),
            Payouts.countDocuments({ operatorId, status: 'completed' }),
            Payouts.countDocuments({ operatorId, status: 'rejected' }),
            Payouts.aggregate([
                { $match: { operatorId: new mongoose.Types.ObjectId(operatorId) } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Payouts.aggregate([
                { $match: { operatorId: new mongoose.Types.ObjectId(operatorId) } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        count: { $sum: 1 },
                        amount: { $sum: "$amount" }
                    }
                },
                { $sort: { _id: -1 } },
                { $limit: 12 }
            ]),
            Payouts.distinct('farmerId', { operatorId, status: 'pending' }),
            Payouts.find({ operatorId })
                .populate("farmerId", "name phone station")
                .populate("gradingId", "grade cuppingScore weight")
                .populate("approvedBy", "name email")
                .populate("processedBy", "name email")
                .sort({ createdAt: -1 })
                .limit(10)
        ]);

        // Get total farmers count
        const totalFarmers = await Farmer.countDocuments({ operatorId });

        // Calculate approval rate
        const totalProcessed = approvedPayouts + completedPayouts + rejectedPayouts;
        const approvalRate = totalProcessed > 0 
            ? ((approvedPayouts + completedPayouts) / totalProcessed * 100).toFixed(2)
            : 0;

        // Get payout by grade
        const payoutByGrade = await Payouts.aggregate([
            { $match: { operatorId: new mongoose.Types.ObjectId(operatorId) } },
            {
                $group: {
                    _id: "$grade",
                    count: { $sum: 1 },
                    amount: { $sum: "$amount" }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                summary: {
                    totalPayouts,
                    pendingPayouts,
                    approvedPayouts,
                    completedPayouts,
                    rejectedPayouts,
                    totalAmount: totalAmount[0]?.total || 0,
                    totalFarmers,
                    approvalRate: parseFloat(approvalRate)
                },
                monthlyTrend: monthlyPayouts.map(m => ({
                    month: m._id,
                    count: m.count,
                    amount: parseFloat(m.amount.toFixed(2))
                })),
                payoutByGrade: payoutByGrade.map(p => ({
                    grade: p._id || 'unknown',
                    count: p.count,
                    amount: parseFloat(p.amount.toFixed(2))
                })),
                farmersWithPending: farmersWithPending.length,
                recentPayouts
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/payouts", verifyToken, isFinanceOperator, async (req, res) => {
    try {
        const operatorId = req.user.id;
        const { status, farmerId, startDate, endDate, page = 1, limit = 20 } = req.query;

        let query = { operatorId };
        if (status) query.status = status;
        if (farmerId) query.farmerId = farmerId;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [payouts, total] = await Promise.all([
            Payouts.find(query)
                .populate("farmerId", "name phone station")
                .populate("gradingId", "grade cuppingScore weight")
                .populate("approvedBy", "name email")
                .populate("processedBy", "name email")
                .populate("calculatedBy", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Payouts.countDocuments(query)
        ]);

        const totalAmount = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);

        res.json({
            success: true,
            data: {
                payouts,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                },
                summary: {
                    total: payouts.length,
                    totalAmount: parseFloat(totalAmount.toFixed(2)),
                    averageAmount: payouts.length > 0 ? parseFloat((totalAmount / payouts.length).toFixed(2)) : 0,
                    pending: payouts.filter(p => p.status === "pending").length,
                    approved: payouts.filter(p => p.status === "approved").length,
                    completed: payouts.filter(p => p.status === "completed").length,
                    rejected: payouts.filter(p => p.status === "rejected").length
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/payouts/pending", verifyToken, isFinanceOperator, async (req, res) => {
    try {
        const operatorId = req.user.id;
        
        const pendingPayouts = await Payouts.find({ 
            operatorId, 
            status: 'pending' 
        })
            .populate("farmerId", "name phone station")
            .populate("gradingId", "grade cuppingScore weight")
            .sort({ createdAt: 1 });

        const totalAmount = pendingPayouts.reduce((sum, p) => sum + (p.amount || 0), 0);

        res.json({
            success: true,
            data: {
                count: pendingPayouts.length,
                totalAmount: parseFloat(totalAmount.toFixed(2)),
                payouts: pendingPayouts
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/payouts/:id/approve", verifyToken, canApprovePayouts, async (req, res) => {
    try {
        const { notes } = req.body;

        const payout = await Payouts.findById(req.params.id);
        if (!payout) {
            return res.status(404).json({ error: "Payout not found" });
        }

        if (payout.operatorId.toString() !== req.user.id && req.operator.role !== 'admin') {
            return res.status(403).json({ error: "You don't have permission for this payout" });
        }

        if (payout.status !== "pending") {
            return res.status(400).json({ 
                error: `Payout is already ${payout.status}` 
            });
        }

        payout.status = "approved";
        payout.approvedBy = req.user.id;
        payout.approvedAt = new Date();
        payout.approvalNotes = notes || "";

        await payout.save();

        try {
            const farmer = await Farmer.findById(payout.farmerId);
            if (farmer) {
                const message = `Your payout of $${payout.amount.toFixed(2)} has been approved. It will be processed shortly.`;
                await sendSMS(farmer.phone, message);
            }
        } catch (smsError) {
            console.error("SMS failed:", smsError.message);
        }

        res.json({
            success: true,
            message: "Payout approved successfully",
            data: payout
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/payouts/:id/process", verifyToken, canProcessPayouts, async (req, res) => {
    try {
        const { transactionId, notes } = req.body;

        const payout = await Payouts.findById(req.params.id);
        if (!payout) {
            return res.status(404).json({ error: "Payout not found" });
        }

        if (payout.operatorId.toString() !== req.user.id && req.operator.role !== 'admin') {
            return res.status(403).json({ error: "You don't have permission for this payout" });
        }

        if (payout.status !== "approved") {
            return res.status(400).json({ 
                error: `Payout must be approved first. Current status: ${payout.status}` 
            });
        }

        payout.status = "completed";
        payout.processedBy = req.user.id;
        payout.processedAt = new Date();
        payout.transactionId = transactionId || `TX-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        payout.processingNotes = notes || "";

        await payout.save();

        try {
            const farmer = await Farmer.findById(payout.farmerId);
            if (farmer) {
                const message = `Your payout of $${payout.amount.toFixed(2)} has been processed. Transaction ID: ${payout.transactionId}`;
                await sendSMS(farmer.phone, message);
            }
        } catch (smsError) {
            console.error("SMS failed:", smsError.message);
        }

        res.json({
            success: true,
            message: "Payout processed successfully",
            data: payout
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/payouts/:id/reject", verifyToken, canApprovePayouts, async (req, res) => {
    try {
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({ error: "Rejection reason is required" });
        }

        const payout = await Payouts.findById(req.params.id);
        if (!payout) {
            return res.status(404).json({ error: "Payout not found" });
        }

        if (payout.operatorId.toString() !== req.user.id && req.operator.role !== 'admin') {
            return res.status(403).json({ error: "You don't have permission for this payout" });
        }

        if (payout.status !== "pending" && payout.status !== "approved") {
            return res.status(400).json({ 
                error: `Cannot reject payout with status: ${payout.status}` 
            });
        }

        payout.status = "rejected";
        payout.rejectedBy = req.user.id;
        payout.rejectedAt = new Date();
        payout.rejectionReason = reason;

        await payout.save();

        try {
            const farmer = await Farmer.findById(payout.farmerId);
            if (farmer) {
                const message = `Your payout of $${payout.amount.toFixed(2)} was rejected. Reason: ${reason}. Please contact admin.`;
                await sendSMS(farmer.phone, message);
            }
        } catch (smsError) {
            console.error("SMS failed:", smsError.message);
        }

        res.json({
            success: true,
            message: "Payout rejected",
            data: payout
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/farmers", verifyToken, isFinanceOperator, async (req, res) => {
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

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [farmers, total] = await Promise.all([
            Farmer.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Farmer.countDocuments(query)
        ]);

        const farmersWithPayouts = await Promise.all(farmers.map(async (farmer) => {
            const payouts = await Payouts.find({ farmerId: farmer._id, operatorId });
            
            return {
                ...farmer.toObject(),
                totalPayouts: payouts.length,
                totalAmount: payouts.reduce((sum, p) => sum + (p.amount || 0), 0),
                pendingPayouts: payouts.filter(p => p.status === 'pending').length,
                completedPayouts: payouts.filter(p => p.status === 'completed').length,
                lastPayout: payouts.length > 0 ? payouts[0].createdAt : null
            };
        }));

        res.json({
            success: true,
            data: {
                farmers: farmersWithPayouts,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/farmers/:id", verifyToken, isFinanceOperator, async (req, res) => {
    try {
        const operatorId = req.user.id;
        const farmer = await Farmer.findOne({ _id: req.params.id, operatorId });
        
        if (!farmer) {
            return res.status(404).json({ error: "Farmer not found" });
        }

        const [payouts, gradings, deliveries] = await Promise.all([
            Payouts.find({ farmerId: farmer._id, operatorId }).sort({ createdAt: -1 }),
            Grading.find({ farmerId: farmer._id, operatorId }).sort({ date: -1 }),
            Delivery.find({ farmerId: farmer._id, operatorId }).sort({ date: -1 })
        ]);

        const totalPayouts = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);

        res.json({
            success: true,
            data: {
                farmer,
                stats: {
                    totalPayouts: payouts.length,
                    totalAmount: parseFloat(totalPayouts.toFixed(2)),
                    pendingPayouts: payouts.filter(p => p.status === 'pending').length,
                    approvedPayouts: payouts.filter(p => p.status === 'approved').length,
                    completedPayouts: payouts.filter(p => p.status === 'completed').length,
                    rejectedPayouts: payouts.filter(p => p.status === 'rejected').length,
                    totalDeliveries: deliveries.length,
                    totalWeight: deliveries.reduce((sum, d) => sum + (d.weight || 0), 0),
                    totalGradings: gradings.length
                },
                payouts: payouts.slice(0, 20),
                recentDeliveries: deliveries.slice(0, 10),
                recentGradings: gradings.slice(0, 10)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/reports/summary", verifyToken, isFinanceOperator, async (req, res) => {
    try {
        const operatorId = req.user.id;
        const { startDate, endDate } = req.query;

        let dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        const [payouts, farmers, gradings, deliveries] = await Promise.all([
            Payouts.find({ operatorId, ...dateFilter }),
            Farmer.find({ operatorId }),
            Grading.find({ operatorId, ...dateFilter }),
            Delivery.find({ operatorId, ...dateFilter })
        ]);

        const totalPaid = payouts
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0);

        const totalPending = payouts
            .filter(p => p.status === 'pending' || p.status === 'approved')
            .reduce((sum, p) => sum + p.amount, 0);

        const byGrade = {};
        payouts.forEach(p => {
            const grade = p.grade || 'unknown';
            byGrade[grade] = (byGrade[grade] || 0) + p.amount;
        });

        const byFarmer = {};
        payouts.forEach(p => {
            const farmerId = p.farmerId?.toString() || 'unknown';
            if (!byFarmer[farmerId]) {
                byFarmer[farmerId] = {
                    name: p.farmerId?.name || 'Unknown',
                    count: 0,
                    total: 0
                };
            }
            byFarmer[farmerId].count++;
            byFarmer[farmerId].total += p.amount;
        });

        const topFarmers = Object.values(byFarmer)
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);

        const monthlyTrend = {};
        payouts.forEach(p => {
            const month = new Date(p.createdAt).toISOString().slice(0, 7);
            if (!monthlyTrend[month]) {
                monthlyTrend[month] = { count: 0, amount: 0 };
            }
            monthlyTrend[month].count++;
            monthlyTrend[month].amount += p.amount;
        });

        res.json({
            success: true,
            data: {
                summary: {
                    totalFarmers: farmers.length,
                    totalGradings: gradings.length,
                    totalDeliveries: deliveries.length,
                    totalPayouts: payouts.length,
                    totalPaid: parseFloat(totalPaid.toFixed(2)),
                    totalPending: parseFloat(totalPending.toFixed(2)),
                    averagePayout: payouts.length > 0 
                        ? parseFloat((totalPaid / payouts.length).toFixed(2))
                        : 0
                },
                breakdown: {
                    byGrade,
                    topFarmers,
                    monthlyTrend: Object.entries(monthlyTrend).map(([month, data]) => ({
                        month,
                        count: data.count,
                        amount: parseFloat(data.amount.toFixed(2))
                    }))
                },
                dateRange: {
                    start: startDate || null,
                    end: endDate || null
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/settings", verifyToken, isFinanceOperator, async (req, res) => {
    try {
        const operator = await Operator.findById(req.user.id).select("-password");
        
        res.json({
            success: true,
            data: {
                profile: {
                    id: operator._id,
                    name: operator.name,
                    email: operator.email,
                    phone: operator.phone,
                    station: operator.station,
                    status: operator.status
                },
                financeDetails: operator.financeDetails || {
                    maxPayoutLimit: 10000,
                    requiresApproval: true,
                    permissions: {
                        canApprovePayouts: true,
                        canProcessPayouts: true,
                        canGenerateReports: true,
                        canViewAllPayouts: true
                    }
                },
                preferences: {
                    notifications: operator.notifications || {
                        email: true,
                        sms: true
                    },
                    language: operator.language || 'en',
                    currency: operator.currency || 'USD'
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/settings", verifyToken, isFinanceOperator, async (req, res) => {
    try {
        const { profile, financeDetails, preferences } = req.body;
        const operator = await Operator.findById(req.user.id);

        if (!operator) {
            return res.status(404).json({ error: "Operator not found" });
        }

        if (profile) {
            if (profile.name) operator.name = profile.name;
            if (profile.phone) operator.phone = profile.phone;
            if (profile.email) operator.email = profile.email;
            if (profile.station) operator.station = profile.station;
        }

        if (financeDetails) {
            operator.financeDetails = {
                ...operator.financeDetails,
                ...financeDetails
            };
        }

        if (preferences) {
            if (preferences.notifications) {
                operator.notifications = {
                    email: preferences.notifications.email !== undefined ? preferences.notifications.email : operator.notifications?.email || true,
                    sms: preferences.notifications.sms !== undefined ? preferences.notifications.sms : operator.notifications?.sms || true
                };
            }
            if (preferences.language) operator.language = preferences.language;
            if (preferences.currency) operator.currency = preferences.currency;
        }

        await operator.save();

        res.json({
            success: true,
            message: "Settings updated successfully",
            data: {
                name: operator.name,
                email: operator.email,
                phone: operator.phone
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;