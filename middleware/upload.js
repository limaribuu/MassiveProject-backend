const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const uploadDir = process.env.UPLOAD_DIR || "uploads";
const uploadPath = path.join(__dirname, "..", uploadDir);

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log(`Folder upload dibuat di: ${uploadPath}`);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `avatar-${Date.now()}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("File harus berupa gambar"), false);
        }
        cb(null, true);
    },
});

module.exports = upload;
