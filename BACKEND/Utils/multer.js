const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file
    },
});
const upload = multer({ storage: storage   ,limits: {
    files: 5,
    fileSize: 5 * 1024 * 1024 
  } });

module.exports = {upload}