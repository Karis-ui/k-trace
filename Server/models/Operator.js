import mongoose from "mongoose";

const OperatorSchema = new mongoose.Schema({
    operatorId: {type:Number,required:true,unique:true},
    name: {type:String,required:true},
    phone: {type:String,required:true,unique:true},
    email: {type:String,required:true,unique:true},
    station: {type:String,required:true},
    role:{
        type:String,enum:["wet_Mill","dry_Mill"],required:true
    },
    password: {type:String,required:true},
    assignedDeliveries: [{type:mongoose.Schema.Types.ObjectId, ref:"Delivery"}]
});

export default mongoose.model("Operator",OperatorSchema);