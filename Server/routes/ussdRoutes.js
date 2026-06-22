import express from "express";
import Farmer from "../models/Farmer.js";
import Price from "../models/Price.js";
import africastalkingC from "../config/africastalking.js";
import { sendSMS } from "../config/africastalking.js";

const router = express.Router();

router.post("/ussd",(req,res)=>{
    const ussd = africastalkingClient.USSD;
    res.send("USSD response");
});
router.post("/",async(req,res)=>{
    const{sessionId, serviceCode, phoneNumber, text} = req.body;
    let response = "";
    
    const latestPrice = await Price.findOne().sort({date: -1});
    
    if (text === ""){
        response = `CON Welcome to Agri Farmers Co-op
        1.Today's Coffee Price
        2.Subscribe to Price alerts
        3.Unsubscribe form alerts
        4.Register as a Farmer;
        5.Check my registration;
        6.Update my details;
        7.Exit`;
    }else if (text[0] === "1"){
        response = `END Today's coffee price is KSh 85 per kg `;
    }else if (text[0] === "2"){
        await Farmer.findOneAndUpdate({phone:phoneNumber},{subscribed:true});
        response = `END You have subscribed to daily coffee price alerts`;
    }else if (text[0] === "3"){
        await Farmer.findOneAndDelete({phone:phoneNumber},{subscribed:false});
        response = `END You have unsubscribed from daily coffee price alerts`;
    }else if (text[0] === "4"){
        if (text.length === 1){
            response = `CON Enter your Full Name: `;
        }else if(text.length === 2){
            response = `CON Enter your National ID Number: `;
        }else if(text.length === 3){
            response = `CON Enter your Station: `;
        }else if(text.length === 4){
            const name = text[1];
            const id = text[2];
            const station = text[3];
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await Farmer.findOneAndUpdate(
                {phone:phoneNumber},{id,name,station,phone:phoneNumber,otp,verified:false},{upsert:true}
            );
            try{
                await sendSMS(phoneNumber, `Your OTP for Agri farmers Co-op registration is ${otp}`);
                response = `CON Enter the OTP sent to your phone number: `;
            }catch(err){
                response = `END Failed to send OTP. Please try again later.`;
            }

            try{
                const farmerExists = new Farmer({id,name,phone:phoneNumber,station,password:"default",subscribed:true});
                await farmerExists.save();
                await sendSMS(phoneNumber, `Welcome ${name} to Agri Farmers Co-Op! Your registration is successful. Your ID: ${id}`);
                response = `END Registration successful! Welcom ${name} to Agri Farmers Co-op 🌱`;
            }catch(err){
                response = `END Registration failed! Please try again or you may already been registered.`;
            }
        }else if(text.length === 5){
            const enteredOtp = text[4];
            const farmer = await Farmer.findOne({phone:phoneNumber});
            if (farmer && farmer.otp === enteredOtp){
                farmer.verified = true;
                farmer.otp = null;
                await farmer.save();
                response`END Your phone number has been verified. Registration complete! Welcome ${farmer.name} to Agri farmers Co-op`;
            }else{
                response = `END Invalid OTP. Please try registering again.`;
            }
        }
    }else if (text[0] === "5"){
        const farmer = await Farmer.findOne({phine:phoneNumber, verified:true});
        if (farmer){
            response = `END You are Registered as ${farmer.name} with ID: ${farmer.id} at ${farmer.station} station.`;
        }else{
            response = `END you are not yet registered. Dial again and choose option 4 to register.`;
        }
    }else if (text[0] === "6"){
        const farmer = await Farmer.findOne({phone:phoneNumber, verified:true});
        if (!farmer){
            response = `END You are not registered.Register first.`;
        }else{
            if(text.length === 1){
                response = `END What would you like to update?
                1. Name
                2. Station`;
            }else if(text.length === 2){
                if(text[1] === "1"){
                    response = `CON Enter your updated name`;
                }else if(text[1] === "2"){
                    response = `CON Enter your new Station`;
                }else{
                    response = `END Invalid choice! Try again.`;
                }
            }else if(text.length === 3){
                if(text[1] === "1"){
                    farmer.name = text[2];
                }else if(text[2] === "2"){
                    farmer.station = text[2];
                }
                await farmer.save();
                response = `END Your details have been successfully updated`;
            }
        }
    }else if(text[0] === "7"){
        response = `END Thank you for using Agri farmers Co-op service. Goodbye!`;
    }else{
        response = `END Invalid choice. Please try again.`;
    }
    res.set('Content-Type: text/plain');
    res.send(response);
});

export default router;