import africastalking from "africastalking";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

console.log("🔍 Checking Africastalking credentials:");
console.log("API Key exists:", !!process.env.AFRICASTALKING_API_KEY);
console.log("Username exists:", !!process.env.AFRICASTALKING_USERNAME);

const apiKey = process.env.AFRICASTALKING_API_KEY?.trim();
const username = process.env.AFRICASTALKING_USERNAME?.trim();

const mockConfig = {
    SMS: {
        send: async ({ to, message }) => {
            console.log(`📱 [MOCK] SMS to ${to}: ${message}`);
            return { status: "success", mock: true };
        }
    }
};

let africastalkingConfig = mockConfig;
let smsEnabled = false;

if (apiKey && username && apiKey === 'atsk_47fb2a6300d94a50e9ae836bf30760b1e8361b0b24976a6e1f1c2cf2ddffad59d7abd0b5' && username === 'sandbox') {
    try {
        africastalkingConfig = africastalking({
            apiKey: apiKey,
            username: username,
        });
        smsEnabled = true;
        console.log("✅ Africastalking initialized successfully");
    } catch (error) {
        console.warn("⚠️ Failed to initialize Africastalking:", error.message);
        africastalkingConfig = mockConfig;
    }
} else {
    console.log("⚠️ Africastalking running in MOCK mode (no valid credentials)");
}

export const sendSMS = async (phoneNumber, message) => {
    if (!phoneNumber) {
        console.warn("⚠️ No phone number provided for SMS");
        return null;
    }

    try {
        const response = await africastalkingConfig.SMS.send({
            to: phoneNumber,
            message: message,
            from: process.env.AFRICASTALKING_SHORTCODE?.trim() || "KTrace",
        });
        console.log(`✅ SMS sent to ${phoneNumber}`);
        return response;
    } catch (error) {
        console.error(`❌ SMS failed to ${phoneNumber}:`, error.message);
        return null;
    }
};

export const sendBulkSMS = async (phoneNumbers, message) => {
    if (!phoneNumbers || phoneNumbers.length === 0) {
        return null;
    }

    try {
        const responses = await Promise.all(
            phoneNumbers.map(phone => sendSMS(phone, message))
        );
        return responses;
    } catch (error) {
        console.error("❌ Bulk SMS failed:", error.message);
        return null;
    }
};

export default africastalkingConfig;
export { smsEnabled };