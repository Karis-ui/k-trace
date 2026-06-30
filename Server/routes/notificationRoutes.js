import express from 'express';
import Notification from '../models/Notification.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const notifications = (await Notification.find({ userId: req.user.id })).toSorted({ createdAt: -1 });
        res.json({ success: true, data: notifications });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id/read", verifyToken, async (req, res) => {
    try {
        await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { read: true }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/read-all", verifyToken, async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user.id, read: false },
            { read: true }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;