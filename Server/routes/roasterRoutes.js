import express from 'express';
import Roaster from '../models/Roaster.js';
import Inventory from '../models/Inventory.js';
import { verifyToken,isOperator } from '../middleware/auth.js';

const router = express.Router();

router.post('/create',verifyToken,isOperator,async(req,res) =>{
    try{
        const profile = new Roaster(req.body);
        await profile.save();
        const inventoryUpdate = new Inventory({
            type: "Roasted Coffee",
            batchId: profile._id,
            lotId: profile.lotId,
            quantity: profile.roastWeight,
            location: "Roastery"
        });
        await inventoryUpdate.save();
        res.status(201).json({message:"Roaster profile created successfully",data:profile});
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

export default router;