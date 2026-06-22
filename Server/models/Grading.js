import mongoose from "mongoose";

const GradingSchema = new mongoose.Schema({
    lotId: {type:mongoose.Schema.Types.ObjectId,ref:"Delivery",required:true},
    operatorId: {type:mongoose.Schema.Types.ObjectId,ref:"Operator",required:true},
    defects: {insect:Number, broken:Number, unripe:Number},
    moistureContent: {type:Number, required:true},
    cuppingScore: {
    flavour: Number,
    acidity: Number,
    aroma: Number,
    body: Number,
    aftertaste: {type:String,default:""},
    total: Number
    },
    date: {type:Date,default:Date.now()},
    grade: String,
    totalPayout: {type:Number},
    payoutStatus: {type:String, default:"Pending"}
});
GradingSchema.pre("save",function(next){
    this.cuppingScore.total = 
        this.cuppingScore.flavour +
        this.cuppingScore.acidity +
        this.cuppingScore.aroma +
        this.cuppingScore.body;
    next();
});

export default mongoose.model("Grading",GradingSchema);