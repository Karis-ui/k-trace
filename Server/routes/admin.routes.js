import express from "express";
import mongoose from "mongoose";
import Farmer from "../models/Farmer.js";
import Buyer from "../models/Buyer.js";
import Operator from "../models/Operator.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import Orders from "../models/Orders.js";
import Delivery from "../models/Delivery.js";
import Catalog from "../models/Catalog.js";
import Container from "../models/Container.js";
import Price from "../models/Price.js";
import Grading from "../models/Grading.js";
import Payouts from "../models/Payouts.js";
import Inventory from "../models/Inventory.js";
import Report from "../models/Report.js";
import Export from "../models/Export.js";
import Exportdoc from "../models/Exportdoc.js";
import Shipment from "../models/Shipment.js";
import { sendSMS } from "../config/africastalking.js";

const router = express.Router();

router.get("/users", verifyToken, isAdmin, async (req, res) => {
    try {
        const farmers = await Farmer.find();
        const operators = await Operator.find();
        const buyers = await Buyer.find();
        const deliveries = await Delivery.find().populate("farmerId");
        const orders = await Orders.find().populate("buyerId");
        const catalogs = await Catalog.find().populate({ 
            path: "gradingId", 
            populate: { path: "lotId operatorId" } 
        });
        const gradings = await Grading.find().populate("lotId").populate("operatorId");
        
        res.json({ 
            farmers, 
            operators, 
            buyers, 
            deliveries, 
            orders, 
            catalogs, 
            gradings 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/operator/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const operator = await Operator.findById(req.params.id);
        if (!operator) {
            return res.status(404).json({ error: "Operator not found" });
        }
        res.json(operator);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/buyer/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const buyer = await Buyer.findById(req.params.id);
        if (!buyer) {
            return res.status(404).json({ error: "Buyer not found" });
        }
        res.json(buyer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:type/:id", verifyToken, isAdmin, async (req, res) => {
    const { type, id } = req.params;
    const models = { 
        farmer: Farmer, 
        buyer: Buyer, 
        catalog: Catalog, 
        delivery: Delivery, 
        grading: Grading, 
        operator: Operator, 
        order: Orders, 
        price: Price,
        payout: Payouts,
        inventory: Inventory
    };
    try {
        const model = models[type];
        if (!model) {
            return res.status(400).json({ error: "Invalid Type." });
        }
        await model.findByIdAndDelete(id);
        res.json({ success: true, message: `${type} deleted!` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/farmer/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, phone, station } = req.body;
        const farmer = await Farmer.findById(req.params.id);
        if (!farmer) {
            return res.status(404).json({ error: "Farmer not found!" });
        }

        if (name) farmer.name = name;
        if (phone) farmer.phone = phone;
        if (station) farmer.station = station;
        await farmer.save();
        
        res.status(200).json({ 
            success: true, 
            message: "Farmer updated successfully", 
            farmer 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/operator/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, phone, email, station, role } = req.body;
        const operator = await Operator.findById(req.params.id);
        if (!operator) {
            return res.status(404).json({ error: "Operator not found!" });
        }

        if (name) operator.name = name;
        if (phone) operator.phone = phone;
        if (email) operator.email = email;
        if (station) operator.station = station;
        if (role) operator.role = role;
        await operator.save();
        
        res.status(200).json({ 
            success: true, 
            message: "Operator updated successfully", 
            operator 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/buyer/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, email, phone, company } = req.body;
        const buyer = await Buyer.findById(req.params.id);
        if (!buyer) {
            return res.status(404).json({ error: "Buyer not found!" });
        }

        if (name) buyer.name = name;
        if (email) buyer.email = email;
        if (phone) buyer.phone = phone;
        if (company) buyer.company = company;
        await buyer.save();
        
        res.status(200).json({ 
            success: true, 
            message: "Buyer updated successfully", 
            buyer 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/stats", verifyToken, isAdmin, async (req, res) => {
    try {
        const [farmers, deliveries, gradings] = await Promise.all([
            Farmer.countDocuments(),
            Delivery.countDocuments(),
            Grading.countDocuments()
        ]);

        const totalWeight = await Delivery.aggregate([{ 
            $group: { _id: null, total: { $sum: "$weight" } } 
        }]);
        
        res.json({
            totalFarmers: farmers,
            totalDeliveries: deliveries,
            totalGradings: gradings,
            totalWeight: totalWeight[0]?.total || 0,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/analytics", verifyToken, isAdmin, async (req, res) => {
    try {
        const { timeframe = "monthly", startDate, endDate } = req.query;
        
        let dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        const [
            farmers,
            deliveries,
            gradings,
            payouts,
            operators,
            buyers
        ] = await Promise.all([
            Farmer.find(),
            Delivery.find(dateFilter).populate("farmerId"),
            Grading.find(dateFilter).populate("lotId").populate("operatorId"),
            Payouts.find(dateFilter).populate("farmerId"),
            Operator.find(),
            Buyer.find()
        ]);

        const totalFarmers = farmers.length;
        const totalIntake = deliveries.reduce((sum, d) => sum + (d.weight || 0), 0);
        const totalPayouts = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);
        const pendingPayouts = payouts.filter(p => p.status === 'pending').length;
        
        const activeWetMills = operators.filter(o => o.role === 'wetmill' && o.status === "active").length;
        const activeDryMills = operators.filter(o => o.role === 'drymill' && o.status === "active").length;
        const activeBuyers = buyers.filter(b => b.status === 'active').length;

        const totalWeight = await Delivery.aggregate([{ 
            $group: { _id: null, total: { $sum: "$weight" } } 
        }]);

        const intakeTrend = await calculateIntakeTrend(deliveries, timeframe);
        const lotDistribution = await calculateLotDistribution(gradings);
        const gradeDistribution = await calculateGradeDistribution(gradings);
        const topFarmers = await calculateTopFarmers(deliveries, gradings);
        const recentActivity = await getRecentActivity(deliveries, gradings, payouts);
        const topWetmills = await calculateTopWetMills(operators, gradings);
        const farmerPerformance = await calculateFarmerPerformance(farmers, deliveries, gradings);
        const qualityMetrics = await calculateQualityMetrics(gradings);
        const defectAnalysis = await analyzeDefects(gradings);

        res.json({
            success: true,
            data: {
                totalFarmers,
                totalIntake: parseFloat(totalIntake.toFixed(2)),
                pendingPayouts,
                activeWetMills,
                totalPayouts: parseFloat(totalPayouts.toFixed(2)),
                totalWeight: totalWeight[0]?.total || 0,
                intakeTrend,
                lotDistribution,
                gradeDistribution,
                topFarmers,
                recentActivity,
                topWetmills,
                farmerPerformance,
                qualityMetrics,
                defectAnalysis,
                summary: {
                    totalFarmers,
                    totalOperators: operators.length,
                    totalBuyers: buyers.length,
                    totalDeliveries: deliveries.length,
                    totalGradings: gradings.length,
                    activeDryMills,
                    activeWetMills,
                    activeBuyers,
                    completionRate: deliveries.length > 0
                        ? parseFloat(((gradings.length / deliveries.length) * 100).toFixed(2))
                        : 0,
                    averageGrade: calculateAverageGrade(gradings)
                },
                timeframe,
                generatedAt: new Date()
            }
        });
    } catch (err) {
        console.error("Analytics error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.get("/farmers", verifyToken, isAdmin, async (req, res) => {
    try {
        const { station, search, sort = "-createdAt", limit = 50 } = req.query;
        let query = {};
        if (station) query.station = station;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }
        const farmers = await Farmer.find(query).sort(sort).limit(parseInt(limit));
        
        const farmersWithStats = await Promise.all(farmers.map(async (farmer) => {
            const [deliveries, gradings, payouts] = await Promise.all([
                Delivery.find({ farmerId: farmer._id }),
                Grading.find({ farmerId: farmer._id }),
                Payouts.find({ farmerId: farmer._id })
            ]);

            return {
                _id: farmer._id,
                name: farmer.name,
                phone: farmer.phone,
                station: farmer.station,
                createdAt: farmer.createdAt,
                totalDeliveries: deliveries.length,
                totalWeight: deliveries.reduce((sum, d) => sum + (d.weight || 0), 0),
                totalGradings: gradings.length,
                averageGrade: calculateAverageGrade(gradings),
                totalPayouts: payouts.reduce((sum, p) => sum + (p.amount || 0), 0),
                lastDelivery: deliveries.length > 0 ? deliveries[0].createdAt : null,
                deliveries: deliveries.slice(0, 10)
            };
        }));
        
        res.json({
            success: true,
            data: {
                farmers: farmersWithStats,
                total: farmersWithStats.length,
                summary: {
                    totalWeight: farmersWithStats.reduce((sum, f) => sum + f.totalWeight, 0),
                    totalPayouts: farmersWithStats.reduce((sum, f) => sum + f.totalPayouts, 0),
                    averageGrade: farmersWithStats.length > 0
                        ? farmersWithStats.reduce((sum, f) => sum + f.averageGrade, 0) / farmersWithStats.length
                        : 0
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/buyers", verifyToken, isAdmin, async (req, res) => {
    try {
        const { search, status } = req.query;
        let query = {};
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } }
            ];
        }
        const buyers = await Buyer.find(query).sort({ createdAt: -1 });
        
        const buyersWithStats = await Promise.all(buyers.map(async (buyer) => {
            const orders = await Orders.find({ buyerId: buyer._id });
            const totalOrders = orders.length;
            const totalValue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
            return {
                ...buyer.toObject(),
                totalOrders,
                totalValue: parseFloat(totalValue.toFixed(2)),
                lastOrder: orders.length > 0 ? orders[0].createdAt : null
            };
        }));
        
        res.json({
            success: true,
            data: {
                buyers: buyersWithStats,
                total: buyersWithStats.length,
                summary: {
                    active: buyersWithStats.filter(b => b.status === "active").length,
                    totalOrders: buyersWithStats.reduce((sum, b) => sum + b.totalOrders, 0),
                    totalValue: parseFloat(buyersWithStats.reduce((sum, b) => sum + b.totalValue, 0).toFixed(2))
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/inventory", verifyToken, isAdmin, async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};
        if (category) query.category = category;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { supplier: { $regex: search, $options: "i" } }
            ];
        }
        const inventory = await Inventory.find(query).sort({ createdAt: -1 });
        
        const stockStats = {
            critical: inventory.filter(i => i.quantity <= 5).length,
            low: inventory.filter(i => i.quantity > 5 && i.quantity <= 20).length,
            normal: inventory.filter(i => i.quantity > 20 && i.quantity <= 50).length,
            optimal: inventory.filter(i => i.quantity > 50).length,
        };
        
        const totalValue = inventory.reduce((sum, i) => sum + (i.quantity * (i.price || 0)), 0);
        
        res.json({
            success: true,
            data: {
                inventory,
                total: inventory.length,
                categories: [...new Set(inventory.map(i => i.category))],
                stockStats,
                totalValue: parseFloat(totalValue.toFixed(2)),
                summary: {
                    totalItems: inventory.length,
                    totalQuantity: inventory.reduce((sum, i) => sum + i.quantity, 0),
                    lowStockCount: stockStats.critical + stockStats.low
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/inventory", verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, category, quantity, unit, price, supplier, location, minQuantity } = req.body;
        const item = new Inventory({
            name,
            category,
            quantity: quantity || 0,
            unit: unit || "kg",
            price: price || 0,
            supplier,
            location,
            minQuantity: minQuantity || 10,
            createdBy: req.user.id
        });
        await item.save();
        
        res.status(201).json({
            success: true,
            message: "Inventory created successfully",
            data: item
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/inventory/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, category, quantity, unit, price, supplier, location, minQuantity } = req.body;
        const item = await Inventory.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: "Inventory item not found" });
        }
        if (name) item.name = name;
        if (category) item.category = category;
        if (quantity !== undefined) item.quantity = quantity;
        if (unit) item.unit = unit;
        if (price !== undefined) item.price = price;
        if (supplier) item.supplier = supplier;
        if (location) item.location = location;
        if (minQuantity) item.minQuantity = minQuantity;

        await item.save();
        res.json({
            success: true,
            message: "Inventory item updated successfully",
            data: item
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/inventory/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const item = await Inventory.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ error: "Inventory item not found" });
        }
        res.json({
            success: true,
            message: "Inventory deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/payouts/calculate", verifyToken, isAdmin, async (req, res) => {
    try {
        const { gradingId, operatorId } = req.body;
        if (!gradingId) {
            return res.status(400).json({ error: "GradingId is required" });
        }
        
        const grading = await Grading.findById(gradingId)
            .populate("farmerId")
            .populate("operatorId");
            
        if (!grading) {
            return res.status(404).json({ error: "Grading item not found." });
        }

        const existingPayout = await Payouts.findOne({ gradingId });
        if (existingPayout) {
            return res.status(400).json({
                error: "Payout already processed for this grading"
            });
        }
        
        const financeOperatorId = operatorId || await getFinanceOperatorForStation(grading.operatorId?._id);
        const payoutAmount = calculatePayoutFromGrade(grading.grade, grading.weight || 1);
        
        const payout = new Payouts({
            farmerId: grading.farmerId._id,
            operatorId: financeOperatorId,
            gradingId: grading._id,
            amount: payoutAmount,
            weight: grading.weight || 1,
            grade: grading.grade,
            score: grading.cuppingScore,
            status: "pending",
            calculatedBy: req.user.id,
            calculationDate: new Date(),
            description: `Payout for grading ${grading._id}`
        });
        await payout.save();
        
        res.status(201).json({
            success: true,
            message: "Payout calculated and assigned to finance operator",
            data: payout
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/payouts", verifyToken, isAdmin, async (req, res) => {
    try {
        const { status, farmerId, startDate, endDate, page = 1, limit = 20 } = req.query;
        let query = {};
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
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Payouts.countDocuments(query)
        ]);
        
        const totalAmount = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);
        const monthlyTrend = await Payouts.aggregate([
            { $match: query },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
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
                    rejected: payouts.filter(p => p.status === "rejected").length,
                    monthlyTrend
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/payouts", verifyToken, isAdmin, async (req, res) => {
    try {
        const { farmerId, amount, description, deliveryIds, dueDate } = req.body;
        if (!farmerId || !amount) {
            return res.status(400).json({ error: "Farmer and amount fields are required" });
        }
        
        const farmer = await Farmer.findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ error: "Farmer not found." });
        }
        
        const payout = new Payouts({
            farmerId,
            amount,
            description: description || "Farmer payment",
            deliveryIds: deliveryIds || [],
            dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: "pending",
            createdBy: req.user.id
        });
        await payout.save();
        
        res.status(201).json({
            success: true,
            message: "Payout created successfully",
            data: payout
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/payouts/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { status, amount, description, dueDate } = req.body;
        const item = await Payouts.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: "Payout not found" });
        }
        if (status) {
            item.status = status;
            if (status === "completed") {
                item.completedAt = new Date();
            }
        }
        if (amount) item.amount = amount;
        if (description) item.description = description;
        if (dueDate) item.dueDate = dueDate;

        await item.save();
        res.json({
            success: true,
            message: "Payout updated successfully",
            data: item
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/payouts/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const item = await Payouts.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ error: "Payout not found" });
        }
        res.json({
            success: true,
            message: "Payout deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/price", verifyToken, isAdmin, async (req, res) => {
    try {
        const { amount } = req.body;
        const newPrice = new Price({ amount });
        await newPrice.save();

        const subscribers = await Farmer.find({ subscribed: true });
        subscribers.forEach(farmer => {
            // SMS logic here
            console.log(`📢 New coffee price is KSh ${amount} per kg sent to ${farmer.phone}`);
        });
        res.status(201).json(newPrice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/reports", verifyToken, isAdmin, async (req, res) => {
    try {
        const { type, startDate, endDate, format = "json" } = req.query;
        let reportData = {};
        
        switch (type) {
            case "farmers":
                reportData = await generateFarmerReport(startDate, endDate);
                break;
            case "intakes":
                reportData = await generateIntakeReport(startDate, endDate);
                break;
            case "payouts":
                reportData = await generatePayoutReport(startDate, endDate);
                break;
            case "gradings":
                reportData = await generateGradingReport(startDate, endDate);
                break;
            case "inventory":
                reportData = await generateInventoryReport();
                break;
            case "quality":
                reportData = await generateQualityReport(startDate, endDate);
                break;
            default:
                return res.status(400).json({ error: "Invalid report type" });
        }
        
        const report = new Report({
            type,
            data: reportData,
            format,
            generatedBy: req.user.id,
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
                format,
                generatedAt: report.generatedAt
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/reports/history", verifyToken, isAdmin, async (req, res) => {
    try {
        const { limit = 50, type } = req.query;
        let query = {};
        if (type) query.type = type;

        const reports = await Report.find(query)
            .sort({ generatedAt: -1 })
            .limit(parseInt(limit))
            .populate("generatedBy", "name email");
            
        res.json({
            success: true,
            data: reports
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/reports/:id/download", verifyToken, isAdmin, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }
        res.json({
            success: true,
            data: report.data,
            format: report.format,
            generatedAt: report.generatedAt
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/exports", verifyToken, isAdmin, async (req, res) => {
    try {
        const { entity, format = "csv", filters } = req.query;
        const exportOptions = {
            entities: ["farmers", "intakes", "payouts", "gradings", "inventory", "deliveries"],
            formats: ["csv", "excel", "json", "pdf"]
        };
        
        let data = [];
        let filename = "";
        
        switch (entity) {
            case "farmers":
                data = await exportFarmers(filters);
                filename = "farmers_export";
                break;
            case "intakes":
                data = await exportIntakes(filters);
                filename = "intakes_export";
                break;
            case "payouts":
                data = await exportPayouts(filters);
                filename = "payouts_export";
                break;
            case "gradings":
                data = await exportGradings(filters);
                filename = "gradings_export";
                break;
            case "inventory":
                data = await exportInventory(filters);
                filename = "inventory_export";
                break;
            case "deliveries":
                data = await exportDeliveries(filters);
                filename = "deliveries_export";
                break;
            default:
                return res.status(400).json({ error: "Invalid export entity" });
        }
        
        const exportRecord = new Export({
            entity,
            format,
            data,
            filename: `${filename}_${new Date().toISOString().slice(0, 10)}`,
            generatedBy: req.user.id,
            generatedAt: new Date(),
            filters: filters ? JSON.parse(filters) : {}
        });
        await exportRecord.save();
        
        res.json({
            success: true,
            data: {
                exportId: exportRecord._id,
                entity,
                format,
                filename: exportRecord.filename,
                data,
                exportOptions,
                total: data.length,
                generatedAt: exportRecord.generatedAt
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/exports/history", verifyToken, isAdmin, async (req, res) => {
    try {
        const { limit = 50, entity } = req.query;
        let query = {};
        if (entity) query.entity = entity;

        const exports = await Export.find(query)
            .sort({ generatedAt: -1 })
            .limit(parseInt(limit))
            .populate("generatedBy", "name email");
            
        res.json({
            success: true,
            data: exports
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/exports/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const item = await Export.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ error: "Export record not found" });
        }
        res.json({
            success: true,
            message: "Export record deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/settings", verifyToken, isAdmin, async (req, res) => {
    try {
        const { section } = req.query;
        let settings = {};
        
        if (!section || section === "general") {
            settings.general = {
                systemName: process.env.SYSTEM_NAME || "K-Trace System",
                version: process.env.VERSION || "1.0.0",
                timezone: process.env.TZ || "UTC",
                currency: 'KES',
                language: 'en'
            };
        }
        if (!section || section === "grading") {
            settings.grading = {
                scaaStandard: true,
                specialtyThreshold: 80,
                premiumThreshold: 75,
                commercialThreshold: 60,
                maxDefectDeduction: 10,
                weight: {
                    fragranceAroma: 0.1,
                    flavor: 0.15,
                    aftertaste: 0.1,
                    acidity: 0.1,
                    body: 0.1,
                    uniformity: 0.1,
                    balance: 0.1,
                    cleanCup: 0.1,
                    sweetness: 0.1,
                    overall: 0.15
                }
            };
        }
        if (!section || section === 'payouts') {
            settings.payouts = {
                basePricePerKg: 2.00,
                priceTiers: {
                    specialty: { multiplier: 1.5, minPrice: 4.50 },
                    premium: { multiplier: 1.2, minPrice: 3.50 },
                    commercial: { multiplier: 1.0, minPrice: 2.50 },
                    belowStandard: { multiplier: 0.7, minPrice: 1.50 }
                },
                premiumForOrganic: 0.50,
                premiumForCertified: 0.75,
                defaultPaymentTerms: 30
            };
        }
        if (!section || section === 'notifications') {
            settings.notifications = {
                smsEnabled: true,
                emailEnabled: true,
                farmerNotifications: true,
                operatorNotifications: true,
                adminNotifications: true,
                alerts: {
                    lowStock: true,
                    pendingGrading: true,
                    pendingPayouts: true,
                    qualityIssues: true
                }
            };
        }
        res.json({ success: true, data: settings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/settings", verifyToken, isAdmin, async (req, res) => {
    try {
        const { section, settings } = req.body;
        if (!section || !settings) {
            return res.status(400).json({ error: "Section and settings are required" });
        }
        res.json({ 
            success: true, 
            message: `Settings for ${section} updated successfully`,
            data: { section, settings }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/export-doc", verifyToken, isAdmin, async (req, res) => {
    try {
        const exportdoc = new Exportdoc(req.body);
        await exportdoc.save();
        res.json({ 
            success: true,
            message: "Export document created successfully", 
            data: exportdoc 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/update-shipment/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const shipment = await Shipment.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        ).populate({ 
            path: "OrderId", 
            populate: { path: "buyerId" } 
        });
        
        if (!shipment) {
            return res.status(404).json({ error: "Shipment not found" });
        }
        
        const buyer = shipment.exportDocId?.buyerId;
        if (buyer) {
            const message = `📦 Hello ${buyer.name}, your shipment with ID: ${shipment._id} has been updated. Current status: ${shipment.status}.`;
            await sendSMS(buyer.phone, message);
        }
        
        res.json({ 
            success: true,
            message: "Shipment updated successfully", 
            data: shipment 
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to update shipment: " + err.message });
    }
});

router.post("/sensor-data", verifyToken, isAdmin, async (req, res) => {
    try {
        const sensor = await Container(req.body);
        await sensor.save();
        res.json({ 
            success: true,
            message: "Sensor data recorded successfully", 
            data: sensor 
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to record sensor data: " + err.message });
    }
});

async function calculateIntakeTrend(deliveries, timeframe = "monthly") {
    const trend = {};
    deliveries.forEach(delivery => {
        let period;
        const date = new Date(delivery.createdAt || delivery.date);
        switch (timeframe) {
            case "daily":
                period = date.toISOString().slice(0, 10);
                break;
            case "weekly":
                const weekNumber = getWeekNumber(date);
                period = `${date.getFullYear()}-W${weekNumber}`;
                break;
            case "monthly":
                period = date.toISOString().slice(0, 7);
                break;
            default:
                period = date.toISOString().slice(0, 7);
        }
        if (!trend[period]) {
            trend[period] = {
                deliveries: 0,
                weight: 0,
                farmers: new Set()
            };
        }
        trend[period].deliveries += 1;
        trend[period].weight += delivery.weight || 0;
        if (delivery.farmerId) {
            trend[period].farmers.add(delivery.farmerId.toString());
        }
    });
    return Object.entries(trend).map(([period, data]) => ({
        period,
        deliveries: data.deliveries,
        weight: parseFloat(data.weight.toFixed(2)),
        farmers: data.farmers.size
    }));
}

async function calculateLotDistribution(gradings) {
    const distribution = {
        specialty: 0,
        premium: 0,
        commercial: 0,
        belowStandard: 0,
        pending: 0
    };
    gradings.forEach(grading => {
        const grade = grading.grade?.toLowerCase().replace(' ', '') || 'pending';
        if (distribution[grade] !== undefined) {
            distribution[grade]++;
        } else {
            distribution.pending++;
        }
    });
    return distribution;
}

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

async function calculateTopWetMills(operators, gradings) {
    const wetmills = operators.filter(o => o.role === "wetmill");
    const performance = await Promise.all(wetmills.map(async (wetMill) => {
        const wetMillGradings = gradings.filter(g =>
            g.operatorId?.toString() === wetMill._id.toString()
        );
        const totalGradings = wetMillGradings.length;
        const avgScore = totalGradings > 0 ?
            wetMillGradings.reduce((sum, g) => sum + (g.cuppingScore || 0), 0) / totalGradings : 0;
        const specialtyCount = wetMillGradings.filter(g =>
            g.grade?.toLowerCase() === 'specialty'
        ).length;
        return {
            id: wetMill._id,
            name: wetMill.name,
            station: wetMill.station,
            totalGradings,
            averageScore: parseFloat(avgScore.toFixed(2)),
            specialtyRate: totalGradings > 0
                ? parseFloat(((specialtyCount / totalGradings) * 100).toFixed(2))
                : 0,
            rating: calculateRating(avgScore)
        };
    }));
    return performance.sort((a, b) => b.averageScore - a.averageScore).slice(0, 5);
}

async function calculateTopFarmers(deliveries, gradings, limit = 5) {
    const farmerMap = {};
    
    deliveries.forEach(d => {
        const id = d.farmerId?._id?.toString() || d.farmerId?.toString();
        if (id) {
            if (!farmerMap[id]) {
                farmerMap[id] = {
                    name: d.farmerId?.name || 'Unknown',
                    totalWeight: 0,
                    deliveries: 0
                };
            }
            farmerMap[id].totalWeight += d.weight || 0;
            farmerMap[id].deliveries += 1;
        }
    });
    
    return Object.entries(farmerMap)
        .map(([id, data]) => ({
            id,
            name: data.name,
            totalWeight: parseFloat(data.totalWeight.toFixed(2)),
            deliveries: data.deliveries
        }))
        .sort((a, b) => b.totalWeight - a.totalWeight)
        .slice(0, limit);
}

async function calculateFarmerPerformance(farmers, deliveries, gradings) {
    return farmers.map(farmer => {
        const farmerDeliveries = deliveries.filter(d =>
            d.farmerId?._id?.toString() === farmer._id.toString()
        );
        const farmerGradings = gradings.filter(g =>
            g.farmerId?._id?.toString() === farmer._id.toString()
        );

        const totalWeight = farmerDeliveries.reduce((sum, d) => sum + (d.weight || 0), 0);
        const avgScore = farmerGradings.length > 0
            ? farmerGradings.reduce((sum, g) => sum + (g.cuppingScore || 0), 0) / farmerGradings.length
            : 0;

        const specialtyCount = farmerGradings.filter(g =>
            g.grade?.toLowerCase() === "specialty"
        ).length;

        return {
            farmerId: farmer._id,
            name: farmer.name,
            phone: farmer.phone,
            station: farmer.station,
            totalDeliveries: farmerDeliveries.length,
            totalWeight: parseFloat(totalWeight.toFixed(2)),
            averageScore: parseFloat(avgScore.toFixed(2)),
            specialtyRate: farmerGradings.length > 0
                ? parseFloat(((specialtyCount / farmerGradings.length) * 100).toFixed(2))
                : 0,
            totalGradings: farmerGradings.length,
            lastDelivery: farmerDeliveries.length > 0
                ? farmerDeliveries[farmerDeliveries.length - 1].createdAt
                : null
        };
    });
}

async function calculateQualityMetrics(gradings) {
    const scored = gradings.filter(g => g.cuppingScore);
    const totalScored = scored.length;

    if (totalScored === 0) {
        return {
            averageScore: 0,
            maxScore: 0,
            minScore: 0,
            distribution: {},
            specialtyRate: 0,
            totalGradings: gradings.length,
            scoredCount: 0
        };
    }

    const scores = scored.map(g => g.cuppingScore);
    const avgScore = scores.reduce((a, b) => a + b, 0) / totalScored;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    const distribution = {
        excellent: scores.filter(s => s >= 8).length,
        good: scores.filter(s => s >= 6 && s < 8).length,
        average: scores.filter(s => s >= 4 && s < 6).length,
        poor: scores.filter(s => s < 4).length
    };

    const specialtyCount = gradings.filter(g =>
        g.grade?.toLowerCase() === "specialty"
    ).length;

    return {
        averageScore: parseFloat(avgScore.toFixed(2)),
        maxScore: parseFloat(maxScore.toFixed(2)),
        minScore: parseFloat(minScore.toFixed(2)),
        distribution,
        specialtyRate: parseFloat(((specialtyCount / gradings.length) * 100).toFixed(2)),
        totalGradings: gradings.length,
        scoredCount: totalScored
    };
}

async function analyzeDefects(gradings) {
    const defectCount = {};
    let totalDefects = 0;

    gradings.forEach(grading => {
        if (grading.defects) {
            if (Array.isArray(grading.defects)) {
                grading.defects.forEach(defect => {
                    const type = defect.type || 'unknown';
                    defectCount[type] = (defectCount[type] || 0) + (defect.count || 1);
                    totalDefects += defect.count || 1;
                });
            } else if (typeof grading.defects === 'object') {
                Object.entries(grading.defects).forEach(([type, count]) => {
                    defectCount[type] = (defectCount[type] || 0) + (count || 0);
                    totalDefects += count || 0;
                });
            }
        }
    });

    const totalGradings = gradings.length || 1;

    return {
        defectCount,
        totalDefects,
        averageDefectsPerLot: parseFloat((totalDefects / totalGradings).toFixed(2)),
        defectRate: parseFloat(((totalDefects / totalGradings) * 100).toFixed(2)),
        topDefects: Object.entries(defectCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([type, count]) => ({ type, count }))
    };
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

function calculateAverageGrade(gradings) {
    const scored = gradings.filter(g => g.cuppingScore);
    if (scored.length === 0) return 0;
    const sum = scored.reduce((s, g) => s + (g.cuppingScore || 0), 0);
    return parseFloat((sum / scored.length).toFixed(2));
}

function calculateRating(score) {
    if (score >= 8.5) return "Excellent ⭐⭐⭐⭐⭐";
    if (score >= 7.5) return "Very Good ⭐⭐⭐⭐";
    if (score >= 6.5) return "Good ⭐⭐⭐";
    if (score >= 5.5) return "Average ⭐⭐";
    return "Needs Improvement ⭐";
}

function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

function calculatePayoutFromGrade(grade, weight) {
    const PRICE_TIERS = {
        specialty: 4.50,
        premium: 3.50,
        commercial: 2.50,
        'below standard': 1.50
    };
    const pricePerKg = PRICE_TIERS[grade?.toLowerCase()] || 2.50;
    return parseFloat((pricePerKg * weight).toFixed(2));
}

async function getFinanceOperatorForStation(operatorId) {
    const financeOperator = await Operator.findOne({
        role: 'finance',
        station: (await Operator.findById(operatorId))?.station
    });
    if (financeOperator) return financeOperator._id;
    const anyFinance = await Operator.findOne({ role: 'finance' });
    return anyFinance?._id || null;
}

async function generateFarmerReport(startDate, endDate) {
    let query = {};
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const farmers = await Farmer.find(query);
    const deliveries = await Delivery.find(query);
    const payouts = await Payouts.find(query);
    
    return {
        title: "Farmer Report",
        generatedAt: new Date(),
        totalFarmers: farmers.length,
        totalDeliveries: deliveries.length,
        totalPayouts: payouts.reduce((sum, p) => sum + p.amount, 0),
        farmers: farmers.map(f => ({
            name: f.name,
            phone: f.phone,
            station: f.station,
            deliveries: deliveries.filter(d => d.farmerId?._id?.toString() === f._id.toString()).length,
            payouts: payouts.filter(p => p.farmerId?._id?.toString() === f._id.toString()).reduce((sum, p) => sum + p.amount, 0)
        }))
    };
}

async function generateIntakeReport(startDate, endDate) {
    let query = {};
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    const deliveries = await Delivery.find(query).populate("farmerId");
    const totalWeight = deliveries.reduce((sum, d) => sum + (d.weight || 0), 0);
    
    return {
        title: "Intake Report",
        generatedAt: new Date(),
        totalDeliveries: deliveries.length,
        totalWeight,
        averageWeight: deliveries.length > 0 ? totalWeight / deliveries.length : 0,
        byStation: deliveries.reduce((acc, d) => {
            const station = d.station || "Unknown";
            acc[station] = (acc[station] || 0) + d.weight;
            return acc;
        }, {})
    };
}

async function generatePayoutReport(startDate, endDate) {
    let query = {};
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    const payouts = await Payouts.find(query).populate("farmerId");
    const totalAmount = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);
    
    return {
        title: "Payout Report",
        generatedAt: new Date(),
        totalPayouts: payouts.length,
        totalAmount,
        averageAmount: payouts.length > 0 ? totalAmount / payouts.length : 0,
        pending: payouts.filter(p => p.status === "pending").length,
        completed: payouts.filter(p => p.status === "completed").length,
        byFarmer: payouts.reduce((acc, p) => {
            const name = p.farmerId?.name || "Unknown";
            acc[name] = (acc[name] || 0) + p.amount;
            return acc;
        }, {})
    };
}

async function generateGradingReport(startDate, endDate) {
    let query = {};
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    const gradings = await Grading.find(query).populate("farmerId");
    const scored = gradings.filter(g => g.cuppingScore);
    const avgScore = scored.length > 0 ? scored.reduce((sum, d) => sum + d.cuppingScore, 0) / scored.length : 0;
    
    return {
        title: "Grading Report",
        generatedAt: new Date(),
        totalGradings: gradings.length,
        averageScore: avgScore,
        gradeDistribution: await calculateGradeDistribution(gradings),
        defects: await analyzeDefects(gradings)
    };
}

async function generateInventoryReport() {
    const inventory = await Inventory.find();
    const totalValue = inventory.reduce((sum, i) => sum + (i.quantity * (i.price || 0)), 0);
    
    return {
        title: "Inventory Report",
        generatedAt: new Date(),
        totalItems: inventory.length,
        totalQuantity: inventory.reduce((sum, i) => sum + i.quantity, 0),
        totalValue,
        lowStock: inventory.filter(i => i.quantity <= 10).length,
        byCategory: inventory.reduce((acc, i) => {
            acc[i.category] = (acc[i.category] || 0) + i.quantity;
            return acc;
        }, {})
    };
}

async function generateQualityReport(startDate, endDate) {
    let query = {};
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    const gradings = await Grading.find(query);
    const qualityMetrics = await calculateQualityMetrics(gradings);
    const defects = await analyzeDefects(gradings);

    return {
        title: "Quality Report",
        generatedAt: new Date(),
        metrics: qualityMetrics,
        defects: defects,
        trends: await calculateIntakeTrend(gradings, "monthly")
    };
}

async function exportFarmers(filters) {
    const query = filters ? JSON.parse(filters) : {};
    const farmers = await Farmer.find(query);
    return farmers.map(f => ({
        id: f._id,
        name: f.name,
        phone: f.phone,
        station: f.station,
        createdAt: f.createdAt
    }));
}

async function exportIntakes(filters) {
    const query = filters ? JSON.parse(filters) : {};
    const deliveries = await Delivery.find(query).populate("farmerId");
    return deliveries.map(d => ({
        id: d._id,
        farmer: d.farmerId?.name || "Unknown",
        weight: d.weight,
        station: d.station,
        date: d.createdAt
    }));
}

async function exportPayouts(filters) {
    const query = filters ? JSON.parse(filters) : {};
    const payouts = await Payouts.find(query).populate("farmerId");
    return payouts.map(p => ({
        id: p._id,
        farmer: p.farmerId?.name || "Unknown",
        amount: p.amount,
        status: p.status,
        date: p.createdAt
    }));
}

async function exportGradings(filters) {
    const query = filters ? JSON.parse(filters) : {};
    const gradings = await Grading.find(query).populate("farmerId");
    return gradings.map(g => ({
        id: g._id,
        farmer: g.farmerId?.name || "Unknown",
        grade: g.grade,
        score: g.cuppingScore,
        date: g.createdAt
    }));
}

async function exportInventory(filters) {
    const query = filters ? JSON.parse(filters) : {};
    const inventory = await Inventory.find(query);
    return inventory.map(i => ({
        id: i._id,
        name: i.name,
        category: i.category,
        quantity: i.quantity,
        unit: i.unit,
        price: i.price,
        supplier: i.supplier
    }));
}

async function exportDeliveries(filters) {
    const query = filters ? JSON.parse(filters) : {};
    const deliveries = await Delivery.find(query).populate("farmerId");
    return deliveries.map(d => ({
        id: d._id,
        farmer: d.farmerId?.name || "Unknown",
        weight: d.weight,
        station: d.station,
        date: d.createdAt
    }));
}

export default router;