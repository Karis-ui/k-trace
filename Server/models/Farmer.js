import mongoose from "mongoose";

const FarmerSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    station: { type: String, required: true },
    password: { type: String, required: true },
    subscribed: { type: Boolean, default: false },
    otp: { type: Number, required: false },
    verified: { type: Boolean, default: false },
    operatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Operator" },
});

const Farmer = mongoose.model("Farmer", FarmerSchema);
export default Farmer;