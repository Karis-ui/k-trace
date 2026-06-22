import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    buyerId: {type:mongoose.Schema.Types.ObjectId,ref:"Buyer"},
    lotId: {type:mongoose.Schema.Types.ObjectId,ref:"Catalog"},
    subscriptionDate: {type:Date,default:Date.now}
});

export default mongoose.model("Subscription",subscriptionSchema);