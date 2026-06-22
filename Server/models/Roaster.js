import mongoose from "mongoose";

const roasterSchema = new mongoose.Schema({
    batchId: {type:String,required:true,unique:true},
    lotId: {type:mongoose.Schema.Types.ObjectId, ref:"Catalog", required:true},
    operatorId: {type:mongoose.Schema.Types.ObjectId, ref:"Operator", required:true},
    roastDate: {type:Date,required:true},
    grrenWeight: Number,
    roastWeight: Number,
    tempCurve:[{time:Number,temperature:Number}],
    cuppingScore: Number,
    moistureLoss: Number,
    roastLevel: {type:String,enum:["Light","Medium","Dark"]},
    notes: String,
});

export default mongoose.model("Roaster",roasterSchema);