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