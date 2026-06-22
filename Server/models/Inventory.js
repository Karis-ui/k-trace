import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    type: {type:String,required:true,enum:["Green Coffee","Roasted Coffee","Equipment","Supplies"]},
    lotId: {type:mongoose.Schema.Types.ObjectId, ref:"Catalog", required:true},
    batchId: {type:mongoose.Schema.Types.ObjectId, ref:"Roaster"},
    quantity: Number,
    location: String,
    lastUpdated: {type:Date,default:Date.now}
});

export default mongoose.model("Inventory",inventorySchema);