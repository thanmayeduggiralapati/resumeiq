import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

const History = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await API.get("/resume/history");
                setResumes(res.data.resumes);
            } catch (err) {
                setError("Could not load history. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);
    const getScoreColor = (score) => {
        if (score >= 75) return "text-green-500";
        if (score >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    const getScoreBg = (score) => {
        if (score >= 75) return "bg-green-50";
        if (score >= 50) return "bg-yellow-50";
        return "bg-red-50";
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };
    if (loading) {
        return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading history...</p>
            </div>
        </div>
    );
    }

    if (error) {
        return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                    Go Back
                </button>
            </div>
        </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Resume History</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {resumes.length} resume{resumes.length !== 1 ? "s" : ""} analyzed
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                        Upload New
                    </button>
                </div>
                {resumes.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                        <div className="text-5xl mb-4">📄</div>
                        <h2 className="text-xl font-semibold text-gray-700">
                            No resumes yet
                        </h2>
                        <p className="text-gray-400 mt-2">
                            Upload your first resume to get started
                        </p>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Upload Resume
                        </button>
                    </div>
                ) : (
                <div className="space-y-4">
                    {resumes.map((resume) => (
                        <div
                            key={resume._id}
                            className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-lg transition cursor-pointer"
                            onClick={() => navigate(`/results/${resume._id}`)}
                        >
                        <div className="flex items-center gap-4">
                            <div className="text-3xl">📄</div>
                            <div>
                                <p className="font-medium text-gray-800">
                                    {resume.originalFileName}
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {formatDate(resume.createdAt)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`${getScoreBg(resume.atsScore)} px-4 py-2 rounded-xl text-center`}>
                                <p className="text-xs text-gray-500">ATS Score</p>
                                <p className={`text-2xl font-bold ${getScoreColor(resume.atsScore)}`}>
                                    {resume.atsScore}
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/results/${resume._id}`);
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                            >
                                View Results
                            </button>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
        </div>
    );
};

export default History;
