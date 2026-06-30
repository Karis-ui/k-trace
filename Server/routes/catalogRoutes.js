import express from "express";
import Catalog from "../models/Catalog.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const lots = await Catalog.find({ status: "Available" }).populate("farmerId");
        res.json(lots);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:lotId", async (req, res) => {
    try {
        const lot = await Catalog.findOne({ lotId: req.params.lotId }).populate("farmerId");
        if (!lot) {
            return res.status(404).json({ error: "Lot not found!" });
        }
        res.json(lot);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/add", verifyToken, isAdmin, async (req, res) => {
    try {
        const lot = new Catalog(req.body);
        await lot.save();
        res.status(201).json(lot);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;