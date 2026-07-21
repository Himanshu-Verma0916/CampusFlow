const multer = require("multer");

// Store files in memory instead of local disk
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error("Invalid file type. Only JPEG, PNG, GIF and PDF files are allowed."),
            false
        );
    }
};

// Multer configuration
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

module.exports = upload;

// const multer =require('multer');
// const fs = require("fs");

// if (!fs.existsSync("uploads")) {
//     fs.mkdirSync("uploads");
// }

// const storage = multer.diskStorage({
//     destination:function(req,file,cb){  // cb=callback function
//         cb(null,'uploads/');      // specify the destination folder for uploaded files   
//     },
//     filename:function(req,file,cb){
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     const allowedTypes = [
//         "image/jpeg",
//         "image/png",
//         "image/gif",
//         "application/pdf"
//     ];

//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."), false);
//     }
// };

// const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
// });

// module.exports=upload;
