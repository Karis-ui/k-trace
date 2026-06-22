import jwt from "jsonwebtoken";

export const verifyToken = (req,res,next) =>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({error: "No token provided"});
        }
        const token  = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(403).json({error:"Invalid or expired token"});
    }
};

export const isAdmin = (req,res,next)=>{
    if (req.user.role !== "admin"){
        return res.status(403).json({error: "Access denied - Admins only"});
    }
};

export const isOperator = (req,res,next)=>{
    if (req.user.role !== "operator"){
        return res.status(403).json({error: "Access denied - Operators only"});
    }
};

export const isFarmer = (req,res,next)=>{
    if (req.user.role !== "farmer"){
        return res.status(403).json({error: "Access denied - Farmers only"});
    }
};

export const isBuyer = (req,res,next)=>{
    if (req.user.role !== "buyer"){
        return res.status(403).json({error: "Access denied - Buyers only"});
    }
};