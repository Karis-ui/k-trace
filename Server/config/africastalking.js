import dotenv from "dotenv";
dotenv.config();
import africastalking from "africastalking";

const africastalkingC = africastalking({
    apiKey: process.env.AT_API_KEY,
    username: process.env.AT_USERNAME,
});

const sms = africastalkingC.SMS;

export const sendSMS = async(to, message) =>{
    try{
        const result = await sms.send({
            to: [to],
            message, from: process.env.SMS_SENDER_ID || "CoffeeTech"
        });

        return result;
    }catch(error){
        console.error("SMS sending failed:", error);
        throw error;
    }
};

export default africastalking;