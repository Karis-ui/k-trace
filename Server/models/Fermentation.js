import mongoose from "mongoose";

const fermentationSchema = new mongoose.Schema({
    operatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Operator',
        required: true
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    lotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lot'
    },

    batchNumber: {
        type: String,
        unique: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    tankNumber: {
        type: String,
        required: true
    },

    temperature: {
        type: Number,
        default: 20
    },
    phLevel: {
        type: Number,
        default: 4.5
    },

    status: {
        type: String,
        enum: ['pending', 'inProgress', 'completed', 'cancelled'],
        default: 'pending'
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },

    startDate: {
        type: Date,
        default: Date.now
    },
    expectedEndDate: Date,
    completedAt: Date,

    notes: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

fermentationSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

fermentationSchema.pre('save', async function (next) {
    if (!this.batchNumber) {
        const count = await mongoose.model('Fermentation').countDocuments();
        this.batchNumber = `FER-${String(count + 1).padStart(5, '0')}`;
    }
    next();
});

fermentationSchema.index({ operatorId: 1, status: 1 });
fermentationSchema.index({ farmerId: 1 });

const Fermentation = mongoose.model('Fermentation', fermentationSchema);
export default Fermentation;