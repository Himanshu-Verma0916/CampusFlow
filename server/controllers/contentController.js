const Content = require('../models/contentModel');
const mongoose = require('mongoose');

// Teacher uploads content

const uploadContent = async (req, res) => {
    try {
        const { title, description, subject, startTime, endTime, rotationDuration, rotationOrder } = req.body;

        if (!title || !subject || !req.file || !startTime || !endTime) {
            return res.status(400).json({ success: false, message: "All required fields missing" });
        }

        const content = await Content.create({
            title,
            description,
            subject,
            fileUrl: req.file ? req.file.path : "",
            uploadedBy: req.user.id,
            startTime,
            endTime,

            rotationDuration: rotationDuration || 5,
            rotationOrder: rotationOrder || 1
        });

        res.status(201).json({ success: true, message: "Content uploaded successfully", data: content });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Teacher views own content

const getMyContent = async (req, res) => {
    try {
        // const data =await Content.find({uploadedBy:{id:req.user.id, name:req.user.name}}).sort({createdAt:-1});
        const data = await Content.find({ uploadedBy: req.user.id })
            .populate("uploadedBy", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: data.length, data });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Rotational Logic for live content

const getLiveContent = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { subject } = req.query;

        console.log("teacherId:", teacherId);
        console.log("subject:", subject);

        let query = {
            uploadedBy: teacherId,
            status: "approved"
        };

        if (subject) {
            query.subject = subject;
        }

        let contents = await Content.find(query).sort({ rotationOrder: 1 });

        if (!contents.length) {
            return res.status(404).json({ success: false, message: "No content Available" });
        }

        const now = new Date();

        contents = contents.filter(content => content.startTime <= now && content.endTime >= now);

        if (!contents.length) {
            return res.status(404).json({ success: false, message: "No live content found" });
        }
        console.log("live contents:", contents);

        let duration = contents[0].rotationDuration; // Assuming all contents have same rotation duration, you can modify as per your requirement

        let currentMinute = Math.floor(Date.now() / 60000); // Get the current minute

        let index = Math.floor(currentMinute / duration) % contents.length; // Calculate the index based on rotation duration

        const activeContent = contents[index];

        res.status(200).json({ success: true, data: activeContent });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}


// Filter content by Subject

const getContentBySubject = async (req, res) => {
    try {
        const { subject } = req.params;

        const data = await Content.find({ subject, status: "approved" }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: data.length, data });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// for student dashboard to get all approved content

const getAllApprovedContent = async (req, res) => {
    try {

        const data = await Content.find({
            status: "approved"
        })
            .populate("uploadedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

// view content by id

const viewContentById = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await Content.findById(id);
        if (!content) {
            return res.status(404).json({ success: false, message: "Content not found" });
        }

        // Tecaher can view their own content regardless of status
        if(req.user.role==="teacher" && content.uploadedBy.toString()!==req.user.id){
            return res.status(403).json({ success: false, message: "You are not authorized to view this content" });
        }
        else if (req.user.role === "student" && content.status !== "approved") {
            return res.status(403).json({ success: false, message: "Content is not approved yet" });
        }
        // res.status(200).json({ success: true, data: content });
        res.sendFile(content.fileUrl, { root: '.' }); // send the file to the client

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// download content by id
const path = require("path");

const downloadContent = async (req, res) => {
    try {
        const { id } = req.params;

        const content = await Content.findById(id);

        if (!content) {
            return res.status(404).json({
                success: false,
                message: "Content not found"
            });
        }

        // Teacher
        if (
            req.user.role === "teacher" &&
            content.uploadedBy.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Student
        if (
            req.user.role === "student" &&
            content.status !== "approved"
        ) {
            return res.status(403).json({
                success: false,
                message: "Content is not approved"
            });
        }

        const filePath = path.resolve(content.fileUrl);

        return res.download(filePath);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = { uploadContent, getMyContent, getLiveContent, getContentBySubject, getAllApprovedContent, viewContentById, downloadContent };