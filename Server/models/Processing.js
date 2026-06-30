import mongoose from "mongoose";

const processingSchema = new mongoose.Schema({
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

    batchNumber: {
        type: String,
        unique: true
    },
    type: {
        type: String,
        enum: ['drying', 'milling', 'fermentation', 'washing'],
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },

    // Status
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

    temperature: Number,
    phLevel: Number,
    tankNumber: String,

    notes: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

processingSchema.pre('save', async function (next) {
    if (!this.batchNumber) {
        const count = await mongoose.model('Processing').countDocuments();
        const prefix = this.type === 'fermentation' ? 'FER' : 'PROC';
        this.batchNumber = `${prefix}-${String(count + 1).padStart(5, '0')}`;
    }
    next();
});

processingSchema.index({ operatorId: 1, status: 1 });
processingSchema.index({ farmerId: 1 });
processingSchema.index({ batchNumber: 1 });

const Processing = mongoose.model('Processing', processingSchema);
export default Processing;