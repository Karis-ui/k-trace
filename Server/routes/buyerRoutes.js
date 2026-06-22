import express from "express";
import Buyer from "../models/Buyer.js";
import Orders from "../models/Orders.js";
import bcrypt from "bcrypt";
import Shipment from "../models/Shipment.js";
import Container from "../models/Container.js";
import Exportdoc from "../models/Exportdoc.js";
import { verifyToken,isBuyer } from "../middleware/auth.js";
import { sendSMS } from "../config/africastalking.js";
import jwt from "jsonwebtoken"; 

const router = express.Router();

router.post("/register",async(req,res)=>{
    try{
        const existing = await Buyer.findOne({phone});
        if(existing){
            return res.status(400).json({error:"Already registered please login."});
        }
        const {id,name,email,phone,company,password} = req.body;
        const hashed = await bcrypt.hash(password,10);
        const buyer = new Buyer({id,name,email,company,password:hashed});
        await buyer.save();
        const message = `Welcome ${name} to Agri farmers Co-op🌱!  Your registration is successful. Your ID: ${id}`;
        await sendSMS(phone,message);
        req.status(201).json({id:buyer.id,name:buyer.name,email:buyer.email,phone:buyer.phone,company:buyer.company});
    }catch(err){
        res.status(400).json({error: err.message});
    }
});

router.post("/login",async(req,res)=>{
    try{
        const {id,password}= req.body;
        const buyer = await Buyer.findOne(id);
        if(!buyer) return res.status(404).json({error:"Buyer not found!Try again."});

        const isMatch = await bcrypt.compare(password,buyer.password);
        if(!isMatch) return res.status(400).json({error:"Invalid credentials! Try again."});
        
        const token = jwt.sign(
            {id:buyer.id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN || "1d"}
        );
        res.json({token,buyer:{id:buyer.id,name:buyer.name,email:buyer.email,phone:buyer.phone,company:buyer.company}}); 
    }catch(err){
        res.status(400).json({error: err.message});
    }
});

router.put("/update",verifyToken,isBuyer,async(req,res) =>{
    try{
        const buyerId = req.user.id;
        const {name,email,phone,company,password} = req.body;
        const buyer = await Buyer.findById(buyerId);
        
        if(!buyer) return res.status(404).json({error: "Buyer not found!"});
        if(name) buyer.name = name;
        if(email) buyer.email = email;
        if(phone) buyer.phone = phone;
        if(company) buyer.company = company;
        if(password){
            const hashed = await bcrypt.hash(password, 10);
            buyer.password = hashed;
        }
        await buyer.save();

        res.json({
            message: "✅ Profile updated successfully",
            buyer: {
                id: buyer._id,
                name: buyer.name,
                email: buyer.email,
                phone: buyer.phone,
                company: buyer.company,
            },
        });
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get("/orders",verifyToken,isBuyer,async(req,res) =>{
    try{
        const orders = await Orders.find({buyerId: req.user.id});
        res.json(orders);
    }catch(err){
        res.status(400).json({error: err.message});
    }
});

router.put("/update-shipment/:id",verifyToken,isBuyer,async(req,res) =>{
    try{
        const shipment = await Shipment.findByIdAndUpdate(req.params.id,req.body,{new:true}).populate({path:"OrderId",populate:{path:"buyerId"}});
        if(!shipment) return res.status(404).json({error: "Shipment not found"});
        const buyer = shipment.exportDocId.buyerId;
        const message = `📦Hello ${buyer.name}, your shipment with ID: ${shipment._id} has been updated. Current status: ${shipment.status}.`;
        await sendSMS(buyer.phone, message);
        res.json({message: "📦Shipment updated successfully",shipment});
    }catch(err){
        res.status(500).json({error: "Failed to update shipment"});
    }
});

export default router;