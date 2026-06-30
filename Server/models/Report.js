import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
    type: { type: String, enum: ["intakes", "farmers", "payouts", "gradings", "inventory", "quality"] },
    data: { type: String },
    format: { type: String, enum: ["pdf", "csv"] },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateRange: {
        start: { type: Date, default: Date.now() },
        end: { type: Date, default: Date.now() }
    },
    generatedAt: { type: Date, default: Date.now() },
})

export default mongoose.model("Report", ReportSchema);