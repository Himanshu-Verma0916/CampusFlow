const User =require('../models/userModel');
const bcrypt =require('bcrypt');
const jwt=require('jsonwebtoken');

// Generate Token

const generateToken=(id, role)=>{
    return jwt.sign({id,role}, process.env.JWT_SECRET, {expiresIn:'7d'})
};

// cookie options
const cookieOptions = {
    httpOnly: true,
    secure: true,          // Always true on Vercel (HTTPS)
    sameSite: "none",      // <-- IMPORTANT
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Register user

const registerUser= async(req,res)=>{
    try {
        const {name, email, password, role}=req.body;

        if(!name || !email || !password || !role){
            return res.status(400).json({success:false, message:"All fields required"});
        }
        
        const allowedRoles =["teacher", "admin","student"];

        if(!allowedRoles.includes(role)){
            return res.status(400).json({success:false, message:"Invalid Role"});
        }

        const existingUser= await User.findOne({email});

        if(existingUser){
            return res.status(400).json({success:false,message:"User already exists"});
        }

        const salt= await bcrypt.genSalt(10);
        const hashedPass=await bcrypt.hash(password, salt);

        const user=await User.create({name, email, password:hashedPass, role});
        
        const token = generateToken(user._id, user.role);

        res.cookie("token", token, cookieOptions).status(201).json({success:true, message:"Registration Successfully",  user:{id:user._id,name:user.name,email:user.email,role:user.role}});

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:error.message});
    }

}

// Login user

const loginUser =async(req,res)=>{
    try {
        const {email, password}= req.body;
        if(!email || !password){
            return res.status(400).json({success:false, message:"Email & password required"});
        }

        const user= await User.findOne({email});

        if(!user){
            return res.status(401).json({success:false, message:"Invalid credentials"});
        }

        const match= await bcrypt.compare(password, user.password);

        if(!match){
            return res.status(401).json({success:false, message:"Invalid credentials"});
        }

        const token =generateToken(user._id, user.role);

        res.cookie("token", token, cookieOptions).status(200).json({success:true, message:"Login successful", user:{id:user._id,name:user.name,email:user.email,role:user.role}})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:error.message});
    }
}

// Get Profile

const getProfile= async(req,res)=>{
    try {
        const user= await User.findById(req.user.id).select("-password");

        if(!user){
           return res.status(404).json({success:false, message:"User not found"}); 
        }

        res.status(200).json({success:true, user});

    } catch (error) {
       console.log(error);
        res.status(500).json({success:false, message:error.message}); 
    }
}
const logoutUser= async(req,res)=>{
    try {
        res.clearCookie("token",{httpOnly: true, secure: true, sameSite:"none"}).status(200).json({success:true, message:"Logout successful"});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:error.message});
    }
}

module.exports={registerUser, loginUser, getProfile, logoutUser};
