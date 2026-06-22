import express from "express";
import Farmer from "../models/Farmer.js";
import { sendSMS } from "../config/africastalking.js";
import Delivery from "../models/Delivery.js";
import bcrypt from "bcrypt";
import { verifyToken,isFarmer } from "../middleware/auth.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register",async(req,res)=>{
    try{
        const existing = await Farmer.findOne({phone:phoneNumber});
        if(existing){
            return res.status(400).json({error:"Already registered please login"});
        }
        const {id,name,phone,station,password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const farmer = new Farmer({id,name,phone,station,password:hashedPassword});
        await farmer.save();
        const message = `Welcome ${name} to Agri farmers Co-op🌱!  Your registration is successful. Your ID: ${id}`;
        await sendSMS(phone, message);
        res.status(201).json({
            id:farmer.id,name:farmer.name,phone:farmer.phone,station:farmer.station
        });
    }catch(err){
        res.status(400).json({error:err.message});
    }
});

router.post("/login",async(req,res)=>{
    try{
        const {id,password} = req.body;
        const farmer = await Farmer.findOne({id});
        if(!farmer) return res.status(404).json({error: "Farmer not found! Try again"});

        const isMatch = await bcrypt.compare(password, farmer.password);
        if(!isMatch) return res.status(400).json({error: "Invalid credentials! Try again"});
        
        const token = jwt.sign(
            {id:farmer.id}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRES_IN || "1d"}
        );
        res.json({token,farmer:{
            id: farmer.id,name: farmer.name,phone: farmer.phone,station: farmer.station
            }
        });
    }catch(err){
        res.status(500).json({error:err.message});
    }
});


router.get("/me/deliveries",verifyToken,isFarmer,async(req,res) =>{
    try{
        const deliveries = await Delivery.find({farmerId: req.user.id});
        res.json(deliveries);
    }catch(err){
        res.status(403).json({error:err.message});
    }
});


router.put("/update",verifyToken,isFarmer,async(req,res) =>{
    try{
        const farmerId = req.user.id;
        const {name,phone,station,password} = req.body;
        const farmer = await Farmer.findById(farmerId);
        
        if(!farmer) return res.status(404).json({error: "Farmer not found!"});
        if(name) farmer.name = name;
        if(phone) farmer.phone = phone;
        if(station) farmer.station = station;
        if(password){
            const hashedPassword = await bcrypt.hash(password, 10);
            farmer.password = hashedPassword;
        }
        await farmer.save();

        res.json({
            message: "✅ Profile updated successfully",
            farmer: {
                id: farmer._id,
                name: farmer.name,
                phone: farmer.phone,
                station: farmer.station,
            },
        });
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

export default router;