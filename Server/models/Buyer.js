import mongoose from "mongoose";

const BuyerSchema = new mongoose.Schema({
    id: {type:Number,required:true,unique:true},
    name: String,
    email: String,
    phone: {type:String,required:true,unique:true},
    company: String,
    subscribedGrades: [String],
    notificationEnabled: {type:Boolean,default:true},
    password: {type:String,required:true}
});

const Buyer = mongoose.model("Buyer",BuyerSchema);
export default Buyer;