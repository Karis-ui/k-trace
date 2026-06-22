import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    buyerId: {type:Number,required:true,unique:true},
    lotId: {type:String,required:true,unique:true},
    quantity: {type:Number,required:true},
    unitPrice: {type:String,required:true},
    totalPrice: {type:String,required:true},
    orderStatus: {type:String,enum:["pending","confirmed","confirmed","cancelled"]},
    paymentStatus: {type:String,enum:["unpaid","paid","refunded"],required:true},
    orderDate: {type:Date,default:Date.now()},
    deliveryDate: {type:Date},
},{timestamps:true});

OrderSchema.pre("save",function(next){
    this.totalPrice = this.quantity * this.unitPrice;
    next();
});

export default mongoose.model("Orders",OrderSchema);