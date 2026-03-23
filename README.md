# CareerKit — AI Job Tracker

A full-stack web application to track job applications, store resume versions, and use AI to score how well you match a job description.

Built with Python (FastAPI) on the backend, React on the frontend, and PostgreSQL as the database. Features an AI Match tool powered by OpenAI GPT-4o.

## Features

- Add and track job applications
- Attach resume versions to each application
- Update status (Applied, Interview, Offer, Rejected)
- Search and filter applications
- AI Match — paste a job description and get a match score out of 100
- Delete applications you no longer want to track

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Axios |
| Backend | Python, FastAPI |
| Database | PostgreSQL, SQLAlchemy |
| AI | OpenAI GPT-4o |

## How to Run Locally

### 1. Clone the repo
\`\`\`bash
git clone https://github.com/Chynaadams1/ai-job-tracker.git
cd ai-job-tracker
\`\`\`

### 2. Set up the backend
\`\`\`bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
\`\`\`

### 3. Set up environment variables
\`\`\`bash
cp .env.example .env
\`\`\`
Fill in your values:
\`\`\`
DATABASE_URL=postgresql://your_username@localhost:5432/jobtracker
OPENAI_API_KEY=sk-...your key...
\`\`\`

### 4. Create the database
\`\`\`bash
psql postgres
CREATE DATABASE jobtracker;
\q
\`\`\`

### 5. Start the backend
\`\`\`bash
uvicorn app.main:app --reload
\`\`\`
Backend runs at http://localhost:8000
View the auto-generated API docs at http://localhost:8000/docs

### 6. Start the frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
Frontend runs at http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /jobs | Get all applications |
| POST | /jobs | Add new application |
| GET | /jobs/{id} | Get one application |
| PUT | /jobs/{id} | Update application |
| DELETE | /jobs/{id} | Delete application |
| POST | /jobs/{id}/match | AI match score |

## How the AI Match Works

Click the AI button on any job row, paste the job description into the text box, and click Analyze Match. OpenAI GPT-4o reads your skills against the job description and returns a match score from 0 to 100, a list of your strengths, any gaps to address, and one tip for your application.

Requires an OpenAI API key with available credits.

## What I Learned Building This

- How to build a REST API from scratch using FastAPI
- How frontend and backend communicate using HTTP requests
- How to store and retrieve data using PostgreSQL and SQLAlchemy
- How CORS works and why different ports require configuration
- How to integrate OpenAI into a real application
- Full stack project structure and separation of concerns

## Author

Chyna Adams
- GitHub: https://github.com/Chynaadams1
- LinkedIn: https://linkedin.com/in/chynaadams
