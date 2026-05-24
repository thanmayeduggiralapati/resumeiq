import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import API from "../utils/axios";

const Results = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
    const fetchResume = async () => {
        try {
            const res = await API.get(`/resume/${id}`);
            setResume(res.data.resume);
        } catch (err) {
            setError("Could not load results. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    fetchResume();
}, [id]);

const getScoreColor = (score) => {
    if (score >= 75) return "#22c55e";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
};

const getScoreLabel = (score) => {
    if (score >= 75) return "Good";
    if (score >= 50) return "Average";
    return "Needs Work";
};

if (loading) {
    return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading your results...</p>
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

const chartData = [
    {
        name: "ATS Score",
        value: resume.atsScore,
        fill: getScoreColor(resume.atsScore),
    },
];

return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Resume Analysis</h1>
                    <p className="text-gray-500 text-sm mt-1">{resume.originalFileName}</p>
                </div>
                <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                    Analyze Another
                </button>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-8 mb-6 flex flex-col md:flex-row items-center gap-8">
                <div className="w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="100%"
                        data={chartData}
                        startAngle={90}
                        endAngle={-270}
                        >
                            <RadialBar dataKey="value" cornerRadius={10} background />
                            </RadialBarChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-center md:text-left">
                    <p className="text-gray-500 text-sm">ATS Score</p>
                    <p
                    className="text-6xl font-bold mt-1"
                    style={{ color: getScoreColor(resume.atsScore) }}
                    >
                        {resume.atsScore}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">out of 100</p>
                    <span
                    className="inline-block mt-3 px-4 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: getScoreColor(resume.atsScore) }}
                    >
                        {getScoreLabel(resume.atsScore)}
                    </span>
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        ✅ Strengths
                    </h2>
                    <ul className="space-y-2">
                        {resume.strengths.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="text-green-500 mt-0.5">•</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        ⚠️ Weaknesses
                    </h2>
                    <ul className="space-y-2">
                        {resume.weaknesses.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="text-red-400 mt-0.5">•</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    🔧 Missing Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                    {resume.missingSkills.map((skill, i) => (
                    <span
                        key={i}
                        className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium"
                    >
                        {skill}
                    </span>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    💡 Improvement Suggestions
                </h2>
                <ul className="space-y-3">
                    {resume.suggestions.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {i + 1}
                        </span>
                            {item}
                    </li>
                    ))}
                </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    🎯 Best Matching Job Roles
                </h2>
                <div className="flex flex-wrap gap-2">
                    {resume.matchedRoles.map((role, i) => (
                    <span
                        key={i}
                        className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium"
                    >
                        {role}
                    </span>
                ))}
                </div>
            </div>
            <div className="flex gap-4 mt-8">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
                >
                    Analyze Another Resume
                </button>
                <button
                    onClick={() => navigate("/history")}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
                >
                    View History
                </button>
            </div>
        </div>
    </div>
);
};

export default Results;
