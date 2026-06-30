import mongoose from "mongoose";

const operatorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['drymill', 'wetmill', 'finance', 'admin'],
        required: true
    },
    station: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    notifications: {},

    drymillDetails: {
        capacity: Number,
        equipment: [String],
        processingTypes: [{
            type: String,
            enum: ['washed', 'natural', 'honey', 'pulped']
        }],
        dailyProcessingCapacity: Number
    },

    wetmillDetails: {
        capacity: Number,
        fermentationTanks: Number,
        dryingBeds: Number,
        waterSource: {
            type: String,
            enum: ['river', 'borehole', 'spring', 'rainwater', 'other']
        },
        equipment: [String]
    },

    financeDetails: {
        role: {
            type: String,
            enum: ['finance_officer', 'accountant', 'treasurer'],
            default: 'finance_officer'
        },
        permissions: {
            canApprovePayouts: { type: Boolean, default: true },
            canProcessPayouts: { type: Boolean, default: true },
            canGenerateReports: { type: Boolean, default: true },
            canViewAllPayouts: { type: Boolean, default: true }
        },
        maxPayoutLimit: {
            type: Number,
            default: 10000
        },
        requiresApproval: {
            type: Boolean,
            default: true
        }
    },

    location: {
        latitude: Number,
        longitude: Number,
        address: String
    },
    certifications: [{
        type: String,
        enum: ['organic', 'fairtrade', 'rainforest', 'utZ', 'other']
    }],
    registrationNumber: {
        type: String,
        unique: true,
        sparse: true
    },
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

operatorSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

operatorSchema.virtual('roleType').get(function () {
    if (this.role === 'drymill' || this.role === 'wetmill') {
        return 'processing';
    }
    if (this.role === 'finance') {
        return 'finance';
    }
    return 'admin';
});

operatorSchema.methods.canProcessPayouts = function () {
    if (this.role === 'admin') return true;
    if (this.role === 'finance') {
        return this.financeDetails?.permissions?.canProcessPayouts || false;
    }
    return false;
};

operatorSchema.methods.canApprovePayouts = function () {
    if (this.role === 'admin') return true;
    if (this.role === 'finance') {
        return this.financeDetails?.permissions?.canApprovePayouts || false;
    }
    return false;
};

operatorSchema.methods.getRoleDetails = function () {
    if (this.role === 'drymill') return this.drymillDetails;
    if (this.role === 'wetmill') return this.wetmillDetails;
    if (this.role === 'finance') return this.financeDetails;
    return null;
};

const Operator = mongoose.model('Operator', operatorSchema);
export default Operator;