from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import JobApplication
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter()

# job application submittion
class JobCreate(BaseModel):
    company: str
    job_title: str
    status: str = "applied"
    job_url: Optional[str] = None
    salary: Optional[str] = None
    notes: Optional[str] = None
    resume_submitted: Optional[str] = None

# Job application return 
class JobResponse(BaseModel):
    id: int
    company: str
    job_title: str
    status: str
    job_url: Optional[str]
    salary: Optional[str]
    notes: Optional[str]
    resume_submitted: Optional[str]
    date_applied: datetime
    created_at: datetime

    class Config:
        from_attributes = True

# GET all jobs 
@router.get("/jobs", response_model=list[JobResponse])
def get_jobs(db: Session = Depends(get_db)):
    return db.query(JobApplication).all()

# Get one job 
@router.get("/jobs/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(JobApplication).filter(JobApplication.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

# ADD'S job
@router.post("/jobs", response_model=JobResponse)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    new_job = JobApplication(**job.dict())
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

# Updating Job status 
@router.put("/jobs/{job_id}", response_model=JobResponse)
def update_job(job_id: int, job: JobCreate, db: Session = Depends(get_db)):
    existing = db.query(JobApplication).filter(JobApplication.id == job_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Job not found")
    for key, value in job.dict().items():
        setattr(existing, key, value)
    db.commit()
    db.refresh(existing)
    return existing

# Delete Job 
@router.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(JobApplication).filter(JobApplication.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"message": "Job deleted successfully"}
from openai import OpenAI
import os

@router.post("/jobs/{job_id}/match")
def ai_match(job_id: int, payload: dict, db: Session = Depends(get_db)):
    job = db.query(JobApplication).filter(JobApplication.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job_description = payload.get("job_description", "")
    if not job_description:
        raise HTTPException(status_code=400, detail="Job description is required")

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    prompt = f"""
You are a career coach. Analyze how well this candidate matches the job.

Job Title: {job.job_title}
Company: {job.company}
Job Description: {job_description}

Candidate Skills: Python, FastAPI, Django, React, PostgreSQL, OpenAI API, 
GitHub Webhooks, REST APIs, Docker, AWS, Git, CI/CD, Agile

Return a JSON object with:
- score: number 1-100
- verdict: "Strong Match" | "Good Match" | "Partial Match" | "Weak Match"
- strengths: list of 3 matching skills/experiences
- gaps: list of 2-3 things to improve or highlight
- tip: one sentence advice for the application
"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        max_tokens=500,
    )

    import json
    result = json.loads(response.choices[0].message.content)
    return result