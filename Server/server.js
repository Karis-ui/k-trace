import express from "express";
import cors from "cors";
import path from 'path';
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import mongoose from "mongoose";
import adminRoutes from "./routes/admin.routes.js";
import operatorRoutes from "./routes/operatorRoutes.js";
import buyerRoutes from "./routes/buyerRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import catalogRoutes from "./routes/catalogRoutes.js";
import ussdRoutes from "./routes/ussdRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import financeRoutes from './routes/financeRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import {
  generalLimiter,
  strictLimiter,
  loginLimiter,
  smsLimiter,
  payoutLimiter,
  exportLimiter,
  uploadLimiter,
  adminLimiter,
  farmerLimiter,
  buyerLimiter,
  ussdLimiter,
  userLimiter,
  ipLimiter
} from "./config/rateLimiter.js";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'https://zesty-ktrace.up.railway.app',
  'https://k-trace.up.railway.app',
  'https://localhost:5000',
  'https://k-trace.up.railway.app',
].filter(Boolean);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            console.log('❌ CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
}));

app.use(compression());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(generalLimiter);

app.use(ipLimiter);
app.use("/api/catalog", generalLimiter, catalogRoutes);
app.use("/api/ussd", ussdLimiter, ussdRoutes);

app.use("/api/auth", loginLimiter, authRoutes);

app.use("/api/admin", adminLimiter, adminRoutes);

app.use("/api/finance", financeRoutes);

app.use("/api/operator", generalLimiter, operatorRoutes);

app.use("/api/farmer", farmerLimiter, farmerRoutes);

app.use("/api/buyer", buyerLimiter, buyerRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/admin/payouts", strictLimiter);
app.use("/api/operator/payouts", strictLimiter);
app.use("/api/admin/price", strictLimiter);
app.use("/api/admin/users", userLimiter);

app.use("/api/sms", smsLimiter);
app.use("/api/operator/payouts/:id/process", payoutLimiter);

app.use("/api/admin/exports", exportLimiter);
app.use("/api/admin/reports", exportLimiter);

app.get("/api/health", (req, res) => {
  res.json({
    status: 'ok', message: 'K-Trace API is running', timestamp: new Date().toISOString()
  });
});

if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/build');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

mongoose.connect('mongodb+srv://leankaloko_db_user:Mankaloko7890@cluster0.wffllgt.mongodb.net/?appName=Cluster0')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Rate limiting enabled`);
  console.log(`Helmet security enabled`);
});

export default app;
