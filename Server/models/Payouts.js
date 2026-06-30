import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    operatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Operator',
        required: true
    },
    gradingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grading'
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },
    weight: {
        type: Number,
        required: true,
        min: 0
    },
    pricePerKg: {
        type: Number,
        required: true,
        min: 0
    },
    grade: {
        type: String,
        enum: ['specialty', 'premium', 'commercial', 'below standard'],
        required: true
    },
    score: {
        type: Number,
        min: 0,
        max: 100
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'completed', 'cancelled'],
        default: 'pending'
    },

    calculatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rejectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    calculationDate: {
        type: Date,
        default: Date.now
    },
    approvedAt: Date,
    processedAt: Date,
    rejectedAt: Date,

    transactionId: {
        type: String,
        unique: true,
        sparse: true
    },
    description: String,
    notes: String,
    rejectionReason: String,

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

payoutSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

payoutSchema.virtual('total').get(function () {
    return this.amount;
});

payoutSchema.index({ farmerId: 1, status: 1 });
payoutSchema.index({ operatorId: 1, status: 1 });
payoutSchema.index({ createdAt: -1 });

const Payouts = mongoose.model('Payout', payoutSchema);
export default Payouts;