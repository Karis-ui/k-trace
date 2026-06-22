import Delivery from "../models/Delivery.js";
import Grading from "../models/Grading.js";
import Catalog from "../models/Catalog.js";
import { calculateGrades, calculatePayout } from "../config/Grade.js";

export const gradeCoffee = async (req,res)=>{
    try{
        const {lotId,defects,cuppinScore,moistureContent} = req.body;
        const delivery = await Delivery.findOne({farmerId});
        const grading = await Grading.findOne({lotId});
        if(!grading) return res.status(404).json({error: "Delivery not found."});

        const result = calculateGrades(defects,cuppinScore,moistureContent);
        grading.grade = result.grade;
        grading.cuppingScore = result.cuppinScore;
        grading.totalPayout = result.totalPayout;
        grading.status = "Graded";
        grading.date = Date.now();
        await delivery.save();

        await Catalog.create({
            lotId: grading.lotId,
            farmerId: delivery.farmerId,
            grade: grading.grade,
            cuppingScore: grading.cuppingScore,
            moisture: grading.moistureContent,
            defects: grading.defects,
            totalPayout: grading.totalPayout,
            date: grading.date,
            status: "Available",
        });
        res.status(200).json({
            message: "✅ Grading completed and added to catalog", grading,
        });
    }catch(err){
        res.status(500).json({error: err.message});
    }
};