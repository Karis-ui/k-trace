import mongoose from "mongoose";

const containerSchema = new mongoose.Schema({
    containerNo: {type:String,required:true,unique:true},
    Timestamp: {type:Date,default:Date.now},
    temperature:Number,
    humidity: Number,
    vibration: Number,
    battery: Number,
    alertStatus: {type:String,enum:["Normal","Warning","Critical"],default:"Normal"},
});

export default mongoose.model("Container",containerSchema);