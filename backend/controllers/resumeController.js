const Resume = require("../models/Resume");
const mammoth = require("mammoth");
const fs = require("fs");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const { analyzeResume } = require("../aiService");

// ─── Helper: Delete File Safely ────────────────────────────────────────────────

const deleteFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

// ─── Helper: Extract Text From File ───────────────────────────────────────────

const extractText = async (file) => {
    const ext = file.originalname.split(".").pop().toLowerCase();
    
    if (ext === "pdf") {
        const dataBuffer = fs.readFileSync(file.path);
        const uint8Array = new Uint8Array(dataBuffer);
        
        const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
        const pdfDocument = await loadingTask.promise;
        
        let fullText = "";
        const totalPages = pdfDocument.numPages;
        
        for (let i = 1; i <= totalPages; i++) {
            const page = await pdfDocument.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item) => item.str).join(" ");
            fullText += pageText + "\n";
    }

    if (!fullText || fullText.trim().length === 0) {
        throw new Error("No text found in PDF");
    }
    return fullText;
}

if (ext === "docx") {
    const data = await mammoth.extractRawText({ path: file.path });
    return data.value;
}

throw new Error("Unsupported file type");
};

// ─── Helper: Clean Resume Text ─────────────────────────────────────────────────

const cleanText = (text) => {
    return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[^\x20-\x7E\n]/g, "")
    .trim();
};

// ─── Upload Resume ─────────────────────────────────────────────────────────────

const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a resume file" });
    }
    const file = req.file;
    const ext = file.originalname.split(".").pop().toLowerCase();

    if (ext !== "pdf" && ext !== "docx") {
        deleteFile(file.path);
        return res.status(400).json({ message: "Only PDF and DOCX files are allowed" });
    }

    if (file.size > 8 * 1024 * 1024) {
        deleteFile(file.path);
        return res.status(400).json({ message: "File size must be less than 8MB" });
    }

    let resumeText;
    try {
        resumeText = await extractText(file);
    } catch (err) {
        deleteFile(file.path);
        return res.status(400).json({ message: "Could not read file: " + err.message });
    }

    resumeText = cleanText(resumeText);

    if (!resumeText || resumeText.length < 50) {
        deleteFile(file.path);
        return res.status(400).json({ message: "Resume appears to be empty or unreadable" });
    }

    deleteFile(file.path);

    let analysis;
    try {
        analysis = await analyzeResume(resumeText);
    }
    catch (err) {
        return res.status(500).json({
            message: "AI analysis failed. Please try again.",
            error: err.message,
        });
    }

    const resume = await Resume.create({
        userId: req.user.id,
        originalFileName: file.originalname,
        resumeText: resumeText,
        atsScore: analysis.atsScore,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        missingSkills: analysis.missingSkills,
        suggestions: analysis.suggestions,
        matchedRoles: analysis.matchedRoles,
    });

    res.status(201).json({
        message: "Resume analyzed successfully",
        resumeId: resume._id,
        fileName: file.originalname,
        atsScore: analysis.atsScore,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        missingSkills: analysis.missingSkills,
        suggestions: analysis.suggestions,
        matchedRoles: analysis.matchedRoles,
    });
} catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
}
};

// ─── Get Resume History ────────────────────────────────────────────────────────

const getResumeHistory = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .select("-resumeText");
        res.status(200).json({
            message: "Resume history fetched successfully",
            count: resumes.length,
            resumes,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ─── Get Single Resume ─────────────────────────────────────────────────────────

const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        res.status(200).json({
            message: "Resume fetched successfully",
            resume,
        });
    } 
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { uploadResume, getResumeHistory, getResumeById };
