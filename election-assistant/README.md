# 🗳️ VoterMitra — Election Process Assistant

> **AI-powered civic platform helping Indian citizens understand and navigate the election process**

[![Made with FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Made with React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwindcss)](https://tailwindcss.com)

---

## 🏆 Hackathon Project — Problem Statement
> *"Create an assistant that helps users understand the election process, timelines, and steps in an interactive and easy-to-follow way."*

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 AI Chatbot | Intelligent election guide powered by OpenAI (with offline fallback) |
| 📋 Registration Guide | Step-by-step voter registration wizard |
| ✅ Eligibility Checker | Smart form to check if you can vote |
| 📅 Election Timeline | Interactive timeline of all election events |
| 🗺️ Polling Booth Finder | Search and locate polling booths |
| ❓ FAQ Smart Search | Searchable, categorized FAQ with helpful voting |
| 📣 Complaint Portal | Submit & track election complaints |
| 🏛️ Candidate Comparison | Side-by-side candidate comparison dashboard |
| 🎮 Election Quiz | Interactive knowledge quiz with civic scoring |
| 🌐 Multilingual | English + Hindi with instant switching |
| 🌙 Dark/Light Mode | Full dark mode support |
| 🔊 Voice Input | Speech-to-text for chatbot |
| 📊 Admin Dashboard | Full admin panel with analytics |
| 🔐 JWT Auth | Secure role-based authentication |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite 5** — Fast builds, HMR
- **Tailwind CSS 3** — Utility-first styling
- **Framer Motion** — Smooth animations
- **Zustand** — Lightweight state management
- **React Router v6** — Client-side routing
- **Recharts** — Data visualizations
- **React Hot Toast** — Notifications

### Backend
- **FastAPI** — High-performance Python API
- **SQLAlchemy 2.0** — ORM with SQLite/PostgreSQL
- **Pydantic v2** — Data validation
- **JWT (python-jose)** — Authentication
- **Passlib/bcrypt** — Password hashing
- **httpx** — Async HTTP for AI API calls

---

## 📁 Project Structure

```
election-assistant/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Navbar, Footer, Layout
│   │   │   └── pages/        # All 12 page components
│   │   ├── context/          # Zustand stores (auth, theme)
│   │   └── utils/            # API client
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/
    ├── main.py               # FastAPI app + routes
    ├── database.py           # SQLAlchemy setup
    ├── models.py             # DB models
    ├── schemas.py            # Pydantic schemas
    ├── auth_utils.py         # JWT auth helpers
    ├── seed_data.py          # Demo data seeder
    ├── routers/
    │   ├── auth.py           # Login/Register
    │   ├── chat.py           # AI chatbot
    │   ├── election.py       # Events, booths, candidates
    │   ├── faq.py            # FAQ CRUD
    │   ├── complaint.py      # Complaint system
    │   ├── admin.py          # Admin panel APIs
    │   └── user.py           # Profile, quiz, scores
    ├── middleware/
    │   └── rate_limit.py
    ├── requirements.txt
    └── .env.example
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### 1. Clone & Setup

```bash
git clone https://github.com/yourname/election-assistant.git
cd election-assistant
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and optionally add your OPENAI_API_KEY

# Run the server
uvicorn main:app --reload --port 8000
```

> 🎉 Backend runs at http://localhost:8000
> 📖 API docs at http://localhost:8000/api/docs

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

> 🎉 Frontend runs at http://localhost:5173

### 4. Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@electionassistant.in | Admin@1234 |
| Citizen | (Register a new account) | — |

---

## 🔑 Environment Variables

```env
# backend/.env
DATABASE_URL=sqlite:///./election_assistant.db
SECRET_KEY=your-super-secret-key-change-this
OPENAI_API_KEY=sk-...          # Optional - AI chatbot
OPENAI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-3.5-turbo
FRONTEND_URL=http://localhost:5173
```

> **Note:** The app works fully without an OpenAI key — the chatbot uses intelligent rule-based fallback responses about Indian elections.

---

## 📱 Pages & Routes

| Route | Page | Auth Required |
|-------|------|---------------|
| `/` | Landing Page | No |
| `/about` | About Election Process | No |
| `/registration` | Voter Registration Guide | No |
| `/eligibility` | Eligibility Checker | No |
| `/timeline` | Election Timeline | No |
| `/polling-booth` | Polling Booth Finder | No |
| `/chatbot` | AI Chatbot | No |
| `/faq` | FAQ + Smart Search | No |
| `/candidates` | Candidate Comparison | No |
| `/quiz` | Election Knowledge Quiz | No |
| `/complaint` | Complaint Portal | ✅ |
| `/profile` | User Dashboard | ✅ |
| `/admin` | Admin Panel | ✅ (Admin) |

---

## 🌐 API Endpoints

```
POST   /api/auth/register         Register new user
POST   /api/auth/login            Login

GET    /api/chat/message          Send chat message
GET    /api/chat/history/:id      Get chat history

GET    /api/election/events       Election events timeline
GET    /api/election/polling-booths Search booths
GET    /api/election/candidates   List candidates
POST   /api/election/check-eligibility  Check eligibility
GET    /api/election/registration-steps  Registration steps
GET    /api/election/stats        Election statistics

GET    /api/faq/                  List FAQs
GET    /api/faq/categories        FAQ categories
POST   /api/faq/:id/helpful       Mark FAQ helpful

POST   /api/complaint/            Submit complaint
GET    /api/complaint/my          My complaints
GET    /api/complaint/track/:ref  Track by reference

GET    /api/user/profile          User profile
PUT    /api/user/profile          Update profile
GET    /api/user/quiz/questions   Quiz questions
POST   /api/user/quiz/submit      Submit quiz
GET    /api/user/readiness-score  Election readiness

GET    /api/admin/stats           Admin statistics
GET    /api/admin/complaints      All complaints
PUT    /api/admin/complaints/:id  Update complaint
POST   /api/admin/notices         Post notice
POST   /api/admin/events          Create event
GET    /api/admin/users           User list
```

---

## 🚢 Deployment

### Backend (Railway / Render / EC2)

```bash
# Set environment variables on your platform
# DATABASE_URL, SECRET_KEY, OPENAI_API_KEY

# For PostgreSQL, update DATABASE_URL:
# DATABASE_URL=postgresql://user:password@host:5432/dbname

pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend (Vercel / Netlify)

```bash
cd frontend
npm run build
# Deploy the dist/ folder
# Set VITE_API_URL env var if API is not proxied
```

---

## 🧪 Sample Data Included

The app auto-seeds on first run with:
- ✅ 12 FAQs across all categories  
- ✅ 8 upcoming election events  
- ✅ 8 polling booths (Delhi, Bihar, UP)  
- ✅ 6 sample candidates  
- ✅ 4 official notices  
- ✅ 12 quiz questions  
- ✅ 1 admin account  

---

## 🏅 Civic Score System

Users earn civic points through:
- 🗳️ Voter registration: 40 pts
- 🪪 Adding Voter ID: 20 pts
- 🎮 Completing quiz: up to 50 pts
- 💬 Using AI chatbot: 1 pt/message
- 📋 Completing profile: 10 pts

---

## 🔒 Security Features

- JWT tokens (7-day expiry)
- bcrypt password hashing
- Rate limiting middleware
- Role-based access control
- Input validation via Pydantic

---

## 📄 License

MIT License — Free for educational and civic use.

---

## 🙏 Acknowledgements

- Election Commission of India — [eci.gov.in](https://eci.gov.in)
- National Voter Service Portal — [nvsp.in](https://nvsp.in)
- Voter Helpline: **1950**

---

*Built with ❤️ for India's democracy. Every vote counts.*
