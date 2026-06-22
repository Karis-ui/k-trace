import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
    amount: {type:Number, required:true},
    date: {type:Date, default:Date.now}
});

export default mongoose.model("Price",priceSchema);