const express =require('express');
const router = express.Router();

const auth=require('../middleware/auth');
const upload=require('../middleware/uploadMiddleware');
const {uploadContent, getMyContent, getLiveContent, getContentBySubject, getAllApprovedContent, viewContentById, downloadContent, getAllContent} =require('../controllers/contentController');
const authorize = require('../middleware/roleAuth');

router.post('/upload', auth, authorize("teacher"), upload.single('file'), uploadContent);
router.get('/my-content', auth, authorize("teacher"), getMyContent);
router.get('/view/:id', auth, viewContentById); // for eveone   to view content by id, no auth required
router.get('/download/:id', auth, downloadContent); // for students to download content by id, no auth required
router.get('/live/:teacherId', getLiveContent);  // due to public broadcasting, no auth required
router.get('/subject/:subject', getContentBySubject); // for students to view content by subject, no auth required
router.get('/approved', getAllApprovedContent); // for students to view all approved content, no auth required

module.exports=router;