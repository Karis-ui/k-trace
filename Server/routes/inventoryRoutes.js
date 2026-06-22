import express from 'express';
import Inventory from '../models/Inventory.js';
import { verifyToken,isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/',verifyToken,isAdmin,async(req,res) =>{
    try{
        const stock = await Inventory.find().populate('lotId').populate('batchId');
        res.json(stock);
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

router.put('/:id',verifyToken,isAdmin,async(req,res) =>{
    try{
        const updatedStock = await Inventory.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.json({message:"Inventory updated successfully",updatedStock});
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

export default router;