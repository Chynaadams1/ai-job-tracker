# CareerKit — AI Job Tracker

I built this because I needed it.

I'll be graduating Computer Science May 0f 2026. Which I'm sure everyone knows I've been  actively applying for jobs. It's easy to lose track of everything such as what I applied to, what version of my resume I sent, and whether I ever heard back. Spreadsheets were easy in the beginning but alot of manual work. I personally didn't have time for. So I built something better.

CareerKit is a full-stack job tracking platform with an AI resume matcher and a data analytics engine that actually coaches you on your job search. It is the tool I wish existed when I started applying.

---

## What It Does

### Track Your Applications
Add every job you apply to. Update the status as things move forward. Attach notes, salary info, and the resume version you submitted. Never lose track of where you stand with a company again.

### AI Resume Matcher
Paste a job description into any application and GPT-4o will tell you honestly how well your resume matches it. You get a score out of 100, the specific skills that work in your favor, the gaps you need to address, and one actionable tip for that application. It is like having a career coach review every single job before you apply.

### Job Search Analytics
This is the part I am most proud of. The analytics engine uses pandas to analyze everything in your tracker and surfaces real insights — your response rate, how many applications you send each week, which companies you apply to most, and where your applications are getting stuck. Then it passes all of that to GPT-4o and generates a career coaching report written specifically for you based on your actual numbers. Not generic advice. Your advice.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React, Vite, JavaScript, Axios      |
| Backend    | Python, FastAPI, SQLAlchemy         |
| Database   | PostgreSQL                          |
| AI         | OpenAI GPT-4o                       |
| Analytics  | pandas, NumPy                       |

---

## Project Structure

```
ai-job-tracker/
├── app/
│   ├── services/
│   │   ├── analysis.py       # pandas statistical engine
│   │   └── ai_service.py     # GPT-4o career coaching
│   ├── main.py               # FastAPI entry point
│   ├── models.py             # Database models
│   ├── routes.py             # All API endpoints
│   └── database.py           # Database connection
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Analytics.jsx
│   │   ├── components/
│   │   │   ├── JobTable.jsx
│   │   │   └── AddJobModal.jsx
│   │   └── App.jsx
│   └── package.json
└── README.md
```

---

## How to Run It Locally

### 1. Clone the repo
```bash
git clone https://github.com/Chynaadams1/ai-job-tracker.git
cd ai-job-tracker
```

### 2. Set up the backend
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Add your environment variables
```bash
cp .env.example .env
```

Open the .env file and fill in:
```
DATABASE_URL=postgresql://your_username@localhost:5432/jobtracker
OPENAI_API_KEY=sk-...your key...
```

### 4. Create the database
```bash
psql postgres
CREATE DATABASE jobtracker;
\q
```

### 5. Start the backend
```bash
uvicorn app.main:app --reload
```

Runs at http://localhost:8000
Auto-generated API docs at http://localhost:8000/docs

### 6. Start the frontend
```bash
cd frontend
npm install
npm run dev
```

Runs at http://localhost:5173

---

## API Endpoints

| Method | Endpoint              | Description                         |
|--------|-----------------------|-------------------------------------|
| GET    | /jobs                 | Get all applications                |
| POST   | /jobs                 | Add new application                 |
| GET    | /jobs/{id}            | Get one application                 |
| PUT    | /jobs/{id}            | Update application                  |
| DELETE | /jobs/{id}            | Delete application                  |
| POST   | /jobs/{id}/match      | Run AI resume match analysis        |
| GET    | /analytics/summary    | Get statistical analytics summary   |
| POST   | /analytics/insight    | Generate GPT-4o coaching report     |

---

## How the AI Match Works

Click the AI button on any job row, paste the job description, and click Analyze Match. GPT-4o reads your skills against the job description and returns:

- A match score from 0 to 100
- A list of your strengths for that specific role
- Gaps you need to address before applying
- One actionable tip for that application

Requires an OpenAI API key with available credits.

---

## How the Analytics Engine Works

1. All job applications are pulled from PostgreSQL
2. pandas loads the records into a DataFrame
3. Statistical analysis runs across the full dataset — response rate, weekly application volume, status breakdown, top companies, and average AI match score
4. Results are returned instantly via the /analytics/summary endpoint
5. On demand, the /analytics/insight endpoint passes the full analysis to GPT-4o which generates a personalized 3-paragraph career coaching report based on your real numbers

---

## What I Learned

I came into this project knowing basics of Python and React at a surface level. I came out of it understanding how full-stack systems actually work. How a button click on a React frontend turns into a database write on a PostgreSQL backend, how CORS works and why it matters, how to integrate a third-party AI API securely, and how to use pandas to turn raw data into something meaningful.

The analytics feature was the biggest stretch. I had never used pandas in a production context before. Building something that pulls real data, runs statistical analysis, and feeds it into an AI model to generate personalized advice. Then using and  watching it actually work was the moment this project was something genuinely use every day. To keep me updated on new Jobs/ Future jobs. 

Building this also taught me something I did not expect. Which was the best projects come from real problems. I was not building for a grade or a tutorial. I was building something I actually needed. A project I could learn from and utilize. With that being said every decision had a reason behind it. I'm still a beginner and have alot to learn. 

---

## Author

Chyna Adams

Computer Science senior at the University of Maryland Eastern Shore, graduating May 2026. I build things that solve real problems — this project started as one of them.

- GitHub: https://github.com/Chynaadams1
- LinkedIn: https://linkedin.com/in/chynaadams
- Email: adamschyna1@gmail.com

