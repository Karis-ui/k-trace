import express from "express";
import Price from "../models/Price.js";
import Farmer from "../models/Farmer.js";


const router = express.Router();
router.post("/",async(req,res) =>{
    try{
        const {amount} = req.body;
        const newPrice = new Price({amount});
        await newPrice.save();

        const subscribers = await Farmer.find({subscribed:true});
        subscribers.forEach(farmer =>{
            sms.send({
                to:farmer.phone, message: `📢 New coffee price is KSh ${amount} per kg`
            }).then((resp)=>console.log(`✅ SMS sent to ${farmer.phone}`,resp)).catch((err)=>console.log(`❌ SMS failed to ${farmer.phone}`,err));
        });
        res.status(201).json(newPrice);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

export default router;