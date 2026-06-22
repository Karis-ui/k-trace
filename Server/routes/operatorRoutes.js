import express from "express";
import Delivery from "../models/Delivery.js";
import Grading from "../models/Grading.js";
import Farmer from "../models/Farmer.js";
import { sendSMS } from "../config/africastalking.js";
import { calculateGrades,calculatePayout } from "../config/Grade.js";
import { gradeCoffee } from "../controllers/grading.controller.js";
import { verifyToken,isOperator } from "../middleware/auth.js";

const router = express.Router();

router.get("/my/",verifyToken,isOperator,async(req,res)=>{
    try{
        const deliveries = await Delivery.find({farmerId:req.user.id}).sort({date:-1});
        res.json(deliveries);
    }catch(err){
        res.status(400).json({error:err.message});
    }
});

router.post("/record",verifyToken,isOperator,async(req,res) =>{
    const { lotId, weight, moistureContent, defects, cuppingScore, grade, totalPayout, date} = req.body;
    try{
        const delivery = await Delivery.findOne({lotId}).populate("farmerId");
        if (!delivery){
            return res.status(400).json({error:"Lot not found!"});
        }
        const grading = await Grading.findOne({lotId});
        delivery.weight = weight;
        grading.moistureContent = moistureContent;
        grading.defects = defects;
        grading.cuppingScore = cuppingScore;
        grading.grade = grade;
        grading.payoutStatus = "Calculated";
        grading.totalPayout = totalPayout;
        grading.date = new Date();
        await grading.save();
        await delivery.save();

        const farmer = delivery.farmerId;
        const message = `Your delivery ${lotId} (${weight} kg) graded as ${grade}, scores ${cuppingScore}`;
        await sendSMS(farmer.phone, message);
        res.json({success:true, delivery});
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

router.get("/dashboard",verifyToken,isOperator,async(req,res) =>{
    try{
        const totalIntake =  await Delivery.aggregate([{$group:{_id:null,total:{$sum:"$weight"}}}]);
        const averageCupping = await Grading.aggregate([{$group:{_id:null,average:{$average:"$cuppingScore.total"}}}]);
        const defectsSummary = await Grading.aggregate([
            {$project:{defects:{$objectToArray:"$defects"}}},
            {$unwind:"$defects"},
            {$group: {_id: "$defects.k", value:{$sum:"$defects.v"}}},
            {$project:{name:"$_id", value:1,_id:0}}
        ]);
        const dels = await Grading.find().populate("farmerId");
        res.json({
            stats: {totalIntake: totalIntake[0]?.total || 0,
                   averageCupping: averageCupping[0]?.average || 0,
                   totalPayout: 0},
            defectsSummary,
            dels
        });
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

export default router;