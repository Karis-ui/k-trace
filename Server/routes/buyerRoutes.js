import express from "express";
import Buyer from "../models/Buyer.js";
import Orders from "../models/Orders.js";
import bcrypt from "bcrypt";
import { verifyToken, isBuyer } from "../middleware/auth.js";
import Catalog from "../models/Catalog.js";

const router = express.Router();

router.get("/dashboard", verifyToken, isBuyer, async (req, res) => {
    try {
        const buyerId = req.user.id;

        const buyer = await Buyer.findById(buyerId).select("-password");
        if (!buyer) {
            return res.status(404).json({ error: "Buyer not found" });
        }

        const orders = await Orders.find({ buyerId })
            .populate("lotId")
            .sort({ createdAt: -1 });

        const catalog = await Catalog.find({ status: "Available" });

        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        const totalQuantity = orders.reduce((sum, o) => sum + (o.quantity || 0), 0);

        const orderStatus = {
            pending: orders.filter(o => o.status === 'pending' || o.orderStatus === 'pending').length,
            processing: orders.filter(o => o.status === 'processing' || o.orderStatus === 'processing').length,
            shipped: orders.filter(o => o.status === 'shipped' || o.orderStatus === 'shipped').length,
            delivered: orders.filter(o => o.status === 'delivered' || o.orderStatus === 'delivered').length,
            cancelled: orders.filter(o => o.status === 'cancelled' || o.orderStatus === 'cancelled').length
        };

        const monthlyTrend = {};
        orders.forEach(o => {
            const month = new Date(o.createdAt || o.orderDate).toISOString().slice(0, 7);
            if (!monthlyTrend[month]) {
                monthlyTrend[month] = { spent: 0, orders: 0 };
            }
            monthlyTrend[month].spent += o.totalPrice || 0;
            monthlyTrend[month].orders += 1;
        });

        const gradePurchases = {};
        orders.forEach(o => {
            const grade = o.lotId?.grade || 'unknown';
            if (!gradePurchases[grade]) {
                gradePurchases[grade] = { quantity: 0, spent: 0 };
            }
            gradePurchases[grade].quantity += o.quantity || 0;
            gradePurchases[grade].spent += o.totalPrice || 0;
        });

        const recentOrders = orders.slice(0, 10);

        const stationPurchases = {};
        orders.forEach(o => {
            const station = o.lotId?.station || 'unknown';
            if (!stationPurchases[station]) {
                stationPurchases[station] = { orders: 0, spent: 0 };
            }
            stationPurchases[station].orders += 1;
            stationPurchases[station].spent += o.totalPrice || 0;
        });

        const buyerRating = calculateBuyerRating(totalOrders, totalSpent, orderStatus);

        res.json({
            success: true,
            data: {
                profile: {
                    id: buyer._id,
                    name: buyer.name,
                    email: buyer.email,
                    phone: buyer.phone,
                    company: buyer.company,
                    status: buyer.status || 'active'
                },
                summary: {
                    totalOrders,
                    totalSpent: parseFloat(totalSpent.toFixed(2)),
                    totalQuantity: parseFloat(totalQuantity.toFixed(2)),
                    averageOrderValue: totalOrders > 0 ? parseFloat((totalSpent / totalOrders).toFixed(2)) : 0,
                    availableLots: catalog.length
                },
                rating: buyerRating,
                orderStatus,
                monthlyTrend: Object.entries(monthlyTrend).map(([month, data]) => ({
                    month,
                    spent: parseFloat(data.spent.toFixed(2)),
                    orders: data.orders
                })),
                gradePurchases: Object.entries(gradePurchases).map(([grade, data]) => ({
                    grade,
                    quantity: parseFloat(data.quantity.toFixed(2)),
                    spent: parseFloat(data.spent.toFixed(2))
                })),
                stationPurchases: Object.entries(stationPurchases)
                    .map(([station, data]) => ({
                        station,
                        orders: data.orders,
                        spent: parseFloat(data.spent.toFixed(2))
                    }))
                    .sort((a, b) => b.spent - a.spent)
                    .slice(0, 5),
                recentOrders,
                catalog: catalog.slice(0, 10)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/my", verifyToken, isBuyer, async (req, res) => {
    try {
        const buyer = await Buyer.findById(req.user.id).select("-password");
        if (!buyer) {
            return res.status(404).json({ error: 'Buyer not found' });
        }

        const orders = await Orders.find({ buyerId: buyer._id });
        const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

        res.json({
            success: true,
            data: {
                id: buyer._id,
                name: buyer.name,
                email: buyer.email,
                phone: buyer.phone,
                company: buyer.company,
                status: buyer.status || "active",
                stats: {
                    totalOrders: orders.length,
                    totalSpent: parseFloat(totalSpent.toFixed(2)),
                    pendingOrders: orders.filter(o => o.status === 'pending').length
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/my/update", verifyToken, isBuyer, async (req, res) => {
    try {
        const buyerId = req.user.id;
        const { name, email, phone, company, password } = req.body;
        const buyer = await Buyer.findById(buyerId);

        if (!buyer) {
            return res.status(404).json({ error: "Buyer not found!" });
        }

        if (name) buyer.name = name;
        if (email) {
            const existing = await Buyer.findOne({ email, _id: { $ne: buyer._id } });
            if (existing) {
                return res.status(400).json({ error: "Email already in use" });
            }
            buyer.email = email;
        }
        if (phone) {
            const existing = await Buyer.findOne({ phone, _id: { $ne: buyer._id } });
            if (existing) {
                return res.status(400).json({ error: "Phone already in use" });
            }
            buyer.phone = phone;
        }
        if (company) buyer.company = company;
        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            buyer.password = hashed;
        }
        await buyer.save();

        res.json({
            success: true,
            message: "✅ Profile updated successfully",
            buyer: {
                id: buyer._id,
                name: buyer.name,
                email: buyer.email,
                phone: buyer.phone,
                company: buyer.company,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/orders", verifyToken, isBuyer, async (req, res) => {
    try {
        const { lotId, quantity, orderDate } = req.body;
        const catalog = await Catalog.findById(lotId);
        if (!catalog) {
            return res.status(404).json({ error: "Lot not found!" });
        }

        if (catalog.availableQuantity < quantity) {
            return res.status(400).json({
                error: `Only ${catalog.availableQuantity}kg available`
            });
        }

        const order = await Orders.create({
            buyerId: req.user.id,
            lotId,
            quantity,
            unitPrice: catalog.unitPrice,
            orderDate: orderDate || new Date(),
            totalPrice: quantity * catalog.unitPrice,
            status: "pending"
        });

        catalog.availableQuantity -= quantity;
        if (catalog.availableQuantity === 0) {
            catalog.status = "Sold Out";
        }
        await catalog.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/orders", verifyToken, isBuyer, async (req, res) => {
    try {
        const { status } = req.query;
        let query = { buyerId: req.user.id };
        if (status) query.status = status;

        const orders = await Orders.find(query)
            .populate("lotId")
            .sort({ createdAt: -1 });

        const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

        res.json({
            success: true,
            data: {
                orders,
                summary: {
                    total: orders.length,
                    totalSpent: parseFloat(totalSpent.toFixed(2)),
                    pending: orders.filter(o => o.status === 'pending').length,
                    delivered: orders.filter(o => o.status === 'delivered').length
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/orders/:id", verifyToken, isBuyer, async (req, res) => {
    try {
        const { unitPrice, quantity, orderDate } = req.body;
        const order = await Orders.findOne({ _id: req.params.id, buyerId: req.user.id });
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (order.status !== "pending") {
            return res.status(400).json({ error: "Only pending orders can be updated." });
        }

        if (quantity && quantity !== order.quantity) {
            const catalog = await Catalog.findById(order.lotId);
            if (catalog) {
                const diff = quantity - order.quantity;
                if (catalog.availableQuantity < diff) {
                    return res.status(400).json({
                        error: `Only ${catalog.availableQuantity}kg available for adjustment`
                    });
                }
                catalog.availableQuantity -= diff;
                if (catalog.availableQuantity === 0) {
                    catalog.status = "Sold Out";
                }
                await catalog.save();
            }
            order.quantity = quantity;
        }

        if (unitPrice) order.unitPrice = unitPrice;
        if (orderDate) order.orderDate = orderDate;
        order.totalPrice = order.quantity * order.unitPrice;
        await order.save();

        res.json({
            success: true,
            message: "Order updated successfully",
            data: order
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/orders/:id", verifyToken, isBuyer, async (req, res) => {
    try {
        const order = await Orders.findOne({ _id: req.params.id, buyerId: req.user.id });
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (order.status !== "pending") {
            return res.status(400).json({ error: "Only pending orders can be cancelled" });
        }

        const catalog = await Catalog.findById(order.lotId);
        if (catalog) {
            catalog.availableQuantity += order.quantity;
            if (catalog.status === "Sold Out") {
                catalog.status = "Available";
            }
            await catalog.save();
        }

        await Orders.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: "Order cancelled successfully"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/settings", verifyToken, isBuyer, async (req, res) => {
    try {
        const buyer = await Buyer.findById(req.user.id).select("-password");
        if (!buyer) {
            return res.status(404).json({ error: "Buyer not found" });
        }

        const orders = await Orders.find({ buyerId: buyer._id });

        res.json({
            success: true,
            data: {
                profile: {
                    id: buyer._id,
                    name: buyer.name,
                    phone: buyer.phone,
                    email: buyer.email,
                    company: buyer.company,
                    status: buyer.status || 'active'
                },
                stats: {
                    totalOrders: orders.length,
                    totalSpent: orders.reduce((sum, d) => sum + (d.totalPrice || 0), 0),
                    pendingOrders: orders.filter(o => o.status === 'pending').length,
                    completedOrders: orders.filter(o => o.status === 'delivered').length
                },
                preferences: {
                    notifications: buyer.notifications || {
                        sms: true,
                        email: false
                    },
                    language: buyer.language || 'en',
                    currency: buyer.currency || 'USD'
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/settings", verifyToken, isBuyer, async (req, res) => {
    try {
        const { profile, preferences } = req.body;
        const buyer = await Buyer.findById(req.user.id);

        if (!buyer) {
            return res.status(404).json({ error: "Buyer not found" });
        }

        if (profile) {
            if (profile.name) buyer.name = profile.name;
            if (profile.phone) {
                const existing = await Buyer.findOne({ phone: profile.phone, _id: { $ne: buyer._id } });
                if (existing) {
                    return res.status(400).json({ error: "Phone already in use" });
                }
                buyer.phone = profile.phone;
            }
            if (profile.email) {
                const existing = await Buyer.findOne({ email: profile.email, _id: { $ne: buyer._id } });
                if (existing) {
                    return res.status(400).json({ error: "Email already in use" });
                }
                buyer.email = profile.email;
            }
            if (profile.company) buyer.company = profile.company;
            if (profile.status) buyer.status = profile.status;
        }

        if (preferences) {
            if (preferences.notifications) {
                buyer.notifications = {
                    email: preferences.notifications.email !== undefined ? preferences.notifications.email : buyer.notifications?.email || true,
                    sms: preferences.notifications.sms !== undefined ? preferences.notifications.sms : buyer.notifications?.sms || true
                };
            }
            if (preferences.language) buyer.language = preferences.language;
            if (preferences.currency) buyer.currency = preferences.currency;
        }

        await buyer.save();

        res.json({
            success: true,
            message: "Settings updated successfully",
            data: {
                name: buyer.name,
                phone: buyer.phone,
                company: buyer.company,
                email: buyer.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/catalog", verifyToken, isBuyer, async (req, res) => {
    try {
        const { grade, minPrice, maxPrice, station } = req.query;
        let query = { status: "Available" };

        if (grade) query.grade = grade;
        if (station) query.station = station;
        if (minPrice || maxPrice) {
            query.unitPrice = {};
            if (minPrice) query.unitPrice.$gte = parseFloat(minPrice);
            if (maxPrice) query.unitPrice.$lte = parseFloat(maxPrice);
        }

        const catalog = await Catalog.find(query)
            .populate("farmerId", "name station")
            .populate("gradingId", "cuppingScore grade");

        res.json({
            success: true,
            data: catalog,
            summary: {
                total: catalog.length,
                grades: [...new Set(catalog.map(c => c.grade))],
                priceRange: {
                    min: catalog.length > 0 ? Math.min(...catalog.map(c => c.unitPrice)) : 0,
                    max: catalog.length > 0 ? Math.max(...catalog.map(c => c.unitPrice)) : 0
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

function calculateBuyerRating(totalOrders, totalSpent, orderStatus) {
    let score = 0;

    if (totalOrders >= 50) score += 30;
    else if (totalOrders >= 30) score += 25;
    else if (totalOrders >= 15) score += 20;
    else if (totalOrders >= 5) score += 10;
    else score += 5;

    if (totalSpent >= 50000) score += 30;
    else if (totalSpent >= 30000) score += 25;
    else if (totalSpent >= 15000) score += 20;
    else if (totalSpent >= 5000) score += 10;
    else score += 5;

    const totalCompleted = orderStatus.delivered || 0;
    const completionRate = totalOrders > 0 ? (totalCompleted / totalOrders) * 100 : 0;
    if (completionRate >= 90) score += 20;
    else if (completionRate >= 70) score += 15;
    else if (completionRate >= 50) score += 10;
    else score += 5;

    if (totalOrders >= 20) score += 20;
    else if (totalOrders >= 10) score += 15;
    else if (totalOrders >= 5) score += 10;
    else score += 5;

    let rating, level, badge;

    if (score >= 85) {
        rating = "Platinum";
        level = 5;
        badge = "💎 Platinum Buyer";
    } else if (score >= 70) {
        rating = "Gold";
        level = 4;
        badge = "🥇 Gold Buyer";
    } else if (score >= 55) {
        rating = "Silver";
        level = 3;
        badge = "🥈 Silver Buyer";
    } else if (score >= 40) {
        rating = "Bronze";
        level = 2;
        badge = "🥉 Bronze Buyer";
    } else {
        rating = "New Buyer";
        level = 1;
        badge = "🛒 New Buyer";
    }

    return {
        rating,
        level,
        badge,
        score: Math.round(score)
    };
}

export default router;