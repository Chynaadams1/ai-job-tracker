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

## What I Learned

I came into this project knowing Python and React at a surface level. I came out of it understanding how full-stack systems actually work — how a button click on a React frontend turns into a database write on a PostgreSQL backend, how CORS works and why it matters, how to integrate a third-party AI API securely, and how to use pandas to turn raw data into something meaningful.

The analytics feature was the biggest stretch. I had never used pandas in a production context before. Building something that pulls real data, runs statistical analysis, and feeds it into an AI model to generate personalized advice — and then watching it actually work — was the moment this project went from a portfolio piece to something I genuinely use.

---

## Author

**Chyna Adams**

Computer Science senior at the University of Maryland Eastern Shore, graduating May 2026. I build things that solve real problems — this project started as one of them.

- GitHub: https://github.com/Chynaadams1
- LinkedIn: https://linkedin.com/in/chynaadams
- Email: adamschyna1@gmail.com
