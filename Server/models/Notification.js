import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'userModel'
    },
    userModel: {
        type: String,
        required: true,
        enum: ['Admin', 'Operator', 'Farmer', 'Buyer']
    },
    userRole: {
        type: String,
        enum: ['admin', 'operator', 'drymill', 'wetmill', 'finance', 'farmer', 'buyer'],
        required: true
    },

    type: {
        type: String,
        enum: ['payout', 'grading', 'delivery', 'price', 'system', 'order', 'fermentation', 'processing'],
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    icon: {
        type: String,
        default: '🔔'
    },

    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'referenceModel'
    },
    referenceModel: {
        type: String,
        enum: ['Payouts', 'Grading', 'Delivery', 'Orders', 'Fermentation', 'Processing', 'Price']
    },
    link: {
        type: String,
        default: '#'
    },

    read: {
        type: Boolean,
        default: false
    },
    readAt: Date,

    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },

    actions: [{
        label: String,
        url: String,
        method: {
            type: String,
            enum: ['GET', 'POST', 'PUT', 'DELETE']
        }
    }],
    expiresAt: Date,

    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

notificationSchema.virtual('timeAgo').get(function() {
    const diff = Date.now() - this.createdAt.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return this.createdAt.toLocaleDateString();
});

notificationSchema.statics.createNotification = async function(data) {
    const notification = new this(data);
    await notification.save();
    
    return notification;
};

notificationSchema.statics.markAllAsRead = async function(userId) {
    return await this.updateMany(
        { userId, read: false },
        { read: true, readAt: new Date() }
    );
};

notificationSchema.statics.getUnreadCount = async function(userId) {
    return await this.countDocuments({ userId, read: false });
};

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;