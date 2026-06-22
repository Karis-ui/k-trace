import dotenv from "dotenv";
dotenv.config();
console.log("AT_USERNAME:",process.env.AT_USERNAME);
console.log("AT_API_KEY:",process.env.AT_API_KEY);
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import buyerRoutes from "./routes/buyerRoutes.js";
import adminroutes from "./routes/admin.routes.js";
import africastalkingC from "./config/africastalking.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import ussdRoutes from "./routes/ussdRoutes.js";
import bodyParser from "body-parser";
import priceRoutes from "./routes/priceRoutes.js";
import catalogRoutes from "./routes/catalogRoutes.js";
import operatorRoutes from "./routes/operatorRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import roasterRoutes from "./routes/roasterRoutes.js";

const sms = africastalkingC.SMS;

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
const PORT = 8000;

app.use("/api/admin",adminroutes);
app.use("/api/farmers",farmerRoutes);
app.use("/api/ussd",ussdRoutes);
app.use("/api/price",priceRoutes);
app.use("/api/gradings",operatorRoutes);
app.use("/api/catalog",catalogRoutes);
app.use("/api/buyers",buyerRoutes);
app.use("/api/exports",exportRoutes);
app.use("/api/inventory",inventoryRoutes);
app.use("/api/roasters",roasterRoutes);

const MONGO_URI = "mongodb+srv://Kariuki_db_user:Mankaloko7890@cluster0.q4gxxzk.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Backend is running.Ready on your go 🚀!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
