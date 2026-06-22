import express from "express";
import Catalog from "../models/Catalog.js";

const router = express.Router();
router.get("/",async(req,res)=>{
    try{
        const lots = await Catalog.find({status:"Available"}).populate("farmerId");
        res.json(lots);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get("/:lotId",async(req,res)=>{
    try{
        const lott = await Catalog.findOne({lotId:req.params.lotId}).populate("farmerId");
        if (!lott) return res.status(404).json({error: "Lot not found!"});
        res.json(lott);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post("/add",async(req,res)=>{
    try{
        const lot = new Catalog(req.body);
        await lot.save();
        res.status(201).json(lot);
    }catch(err){
        res.status(400).json({error: err.message});
    }
});

export default router;