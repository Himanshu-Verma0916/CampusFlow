const Content = require('../models/contentModel');

// Get all pending content

const getPendingContent =async(req,res)=>{
    try {
        const pendingContent= await Content.find({
            status:"pending"
        }).populate("uploadedBy", "name email role").sort({createdAt: -1});   // last created appear first

        if(!pendingContent.length){  // if empty
            return res.json({success: true , message:"No Pending content found", data:[]});
        }

        res.status(200).json({success:true, count:pendingContent.length, data:pendingContent});

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:error.message});
    }
}


// Approve content

const approveContent=async(req,res)=>{
    try {
        const {id}=req.params;
        const content =await Content.findById(id);

        if(!content){
            return res.status(404).json({success:false, message:"Content not found"});
        }

        if(content.status === "approved"){
            return res.json({success:false, message:"Content is already approved"});
        }

        if(content.status ==="rejected"){
            return res.json({success:false, message:"Rejected content can't be approved directly"});
        }

        content.status="approved";
        content.approvedBy=req.user.id;

        await content.save();

        res.status(200).json({success:true, message:"Content approved successfully", data:content});

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:error.message});
    }
}

// Reject Content

const rejectContent= async(req,res)=>{
    try{
        const {id}=req.params;

        const {reason}=req.body;

        if(!reason){
            return res.status(400).json({success:false, message:"Rejection reason required"});
        }

        const content =await Content.findById(id);

        if(!content){
            return res.status(404).json({success:false, message:"Content not found"});
        }

        if(content.status==="approved"){
            return res.json({success:false, message:"Approved content can't be rejected directly"});
        }

        content.status="rejected";
        content.rejectionReason =reason;
        content.approvedBy=req.user.id;
        await content.save();

        res.status(200).json({success:true, message:"Content rejected", data:content});

    }catch(error){
        console.log(error);
        res.status(500).json({success:false, message:error.message});
    }
}


// Get all content

const getAllContent =async(req,res) =>{
    try {
        const allContent =await Content.find().populate(
            "uploadedBy","name email"
        ).populate(
            "approvedBy","name email"
        ).sort({createdAt:-1});

        res.status(200).json({success:true, count:allContent.length, data:allContent});
           

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:error.message});
    }
}

// Filter content by status

const getContentByStatus =async(req,res)=>{
    try {

        const {status}=req.params;

        const allowedStatuses=["pending", "approved", "rejected"];

        if(!allowedStatuses.includes(status)){
            return res.json({success:true, data:[]});
        }

        const data= await Content.find({status});
        res.json({success:true, count:data.length, data});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:error.message});
    }
}

module.exports={getPendingContent, approveContent, getAllContent, rejectContent, getContentByStatus };