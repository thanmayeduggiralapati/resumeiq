import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

const Dashboard = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        validateAndSetFile(selected);
    };

    const validateAndSetFile = (selected) => {
        setError("");
        if (!selected) return;

        const ext = selected.name.split(".").pop().toLowerCase();
        if (ext !== "pdf" && ext !== "docx") {
            setError("Only PDF and DOCX files are allowed");
            return;
        }
        if (selected.size > 8 * 1024 * 1024) {
            setError("File size must be less than 8MB");
            return;
        }
        setFile(selected);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = e.dataTransfer.files[0];
        validateAndSetFile(dropped);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a file first");
            return;
        }
        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("resume", file);

        try {
            const res = await API.post("/resume/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate(`/results/${res.data.resumeId}`);
        } catch (err) {
            setError(err.response?.data?.message || "Upload failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800">
                Upload Your Resume
            </h1>
            <p className="text-gray-500 mt-2">
                Get AI-powered ATS score and feedback instantly
            </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
            <div 
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${
            dragOver
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
            onClick={() => document.getElementById("fileInput").click()}
            >
                <div className="text-5xl mb-4">📄</div>
                <p className="text-gray-600 font-medium">
                    Drag and drop your resume here
                </p>
                <p className="text-gray-400 text-sm mt-1">
                    or click to browse files
                </p>
                <p className="text-gray-400 text-xs mt-3">
                    Supports PDF and DOCX — Max 8MB
                </p>
                <input
                id="fileInput"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
                />
            </div>

        {file && (
            <div className="mt-4 bg-blue-50 px-4 py-3 rounded-lg flex justify-between items-center">
            <div>
                <p className="text-blue-700 font-medium text-sm">{file.name}</p>
                <p className="text-blue-400 text-xs">
                {(file.size / 1024).toFixed(1)} KB
                </p>
            </div>
            <button
                onClick={() => setFile(null)}
                className="text-red-400 hover:text-red-600 text-sm"
                >
                Remove
            </button>
            </div>
        )}

        {error && (
            <div className="mt-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
            </div>
        )}
        <button
        onClick={handleSubmit}
        disabled={loading || !file}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Analyzing Resume...
                </span>
                ) : (
                    "Analyze Resume"
                )}
                </button>
                {loading && (
                    <p className="text-center text-gray-400 text-sm mt-3">
                        AI is analyzing your resume — this may take 10-15 seconds
                    </p>
                )}
                </div>
                <div className="grid grid-cols-3 gap-4 mt-8">
                    {[
                        { title: "ATS Score", desc: "Get scored out of 100" },
                        { title: "AI Feedback", desc: "Smart suggestions" },
                        { title: "Skills Gap", desc: "Missing skills analysis" },
                    ].map((item, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm">
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <p className="font-medium text-gray-700 text-sm">{item.title}</p>
                        <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
    );
};

export default Dashboard;