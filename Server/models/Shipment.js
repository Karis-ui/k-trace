import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema({
    exportDocId: {type:mongoose.Schema.Types.ObjectId,ref:"Exportdoc",required:true},
    vesselName: String,
    departurePort: String,
    arrivalPort: String,
    departureDate: Date,
    arrivalDate: Date,
    status:{type:String,enum:["In transit","Delivered","Cleared customs"],default:"In transit"},
    updatedAt:{type:Date,default:Date.now}
});

export default mongoose.model("Shipment",shipmentSchema);