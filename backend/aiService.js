const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeResume = async (resumeText) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a professional ATS resume evaluator for college students.
    Analyze the resume below and return ONLY a JSON object with this exact structure:
    {
        "atsScore": <number 0-100>,
        "strengths": [<3-5 strengths>],
        "weaknesses": [<3-5 weaknesses>],
        "missingSkills": [<3-6 missing skills>],
        "suggestions": [<4-6 improvements>],
        "matchedRoles": [<3-5 job roles>]
    }
    
    Rules:
    - Only evaluate technical skills, projects, experience, resume quality
    - Do not consider college name, gender, age, or nationality
    - Do not invent information not in the resume
    - Return ONLY the JSON. No markdown. No backticks. No extra text.

    Resume:
    ${resumeText}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleaned = responseText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

    const analysis = JSON.parse(cleaned);

    if (
        analysis.atsScore === undefined ||
        !analysis.strengths ||
        !analysis.weaknesses ||
        !analysis.missingSkills ||
        !analysis.suggestions ||
        !analysis.matchedRoles
    )
    {
        throw new Error("Invalid AI response structure");
    }
    return analysis;

};

module.exports = { analyzeResume };