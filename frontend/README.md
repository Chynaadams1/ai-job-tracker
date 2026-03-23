# CareerKit — AI Job Tracker

A full-stack web application that helps you track your job applications, store resume versions, and use AI to score how well you match a job description.

Built with **Python (FastAPI)** on the backend, **React** on the frontend, and **PostgreSQL** as the database. Features an AI Match tool powered by **OpenAI GPT-4o**.

---

## 🖥️ What It Looks Like

The dashboard features a pink Hello Kitty themed UI with:
- A sidebar for navigation
- Stats cards showing your application totals
- A table with all your job applications
- An AI Match button on every row

---

##  Features

- **Add Job Applications** — track company, role, salary, status, and notes
- **Resume Tracking** — attach which resume version you submitted to each job
- **Status Updates** — update application status (Applied → Interview → Offer → Rejected) directly from the table
- **Search & Filter** — search by company or role, filter by status
- **AI Match** — paste a job description and GPT-4o scores how well your skills match (0-100%)
- **Delete Applications** — remove jobs you no longer want to track

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Axios |
| Backend | Python, FastAPI |
| Database | PostgreSQL, SQLAlchemy |
| AI | OpenAI GPT-4o |
| Styling | Custom CSS (inline styles) |

---

## 📁 Project Structure

```
ai-job-tracker/
│
├── app/                        # Backend (FastAPI)
│   ├── main.py                 # Starts the FastAPI server
│   ├── models.py               # Database table structure
│   ├── routes.py               # All API endpoints
│   └── database.py             # Database connection
│
├── frontend/                   # Frontend (React)
│   └── src/
│       ├── api/
│       │   └── jobs.js         # Connects frontend to backend
│       ├── components/
│       │   ├── JobTable.jsx    # Main table + AI Match modal
│       │   └── AddJobModal.jsx # Add new job form
│       ├── pages/
│       │   └── Dashboard.jsx  # Main dashboard page
│       └── App.jsx             # Root component
│
├── .env.example                # Environment variable template
├── requirements.txt            # Python dependencies
└── README.md
```

---

##  How to Run This Project Locally

### What You Need First
- Python 3.10+
- Node.js 18+
- PostgreSQL
- An OpenAI API key (get one at platform.openai.com)

---

### Step 1 — Clone the repo

```bash
git clone https://github.com/Chynaadams1/ai-job-tracker.git
cd ai-job-tracker
```

---

### Step 2 — Set up the backend

```bash
# Create a virtual environment (like a private workspace for Python packages)
python3 -m venv venv

# Activate it
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate     # Windows

# Install all required packages
pip install -r requirements.txt
```

---

### Step 3 — Set up your environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```
DATABASE_URL=postgresql://your_username@localhost:5432/jobtracker
OPENAI_API_KEY=sk-...your key here...
```

> `your_username` is your Mac/computer username. On Mac you can find it by running `whoami` in the terminal.

---

### Step 4 — Create the database

```bash
# Open PostgreSQL
psql postgres

# Create the database
CREATE DATABASE jobtracker;

# Exit
\q
```

---

### Step 5 — Start the backend server

```bash
uvicorn app.main:app --reload
```

The backend will run at **http://localhost:8000**

You can view the auto-generated API docs at **http://localhost:8000/docs**

---

### Step 6 — Set up and start the frontend

Open a new terminal tab:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at **http://localhost:5173**

---

### Step 7 — Open the app

Go to **http://localhost:5173** in your browser and you should see the pink Hello Kitty dashboard! 

---

## API Endpoints

| Method | Endpoint | What it does |
|---|---|---|
| GET | `/jobs` | Get all job applications |
| POST | `/jobs` | Add a new job application |
| GET | `/jobs/{id}` | Get one job application |
| PUT | `/jobs/{id}` | Update a job application |
| DELETE | `/jobs/{id}` | Delete a job application |
| POST | `/jobs/{id}/match` | AI match score for a job |

---

## How the AI Match Works

1. Click the **✨ AI** button on any job row
2. Paste the job description into the text box
3. Click **Analyze Match**
4. OpenAI GPT-4o reads your skills and the job description
5. Returns a match score (0-100%), strengths, gaps, and a tip

> Requires an OpenAI API key with available credits

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENAI_API_KEY` | Your OpenAI secret key |

> Never share your `.env` file or push it to GitHub. It's already listed in `.gitignore` for safety.

---

## What I Learned by building this project 

- How to build a REST API from scratch using FastAPI
- How frontend and backend communicate using HTTP requests
- How to store and retrieve data using PostgreSQL and SQLAlchemy
- How CORS works and why ports matter (5173 vs 8000)
- How to integrate OpenAI into a real application
- Full stack project structure and separation of concerns

---

## 👩🏾‍💻 Author

**Chyna Adams**
- GitHub: [@Chynaadams1](https://github.com/Chynaadams1)
- LinkedIn: [linkedin.com/in/chynaadams](https://linkedin.com/in/chynaadams)