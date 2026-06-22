import mongoose, { Types } from "mongoose";

const exportdocSchema = new mongoose.Schema({
    buyerId: {type:mongoose.Schema.Types.ObjectId, ref:"Buyer",required:true},
    lotId: {type:mongoose.Schema.Types.ObjectId, ref:"Catalog",required:true},
    exportNo: {type:String,required:true,unique:true},
    quantity: {type:Number,required:true},
    grade:String,
    exportDate: {type:Date,required:true},
    destination: String,
    containerNo: String,
    status:{type:String,enum:["Pending","Approved","Delivered"],default:"Pending"},
    documents: {invoice:String,qualityCert:String,billOfLading:String}
});

export default mongoose.model("Exportdoc",exportdocSchema);