import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
    {
        farmerId:{type:mongoose.Schema.Types.ObjectId,ref:"Farmer",required:true},
        lotId:{type:String, unique:true, required:true},
        weight:{type:Number,required:true},
        date:{type:Date,default:Date.now}
});
const Delivery = mongoose.model("Delivery",deliverySchema);

export default Delivery;