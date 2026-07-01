import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        default: 'admin',
        enum: ['admin']
    },
    permissions: {
        type: [String],
        default: ['all']
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    lastLogin: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        this.updatedAt = new Date();
        next();
    } catch (err) {
        next(err);
    }
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

adminSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
    }
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;