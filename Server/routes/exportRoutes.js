import express from "express";
import Exportdoc from "../models/Exportdoc.js";
import Shipment from "../models/Shipment.js";
import Container from "../models/Container.js";
import {verifyToken, isAdmin} from "../middleware/auth.js";

const router = express.Router();

router.post("/",verifyToken,isAdmin,async(req,res) =>{
    try{
        const exportdoc = new Exportdoc(req.body);
        await exportdoc.save();
        res.json({message: "Export document created successfully",exportdoc});
    }catch(err){
        res
    }
});

router.put("/:id",verifyToken, isAdmin,async(req,res) =>{
    try{
        const shipment = await Shipment.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.json({message: "📦Shipment updated successfully",shipment});
    }catch(err){
        res.status(500).json({error: "Failed to update shipment"});
    }
});

router.post("/sensor-data", verifyToken, isAdmin, async(req,res) =>{
    try{
        const sensor = new Container(req.body);
        await sensor.save();
        res.json({message: "📡Sensor data recorded successfully",sensor});
    }catch(err){
        res.status(500).json({error: "Failed to record sensor data"});
    }
});

export default router;
