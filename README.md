# ResumeIQ — AI Powered Resume Grader

![ResumeIQ](https://img.shields.io/badge/ResumeIQ-AI%20Powered-blue)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)
![Deployed](https://img.shields.io/badge/Deployed-Netlify%20%26%20Render-brightgreen)

## 🚀 Live Demo
**[https://creative-pithivier-776097.netlify.app](https://creative-pithivier-776097.netlify.app)**

---

## 📌 About The Project

ResumeIQ is an AI-powered resume grader that helps students and job seekers improve their resumes. Upload your resume and get instant ATS score, strengths, weaknesses, missing skills, and improvement suggestions — all powered by Google Gemini AI.

### Problem It Solves
- Most resumes get rejected by ATS systems before humans even see them
- Students don't know what is wrong with their resume
- ResumeIQ gives instant AI feedback to improve chances of getting hired

---

## ✨ Features

- ✅ User Signup and Login
- ✅ JWT Authentication
- ✅ Resume Upload (PDF and DOCX supported)
- ✅ AI Powered Resume Analysis
- ✅ ATS Score out of 100 with visual chart
- ✅ Resume Strengths Analysis
- ✅ Resume Weaknesses Analysis
- ✅ Missing Skills Detection
- ✅ Improvement Suggestions
- ✅ Best Matching Job Roles
- ✅ Resume History Dashboard
- ✅ Responsive UI for all devices

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI Components and Pages |
| Tailwind CSS | Styling |
| Axios | API Calls to Backend |
| React Router DOM | Page Navigation |
| Recharts | ATS Score Chart |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime Environment |
| Express.js | REST API Framework |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JWT | Secure Authentication |
| Multer | File Upload Handling |
| pdfjs-dist | PDF Text Extraction |
| mammoth | DOCX Text Extraction |
| bcryptjs | Password Hashing |

### AI
| Technology | Purpose |
|---|---|
| Google Gemini API | Resume Analysis |
| Prompt Engineering | Structured JSON Output |

### Deployment
| Platform | Purpose |
|---|---|
| Render | Backend Hosting |
| Netlify | Frontend Hosting |
| MongoDB Atlas | Cloud Database |

---

## 🏗️ How It Works

```
User uploads resume (PDF or DOCX)
            ↓
React Frontend sends file via Axios
            ↓
Express.js Backend receives file (Multer)
            ↓
Text extracted from file (pdfjs-dist / mammoth)
            ↓
Extracted text sent to Google Gemini AI
            ↓
Gemini AI returns structured JSON analysis
            ↓
Analysis saved to MongoDB Atlas
            ↓
Results displayed to user with charts
```

---

## 📁 Folder Structure

```
resumeiq/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Signup, Login logic
│   │   └── resumeController.js    # Upload and AI analysis logic
│   ├── models/
│   │   ├── User.js                # User database schema
│   │   └── Resume.js              # Resume database schema
│   ├── routes/
│   │   ├── authRoutes.js          # Auth API routes
│   │   └── resumeRoutes.js        # Resume API routes
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification
│   ├── aiService.js               # Gemini AI integration
│   ├── server.js                  # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── PrivateRoute.jsx
    │   │   └── LoadingSpinner.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Results.jsx
    │   │   └── History.jsx
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── utils/
    │   │   └── axios.js
    │   └── App.js
    └── package.json
```

---

## 🔑 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create new account |
| POST | `/api/auth/login` | Login to account |

### Resume Routes (Protected)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/resume/upload` | Upload and analyze resume |
| GET | `/api/resume/history` | Get all resume analyses |
| GET | `/api/resume/:id` | Get single resume analysis |

---

## 🤖 AI Analysis Response

```json
{
  "atsScore": 72,
  "strengths": [
    "Good project section with relevant technologies",
    "Strong foundation in Computer Science concepts"
  ],
  "weaknesses": [
    "No measurable achievements in projects",
    "Missing professional summary"
  ],
  "missingSkills": [
    "Docker",
    "AWS",
    "System Design",
    "CI/CD"
  ],
  "suggestions": [
    "Add numbers and metrics to your projects",
    "Write a 2-line professional summary at the top",
    "Add GitHub links to all projects"
  ],
  "matchedRoles": [
    "Frontend Developer",
    "Full Stack Developer",
    "React Developer"
  ]
}
```

---

## 🚀 Run Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)
- Google Gemini API key (free)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/thanmayeduggiralapati/resumeiq.git
cd resumeiq/backend
npm install
```

Create a `.env` file in the `backend` folder:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

```bash
node server.js
```

### Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

Open `http://localhost:3000` in your browser.

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Netlify | https://creative-pithivier-776097.netlify.app |
| Backend | Render | https://resumeiq-c6d3.onrender.com |
| Database | MongoDB Atlas | Cloud hosted |

> **Note:** The backend is hosted on Render free tier. First request after inactivity may take 30-60 seconds to wake up.

---

## 👩‍💻 Developer

**Duggiralapati Thanmaye**
- 3rd Year B.Tech CSE — Neil Gogte Institute of Technology
- GitHub: [@thanmayeduggiralapati](https://github.com/thanmayeduggiralapati)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
