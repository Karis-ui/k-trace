import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Orders',
        required: true
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer',
        required: true
    },
    trackingNumber: {
        type: String,
        unique: true
    },
    weight: {
        type: Number,
        required: true
    },
    origin: String,
    destination: String,
    shippedDate: Date,
    estimatedDelivery: Date,
    deliveredDate: Date,
    status: {
        type: String,
        enum: ['pending', 'inTransit', 'delivered', 'cancelled'],
        default: 'pending'
    },
    carrier: String,
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

shipmentSchema.pre('save', async function (next) {
    if (!this.trackingNumber) {
        this.trackingNumber = `SHIP-${Date.now()}`;
    }
    next();
});

const Shipment = mongoose.model('Shipment', shipmentSchema);
export default Shipment;