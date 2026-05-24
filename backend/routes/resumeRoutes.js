const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/authMiddleware");
const {
    uploadResume,
    getResumeHistory,
    getResumeById,
} = require("../controllers/resumeController");

const storage = multer.diskStorage({
    destination: function (req, file, cb)
    {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb)
    {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if(ext === ".pdf" || ext === ".docx") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF and DOCX files are allowed"), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter: fileFilter
});

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/history", protect, getResumeHistory);
router.get("/:id", protect, getResumeById);

module.exports = router;