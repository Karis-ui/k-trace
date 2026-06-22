import express from "express";
import Farmer from "../models/Farmer.js";
import Buyer from "../models/Buyer.js";
import Operator from "../models/Operator.js";
import {verifyToken, isAdmin} from "../middleware/auth.js";
import Orders from "../models/Orders.js";
import Delivery from "../models/Delivery.js";
import Catalog from "../models/Catalog.js";
import Price from "../models/Price.js";
import Grading from "../models/Grading.js";
import router from "./catalogRoutes.js";

router.get("/users",verifyToken,isAdmin,async(req,res) =>{
    try{
        const farmers = await Farmer.find();
        const operators = await Operator.find();
        const buyers = await Buyer.find();
        const deliveries = await Delivery.find().populate("farmerId");
        const orders = await Order.find().populate("buyerId");
        const catalogs = await Catalog.find().populate({path:"gradingId",populate:{path:"lotId operatorId"}});
        const gradings = await Grading.find().populate("lotId").populate("operatorId");
        res.json({farmers,operators,buyers,deliveries,orders,catalogs,gradings});
    }catch(err){
        res.status(500).json({error: err.message});
    }
});
router.get("/farmer/:id",verifyToken,isAdmin,async(req,res)=>{
    try{
        const farmer = await Farmer.findById(req.params.id);
        if (!farmer) return res.status(404).json({error: "Farmer not found"});
        res.json(farmer);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});
router.get("/operator/:id",verifyToken,isAdmin,async(req,res)=>{
    try{
        const operator = await Operator.findById(req.params.id);
        if (!operator) return res.status(404).json({error: "Operator not found"});
        res.json(operator);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});
router.get("/buyer/:id",verifyToken,isAdmin,async(req,res)=>{
    try{
        const buyer = await Buyer.findById(req.params.id);
        if (!buyer) return res.status(404).json({error: "Buyer not found"});
        res.json(buyer);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});
router.delete("/:type/:id",verifyToken,isAdmin,async(req,res)=>{
    const {type,id} = req.params;
    const models = {farmer:Farmer,buyer:Buyer,catalog:Catalog,delivery:Delivery,grading:Grading,operator:Operator,order:Order,price:Price};
    try{
        const model = models[type];
        if(!model) return res.status(400).json({error: "Invalid Type."});
        await model.findByIdAndDelete(id);
        res.json({success:true, message: `${type} deleted!`});
    }catch(err){
        res.status(500).json({error: err.message});
    }
});
router.put("/farmer/:id",verifyToken,isAdmin,async(req,res)=>{
    try{
        const {id,name,phone,station} = req.body;
        const farmer = await Farmer.findById(req.params.id);
        if(!farmer) return res.status(404).json({error:"Farmer not found!"});

        if(id) farmer.name = id;
        if(name) farmer.name = name;
        if(phone) farmer.phone = phone;
        if(station) farmer.station = station;
        await farmer.save();
        res.status(500).json({success:true, message:"Farmer updated successfully",farmer});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}); 
router.put("/operator/:id",verifyToken,isAdmin,async(req,res)=>{
    try{
        const {name,phone,email,station,role} = req.body;
        const operator = await Operator.findById(req.params.id);
        if(!operator) return res.status(404).json({error:"Operator not found!"});

        if(name) operator.name = name;
        if(phone) operator.phone = phone;
        if(email) operator.email = email;
        if(station) operator.station = station;
        if(role) operator.role = role;
        await operator.save();
        res.status(500).json({success:true, message:"Operator updated successfully",operator});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}); 
router.put("/buyer/:id",verifyToken,isAdmin,async(req,res)=>{
    try{
        const {name,email,phone,company} = req.body;
        const buyer = await Buyer.findById(req.params.id);
        if(!buyer) return res.status(404).json({error:"Buyer not found!"});

        if(name) buyer.name = name;
        if(email) buyer.email = email;
        if(phone) buyer.phone = phone;
        if(company) buyer.company = company;
        await buyer.save();
        res.status(500).json({success:true, message:"Buyer updated successfully",buyer});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}); 

router.get("/stats",verifyToken,isAdmin,async(req,res) =>{
    try{
        const[farmers,deliveries,gradings] = await Promise.all([
            Farmer.countDocuments(),Delivery.countDocuments(),Grading.countDocuments()
        ]);

        const totalWeight = await Delivery.aggregate([{$group:{ _id:null,total:{$sum: $weight}}},]);
        res.json({
            totalfarmers : farmers,
            totalDeliveries : deliveries,
            totalGradings : gradings,
            totalWeight : totalWeight[0]?.total || 0,
        });
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

export default router;