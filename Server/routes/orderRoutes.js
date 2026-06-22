import express from "express";
import Order from "../models/Order";
import Catalog from "../models/Catalog.js";
import { verifyToken, isBuyer} from "../middleware/auth.js";
import e from "express";

const router = express.Router();
router.post("/",verifyToken,isBuyer,async(req,res) =>{
    try{
        const {lotId,quantity} = req.body;
        const catalog = await Catalog.findById(lotId);
        if(!catalog) return res.status(404).json({error: "Lot not found!"});

        const order = await Order.create({
            buyerId: req.user.id, lotId, quantity, unitPrice: catalog.unitPrice, orderDate
        });
        res.status(201).json(order);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get("/",verifyToken,isBuyer,async(req,res) =>{
    try{
        const orders = await Order.find({buyerId: req.user.id}).populate("lotId");
        res.json(orders);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.put("/:id",verifyToken,isBuyer,async(req,res) =>{
    try{
        const {unitPrice,quantity,orderDate} = req.body;
        const order = await Order.findOne({_id:req.params.id, buyerId:req.user.id});
        if(!order) return res.status(404).json({error:"Order not found"});

        if(order.status != "Pending") return res.status(400).json({error: "Only pending orders can be updated."});
        if(quantity) order.quantity = quantity;
        if(unitPrice) order.unitPrice = unitPrice;
        if(orderDate) order.orderDate = orderDate;
        order.totalPrice = order.quantity * order.unitPrice;
        await order.save();
        res.json({message: "Order updated successfully",order});
    }catch(err){
        res.status(500).json({error: err.message});
    }
});;

router.delete("/:id",verifyToken,isBuyer,async(req,res) =>{
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.json({message: "Order cancelled"});
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

export default router;