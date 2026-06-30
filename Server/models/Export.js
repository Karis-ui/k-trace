import mongoose from "mongoose";

const exportSchema = new mongoose.Schema({
    entity: {
        type: String,
        enum: ["farmers", "intakes", "payouts", "gradings", "inventory", "deliveries", "orders", "catalog"],
        required: true
    },

    format: {
        type: String,
        enum: ["csv", "excel", "json", "pdf", "xml"],
        default: "csv"
    },

    data: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },

    fileUrl: {
        type: String,
        default: null
    },
    fileSize: {
        type: Number,
        default: 0
    },
    filePath: {
        type: String,
        default: null
    },

    filters: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    fields: {
        type: [String],
        default: []
    },

    dateRange: {
        start: {
            type: Date,
            default: null
        },
        end: {
            type: Date,
            default: null
        }
    },

    recordCount: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "completed"
    },

    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    operatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Operator',
        default: null
    },

    filename: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ''
    },

    metadata: {
        totalRecords: { type: Number, default: 0 },
        totalAmount: { type: Number, default: 0 },
        totalWeight: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 }
    },

    error: {
        type: String,
        default: null
    },

    generatedAt: {
        type: Date,
        default: Date.now
    },

    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
}, {
    timestamps: true
});

exportSchema.index({ generatedBy: 1, generatedAt: -1 });
exportSchema.index({ entity: 1 });
exportSchema.index({ operatorId: 1 });
exportSchema.index({ status: 1 });
exportSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


const Export = mongoose.model('Export', exportSchema);
export default Export;